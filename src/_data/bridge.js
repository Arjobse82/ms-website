// Monochrome Bridge's download page (src/bridge.njk), published as the home page of
// monochrome-downloads.github.io/monochrome-services by `npm run bridge` (scripts/export-help.mjs).
//
// Every fact here was checked against the bridge itself (monocode.campaign-manager tools/export-server) on 2026-11-23,
// version 1.9.0. Keep them in step with it:
//   - menu item names: tray_app.py's pystray.MenuItem list ("Copy pairing token to clipboard", "Stop bridge",
//     "Start bridge", "Launch at login", "Reset pairing token…", "Quit");
//   - 127.0.0.1 port 7331 and the 60-minute idle stop: services.py PORT and IDLE_TIMEOUT_SECONDS;
//   - folders only from its own pickers, since 1.9.0: services.py's roots.json allowlist;
//   - Apple silicon only, macOS 14 or later: every binary in the built app is arm64, and its bundled Python's modules
//     need macOS 14.0 (otool LC_BUILD_VERSION minos). The page before this one said "Apple Silicon & Intel": wrong.
//   - the download URL never changes: publish_release.sh always uploads "Monochrome-bridge.dmg" to the latest release.
// Words: ~/.claude/skills/trade-copy/SKILL.md.

const download = "https://github.com/Monochrome-downloads/monochrome-services/releases/latest/download/Monochrome-bridge.dmg";

export default {
  name: "Monochrome Bridge",
  title: "Monochrome Bridge for Mac: download and set up",
  description: "Monochrome Bridge is the free Mac app that writes IDML Export's files to your disk. Download it, set it up in a minute, and see what it can reach.",
  download,
  releases: "https://github.com/Monochrome-downloads/monochrome-services/releases",

  hero: {
    kind: "macOS app for IDML Export",
    subhead: "The free Mac app that writes IDML Export's files to your disk. Plugins for Figma can't save files themselves, so IDML Export hands each export to the bridge.",
    button: "Download for Mac",
    meta: ["Free", "macOS 14 Sonoma or later", "Apple silicon", "Signed and notarised by Apple"],
    caption: "The bridge has no window. It sits in the menu bar as an M, and this menu is all there is to it.",
    // The menu as tray_app.py builds it while the bridge is running. The countdown and the token are examples.
    menu: [
      { text: "Status: Running", dim: true },
      { text: "Auto-stops in 59m 12s if idle", dim: true },
      { rule: true },
      { text: "Stop bridge" },
      { rule: true },
      { text: "Launch at login" },
      { rule: true },
      { text: "Copy pairing token to clipboard", key: true },
      { text: "Token: Xk3fQ2…a9Lw", dim: true },
      { text: "Reset pairing token…" },
      { rule: true },
      { text: "Quit" },
    ],
  },

  setup: {
    label: "Set up",
    heading: "Setting up",
    intro: "You do this once. IDML Export keeps the pairing, and the bridge keeps your folders.",
    steps: [
      { title: "Install", text: "Open the downloaded DMG and drag Monochrome Bridge into your Applications folder." },
      { title: "Open it", text: "Open Monochrome Bridge from Applications. An M appears in the menu bar; no window opens." },
      { title: "Pair it", text: "Click the M and choose Copy pairing token to clipboard. In IDML Export, paste it into the Monochrome Bridge panel and click Save." },
      { title: "Approve your folders", text: "The first time you export to a folder, click Approve beside it in IDML Export and choose it in the picker." },
    ],
  },

  safety: {
    label: "Safety",
    heading: "What the bridge can reach",
    intro: "Everything it does happens on your Mac, in folders you have chosen.",
    groups: [
      {
        title: "This Mac only",
        rows: [
          { name: "Local connections only", text: "It listens at 127.0.0.1, port 7331, and refuses connections from any other computer." },
          { name: "No internet", text: "The bridge makes no connections outside your Mac. Your files and Figma data stay on it." },
        ],
      },
      {
        title: "Pairing",
        rows: [
          { name: "Pairing token", text: "Every request needs it, apart from the check IDML Export makes to see the bridge is running. Another app or a web page can't use the bridge without it." },
          { name: "Reset pairing token…", text: "Makes a new token and copies it. Paste it into IDML Export again, and the old one stops working." },
        ],
      },
      {
        title: "Folders",
        rows: [
          { name: "Folders you choose", text: "The bridge reads and writes only in folders picked in its own picker: your output folder, your Links folder and the folder you save a ZIP to. Anything else is refused." },
          { name: "Where it keeps them", text: "The folder list and the pairing token are in ~/Library/Application Support/Monochrome Bridge." },
        ],
      },
      {
        title: "Running",
        rows: [
          { name: "Only while it's open", text: "Nothing runs in the background. The bridge stops after 60 minutes with no requests; choose Start bridge in its menu to run it again." },
          { name: "Launch at login", text: "Off until you tick it in the menu." },
          { name: "Signed and notarised", text: "Signed with an Apple Developer ID and notarised by Apple, so macOS checks it before it opens." },
        ],
      },
    ],
  },

  questions: {
    label: "Questions",
    heading: "Questions",
    items: [
      { q: "Why does a plugin for Figma need an app?", a: "Plugins for Figma can't write to your disk. IDML Export works out the layout in Figma and sends it to the bridge, which builds the IDML file, writes it and its images to your output folder, and copies in files from your Links folder." },
      { q: "IDML Export says the bridge is offline", a: "Open Monochrome Bridge from Applications. If the M is already in the menu bar, click it: the bridge stops after 60 minutes with no requests, and Start bridge runs it again." },
      { q: "IDML Export says the bridge needs pairing", a: "The token in IDML Export doesn't match the bridge's, usually after a reset. Click the M, choose Copy pairing token to clipboard, and paste it into IDML Export again." },
      { q: "IDML Export shows Approve beside a folder", a: "Since version 1.9.0 the bridge only works in folders chosen in its own picker. Click Approve and choose the folder. Each folder needs this once." },
      { q: "macOS won't open it", a: "The bridge is notarised, so macOS opens it without a warning. If you see one, the copy probably didn't come from this page: download it again here. If the warning stays, contact us through Support." },
      { q: "How do I update it?", a: "IDML Export shows a notice when a newer version is out. Choose Quit in the bridge's menu, download the new version here and drag it into Applications to replace the old one. The pairing token and your folders are kept." },
      { q: "How do I remove it?", a: "Untick Launch at login if it's ticked, choose Quit, and drag Monochrome Bridge from Applications to the Trash. To remove its pairing token and folder list as well, delete ~/Library/Application Support/Monochrome Bridge." },
    ],
  },

  specs: [
    { label: "Price", value: "Free" },
    { label: "Requires", value: "A Mac with Apple silicon, macOS 14 Sonoma or later" },
    { label: "Works with", value: "IDML Export for Figma" },
    { label: "Download", value: "DMG, about 50 MB" },
    { label: "Address", value: "127.0.0.1, port 7331" },
    { label: "Stops after", value: "60 minutes with no requests" },
  ],

  cta: { heading: "Download Monochrome Bridge" },
};
