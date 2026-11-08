const path = require("path");
const pptxgen = require("pptxgenjs");
const SKILL = "/root/.claude/skills/synced/07b62534-6f44-4453-9ed0-05c056d549c7_c1aed391-8d4a-49a8-b065-4d15e641b316/pptx";
const { applyTheme } = require(SKILL + "/scripts/apply_theme.js");
const N = require("./notes.js");
const D = __dirname;
const OUT = process.argv[2] || path.join(D, "deck.pptx");

const THEME = {
  name: "Datasets VIP",
  headFontFace: "Inter",
  bodyFontFace: "Inter",
  colors: {
    dk1: "06090F", lt1: "FFFFFF", dk2: "1C1E22", lt2: "A3A5A8",
    accent1: "B49143", accent2: "F6F6F6", accent3: "2A2D33", accent4: "8A8B8D",
    accent5: "5E4C24", accent6: "3A3D42", hlink: "B49143", folHlink: "8A8B8D",
  },
};
const GOLD_HEX = "B49143";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Nathan, Datasets";
pres.title = "The Webinar Growth Specialist";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const GOLD = C.accent1, WHITE = C.background1, GREY = C.background2, OFF = C.accent2, MUTED = C.accent4;
const NUM = "Oswald", DISP = "Montserrat", BODY = "Inter";

const X0 = 0.52, CW = 12.29;
function hdr(x, y) {
  const o = { y, h: 0.42, fontFace: NUM, fontSize: 20, charSpacing: 1, margin: 0, valign: "middle" };
  return [
    { text: { text: "DATASETS", options: Object.assign({ x, w: 1.3, color: OFF }, o) } },
    { text: { text: "VIP", options: Object.assign({ x: x + 1.22, w: 0.6, color: GOLD }, o) } },
  ];
}

