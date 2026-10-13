"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import {
  Actions,
  ConfirmDialog,
  Drawer,
  EditorForm,
  FieldGrid,
  Filters,
  InlineSelect,
  PageIntro,
  RecordList,
  SearchBox,
  SelectionBar,
  SelectField,
  TextArea,
  TextField,
  cellClass,
  includesQuery,
  optionList,
  primaryBtn,
  rowClass,
  useRecordEditor,
  useRowSelection,
} from "@/components/admin/ui";
import {
  blankEvent,
  createId,
  eventStatusLabel,
  eventTypes,
  removeWhere,
  upsert,
  type AdminEvent,
} from "@/lib/admin-store";

export default function AdminEventsPage() {
  const { store, update } = useAdmin();
  const editor = useRecordEditor<AdminEvent>();
  const selection = useRowSelection();
  const [bulkOpen, setBulkOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(
    () =>
      store.events.filter((event) => {
        const statusMatch = status === "all" || event.status === status;
        return statusMatch && includesQuery(query, [event.title, event.type, event.description, event.date]);
      }),
    [store.events, query, status],
  );

  function setEventStatus(event: AdminEvent, next: AdminEvent["status"]) {
    update((current) => ({
      ...current,
      events: current.events.map((item) => (item.id === event.id ? { ...item, status: next } : item)),
    }));
  }

  function save(formEvent: FormEvent) {
    formEvent.preventDefault();
    const draft = editor.draft;
    if (!draft) return;
    if (!draft.title.trim()) return editor.setError("Enter an event title.");
    if (!draft.type.trim()) return editor.setError("Enter the event type.");
    if (!draft.date.trim() || !draft.time.trim()) return editor.setError("Enter the date and time.");
    if (!draft.description.trim()) return editor.setError("Enter a description.");

    const next: AdminEvent = {
      ...draft,
      id: draft.id || createId("event"),
      title: draft.title.trim(),
      type: draft.type.trim(),
      date: draft.date.trim(),
      time: draft.time.trim(),
      description: draft.description.trim(),
    };
    update((current) => ({
      ...current,
      events: upsert(current.events, next, (event) => event.id, editor.originalKey.current),
    }));
    editor.close();
  }

  function remove(event: AdminEvent) {
    update((current) => ({
      ...current,
      events: removeWhere(current.events, (item) => item.id, event.id),
    }));
    selection.drop(event.id);
    editor.setPendingDelete(null);
  }

  function removeSelected() {
    const keys = selection.selectedSet;
    update((current) => ({
      ...current,
      events: current.events.filter((event) => !keys.has(event.id)),
    }));
    selection.clear();
    setBulkOpen(false);
  }

  const draft = editor.draft;
  const statusOptions = optionList(eventStatusLabel);
  const typeOptions = Array.from(new Set([...eventTypes, ...(draft ? [draft.type] : [])])).map((type) => ({
    value: type,
    label: type,
  }));

  return (
    <div>
      <PageIntro
        title="Events"
        description="Webinars, workshops, and gatherings."
        action={
          <button type="button" onClick={() => editor.openCreate(blankEvent())} className={primaryBtn}>
            Add event
          </button>
        }
      />

      <div className="mt-6 flex flex-col gap-3">
        <div className="md:w-80">
          <SearchBox value={query} onChange={setQuery} placeholder="Search events" />
        </div>
        <Filters
          label="Event status"
          value={status}
          onChange={setStatus}
          options={[
            { id: "all", label: "All" },
            { id: "upcoming", label: "Upcoming" },
            { id: "previous", label: "Previous" },
          ]}
        />
      </div>
      <p className="mt-3 text-xs font-medium text-muted">
        {filtered.length} of {store.events.length}
      </p>
      <SelectionBar
        shownKeys={filtered.map((event) => event.id)}
        selectedCount={selection.selected.length}
        onSetVisible={selection.setVisible}
        onDelete={() => setBulkOpen(true)}
        onClear={selection.clear}
      />

      <RecordList
        items={filtered}
        selection={selection}
        columns={["Event", "When", "Status", "Actions"]}
        getKey={(event) => event.id}
        empty={query || status !== "all" ? "Nothing matches that filter." : "Add the first event."}
        card={(event) => (
          <div>
            <p className="font-semibold text-navy">{event.title}</p>
            <p className="mt-1 text-xs text-muted">
              {event.type} · {event.date} · {event.time}
            </p>
            <p className="mt-2 text-sm text-muted">{event.description}</p>
            <div className="mt-3">
              <InlineSelect
                label={`Status for ${event.title}`}
                value={event.status}
                options={statusOptions}
                onChange={(value) => {
                  if (value === "upcoming" || value === "previous") setEventStatus(event, value);
                }}
              />
            </div>
            <div className="mt-4">
              <Actions
                onEdit={() => editor.openEdit(event, event.id)}
                onDelete={() => editor.setPendingDelete(event)}
              />
            </div>
          </div>
        )}
        row={(event) => (
          <tr className={rowClass}>
            <td className={cellClass}>
              <p className="font-medium text-navy">{event.title}</p>
              <p className="mt-1 max-w-md text-xs text-muted">{event.description}</p>
            </td>
            <td className={`${cellClass} whitespace-nowrap`}>
              {event.type}
              <span className="mt-1 block text-xs text-muted">
                {event.date} · {event.time}
              </span>
            </td>
            <td className={cellClass}>
              <InlineSelect
                label={`Status for ${event.title}`}
                value={event.status}
                options={statusOptions}
                onChange={(value) => {
                  if (value === "upcoming" || value === "previous") setEventStatus(event, value);
                }}
              />
            </td>
            <td className={cellClass}>
              <Actions
                onEdit={() => editor.openEdit(event, event.id)}
                onDelete={() => editor.setPendingDelete(event)}
              />
            </td>
          </tr>
        )}
      />

      {draft ? (
        <Drawer open title={editor.mode === "edit" ? "Edit event" : "New event"} onClose={editor.close}>
          <EditorForm onSubmit={save} onCancel={editor.close} error={editor.error}>
            <TextField label="Title" value={draft.title} onChange={(title) => editor.patch({ title })} />
            <FieldGrid>
              <SelectField
                label="Type"
                value={draft.type}
                onChange={(type) => editor.patch({ type })}
                options={typeOptions}
              />
              <SelectField
                label="Status"
                value={draft.status}
                onChange={(value) => {
                  if (value === "upcoming" || value === "previous") editor.patch({ status: value });
                }}
                options={statusOptions}
              />
              <TextField label="Date" value={draft.date} onChange={(date) => editor.patch({ date })} />
              <TextField label="Time" value={draft.time} onChange={(time) => editor.patch({ time })} />
            </FieldGrid>
            <TextArea
              label="Description"
              value={draft.description}
              onChange={(description) => editor.patch({ description })}
            />
          </EditorForm>
        </Drawer>
      ) : null}

      <ConfirmDialog
        open={editor.pendingDelete !== null}
        title="Delete this event?"
        body={
          editor.pendingDelete
            ? `${editor.pendingDelete.title} will be removed from this portal.`
            : ""
        }
        confirmLabel="Delete"
        onCancel={() => editor.setPendingDelete(null)}
        onConfirm={() => {
          if (editor.pendingDelete) remove(editor.pendingDelete);
        }}
      />
      <ConfirmDialog
        open={bulkOpen}
        title={`Delete ${selection.selected.length} events?`}
        body="The selected events will be removed from the website."
        confirmLabel="Delete"
        onCancel={() => setBulkOpen(false)}
        onConfirm={removeSelected}
      />
    </div>
  );
}
