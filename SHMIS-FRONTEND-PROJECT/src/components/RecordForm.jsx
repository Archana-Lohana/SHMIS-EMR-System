import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { createItem, errorText, getDoctorProfile, getList, updateItem } from "../api";
import { defaultValue, optionOf } from "../resources.jsx";
import { getIn, prune, setIn, toDateInput, todayInput } from "../utils";
import Combobox from "./Combobox";

const blankMed = () => ({ medicineName: "", dosage: "", frequency: "", duration: "", instructions: "" });

function initialValues(config, row) {
  let v = {};
  config.fields.forEach((f) => {
    if (!f.name) return;
    if (!row) return void (v = setIn(v, f.name, defaultValue(f)));
    let cur = getIn(row, f.name);
    if (f.type === "ref") cur = cur?._id ?? cur ?? "";
    else if (f.type === "date") cur = toDateInput(cur);
    else if (f.type === "tags") cur = (cur || []).join(", ");
    else if (f.type === "medicines") cur = (cur?.length ? cur : [blankMed()]).map((m) => ({ ...blankMed(), ...m }));
    v = setIn(v, f.name, cur ?? "");
  });
  return v;
}

function buildBody(config, values) {
  let body = {};
  config.fields.forEach((f) => {
    if (!f.name) return;
    let cur = getIn(values, f.name);
    if (f.type === "tags") cur = String(cur || "").split(",").map((s) => s.trim()).filter(Boolean);
    else if (f.type === "number") cur = cur === "" || cur == null ? "" : Number(cur);
    else if (f.type === "medicines") cur = cur.filter((m) => m.medicineName.trim());
    body = setIn(body, f.name, cur);
  });
  return prune(body);
}