// ---------- layouts ----------
pres.defineSlideMaster({
  title: "VIP_TITLE",
  background: { path: path.join(D, "title_bg.png") },
  objects: [
    { image: { x: 0.48, y: 0.85, w: 0.61, h: 0.61, path: path.join(D, "logo.png") } },
    ...hdr(1.26, 0.95),
    { placeholder: { options: { name: "title", type: "title", x: 1.12, y: 2.55, w: 11.09, h: 2.4, fontFace: DISP, fontSize: 40, bold: true, color: WHITE, align: "center", valign: "middle", charSpacing: 2, lineSpacingMultiple: 1.25, margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "VIP_DIVIDER",
  background: { path: path.join(D, "title_bg.png") },
  objects: [
    { image: { x: 0.48, y: 0.85, w: 0.61, h: 0.61, path: path.join(D, "logo.png") } },
    ...hdr(1.26, 0.95),
    { placeholder: { options: { name: "kicker", type: "body", x: 1.12, y: 2.55, w: 11.09, h: 0.5, fontFace: NUM, fontSize: 22, color: GOLD, align: "center", valign: "middle", charSpacing: 6, margin: 0 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", x: 1.12, y: 3.1, w: 11.09, h: 1.4, fontFace: DISP, fontSize: 40, bold: true, color: WHITE, align: "center", valign: "middle", charSpacing: 2, margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "VIP_CONTENT",
  background: { path: path.join(D, "content_bg.png") },
  objects: [
    { line: { x: 1.07, y: 0.667, w: 0, h: 0.684, line: { color: GOLD_HEX, width: 1.5 } } },
    { image: { x: 0.42, y: 6.6, w: 0.62, h: 0.62, path: path.join(D, "logo.png") } },
    ...hdr(1.2, 6.71),
    { placeholder: { options: { name: "num", type: "body", x: 0.2, y: 0.72, w: 0.72, h: 0.58, fontFace: NUM, fontSize: 34, color: WHITE, align: "right", valign: "middle", charSpacing: 4, margin: 0 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", x: 1.36, y: 0.76, w: 11.45, h: 0.5, fontFace: BODY, fontSize: 24, color: GOLD, align: "left", valign: "middle", charSpacing: 0.8, margin: 0 }, text: "" } },
  ],
});

// ---------- helpers ----------
let section = "Opening";
let num = 0;
function sect(t) { section = t; pres.addSection({ title: t }); }
function content(title, notes) {
  num += 1;
  const s = pres.addSlide({ masterName: "VIP_CONTENT", sectionTitle: section });
  s.addText(String(num).padStart(2, "0"), { placeholder: "num" });
  s.addText(title, { placeholder: "title" });
  s.addNotes(notes);
  return s;
}
function alt(words) { // alternating gold / white words, gold first
  return words.map((w, i) => ({ text: w + (i < words.length - 1 && !w.endsWith("\n") ? " " : ""), options: { color: i % 2 === 0 ? GOLD : WHITE } }));
}
function divider(kicker, words, notes) {
  const s = pres.addSlide({ masterName: "VIP_DIVIDER", sectionTitle: section });
  s.addText(kicker, { placeholder: "kicker" });
  s.addText(alt(words), { placeholder: "title" });
  s.addNotes(notes);
  return s;
}
function T(s, text, o) {
  s.addText(text, Object.assign({
    fontFace: BODY, fontSize: 16, color: GREY, charSpacing: 1, lineSpacingMultiple: 1.25,
    valign: "top", align: "left", margin: 0, isTextBox: true, fit: "none",
  }, o));
}
function H(s, text, o) { // Oswald label
  T(s, text, Object.assign({ fontFace: NUM, fontSize: 18, color: WHITE, charSpacing: 1.5, lineSpacingMultiple: 1.1 }, o));
}
function box(s, x, y, w, h, o = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.08,
    fill: { color: o.fill || WHITE, transparency: o.fillT ?? 94 },
    line: o.gold ? { color: GOLD, width: 1.25 } : { color: WHITE, transparency: 86, width: 0.75 },
    objectName: o.name,
  });
}
function card(s, x, y, w, h, head, text, o = {}) {
  box(s, x, y, w, h, o);
  const p = o.pad ?? 0.25;
  let ty = y + p;
  if (head) {
    H(s, head, { x: x + p, y: ty, w: w - 2 * p, h: o.headH ?? 0.4, fontSize: o.headSize ?? 18, color: o.headColor || (o.gold ? GOLD : WHITE) });
    ty += (o.headH ?? 0.4) + 0.12;
  }
  if (text) T(s, text, { x: x + p, y: ty, w: w - 2 * p, h: y + h - ty - p + 0.05, fontSize: o.size ?? 15, color: o.textColor || GREY, italic: o.italic });
}
function dot(s, x, y, size = 0.1, color = GOLD) {
  s.addShape(pres.shapes.OVAL, { x, y, w: size, h: size, fill: { color }, line: { color, width: 0 } });
}
// rows: array of string | [lead, rest]
function dots(s, rows, x, y, w, rowH, o = {}) {
  const fs = o.size ?? 16;
  rows.forEach((r, i) => {
    const yy = y + i * rowH;
    dot(s, x, yy + (fs * 1.25 / 72) / 2 - 0.05, 0.1);
    const txt = Array.isArray(r)
      ? [{ text: r[0], options: { bold: true, color: WHITE } }, { text: r[1] ? " " + r[1] : "", options: { color: GREY } }]
      : r;
    T(s, txt, { x: x + 0.3, y: yy, w: w - 0.3, h: rowH, fontSize: fs, color: o.color || GREY });
  });
}
function chevron(s, x, y, w = 0.22, h = 0.34) {
  s.addShape(pres.shapes.CHEVRON, { x, y, w, h, fill: { color: GOLD }, line: { color: GOLD, width: 0 } });
}
function stat(s, x, y, w, big, label, o = {}) {
  T(s, big, { x, y, w, h: o.bigH ?? 0.75, fontFace: NUM, fontSize: o.bigSize ?? 40, color: o.bigColor || GOLD, charSpacing: 1, valign: "bottom" });
  T(s, label, { x, y: y + (o.bigH ?? 0.75) + 0.08, w, h: o.labelH ?? 0.8, fontSize: o.labelSize ?? 14 });
}
function tag(s, text, x = 10.6, y = 0.82, w = 2.2) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.38, rectRadius: 0.19, fill: { color: GOLD, transparency: 80 }, line: { color: GOLD, width: 1 } });
  T(s, text, { x, y, w, h: 0.38, fontFace: NUM, fontSize: 13, color: GOLD, align: "center", valign: "middle", charSpacing: 2 });
}

// ================= SLIDES v2 (creator model) =================
function threeCards(s, cs, o = {}) {
  const w = 3.896, y = o.y ?? 1.75, h = o.h ?? 2.75;
  cs.forEach((c, i) => card(s, X0 + i * (w + 0.3), y, w, h, c[0], c[1], Object.assign({ size: 16, headSize: 20 }, o, i === (o.goldIdx ?? -1) ? { gold: true, fill: GOLD, fillT: 90 } : {})));
}
function sixCards(s, cs, o = {}) {
  const w = 3.896, h = o.h ?? 2.1;
  cs.forEach((c, i) => card(s, X0 + (i % 3) * (w + 0.3), (o.y ?? 1.75) + Math.floor(i / 3) * (h + 0.3), w, h, c[0], c[1], { size: o.size ?? 15, headColor: GOLD }));
}
function footLine(s, lead, rest, y = 5.85, color) {
  T(s, [{ text: lead, options: { color: color || WHITE, bold: true } }, { text: rest }], { x: X0, y, w: CW, h: 0.5, fontSize: 16 });
}
function msgCard(s, x, y, w, h, head, tagText, msg, size = 15) {
  box(s, x, y, w, h);
  H(s, head, { x: x + 0.25, y: y + 0.25, w: w - 1.3, h: 0.4, fontSize: 18, color: GOLD });
  if (tagText) T(s, tagText, { x: x + w - 1.05, y: y + 0.27, w: 0.8, h: 0.36, fontFace: NUM, fontSize: 13, color: MUTED, align: "right", valign: "middle", charSpacing: 2 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.25, y: y + 0.85, w: w - 0.5, h: h - 1.1, rectRadius: 0.08, fill: { color: C.text1, transparency: 40 }, line: { color: GOLD, transparency: 60, width: 0.75 } });
  T(s, msg, { x: x + 0.45, y: y + 1.05, w: w - 0.9, h: h - 1.5, fontSize: size, color: WHITE, charSpacing: 0.3, lineSpacingMultiple: 1.3 });
}
function rowsList(s, rows, o = {}) { // numbered rows with arrow: [left, right]
  const y0 = o.y ?? 2.15, rh = o.rh ?? 0.7, gap = o.gap ?? 0.13, split = o.split ?? 6.55;
  if (o.heads) {
    H(s, o.heads[0], { x: X0 + 0.95, y: y0 - 0.45, w: 4, h: 0.35, fontSize: 15, color: GOLD });
    H(s, o.heads[1], { x: split + 0.4, y: y0 - 0.45, w: 4, h: 0.35, fontSize: 15, color: GOLD });
  }
  rows.forEach((m, i) => {
    const y = y0 + i * (rh + gap);
    box(s, X0, y, CW, rh);
    T(s, String((o.start ?? 1) + i), { x: X0 + 0.2, y, w: 0.6, h: rh, fontFace: NUM, fontSize: 22, color: GOLD, valign: "middle" });
    T(s, m[0], { x: X0 + 0.95, y, w: split - X0 - 1.25, h: rh, fontSize: 15, color: WHITE, valign: "middle", charSpacing: 0.5 });
    chevron(s, split, y + rh / 2 - 0.12, 0.14, 0.24);
    T(s, m[1], { x: split + 0.4, y, w: 12.81 - split - 0.6, h: rh, fontSize: 15, valign: "middle", charSpacing: 0.5 });
  });
}


function shapeTable(s, rows, o) { // table drawn as text boxes and lines, so Canva imports it cleanly
  const n = rows.length, tw = o.colW.reduce((a, b) => a + b, 0);
  rows.forEach((r, i) => {
    const y = o.y + i * o.rowH;
    let x = o.x;
    r.forEach((c, j) => {
      const opt = Object.assign({}, c.options);
      T(s, c.text, Object.assign({ x: x + 0.12, y, w: o.colW[j] - 0.24, h: o.rowH, valign: "middle", charSpacing: opt.charSpacing ?? 0.3, lineSpacingMultiple: 1.05 }, opt));
      x += o.colW[j];
    });
    if (i < n - 1) s.addShape(pres.shapes.LINE, { x: o.x, y: y + o.rowH, w: tw, h: 0, line: { color: i === 0 ? GOLD_HEX : "3A3D42", width: i === 0 ? 1.25 : 0.75 } });
  });
}

// ---------- Title
sect("Opening");
{
  const s = pres.addSlide({ masterName: "VIP_TITLE", sectionTitle: section });
  const words = alt(["THE", "WEBINAR", "GROWTH", "SPECIALIST"]);
  words[2].options.breakLine = true; words[2].text = "GROWTH";
  s.addText(words, { placeholder: "title" });
  s.addNotes(N.title);
}

// ---------- Part One
sect("The Basics");
divider("PART ONE", ["THE", "BASICS"], N.div1);

// 01 What a webinar is
{
  const s = content("What A Webinar Is:", N.webinar);
  T(s, [{ text: "A free online class, live at a set time. Someone teaches something useful for about an hour, ", options: { color: WHITE } }, { text: "then offers a way to go further with them.", options: { color: GOLD } }],
    { x: X0, y: 1.75, w: 6.3, h: 2.2, fontSize: 22, charSpacing: 0.4, lineSpacingMultiple: 1.35 });
  dots(s, [["Free to join,", "so lots of people sign up."], ["Live at a set time,", "so people turn up together."], ["Ends with an offer,", "which is where the money comes from."]], X0, 4.3, 6.2, 0.62, { size: 16 });
  // mock screen
  const x = 7.3, y = 1.75, w = 5.51, h = 4.5;
  box(s, x, y, w, h, { fillT: 92 });
  s.addShape(pres.shapes.RECTANGLE, { x: x + 0.25, y: y + 0.25, w: 3.5, h: 2.6, fill: { color: C.text1, transparency: 30 }, line: { color: WHITE, transparency: 80, width: 0.75 } });
  T(s, "HOW TO LAND YOUR FIRST PAID EDITING CLIENT", { x: x + 0.45, y: y + 0.5, w: 3.1, h: 1.0, fontFace: NUM, fontSize: 15, color: GOLD, charSpacing: 1 });
  T(s, "Live with Jake  ·  Thursday 7pm", { x: x + 0.45, y: y + 1.55, w: 3.1, h: 0.35, fontSize: 11, charSpacing: 0.3 });
  s.addShape(pres.shapes.OVAL, { x: x + 3.0, y: y + 2.05, w: 0.6, h: 0.6, fill: { color: WHITE, transparency: 70 }, line: { color: GOLD, width: 1 } });
  H(s, "CHAT", { x: x + 3.95, y: y + 0.25, w: 1.3, h: 0.3, fontSize: 12, color: MUTED });
  ["Watching from Dublin", "2 years editing", "This is gold", "How much is it"].forEach((t, i) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 3.95, y: y + 0.65 + i * 0.55, w: 1.31, h: 0.42, rectRadius: 0.06, fill: { color: WHITE, transparency: 90 }, line: { color: WHITE, transparency: 85, width: 0.5 } });
    T(s, t, { x: x + 4.0, y: y + 0.65 + i * 0.55, w: 1.21, h: 0.42, fontSize: 9, valign: "middle", charSpacing: 0 });
  });
  T(s, "200 people watching live", { x: x + 0.25, y: y + 3.05, w: 3.5, h: 0.35, fontSize: 12, color: WHITE });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.25, y: y + 3.6, w: w - 0.5, h: 0.55, rectRadius: 0.08, fill: { color: GOLD }, line: { color: GOLD, width: 0 } });
  T(s, "JOIN THE PROGRAMME", { x: x + 0.25, y: y + 3.6, w: w - 0.5, h: 0.55, fontFace: NUM, fontSize: 15, color: C.text1, align: "center", valign: "middle", charSpacing: 2 });
}

// 02 Why creators use webinars
{
  const s = content("Why Creators Use Webinars:", N.whycreators);
  box(s, X0, 1.75, CW, 1.1, { gold: true, fill: GOLD, fillT: 90 });
  T(s, [{ text: "The problem: ", options: { color: GOLD, bold: true } }, { text: "thousands of followers like the posts, and hardly any buy from the link in bio.", options: { color: WHITE } }],
    { x: X0 + 0.3, y: 1.75, w: CW - 0.6, h: 1.1, fontSize: 18, valign: "middle" });
  threeCards(s, [
    ["AN HOUR BUILDS TRUST", "A post gets seconds. A webinar gets an hour of them watching the creator teach."],
    ["ONE TO MANY", "Teach once and two hundred people are in the room at the same time."],
    ["THEY CHOSE TO COME", "They signed up and gave up an evening. The warmest buyers a creator will get."],
  ], { y: 3.15, h: 2.3 });
  T(s, [{ text: "49 to 55 min ", options: { color: GOLD, fontFace: NUM, fontSize: 22 } }, { text: "average webinar engagement in recent ON24 benchmark data", options: { fontSize: 14 } }],
    { x: X0, y: 5.75, w: CW, h: 0.5, valign: "middle" });
}

// 03 What a specialist is
{
  const s = content("What A Webinar Growth Specialist Is:", N.specialist);
  T(s, [{ text: "You run the whole webinar for a creator, from people signing up to the sales coming in, ", options: { color: WHITE } }, { text: "and you get paid from the results.", options: { color: GOLD } }],
    { x: X0, y: 1.75, w: 11.8, h: 1.3, fontSize: 24, charSpacing: 0.4, lineSpacingMultiple: 1.3 });
  const y = 3.35, h = 2.9;
  box(s, X0, y, 4.2, h);
  H(s, "THE CREATOR DOES", { x: X0 + 0.3, y: y + 0.25, w: 3.6, h: 0.4, color: WHITE, fontSize: 20 });
  dots(s, ["Teaches for an hour", "Makes the offer at the end"], X0 + 0.3, y + 0.9, 3.6, 0.6, { size: 16 });
  const x2 = X0 + 4.5, w2 = CW - 4.5;
  box(s, x2, y, w2, h, { gold: true, fill: GOLD, fillT: 90 });
  H(s, "YOU DO EVERYTHING ELSE", { x: x2 + 0.3, y: y + 0.25, w: w2 - 0.6, h: 0.4, color: GOLD, fontSize: 20 });
  dots(s, ["The sign up page", "Reminder emails and texts", "Script and slides", "The tech on the night", "Follow up and replay", "Tracking the numbers"].slice(0, 3), x2 + 0.3, y + 0.9, 3.6, 0.6, { size: 16 });
  dots(s, ["The tech on the night", "Follow up and replay", "Tracking the numbers"], x2 + 4.0, y + 0.9, 3.6, 0.6, { size: 16 });
}

// 04 Who you work with
{
  const s = content("The Creators You Work With:", N.whoclients);
  box(s, X0, 1.75, 6.0, 4.5);
  H(s, "WHAT TO LOOK FOR", { x: X0 + 0.25, y: 2.0, w: 5.5, h: 0.4, color: GOLD, fontSize: 20 });
  dots(s, [["They teach a skill", "people want to learn."], ["An audience", "of 10,000 plus followers."], ["A paid offer,", "ideally €300 plus."], ["They're busy", "and hate the tech."], ["Comments asking", "how do I learn this."]],
    X0 + 0.25, 2.65, 5.5, 0.7, { size: 15 });
  const x = 6.81, w = 6.0;
  H(s, "SKILLS THAT FIT", { x, y: 1.75, w, h: 0.4, color: GOLD, fontSize: 20 });
  ["Video editing", "Photography", "Fitness training", "Music production", "Graphic design", "Copywriting", "Cooking", "Languages"].forEach((t, i) => {
    const cx = x + (i % 2) * 3.05, cy = 2.3 + Math.floor(i / 2) * 0.55;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx, y: cy, w: 2.9, h: 0.42, rectRadius: 0.21, fill: { color: WHITE, transparency: 92 }, line: { color: GOLD, transparency: 40, width: 0.75 } });
    T(s, t, { x: cx, y: cy, w: 2.9, h: 0.42, fontSize: 14, color: WHITE, align: "center", valign: "middle", charSpacing: 0.5 });
  });
  card(s, x, 4.65, w, 1.6, "OUR EXAMPLE: JAKE", "40,000 followers, teaches video editing, sells an 8 week programme for €1,000.", { size: 15, gold: true, fill: GOLD, fillT: 90 });
}

