"use client";

import {
  Fragment,
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

export const fieldClass =
  "w-full border border-navy/10 bg-white px-3 py-2.5 text-sm text-navy outline-none transition placeholder:text-muted/60 focus:border-orange";

export const primaryBtn =
  "inline-flex items-center justify-center bg-orange px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-orange-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange disabled:cursor-not-allowed disabled:opacity-60";

export const ghostBtn =
  "inline-flex items-center justify-center border border-navy/15 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-navy transition hover:border-navy/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange";

export const cellClass = "px-4 py-3";
export const rowClass = "border-b border-navy/8 align-top last:border-0";

export function includesQuery(query: string, parts: Array<string | undefined>) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return parts.join(" ").toLowerCase().includes(needle);
}

export function PageIntro({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-navy md:text-4xl">
          {title}
        </h1>
        {description ? <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className={fieldClass}
    />
  );
}

export function Filters({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { id: string; label: string }[];
  label: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] ${
              active ? "bg-navy text-white" : "border border-navy/10 bg-white text-navy"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function Badge({
  children,
  tone = "sand",
}: {
  children: ReactNode;
  tone?: "navy" | "orange" | "sand" | "blue" | "alert";
}) {
  const tones = {
    navy: "bg-navy text-white",
    orange: "bg-orange/10 text-orange",
    sand: "bg-sand text-muted",
    blue: "bg-blue/10 text-blue",
    alert: "bg-red-50 text-red-700",
  };
  return (
    <span className={`inline-flex items-center px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function useRowSelection() {
  const [selected, setSelected] = useState<string[]>([]);
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  function toggle(key: string) {
    setSelected((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
  }

  function setVisible(keys: string[], on: boolean) {
    setSelected((current) => {
      const drop = new Set(keys);
      const kept = current.filter((key) => !drop.has(key));
      return on ? [...kept, ...keys] : kept;
    });
  }

  function drop(key: string) {
    setSelected((current) => current.filter((item) => item !== key));
  }

  function clear() {
    setSelected([]);
  }

  return { selected, selectedSet, toggle, setVisible, drop, clear };
}

export function SelectionBar({
  shownKeys,
  selectedCount,
  onSetVisible,
  onDelete,
  onClear,
}: {
  shownKeys: string[];
  selectedCount: number;
  onSetVisible: (keys: string[], on: boolean) => void;
  onDelete: () => void;
  onClear: () => void;
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => onSetVisible(shownKeys, true)}
        disabled={shownKeys.length === 0}
        className={ghostBtn}
      >
        Select all
      </button>
      {selectedCount > 0 ? (
        <>
          <p className="text-sm font-medium text-navy">{selectedCount} selected</p>
          <button type="button" onClick={onDelete} className={primaryBtn}>
            Delete selected
          </button>
          <button type="button" onClick={onClear} className={ghostBtn}>
            Clear
          </button>
        </>
      ) : null}
    </div>
  );
}

function SelectBox({
  checked,
  indeterminate = false,
  onChange,
  label,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate && !checked;
  }, [indeterminate, checked]);
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      aria-label={label}
      onChange={(event) => onChange(event.target.checked)}
      className="h-4 w-4 accent-orange"
    />
  );
}

function withSelection(node: ReactNode, box: ReactNode) {
  if (isValidElement<{ children?: ReactNode }>(node) && node.type === "tr") {
    return cloneElement(node, undefined, <td className={`${cellClass} w-10`}>{box}</td>, node.props.children);
  }
  return (
    <div className="flex items-start gap-3">
      <div className="pt-0.5">{box}</div>
      <div className="min-w-0 flex-1">{node}</div>
    </div>
  );
}

export function RecordList<T>({
  items,
  columns,
  getKey,
  row,
  card,
  empty,
  selection,
}: {
  items: T[];
  columns: string[];
  getKey: (item: T) => string;
  row: (item: T) => ReactNode;
  card: (item: T) => ReactNode;
  empty: ReactNode;
  selection?: ReturnType<typeof useRowSelection>;
}) {
  if (items.length === 0) {
    return (
      <div className="mt-6 border border-dashed border-navy/15 bg-white px-5 py-14 text-center text-sm text-muted">
        {empty}
      </div>
    );
  }

  const keys = items.map(getKey);
  const selectedCount = selection ? keys.filter((key) => selection.selectedSet.has(key)).length : 0;
  const allChecked = Boolean(selection) && selectedCount === keys.length;
  const someChecked = selectedCount > 0 && !allChecked;

  function box(key: string, label: string) {
    if (!selection) return null;
    return (
      <SelectBox
        checked={selection.selectedSet.has(key)}
        onChange={() => selection.toggle(key)}
        label={label}
      />
    );
  }

  return (
    <>
      <ul className="mt-6 space-y-3 md:hidden">
        {items.map((item) => {
          const key = getKey(item);
          const content = card(item);
          return (
            <li key={key} className="border border-navy/10 bg-white p-4">
              {selection ? withSelection(content, box(key, "Select row")) : content}
            </li>
          );
        })}
      </ul>
      <div className="mt-6 hidden overflow-hidden border border-navy/10 bg-white md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-navy/10 bg-sand text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
              <tr>
                {selection ? (
                  <th className="w-10 px-4 py-3">
                    <SelectBox
                      checked={allChecked}
                      indeterminate={someChecked}
                      onChange={(checked) => selection.setVisible(keys, checked)}
                      label="Select all"
                    />
                  </th>
                ) : null}
                {columns.map((column, index) => (
                  <th
                    key={column}
                    className={`px-4 py-3 font-bold ${index === columns.length - 1 ? "text-right" : ""}`}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const key = getKey(item);
                const content = row(item);
                return (
                  <Fragment key={key}>
                    {selection ? withSelection(content, box(key, "Select row")) : content}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export function Drawer({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseRef.current();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close editor" className="absolute inset-0 bg-navy/50" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-navy/10 px-5 py-4">
          <h2 id={titleId} className="font-[family-name:var(--font-display)] text-xl font-semibold text-navy">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 text-xs font-bold uppercase tracking-[0.14em] text-muted"
          >
            Close
          </button>
        </div>
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

export function EditorForm({
  onSubmit,
  onCancel,
  error,
  children,
}: {
  onSubmit: (event: FormEvent) => void;
  onCancel: () => void;
  error: string;
  children: ReactNode;
}) {
  return (
    <form noValidate onSubmit={onSubmit} autoComplete="off" className="flex h-full flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {error ? (
          <p role="alert" className="border border-orange/30 bg-orange/10 px-3 py-2 text-sm text-navy">
            {error}
          </p>
        ) : null}
        {children}
      </div>
      <div className="flex gap-3 border-t border-navy/10 px-5 py-4">
        <button type="submit" className={primaryBtn}>
          Save
        </button>
        <button type="button" onClick={onCancel} className={ghostBtn}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const titleId = useId();
  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onCancelRef.current();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-5">
      <button type="button" aria-label="Close dialog" className="absolute inset-0 bg-navy/60" onClick={onCancel} />
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="relative w-full max-w-md bg-white p-6">
        <h2 id={titleId} className="font-[family-name:var(--font-display)] text-2xl font-semibold text-navy">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" autoFocus onClick={onCancel} className={ghostBtn}>
            Keep
          </button>
          <button type="button" onClick={onConfirm} className={primaryBtn}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  hint,
  placeholder,
  type = "text",
  list,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  placeholder?: string;
  type?: string;
  list?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-navy">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        list={list}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
      />
      {hint ? <span className="mt-1.5 block text-xs leading-relaxed text-muted">{hint}</span> : null}
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  hint,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-navy">{label}</span>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
      />
      {hint ? <span className="mt-1.5 block text-xs leading-relaxed text-muted">{hint}</span> : null}
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  const choices = options.some((option) => option.value === value)
    ? options
    : [{ value, label: value }, ...options];
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-navy">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass}>
        {choices.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CheckField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 text-sm font-medium text-navy">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-orange"
      />
      {label}
    </label>
  );
}

export function FieldGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

export function InlineSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="border border-navy/10 bg-white px-2 py-1.5 text-xs font-semibold text-navy outline-none focus:border-orange"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function TextAction({
  children,
  onClick,
  tone = "default",
}: {
  children: ReactNode;
  onClick: () => void;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs font-bold uppercase tracking-[0.14em] ${tone === "danger" ? "text-orange" : "text-navy"}`}
    >
      {children}
    </button>
  );
}

export function Actions({ onEdit, onDelete }: { onEdit?: () => void; onDelete: () => void }) {
  return (
    <div className="flex gap-3 md:justify-end">
      {onEdit ? <TextAction onClick={onEdit}>Edit</TextAction> : null}
      <TextAction tone="danger" onClick={onDelete}>
        Delete
      </TextAction>
    </div>
  );
}

export function useRecordEditor<T>() {
  const [draft, setDraft] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);
  const originalKey = useRef("");

  function openCreate(blank: T) {
    originalKey.current = "";
    setMode("create");
    setError("");
    setDraft(blank);
  }

  function openEdit(record: T, key: string) {
    originalKey.current = key;
    setMode("edit");
    setError("");
    setDraft({ ...record });
  }

  function close() {
    setDraft(null);
    setError("");
  }

  function patch(partial: Partial<T>) {
    setDraft((current) => (current ? { ...current, ...partial } : current));
  }

  return {
    draft,
    error,
    setError,
    mode,
    pendingDelete,
    setPendingDelete,
    originalKey,
    openCreate,
    openEdit,
    close,
    patch,
  };
}

export function optionList<T extends string>(labels: Record<T, string>) {
  return (Object.entries(labels) as [T, string][]).map(([value, label]) => ({ value, label }));
}
