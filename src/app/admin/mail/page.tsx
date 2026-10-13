"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import {
  PageIntro,
  SearchBox,
  TextArea,
  TextField,
  ghostBtn,
  includesQuery,
  primaryBtn,
} from "@/components/admin/ui";
import { memberKindLabel, validEmail } from "@/lib/admin-store";

type Person = {
  email: string;
  name: string;
  detail: string;
};

export default function AdminMailPage() {
  const { store } = useAdmin();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const people = useMemo(() => {
    const unique = new Map<string, Person>();
    for (const member of store.members) {
      const email = member.email.trim().toLowerCase();
      if (!validEmail(email) || unique.has(email)) continue;
      unique.set(email, {
        email,
        name: member.name.trim() || email,
        detail: `${member.program || "Member"} · ${memberKindLabel[member.kind]}`,
      });
    }
    return [...unique.values()];
  }, [store.members]);

  const visible = useMemo(
    () => people.filter((person) => includesQuery(query, [person.name, person.email, person.detail])),
    [people, query],
  );

  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const shownSelected = visible.filter((person) => selectedSet.has(person.email)).length;

  function toggle(email: string) {
    setConfirming(false);
    setNotice("");
    setSelected((current) =>
      current.includes(email) ? current.filter((item) => item !== email) : [...current, email],
    );
  }

  function selectVisible() {
    setConfirming(false);
    setNotice("");
    setSelected((current) => [...new Set([...current, ...visible.map((person) => person.email)])]);
  }

  function clearVisible() {
    setConfirming(false);
    setNotice("");
    const hide = new Set(visible.map((person) => person.email));
    setSelected((current) => current.filter((email) => !hide.has(email)));
  }

  function prepare(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (selected.length === 0) {
      setError("Choose at least one person.");
      return;
    }
    if (subject.trim().length < 2) {
      setError("Enter a subject.");
      return;
    }
    if (message.trim().length < 2) {
      setError("Write the message.");
      return;
    }
    setConfirming(true);
  }

  async function send() {
    setError("");
    setNotice("");
    setPending(true);
    const recipients = people
      .filter((person) => selectedSet.has(person.email))
      .map((person) => ({ name: person.name, email: person.email }));

    try {
      const response = await fetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          message: message.trim(),
          recipients,
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        sent?: number;
      } | null;
      if (!response.ok || !data?.ok) {
        setError(data?.error || "The email did not send.");
        setConfirming(false);
        setPending(false);
        return;
      }
      setNotice(`Sent to ${data.sent ?? recipients.length} ${recipients.length === 1 ? "person" : "people"}.`);
      setSubject("");
      setMessage("");
      setSelected([]);
      setConfirming(false);
    } catch {
      setError("The email service did not respond. Try again.");
      setConfirming(false);
    }
    setPending(false);
  }

  return (
    <div>
      <PageIntro
        title="Email"
        description="Write to everyone on the list, or pick particular people. Each person receives their own copy."
      />

      <form onSubmit={prepare} className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="border border-navy/10 bg-white">
          <div className="border-b border-navy/8 p-4">
            <SearchBox value={query} onChange={setQuery} placeholder="Search people" />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                {selected.length} selected · {people.length} people
              </p>
              <div className="flex gap-2">
                <button type="button" onClick={selectVisible} className={ghostBtn}>
                  {query.trim() ? "Select shown" : "Select all"}
                </button>
                <button type="button" onClick={clearVisible} className={ghostBtn}>
                  Clear
                </button>
              </div>
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="px-4 py-8 text-sm text-muted">
              {people.length === 0 ? "No one with an email is on the list yet." : "Nothing matches that search."}
            </p>
          ) : (
            <ul className="max-h-[32rem] divide-y divide-navy/8 overflow-y-auto">
              {visible.map((person) => {
                const checked = selectedSet.has(person.email);
                return (
                  <li key={person.email}>
                    <label className="flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-sand/70">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(person.email)}
                        className="mt-1 h-4 w-4 accent-orange"
                      />
                      <span className="min-w-0">
                        <span className="block font-medium text-navy">{person.name}</span>
                        <span className="mt-0.5 block text-xs text-muted">{person.email}</span>
                        <span className="mt-1 block text-xs text-navy/70">{person.detail}</span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
          {query.trim() && shownSelected > 0 ? (
            <p className="border-t border-navy/8 px-4 py-2 text-xs text-muted">
              {shownSelected} of the people shown are selected.
            </p>
          ) : null}
        </section>

        <section className="border border-navy/10 bg-white p-4 md:p-5">
          <div className="space-y-4">
            <TextField label="Subject" value={subject} onChange={setSubject} placeholder="Cohort opening next week" />
            <TextArea
              label="Message"
              value={message}
              onChange={setMessage}
              rows={12}
              placeholder="Write the note they should receive."
            />
          </div>

          {error ? (
            <p role="alert" className="mt-4 border border-orange/30 bg-orange/10 px-3 py-2 text-sm text-navy">
              {error}
            </p>
          ) : null}
          {notice ? (
            <p role="status" className="mt-4 border border-blue/20 bg-blue/10 px-3 py-2 text-sm text-navy">
              {notice}
            </p>
          ) : null}

          {confirming ? (
            <div className="mt-5 border border-navy/10 bg-sand p-4">
              <p className="text-sm text-navy">
                Send this to {selected.length} {selected.length === 1 ? "person" : "people"}?
              </p>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => void send()} disabled={pending} className={primaryBtn}>
                  {pending ? "Sending…" : "Send email"}
                </button>
                <button type="button" onClick={() => setConfirming(false)} disabled={pending} className={ghostBtn}>
                  Back
                </button>
              </div>
            </div>
          ) : (
            <button type="submit" className={`${primaryBtn} mt-5 w-full`}>
              Review and send
            </button>
          )}
        </section>
      </form>
    </div>
  );
}
