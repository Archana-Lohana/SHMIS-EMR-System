// Session + role rules. No network code here (see signIn in api.js).

const KEY = "shmis.session";

export const ROLES = {
  admin: { label: "Admin", blurb: "Full access to every record and setting." },
  doctor: { label: "Doctor", blurb: "Patients, appointments and clinical work." },
  patient: { label: "Patient", blurb: "Your own appointments, prescriptions and results." },
};

// Which pages each role may open. "" is the Dashboard.
const PAGES = {
  admin: null,
  doctor: null,
  patient: ["", "appointments", "clinical-records", "prescriptions", "lab-tests"],
};
// Who may add, edit or delete on each page.
const WRITE = {
  admin: null,
  doctor: [],
  patient: [],
};

export const canOpen = (role, key) => !PAGES[role] || PAGES[role].includes(key);
export const canWrite = (role, key) => !WRITE[role] || WRITE[role].includes(key);

export function loadSession() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    return s?.user?.role && ROLES[s.user.role] ? s : null;
  } catch {
    return null;
  }
}
export const saveSession = (s) => localStorage.setItem(KEY, JSON.stringify(s));
export const clearSession = () => localStorage.removeItem(KEY);
export const getToken = () => loadSession()?.token || null;

// "Dr. Ahmed Ali" and "ahmed ali" count as the same person.
const norm = (s) => String(s || "").toLowerCase().replace(/^dr\.?\s+/, "").replace(/\s+/g, " ").trim();

// True when a populated { _id, name } reference points at the signed-in person.
export function isMe(user, ref) {
  if (!ref) return false;
  if (user.linkId && ref._id) return ref._id === user.linkId;
  return !!user.linkName && norm(ref.name) === norm(user.linkName);
}

// Patients only ever see their own rows.
// NOTE: this is a display filter. Real privacy must also be enforced by the backend.
export const mineAsPatient = (user, rows) => rows.filter((r) => isMe(user, r.patient));

// Demo accounts, used only when the backend has no /auth/login route yet.
export const DEMO_ACCOUNTS = [
  { username: "admin", password: "admin123", role: "admin", name: "System Administrator" },
  { username: "doctor", password: "doctor123", role: "doctor", name: "Dr. Ahmed Ali", linkName: "Dr. Ahmed Ali" },
  { username: "patient", password: "patient123", role: "patient", name: "Ali Ahmed", linkName: "Ali Ahmed" },
];
