const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = __dirname;
const sourcePath = path.join(root, 'Lois_Family_Tree.html');
const outputPath = path.join(root, 'Lois_Family_Tree_Book.html');
const source = fs.readFileSync(sourcePath, 'utf8');

function extractBetween(start, end) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex);
  if (startIndex === -1 || endIndex === -1) {
    throw new Error(`Could not extract source block between ${start} and ${end}`);
  }
  return source.slice(startIndex, endIndex);
}

const dataCode = [
  extractBetween('const lineage = [', '// Stories'),
  extractBetween('const stories = [', '// Family businesses'),
  extractBetween('const businesses = [', '// People directory'),
  extractBetween('const people = [', '// ===== RENDER'),
  '({ lineage, stories, businesses, people })'
].join('\n');

const { lineage, stories, businesses, people } = vm.runInNewContext(dataCode, {});

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const branchNames = {
  ressman: 'Ressman',
  pessin: 'Pessin',
  vanetsky: 'Vanetsky',
  bailin: 'Bailin / Beilen',
  bahcall: 'Bahcall',
  miller: 'Miller / Malyn',
  slafer: 'Slafer'
};

const archive = [
  {
    image: 'Pictures/HINDA PESSIN RESSMAN and her husband, DAVID RESSMAN.png',
    title: 'Hinda Pessin & David Moses Ressman',
    label: 'Portrait',
    text: 'The immigrant generation at the center of the Ressman family record.'
  },
  {
    image: 'Pictures/Marcus_and_Silvia_Slafer.jpg',
    title: 'Marcus & Sylvia Slafer',
    label: 'Portrait',
    text: 'Sylvia Ressman and Marcus Slafer, the Chicago link between Ressman and Miller.'
  },
  {
    image: 'Pictures/Silvia slafer and Ruth Ressman.jpg',
    title: 'Sylvia & Ruth Ressman',
    label: 'Sisters',
    text: 'Leon and Rose Ressman’s daughters, remembered as part of a close household.'
  },
  {
    image: 'Pictures/Bareman Street Synagogue 1923.avif',
    title: 'Bateman Street Synagogue, 1923',
    label: 'Synagogue',
    text: 'Moses Montefiore Congregation built this Appleton synagogue at Atlantic and Bateman streets in 1922 and dedicated it on June 10, 1923.'
  },
  {
    image: 'Pictures/Isadore_Bahcall.jpg',
    title: 'Isadore Bahcall',
    label: 'Portrait',
    text: 'Rebecca Ressman’s fiance, later husband, and treasurer of Moses Montefiore Congregation when it was officially founded in 1903.'
  },
  {
    image: 'Pictures/David-Bailin Eagle Supply and Plastics.jpg',
    title: 'David Bailin at Eagle Supply & Plastics',
    label: 'Business',
    text: 'A later Appleton business branch growing out of the Bahcall/Bailin scrap-and-supply tradition.'
  },
  {
    image: 'Pictures/Acme Manufacturing chicago.jpg',
    title: 'Acme Manufacturing, Chicago',
    label: 'Business',
    text: 'The family’s first American manufacturing venture, remembered as ambitious and short-lived.'
  },
  {
    image: 'Pictures/Allan Rusky newspaper article.jpg',
    title: 'Alan Rusky at Ressman’s Clothiers',
    label: 'Clipping',
    text: 'A newspaper snapshot from the Appleton clothing-store branch.'
  },
  {
    image: 'Pictures/First Ramada inn Flagstaff, AZ.jpg',
    title: 'First Ramada Inn, Flagstaff',
    label: 'Business',
    text: 'Ezra F. Ressman was one of Ramada’s original investors. The first Ramada opened on Route 66 in Flagstaff in 1954.'
  },
  {
    image: 'Pictures/Joseph Ressman Selective Service Registration.png',
    title: 'Joseph Ressman Selective Service Registration',
    label: 'Record',
    text: 'A preserved registration record from the family archive.'
  }
];

