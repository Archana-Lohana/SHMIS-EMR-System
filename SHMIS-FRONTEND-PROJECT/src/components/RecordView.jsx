import { fmtDate, getIn } from "../utils";
import StatusBadge from "./StatusBadge";
import PatientHistory from "./PatientHistory";

function show(field, row) {
  const v = getIn(row, field.name);
  if (v == null || v === "" || (Array.isArray(v) && !v.length)) return <span className="muted">—</span>;
  if (field.type === "ref") return v.name || "—";
  if (field.type === "date") return fmtDate(v);
  if (field.type === "tags") return v.join(", ");
  if (field.type === "number") return v;
  if (field.name === "status" || field.name === "reportStatus") return <StatusBadge value={v} />;
  return String(v);
}

export default function RecordView({ config, row, isPatient }) {
  const blocks = [];
  let current = { title: null, items: [] };
  config.fields.forEach((f) => {
    if (f.type === "heading") {
      blocks.push(current);
      current = { title: f.label, items: [] };
    } else current.items.push(f);
  });
  blocks.push(current);

  return (
    <div className="view">
      {blocks.map((b, i) => (
        <section key={i}>
          {b.title && <h3 className="form-heading">{b.title}</h3>}
          <dl>
            {b.items.map((f) =>
              f.type === "medicines" ? (
                <div className="wide" key={f.name}>
                  <dt>{f.label}</dt>
                  <dd>
                    <table className="mini">
                      <thead><tr><th>Medicine</th><th>Dose</th><th>How often</th><th>For</th></tr></thead>
                      <tbody>
                        {(row.medicines || []).map((m, j) => (
                          <tr key={j}>
                            <td><strong>{m.medicineName}</strong>{m.instructions && <span className="sub">{m.instructions}</span>}</td>
                            <td>{m.dosage}</td><td>{m.frequency}</td><td>{m.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </dd>
                </div>
              ) : (
                <div key={f.name} className={f.wide || f.type === "textarea" ? "wide" : ""}>
                  <dt>{f.label}</dt>
                  <dd className={f.mono ? "mono" : ""}>{show(f, row)}</dd>
                </div>
              )
            )}
          </dl>
        </section>
      ))}
      {isPatient && <PatientHistory patient={row} />}
    </div>
  );
}
