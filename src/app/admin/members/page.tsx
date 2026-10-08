"use client";

import { useId, useMemo, useState, type FormEvent } from "react";
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
  SelectField,
  TextArea,
  TextField,
  cellClass,
  includesQuery,
  optionList,
  primaryBtn,
  rowClass,
  useRecordEditor,
} from "@/components/admin/ui";
import {
  blankMember,
  createId,
  memberKindLabel,
  memberStatusLabel,
  removeWhere,
  upsert,
  validEmail,
  type MemberKind,
  type MemberRecord,
  type MemberStatus,
} from "@/lib/admin-store";

export default function AdminMembersPage() {
  const { store, update } = useAdmin();
  const editor = useRecordEditor<MemberRecord>();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const programListId = useId();

  const filtered = useMemo(
    () =>
      store.members.filter((member) => {
        const statusMatch = status === "all" || member.status === status;
        return (
          statusMatch &&
          includesQuery(query, [member.name, member.email, member.phone, member.program, member.notes])
        );
      }),
    [store.members, query, status],
  );

  function count(next: MemberStatus) {
    return store.members.filter((member) => member.status === next).length;
  }

  function setMemberStatus(member: MemberRecord, next: MemberStatus) {
    update((current) => ({
      ...current,
      members: current.members.map((item) => (item.id === member.id ? { ...item, status: next } : item)),
    }));
  }

  function save(event: FormEvent) {
    event.preventDefault();
    const draft = editor.draft;
    if (!draft) return;
    if (draft.name.trim().length < 2) return editor.setError("Enter the member’s name.");
    const email = draft.email.trim().toLowerCase();
    if (!validEmail(email)) return editor.setError("Enter a valid email address.");
    if (!draft.program.trim()) return editor.setError("Enter the program.");
    if (!draft.registered.trim()) return editor.setError("Enter the registration date.");
    const duplicate = store.members.some(
      (member) => member.email.toLowerCase() === email && member.id !== draft.id,
    );
    if (duplicate) return editor.setError("A member with this email is already listed.");

    const next: MemberRecord = {
      ...draft,
      id: draft.id || createId("member"),
      name: draft.name.trim(),
      email,
      phone: draft.phone.trim(),
      program: draft.program.trim(),
      registered: draft.registered.trim(),
      notes: draft.notes.trim(),
    };
    update((current) => ({
      ...current,
      members: upsert(current.members, next, (member) => member.id, editor.originalKey.current),
      suppressedEmails: current.suppressedEmails.filter((item) => item.toLowerCase() !== email),
    }));
    editor.close();
  }

  function remove(member: MemberRecord) {
    const email = member.email.toLowerCase();
    update((current) => ({
      ...current,
      members: removeWhere(current.members, (item) => item.id, member.id),
      suppressedEmails: current.suppressedEmails.some((item) => item.toLowerCase() === email)
        ? current.suppressedEmails
        : [...current.suppressedEmails, email],
    }));
    editor.setPendingDelete(null);
  }

  const draft = editor.draft;
  const statusOptions = optionList(memberStatusLabel);

  return (
    <div>
      <PageIntro
        title="Members"
        description="People registered for a program, plus accounts created on the enroll page."
        action={
          <button type="button" onClick={() => editor.openCreate(blankMember())} className={primaryBtn}>
            Add member
          </button>
        }
      />

      <div className="mt-6 flex flex-col gap-3">
        <div className="md:w-80">
          <SearchBox value={query} onChange={setQuery} placeholder="Search members" />
        </div>
        <Filters
          label="Member status"
          value={status}
          onChange={setStatus}
          options={[
            { id: "all", label: `All ${store.members.length}` },
            { id: "new", label: `New ${count("new")}` },
            { id: "review", label: `In review ${count("review")}` },
            { id: "confirmed", label: `Confirmed ${count("confirmed")}` },
            { id: "waitlist", label: `Waitlist ${count("waitlist")}` },
          ]}
        />
      </div>

      <RecordList
        items={filtered}
        columns={["Member", "Program", "Status", "Registered", "Actions"]}
        getKey={(member) => member.id}
        empty={query || status !== "all" ? "Nothing matches that filter." : "Add the first member."}
        card={(member) => (
          <div>
            <p className="font-semibold text-navy">{member.name}</p>
            <p className="mt-1 text-xs text-muted">{member.email}</p>
            <p className="mt-2 text-sm text-navy">
              {member.program} · {memberKindLabel[member.kind]}
            </p>
            <p className="mt-1 text-xs text-muted">{member.registered}</p>
            <div className="mt-3">
              <InlineSelect
                label={`Status for ${member.name}`}
                value={member.status}
                options={statusOptions}
                onChange={(value) => {
                  if (value in memberStatusLabel) setMemberStatus(member, value as MemberStatus);
                }}
              />
            </div>
            <div className="mt-4">
              <Actions
                onEdit={() => editor.openEdit(member, member.id)}
                onDelete={() => editor.setPendingDelete(member)}
              />
            </div>
          </div>
        )}
        row={(member) => (
          <tr className={rowClass}>
            <td className={cellClass}>
              <p className="font-medium text-navy">{member.name}</p>
              <p className="mt-1 text-xs text-muted">{member.email}</p>
            </td>
            <td className={cellClass}>
              {member.program}
              <span className="mt-1 block text-xs text-muted">{memberKindLabel[member.kind]}</span>
            </td>
            <td className={cellClass}>
              <InlineSelect
                label={`Status for ${member.name}`}
                value={member.status}
                options={statusOptions}
                onChange={(value) => {
                  if (value in memberStatusLabel) setMemberStatus(member, value as MemberStatus);
                }}
              />
            </td>
            <td className={`${cellClass} whitespace-nowrap`}>{member.registered}</td>
            <td className={cellClass}>
              <Actions
                onEdit={() => editor.openEdit(member, member.id)}
                onDelete={() => editor.setPendingDelete(member)}
              />
            </td>
          </tr>
        )}
      />

      {draft ? (
        <Drawer open title={editor.mode === "edit" ? "Edit member" : "New member"} onClose={editor.close}>
          <EditorForm onSubmit={save} onCancel={editor.close} error={editor.error}>
            <FieldGrid>
              <TextField label="Name" value={draft.name} onChange={(name) => editor.patch({ name })} />
              <TextField
                label="Email"
                type="email"
                value={draft.email}
                onChange={(email) => editor.patch({ email })}
              />
              <TextField
                label="Phone"
                type="tel"
                value={draft.phone}
                onChange={(phone) => editor.patch({ phone })}
              />
              <TextField
                label="Registered"
                value={draft.registered}
                onChange={(registered) => editor.patch({ registered })}
              />
            </FieldGrid>
            <TextField
              label="Program"
              value={draft.program}
              list={programListId}
              onChange={(program) => editor.patch({ program })}
            />
            <datalist id={programListId}>
              {store.courses.map((course) => (
                <option key={course.slug} value={course.title} />
              ))}
              {store.internships.map((posting) => (
                <option key={posting.slug} value={posting.title} />
              ))}
              {store.events.map((event) => (
                <option key={event.id} value={event.title} />
              ))}
            </datalist>
            <FieldGrid>
              <SelectField
                label="Kind"
                value={draft.kind}
                onChange={(value) => {
                  if (value in memberKindLabel) editor.patch({ kind: value as MemberKind });
                }}
                options={optionList(memberKindLabel)}
              />
              <SelectField
                label="Status"
                value={draft.status}
                onChange={(value) => {
                  if (value in memberStatusLabel) editor.patch({ status: value as MemberStatus });
                }}
                options={statusOptions}
              />
            </FieldGrid>
            <TextArea label="Notes" value={draft.notes} onChange={(notes) => editor.patch({ notes })} rows={3} />
          </EditorForm>
        </Drawer>
      ) : null}

      <ConfirmDialog
        open={editor.pendingDelete !== null}
        title="Delete this member?"
        body={
          editor.pendingDelete
            ? `${editor.pendingDelete.name} will be removed from this portal.`
            : ""
        }
        confirmLabel="Delete"
        onCancel={() => editor.setPendingDelete(null)}
        onConfirm={() => {
          if (editor.pendingDelete) remove(editor.pendingDelete);
        }}
      />
    </div>
  );
}
