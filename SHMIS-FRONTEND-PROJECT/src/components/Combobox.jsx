import { useMemo, useRef, useState } from "react";

// A dropdown you can type into. Needed because there can be a thousand patients.
export default function Combobox({ value, options, onChange, placeholder, disabled, id }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  const selected = options.find((o) => o.value === value);

  const shown = useMemo(() => {
    const t = text.trim().toLowerCase();
    const list = t ? options.filter((o) => `${o.label} ${o.sub || ""}`.toLowerCase().includes(t)) : options;
    return list.slice(0, 40);
  }, [options, text]);

  function pick(o) {
    onChange(o.value);
    setOpen(false);
    setText("");
  }

  return (
    <div className="combo">
      <input
        id={id}
        ref={inputRef}
        className="input"
        disabled={disabled}
        autoComplete="off"
        placeholder={selected ? selected.label : placeholder}
        value={open ? text : selected ? `${selected.label}${selected.sub ? "  ·  " + selected.sub : ""}` : ""}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setText(e.target.value);
          setOpen(true);
        }}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
      />
      {open && !disabled && (
        <ul className="combo-list">
          {shown.length === 0 && <li className="combo-empty">Nothing matches “{text}”</li>}
          {shown.map((o) => (
            <li key={o.value} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(o)} className={o.value === value ? "on" : ""}>
              <span>{o.label}</span>
              {o.sub && <small>{o.sub}</small>}
            </li>
          ))}
          {options.length > shown.length && !text && <li className="combo-empty">Type to narrow down {options.length} results…</li>}
        </ul>
      )}
    </div>
  );
}
