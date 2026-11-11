import { useEffect, useState } from "react";
import { API_URL, getList } from "../api";
import { fmtDate, number } from "../utils";
import { isMe, mineAsPatient } from "../auth";
import StatusBadge from "../components/StatusBadge";

const paths = {
  patients: "/patients", doctors: "/doctors", hospitals: "/hospitals", departments: "/departments",
  appointments: "/appointments", labs: "/lab-tests", prescriptions: "/prescriptions",
  gender: "/analytics/patients-by-gender", blood: "/analytics/patients-by-blood-group",
  specialization: "/analytics/doctors-by-specialization", byHospital: "/analytics/doctors-by-hospital",
};

// What each role's dashboard loads.
const needs = {
  admin: ["patients", "doctors", "hospitals", "departments", "appointments", "labs", "gender", "blood", "specialization", "byHospital"],
  doctor: ["patients", "appointments", "labs", "prescriptions", "gender", "blood"],
  patient: ["appointments", "labs", "prescriptions"],
};

// A ranked list with a thin share bar: easier to read than a column chart for a handful of groups.
function Breakdown({ title, data, valueKey }) {
  const rows = data
    .map((d) => ({ label: d._id || "Not recorded", value: d[valueKey] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
  const total = rows.reduce((n, r) => n + r.value, 0);
  const top = rows[0]?.value || 1;
  return (
    <section className="panel">
      <div className="panel-head">
        <h3>{title}</h3>
        {total > 0 && <span className="muted small">{number(total)} in total</span>}
      </div>
      {rows.length === 0 ? (
        <p className="muted pad">No data yet.</p>
      ) : (
        <ul className="split">
          {rows.map((r) => (
            <li key={r.label}>
              <span>{r.label}</span>
              <i className="track"><b style={{ width: `${(r.value / top) * 100}%` }} /></i>
              <em>{number(r.value)}</em>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function Dashboard({ go, user }) {
  const role = user.role;
  const [d, setD] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    const keys = needs[role];
    Promise.allSettled(keys.map((k) => getList(paths[k]))).then((res) => {
      if (!alive) return;
      if (res.every((r) => r.status === "rejected")) return setFailed(true);
      setD(Object.fromEntries(keys.map((k, i) => [k, res[i].status === "fulfilled" ? res[i].value : []])));
    });
    return () => { alive = false; };
  }, [role]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Each role only sees the rows that are theirs.
  let appts = d?.appointments || [];
  let labs = d?.labs || [];
  let rx = d?.prescriptions || [];
  if (role === "patient") {
    appts = mineAsPatient(user, appts);
    labs = mineAsPatient(user, labs);
    rx = mineAsPatient(user, rx);
  } else if (role === "doctor") {
    appts = appts.filter((a) => isMe(user, a.doctor));
  }

  // Every appointment still marked "Scheduled" counts as booked. If its date has
  // already passed it is flagged "Overdue" so it can be completed or cancelled.
  const booked = appts.filter((a) => a.status === "Scheduled");
  const isOverdue = (a) => new Date(a.appointmentDate) < today;
  const upcoming = [...booked]
    .sort((a, b) => `${a.appointmentDate}${a.appointmentTime}`.localeCompare(`${b.appointmentDate}${b.appointmentTime}`))
    .slice(0, 7);
  const waiting = labs.filter((t) => t.reportStatus !== "Completed");
  const activeRx = rx.filter((p) => p.status === "Active");

  let figures = null;
  if (d) {
    if (role === "admin") {
      figures = [
        ["Patients", d.patients.length, "patients"],
        ["Doctors", d.doctors.length, "doctors"],
        ["Hospitals", d.hospitals.length, "hospitals"],
        ["Departments", d.departments.length, "departments"],
        ["Booked appointments", d.appointments.filter((a) => a.status === "Scheduled").length, "appointments"],
        ["Lab reports waiting", waiting.length, "lab-tests"],
      ];
    } else if (role === "doctor") {
      figures = [
        ["Patients", d.patients.length, "patients"],
        ["My upcoming appointments", booked.length, "appointments"],
        ["Lab reports waiting", waiting.length, "lab-tests"],
        ["Active prescriptions", activeRx.length, "prescriptions"],
      ];
    } else {
      figures = [
        ["Upcoming appointments", booked.length, "appointments"],
        ["Active prescriptions", activeRx.length, "prescriptions"],
        ["Lab reports waiting", waiting.length, "lab-tests"],
      ];
    }
  }
  const placeholders = role === "admin" ? 6 : role === "doctor" ? 4 : 3;

  const mineOnly = role !== "admin";
  const comingTitle = role === "patient" ? "My appointments" : role === "doctor" ? "My upcoming appointments" : "Coming up";

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p>
            {today.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {failed && (
        <div className="banner bad">
          Can't reach the backend at <code>{API_URL}</code>. Start it with <code>npm run dev</code> in the backend folder and make sure MongoDB is running, then refresh.
        </div>
      )}

      <div className="figures">
        {(figures || Array.from({ length: placeholders }, () => ["", null, ""])).map(([label, n, to], i) => (
          <button key={i} className="figure" onClick={() => to && go(to)} disabled={!to}>
            <strong>{n == null ? <i className="bar-skel" /> : number(n)}</strong>
            <span>{label || "\u00A0"}</span>
          </button>
        ))}
      </div>

      {d && (
        <>
          <div className="two">
            <section className="panel">
              <div className="panel-head">
                <h3>{comingTitle}</h3>
                <button className="text-btn" onClick={() => go("appointments")}>{mineOnly ? "View all" : "All appointments"}</button>
              </div>
              {upcoming.length === 0 ? (
                <p className="muted pad">{mineOnly ? "You have no upcoming appointments." : "No upcoming appointments are booked."}</p>
              ) : (
                <ul className="feed">
                  {upcoming.map((a) => (
                    <li key={a._id}>
                      <time><b>{fmtDate(a.appointmentDate)}</b>{a.appointmentTime}</time>
                      <div>
                        <strong>{role === "patient" ? a.doctor?.name : a.patient?.name}</strong>
                        <span>
                          {role === "patient" ? a.doctor?.specialization : role === "doctor" ? a.reason : `with ${a.doctor?.name}`}
                          {" · "}{a.hospital?.name}
                        </span>
                      </div>
                      <em>{isOverdue(a) ? "Overdue" : a.appointmentType}</em>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="panel">
              <div className="panel-head">
                <h3>{role === "patient" ? "My lab reports" : "Lab reports waiting"}</h3>
                <button className="text-btn" onClick={() => go("lab-tests")}>{mineOnly ? "View all" : "All lab tests"}</button>
              </div>
              {waiting.length === 0 ? (
                <p className="muted pad">{role === "patient" ? "No lab reports are pending." : "Every lab report is done."}</p>
              ) : (
                <ul className="feed">
                  {waiting.slice(0, 7).map((t) => (
                    <li key={t._id}>
                      <time><b>{fmtDate(t.testDate)}</b></time>
                      <div>
                        <strong>{t.testName}</strong>
                        <span>{role === "patient" ? t.testCategory : `${t.patient?.name} · ${t.testCategory}`}</span>
                      </div>
                      <StatusBadge value={t.reportStatus} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {role !== "patient" && (
            <div className="two">
              <Breakdown title="Patients by sex" data={d.gender} valueKey="totalPatients" />
              <Breakdown title="Patients by blood group" data={d.blood} valueKey="totalPatients" />
              {role === "admin" && (
                <>
                  <Breakdown title="Doctors by specialization" data={d.specialization} valueKey="totalDoctors" />
                  <Breakdown title="Doctors by hospital" data={d.byHospital} valueKey="totalDoctors" />
                </>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