// 05 How you get paid
{
  const s = content("How You Get Paid:", N.money);
  tag(s, "ILLUSTRATIVE");
  const w = 3.896, y = 1.75, h = 3.7;
  [["PROJECT FEE", "Build and run one webinar for a fixed price.", "Easy first yes", "€3,000"],
   ["MONTHLY RETAINER", "Run a webinar every month and keep improving it.", "Once the first one works", "€1,500 a month"],
   ["FEE PLUS A SHARE", "Small fee up front plus a cut of what the webinar sells.", "Creators love this one", "€1,000 + 20%"]].forEach((c, i) => {
    const x = X0 + i * (w + 0.3);
    box(s, x, y, w, h, { gold: i === 2 });
    H(s, c[0], { x: x + 0.25, y: y + 0.25, w: w - 0.5, h: 0.4, color: GOLD, fontSize: 20 });
    T(s, c[1], { x: x + 0.25, y: y + 0.8, w: w - 0.5, h: 1.0, fontSize: 16 });
    T(s, c[2], { x: x + 0.25, y: y + 1.95, w: w - 0.5, h: 0.4, fontSize: 14, color: WHITE, italic: true });
    T(s, c[3], { x: x + 0.25, y: y + 2.55, w: w - 0.5, h: 0.8, fontFace: NUM, fontSize: 34, color: WHITE, valign: "bottom" });
  });
  T(s, "At €12,000 of webinar sales a month, a 20% share is €2,400 a month to you. Reference points: funnel freelancers charge roughly $20 to $225 an hour (goLance, 2026). No reliable standard share percentage was found.",
    { x: X0, y: 5.65, w: CW, h: 0.7, fontSize: 12, color: MUTED });
}

// ---------- Part Two
sect("The Webinar Machine");
divider("PART TWO", ["THE", "WEBINAR", "MACHINE"], N.div2);

// 06 System on one page
{
  const s = content("The Whole System On One Page:", N.funnel);
  const stages = [["POSTS AND\nEMAILS", "Tell the audience"], ["SIGN UP\nPAGE", "Name, email, phone"], ["REMINDERS", "So they turn up"], ["THE LIVE\nWEBINAR", "The hour itself"], ["THE OFFER", "Price and a link"], ["FOLLOW UP\nAND REPLAY", "The week after"]];
  const gap = 0.3, w = (CW - gap * 5) / 6, y = 1.9, h = 2.0, cx = [];
  stages.forEach((st, i) => {
    const x = X0 + i * (w + gap); cx.push(x + w / 2);
    const g = i === 3 || i === 4;
    box(s, x, y, w, h, { gold: g, fill: g ? GOLD : WHITE, fillT: g ? 88 : 94 });
    H(s, st[0], { x: x + 0.1, y: y + 0.2, w: w - 0.2, h: 0.8, fontSize: 16, align: "center", valign: "middle", color: g ? GOLD : WHITE, charSpacing: 1 });
    T(s, st[1], { x: x + 0.1, y: y + 1.1, w: w - 0.2, h: 0.7, fontSize: 14, align: "center" });
    if (i < 5) chevron(s, x + w + 0.08, y + h / 2 - 0.1, 0.14, 0.2);
  });
  const by = 4.25;
  [[0, 1, "SIGN UP RATE"], [1, 3, "SHOW RATE"], [3, 4, "BUY RATE"]].forEach(([a, b, lbl]) => {
    const x1 = cx[a] + 0.06, x2 = cx[b] - 0.06;
    s.addShape(pres.shapes.LINE, { x: x1, y: by, w: x2 - x1, h: 0, line: { color: GOLD, width: 1.5 } });
    s.addShape(pres.shapes.LINE, { x: x1, y: by - 0.15, w: 0, h: 0.15, line: { color: GOLD, width: 1.5 } });
    s.addShape(pres.shapes.LINE, { x: x2, y: by - 0.15, w: 0, h: 0.15, line: { color: GOLD, width: 1.5 } });
    H(s, lbl, { x: x1 - 0.4, y: by + 0.1, w: x2 - x1 + 0.8, h: 0.35, fontSize: 15, color: GOLD, align: "center" });
  });
  T(s, "When a webinar doesn't make money, one of these three numbers is broken. Your job is finding which one and fixing it.",
    { x: X0, y: 5.25, w: 11.5, h: 0.9, fontSize: 18, color: WHITE });
}

// 07 Getting sign ups
{
  const s = content("Getting People To Sign Up:", N.traffic);
  sixCards(s, [
    ["POSTS AND REELS", "Two or three in the week before, each teaching a small tip."],
    ["STORIES", "Every day for a week, with a link sticker and a countdown."],
    ["EMAIL LIST", "Three emails in the week before. Their best source."],
    ["LINK IN BIO", "Points at the sign up page all week."],
    ["COLLABS", "Another creator shares it, or you run a joint webinar."],
    ["PAID ADS, LATER", "Only once a webinar makes money. Test small first."],
  ], { h: 1.95, size: 15 });
  footLine(s, "Jake's first webinar: ", "500 sign ups from posts, stories, email and his bio link, and it cost him nothing.", 6.0, GOLD);
}

