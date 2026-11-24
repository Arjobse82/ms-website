// Frame Multiplier's panel, explained (src/_data/panels.js): its words are the plugin's tooltips, legend and listing
// (monocode.campaign-manager src/main/apps/rollout/ui/ui.html and ui.ts, docs/frame-multiplier-listing.md). Drawings:
// src/_includes/panel/frame-multiplier/, drawn from fm-panel.js.
import { frameMultiplierPanel } from "../fm-panel.js";
import { fmHelpArt } from "../fm-help-art.js";

// The help page's first two sections (partials/help-page.njk `guide`), each step a drawing
// (panel/frame-multiplier/how-<id>.njk): the least a first rollout needs, then the four settings for the frames the
// basics don't get right. The facts are the ones `prepare` below gives in full.
const guide = [
  {
    id: "basics", label: "The basics", nav: "Basics", heading: "The basic setup",
    subhead: "Start with the basic setup, which is all a first rollout needs. Then come the four settings for frames that need more help, every control in the panel, and the everyday jobs.",
    intro: "A first rollout needs four things: master frames on one page, shared components where the masters use the same element, a role for each component, and a page of empty frames. Everything else is optional.",
    steps: [
      { id: "masters", name: "A masters page", text: "Design the master frames yourself, for example a tall, a square and a wide one, and put them on a page with [MASTERS] in its name. Frame Multiplier finds that page by itself. Every visible frame directly on the page is a master. Frames inside a section or a group aren't read." },
      { id: "components", name: "Shared components where they fit", text: "Make the background, hero, headline, logo and legal components. Where two or more masters use the same element, use an instance of the same main component in each. That's how Frame Multiplier knows the headline in the square is the headline in the wide one, and blends between them. The masters don't all need the same components: a wide master can use a headline of its own, for example. A component is blended only between the masters that use it." },
      { id: "roles", name: "A role for each component", text: "Open Frame Multiplier, check the masters page under Masters and press Okay. Components lists each layer with the role Frame Multiplier guessed. Click a role to change it: bg, hero, bg/hero, headline, logo, legal or other. Name a layer HERO, HEADLINE, BG or LOGO and the guess is right first time." },
      { id: "frames", name: "A page of empty frames", text: "On another page, make empty frames at the sizes the job needs, directly on the page. Import brief with AI, behind the cog, can make them from the client's brief." },
      { id: "multiply", name: "Scan, then Multiply", wide: true, text: "Go to that page, open the Frames tab and press Scan for updates. Each frame gets a plan and a score before anything is written; click a frame to see its plan drawn over it. Then click Multiply. Every frame is filled from the masters nearest its shape, in one undo step." },
    ],
  },
  {
    id: "further", label: "Going further", nav: "Going further", heading: "Four settings for the frames that need more",
    intro: "Most frames come right from the basics. When one doesn't, these four settings fix it layer by layer. Each one is saved on the layer in your Figma file, so everyone who opens the file gets the same frames.",
    steps: [
      { id: "focal", name: "Focal path", text: "The focal is the part of a hero photo that must stay in view. Draw a box around it inside the layer, in the main component, and name it focal. Every size then keeps that box in view. Without one, Frame Multiplier guesses the subject from the pixels and the Fo column shows A. Draw one when the Fo cell turns red." },
      { id: "collision", name: "Collision path", text: "The hero keeps clear of the copy. Where the blend would put it under the headline, it is nudged first, then scaled down. It keeps clear using a closed path named collision inside the layer, or else the cut-out's edge, or else the whole layer box. In an opaque photo, draw one around the product, or the whole photo is kept clear of the copy." },
      { id: "pin", name: "Pin", text: "Pin keeps a layer the same distance from a corner of the frame in every size. It's read from the masters automatically. If a logo or the legal drifts away from its corner, click its P cell and pick the corner." },
      { id: "stretch", name: "Stretch", text: "The S column sets whether a layer keeps its shape or stretches to fill. Automatic reads it from the masters: a band whose proportions change from master to master stretches. Click the S cell to go from automatic to uniform (Scale | Constrain), then stretch (Scale | Stretch), then back. The hero, bg/hero, headline and logo stay uniform unless you set otherwise." },
    ],
  },
];

