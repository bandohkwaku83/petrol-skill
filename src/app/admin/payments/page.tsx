"use client";

import { useMemo, useState } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import {
  Actions,
  ConfirmDialog,
  Filters,
  InlineSelect,
  PageIntro,
  RecordList,
  SearchBox,
  SelectionBar,
  cellClass,
  includesQuery,
  optionList,
  rowClass,
  useRecordEditor,
  useRowSelection,
} from "@/components/admin/ui";
import {
  feeAmount,
  formatMoney,
  paymentStatusLabel,
  providerLabel,
  removeWhere,
  type PaymentRecord,
  type PaymentStatus,
} from "@/lib/admin-store";

export default function AdminPaymentsPage() {
  const { store, update } = useAdmin();
  const editor = useRecordEditor<PaymentRecord>();
  const selection = useRowSelection();
  const [bulkOpen, setBulkOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

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

  function remove(payment: PaymentRecord) {
    update((current) => ({
      ...current,
      payments: removeWhere(current.payments, (item) => item.id, payment.id),
    }));
    selection.drop(payment.id);
    editor.setPendingDelete(null);
  }

  function removeSelected() {
    const keys = selection.selectedSet;
    update((current) => ({
      ...current,
      payments: current.payments.filter((payment) => !keys.has(payment.id)),
    }));
    selection.clear();
    setBulkOpen(false);
  }

  const statusOptions = optionList(paymentStatusLabel);

  return (
    <div>
      <PageIntro
        title="Payments"
        description="People who started or completed checkout with Paystack or Accrue. This list is not for adding payments by hand."
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
      <SelectionBar
        shownKeys={filtered.map((payment) => payment.id)}
        selectedCount={selection.selected.length}
        onSetVisible={selection.setVisible}
        onDelete={() => setBulkOpen(true)}
        onClear={selection.clear}
      />

      <RecordList
        items={filtered}
        selection={selection}
        columns={["Payer", "Program", "Amount", "Provider", "Status", "Actions"]}
        getKey={(payment) => payment.id}
        empty={query || status !== "all" ? "Nothing matches that filter." : "No one has started a payment yet."}
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
              <Actions onDelete={() => editor.setPendingDelete(payment)} />
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
              <Actions onDelete={() => editor.setPendingDelete(payment)} />
            </td>
          </tr>
        )}
      />

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
      <ConfirmDialog
        open={bulkOpen}
        title={`Delete ${selection.selected.length} payments?`}
        body="The selected payments will be removed from this list."
        confirmLabel="Delete"
        onCancel={() => setBulkOpen(false)}
        onConfirm={removeSelected}
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