// 08 Sign up page
{
  const s = content("The Sign Up Page:", N.regpage);
  const fx = 0.52, fy = 1.7, fw = 4.6, fh = 4.65;
  box(s, fx, fy, fw, fh, { fillT: 92 });
  const ix = fx + 0.3, iw = fw - 0.6;
  T(s, "How to land your first paid editing client in 30 days", { x: ix, y: fy + 0.25, w: iw, h: 0.75, fontSize: 17, bold: true, color: WHITE, charSpacing: 0 });
  T(s, "THURSDAY 7PM  ·  60 MINUTES  ·  FREE", { x: ix, y: fy + 1.05, w: iw, h: 0.3, fontFace: NUM, fontSize: 13, color: GOLD, charSpacing: 1.5 });
  ["The 3 edits clients pay for", "Where to find your first client", "The first message to send them"].forEach((t, i) => {
    dot(s, ix, fy + 1.55 + i * 0.32 + 0.07, 0.08);
    T(s, t, { x: ix + 0.2, y: fy + 1.5 + i * 0.32, w: iw - 0.2, h: 0.3, fontSize: 12, color: GREY, charSpacing: 0.5 });
  });
  s.addShape(pres.shapes.OVAL, { x: ix, y: fy + 2.55, w: 0.38, h: 0.38, fill: { color: WHITE, transparency: 75 }, line: { color: GOLD, width: 1 } });
  T(s, "Hosted by Jake, full time editor, 40,000 followers", { x: ix + 0.5, y: fy + 2.55, w: iw - 0.5, h: 0.4, fontSize: 11, valign: "middle", charSpacing: 0.3 });
  ["Name", "Email", "Phone, for your reminder"].forEach((t, i) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: ix, y: fy + 3.1 + i * 0.36, w: iw, h: 0.3, rectRadius: 0.05, fill: { color: WHITE, transparency: 92 }, line: { color: WHITE, transparency: 70, width: 0.75 } });
    T(s, t, { x: ix + 0.1, y: fy + 3.1 + i * 0.36, w: iw - 0.2, h: 0.3, fontSize: 11, valign: "middle", color: MUTED, charSpacing: 0.3 });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: ix, y: fy + 4.17, w: iw, h: 0.34, rectRadius: 0.06, fill: { color: GOLD }, line: { color: GOLD, width: 0 } });
  T(s, "SAVE MY SEAT", { x: ix, y: fy + 4.17, w: iw, h: 0.34, fontFace: NUM, fontSize: 14, color: C.text1, align: "center", valign: "middle", charSpacing: 2 });
  dots(s, [
    ["Headline:", "what they'll get, in their words."],
    ["Date, time and length", "right at the top."],
    ["Three promises,", "each one specific."],
    ["Creator photo", "and one line of proof."],
    ["Short form:", "name, email, phone."],
    ["One button", "that says what happens."],
    ["Works on a phone,", "where nearly all social traffic is."],
  ], 5.6, 1.8, 7.2, 0.58, { size: 16 });
  T(s, "Typical sign up rate: roughly 20 to 40% of visitors (GetResponse; ClickMeeting).", { x: 5.6, y: 5.95, w: 7.2, h: 0.35, fontSize: 12, color: MUTED });
}

// 09 Getting people to turn up
{
  const s = content("Getting People To Turn Up:", N.reminders);
  const pts = [["ON SIGN UP", "Email and text: time and link"], ["2 TO 3 DAYS BEFORE", "Email: something useful"], ["DAY BEFORE", "Email: what they'll get"], ["MORNING OF", "Email and text: tonight at 7pm"], ["1 HOUR BEFORE", "Email: here's the link"], ["15 MINUTES BEFORE", "Text: we go live in 15"], ["WE'RE LIVE", "Email and text with the link"]];
  const x1 = 1.05, x2 = 12.25, ly = 2.85, step = (x2 - x1) / 6, lw = 1.68;
  s.addShape(pres.shapes.LINE, { x: x1, y: ly, w: x2 - x1, h: 0, line: { color: GOLD, width: 1.5 } });
  pts.forEach((p, i) => {
    const cx = x1 + i * step;
    s.addShape(pres.shapes.OVAL, { x: cx - 0.11, y: ly - 0.11, w: 0.22, h: 0.22, fill: { color: GOLD }, line: { color: GOLD, width: 0 } });
    H(s, p[0], { x: cx - lw / 2, y: 1.75, w: lw, h: 0.9, fontSize: 15, color: GOLD, align: "center", valign: "bottom" });
    T(s, p[1], { x: cx - lw / 2, y: 3.1, w: lw, h: 1.0, fontSize: 14, align: "center", charSpacing: 0.5 });
  });
  stat(s, X0, 4.45, 5.6, "30 to 50%", "of sign ups turn up live (Goldcast, Univid, Livestorm data)", { bigSize: 36, bigH: 0.65, labelH: 0.7 });
  stat(s, 6.6, 4.45, 6.0, "15 to 33%", "sign up on the day itself, so the day of reminders matter (GoTo, ON24, Livestorm)", { bigSize: 36, bigH: 0.65, labelH: 0.7 });
}

// 10 Messages
{
  const s = content("Reminder Messages You Can Copy:", N.messages);
  const w = 3.896, y = 1.75, h = 4.0;
  const ms = [
    ["ON SIGN UP", "TEXT", "You're in for How To Land Your First Editing Client, Thursday at 7pm. Your link: [link]. Save this number so you get your reminder."],
    ["MORNING OF", "EMAIL", "Subject: Tonight at 7, the message that gets editors their first client\n\nDoors open at 6.55pm. Bring a pen. Join here: [link]"],
    ["15 MINUTES BEFORE", "TEXT", "We go live in 15 minutes. Grab a cuppa and jump on: [link]"],
  ];
  ms.forEach((m, i) => msgCard(s, X0 + i * (w + 0.3), y, w, h, m[0], m[1], m[2]));
  footLine(s, "Write them how the creator talks, ", "and test every link on your own phone.", 5.95);
}

// ---------- Part Three
sect("The Hour That Sells");
divider("PART THREE", ["THE", "HOUR", "THAT", "SELLS"], N.div3);

// 11 The hour
{
  const s = content("The Hour, Section By Section:", N.hour);
  const segs = [["HOOK", 5], ["STORY", 5], ["TEACHING", 25], ["BRIDGE", 5], ["OFFER", 10], ["CLOSE", 5], ["Q AND A", 5]];
  const y = 2.0, h = 0.75; let x = X0, t = 0;
  segs.forEach(([name, m]) => {
    const w = CW * m / 60, g = name === "OFFER" || name === "CLOSE";
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.03, y, w: w - 0.06, h, fill: { color: g ? GOLD : WHITE, transparency: g ? 15 : (name === "TEACHING" ? 80 : 88) }, line: { color: g ? GOLD : WHITE, transparency: g ? 0 : 80, width: 0.75 } });
    H(s, name, { x: x + 0.02, y: y + h + 0.15, w: w - 0.04, h: 0.4, fontSize: 14, align: "center", color: g ? GOLD : WHITE, charSpacing: 0.8 });
    T(s, `${t} to ${t + m}`, { x: x + 0.02, y: y + h + 0.6, w: w - 0.04, h: 0.35, fontSize: 12, align: "center", charSpacing: 0 });
    t += m; x += w;
  });
  T(s, "Minutes into a 60 minute webinar", { x: X0, y: 3.75, w: 6, h: 0.3, fontSize: 12, color: MUTED });
  card(s, X0, 4.35, 6.0, 1.9, "ABOUT AN HOUR", "Typical length on ON24's platform, with average engagement around 49 to 55 minutes.", { size: 15 });
  card(s, 6.81, 4.35, 6.0, 1.9, "THE RULE", "If you can't fill an hour with good stuff, do 45 minutes. Padding loses people right before the offer.", { size: 15 });
}

// 12 First five minutes
{
  const s = content("The First Five Minutes:", N.hook);
  [["Say what they'll get.", "Start on time, start strong."], ["Give a reason to stay.", "A free bonus for everyone there at the end."], ["Give a quick win.", "One tip they can use straight away."], ["Get them typing.", "People who type early stay longer."], ["Tell them the plan.", "Mention you'll show how to work together at the end."]].forEach((r, i) => {
    const y = 1.75 + i * 0.9;
    H(s, `MIN ${i + 1}`, { x: X0, y: y + 0.02, w: 0.95, h: 0.4, fontSize: 18, color: GOLD });
    T(s, [{ text: r[0], options: { color: WHITE, bold: true, breakLine: true } }, { text: r[1] }], { x: X0 + 1.05, y, w: 5.8, h: 0.85, fontSize: 16 });
  });
  const x = 7.6, w = 12.81 - x;
  box(s, x, 1.75, w, 4.5, { gold: true, fill: GOLD, fillT: 90 });
  H(s, "JAKE'S OPENING LINE", { x: x + 0.3, y: 2.0, w: w - 0.6, h: 0.4, color: GOLD });
  T(s, "“By 8 o'clock tonight you'll know the three edits clients actually pay for, where to find your first client this week, and the exact message to send them.”",
    { x: x + 0.3, y: 2.6, w: w - 0.6, h: 3.3, fontSize: 20, color: WHITE, italic: true, lineSpacingMultiple: 1.35, charSpacing: 0.3 });
}