export default {
  name: "Frame Multiplier",
  intro: "Frame Multiplier has one panel in Figma with two tabs, Setup and Frames, and its settings behind the cog. Each number marks a part of the panel, and its note lights up when you point at it.",
  art: { ...frameMultiplierPanel(), guide: fmHelpArt() },
  guide,
  tabs: [
    {
      id: "setup", label: "Setup",
      summary: "Where the masters come from, and the role and behaviour of each of their components when a frame changes shape.",
      tiles: [
        {
          id: "setup", label: "Setup",
          notes: [
            { name: "Masters page", text: "The page Frame Multiplier reads the masters from. Every visible frame on it is a master. A page named [MASTERS] or [TEMPLATES] is found automatically." },
            { name: "Okay", text: "Reads the masters on that page and works out each layer's role and behaviour. It reads only the masters and leaves the page you are on alone." },
            { name: "Concept", text: "Masters that share a hero or background component, or a [bracket] label, form one concept, so a page can hold several creatives at once. Click a concept to show its masters in Figma." },
            { name: "Role", text: "Background, hero, bg/hero, headline, logo, legal or other, each with its glyph. Until you pick one, the role is the engine's guess. A role you pick is set on every master the layer is in." },
            { name: "P · Pin", text: "Holds the position by a corner or an anchor point. A headline anchors by its place on the frame and its text alignment, with A for automatic." },
            { name: "C · Clamp", text: "Keeps an image edge from coming into the frame. On a hero, it clamps the edges you set. On a background, it clamps the edges the image covers on every master, and NSEW means all four." },
            { name: "Fo · Focal", text: "Helps place the image accurately. A means the focal point was found from the picture. For the best results, draw a path named focal." },
            { name: "Co · Collision", text: "The hero nudges, then scales, to keep clear of the copy. On copy, it is a switch for each component." },
            { name: "S · Stretch", text: "Choose whether a layer scales uniformly or stretches to fill." },
          ],
        },
      ],
    },
    {
      id: "frames", label: "Frames",
      summary: "Every frame on the page, scored against its masters, and multiplied in one undo step.",
      tiles: [
        {
          id: "frames", label: "Frames",
          notes: [
            { name: "Scan for updates", text: "Reads every frame on this page and every master again, then works out the plan again. When every frame already matches its masters, it says No updates found." },
            { name: "Multiply", text: "Fills every frame on the page that would change from its masters, in one undo step. Layers are added, swapped, removed or restacked, then placed. Locked and ready-for-dev frames are left alone, and each frame is read again afterwards to give its verified score." },
            { name: "Master", text: "M and the master's size, with the frames nearest its proportions listed under it. It also shows how the master is composed: where its hero sits, and where its headline sits in relation to the hero." },
            { name: "Score", text: "How well a frame is laid out. It counts the background's coverage, the subject inside the safe area, overlaps and drift from the masters' proportions, less what any nudge or scale cost. Grey is a forecast from the plan; green, orange and red were measured on the frame as it is." },
            { name: "What a frame needs", text: "A frame reads Multiply ready while it is empty, and updates available, with the first difference, once it has layers. It reads verified when it matches its plan, along with any nudge or scale it took. A locked layer is named in orange and stays where it is." },
            { name: "The plan, drawn", text: "Click a frame to see its plan drawn over it: its ratio, how it is composed, what the score found, and the layers that need to change, which march on the preview." },
            { name: "One frame at a time", text: "Show in Figma selects the frame, Multiply this one fills just this frame, and Promote to master copies it to the masters page." },
            { name: "What was read", text: "The page, its frames and masters, and how many frames are waiting to be multiplied or updated." },
          ],
        },
      ],
    },
    {
      id: "settings", label: "Settings",
      summary: "Behind the cog: the panel's look, how the engine blends masters, and two tools, one that makes frames from a brief and one that clears a page.",
      tiles: [
        {
          id: "settings", label: "Settings",
          notes: [
            { name: "System light/dark mode", text: "The panel follows Figma's light or dark theme. Untick it to choose your own." },
            { name: "Smart blending", text: "When a frame's nearest master leaves the hero needing a nudge, Frame Multiplier also tries the masters' other layouts and keeps whichever needs the least correction. Off: it always uses the nearest master's layout. The setting is saved in the file, so everyone who opens it gets the same frames." },
            { name: "Freeze chips", text: "Shows chips on the Frames tab for BG, BG/Hero, Hero, Headline, Logo and Other layers. Click one off and that role stays exactly where it is in every frame. Legal has no chip." },
            { name: "Template mode", text: "Shows Template mode under Masters, which keeps a frame's extra layers instead of removing them." },
            { name: "Import brief with AI", text: "Makes pages and empty frames from your brief, in five steps: the job, what to build, a prompt you take to your own AI chat with the brief attached, its answer pasted back, and a review. The plugin never talks to an AI, and the AI never sees the file." },
            { name: "Clear frames on this page", text: "Takes every layer out of every frame on the page you are on, and never touches the masters page. The first click tells you how many frames; the second clears them." },
          ],
        },
      ],
    },
  ],
  // Prepare your Figma file: the help page's first section (partials/help-page.njk), its cards drawn by
  // panel-help.njk (q and a only: no drawings). The facts are monocode.campaign-manager's at HEAD:
  // masters.ts (the [MASTERS] / [TEMPLATES] tag, the proposal from frame names, visible frames directly
  // on the page), engine/layerSync.ts (matchKey: singleton roles by role, the rest by component then
  // name; extras removed unless locked or Template mode), engine/identity.ts (concepts), engine/roles.ts
  // (the NAMED keywords, one per frame), engine/types.ts (roles, ROLE_EXCLUDES, OBSTACLE_ROLES),
  // extract.ts (focal / collision / pin guide paths, isGuide for bleed / safe / trim), engine/clamp.ts,
  // engine/collisionZone.ts, apply.ts (instances of a master's main component, writeRotated), and
  // ui/ui.ts's ROLE_DESC, COL_DESC, cell() tooltips and console hints, the popover hints, and its
  // status, toast and row strings.
  prepare: {
    label: "In detail", nav: "In detail",
    heading: "Setting up, in detail",
    intro: "Frame Multiplier builds every size from master frames you design yourself, so the file needs setting up before the first Multiply: one masters page, shared components where the masters use the same element, and a role for each layer. After that, a page of empty frames is filled in one step.",
    groups: [{
      id: "file", label: "Build the campaign in Figma first",
      items: [{
        id: "masters-page", q: "Make the masters page", wide: true,
        a: [
          "Put your finished master frames on one page and put [MASTERS] in its name, for example [MASTERS] Summer sale. Frame Multiplier finds that page by itself. [TEMPLATES] works too, and turns Template mode on.",
          "Every visible frame or component sitting directly on that page is a master. Hidden frames, and frames inside a section or a group, are not read.",
          "Design the sizes at the ends of the job, for example a square, a portrait and a landscape. Each frame is laid out from the masters nearest its proportions. Past the widest and the tallest master the layout is held at that master, so add a master for an unusual shape such as a leaderboard or a story.",
          "Without a [MASTERS] page, pick the page under Setup ▸ Masters. If frame names on a page end in master, the plugin proposes that page and marks it (proposed) for you to check.",
          "The frames to fill go on other pages: empty frames at the sizes you need, directly on the page. Import brief with AI can make them, and the masters page, from the client's brief.",
        ],
      }, {
        id: "components", q: "Share components across masters", wide: true,
        a: [
          "Make the background, hero, headline, logo and legal components. Where masters use the same element, use instances of the same main component in each of them. That is how Frame Multiplier knows the headline in the square is the headline in the landscape. The masters can vary: one can use a component the others don't.",
          "The bg, hero, bg/hero, headline and logo are matched from master to master by their role. Every other layer, legal included, is matched by its component or component set, and failing that by its layer name.",
          "A layer is blended only between the masters that carry the same component. If one master uses a different headline component, Frame Multiplier takes that as a different layout and doesn't blend across it.",
          "A layer that isn't a shared component and is named differently in each master counts as a different layer in each one. A frame gets it only from its nearest master, laid out from that master alone.",
          "Layers in a frame that its master doesn't have are removed when you multiply, unless they are locked or Template mode is on.",
          "Keep each layer at the same place in the stacking order in every master that has it. A logo on top in one master and behind a panel in another can be added and removed again on every Multiply.",
          "A main component placed in a master reaches each frame as an instance, so later edits to the component reach every frame through Figma.",
        ],
      }, {
        id: "concepts", q: "Several creatives on one page", wide: true,
        a: [
          "Masters that share a hero or background component (the same variant), or carry the same [bracket] label in their names, form one concept: one creative and its sizes.",
          "Masters with different [labels] are always separate concepts, even when they share a component. Label them when two creatives use one hero component with a different photo in each.",
          "A frame joins the concept whose [label] is in its name, or whose label appears in its name as whole words (summer-sale-portrait carries [summer-sale]). Failing that, it joins the concept whose hero or background component it shares. An empty frame with no label joins the only concept, when there is just one.",
          "A frame that matches no concept is listed under No master and isn't filled. A label that is an everyday word in your frame names, such as PORTRAIT or the client's name, matches every frame.",
        ],
      }],
    }, {
      id: "subject", label: "The subject of a photo",
      items: [{
        id: "focal-path", q: "Draw a focal path", wide: true,
        a: [
          "The focal is the part of a hero or bg/hero picture that must stay in view. The hero is placed by it: the focal's centre lands where the masters put it, and the picture falls around it.",
          "With no path drawn, Frame Multiplier reads the subject from the pixels: the transparency of a cut-out, or what stands out in an opaque photo. The Fo column then shows A.",
          "For the best results, draw a box around the part that matters and name it focal. Draw it inside the layer, in the main component so every instance has it. Hidden or shown, filled or stroke-only, it counts either way: only the name matters.",
          "Draw one whenever the Fo cell turns red. Red on an A means the guess is costing size: the hero was shrunk on some frames to keep the subject in view.",
          "Keep the path on the frame on every master; a drawn path that runs off the frame turns the cell red. If the masters crop into the subject on purpose, draw a smaller path around the part every master shows.",
          "A plain bg has no subject. If the subject of a full-bleed photo matters, give the layer the bg/hero role.",
        ],
      }, {
        id: "collision-path", q: "Draw a collision path", wide: true,
        a: [
          "The collision shape is the part of the hero that keeps clear of the copy. Frame Multiplier uses a closed path named collision inside the layer, else the cut-out's outline from its transparency, else the whole layer box.",
          "Draw one around the product in an opaque photo hero. It has no cut-out edge, so without a path its whole box is kept clear of the copy.",
          "Copy can carry one too. Without one, a headline or legal is measured line by line on its letters, and any other layer on its box.",
          "A collision path on a copy layer asks the hero to keep clear of it. If a master already puts the hero over that layer, collision stays off for it and Setup shows it in red, naming the master to fix.",
          "The focal is never used as the collision shape. Draw both when the hero needs both.",
        ],
      }, {
        id: "guides", q: "Mark a safe area or a fixed point", wide: true,
        a: [
          "A rectangle named safe, with no fill, placed directly in a frame is that frame's safe area. The layout fits inside it, and the background still covers the whole frame. A frame without one is laid out on the whole frame.",
          "Rectangles named bleed and trim, with no fill, are guides too. Multiply and Clear frames leave all three alone.",
          "A visible child named pin, with no fill and no stroke, anywhere inside a layer is that layer's anchor point. The point is held at the same place on the frame in every size, and the P column shows it as an X.",
        ],
      }],
    }, {
      id: "roles", label: "Give each layer its role",
      items: [{
        id: "load", q: "Load the plugin and read the masters", wide: true,
        a: [
          "Open Frame Multiplier in Figma. It opens on the Setup tab.",
          "Under Masters, check the page chosen in the list, then press Okay. Only the masters are read; the page you are on is left alone.",
          "Components lists every layer of each concept, one row per component, with the role Frame Multiplier guessed and the P, C, Fo, Co and S settings. The Legend at the foot explains each glyph and column.",
          "Point at a setting and the strip under the table names it, for example Pin | NE or Collision | ON.",
          "Name layers for their role and the guess is right first time. A name containing HERO, HEADLINE, BG, LOGO or Disclaimer, in any case, takes that role outright. BG counts only on a full-bleed layer.",
        ],
      }, {
        id: "role-list", q: "Choose each role", wide: true, or: true,
        a: [
          "Click a role to choose from the list. Your choice is written to every master the layer is in. Each frame has one hero, bg/hero, bg, logo, headline and legal, and a bg/hero stands in for both bg and hero, so a role another layer already holds by your choice is greyed out.",
          "bg: the full-bleed background. It is scaled up and slid to keep covering the edges the masters cover, with the masters' bleed. It has no subject, so it is never steered off centre. Use it for colour fields, textures and photos whose subject doesn't matter.",
          "hero: the hero graphic, such as a cut-out or the key visual. It is never distorted. It is placed by its focal, kept in view, and nudged and then scaled down to keep clear of the copy.",
          "bg/hero: a hero flattened into the background photo. It covers the frame like a bg, keeps its subject in view like a hero, and is never distorted. To clear the copy it is nudged within what still covers the frame, then scaled down as far as it still covers. Use it for a full-bleed photo whose subject must stay in view.",
          "headline: placed on its letters, not its text box, so the letters never cross the frame edge. It anchors the way its text is aligned (left edge, centre or right edge), and vertically by its place on the frame: a headline at the top keeps its top, one in the middle stays centred. It is never distorted. A headline outlined to vectors places the same way once it has the role.",
          "logo: the logo or brand mark. Scaled as a whole and never distorted. It keeps the corner the masters show, or the pin you set.",
          "legal: small print, measured on its letters and pinned with its margin from the masters. A second block of small print in the same frame is other.",
          "other: everything else, such as bands, roundels, badges and dividers. Each follows the masters. A flat strip running the full width or height of the frame stretches with it.",
        ],
      }],
    }, {
      id: "options", label: "The options for each layer",
      items: [{
        id: "opt-pin", q: "P · Pin", or: true,
        a: [
          "For headline, logo, legal and other layers. Pin keeps a layer's offset from a corner of the frame the same in every size.",
          "Automatic: read from how the layer sits on the masters. A headline shows A, because it is placed by its own rule rather than a pin.",
          "Click the cell to pick a corner, or ✕ to go back to what the masters show. Set one when a logo or the legal drifts away from its corner.",
          "A layer that stretches has no Pin cell: the frame places it, and a pin would do nothing.",
        ],
      }, {
        id: "opt-clamp", q: "C · Clamp", or: true,
        a: [
          "For the hero, bg and bg/hero. Clamp stops an image edge from coming into the frame.",
          "Hero: an edge that is on or past the frame line on every master is clamped automatically. Click the cell to set one edge, two adjacent edges or an opposite pair (ns or ew), off for no clamp, or ✕ for what the masters show. Only an edge every master already has on or past the frame line can be set; the rest are greyed, naming the master in the way.",
          "Background: the cell shows the edges the image covers on every master, and NSEW means all four. The image is scaled up and slid to keep them covered. Set fewer, or off for a concept layout whose image will be extended later; the background then follows the masters' size and position.",
          "Check the letters before you click. A hero clamped sw instead of s slides to the left edge and onto the copy.",
        ],
      }, {
        id: "opt-focal", q: "Fo · Focal", or: true,
        a: [
          "For the hero and bg/hero. The cell shows where the focal came from: the focal icon for a path you drew, A for one read from the pixels, a faded icon for none.",
          "There is nothing to click. To change it, draw a path named focal in the layer (Draw a focal path, above).",
          "Red means it needs you: a drawn path has left the frame (make it smaller), or a guessed one is shrinking the hero (draw one).",
        ],
      }, {
        id: "opt-collision", q: "Co · Collision", or: true,
        a: [
          "Hero and bg/hero: the bolt is lit while it keeps clear of the copy, and the strip names the shape it uses: Path detected, Auto (Alpha) or Auto (Component). Click it to switch the dodge off, and the hero stays where the masters put it.",
          "Headline, logo, legal and other: a switch for each component. Lit, the hero keeps clear of that layer; dim, the hero may sit over it.",
          "Copy starts on, and switches off by itself where a master already puts the hero over it. Other layers start off; switch one on to keep the hero clear of a roundel or a badge.",
          "Red means you asked for collision, with the switch or a drawn path, but a master puts the hero over the layer. It stays off until you move the copy clear on that master. Click the red cell to accept the overlap.",
          "When the hero has to move, it nudges first, then scales down. Copy is never moved to clear the hero.",
        ],
      }, {
        id: "opt-stretch", q: "S · Stretch", or: true,
        a: [
          "What happens to the layer's shape: corners for uniform (Scale | Constrain), arrows for stretch (Scale | Stretch).",
          "Automatic: read from the masters. A layer whose proportions change from master to master stretches, and one with Figma's aspect lock on in every master stays uniform. The hero, bg/hero, headline and logo stay uniform unless you set otherwise.",
          "Click to go from automatic to uniform, then stretch, then back to automatic. Frame Multiplier never changes the aspect lock in Figma.",
        ],
      }, {
        id: "opt-saved", q: "Where the settings are kept", or: true,
        a: [
          "Each role and setting you choose is saved on the layer itself, in the Figma file, on every master that component is in. Anyone who opens the file gets the same frames.",
          "A row sets only its own component. Where several components fill one slot, such as a portrait and a landscape headline, each has its own row and its own settings.",
          "✕ clears a setting and goes back to what the masters show.",
        ],
      }],
    }, {
      id: "limits", label: "What it can't do",
      items: [{
        id: "limits", q: "Limits", wide: true, or: true,
        a: [
          "Only the hero, or the bg/hero, moves to clear the copy, and each frame has one. Copy is never moved off a subject. When the hero can't get clear it is left where the masters put it, and the card says so.",
          "A plain bg never moves for the copy, because it has no subject.",
          "Only frames sitting directly on a page are read. Frames inside a section or a group, and hidden frames, are left out.",
          "Each layer directly inside a frame is placed as one piece. The layers inside a group, a nested frame or a component are not laid out on their own.",
          "Layers are measured by their box. With Clip content off, a layer whose content spills past its box is read wrongly; turn Clip content on, or size the container to its content.",
          "Text is scaled with its layer. Frame Multiplier never edits the words.",
          "A rotated layer is placed by the box it covers. At anything but a quarter turn it can't stretch and is scaled uniformly instead, and a rotated picture's crop is left as it is.",
          "Past the widest and the tallest master, every layer is held at that master's layout. A frame far from every master's proportions gets a note on its card to add a master near its size.",
          "There is no face detection. On an opaque photo the subject is a guess from what stands out, so draw a focal path where it matters.",
          "Locked frames, and frames marked Ready for Dev or Completed, are skipped. A locked layer stays where it is.",
        ],
      }],
    }],
  },
  // Quick help, after the panel tour. Messages are quoted from ui/ui.ts (status, toast, the tree rows,
  // the card, the cell tooltips), ui/brief.ts and legacy.ts (ERROR / TOAST posts). Trial: index.ts
  // (trialDays 7) and the paid / free split in the rollout CLAUDE.md and docs/frame-multiplier-listing.md;
  // the price is the owner's ($49 a month, 2026-11-18), not the listing draft's.
  help: {
    intro: "Step-by-step instructions for the everyday jobs, and what to do when the panel shows a message. Multiply, Import updates and Clear frames are each one undo step in Figma.",
    groups: [{
      id: "how", label: "How do I…",
      items: [
        { id: "brief", q: "Set up a job from a brief", a: [
          "Open the cog and click Import brief with AI.",
          "1 · Job: type the Job number, the client if wanted, and the Campaign, which names the masters page. Tick Key counter to number every frame. The frame names are shown underneath as you type.",
          "2 · What to build: tick Display (RGB), Print (CMYK) or both. Print frames are made at 1 px = 1 pt, with bleed and safe guides. Tick Single-frame items only to skip video, animation, HTML5 banners, carousels and multi-page documents. Then choose Let the AI decide, or My own pages and name them.",
          "3 · Prompt: click Copy prompt. Open your AI chat (ChatGPT, Claude, Copilot, Gemini or Grok), attach the brief (Word, Excel, PDF or the email thread) and paste the prompt. It works in five steps, each reply headed STEP n/5. Correct it, or say continue.",
          "4 · Result: copy the block STEP 5/5 prints, from # studio-tools-brief v1 to the end, and paste it in, or click Load a file…. The panel counts the rows, frames, pages and creatives, and names any line it couldn't read.",
          "5 · Review: check the Display and Print tabs and the creative keys. Tick Also create a [MASTERS] page with empty masters if the file has none, then click Build.",
          "Design the masters on the masters page, then go to each page and press Scan for updates, then Multiply. The plugin never talks to the AI, the AI never sees the Figma file, and nothing about the brief is kept.",
        ] },
        { id: "scan", q: "Scan a page and read the plan", a: [
          "Go to the page with the frames and open the Frames tab. Arriving on a page builds the list from stored data, and the bar reads Built, the page name and the number of frames.",
          "Press Scan for updates. Every frame on the page and every master is read again, and the plan is worked out again. The bar then reads Scanned, with the frames, the masters and how many are waiting.",
          "Each concept lists its masters (M and the size), each with the frames nearest it underneath. Each frame shows its score and what it needs: Multiply ready, updates available or verified.",
          "A score of 90 or more is green, 70 to 89 orange and under 70 red. A grey score is a forecast from the plan; a coloured one was measured on the frame. Each percent the hero is nudged or scaled down costs a point.",
          "Click a frame to open its card: the score, the arrangement, what the checks found, the Needs list and the plan drawn over a preview. Placements lists the evidence for every layer: the masters it came from, and why it sits where it does.",
        ] },
        { id: "multiply-page", q: "Multiply the whole page", a: [
          "Scan the page.",
          "Click Multiply × N, where N is the number of frames that would change. The button reads Import updates (N) when all of them already have layers, and Multiply & Update (N) for a mix.",
          "If any frame scores under 70, the first click lists them instead. Click a frame to see why, or press the button again to apply anyway.",
          "Each frame is filled from its masters in one undo step, then read again for its verified score. Locked and Ready for Dev frames are left alone.",
        ] },
        { id: "multiply-one", q: "Multiply one frame", a: [
          "Click the frame on the Frames tab to open its card.",
          "Click Multiply this one.",
          "If the card shows Scan for updates in its place, the page was built from stored data. Press it to check this frame against the masters, then click Multiply this one.",
        ] },
        { id: "update", q: "Update the frames after a master changes", a: [
          "Edit the master on the masters page.",
          "Go to the page of frames and press Scan for updates. A page that is already filled offers nothing to apply until you do, because the masters haven't been read again.",
          "Click Import updates (N). Only the frames that differ from their plan change. Each row names the first difference, and the card's Needs list names all of them.",
          "A frame you moved by hand no longer matches its plan, so Import puts it back. To keep the change, make it in a master, or promote the frame.",
        ] },
        { id: "promote", q: "Promote a frame to master", a: [
          "Click the frame and click Promote to master on its card.",
          "A copy goes on the masters page, to the right of the masters. MASTER is added to the end of its name, and the concept's [label] to the front if the masters carry one.",
          "Press Scan for updates so the new master is used.",
        ] },
        { id: "freeze", q: "Freeze a role", a: [
          "Open the cog and tick Show/hide freeze chips.",
          "On the Frames tab, click a chip off: BG, BG/Hero, Hero, Headline, Logo or Other layers. That role stays exactly where it is in every frame.",
          "Multiply. Click the chip again to let the engine place that role.",
        ] },
        { id: "clear", q: "Clear a page", a: [
          "Go to the page and open the cog.",
          "Click Clear frames on this page. It changes to Remove every layer from N frames on this page — click again.",
          "Click it again within five seconds. Every layer comes out of every frame on the page. Locked and Ready for Dev frames and the bleed, safe and trim guides stay, and the masters page is never cleared.",
          "It is one undo step if you didn't mean it.",
        ] },
        { id: "lock-layer", q: "Keep one layer where it is in one frame", a: [
          "Lock the layer in Figma. Multiply leaves it where it is and doesn't remove it, and the frame's row names it as locked.",
        ] },
        { id: "other-masters", q: "Use a different masters page", a: [
          "On the Setup tab, pick the page under Masters and press Okay. The choice is saved in the file.",
        ] },
        { id: "why", q: "Find out why a frame looks wrong", a: [
          "Click the frame. The card draws the plan over the preview: dashed shapes are what the hero keeps clear of, and a cross marks a pin's point.",
          "Open Placements and read the layer's evidence. Held at the one master carrying this component means no other master has that component, so nothing was blended.",
          "Check that layer's C and Co cells on the Setup tab, then press Scan for updates.",
        ] },
      ],
    }, {
      id: "says", label: "When the panel says…",
      items: [
        { id: "no-masters-page", q: "No masters page found — pick one under Setup → Masters.", a: ["No page has [MASTERS] or [TEMPLATES] in its name, and none has been chosen. Pick the page under Setup ▸ Masters, or rename it. In a new file, Import brief with AI can make one."] },
        { id: "proposed", q: "Proposed from frame names — confirm, or pick another.", a: ["The page was guessed from frames whose names end in master. Check it is the right page. Pick another in the list, or put [MASTERS] in the page name so it is found for certain."] },
        { id: "on-masters", q: "On the masters page ([MASTERS]) — switch to a batch page to multiply.", a: ["The Frames tab lists the masters here, with what each one holds, and there is nothing to multiply. Go to the page with the frames you want filled. A red mark on a master's row is a fault on that master; point at it for the fix."] },
        { id: "no-master-frames", q: "No master frames found.", a: ["The masters page has no visible frame sitting directly on it. Move the masters out of any section or group, or pick another page."] },
        { id: "built", q: "Built Social · 24 frames", a: ["Arriving on a page builds the list from stored data. It doesn't check the frames against the masters, so rows that would say verified are left blank. If the page still has empty frames, the masters are read again and Multiply is ready. Press Scan for updates for the full check."] },
        { id: "no-updates", q: "No updates found", a: ["Every frame on the page matches its masters. Click the button to put Scan for updates back, and scan again after you edit a master."] },
        { id: "loop", q: "updates available, after every Multiply", a: ["Click the frame and read Needs on its card. The usual causes are a layer at a different place in the stacking order in one master, a layer with Clip content off, or a frame moved by hand. Fix the master or the layer, then Scan."] },
        { id: "no-master", q: "No master", a: ["These frames matched no concept, so they aren't filled. Put the concept's [label] in the frame name, or give the frame its hero or background component."] },
        { id: "low", q: "2 frames score under 70 — … Click a frame to see why, or press the button again to apply anyway.", a: ["Nothing has been written yet. Click a frame to see what the checks found, or press the button again, which now reads Multiply anyway or Import anyway, to go ahead."] },
        { id: "skip", q: "skip", a: ["The frame is locked, or marked Ready for Dev or Completed in Figma, and is left alone. Unlock it or clear its status to fill it."] },
        { id: "in-progress", q: "Multiply refused — Clear frames is already in progress.", a: ["One change to the file runs at a time. Wait for the bar to finish, then click again. Nothing was written twice."] },
        { id: "focal-off", q: "Focal path off-screen. Path must remain on frame. Reduce size to fix.", a: ["A focal path you drew runs off the frame on a master. Make it smaller so it stays on the frame on every master, then Scan."] },
        { id: "subject-off", q: "the subject found in the pixels maps entirely off this master.", a: ["The subject read from the picture is outside that master's frame. Multiply still runs, steered by that box. Draw a focal path on the layer if a frame comes out wrong."] },
        { id: "clamp-hold", q: "Clamp s cannot hold on 1080×1920", a: ["A clamp you set is on an edge one master has inside the frame. A clamp holds only where every master puts that edge on or past the frame line. Move the hero out to the edge on that master, or clear the clamp in Setup."] },
        { id: "collision-blocked", q: "Collision is on, but the masters put the hero over this layer", a: ["You switched collision on, or drew a collision path, for a layer a master puts the hero over. It stays off until that master is fixed. Move the copy clear of the hero there, or click the red cell to accept the overlap."] },
        { id: "collision-off", q: "Collision is off for logo — the hero sits over it on 1 of 3 masters", a: ["A master puts the hero over that layer, so it isn't held clear in this frame either. Click its Co cell on the Setup tab to switch it back on."] },
        { id: "add-master", q: "consider adding a master near 1200×300", a: ["The frame is far from every master's proportions. Add a master near that size, and the frames around it follow it."] },
        { id: "beyond", q: "beyond the masters' ratio range — held at the 1080×1920 master", a: ["The frame is wider or taller than every master, so each layer is held at that master's layout. Add a master at that shape."] },
        { id: "not-clear", q: "could not get clear — left where the masters put it", a: ["The hero couldn't get clear of the copy, so it stays where the masters put it rather than moving for nothing. Often a master already has the hero over that copy."] },
        { id: "reading", q: "Reading 3 images for subject geometry…", a: ["Frame Multiplier is reading the pictures for their cut-out edges and subjects. Until it finishes, the C and Co cells read Reading…."] },
        { id: "promote-fail", q: "Need a masters page and a frame to promote.", a: ["No masters page is set, or the frame has gone. Pick the masters page under Setup ▸ Masters and try again."] },
        { id: "trial-left", q: "Free trial — 5 days left. Multiply is paid after that.", a: ["You are in the seven-day trial and everything works. The line goes away when you scan."] },
        { id: "subscribe", q: "Subscribe to multiply × N", a: ["The trial has ended. Click it to open Figma's checkout. Once Figma confirms, the button reads Multiply again, without a reload. Scan, Setup, the preview and every setting stay free."] },
      ],
    }, {
      id: "settings", label: "Behind the cog",
      items: [
        { id: "template-mode", q: "Keep a frame's extra layers", a: [
          "Open the cog and tick Show/hide Template mode option.",
          "On the Setup tab, tick Template mode (keep extra layers) under Masters. Layers a frame has that its master doesn't are now kept instead of removed. The mode is saved in the file, and a [TEMPLATES] masters page turns it on.",
        ] },
        { id: "smart-blending", q: "What Smart blending changes", a: [
          "When a frame's nearest master leaves the hero needing a nudge of 5% or more, Frame Multiplier also works the frame out from the masters' other layouts and keeps the one that needs the least correction. The card then notes which master it took instead of the nearest.",
          "Untick it and every frame takes the nearest master's layout. It is on unless you untick it, and saved in the file.",
        ] },
      ],
    }, {
      id: "trial", label: "Trial and price",
      items: [
        { id: "price", q: "Trial and price", wide: true, a: [
          "Seven days of full access from the first time you run Frame Multiplier. After that, filling frames is the paid part, at US$49 a month: Multiply, Import updates and Multiply this one. Scan, Setup and every setting, the plan and score for every frame, the card and its preview, Import brief with AI, Clear frames and Promote to master stay free. The subscription is through Figma.",
        ] },
        { id: "privacy", q: "Where your work goes", a: [
          "Nowhere. Frame Multiplier makes no network connections. Everything it works out is stored in your Figma file.",
        ] },
      ],
    }],
  },
};
