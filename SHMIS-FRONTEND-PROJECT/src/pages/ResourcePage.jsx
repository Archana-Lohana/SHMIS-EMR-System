import { useMemo, useState } from "react";
import { mineAsPatient } from "../auth";
import { ArrowDown, ArrowUp, Download, Plus, Search } from "lucide-react";
import {
  createPatientAccount,
  createDoctorAccount,
  deleteItem,
  errorText,
  useList
} from "../api";
import { downloadCSV, number } from "../utils";
import Drawer from "../components/Drawer";
import RecordForm from "../components/RecordForm";
import RecordView from "../components/RecordView";
import StatusBadge from "../components/StatusBadge";


const PAGE_SIZE = 12;

export default function ResourcePage({ config, toast, user, writable = true }) {
  const apiEndpoint =
  user?.role === "patient" && config.endpoint !== "/patients"
    ? `${config.endpoint}/my`
    : config.endpoint;

const { rows: allRows, loading, error, reload } = useList(apiEndpoint);
  // Patients only see their own records.
  const rows = useMemo(() => (user?.role === "patient" ? mineAsPatient(user, allRows) : allRows), [allRows, user]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState(config.defaultSort);
  const [page, setPage] = useState(1);
  const [panel, setPanel] = useState(null); // { mode: "view" | "form", row }
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
const [loginUsername, setLoginUsername] = useState("");
const [loginPassword, setLoginPassword] = useState("");
const [creatingLogin, setCreatingLogin] = useState(false);

  const visible = useMemo(() => {
    const t = q.trim().toLowerCase();
    let list = rows.filter((r) => (!t || config.search(r).toLowerCase().includes(t)) && (!status || r[config.statusField] === status));
    if (sort) {
      const col = config.columns[sort.col];
      list = [...list].sort((a, b) => {
        const x = col.value(a), y = col.value(b);
        const c = typeof x === "number" && typeof y === "number" ? x - y : String(x ?? "").localeCompare(String(y ?? ""), undefined, { numeric: true });
        return sort.dir === "asc" ? c : -c;
      });
    }
    return list;
  }, [rows, q, status, sort, config]);

  const pages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const slice = visible.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const from = visible.length ? (current - 1) * PAGE_SIZE + 1 : 0;

  function clickHeader(i) {
    setSort((s) => (s?.col === i ? { col: i, dir: s.dir === "asc" ? "desc" : "asc" } : { col: i, dir: "asc" }));
  }

  function closePanel() {
    setPanel(null);
    setConfirmDelete(false);
  }

  async function remove() {
    setDeleting(true);
    try {
      await deleteItem(config.endpoint, panel.row._id);
      toast(`The ${config.singular} was deleted.`);
      closePanel();
      reload();
    } catch (e) {
      toast(errorText(e), "bad");
    } finally {
      setDeleting(false);
    }
  }async function handleCreateLogin(e) {
  e.preventDefault();

  if (!panel?.row?._id) return;

  setCreatingLogin(true);

  try {
    if (config.endpoint === "/doctors") {
      await createDoctorAccount({
        doctorId: panel.row._id,
        username: loginUsername,
        password: loginPassword
      });

      toast("Doctor login account created successfully.");
    } else {
      await createPatientAccount({
        patientId: panel.row._id,
        username: loginUsername,
        password: loginPassword
      });

      toast("Patient login account created successfully.");
    }

    setShowLoginForm(false);
    setLoginUsername("");
    setLoginPassword("");
  } catch (e) {
    toast(errorText(e), "bad");
  } finally {
    setCreatingLogin(false);
  }
}


  function exportCSV() {
    downloadCSV(
      `shmis-${config.endpoint.slice(1)}-${new Date().toISOString().slice(0, 10)}.csv`,
      config.columns.map((c) => c.label),
      visible.map((r) => config.columns.map((c) => c.value(r)))
    );
  }

  const isPatient = config.endpoint === "/patients";
const isDoctor = config.endpoint === "/doctors";
  return (
    <>
      <div className="page-head">
        <div>
          <h1>{config.title}</h1>
          <p>{config.blurb}</p>
        </div>
        <div className="actions">
          <button className="btn" onClick={exportCSV} disabled={!visible.length}>
            <Download size={15} /> Export CSV
          </button>
          {writable && (
            <button className="btn primary" onClick={() => setPanel({ mode: "form", row: null })}>
              <Plus size={15} /> New {config.singular}
            </button>
          )}
        </div>
      </div>

      <div className="toolbar">
        <div className="search">
          <Search size={15} />
          <input
            placeholder={`Search ${config.title.toLowerCase()}…`}
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
          />
        </div>
        <select className="input" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filter by status">
          <option value="">All statuses</option>
          {config.statusOptions.map((s) => <option key={s}>{s}</option>)}
        </select>
        <span className="count">
          {loading ? "Loading…" : visible.length === rows.length ? `${number(rows.length)} in total` : `${number(visible.length)} of ${number(rows.length)}`}
        </span>
      </div>

      {error && (
        <div className="banner bad">
          {error} <button className="text-btn" onClick={reload}>Try again</button>
        </div>
      )}

      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              {config.columns.map((c, i) => (
                <th key={c.label} className={`${c.right ? "r" : ""}`} onClick={() => clickHeader(i)} aria-sort={sort?.col === i ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}>
                  <span>
                    {c.label}
                    {sort?.col === i && (sort.dir === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="skeleton">
                  {config.columns.map((c) => <td key={c.label}><i /></td>)}
                </tr>
              ))}
            {!loading && slice.map((r) => (
              <tr key={r._id} tabIndex={0} onClick={() => setPanel({ mode: "view", row: r })} onKeyDown={(e) => e.key === "Enter" && setPanel({ mode: "view", row: r })}>
                {config.columns.map((c) => (
                  <td key={c.label} className={`${c.mono ? "mono" : ""}${c.right ? " r" : ""}${c.narrow ? " narrow" : ""}`}>
                    {c.status ? <StatusBadge value={c.value(r)} /> : c.render ? c.render(r) : c.value(r) === "" || c.value(r) == null ? <span className="muted">—</span> : c.value(r)}
                  </td>
                ))}
              </tr>
            ))}
            {!loading && !error && slice.length === 0 && (
              <tr className="empty">
                <td colSpan={config.columns.length}>
                  {rows.length === 0 ? (
                    <>
                      <strong>No {config.title.toLowerCase()} yet.</strong>
                      {writable && <button className="text-btn" onClick={() => setPanel({ mode: "form", row: null })}>Add the first {config.singular}</button>}
                    </>
                  ) : (
                    <>Nothing matches your search{q && <> for “{q}”</>}.</>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {visible.length > PAGE_SIZE && (
        <div className="pager">
          <span>{from}–{Math.min(current * PAGE_SIZE, visible.length)} of {number(visible.length)}</span>
          <div>
            <button className="btn small" disabled={current === 1} onClick={() => setPage(current - 1)}>Previous</button>
            <span className="pageno">Page {current} of {pages}</span>
            <button className="btn small" disabled={current === pages} onClick={() => setPage(current + 1)}>Next</button>
          </div>
        </div>
      )}

      {panel?.mode === "view" && (
        <Drawer
          title={config.viewTitle(panel.row)}
          sub={config.viewSub(panel.row)}
          onClose={closePanel}
          footer={
            !writable ? null : confirmDelete ? (
              <div className="confirm">
                <span>Delete this {config.singular}? This can't be undone.</span>
                <button className="btn" onClick={() => setConfirmDelete(false)} disabled={deleting}>Keep it</button>
                <button className="btn danger" onClick={remove} disabled={deleting}>{deleting ? "Deleting…" : "Yes, delete"}</button>
              </div>
            ) : (
              <>
                <>
  {(isPatient || isDoctor) && user?.role === "admin" && (
    <button
      className="btn"
      onClick={() => setShowLoginForm(true)}
    >
      Create Login
    </button>
  )}

 {user?.role === "admin" && (
  <button
    className="text-btn danger"
    onClick={() => setConfirmDelete(true)}
  >
    Delete
  </button>
)}

{writable && (
  <button
    className="btn primary"
    onClick={() => setPanel({ mode: "form", row: panel.row })}
  >
    Edit
  </button>
)}
</>
              </>
            )
          }
        >
          <RecordView config={config} row={panel.row} isPatient={isPatient} />
          {showLoginForm && (isPatient || isDoctor) && user?.role === "admin" && (
  <form onSubmit={handleCreateLogin} className="form-grid">
    <h3>Create {isDoctor ? "Doctor" : "Patient"} Login</h3>
    <p>
      Create login credentials for {panel.row.name}.
    </p>

    <label>
      Username
      <input
        className="input"
        type="text"
        value={loginUsername}
        onChange={(e) => setLoginUsername(e.target.value)}
        placeholder="Enter username"
        required
      />
    </label>

    <label>
      Password
      <input
        className="input"
        type="password"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
        placeholder="Minimum 8 characters"
        minLength={8}
        required
      />
    </label>

    <button
      type="submit"
      className="btn primary"
      disabled={creatingLogin}
    >
      {creatingLogin ? "Creating..." : "Create Account"}
    </button>

    <button
      type="button"
      className="btn"
      onClick={() => setShowLoginForm(false)}
    >
      Cancel
    </button>
  </form>
)}
        </Drawer>
      )}

      {panel?.mode === "form" && (
        <Drawer title={panel.row ? `Edit ${config.singular}` : `New ${config.singular}`} sub={panel.row ? config.viewSub(panel.row) : null} onClose={closePanel}>
          <RecordForm
  config={config}
  row={panel.row}
  user={user}
            onCancel={closePanel}
            onSaved={(_, what) => {
              toast(`The ${config.singular} was ${what === "created" ? "added" : "updated"}.`);
              closePanel();
              reload();
            }}
          />
        </Drawer>
      )}
    </>
  );
}