// 13 Story
{
  const s = content("The Creator's Story:", N.story);
  const steps = [["WHERE HE WAS", "Editing for his mates for free, making nothing."], ["WHAT WENT WRONG", "Months learning software, still no clients."], ["WHAT CHANGED", "Learned to find clients and talk to them. Three clients in a month."], ["WHERE HE IS NOW", "Full time editor, with screenshots of students landing clients."]];
  const gap = 0.4, w = (CW - 3 * gap) / 4, y = 1.8, h = 2.55;
  steps.forEach((st, i) => {
    const x = X0 + i * (w + gap);
    card(s, x, y, w, h, st[0], st[1], { size: 16, gold: i === 3, headColor: GOLD });
    if (i < 3) chevron(s, x + w + 0.09, y + h / 2 - 0.17);
  });
  T(s, [{ text: "About five minutes. ", options: { color: WHITE, bold: true } }, { text: "The people watching should see themselves in it. Use only what's true for your creator." }],
    { x: X0, y: 4.75, w: 11.5, h: 1.2, fontSize: 18 });
}

// 14 Teaching
{
  const s = content("Teaching Without Giving It All Away:", N.teaching);
  card(s, X0, 1.75, 6.0, 1.3, "ON THE WEBINAR", "Teach the what and the why.", { size: 18, textColor: WHITE });
  card(s, 6.81, 1.75, 6.0, 1.3, "IN THE OFFER", "Sell the how, step by step, with help.", { size: 18, textColor: WHITE, gold: true, fill: GOLD, fillT: 88 });
  H(s, "THREE POINTS, EACH ONE KNOCKS DOWN A WORRY", { x: X0, y: 3.3, w: 9, h: 0.4, fontSize: 18, color: GOLD });
  [["The three edits clients actually pay for", "“I'm not good enough yet.”"], ["Where clients are hiding in plain sight", "“There's no clients for beginners.”"], ["The first message to send them", "“I hate selling.”"]].forEach((p, i) => {
    const y = 3.85 + i * 0.8;
    box(s, X0, y, CW, 0.66);
    T(s, String(i + 1), { x: X0 + 0.2, y, w: 0.4, h: 0.66, fontFace: NUM, fontSize: 22, color: GOLD, valign: "middle" });
    T(s, p[0], { x: X0 + 0.7, y, w: 5.6, h: 0.66, fontSize: 16, color: WHITE, valign: "middle", charSpacing: 0.5 });
    T(s, "knocks down", { x: 6.9, y, w: 1.4, h: 0.66, fontSize: 13, color: MUTED, valign: "middle", italic: true });
    T(s, p[1], { x: 8.35, y, w: 4.35, h: 0.66, fontSize: 15, valign: "middle", italic: true, charSpacing: 0.3 });
  });
}

// 15 Bridge
{
  const s = content("The Bridge To The Offer:", N.bridge);
  box(s, X0, 1.75, CW, 2.05, { gold: true, fill: GOLD, fillT: 90 });
  T(s, "“You now know what clients pay for and where to find them. The quickest way to land your first one is to do it with me, step by step.”",
    { x: X0 + 0.4, y: 1.95, w: CW - 0.8, h: 1.65, fontSize: 22, color: WHITE, italic: true, valign: "middle", lineSpacingMultiple: 1.35, charSpacing: 0.3 });
  threeCards(s, [["1  RECAP", "Run back through the three points so they feel how much they've learned."], ["2  SHOW THE GAP", "Knowing what to do and doing it are two different things."], ["3  ASK PERMISSION", "Ask them to pop a yes in the chat if they want help. Wait for the yeses."]], { y: 4.1, h: 2.15, size: 15, headSize: 18 });
}

// 16 Offer
{
  const s = content("Presenting The Offer:", N.offer);
  tag(s, "ILLUSTRATIVE");
  const hdr = { fontFace: NUM, fontSize: 14, color: GOLD, charSpacing: 2 };
  const cell = (t, o = {}) => ({ text: t, options: Object.assign({ fontFace: BODY, fontSize: 15, color: GREY }, o) });
  const r = (a, b, c) => [cell(a, { color: WHITE }), cell(b), cell(c, { align: "right", color: WHITE })];
  const rows = [
    [cell("WHAT'S IN EDIT PRO", hdr), cell("WHAT IT DOES FOR THEM", hdr), cell("VALUE", Object.assign({ align: "right" }, hdr))],
    r("8 week video course", "Learn the skills in order", "€600"),
    r("Weekly live calls", "Get unstuck fast", "€800"),
    r("Templates and presets", "Look pro from day one", "€200"),
    r("Client message scripts", "Know exactly what to say", "€150"),
    r("Private community", "Never stuck on your own", "€250"),
    [cell("Total value", { color: WHITE, bold: true }), cell(""), cell("€2,000", { align: "right", color: WHITE, bold: true })],
    [cell("Tonight", { color: GOLD, bold: true, fontSize: 18 }), cell("Plus a portfolio review", { color: GOLD }), cell("€1,000", { align: "right", color: GOLD, bold: true, fontSize: 20, fontFace: NUM })],
  ];
  shapeTable(s, rows, { x: X0, y: 1.75, w: 7.6, colW: [2.95, 3.35, 1.3], rowH: 0.52, valign: "middle", border: { type: "solid", pt: 0.75, color: "3A3D42" }, fill: { color: WHITE, transparency: 100 }, margin: [0, 0.12, 0, 0.12] });
  const x = 8.5, w = 12.81 - x;
  box(s, x, 1.75, w, 4.5);
  H(s, "THE RULES", { x: x + 0.25, y: 2.0, w: w - 0.5, h: 0.4, color: GOLD, fontSize: 20 });
  dots(s, ["One line per part, with an honest value.", "Say the price once, clearly.", "A real bonus for joining tonight.", "Link on screen, in the chat, and said out loud."], x + 0.25, 2.65, w - 0.5, 0.88, { size: 15 });
}

// 17 Close
{
  const s = content("Closing On The Night:", N.close);
  sixCards(s, [
    ["A REAL DEADLINE", "Say when it ends and stick to it. Fake deadlines get found out."],
    ["A BONUS FOR TONIGHT", "Something real, like Jake's portfolio review."],
    ["READ OUT NEW JOINERS", "With permission, and only when it's real."],
    ["LINK STAYS ON SCREEN", "Through every single question."],
    ["REPEAT THE OFFER", "Two or three times. People join late and decide late."],
    ["ANSWER THE WORRY", "A question about hours is really a worry about time."],
  ]);
}

// 18 Objections
{
  const s = content("The Worries That Stop People Buying:", N.objections);
  const cs = [["“I can't afford it.”", "One editing client at €500 a month pays it back in two months."], ["“I don't have time.”", "Twenty minute lessons, and every call is recorded."], ["“I'm a complete beginner.”", "Type your situation in the chat and Jake answers it live."], ["“I'll do it later.”", "Later usually means never, and the bonus ends Sunday."]];
  const w = 6.0, h = 2.1;
  cs.forEach((c, i) => {
    const x = X0 + (i % 2) * (w + 0.29), y = 1.75 + Math.floor(i / 2) * (h + 0.3);
    box(s, x, y, w, h);
    T(s, c[0], { x: x + 0.3, y: y + 0.25, w: w - 0.6, h: 0.45, fontSize: 20, color: GOLD, italic: true, charSpacing: 0.3 });
    T(s, c[1], { x: x + 0.3, y: y + 0.85, w: w - 0.6, h: 1.1, fontSize: 16 });
  });
}

// 19 Follow up
{
  const s = content("After The Webinar: Follow Up And Replay:", N.followup);
  const days = [["0", "Replay and offer recap"], ["1", "Top questions answered"], ["2", "A student's result"], ["3", "What waiting costs"], ["5", "Replay comes down tomorrow"], ["6", "Last day, email and text"], ["7", "Closed, next date"]];
  const x1 = 1.05, x2 = 12.25, ly = 2.3, step = (x2 - x1) / 6, lw = 1.68;
  s.addShape(pres.shapes.LINE, { x: x1, y: ly, w: x2 - x1, h: 0, line: { color: GOLD, width: 1.5 } });
  days.forEach((d, i) => {
    const cx = x1 + i * step;
    s.addShape(pres.shapes.OVAL, { x: cx - 0.3, y: ly - 0.3, w: 0.6, h: 0.6, fill: { color: C.text1 }, line: { color: GOLD, width: 1.5 } });
    T(s, d[0], { x: cx - 0.3, y: ly - 0.3, w: 0.6, h: 0.6, fontFace: NUM, fontSize: 20, color: GOLD, align: "center", valign: "middle" });
    H(s, `DAY ${d[0]}`, { x: cx - lw / 2, y: 1.6, w: lw, h: 0.35, fontSize: 13, color: MUTED, align: "center" });
    T(s, d[1], { x: cx - lw / 2, y: 2.75, w: lw, h: 0.95, fontSize: 14, align: "center", charSpacing: 0.5, color: WHITE });
  });
  box(s, X0, 4.1, CW, 2.15, { gold: true, fill: GOLD, fillT: 90 });
  H(s, "THE REPLAY", { x: X0 + 0.3, y: 4.35, w: 6.5, h: 0.4, color: GOLD, fontSize: 20 });
  T(s, "Send it to everyone. Same deadline as the live offer. Take it down when you said you would.", { x: X0 + 0.3, y: 4.9, w: 6.6, h: 1.2, fontSize: 16, color: WHITE });
  stat(s, 7.9, 4.3, 4.6, "42 to 43%", "of webinar views come from replays (Contrast; ON24, 2025)", { bigSize: 36, bigH: 0.65, labelH: 0.8 });
}

