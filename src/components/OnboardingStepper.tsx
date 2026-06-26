import { Check, Circle, FileText, CreditCard, ShieldCheck, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepKey = "submit" | "pay" | "verify" | "live";

export type StepperState = {
  submitted: boolean;
  paid: boolean;
  verified: boolean;
  live: boolean;
};

const STEPS: { key: StepKey; label: string; icon: any; hint: string }[] = [
  { key: "submit", label: "Submit",        icon: FileText,    hint: "Business details + evidence" },
  { key: "pay",    label: "Pay",           icon: CreditCard,  hint: "Choose a plan via SSLCommerz" },
  { key: "verify", label: "Admin verify",  icon: ShieldCheck, hint: "Our team reviews your evidence" },
  { key: "live",   label: "Live",          icon: Rocket,      hint: "Discoverable in directory + AI" },
];

export default function OnboardingStepper({ state, compact = false }: { state: StepperState; compact?: boolean }) {
  const completion = {
    submit: state.submitted,
    pay: state.paid,
    verify: state.verified,
    live: state.live,
  } as Record<StepKey, boolean>;

  // current = first incomplete step
  const currentIdx = STEPS.findIndex((s) => !completion[s.key]);

  return (
    <div className={cn("glass-card", compact ? "p-4" : "p-5")}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {STEPS.map((s, i) => {
          const done = completion[s.key];
          const active = i === currentIdx;
          const Icon = s.icon;
          return (
            <div key={s.key} className="flex items-center gap-3 flex-1 min-w-[140px]">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center border transition-all",
                  done
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                    : active
                      ? "bg-primary/15 border-primary/50 text-primary-light animate-pulse"
                      : "bg-muted/30 border-border text-muted-foreground"
                )}
              >
                {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <div className="leading-tight">
                <div className={cn("text-sm font-semibold", done ? "text-emerald-400" : active ? "text-foreground" : "text-muted-foreground")}>
                  {s.label}
                </div>
                {!compact && <div className="text-[11px] text-muted-foreground">{s.hint}</div>}
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("flex-1 h-px mx-1 hidden sm:block", done ? "bg-emerald-500/40" : "bg-border")} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
