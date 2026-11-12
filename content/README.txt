THE WEBSITE'S WORDS
===================

Every sentence you read on the home page, the About page, the app pages
(Figma, InDesign, Photoshop, Ad Agent) and the product pages lives in a plain
text file in this folder. Edit the text, save, and the site picks it up:

    npm start        (then open http://localhost:8080, it reloads on save)

Where things are
----------------
  site.txt                    site name, tagline, the statement, the four
                              principles, the default highlights
  pages/home.txt              home page buttons and headings
  pages/about.txt             About page headings and paragraphs
  pages/labels.txt            headings that repeat on every app / product page
  <app>/app.txt               an app page: name, subhead, intro, install steps
  <app>/<product>.txt         a product page: name, tagline, description,
                              price, highlights, tech specs, tour captions

How a file is written
---------------------
  key: value                  one line of text
  # section                   starts a list (highlights, specs, tour ...)
  ## Heading                  one item of a list; the lines below it are its text
  // a note                   ignored, for your own reminders

Leave the words before the colon alone (name, tagline, price ...), and leave a
tour's picture names alone (bloom-tour-1 ...); change what comes after.
{name} and {app} are filled in with the product's or app's name.

Not in these files
------------------
What is drawn rather than written stays in the code: the panel guides and
Quick help (src/_lib/panels/*.js), the live demos, the Ad Agent rollout, the
menus. The structure (which products exist, their photos, icons and Get links)
is in src/_data/apps.json.
