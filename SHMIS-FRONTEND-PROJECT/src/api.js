import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { DEMO_ACCOUNTS, ROLES, getToken } from "./auth";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const http = axios.create({ baseURL: API_URL, timeout: 20000 });

http.interceptors.request.use((cfg) => {
  const token = getToken();
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Sign in through the backend. If it has no /auth/login route yet (404) or can't be
// reached, fall back to the demo accounts so the screens can still be used.
export async function signIn(role, username, password) {
  let user = null, token = null;
  try {
    const res = await http.post("/auth/login", { username, password, role });
    const body = res.data?.data ?? res.data;
    if (body?.user?.role) { user = body.user; token = body.token || null; }
  } catch (e) {
    const status = e.response?.status;
    if (status === 400 || status === 401 || status === 403) {
      throw new Error(e.response?.data?.message || "Wrong username or password.", { cause: e });
    }
    // 404 / network error: use the demo accounts below
  }
  if (!user) {
    const hit = DEMO_ACCOUNTS.find((a) => a.username === username.trim().toLowerCase() && a.password === password);
    if (!hit) throw new Error("Wrong username or password.");
    user = { username: hit.username, role: hit.role, name: hit.name, linkName: hit.linkName };
  }
  if (user.role !== role) {
    throw new Error(`This is a ${ROLES[user.role]?.label.toLowerCase()} account. Choose ${ROLES[user.role]?.label} above.`);
  }
  return { token, user };
}

// The backend wraps everything as { success, data }. Hand back just the data.
export async function getList(path) {
  const res = await http.get(path);
  return Array.isArray(res.data?.data) ? res.data.data : [];
}
export const getOne = (path) => http.get(path).then((r) => r.data.data);
export const createItem = (path, body) => http.post(path, body).then((r) => r.data);
export const updateItem = (path, id, body) => http.put(`${path}/${id}`, body).then((r) => r.data);
export const deleteItem = (path, id) => http.delete(`${path}/${id}`).then((r) => r.data);

// Turn whatever went wrong into a sentence a front-desk person can understand.
export function errorText(err) {
  if (err?.code === "ERR_NETWORK" || err?.code === "ECONNABORTED") {
    return "Can't reach the server. Check that the backend is running.";
  }
  const msg = err?.response?.data?.message || err?.message || "Something went wrong.";
  if (msg.includes("E11000")) {
    const m = msg.match(/dup key: \{ (\w+):/);
    return m ? `That ${humanize(m[1])} is already in use. Please use a different one.` : "That code is already in use.";
  }
  if (msg.includes("validation failed")) {
    return msg.replace(/^.*validation failed: /, "").replace(/Path `(\w+)` is required\./g, (_, p) => `${humanize(p)} is required.`);
  }
  return msg;
}

function humanize(key) {
  return key.replace(/([A-Z])/g, " $1").toLowerCase();
}

export function useList(path) {
  const [state, setState] = useState({ rows: [], loading: true, error: "" });

  const load = useCallback(async () => {
    try {
      const rows = await getList(path);
      return { rows, loading: false, error: "" };
    } catch (e) {
      return { rows: [], loading: false, error: errorText(e) };
    }
  }, [path]);

  // first load
  useEffect(() => {
    let alive = true;
    load().then((s) => alive && setState(s));
    return () => { alive = false; };
  }, [load]);

  // manual refresh (after saving, deleting, or "Try again")
  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: "" }));
    setState(await load());
  }, [load]);

  return { ...state, reload };
}
