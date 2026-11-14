import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { ROLES, getToken } from "./auth";

export const API_URL = "/api";
const http = axios.create({ baseURL: API_URL, timeout: 20000 });

http.interceptors.request.use((cfg) => {
  const token = getToken();
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
export async function signIn(role, username, password) {
  try {
    const res = await http.post("/auth/login", {
      username,
      password
    });
console.log("LOGIN RESPONSE:", res.data);
    const body = res.data?.data ?? res.data;
    const user = body?.user;
    const token = body?.token;

    if (!user?.role || !token) {
      throw new Error("Invalid login response from backend.");
    }

    if (user.role !== role) {
      throw new Error(
        `Please select the correct role: ${ROLES[user.role]?.label}.`
      );
    }

    return { token, user };

  } catch (e) {
        console.log("LOGIN ERROR:", e);

    throw new Error(
      e.response?.data?.message ||
      e.message ||
      "Unable to connect to backend."
    );
  }
}
// Sign in through the backend. If it has no /auth/login route yet (404) or can't be
// reached, fall back to the demo accounts so the screens can still be used.


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
export async function createPatientAccount(data) {
  const res = await http.post("/auth/create-patient", data);
  return res.data;
}