// ---------- Part Four
sect("Great Results");
divider("PART FOUR", ["GETTING", "GREAT", "RESULTS"], N.div4);

// 20 Five numbers
{
  const s = content("The Five Numbers You Track:", N.numbers);
  const hdr = { fontFace: NUM, fontSize: 14, color: GOLD, charSpacing: 2 };
  const c = (t, o = {}) => ({ text: t, options: Object.assign({ fontFace: BODY, fontSize: 15, color: GREY }, o) });
  const rows = [
    [c("NUMBER", hdr), c("HOW TO WORK IT OUT", hdr), c("ROUGH RANGE", hdr), c("SOURCE", hdr)],
    [c("Sign up rate", { color: WHITE, bold: true }), c("Sign ups ÷ page visitors"), c("20 to 40%", { color: WHITE }), c("GetResponse; ClickMeeting", { fontSize: 12 })],
    [c("Show rate", { color: WHITE, bold: true }), c("People live ÷ sign ups"), c("30 to 50%", { color: WHITE }), c("Goldcast; Univid; Livestorm", { fontSize: 12 })],
    [c("Buy rate", { color: WHITE, bold: true }), c("Buyers ÷ people live"), c("5 to 15%", { color: WHITE }), c("ClickMeeting; EasyWebinar; Focus Digital", { fontSize: 12 })],
    [c("Money per person live", { color: WHITE, bold: true }), c("Sales ÷ people live"), c("Your number to beat", { color: GOLD }), c("Your creator's data", { fontSize: 12 })],
    [c("Cost per sign up", { color: WHITE, bold: true }), c("Ad spend ÷ sign ups"), c("Only once you run ads", { color: WHITE }), c("GrowthSpree; WordStream", { fontSize: 12 })],
  ];
  shapeTable(s, rows, { x: X0, y: 1.75, w: CW, colW: [3.1, 3.3, 3.2, 2.69], rowH: 0.62, valign: "middle", border: { type: "solid", pt: 0.75, color: "3A3D42" }, fill: { color: WHITE, transparency: 100 }, margin: [0, 0.12, 0, 0.12] });
  T(s, "Ranges come from published webinar benchmarks and tell you where to look. Your creator's own numbers, webinar after webinar, are what you manage.", { x: X0, y: 5.75, w: CW, h: 0.5, fontSize: 12, color: MUTED });
}

// 21 Broken step
{
  const s = content("Find The Broken Step:", N.broken);
  const cols = [["IF THIS IS LOW", 0.52, 3.4], ["LOOK AT", 4.27, 3.2], ["FIRST FIX", 7.82, 4.99]];
  cols.forEach(([t, x, w]) => H(s, t, { x: x + 0.2, y: 1.7, w, h: 0.35, fontSize: 15, color: GOLD }));
  [["Sign ups", "Promotion and the page", "Post more, stories daily, rewrite the headline"], ["Show rate", "Reminders and timing", "Add texts, run it in the evening"], ["Buy rate", "The offer and the pitch", "Fix the bridge, the value stack, the deadline"], ["Sales after", "The follow up", "Check the emails go out and the replay is up"]].forEach((r, i) => {
    const y = 2.2 + i * 0.92, h = 0.76;
    cols.forEach(([, x, w], j) => {
      box(s, x, y, w, h, j === 2 ? { gold: true, fill: GOLD, fillT: 92 } : {});
      T(s, r[j], { x: x + 0.2, y, w: w - 0.4, h, fontSize: 15, valign: "middle", color: j === 0 ? WHITE : GREY, bold: j === 0, charSpacing: 0.5 });
    });
    chevron(s, 3.98, y + h / 2 - 0.12, 0.14, 0.24);
    chevron(s, 7.53, y + h / 2 - 0.12, 0.14, 0.24);
  });
  footLine(s, "One fix at a time, then run it again. ", "That way you know what worked.", 5.95);
}

// 22 Before
{
  const s = content("Jake's First Webinar:", N.before);
  tag(s, "ILLUSTRATIVE");
  const st = [["500", "sign ups from his own audience"], ["100", "turn up live, a 20% show rate"], ["6", "buy, a 6% buy rate"], ["€6,000", "in sales at €1,000 each"]];
  const gap = 0.45, w = (CW - 3 * gap) / 4, y = 1.85, h = 2.25;
  st.forEach((p, i) => {
    const x = X0 + i * (w + gap), broken = i === 1;
    box(s, x, y, w, h, broken ? { gold: true, fill: GOLD, fillT: 85 } : {});
    T(s, p[0], { x: x + 0.1, y: y + 0.2, w: w - 0.2, h: 0.9, fontFace: NUM, fontSize: 40, color: broken ? GOLD : WHITE, align: "center", valign: "middle" });
    T(s, p[1], { x: x + 0.2, y: y + 1.2, w: w - 0.4, h: 0.9, fontSize: 15, align: "center", charSpacing: 0.5 });
    if (i < 3) chevron(s, x + w + 0.13, y + h / 2 - 0.15, 0.18, 0.3);
  });
  H(s, "BROKEN STEP", { x: X0 + w + gap, y: y + h + 0.12, w, h: 0.35, fontSize: 15, color: GOLD, align: "center" });
  box(s, X0, 4.85, CW, 1.4);
  T(s, [{ text: "Why: ", options: { color: WHITE, bold: true } }, { text: "a 6% buy rate is fine, but 20% turning up is well below the usual 30 to 50%. There was one reminder email, and it ran at 2pm on a Tuesday while his followers were at work or college." }],
    { x: X0 + 0.3, y: 4.85, w: CW - 0.6, h: 1.4, fontSize: 16, valign: "middle" });
}

// 23 After
{
  const s = content("Fixing One Step:", N.after);
  tag(s, "ILLUSTRATIVE");
  const hdr = { fontFace: NUM, fontSize: 14, color: GOLD, charSpacing: 2 };
  const c = (t, o = {}) => ({ text: t, options: Object.assign({ fontFace: BODY, fontSize: 16, color: GREY }, o) });
  const rows = [
    [c("", hdr), c("BEFORE", Object.assign({ align: "right" }, hdr)), c("AFTER", Object.assign({ align: "right" }, hdr))],
    [c("Sign ups", { color: WHITE }), c("500", { align: "right" }), c("500", { align: "right", color: WHITE })],
    [c("Show rate", { color: WHITE }), c("20%", { align: "right" }), c("40%", { align: "right", color: GOLD, bold: true })],
    [c("People live", { color: WHITE }), c("100", { align: "right" }), c("200", { align: "right", color: WHITE })],
    [c("Buy rate", { color: WHITE }), c("6%", { align: "right" }), c("6%", { align: "right", color: WHITE })],
    [c("Sales", { color: WHITE }), c("6", { align: "right" }), c("12", { align: "right", color: WHITE })],
    [c("Money in", { color: WHITE, bold: true }), c("€6,000", { align: "right" }), c("€12,000", { align: "right", color: GOLD, bold: true })],
  ];
  shapeTable(s, rows, { x: X0, y: 1.75, w: 6.4, colW: [2.6, 1.9, 1.9], rowH: 0.56, valign: "middle", border: { type: "solid", pt: 0.75, color: "3A3D42" }, fill: { color: WHITE, transparency: 100 }, margin: [0, 0.12, 0, 0.12] });
  // bar chart drawn as shapes
  const cx = 7.6, cw = 5.0, base = 5.45, maxH = 2.9;
  T(s, "Sales from one webinar", { x: cx, y: 1.75, w: cw, h: 0.4, fontSize: 14, color: WHITE, align: "center" });
  s.addShape(pres.shapes.LINE, { x: cx, y: base, w: cw, h: 0, line: { color: "3A3D42", width: 1 } });
  [["Before", 6000, "8A8B8D"], ["After", 12000, GOLD_HEX]].forEach(([lbl, v, col], k) => {
    const bh = maxH * v / 12000, bw = 1.3, bx = cx + 0.8 + k * 2.1;
    s.addShape(pres.shapes.RECTANGLE, { x: bx, y: base - bh, w: bw, h: bh, fill: { color: col }, line: { color: col, width: 0 } });
    T(s, "€" + v.toLocaleString("en-GB"), { x: bx - 0.3, y: base - bh - 0.45, w: bw + 0.6, h: 0.4, fontFace: NUM, fontSize: 20, color: WHITE, align: "center" });
    T(s, lbl, { x: bx - 0.3, y: base + 0.08, w: bw + 0.6, h: 0.35, fontSize: 13, align: "center" });
  });
  footLine(s, "Same audience, same offer. ", "Texts added, moved to 7pm. Double the money.", 5.95);
}

