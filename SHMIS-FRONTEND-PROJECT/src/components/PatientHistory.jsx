import { useEffect, useState } from "react";
import { getList } from "../api";
import { fmtDate } from "../utils";
import StatusBadge from "./StatusBadge";

// Everything we know about one patient, pulled from the four clinical collections.
export default function PatientHistory({ patient }) {
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    Promise.all(["appointments", "clinical-records", "prescriptions", "lab-tests"].map((p) => getList(`/${p}`)))
      .then(([appts, records, rx, labs]) => {
        if (!alive) return;
        const mine = (rows) => rows.filter((r) => r.patient?._id === patient._id);
        setData({ appts: mine(appts), records: mine(records), rx: mine(rx), labs: mine(labs) });
      })
      .catch(() => alive && setFailed(true));
    return () => { alive = false; };
  }, [patient._id]);

  if (failed) return <p className="muted">Couldn't load this patient's history.</p>;
  if (!data) return <p className="muted">Loading history…</p>;

  const sections = [
    ["Appointments", data.appts, (a) => [`${fmtDate(a.appointmentDate)}, ${a.appointmentTime}`, `${a.doctor?.name ?? ""} — ${a.reason}`, a.status]],
    ["Clinical records", data.records, (r) => [fmtDate(r.visitDate), r.diagnosis, r.status]],
    ["Prescriptions", data.rx, (p) => [fmtDate(p.prescriptionDate), (p.medicines || []).map((m) => m.medicineName).join(", "), p.status]],
    ["Lab tests", data.labs, (t) => [fmtDate(t.testDate), `${t.testName}${t.result ? ` — ${t.result}` : ""}`, t.reportStatus]],
  ];

  return (
    <div className="history">
      <h3 className="form-heading">History</h3>
      {sections.map(([title, rows, fmt]) => (
        <div key={title} className="history-block">
          <h4>{title} <span>{rows.length}</span></h4>
          {rows.length === 0 ? (
            <p className="muted small">Nothing on file.</p>
          ) : (
            <ul>
              {rows.slice(0, 6).map((r) => {
                const [when, what, status] = fmt(r);
                return (
                  <li key={r._id}>
                    <span className="when">{when}</span>
                    <span className="what">{what}</span>
                    <StatusBadge value={status} />
                  </li>
                );
              })}
              {rows.length > 6 && <li className="muted small">…and {rows.length - 6} more</li>}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
