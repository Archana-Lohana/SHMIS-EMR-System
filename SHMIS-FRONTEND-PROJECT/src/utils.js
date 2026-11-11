export function getIn(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

export function setIn(obj, path, value) {
  const keys = path.split(".");
  const out = { ...obj };
  let cur = out;
  keys.forEach((k, i) => {
    if (i === keys.length - 1) cur[k] = value;
    else {
      cur[k] = { ...(cur[k] || {}) };
      cur = cur[k];
    }
  });
  return out;
}

// Remove "" / null / empty objects so optional fields don't trip Mongoose validators.
export function prune(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const out = {};
    Object.entries(value).forEach(([k, v]) => {
      const p = prune(v);
      const empty = p === "" || p == null || (typeof p === "object" && !Array.isArray(p) && Object.keys(p).length === 0);
      if (!empty) out[k] = p;
    });
    return out;
  }
  return value;
}

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

export function fmtDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : dateFmt.format(d);
}

export const toDateInput = (value) => (value ? String(value).slice(0, 10) : "");
export const todayInput = () => new Date().toISOString().slice(0, 10);

export function ageFrom(dob) {
  if (!dob) return "";
  const b = new Date(dob);
  if (Number.isNaN(b.getTime())) return "";
  const now = new Date();
  let a = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) a--;
  return a;
}

export function makeCode(prefix) {
  return `${prefix}-${String(Date.now()).slice(-6)}`;
}

export const number = (n) => new Intl.NumberFormat("en-US").format(n ?? 0);

export function downloadCSV(filename, headers, rows) {
  const esc = (v) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const text = [headers, ...rows].map((r) => r.map(esc).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
