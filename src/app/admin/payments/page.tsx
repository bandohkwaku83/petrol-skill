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
  blankPayment,
  createId,
  feeAmount,
  formatMoney,
  normalizeFee,
  paymentKindLabel,
  paymentStatusLabel,
  providerLabel,
  removeWhere,
  slugify,
  upsert,
  validEmail,
  type PaymentKind,
  type PaymentRecord,
  type PaymentStatus,
} from "@/lib/admin-store";
import type { PaymentProvider } from "@/lib/internship-payment";

export default function AdminPaymentsPage() {
  const { store, update } = useAdmin();
  const editor = useRecordEditor<PaymentRecord>();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const programListId = useId();

  const filtered = useMemo(
    () =>
      store.payments.filter((payment) => {
        const statusMatch = status === "all" || payment.status === status;
        return (
          statusMatch &&
          includesQuery(query, [payment.name, payment.email, payment.program, payment.reference, payment.provider])
        );
      }),
    [store.payments, query, status],
  );

  const collected = store.payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + feeAmount(payment.amount), 0);
  const pendingAmount = store.payments
    .filter((payment) => payment.status === "pending")
    .reduce((sum, payment) => sum + feeAmount(payment.amount), 0);
  const failed = store.payments.filter((payment) => payment.status === "failed").length;
  const refunded = store.payments.filter((payment) => payment.status === "refunded").length;

  function setPaymentStatus(payment: PaymentRecord, next: PaymentStatus) {
    update((current) => ({
      ...current,
      payments: current.payments.map((item) => (item.id === payment.id ? { ...item, status: next } : item)),
    }));
  }

  function applyProgram(program: string) {
    const course = store.courses.find((item) => item.title === program);
    if (course) {
      editor.patch({ program, kind: "course", slug: course.slug, amount: course.fee });
      return;
    }
    const posting = store.internships.find((item) => item.title === program);
    if (posting) {
      editor.patch({ program, kind: "internship", slug: posting.slug, amount: posting.fee });
      return;
    }
    editor.patch({ program });
  }

  function save(event: FormEvent) {
    event.preventDefault();
    const draft = editor.draft;
    if (!draft) return;
    if (draft.name.trim().length < 2) return editor.setError("Enter the payer’s name.");
    if (!validEmail(draft.email)) return editor.setError("Enter a valid email address.");
    if (!draft.program.trim()) return editor.setError("Enter the program.");
    const amount = normalizeFee(draft.amount);
    if (feeAmount(amount) <= 0) return editor.setError("Enter an amount, such as $249.");
    if (!draft.date.trim()) return editor.setError("Enter the payment date.");

    const next: PaymentRecord = {
      ...draft,
      id: draft.id || createId("pay"),
      name: draft.name.trim(),
      email: draft.email.trim().toLowerCase(),
      program: draft.program.trim(),
      slug: draft.slug || slugify(draft.program),
      amount,
      reference: draft.reference.trim() || `pvl-${draft.kind}-${createId("ref")}`,
      date: draft.date.trim(),
      notes: draft.notes.trim(),
    };
    update((current) => ({
      ...current,
      payments: upsert(current.payments, next, (payment) => payment.id, editor.originalKey.current),
    }));
    editor.close();
  }

  function remove(payment: PaymentRecord) {
    update((current) => ({
      ...current,
      payments: removeWhere(current.payments, (item) => item.id, payment.id),
    }));
    editor.setPendingDelete(null);
  }

  const draft = editor.draft;
  const statusOptions = optionList(paymentStatusLabel);

  return (
    <div>
      <PageIntro
        title="Payments"
        description="Paystack and Accrue payments for courses and internships."
        action={
          <button type="button" onClick={() => editor.openCreate(blankPayment())} className={primaryBtn}>
            Add payment
          </button>
        }
      />

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Summary label="Collected" value={formatMoney(collected)} />
        <Summary label="Pending" value={formatMoney(pendingAmount)} />
        <Summary label="Failed" value={String(failed)} />
        <Summary label="Refunded" value={String(refunded)} />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="md:w-80">
          <SearchBox value={query} onChange={setQuery} placeholder="Search payments" />
        </div>
        <Filters
          label="Payment status"
          value={status}
          onChange={setStatus}
          options={[
            { id: "all", label: "All" },
            { id: "paid", label: "Paid" },
            { id: "pending", label: "Pending" },
            { id: "failed", label: "Failed" },
            { id: "refunded", label: "Refunded" },
          ]}
        />
      </div>
      <p className="mt-3 text-xs font-medium text-muted">
        {filtered.length} of {store.payments.length}
      </p>

      <RecordList
        items={filtered}
        columns={["Payer", "Program", "Amount", "Provider", "Status", "Actions"]}
        getKey={(payment) => payment.id}
        empty={query || status !== "all" ? "Nothing matches that filter." : "Add the first payment."}
        card={(payment) => (
          <div>
            <p className="font-semibold text-navy">{payment.name}</p>
            <p className="mt-1 text-xs text-muted">{payment.email}</p>
            <p className="mt-2 text-sm text-navy">
              {payment.program} · {payment.amount}
            </p>
            <p className="mt-1 text-xs text-muted">
              {providerLabel[payment.provider]} · {payment.date}
            </p>
            <div className="mt-3">
              <InlineSelect
                label={`Status for ${payment.name}`}
                value={payment.status}
                options={statusOptions}
                onChange={(value) => {
                  if (value in paymentStatusLabel) setPaymentStatus(payment, value as PaymentStatus);
                }}
              />
            </div>
            <div className="mt-4">
              <Actions
                onEdit={() => editor.openEdit(payment, payment.id)}
                onDelete={() => editor.setPendingDelete(payment)}
              />
            </div>
          </div>
        )}
        row={(payment) => (
          <tr className={rowClass}>
            <td className={cellClass}>
              <p className="font-medium text-navy">{payment.name}</p>
              <p className="mt-1 text-xs text-muted">{payment.email}</p>
            </td>
            <td className={cellClass}>
              {payment.program}
              <span className="mt-1 block text-xs text-muted">{payment.date}</span>
            </td>
            <td className={`${cellClass} whitespace-nowrap font-semibold`}>{payment.amount}</td>
            <td className={cellClass}>{providerLabel[payment.provider]}</td>
            <td className={cellClass}>
              <InlineSelect
                label={`Status for ${payment.name}`}
                value={payment.status}
                options={statusOptions}
                onChange={(value) => {
                  if (value in paymentStatusLabel) setPaymentStatus(payment, value as PaymentStatus);
                }}
              />
            </td>
            <td className={cellClass}>
              <Actions
                onEdit={() => editor.openEdit(payment, payment.id)}
                onDelete={() => editor.setPendingDelete(payment)}
              />
            </td>
          </tr>
        )}
      />

      {draft ? (
        <Drawer open title={editor.mode === "edit" ? "Edit payment" : "New payment"} onClose={editor.close}>
          <EditorForm onSubmit={save} onCancel={editor.close} error={editor.error}>
            <FieldGrid>
              <TextField label="Name" value={draft.name} onChange={(name) => editor.patch({ name })} />
              <TextField
                label="Email"
                type="email"
                value={draft.email}
                onChange={(email) => editor.patch({ email })}
              />
            </FieldGrid>
            <TextField
              label="Program"
              value={draft.program}
              list={programListId}
              onChange={applyProgram}
              hint="Pick a course or internship, or type a program name."
            />
            <datalist id={programListId}>
              {store.courses.map((course) => (
                <option key={course.slug} value={course.title} />
              ))}
              {store.internships.map((posting) => (
                <option key={posting.slug} value={posting.title} />
              ))}
            </datalist>
            <FieldGrid>
              <SelectField
                label="Kind"
                value={draft.kind}
                onChange={(value) => {
                  if (value === "course" || value === "internship") editor.patch({ kind: value as PaymentKind });
                }}
                options={optionList(paymentKindLabel)}
              />
              <TextField
                label="Amount"
                value={draft.amount}
                onChange={(amount) => editor.patch({ amount })}
                placeholder="$249"
              />
              <SelectField
                label="Provider"
                value={draft.provider}
                onChange={(value) => {
                  if (value === "paystack" || value === "accrue") {
                    editor.patch({ provider: value as PaymentProvider });
                  }
                }}
                options={optionList(providerLabel)}
              />
              <SelectField
                label="Status"
                value={draft.status}
                onChange={(value) => {
                  if (value in paymentStatusLabel) editor.patch({ status: value as PaymentStatus });
                }}
                options={statusOptions}
              />
              <TextField label="Date" value={draft.date} onChange={(date) => editor.patch({ date })} />
              <TextField
                label="Reference"
                value={draft.reference}
                onChange={(reference) => editor.patch({ reference })}
                hint="Leave this blank to generate one."
              />
            </FieldGrid>
            <TextArea label="Notes" value={draft.notes} onChange={(notes) => editor.patch({ notes })} rows={3} />
          </EditorForm>
        </Drawer>
      ) : null}

      <ConfirmDialog
        open={editor.pendingDelete !== null}
        title="Delete this payment?"
        body={
          editor.pendingDelete
            ? `${editor.pendingDelete.name} · ${editor.pendingDelete.amount} will be removed from this portal.`
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

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <article className="border border-navy/10 bg-white px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-navy">{value}</p>
    </article>
  );
}