const survivingChildren = [
  ['Rachel Ressman Beilen/Bailin', '1865–1954', 'The eldest. Crossed in 1903 with her children after David Beilen came ahead; raised the Bailin branch in Chicago after his death.'],
  ['Joseph Ressman', '1867/1873–1949', 'Married Jennie Joseph. Their seven daughters stayed mostly in the Chicago area, except Lottie, who settled in Neenah, Wisconsin.'],
  ['Abram Ressman', 'Dates to verify', 'A tailor in Odessa before immigration. The scanned history says he and Celia had no children; later he married Carrie Cohen.'],
  ['Louis Ressman', '1882–1969', 'Married Ida Cohen. The expanded branch adds Jeanette, David, Esther, and Harry Ressman.'],
  ['Rebecca Ressman Bahcall', '1881–1973', 'Gave her passage ticket to Isadore Bahcall, then married him in Appleton, where the Bahcall business line grew.'],
  ['Harry Ressman', '1885/1886–1976', 'Moved to Appleton on his honeymoon with Sarah Spector and built Ressman’s Clothiers across generations.'],
  ['Leon Ressman', '1890–1971', 'No longer an uncertain outside branch. The scanned history names Leon as the youngest surviving child of David Moses and Hinda.']
];

const researchNotes = [
  'Leon Ressman should be treated as the youngest surviving child of David Moses Ressman and Hinda Pessin.',
  'David Moses and Hinda had thirteen children; the scanned history names seven surviving children.',
  'Joseph Bailin and Joe Bailin are likely one person, based on the expanded Rachel Beilen/Bailin branch.',
  'Abram Ressman’s branch differs between the older tree and the scanned history and needs original-record reconciliation.',
  'Ezra F. Ressman was one of Ramada’s original investors; the first Ramada opened on Route 66 in Flagstaff in 1954.'
];

function renderLineage() {
  return lineage.map((item) => {
    if (item.label) {
      return `<h3 class="generation">${escapeHtml(item.content)}</h3>`;
    }
    return `
      <article class="lineage-item ${item.isMom ? 'featured' : ''}">
        <h4>${escapeHtml(item.name)}</h4>
        <p class="meta">${escapeHtml(item.dates)} · ${escapeHtml(item.role)}</p>
        <p>${escapeHtml(item.note)}</p>
      </article>`;
  }).join('');
}

function renderStories() {
  return stories.map((story, index) => `
    <section class="chapter story-chapter ${index === 0 ? '' : 'subsequent'}">
      <p class="chapter-number">Story ${index + 1}</p>
      <h2>${escapeHtml(story.title)}</h2>
      <p class="subtitle">${escapeHtml(story.eyebrow)}</p>
      <div class="story-body">${story.body}</div>
    </section>`).join('');
}

function renderBusinesses() {
  return businesses.map((business) => `
    <article class="business-entry">
      <img src="${escapeHtml(business.image)}" alt="${escapeHtml(business.imageAlt)}">
      <div>
        <p class="meta">${escapeHtml(business.year)} · ${escapeHtml(business.place)}</p>
        <h3>${escapeHtml(business.name)}</h3>
        <p>${escapeHtml(business.desc)}</p>
        <p class="tag">${escapeHtml(business.tag)}</p>
      </div>
    </article>`).join('');
}

function renderArchive() {
  return archive.map((item) => `
    <figure class="plate">
      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">
      <figcaption>
        <span>${escapeHtml(item.label)}</span>
        <strong>${escapeHtml(item.title)}</strong>
        ${escapeHtml(item.text)}
      </figcaption>
    </figure>`).join('');
}

