"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { OBJECTIONS, EMPTY_BRIEF, type BriefState } from "@/data/objections";

const STORAGE_KEY = "counter-loom-brief-v1";

function loadState(): BriefState {
  if (typeof window === "undefined") return EMPTY_BRIEF;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_BRIEF;
    const parsed = JSON.parse(raw);
    return { ...EMPTY_BRIEF, ...parsed };
  } catch {
    return EMPTY_BRIEF;
  }
}

export default function Home() {
  const [state, setState] = useState<BriefState>(EMPTY_BRIEF);
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota */
    }
  }, [state, hydrated]);

  const set = useCallback(
    (patch: Partial<BriefState>) => setState((s) => ({ ...s, ...patch })),
    []
  );

  const selected = useMemo(
    () =>
      OBJECTIONS.filter((o) => state.included[o.id]).sort((a, b) =>
        a.label.localeCompare(b.label)
      ),
    [state.included]
  );

  const markdown = useMemo(() => buildMarkdown(state, selected), [state, selected]);

  const copy = useCallback(
    async (id: string, text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied((c) => (c === id ? null : c)), 1400);
      } catch {
        /* clipboard unavailable */
      }
    },
    []
  );

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 sm:py-12">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm tracking-wide text-muted">
          <span className="inline-block h-2 w-2 rounded-full bg-accent" />
          Argument workshop
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Counter-Loom
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Stress-test a claim by weaving the <span className="text-ink">strongest</span>{" "}
          version of the opposing view, then your best rebuttal. Built for opinion
          columns, panels, and investment theses.
        </p>
      </header>

      {/* Claim input */}
      <section className="rounded-2xl border border-edge bg-panel p-5">
        <label className="block text-sm font-medium text-muted" htmlFor="claim">
          The claim you&apos;re defending
        </label>
        <textarea
          id="claim"
          value={state.claim}
          onChange={(e) => set({ claim: e.target.value })}
          placeholder="e.g. Platform regulation should require algorithmic transparency before rollout."
          className="mt-2 w-full resize-none rounded-xl border border-edge bg-panel2 px-4 py-3 text-ink outline-none focus:border-accent"
          rows={2}
        />
        <label className="mt-4 block text-sm font-medium text-muted" htmlFor="audience">
          Audience / context (optional)
        </label>
        <input
          id="audience"
          value={state.audience}
          onChange={(e) => set({ audience: e.target.value })}
          placeholder="e.g. Tech policy column for Economic Times"
          className="mt-2 w-full rounded-xl border border-edge bg-panel2 px-4 py-3 text-ink outline-none focus:border-accent"
        />
      </section>

      {/* Objection classes */}
      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Counter-argument classes{" "}
            <span className="text-muted">
              ({selected.length}/{OBJECTIONS.length} selected)
            </span>
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const withAll = OBJECTIONS.reduce<Record<string, boolean>>(
                  (acc, o) => {
                    acc[o.id] = !state.included[o.id];
                    return acc;
                  },
                  { ...state.included }
                );
                set({ included: withAll });
              }}
              className="rounded-lg border border-edge bg-panel2 px-3 py-1.5 text-sm text-muted transition hover:text-ink"
            >
              Toggle all
            </button>
            <button
              onClick={() => {
                set({ included: {}, steelmans: {}, rebuttals: {} });
                setState((s) => ({ ...s, strongestId: "", bestRebut: "" }));
              }}
              className="rounded-lg border border-edge bg-panel2 px-3 py-1.5 text-sm text-muted transition hover:text-ink"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {OBJECTIONS.map((o) => (
            <div
              key={o.id}
              className={`rounded-xl border p-4 transition ${
                state.included[o.id]
                  ? "border-accent/60 bg-panel"
                  : "border-edge bg-panel/40"
              }`}
            >
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={!!state.included[o.id]}
                  onChange={(e) =>
                    set({ included: { ...state.included, [o.id]: e.target.checked } })
                  }
                  className="mt-1 h-4 w-4 accent-[#7c9cff]"
                />
                <div>
                  <div className="font-medium leading-snug">{o.label}</div>
                  <div className="mt-1 text-sm leading-relaxed text-muted">
                    {o.steelman}
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* Steelman + rebuttal rows */}
      {selected.length > 0 && (
        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold">Steelman &amp; rebuttal</h2>
          <p className="text-sm text-muted">
            For each class, keep the objection at its fairest, then write the reply
            that actually answers it.
          </p>
          {selected.map((o) => (
            <div key={o.id} className="rounded-2xl border border-edge bg-panel p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-accent">{o.label}</h3>
                <button
                  onClick={() => {
                    const inc = { ...state.included, [o.id]: false };
                    const ste = { ...state.steelmans };
                    const reb = { ...state.rebuttals };
                    delete ste[o.id];
                    delete reb[o.id];
                    set({ included: inc, steelmans: ste, rebuttals: reb });
                  }}
                  className="text-xs text-muted hover:text-rose"
                >
                  remove
                </button>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted">{o.prompt}</p>
              <textarea
                value={state.steelmans[o.id] ?? ""}
                onChange={(e) =>
                  set({
                    steelmans: { ...state.steelmans, [o.id]: e.target.value },
                  })
                }
                placeholder="Strongest opposing view (steelman)…"
                className="mt-3 w-full resize-none rounded-xl border border-edge bg-panel2 px-4 py-3 text-ink outline-none focus:border-rose"
                rows={3}
              />
              <textarea
                value={state.rebuttals[o.id] ?? ""}
                onChange={(e) =>
                  set({
                    rebuttals: { ...state.rebuttals, [o.id]: e.target.value },
                  })
                }
                placeholder="Your best rebuttal…"
                className="mt-2 w-full resize-none rounded-xl border border-edge bg-panel2 px-4 py-3 text-ink outline-none focus:border-mint"
                rows={3}
              />
            </div>
          ))}
        </section>
      )}

      {/* Synthesis */}
      {selected.length > 0 && (
        <section className="mt-6 rounded-2xl border border-edge bg-panel p-5">
          <h2 className="text-lg font-semibold">Sharpen the through-line</h2>
          <p className="mt-1 text-sm text-muted">
            Choose the single strongest counter-argument and write the reply that
            carries your piece, plus a closing line.
          </p>
          <label className="mt-4 block text-sm font-medium text-muted">
            Strongest counter-argument
          </label>
          <select
            value={state.strongestId}
            onChange={(e) => set({ strongestId: e.target.value })}
            className="mt-2 w-full rounded-xl border border-edge bg-panel2 px-4 py-3 text-ink outline-none focus:border-accent"
          >
            <option value="">— select —</option>
            {selected.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
          <textarea
            value={state.bestRebut}
            onChange={(e) => set({ bestRebut: e.target.value })}
            placeholder="Your best overall rebuttal…"
            className="mt-3 w-full resize-none rounded-xl border border-edge bg-panel2 px-4 py-3 text-ink outline-none focus:border-mint"
            rows={3}
          />
          <textarea
            value={state.closer}
            onChange={(e) => set({ closer: e.target.value })}
            placeholder="Closing line / what this settles…"
            className="mt-2 w-full resize-none rounded-xl border border-edge bg-panel2 px-4 py-3 text-ink outline-none focus:border-accent"
            rows={2}
          />
        </section>
      )}

      {/* Output */}
      {state.claim.trim() && selected.length > 0 && (
        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Output</h2>
            <button
              onClick={() => copy("md", markdown)}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-[#0b0e14] transition hover:brightness-110"
            >
              {copied === "md" ? "Copied ✓" : "Copy Markdown"}
            </button>
          </div>
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl border border-edge bg-panel2 p-5 text-sm leading-relaxed text-ink">
            {markdown}
          </pre>
        </section>
      )}

      {!state.claim.trim() && (
        <p className="mt-6 text-sm text-muted">
          Start by entering the claim you want to defend above, then pick the
          counter-argument classes to weave in.
        </p>
      )}

      {/* New brief */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={() => {
            setState({ ...EMPTY_BRIEF, included: {} });
          }}
          className="rounded-lg border border-edge bg-panel2 px-4 py-2 text-sm text-muted transition hover:text-ink"
        >
          Start a fresh brief
        </button>
      </div>
    </main>
  );
}

function buildMarkdown(state: BriefState, selected: typeof OBJECTIONS): string {
  const lines: string[] = [];
  if (state.claim.trim()) lines.push(`# ${state.claim.trim()}`);
  if (state.audience.trim()) {
    lines.push(`\n**Audience / context:** ${state.audience.trim()}`);
  }
  lines.push("");

  for (const o of selected) {
    const ste = (state.steelmans[o.id] ?? "").trim();
    const reb = (state.rebuttals[o.id] ?? "").trim();
    if (!ste && !reb) continue;
    lines.push(`## ${o.label}`);
    if (ste) lines.push(`\n**Steelman —** ${ste}`);
    if (reb) lines.push(`\n**Rebuttal —** ${reb}`);
    lines.push("");
  }

  if (state.strongestId) {
    const o = OBJECTIONS.find((x) => x.id === state.strongestId);
    lines.push("## Strongest counter-argument");
    if (o) lines.push(`\n**${o.label}**`);
    const ste = (state.steelmans[state.strongestId] ?? "").trim();
    if (ste) lines.push(`\n${ste}`);
    if (state.bestRebut.trim()) {
      lines.push(`\n**Best reply —** ${state.bestRebut.trim()}`);
    }
    lines.push("");
  }

  if (state.closer.trim()) {
    lines.push(`## Close\n\n${state.closer.trim()}`);
    lines.push("");
  }

  return lines.join("\n").trim() || "_(nothing drafted yet)_";
}