// 24/25 Mistakes
{
  const s = content("Ten Mistakes That Kill Webinars, 1 To 5:", N.mistakes1);
  rowsList(s, [["The title is about the creator", "Name the result the viewer wants"], ["One story the day before", "Promote for a full week, push the last two days"], ["Email only reminders", "Add texts for the morning of and 15 minutes before"], ["A time that suits the creator", "Pick when the audience is free, usually evenings"], ["Teaching everything", "Three points, the what and the why"]], { heads: ["MISTAKE", "FIX"] });
}
{
  const s = content("Ten Mistakes That Kill Webinars, 6 To 10:", N.mistakes2);
  rowsList(s, [["The pitch comes out of nowhere", "Use the bridge: recap, show the gap, ask"], ["A vague offer", "Each part with what it does and an honest value"], ["Fake scarcity", "A real deadline, and stick to it"], ["No follow up", "Run the 7 day sequence and send the replay"], ["Numbers aren't tracked", "Fill in the five numbers after every webinar"]], { heads: ["MISTAKE", "FIX"], start: 6 });
}

// 26 Checklist
{
  const s = content("Launch Day Checklist:", N.checklist);
  ["Every link tested on a phone", "Reminders on and tested", "Payment tested with a real purchase", "Offer slide: price and deadline right", "Practice run with the creator", "Sound, camera, wired internet",
   "Someone helping in the chat", "Recording switched on", "Backup link ready to text out", "Follow up emails scheduled", "Replay page ready, same deadline", "Tracking sheet ready for tomorrow"].forEach((t, i) => {
    const x = X0 + Math.floor(i / 6) * 6.3, y = 1.8 + (i % 6) * 0.73;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: y + 0.06, w: 0.32, h: 0.32, rectRadius: 0.04, fill: { color: WHITE, transparency: 100 }, line: { color: GOLD, width: 1.5 } });
    T(s, t, { x: x + 0.55, y, w: 5.5, h: 0.45, fontSize: 16, color: WHITE, valign: "middle", charSpacing: 0.5 });
  });
}

// ---------- Part Five
sect("Clients And Scale");
divider("PART FIVE", ["CLIENTS", "AND", "SCALE"], N.div5);

// 27 Tools
{
  const s = content("The Tools You Need:", N.tools);
  const cs = [["THE WEBINAR ROOM", "Runs the live session.", "Zoom Webinars, Livestorm, WebinarJam"], ["SIGN UP PAGES", "Collects names and numbers.", "GoHighLevel, ClickFunnels, Leadpages"], ["EMAILS AND TEXTS", "Reminders and follow up.", "ActiveCampaign or GoHighLevel, plus a text service"], ["PAYMENTS", "Takes the money.", "Stripe, or what the creator already uses"], ["TRACKING", "Where sign ups came from.", "Tagged links and one simple sheet"], ["SLIDES AND REPLAY", "The deck and the recording.", "Canva or Keynote, platform recording"]];
  const w = 3.896, h = 2.15;
  cs.forEach((c, i) => {
    const x = X0 + (i % 3) * (w + 0.3), y = 1.75 + Math.floor(i / 3) * (h + 0.3);
    box(s, x, y, w, h);
    H(s, c[0], { x: x + 0.25, y: y + 0.2, w: w - 0.5, h: 0.4, color: GOLD });
    T(s, c[1], { x: x + 0.25, y: y + 0.68, w: w - 0.5, h: 0.6, fontSize: 15, color: WHITE });
    T(s, c[2], { x: x + 0.25, y: y + 1.33, w: w - 0.5, h: 0.7, fontSize: 13 });
  });
}

// 28 Skills
{
  const s = content("The Skills, In The Order To Learn Them:", N.skills);
  const sk = [["WEBINAR NUMBERS", "A weekend with a spreadsheet"], ["WRITING", "Write every single day"], ["WEBINAR SCRIPTS", "Script creators you follow"], ["THE TECH", "Build your own setup"], ["GETTING SIGN UPS", "Posts, stories, emails"], ["FIXING", "Study other webinars"], ["SELLING YOURSELF", "DMs, calls, proposals"]];
  const gap = 0.15, w = (CW - 6 * gap) / 7, base = 6.3;
  sk.forEach((k, i) => {
    const h = 1.75 + i * 0.4, x = X0 + i * (w + gap), y = base - h, last = i === 6;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: last ? GOLD : WHITE, transparency: last ? 82 : 92 - i }, line: { color: last ? GOLD : WHITE, transparency: last ? 0 : 82, width: 0.75 } });
    T(s, String(i + 1), { x: x + 0.15, y: y + 0.12, w: w - 0.3, h: 0.45, fontFace: NUM, fontSize: 24, color: GOLD });
    H(s, k[0], { x: x + 0.15, y: y + 0.6, w: w - 0.3, h: 0.6, fontSize: 14 });
    T(s, k[1], { x: x + 0.15, y: y + 1.2, w: w - 0.3, h: 0.5, fontSize: 12, charSpacing: 0 });
  });
  T(s, [{ text: "Best practice: ", options: { color: GOLD, bold: true } }, { text: "run a webinar for ten mates." }], { x: X0, y: 1.75, w: 7.5, h: 0.5, fontSize: 16 });
}

// 29 Finding creators
{
  const s = content("Finding Creators To Work With:", N.finding);
  box(s, X0, 1.75, 6.0, 4.5);
  H(s, "SIGNS THEY'RE READY", { x: X0 + 0.25, y: 2.0, w: 5.5, h: 0.4, color: GOLD, fontSize: 20 });
  dots(s, [["They post tutorials,", "so they already teach."], ["Comments asking", "how to learn more."], ["A course link in bio,", "or nothing at all."], ["No webinars", "running yet."], ["Real engagement,", "not a dead account."]], X0 + 0.25, 2.65, 5.5, 0.68, { size: 16 });
  const x = 6.81, w = 6.0;
  card(s, x, 1.75, w, 2.1, "WHERE TO LOOK", "Search Instagram, TikTok and YouTube for the skill. Aim for roughly 10,000 to 200,000 followers.", { size: 15, headColor: GOLD });
  card(s, x, 4.15, w, 2.1, "BUILD A LIST OF 100", "Name, platform, followers, what they teach, what they sell, and one thing you noticed.", { size: 15, gold: true, fill: GOLD, fillT: 90 });
}

// 30 DMs
{
  const s = content("Messages That Get Replies:", N.dms);
  const w = 6.0, h = 3.85;
  [["COLD DM, TO A CREATOR", "Hey Jake, loved the colour grading breakdown you posted on Tuesday. Loads of your comments ask if you teach this properly. I run live webinars for creators who teach a skill. I build everything, you just teach for an hour. Happy to show you what it could make for you. Reply yes and I'll send a couple of times."],
   ["WARM, TO PEOPLE YOU KNOW", "Hey Ciara, quick one. I've started running webinars for creators who teach a skill, things like editing and fitness. If you know a creator who sells a course and wants more sales from their audience, I'd love an intro. I'll look after them."]].forEach((m, i) => {
    const x = X0 + i * (w + 0.29);
    box(s, x, 1.75, w, h);
    H(s, m[0], { x: x + 0.3, y: 1.98, w: w - 0.6, h: 0.4, color: GOLD });
    T(s, m[1], { x: x + 0.3, y: 2.55, w: w - 0.6, h: 2.95, fontSize: 16, color: WHITE, charSpacing: 0.3, lineSpacingMultiple: 1.3 });
  });
  footLine(s, "20 a day is 100 a week. ", "No replies after 100, rewrite the message.", 5.85);
}

