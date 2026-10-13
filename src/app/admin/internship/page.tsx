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
import type { InternshipPosting, InternshipStatus } from "@/data/content";
import {
  blankInternship,
  feeAmount,
  internshipStatusLabel,
  normalizeFee,
  removeWhere,
  resolveSlug,
  upsert,
} from "@/lib/admin-store";

export default function AdminInternshipPage() {
  const { store, update } = useAdmin();
  const editor = useRecordEditor<InternshipPosting>();
  const selection = useRowSelection();
  const [bulkOpen, setBulkOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(
    () =>
      store.internships.filter((posting) => {
        const statusMatch = status === "all" || posting.status === status;
        return statusMatch && includesQuery(query, [posting.title, posting.summary, posting.fee, posting.status]);
      }),
    [store.internships, query, status],
  );

  function setPostingStatus(posting: InternshipPosting, next: InternshipStatus) {
    update((current) => ({
      ...current,
      internships: current.internships.map((item) =>
        item.slug === posting.slug ? { ...item, status: next } : item,
      ),
    }));
  }

  function save(event: FormEvent) {
    event.preventDefault();
    const draft = editor.draft;
    if (!draft) return;
    if (!draft.title.trim()) return editor.setError("Enter a title.");
    if (!draft.summary.trim()) return editor.setError("Enter a short summary.");
    if (!draft.closes.trim() || !draft.starts.trim() || !draft.duration.trim()) {
      return editor.setError("Enter the closing date, start date, and duration.");
    }
    const fee = normalizeFee(draft.fee);
    if (feeAmount(fee) <= 0) return editor.setError("Enter a fee, such as $149.");
    const slug = resolveSlug({
      slug: draft.slug,
      title: draft.title,
      existing: store.internships.map((posting) => posting.slug),
      current: editor.originalKey.current,
    });
    if ("error" in slug) return editor.setError(slug.error);

    const next: InternshipPosting = {
      ...draft,
      slug: slug.slug,
      title: draft.title.trim(),
      summary: draft.summary.trim(),
      overview: draft.overview?.trim() || undefined,
      posted: draft.posted.trim() || draft.closes.trim(),
      closes: draft.closes.trim(),
      starts: draft.starts.trim(),
      duration: draft.duration.trim(),
      format: draft.format.trim() || "Live online",
      fee,
      image: draft.image.trim(),
      joinUrl: draft.joinUrl?.trim() || undefined,
      objectives: (draft.objectives ?? []).map((item) => item.trim()).filter(Boolean),
    };
    update((current) => ({
      ...current,
      internships: upsert(current.internships, next, (posting) => posting.slug, editor.originalKey.current),
    }));
    editor.close();
  }

  function remove(posting: InternshipPosting) {
    update((current) => ({
      ...current,
      internships: removeWhere(current.internships, (item) => item.slug, posting.slug),
    }));
    selection.drop(posting.slug);
    editor.setPendingDelete(null);
  }

  function removeSelected() {
    const keys = selection.selectedSet;
    update((current) => ({
      ...current,
      internships: current.internships.filter((posting) => !keys.has(posting.slug)),
    }));
    selection.clear();
    setBulkOpen(false);
  }

  const draft = editor.draft;
  const statusOptions = optionList(internshipStatusLabel);

  return (
    <div>
      <PageIntro
        title="Internship"
        description="Cohort postings. Open a cohort when applications start, and close it when the intake ends."
        action={
          <button type="button" onClick={() => editor.openCreate(blankInternship())} className={primaryBtn}>
            Add cohort
          </button>
        }
      />

      <div className="mt-6 flex flex-col gap-3">
        <div className="md:w-80">
          <SearchBox value={query} onChange={setQuery} placeholder="Search cohorts" />
        </div>
        <Filters
          label="Internship status"
          value={status}
          onChange={setStatus}
          options={[
            { id: "all", label: "All" },
            { id: "open", label: "Open" },
            { id: "closed", label: "Closed" },
          ]}
        />
      </div>
      <p className="mt-3 text-xs font-medium text-muted">
        {filtered.length} of {store.internships.length}
      </p>
      <SelectionBar
        shownKeys={filtered.map((posting) => posting.slug)}
        selectedCount={selection.selected.length}
        onSetVisible={selection.setVisible}
        onDelete={() => setBulkOpen(true)}
        onClear={selection.clear}
      />

      <RecordList
        items={filtered}
        selection={selection}
        columns={["Cohort", "Status", "Closes", "Fee", "Actions"]}
        getKey={(posting) => posting.slug}
        empty={query || status !== "all" ? "Nothing matches that filter." : "Add the first cohort."}
        card={(posting) => (
          <div>
            <p className="font-semibold text-navy">{posting.title}</p>
            <p className="mt-1 text-sm text-muted">{posting.summary}</p>
            <div className="mt-3">
              <InlineSelect
                label={`Status for ${posting.title}`}
                value={posting.status}
                options={statusOptions}
                onChange={(value) => {
                  if (value === "open" || value === "closed") setPostingStatus(posting, value);
                }}
              />
            </div>
            <p className="mt-3 text-sm text-navy">
              {posting.fee} · closes {posting.closes}
            </p>
            <div className="mt-4">
              <Actions
                onEdit={() => editor.openEdit(posting, posting.slug)}
                onDelete={() => editor.setPendingDelete(posting)}
              />
            </div>
          </div>
        )}
        row={(posting) => (
          <tr className={rowClass}>
            <td className={cellClass}>
              <p className="font-medium text-navy">{posting.title}</p>
              <p className="mt-1 max-w-sm text-xs text-muted">{posting.summary}</p>
            </td>
            <td className={cellClass}>
              <InlineSelect
                label={`Status for ${posting.title}`}
                value={posting.status}
                options={statusOptions}
                onChange={(value) => {
                  if (value === "open" || value === "closed") setPostingStatus(posting, value);
                }}
              />
            </td>
            <td className={`${cellClass} whitespace-nowrap`}>
              {posting.closes}
              <span className="mt-1 block text-xs text-muted">Starts {posting.starts}</span>
            </td>
            <td className={`${cellClass} whitespace-nowrap font-semibold`}>{posting.fee}</td>
            <td className={cellClass}>
              <Actions
                onEdit={() => editor.openEdit(posting, posting.slug)}
                onDelete={() => editor.setPendingDelete(posting)}
              />
            </td>
          </tr>
        )}
      />

      {draft ? (
        <Drawer open title={editor.mode === "edit" ? "Edit cohort" : "New cohort"} onClose={editor.close}>
          <EditorForm onSubmit={save} onCancel={editor.close} error={editor.error}>
            <TextField label="Title" value={draft.title} onChange={(title) => editor.patch({ title })} />
            <TextField
              label="URL slug"
              value={draft.slug}
              onChange={(slug) => editor.patch({ slug })}
              hint="Leave this blank to build it from the title."
            />
            <SelectField
              label="Status"
              value={draft.status}
              onChange={(value) => {
                if (value === "open" || value === "closed") editor.patch({ status: value });
              }}
              options={statusOptions}
            />
            <TextArea label="Summary" value={draft.summary} onChange={(summary) => editor.patch({ summary })} rows={3} />
            <TextArea
              label="Overview"
              value={draft.overview ?? ""}
              onChange={(overview) => editor.patch({ overview })}
            />
            <FieldGrid>
              <TextField label="Fee" value={draft.fee} onChange={(fee) => editor.patch({ fee })} placeholder="$149" />
              <TextField label="Format" value={draft.format} onChange={(format) => editor.patch({ format })} />
              <TextField label="Duration" value={draft.duration} onChange={(duration) => editor.patch({ duration })} />
              <TextField label="Posted" value={draft.posted} onChange={(posted) => editor.patch({ posted })} />
              <TextField label="Closes" value={draft.closes} onChange={(closes) => editor.patch({ closes })} />
              <TextField label="Starts" value={draft.starts} onChange={(starts) => editor.patch({ starts })} />
            </FieldGrid>
            <TextField
              label="Join link"
              value={draft.joinUrl ?? ""}
              onChange={(joinUrl) => editor.patch({ joinUrl })}
              hint="Shown after Paystack or Accrue confirms payment."
            />
            <TextArea
              label="Objectives"
              value={(draft.objectives ?? []).join("\n")}
              onChange={(value) => editor.patch({ objectives: value.split("\n") })}
              hint="One objective per line."
            />
          </EditorForm>
        </Drawer>
      ) : null}

      <ConfirmDialog
        open={editor.pendingDelete !== null}
        title="Delete this cohort?"
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
        title={`Delete ${selection.selected.length} cohorts?`}
        body="The selected internships will be removed from the website."
        confirmLabel="Delete"
        onCancel={() => setBulkOpen(false)}
        onConfirm={removeSelected}
      />
    </div>
  );
}
