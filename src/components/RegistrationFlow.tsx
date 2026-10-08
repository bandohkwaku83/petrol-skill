import { registrationSteps } from "@/data/content";

export function RegistrationFlow({ light = false }: { light?: boolean }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {registrationSteps.map((step, i) => (
        <li
          key={step.title}
          className={`p-4 ${
            light ? "border border-white/10 bg-white/5" : "border border-navy/8 bg-sand"
          }`}
        >
          <p
            className={`text-[11px] font-bold uppercase tracking-[0.16em] ${
              light ? "text-orange-soft" : "text-orange"
            }`}
          >
            {String(i + 1).padStart(2, "0")}
          </p>
          <p
            className={`mt-2 font-[family-name:var(--font-display)] text-sm font-semibold ${
              light ? "text-white" : "text-navy"
            }`}
          >
            {step.title}
          </p>
          <p className={`mt-1 text-xs leading-relaxed ${light ? "text-white/65" : "text-muted"}`}>
            {step.detail}
          </p>
        </li>
      ))}
    </ol>
  );
}