export default function RecordForm({ config, row, onSaved, onCancel, formId, user }) {
  const [values, setValues] = useState(() => initialValues(config, row));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [lookups, setLookups] = useState({});
const [doctorProfile, setDoctorProfile] = useState(null);
const [doctorProfileError, setDoctorProfileError] = useState("");

  // Load whichever collections the dropdowns need.
 
  // Load whichever collections the dropdowns need.
  const sources = useMemo(
    () => [...new Set(config.fields.filter((f) => f.type === "ref").map((f) => f.source))],
    [config]
  );

  // Load logged-in Doctor's profile and hospital.
  useEffect(() => {
    if (
      user?.role !== "doctor" ||
      !["/clinical-records", "/prescriptions"].includes(config.endpoint)
    ) {
      return;
    }

    let alive = true;

    async function loadDoctorProfile() {
      try {
        const profile = await getDoctorProfile(user.linkId);
        if (alive) setDoctorProfile(profile);
      } catch (error) {
        if (alive) setDoctorProfileError(errorText(error));
      }
    }

    if (user.linkId) {
      loadDoctorProfile();
    } else {
      setDoctorProfileError("Doctor profile is not linked to this account.");
    }

    return () => {
      alive = false;
    };
  }, [user?.role, user?.linkId, config.endpoint]);

  // Automatically select Doctor's linked hospital.
  useEffect(() => {
    if (user?.role !== "doctor" || !doctorProfile?.hospital?._id) {
      return;
    }

    setValues((prev) =>
      setIn(prev, "hospital", doctorProfile.hospital._id)
    );
  }, [user?.role, doctorProfile]);


  useEffect(() => {
    let alive = true;
    sources.forEach((s) => {
      getList(`/${s}`).then((rows) => alive && setLookups((l) => ({ ...l, [s]: rows }))).catch(() => alive && setLookups((l) => ({ ...l, [s]: [] })));
    });
    return () => { alive = false; };
  }, [sources]);

  function change(name, value) {
    setValues((prev) => {
      let next = setIn(prev, name, value);
      // If a field other fields depend on changes (hospital → doctor), clear the dependents.
      config.fields.forEach((f) => {
        if (f.needs?.field === name) next = setIn(next, f.name, "");
      });
      return next;
    });
    setErrors((e) => ({ ...e, [name]: undefined }));
  }

  function validate() {
    const errs = {};
    config.fields.forEach((f) => {
      if (!f.required || !f.name) return;
      const v = getIn(values, f.name);
      const empty = f.type === "medicines" ? !v.some((m) => m.medicineName.trim()) : f.type === "tags" ? !String(v || "").trim() : v === "" || v == null;
      if (empty) errs[f.name] = f.type === "medicines" ? "Add at least one medicine." : "Required";
    });
    if (config.fields.some((f) => f.type === "medicines")) {
      const meds = values.medicines || [];
      meds.forEach((m, i) => {
        if (m.medicineName.trim() && (!m.dosage.trim() || !m.frequency.trim() || !m.duration.trim())) {
          errs.medicines = `Medicine ${i + 1} needs dosage, frequency and duration.`;
        }
      });
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function submit(e) {
    e.preventDefault();
    setFormError("");
    if (!validate()) {
      setFormError("Some required fields are missing.");
      return;
    }
    setSaving(true);
    try {
      const body = buildBody(config, values);
      const res = row ? await updateItem(config.endpoint, row._id, body) : await createItem(config.endpoint, body);
      onSaved(res.data, row ? "updated" : "created");
    } catch (err) {
      setFormError(errorText(err));
      setSaving(false);
    }
  }

  function renderField(f, i) {
    if (f.type === "heading") return <h3 className="form-heading" key={`h${i}`}>{f.label}</h3>;
    const val = getIn(values, f.name);
    const id = `f-${f.name}`;
    const err = errors[f.name];
    let control;

    if (f.type === "select") {
      control = (
        <select id={id} className="input" value={val} onChange={(e) => change(f.name, e.target.value)}>
          {!f.required && !f.default && <option value="">Not recorded</option>}
          {f.required && !f.default && <option value="">Select…</option>}
          {f.options.map((o) => <option key={o}>{o}</option>)}
        </select>
      );
    } else if (f.type === "textarea") {
      control = <textarea id={id} className="input" rows={3} value={val} onChange={(e) => change(f.name, e.target.value)} />;
    
    } else if (f.type === "ref" && f.name === "hospital" && user?.role === "doctor") {
      control = (
        <input
          id={id}
          className="input"
          value={
            doctorProfile?.hospital?.name ||
            (doctorProfileError ? doctorProfileError : "Loading hospital...")
          }
          readOnly
        />
      );
    } else if (f.type === "ref") {
      let options = (lookups[f.source] || []).filter((o) => {
        if (!f.needs) return true;
        const parent = getIn(values, f.needs.field);
        return parent && f.needs.match(o) === parent;
      }).map(optionOf[f.source]);

      const blocked = f.needs && !getIn(values, f.needs.field);

      control = (
        <Combobox
          id={id}
          value={val}
          options={options}
          disabled={blocked}
          placeholder={blocked ? f.needs.hint : lookups[f.source] ? `Search ${f.label.toLowerCase()}…` : "Loading…"}
          onChange={(v) => change(f.name, v)}
        />
      );

      
      
    } else if (f.type === "medicines") {
      control = (
        <div className="meds">
          {val.map((m, idx) => (
            <div className="med" key={idx}>
              <div className="med-top">
                <span>Medicine {idx + 1}</span>
                {val.length > 1 && (
                  <button type="button" className="text-btn danger" onClick={() => change("medicines", val.filter((_, j) => j !== idx))}>
                    <Trash2 size={14} /> Remove
                  </button>
                )}
              </div>
              <div className="grid">
                {[["medicineName", "Name", true], ["dosage", "Dosage", false], ["frequency", "Frequency", false], ["duration", "Duration", false]].map(([k, label, wide]) => (
                  <label key={k} className={wide ? "field wide" : "field"}>
                    <span className="label">{label}</span>
                    <input className="input" value={m[k]} placeholder={k === "dosage" ? "500 mg" : k === "frequency" ? "Twice daily" : k === "duration" ? "5 days" : ""}
                      onChange={(e) => change("medicines", val.map((x, j) => (j === idx ? { ...x, [k]: e.target.value } : x)))} />
                  </label>
                ))}
                <label className="field wide">
                  <span className="label">Instructions</span>
                  <input className="input" value={m.instructions} placeholder="After meals"
                    onChange={(e) => change("medicines", val.map((x, j) => (j === idx ? { ...x, instructions: e.target.value } : x)))} />
                </label>
              </div>
            </div>
          ))}
          <button type="button" className="btn small" onClick={() => change("medicines", [...val, blankMed()])}>
            <Plus size={14} /> Add another medicine
          </button>
        </div>
      );
    } else {
      control = (
        <input
          id={id}
          className={`input${f.mono ? " mono" : ""}`}
          type={f.type === "tags" ? "text" : f.type || "text"}
          value={val}
          min={f.min}
          step={f.step}
          max={f.max === "today" ? todayInput() : undefined}
          placeholder={f.placeholder}
          onChange={(e) => change(f.name, e.target.value)}
        />
      );
    }

    return (
      <div key={f.name} className={`field${f.wide ? " wide" : ""}${err ? " has-error" : ""}`}>
        <label className="label" htmlFor={id}>
          {f.label}{f.required && <b title="Required"> *</b>}
        </label>
        {control}
        {err ? <small className="err">{err}</small> : f.hint ? <small className="hint">{f.hint}</small> : null}
      </div>
    );
  }

  return (
    <form id={formId} onSubmit={submit} noValidate>
      {formError && <div className="banner bad">{formError}</div>}
      <div className="grid">{config.fields.map(renderField)}</div>
      {/* hidden submit so pressing Enter in a text box works */}
      <button type="submit" hidden disabled={saving} />
      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel} disabled={saving}>Cancel</button>
        <button type="submit" className="btn primary" disabled={saving}>
          {saving ? "Saving…" : row ? "Save changes" : `Add ${config.singular}`}
        </button>
      </div>
    </form>
  );
}
