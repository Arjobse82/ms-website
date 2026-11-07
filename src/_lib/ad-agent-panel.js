// What the Ad Agent window's drawings show (panels.js, src/_includes/panel/ad-agent/): four of its widget cards, Brief,
// Masters, Output and AI, as the app draws them (frame-multiplier-indesign src/app/main.ts at HEAD: the cards' bodies,
// renderRounds, renderNaming, renderFigma, renderOutput, renderAi; src/core/outputs.ts DEFAULT_TYPES and typeWords,
// src/core/ai/qc.ts for the rules' words). The job is the one the rollout on the same page draws (src/_data/rollout.js):
// the Spring campaign, its brief.xlsx, the HERO and OFFER creatives, OOH, DOOH and Social, and the files PDF-DESPATCH,
// PDF-LORES, JPG and PNG. Here the brief's next round has just been pulled: one size added, one going.

// The app's import glyph (main.ts IMPORT_ICON): an arrow into a tray, on the dashed buttons that bring files in.
const IMPORT = '<svg viewBox="0 0 16 16" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 1.5v8.5M4.5 6.5 8 10l3.5-3.5"/><path d="M2 10.5v3.5h12v-3.5"/></g></svg>';

// The brief: round 2's sizes under their creative and channel (a row naming no creative is every creative's), with the
// update pulled: 1920 × 1080 new on DOOH, Social's 1080 × 1350 going (diffBriefs lists the going rows last).
const GROUPS = [
  { label: "HERO · OOH", sizes: [{ label: "1200 × 1800 mm" }, { label: "6096 × 3048 mm" }] },
  { label: "HERO · DOOH", sizes: [{ label: "1080 × 1920" }, { label: "1920 × 1080", diff: "new" }] },
  { label: "Social", sizes: [{ label: "1080 × 1080" }, { label: "1080 × 1350", diff: "going" }] },
];
const SIZES = GROUPS.reduce((n, g) => n + g.sizes.length, 0);
const COLUMNS = ["Creative", "Channel", "Width", "Height", "Unit"];

// The masters: two of HERO and one of OFFER, by the [CREATIVE] tag in their names.
const MASTERS = ["[HERO] 1080x1350.indd", "[HERO] 1920x1080.indd", "[OFFER] 1080x1080.indd"];

// Output: the default file types (src/core/outputs.ts DEFAULT_TYPES, the owner's names), the channels that deliver
// each as the rollout links them, and the job's two folders, in its folder by name.
const TYPES = [
  { name: "JPG", kind: "JPG", channels: "DOOH, Social", words: "72 ppi · high quality", to: "APPROVALS" },
  { name: "PDF-DESPATCH", kind: "PDF", channels: "OOH", words: "[PDF/X-4:2008] · the file's bleed · crop marks with a bleed", to: "DESPATCH", chosen: true },
  { name: "PDF-LORES", kind: "PDF", channels: "OOH", words: "[Smallest File Size] · no bleed · no marks", to: "APPROVALS" },
  { name: "PNG", kind: "PNG", channels: "Social", words: "72 ppi" },
];
const FOLDERS = [
  { name: "APPROVALS", on: true, path: "…/Spring campaign/APPROVALS" },
  { name: "DESPATCH", on: false, path: "…/Spring campaign/DESPATCH" },
];

// The review: the rules' two problems and the AI's one check, a size each, under their channels (qc.ts's words).
const FINDINGS = [
  { channel: "HERO · OOH", size: "6096 × 3048 mm", problem: true, words: "tulips.psd in Hero (Tulips) is about 118 ppi at the size supplied: it will print soft; 300 is wanted" },
  { channel: "HERO · DOOH", size: "1080 × 1920", problem: true, words: "Legal text (Terms) is about 7.5 px tall: too small to read" },
  { channel: "OFFER · Social", size: "1080 × 1080", ai: true, words: "The price sits close to the logo: a little more room between them would read better" },
];
const counted = (fs) => { const p = fs.filter((f) => f.problem).length; return `${p} to fix, ${fs.length - p} to look at`; };

export function adAgentPanel() {
  return {
    importIcon: IMPORT,
    brief: { file: "brief.xlsx", sheet: "Sizes", sizes: SIZES, groups: GROUPS, header: 2, columns: COLUMNS.map((c) => `“${c}”`).join(", ") },
    rounds: { now: 2, list: [1, 2], kept: "…/Spring campaign/Ad Agent/brief" },
    masters: MASTERS.map((name) => ({ name, kind: name.split(".").pop().toUpperCase() })),
    figma: { file: "Spring campaign", page: "[Masters] Spring", masters: MASTERS.length },
    out: "…/Spring campaign/Masters/Ad Agent sizes",
    types: TYPES,
    folders: FOLDERS,
    findings: FINDINGS,
    found: counted(FINDINGS),
    rules: counted(FINDINGS.filter((f) => !f.ai)),
    ai: counted(FINDINGS.filter((f) => f.ai)),
    fix: FINDINGS.filter((f) => f.problem).length,
  };
}
