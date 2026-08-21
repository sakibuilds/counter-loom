export interface Objection {
  id: string;
  label: string;
  steelman: string;
  prompt: string;
}

// Curated library of common counter-argument classes, each with a
// "steel man" starter framing (the strongest honest version of the objection)
// and a prompt for drafting the rebuttal.
export const OBJECTIONS: Objection[] = [
  {
    id: "evidence-gap",
    label: "Evidence gap",
    steelman:
      "The strongest version of the opposing view is not that the idea is wrong, but that the claim outruns the proof: the evidence cited is thin, dated, or drawn from a context that doesn't translate, so the conclusion is asserted rather than demonstrated.",
    prompt:
      "For this objection class, write the honest case a sharp critic would make, then your best rebuttal (what evidence is actually available, and why the inference still holds).",
  },
  {
    id: "unrepresentative",
    label: "Unrepresentative case",
    steelman:
      "The opposing view is that a single vivid case is doing the rhetorical work: what is presented as the driver is actually the exception, and a representative sample would not support the generalisation you've drawn.",
    prompt:
      "Draft the counterargument that the example is not the pattern, then the rebuttal: show the case is diagnostic, not decorative, and that the mechanism generalises.",
  },
  {
    id: "tradeoff",
    label: "Hidden trade-off",
    steelman:
      "The objection is not that the outcome is undesirable but that the cost is being ignored: someone pays for this benefit in price, control, or lost opportunity, and that price has not been priced in.",
    prompt:
      "Name the real trade-off a critic would insist on, then the rebuttal: argue the cost is outweighed, compensating, or acceptable relative to the alternative.",
  },
  {
    id: "unintended-consequence",
    label: "Unintended consequence",
    steelman:
      "The opposing view is a second-order one: even if the immediate effect holds, the fix invites evasion, gaming, or a worse substitute that ultimately outweighs the gain.",
    prompt:
      "Write the unintended-consequence objection as fairly as you can, then the rebuttal: why the perverse outcome is unlikely, guardable, or still better than doing nothing.",
  },
  {
    id: "black-box",
    label: "Black box / unverifiable",
    steelman:
      "The objection is that the mechanism is asserted, not shown: the link between cause and effect is a black box, so the 'so what' cannot be inspected, reproduced, or independently verified.",
    prompt:
      "State the unverifiable-mechanism concern, then the rebuttal: what observable proxy, precedent, or transparency makes the mechanism checkable.",
  },
  {
    id: "doesnt-scale",
    label: "Won't scale / won't implement",
    steelman:
      "The strongest version of the pushback is feasibility: it works in the specific case but not at the required scale or in practice, because the constraint that makes it work is exactly the one that won't generalise.",
    prompt:
      "Articulate the implementation objection honestly, then the rebuttal: show a credible path where the binding constraint is relaxed or overstated.",
  },
  {
    id: "slippery-slope",
    label: "Precedent / slippery slope",
    steelman:
      "The objection is categorical: the instance is smaller than the class it licenses, so conceding this one normalises the category and the boundary drawn today will not hold tomorrow.",
    prompt:
      "Draft the precedent-based objection at its most principled, then the rebuttal: where the line is actually held, why this case is categorically different, or why the slope has a safety rail.",
  },
  {
    id: "audience-mismatch",
    label: "Wrong audience / framing",
    steelman:
      "The pushback is that the framing is aimed at the wrong audience: it persuades the already-convinced and misses the actual decision-maker, whose interests and constraints it never engages.",
    prompt:
      "Spell out the audience-mismatch critique, then the rebuttal: reframe so the argument meets the decision-maker's interest, not the convert's.",
  },
  {
    id: "false-analogy",
    label: "False analogy",
    steelman:
      "The objection is that an analogy is doing the persuasive work and it is a false one: the two situations differ in precisely the variable that determines the outcome, so the parallel is misleading.",
    prompt:
      "Name the contested analogy at its strongest, then the rebuttal: show the parallel holds on the decisive variable, or drop the analogy for a stronger argument.",
  },
  {
    id: "should-vs-can",
    label: "Should, but never 'can'",
    steelman:
      "The opposing view is that the argument proves it should happen but never establishes it can: good intentions without a credible, funded, or practical path to being real.",
    prompt:
      "Write the desirability-without-feasibility objection, then the rebuttal: supply the mechanism, the precedent, or the test that bridges 'should' to 'can'.",
  },
];

export interface BriefState {
  claim: string;
  audience: string;
  included: Record<string, boolean>;
  steelmans: Record<string, string>;
  rebuttals: Record<string, string>;
  strongestId: string;
  bestRebut: string;
  closer: string;
}

export const EMPTY_BRIEF: BriefState = {
  claim: "",
  audience: "",
  included: {},
  steelmans: {},
  rebuttals: {},
  strongestId: "",
  bestRebut: "",
  closer: "",
};