function renderPeopleDirectory() {
  return Object.entries(branchNames).map(([branch, label]) => {
    const entries = people.filter((person) => person.branch === branch);
    return `
      <section class="directory-group">
        <h3>${escapeHtml(label)}</h3>
        ${entries.map((person) => `
          <article class="directory-person">
            <strong>${escapeHtml(person.name)}</strong>
            <span>${escapeHtml(person.dates)}</span>
            <p>${escapeHtml(person.relation)}</p>
          </article>`).join('')}
      </section>`;
  }).join('');
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Our Family Story — Print Book</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600;1,700&family=Cinzel:wght@500;600;700&display=swap" rel="stylesheet">
<style>
  @page {
    size: 6in 9in;
    margin: 0.62in 0.55in 0.7in;
  }

  :root {
    --paper: #fbf4e4;
    --ink: #2a1810;
    --muted: #6d523f;
    --rule: #a9875d;
    --accent: #7d2e2e;
    --blue: #24374c;
  }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    color: var(--ink);
    background: var(--paper);
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 11.4pt;
    line-height: 1.42;
  }

  .book {
    max-width: 7.2in;
    margin: 0 auto;
    background:
      radial-gradient(circle at top left, rgba(125, 46, 46, 0.06), transparent 42%),
      var(--paper);
  }

  .cover {
    min-height: 8in;
    display: grid;
    align-content: center;
    text-align: center;
    page-break-after: always;
    break-after: page;
    border: 1px solid rgba(125, 46, 46, 0.24);
    padding: 0.45in;
  }

  .cover img {
    width: 3.85in;
    height: 2.7in;
    object-fit: cover;
    margin: 0 auto 0.35in;
    border: 8px solid #fff8eb;
    box-shadow: 0 12px 26px rgba(42, 24, 16, 0.18);
  }

  h1, h2, h3, h4 {
    font-family: "Playfair Display", Georgia, serif;
    margin: 0;
    color: var(--ink);
  }

  h1 {
    font-size: 42pt;
    line-height: 0.95;
    font-style: italic;
  }

  h2 {
    font-size: 26pt;
    line-height: 1.05;
    font-style: italic;
    margin-bottom: 0.13in;
  }

  h3 {
    font-size: 17pt;
    line-height: 1.1;
    font-style: italic;
    margin: 0.2in 0 0.08in;
  }

  h4 {
    font-size: 13.4pt;
    font-style: italic;
    margin-bottom: 0.02in;
  }

  p { margin: 0 0 0.11in; }

  .kicker,
  .chapter-number,
  .meta,
  .toc li span,
  figcaption span {
    font-family: "Cinzel", Georgia, serif;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--accent);
    font-size: 7.2pt;
    font-style: normal;
  }

  .subtitle {
    color: var(--muted);
    font-size: 13pt;
    font-style: italic;
    max-width: 4.6in;
  }

  .chapter {
    page-break-before: always;
    break-before: page;
    padding-top: 0.12in;
  }

  .chapter.no-break {
    page-break-before: auto;
    break-before: auto;
  }

  .toc {
    page-break-after: always;
    break-after: page;
  }

  .toc ol {
    margin: 0.25in 0 0;
    padding: 0;
    list-style: none;
  }

  .toc li {
    border-bottom: 1px solid rgba(169, 135, 93, 0.38);
    padding: 0.08in 0;
    display: flex;
    justify-content: space-between;
    gap: 0.2in;
  }

  .dropcap::first-letter {
    float: left;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 46pt;
    line-height: 0.84;
    color: var(--accent);
    padding-right: 0.06in;
  }

  .pullquote {
    border-left: 3px solid var(--accent);
    padding: 0.12in 0.18in;
    margin: 0.18in 0;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 15pt;
    line-height: 1.25;
    font-style: italic;
    color: var(--accent);
    background: rgba(255, 255, 255, 0.28);
  }

  .grid-two {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.14in;
  }

  .child,
  .lineage-item,
  .directory-person,
  .business-entry,
  .research-note {
    border: 1px solid rgba(169, 135, 93, 0.34);
    background: rgba(255, 255, 255, 0.24);
    padding: 0.12in;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .child { min-height: 1.34in; }

  .lineage-item {
    margin-bottom: 0.08in;
  }

  .lineage-item.featured {
    border-color: rgba(125, 46, 46, 0.55);
    background: rgba(125, 46, 46, 0.08);
  }

  .generation {
    border-top: 1px solid rgba(125, 46, 46, 0.34);
    padding-top: 0.11in;
  }

  .story-body p {
    font-size: 12pt;
  }

  .story-chapter.subsequent {
    page-break-before: always;
    break-before: page;
  }

  .plate {
    margin: 0 0 0.18in;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .plate img {
    width: 100%;
    max-height: 5.7in;
    object-fit: contain;
    display: block;
    border: 1px solid rgba(169, 135, 93, 0.42);
    background: rgba(255, 255, 255, 0.35);
  }

  figcaption {
    padding: 0.08in 0.02in 0;
    color: var(--muted);
  }

  figcaption strong {
    display: block;
    color: var(--ink);
    font-family: "Playfair Display", Georgia, serif;
    font-size: 13.5pt;
    font-style: italic;
    margin: 0.02in 0;
  }

  .business-entry {
    display: grid;
    grid-template-columns: 1.35in 1fr;
    gap: 0.14in;
    margin-bottom: 0.12in;
  }

  .business-entry img {
    width: 100%;
    height: 1.05in;
    object-fit: cover;
    border: 1px solid rgba(169, 135, 93, 0.4);
  }

  .tag {
    color: var(--accent);
    font-style: italic;
    font-weight: 600;
  }

  .research-note {
    border-left: 4px solid var(--blue);
    margin-bottom: 0.1in;
  }

  .directory {
    column-count: 2;
    column-gap: 0.18in;
  }

  .directory-group {
    break-inside: avoid;
    page-break-inside: avoid;
    margin-bottom: 0.16in;
  }

  .directory-person {
    margin-bottom: 0.07in;
    padding: 0.08in;
  }

  .directory-person strong {
    display: block;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 11.7pt;
    font-style: italic;
  }

  .directory-person span {
    display: block;
    color: var(--accent);
    font-size: 8.5pt;
    margin: 0.01in 0 0.02in;
  }

  .directory-person p {
    font-size: 9.4pt;
    line-height: 1.24;
    margin: 0;
  }

  .colophon {
    page-break-before: always;
    break-before: page;
    text-align: center;
    padding-top: 2.5in;
    color: var(--muted);
  }

  @media screen {
    body { padding: 0.35in; }
    .book { box-shadow: 0 20px 70px rgba(42, 24, 16, 0.2); padding: 0.5in; }
  }
</style>
</head>
<body>
<main class="book">
  <section class="cover">
    <img src="Pictures/HINDA PESSIN RESSMAN and her husband, DAVID RESSMAN.png" alt="Hinda Pessin and David Moses Ressman">
    <p class="kicker">A Family Chronicle</p>
    <h1>Our Family<br>&amp; Where We Came From</h1>
    <p class="subtitle" style="margin: 0.25in auto 0;">From Nikolief to Chicago, Appleton, Flagstaff, Phoenix, and the generations gathered around Lois.</p>
  </section>

  <section class="toc chapter no-break">
    <p class="chapter-number">Contents</p>
    <h2>In This Book</h2>
    <ol>
      <li><span>Chapter 1</span> The Crossing</li>
      <li><span>Chapter 2</span> The Seven Who Survived</li>
      <li><span>Chapter 3</span> The Bloodline to Lois</li>
      <li><span>Chapter 4</span> Stories Worth Telling</li>
      <li><span>Chapter 5</span> Image Plates</li>
      <li><span>Chapter 6</span> Hands That Built</li>
      <li><span>Chapter 7</span> Records & Corrections</li>
      <li><span>Chapter 8</span> People Directory</li>
    </ol>
  </section>

  <section class="chapter">
    <p class="chapter-number">Chapter 1</p>
    <h2>The Crossing</h2>
    <p class="dropcap">Long before any of us were here, there was a tailor in a Russian town called Nikolief, or Nikolaev, who made uniforms for the Tsar’s army. His name was David Moses Ressman, and he would whip his children to say their prayers, then have them help him sew. His wife was Hinda Pessin, daughter of a chazan and shochet, sister of a magid, a storyteller. She came from a learned family.</p>
    <p>Hinda was deaf. She had been blinded in one eye as a girl when a kite struck her face during play. As a young woman, Cossacks had clubbed her about the head, and that may have had something to do with the deafness too. But she carried thirteen children, seven of whom lived, and she kept the family together long enough to send them, one by one, across the ocean to a country none of them had ever seen.</p>
    <p class="pullquote">During the voyage, the children were passed up over a gate to spend a little time with their grandparents.</p>
    <p>The first to make the journey was Ed Ressman, David Moses’s brother, who landed in Chicago, then moved north to Appleton, Wisconsin. Beginning around 1890, he conducted minyans and religious services in his own home. That living-room beginning became part of the story of Moses Montefiore Congregation.</p>
    <p>In 1902, Abram and Joseph Ressman crossed with their wives and children. In 1903, the rest came: David Moses and Hinda themselves, with Rachel and her children. The Ressmans traveled tourist class. Rachel and her children traveled steerage. The boat may have been called the Saxonia. It landed in Baltimore. From there, they took the train to Chicago.</p>
    <p>They founded a company called Acme Manufacturing that made parts of suits, but there was so much fighting within the family that the business did not last. Every Ressman brother worked in the tailoring trade. Rachel scrubbed floors for fifty cents apiece. They were tired and they were poor and they were here, and that is where this story actually begins.</p>
  </section>

  <section class="chapter">
    <p class="chapter-number">Chapter 2</p>
    <h2>The Seven Who Survived</h2>
    <p class="subtitle">David Moses and Hinda had thirteen children, but seven lived. The scanned family history also resolves Leon’s place inside this core Ressman line.</p>
    <div class="grid-two">
      ${survivingChildren.map(([name, dates, text]) => `
        <article class="child">
          <h4>${escapeHtml(name)}</h4>
          <p class="meta">${escapeHtml(dates)}</p>
          <p>${escapeHtml(text)}</p>
        </article>`).join('')}
    </div>
  </section>

  <section class="chapter">
    <p class="chapter-number">Chapter 3</p>
    <h2>The Bloodline to Lois</h2>
    ${renderLineage()}
  </section>

  ${renderStories()}

  <section class="chapter">
    <p class="chapter-number">Chapter 5</p>
    <h2>Image Plates</h2>
    ${renderArchive()}
  </section>

  <section class="chapter">
    <p class="chapter-number">Chapter 6</p>
    <h2>Hands That Built</h2>
    ${renderBusinesses()}
  </section>

  <section class="chapter">
    <p class="chapter-number">Chapter 7</p>
    <h2>Records & Corrections</h2>
    <div class="grid-two">
      <figure class="plate">
        <img src="Pictures/Joseph Ressman Selective Service Registration.png" alt="Joseph Ressman Selective Service Registration">
        <figcaption><span>Record</span><strong>Joseph Ressman Selective Service Registration</strong>A preserved registration record from the family archive.</figcaption>
      </figure>
      <div>
        ${researchNotes.map((note) => `<p class="research-note">${escapeHtml(note)}</p>`).join('')}
      </div>
    </div>
  </section>

  <section class="chapter">
    <p class="chapter-number">Chapter 8</p>
    <h2>People Directory</h2>
    <div class="directory">
      ${renderPeopleDirectory()}
    </div>
  </section>

  <section class="colophon">
    <p class="kicker">Generated From</p>
    <p>Lois_Family_Tree.html</p>
    <p>Prepared as a print-ready family book source.</p>
  </section>
</main>
</body>
</html>`;

fs.writeFileSync(outputPath, html);
console.log(`Wrote ${outputPath}`);
