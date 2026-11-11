import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays, ClipboardList, Building2, FlaskConical, LayoutGrid, Layers, LogOut, Menu, Pill, Stethoscope, Users, X,
} from "lucide-react";
import { resources } from "./resources.jsx";
import { ROLES, canOpen, canWrite, clearSession, loadSession, saveSession } from "./auth";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ResourcePage from "./pages/ResourcePage";

const nav = [
  { group: null, items: [{ key: "", label: "Dashboard", icon: LayoutGrid }] },
  { group: "People", items: [{ key: "patients", icon: Users }, { key: "doctors", icon: Stethoscope }] },
  { group: "Facilities", items: [{ key: "hospitals", icon: Building2 }, { key: "departments", icon: Layers }] },
  {
    group: "Clinical",
    items: [
      { key: "appointments", icon: CalendarDays }, { key: "clinical-records", icon: ClipboardList },
      { key: "prescriptions", icon: Pill }, { key: "lab-tests", icon: FlaskConical },
    ],
  },
];

const useRoute = () => {
  const read = () => window.location.hash.replace(/^#\/?/, "");
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => setRoute(read());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return [route, (k) => { window.location.hash = `/${k}`; }];
};

export default function App() {
  const [session, setSession] = useState(loadSession);

  function signedIn(s) {
    saveSession(s);
    window.location.hash = "/";
    setSession(s);
  }
  function signOut() {
    if (!window.confirm("Are you sure you want to log out?")) return;
    clearSession();
    window.location.hash = "/";
    setSession(null);
  }

  if (!session) return <Login onSignedIn={signedIn} />;
  return <Workspace user={session.user} onSignOut={signOut} />;
}

function Workspace({ user, onSignOut }) {
  const [route, go] = useRoute();
  const [menu, setMenu] = useState(false);
  const [note, setNote] = useState(null);

  const toast = useCallback((text, kind = "good") => {
    setNote({ text, kind, id: Date.now() });
  }, []);
  useEffect(() => {
    if (!note) return;
    const t = setTimeout(() => setNote(null), 4000);
    return () => clearTimeout(t);
  }, [note]);

  // A page this role can't open falls back to the Dashboard.
  const allowed = canOpen(user.role, route);
  const config = allowed ? resources[route] : undefined;
  useEffect(() => {
    document.title = `${config ? config.title : "Dashboard"} · SHMIS`;
    window.scrollTo(0, 0);
  }, [route, config]);

  const groups = nav
    .map((g) => ({ ...g, items: g.items.filter((i) => canOpen(user.role, i.key)) }))
    .filter((g) => g.items.length);
  const current = allowed ? route : "";

  return (
    <div className="shell">
      <aside className={`side${menu ? " open" : ""}`}>
        <div className="brand">
          <span className="mark" aria-hidden />
          <div>
            <strong>SHMIS</strong>
            <small>Sindh Health · EMR</small>
          </div>
        </div>
        <nav>
          {groups.map((g, i) => (
            <div key={i} className="nav-group">
              {g.group && <h4>{g.group}</h4>}
              {g.items.map(({ key, label, icon: Icon }) => (
                <a key={key} href={`#/${key}`} className={current === key ? "on" : ""} onClick={() => setMenu(false)}>
                  <Icon size={16} strokeWidth={1.7} />
                  {label || resources[key].title}
                </a>
              ))}
            </div>
          ))}
        </nav>
        <div className="side-user">
          <span className="avatar" aria-hidden>{user.name?.replace(/^Dr\.?\s+/i, "").charAt(0).toUpperCase()}</span>
          <div>
            <strong>{user.name}</strong>
            <small>{ROLES[user.role].label}</small>
          </div>
        </div>
        <button className="logout-btn" onClick={onSignOut}>
          <LogOut size={16} strokeWidth={1.8} /> Log out
        </button>
      </aside>

      <div className="main">
        <div className="topbar">
          <button className="icon-btn" onClick={() => setMenu(!menu)} aria-label="Menu">
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>
          <strong>SHMIS</strong>
          <button className="topbar-logout" onClick={onSignOut}>
            <LogOut size={16} strokeWidth={1.8} /> Log out
          </button>
        </div>
        <main>
          {config ? (
            <ResourcePage key={route} config={config} toast={toast} user={user} writable={canWrite(user.role, route)} />
          ) : (
            <Dashboard go={go} user={user} />
          )}
        </main>
      </div>

      {note && <div key={note.id} className={`toast ${note.kind}`} role="status">{note.text}</div>}
    </div>
  );
}
