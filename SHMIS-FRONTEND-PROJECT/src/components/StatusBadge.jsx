const tone = {
  Active: "good", Completed: "good", Scheduled: "info", "In Progress": "warn",
  "Under Treatment": "warn", Open: "info", Pending: "warn", Inactive: "mute", Cancelled: "bad",
};

export default function StatusBadge({ value }) {
  if (!value) return <span className="muted">—</span>;
  return <span className={`status ${tone[value] || "mute"}`}>{value}</span>;
}
