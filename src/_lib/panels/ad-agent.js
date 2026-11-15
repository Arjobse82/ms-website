// Ad Agent's window, explained (src/_data/panels.js): four of its widget cards, a section for each feature. Its words
// are the app's own labels, tooltips and help text (frame-multiplier-indesign at HEAD: src/app/main.ts, the cards'
// bodies and renderRounds, renderNaming, renderFigma, renderOutput, renderAi; src/core/outputs.ts, src/core/ai/qc.ts,
// src/core/ai/permissions.ts; PLAN.md and CLAUDE.md for what they do). Drawings: src/_includes/panel/ad-agent/, drawn
// from ad-agent-panel.js. The rollout itself is drawn by partials/rollout.njk, so its nodes are not repeated here.
import { ICONS } from "../panel-icons.js";
import { adAgentPanel } from "../ad-agent-panel.js";

export default {
  name: "Ad Agent",
  label: "The window", heading: "Its main features, explained", nav: "Window",
  intro: "Ad Agent runs from one window on your Mac. The rollout's nodes fill the window, and the widgets Brief, Masters, Roles, Brand, Output and AI run down its left side. Each widget opens its card over the nodes. Four of those cards are shown here. Each number says what one part of a card does, and its note lights up when you point at it.",
  art: adAgentPanel(),
  tabs: [
    {
      id: "in", label: "Brief and masters",
      summary: "Where a job starts: the sizes in the brief, each round of the brief as it changes, and the InDesign and Figma masters the sizes are made from.",
      tiles: [
        {
          id: "brief", label: "Brief", icon: ICONS.tables,
          summary: "The sizes the job makes, read from the brief's spreadsheet or typed in. Ad Agent keeps each round of the brief and sets how the files are named.",
          notes: [
            { name: "Open brief…", text: "Reads a CSV or Excel brief with a row per size. It finds the columns by their headers, such as Width and Height or a single Size. A row it can't read is reported and left out." },
            { name: "The sizes", text: "Each row is one size in one channel, for one creative, and is listed under them. A row that names no creative applies to every creative. A print row's size is its trim in mm, after its scale." },
            { name: "Type the sizes instead", text: "Width × height in the masters' units, separated by commas, spaces or line breaks. A line can start with its channel, such as “OOH:”." },
            { name: "Rounds", text: "The first time you open a brief, Ad Agent keeps a copy as round 1, and from then on the copy is the brief. The current round is the filled dot. Click another round to look at it, or restore it as the next round." },
            { name: "The update", text: "When the brief's file changes, an orange light comes on. Pull updates reads the change without applying it. Only the sizes it adds or removes turn orange, and a size that is going is struck through." },
            { name: "Apply updates, Discard", text: "Apply makes the update the next round. The last round's files are kept whole in Superseded, and the files of any sizes the update removes leave the output. Discard sets the update aside." },
            { name: "Kept in", text: "Rounds are kept in an Ad Agent folder beside the brief: a copy of each round and the files each update replaced. Ad Agent only ever reads the brief itself." },
            { name: "File names", text: "Automatic names each file by its size, and a size in two channels is one file. With a job number, files are named by tags instead: job number, key, creative, channel, size or a column of the brief, in the order you set." },
          ],
        },
        {
          id: "masters", label: "Masters", icon: ICONS.pages,
          summary: "The InDesign masters, the same masters in Figma beside them, and how they are grouped into creatives.",
          notes: [
            { name: "Choose folder…, Add files…", text: "Takes every .indd and .idml in a folder as the masters, or adds files one at a time." },
            { name: "Your masters", text: "InDesign only ever opens copies of them. Each master is read as soon as you choose it (an .indd is exported to IDML first), and the read is kept in an Ad Agent folder beside the masters. × removes one." },
            { name: "Figma", text: "In Figma, open the masters' file and run the Ad Agent Bridge plugin. Keep its window open while Ad Agent works in Figma. Connected shows the file's name." },
            { name: "Read again", text: "Reads the masters page in Figma again. While the bridge is open, it follows the page as it changes. With Figma closed, its masters stay as last read and nothing in the rollout changes." },
            { name: "Paired with your InDesign masters", text: "Figma's masters are matched to your InDesign masters by name, and both share one set of roles. Each channel is built in one of the two: the one its card chooses, otherwise the one its masters are named or kept for, otherwise InDesign for print and Figma for screens." },
            { name: "Group the masters", text: "How the masters make creatives: by the [CREATIVE] tag in their names, by the picture their hero links, or all as one. Each creative is solved from its own masters, for the brief's rows that name it." },
          ],
        },
      ],
    },
    {
      id: "output", label: "Output",
      summary: "What each channel delivers, PDF, JPG or PNG, and the folders its files are sent to.",
      tiles: [
        {
          id: "output", label: "Output",
          notes: [
            { name: "Output folder", text: "Always Ad Agent sizes, beside the masters. It holds each size's IDML with its JPG preview, and each channel's exports in a sub-folder of its name. With Figma masters alone, it is the folder you choose." },
            { name: "File types", text: "The exports a channel can deliver, one row each: its kind, the channels that deliver it and the folder it goes to. Add one to a channel's card with + File type, or to a single size's." },
            { name: "New file type, Add .joboptions…", text: "Starts a file type of your own, or a PDF file type built from a printer's .joboptions and named after it." },
            { name: "Kind", text: "PDF, JPG or PNG. A JPG or PNG is made at a set resolution, where 72 ppi gives a screen size's own pixels. A JPG also takes a quality and a file size to stay under." },
            { name: "PDF preset", text: "One of InDesign's presets, or a printer's .joboptions, which InDesign loads for the job and removes afterwards. In Figma it is Figma's own PDF export: RGB, with no preset." },
            { name: "Bleed, Crop marks", text: "Follows the preset, or overrides it. Bleed is each size's bleed as its file has it, or none. Crop marks can be on, off, or with a bleed, which turns them on only when the file has a bleed." },
            { name: "Sent to", text: "The folder this file type's files are copied to, from every channel that delivers it. × keeps them in Ad Agent sizes only." },
            { name: "Folders", text: "A folder in the job's folder by its name, such as APPROVALS, or one of its own, with a sub-folder a channel. When it is on, each Run sends it its files last, and turning it on sends the last run's files at once." },
            { name: "InDesign", text: "Measures the masters' text, checks each size and saves its JPG preview. When it is off, the sizes' IDMLs are still written but InDesign's exports are not made." },
          ],
        },
      ],
    },
    {
      id: "review", label: "Review",
      summary: "Every size a run writes is checked by the rules at no cost, and an AI can look at it as well.",
      tiles: [
        {
          id: "ai", label: "AI",
          notes: [
            { name: "Off, Claude, Local", text: "Off: only the rules check the sizes. Claude is Anthropic's, used with your own API key. Local is a model on this Mac, in LM Studio, and nothing leaves the Mac." },
            { name: "Model and key", text: "Sonnet 5.5, Opus 5.5 or Haiku 5.5. Your API key is kept in your Mac's Keychain. Ad Agent's window never holds it, and the Mac side adds it to each request to Anthropic." },
            { name: "Permissions", text: "What the AI may do, each switched on or off. Components' settings, logo profiles, print labels and where channels build start on, and running the job and working in Figma start off. Either way, it sees the whole job." },
            { name: "The rules", text: "Every size a run writes is checked here, free. The rules flag an element further off the page than any master takes it, elements meeting where no master lets them meet, legal text too small to read, a picture with too low a resolution, and InDesign's failed checks." },
            { name: "Review with Claude", text: "Shows the AI each size's picture and layout, one channel at a time beside its masters, and gives a rough cost. Nothing is sent until you press it, and the first time for a job it lists what will be sent." },
            { name: "To fix, All", text: "What was found, under each channel and size: either what to fix before delivery, or everything. AI marks what the AI found, and clicking a size's name opens its card." },
            { name: "Ask", text: "Questions about the job. The AI reads a size's layout, a master or a picture when it needs to, and changes only what it is allowed to. A change it suggests by itself waits for your Approve or Decline." },
          ],
        },
      ],
    },
  ],
};
