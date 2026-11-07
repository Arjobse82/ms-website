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
  intro: "Ad Agent works from one window on your Mac. The rollout's nodes fill it, and down its left side are its widgets, Brief, Masters, Roles, Brand, Output and AI, each opening its card over the nodes. Here are four of those cards. Each number says what a part of a card does, and the note beside it lights up as you point at it.",
  art: adAgentPanel(),
  tabs: [
    {
      id: "in", label: "Brief and masters",
      summary: "Where a job starts: the sizes in the brief, each round of it as it changes, and the InDesign and Figma masters the sizes are made from.",
      tiles: [
        {
          id: "brief", label: "Brief", icon: ICONS.tables,
          summary: "The sizes the job makes, read from the brief's spreadsheet or typed, each round of the brief kept, and how the files are named.",
          notes: [
            { name: "Open brief…", text: "Reads a CSV or Excel brief, a row per size. Its columns are found by their headers, such as Width and Height or a single Size, and a row it cannot read is said and left out." },
            { name: "The sizes", text: "Each row is a size in a channel, for a creative, and is listed under them. A row that names no creative is every creative's; a print row's size is its trim in mm, after its scale." },
            { name: "Type the sizes instead", text: "Width × height in the masters' units, with commas, spaces or lines between them. A line may start with its channel, as “OOH:”." },
            { name: "Rounds", text: "The first time a brief is opened, a copy of it is kept as round 1, and from then on the copy is the brief. The current round is the filled dot; click another to see it for reference, or restore it as the next round." },
            { name: "The update", text: "When the brief's file changes, an orange light says so, and Pull updates reads it without applying anything. Only the sizes it adds or takes away turn orange, a going one struck through." },
            { name: "Apply updates, Discard", text: "Apply makes the update the next round. The last round's files are kept whole in Superseded, and those of the sizes it takes away leave the output; Discard sets the update aside." },
            { name: "Kept in", text: "The rounds are kept in an Ad Agent folder beside the brief: a copy of each round, and the files each update replaced. The brief itself is only ever read." },
            { name: "File names", text: "Automatic names each file by its size, and a size in two channels is one file. A job number names them by tags instead: job number, key, creative, channel, size or a column of the brief, in the order you set." },
          ],
        },
        {
          id: "masters", label: "Masters", icon: ICONS.pages,
          summary: "The InDesign masters, the same masters in Figma beside them, and how they are grouped into creatives.",
          notes: [
            { name: "Choose folder…, Add files…", text: "Takes every .indd and .idml in a folder as the masters, or adds files one at a time." },
            { name: "Your masters", text: "InDesign only ever opens copies of them. Each is read as soon as it is chosen, an .indd exported to IDML first, and the read is kept in an Ad Agent folder beside them; × takes one out." },
            { name: "Figma", text: "In Figma, open the masters' file and run Ad Agent Bridge, a plugin, and keep its window open while Ad Agent works there. Connected names the file." },
            { name: "Read again", text: "Reads the masters page in Figma again, and while the bridge is open it follows the page as it changes. With Figma closed, its masters stay as last read and nothing in the rollout changes." },
            { name: "Paired with your InDesign masters", text: "Figma's masters are matched to your InDesign masters by name, and both keep one set of roles. Each channel is built in one of the two: the one its card chooses, else the one its masters are named or kept for, else InDesign for print and Figma for screens." },
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
            { name: "Output folder", text: "Ad Agent sizes, beside the masters, always: each size's IDML with its JPG preview, and a channel's exports in a sub-folder of its name. With Figma's masters alone, the folder you choose." },
            { name: "File types", text: "The exports a channel can deliver, a row each: its kind, the channels that deliver it and the folder it goes to. Put one on a channel's card with + File type, or on a single size's." },
            { name: "New file type, Add .joboptions…", text: "Starts a file type of your own, or a PDF file type from a printer's .joboptions, named after it." },
            { name: "Kind", text: "PDF, JPG or PNG. A JPG or PNG is made at a resolution, 72 ppi being a screen size's own pixels; a JPG also takes a quality, and a file size to stay under." },
            { name: "PDF preset", text: "One of InDesign's presets, or a printer's .joboptions, which InDesign loads for the job and removes after. In Figma, Figma's own PDF: RGB, without the preset." },
            { name: "Bleed, Crop marks", text: "As the preset has them, or set over it: each size's bleed as its file has it, or none; crop marks on, off, or with a bleed, on only when the file has one." },
            { name: "Sent to", text: "The folder this file type's files are copied to, from every channel that delivers it. × keeps them in Ad Agent sizes alone." },
            { name: "Folders", text: "A folder in the job's folder by its name, such as APPROVALS, or one of its own, with a sub-folder a channel. On, each Run sends it its files last; turning it on sends the last run's at once." },
            { name: "InDesign", text: "Measures the masters' text, checks each size and saves its JPG preview. Off, the sizes' IDMLs are still written, but InDesign's exports are not made." },
          ],
        },
      ],
    },
    {
      id: "review", label: "Review",
      summary: "Every size a run writes is checked by the rules, free, and can be looked at by an AI as well.",
      tiles: [
        {
          id: "ai", label: "AI",
          notes: [
            { name: "Off, Claude, Local", text: "Off: the rules alone check the sizes. Claude is Anthropic's, with your own API key; Local is a model on this Mac, in LM Studio, and nothing leaves it." },
            { name: "Model and key", text: "Sonnet 5.5, Opus 5.5 or Haiku 5.5. Your API key is kept in your Mac's Keychain: Ad Agent's window never holds it, and the Mac side adds it to each request to Anthropic." },
            { name: "Permissions", text: "What the AI may do, each on or off: components' settings, logo profiles, print labels and where channels build are on to start with, running the job and working in Figma off. It sees the whole job either way." },
            { name: "The rules", text: "Every size a run writes is checked here, free: an element further off the page than any master takes it, elements meeting where no master lets them meet, legal text too small to read, a picture too low in resolution, and InDesign's failed checks." },
            { name: "Review with Claude", text: "Shows the AI each size's picture and layout, a channel at a time beside its masters, and says roughly what it will cost. Nothing is sent until you press it, and the first time for a job it says what goes." },
            { name: "To fix, All", text: "What was found, under each channel and size: what to fix before delivery, or everything. AI marks what the AI found, and a size's name opens its card." },
            { name: "Ask", text: "Questions about the job. The AI reads a size's layout, a master or a picture when it needs to, and changes only what it is let; a change it suggests by itself waits for your Approve or Decline." },
          ],
        },
      ],
    },
  ],
};