// 31 Call
{
  const s = content("Your First Offer And The Call:", N.call);
  tag(s, "ILLUSTRATIVE");
  box(s, X0, 1.75, 5.6, 4.5, { gold: true, fill: GOLD, fillT: 90 });
  H(s, "THE FIRST OFFER", { x: X0 + 0.3, y: 2.0, w: 5.0, h: 0.4, color: GOLD, fontSize: 20 });
  T(s, "“I'll build and run one webinar for you. You teach for an hour, I do everything else. €1,000 to set up and 20% of sales. If it doesn't make €5,000, I'll run the next one free.”",
    { x: X0 + 0.3, y: 2.6, w: 5.0, h: 3.4, fontSize: 18, color: WHITE, italic: true, lineSpacingMultiple: 1.35, charSpacing: 0.3 });
  const x = 6.5, w = 12.81 - x;
  H(s, "WHAT TO SHOW ON THE CALL", { x, y: 1.75, w, h: 0.4, color: GOLD, fontSize: 20 });
  ["Their numbers on the system diagram", "The gap, worked out with them", "What you'd change about how they sell now", "A simple 30 day plan", "Proof: your practice webinar or a result"].forEach((t, i) => {
    const y = 2.35 + i * 0.78;
    box(s, x, y, w, 0.64);
    T(s, String(i + 1), { x: x + 0.2, y, w: 0.4, h: 0.64, fontFace: NUM, fontSize: 20, color: GOLD, valign: "middle" });
    T(s, t, { x: x + 0.65, y, w: w - 0.85, h: 0.64, fontSize: 15, color: WHITE, valign: "middle", charSpacing: 0.5 });
  });
}

// 32 Gap
{
  const s = content("Pricing: Put A Number On The Gap:", N.gap);
  tag(s, "ILLUSTRATIVE");
  const st = [["2", "sales a month from his bio link"], ["€2,000", "a month now"], ["€12,000", "a month from one webinar"], ["€10,000", "gap every month"]];
  const gap = 0.45, w = (CW - 3 * gap) / 4, y = 1.85, h = 2.1;
  st.forEach((p, i) => {
    const x = X0 + i * (w + gap);
    box(s, x, y, w, h, i === 2 ? { gold: true } : {});
    T(s, p[0], { x: x + 0.1, y: y + 0.2, w: w - 0.2, h: 0.85, fontFace: NUM, fontSize: 36, color: WHITE, align: "center", valign: "middle" });
    T(s, p[1], { x: x + 0.15, y: y + 1.15, w: w - 0.3, h: 0.8, fontSize: 15, align: "center", charSpacing: 0.5 });
    if (i < 3) chevron(s, x + w + 0.15, y + h / 2 - 0.12, 0.15, 0.24);
  });
  box(s, X0, 4.3, CW, 1.95, { gold: true, fill: GOLD, fillT: 88 });
  T(s, "€120,000", { x: X0 + 0.4, y: 4.45, w: 4.6, h: 1.65, fontFace: NUM, fontSize: 60, color: GOLD, valign: "middle" });
  T(s, [{ text: "a year left on the table. ", options: { color: WHITE, bold: true } }, { text: "Work it out with the creator using their own numbers, and write it where they can see it." }], { x: 5.3, y: 4.45, w: 7.2, h: 1.65, fontSize: 18, valign: "middle" });
}

// 33 Charge
{
  const s = content("Three Ways To Charge:", N.charge);
  tag(s, "ILLUSTRATIVE");
  T(s, [{ text: "Jake's fixed webinar: ", options: { color: WHITE, bold: true } }, { text: "€12,000 of sales a month, against €2,000 now." }], { x: X0, y: 1.75, w: CW, h: 0.45, fontSize: 17 });
  const w = 3.896, y = 2.45, h = 3.0;
  [["PROJECT FEE", "€3,000", "Paid back by the first three sales on the night."], ["RETAINER", "€1,500 a month", "Run it every month and keep improving it."], ["FEE PLUS SHARE", "€1,000 + 20%", "At €12,000 of sales, €2,400 a month to you."]].forEach((c, i) => {
    const x = X0 + i * (w + 0.3);
    box(s, x, y, w, h, { gold: i === 2 });
    H(s, c[0], { x: x + 0.25, y: y + 0.25, w: w - 0.5, h: 0.4, color: GOLD, fontSize: 20 });
    T(s, c[1], { x: x + 0.25, y: y + 0.75, w: w - 0.5, h: 0.8, fontFace: NUM, fontSize: 34, color: WHITE, valign: "middle" });
    T(s, c[2], { x: x + 0.25, y: y + 1.7, w: w - 0.5, h: 1.15, fontSize: 16 });
  });
  footLine(s, "Lead with the share. ", "Track every sale through one checkout.", 5.8, GOLD);
}

// 34 Delivery
{
  const s = content("Delivering Your First Project:", N.delivery);
  const wk = [["WEEK 1", "KICKOFF", ["Agree offer and date", "Read their comments", "Get their story"]], ["WEEK 2", "BUILD", ["Script and slides", "Page, reminders, follow up", "Payment link and tracking"]], ["WEEK 3", "PROMOTE", ["Sign ups open 7 to 10 days out", "Posts and stories daily", "Emails and bio link"]], ["WEEK 4", "LAUNCH", ["Practice run two days before", "Go live, run the 7 days", "One page report"]]];
  const gap = 0.3, w = (CW - 3 * gap) / 4, y = 1.75, h = 4.5;
  wk.forEach((k, i) => {
    const x = X0 + i * (w + gap);
    box(s, x, y, w, h, { gold: i === 3 });
    T(s, k[0], { x: x + 0.25, y: y + 0.2, w: w - 0.5, h: 0.55, fontFace: NUM, fontSize: 28, color: GOLD });
    H(s, k[1], { x: x + 0.25, y: y + 0.8, w: w - 0.5, h: 0.4, fontSize: 16 });
    dots(s, k[2], x + 0.25, y + 1.45, w - 0.5, 0.95, { size: 15 });
  });
}

// 35 Scale client
{
  const s = content("Scaling Your Creator's Results:", N.scaleclient);
  rowsList(s, [["Run it every month", "Fix one number each time, new followers each month"], ["Make an always on version", "The best recording, watchable any day, same follow up"], ["Add ads once it makes money", "Jake earns €60 per person live, so ads under that pay"], ["Add a bigger offer", "Buyers are the best people for a higher level of help"], ["Collab webinars", "Two creators, two audiences, one webinar"]], { y: 1.85, rh: 0.75, gap: 0.15, split: 5.9 });
}

// 36 Scale you
{
  const s = content("Scaling Your Own Business:", N.scaleyou);
  tag(s, "ILLUSTRATIVE");
  sixCards(s, [
    ["TEMPLATES", "Save every page, email, text and script. Client two takes half the time."],
    ["STACK SHARE DEALS", "Each creator on a share is monthly income."],
    ["GET HELP", "At three clients, pay someone for the tech setup."],
    ["CASE STUDIES", "Write up every good result with the numbers."],
    ["REFERRALS", "Creators know creators. Ask every happy client."],
    ["ONE SKILL AREA", "Get known as the person for editing creators, say."],
  ], { h: 1.75 });
  T(s, [{ text: "3 creators × €2,400 = €7,200 a month.  ", options: { color: GOLD, bold: true } }, { text: "5 creators = €12,000 a month.", options: { color: WHITE, bold: true } }], { x: X0, y: 5.9, w: CW, h: 0.45, fontSize: 17 });
}

// 37 Plan
{
  const s = content("Your 30 Day Plan:", N.plan);
  const wk = [["DAYS 1 TO 7", ["Learn the numbers", "Run a practice webinar", "Watch 5 creators' webinars"]], ["DAYS 8 TO 14", ["Pick a skill area", "List 100 creators", "Write 3 teardowns"]], ["DAYS 15 TO 21", ["20 DMs a day", "Follow up after 3 days", "Book calls"]], ["DAYS 22 TO 30", ["Run the calls", "Proposal in 24 hours", "Close one creator"]]];
  const gap = 0.3, w = (CW - 3 * gap) / 4, y = 1.75, h = 3.6;
  wk.forEach((k, i) => {
    const x = X0 + i * (w + gap);
    box(s, x, y, w, h, { gold: i === 3 });
    T(s, k[0], { x: x + 0.25, y: y + 0.22, w: w - 0.5, h: 0.5, fontFace: NUM, fontSize: 24, color: GOLD });
    dots(s, k[1], x + 0.25, y + 0.95, w - 0.5, 0.82, { size: 15 });
  });
  footLine(s, "The goal is one client. ", "One client gets you a result, and a result gets you the next five.", 5.65, GOLD);
}

// 38 Summary
{
  const s = content("Summary:", N.summary);
  sixCards(s, [
    ["A WEBINAR", "A free live online class that ends with an offer."],
    ["YOUR ROLE", "Run the whole thing for a creator, get paid on results."],
    ["THE SYSTEM", "Six steps, three numbers: sign up, show, buy."],
    ["THE HOUR", "Hook, story, teaching, bridge, offer, close, questions."],
    ["RESULTS", "Fix one step at a time. Jake went from €6,000 to €12,000."],
    ["SCALE", "Run it monthly, go always on, add ads, stack creators."],
  ], { h: 1.75, size: 15 });
  T(s, "Pick your skill area this week and send your first ten DMs by Friday.", { x: X0, y: 5.85, w: CW, h: 0.5, fontSize: 19, color: WHITE, bold: true });
}

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT, "slides:", pres.slides.length);
})();
