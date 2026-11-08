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

// ================= SLIDES =================
// 1 Title
sect("Opening");
{
  const s = pres.addSlide({ masterName: "VIP_TITLE", sectionTitle: section });
  const words = alt(["THE", "WEBINAR", "GROWTH", "SPECIALIST"]);
  words[2].options.breakLine = true; words[2].text = "GROWTH";
  s.addText(words, { placeholder: "title" });
  s.addNotes(N.title);
}

// 01 Role
{
  const s = content("What A Webinar Growth Specialist Does:", N.role);
  T(s, [
    { text: "You build and run the system that turns strangers into booked sales through a live webinar, and you ", options: { color: WHITE } },
    { text: "get paid on the result.", options: { color: GOLD } },
  ], { x: X0, y: 1.75, w: 11.6, h: 1.4, fontSize: 26, charSpacing: 0.5, lineSpacingMultiple: 1.3 });
  const y = 3.65, h = 2.3;
  card(s, 0.52, y, 3.3, h, "STRANGERS", "Cold traffic from ads, email lists, posts and partners.");
  chevron(s, 4.0, y + h / 2 - 0.17);
  card(s, 4.55, y, 4.2, h, "THE WEBINAR MACHINE", "Registration page, reminders, live session, offer, follow up and replay. You own every part.", { gold: true, fill: GOLD, fillT: 88 });
  chevron(s, 8.93, y + h / 2 - 0.17);
  card(s, 9.48, y, 3.33, h, "BOOKED SALES", "Paid visits, calls or orders the business can count and pay you on.");
}

// 02 Why
{
  const s = content("Why Webinars Sell:", N.why);
  const w = 3.896, y = 1.75, h = 2.75;
  [["TRUST AT SCALE", "An hour of watching you teach builds the trust a long sales call builds, with a hundred people at once."],
   ["ONE TO MANY", "You pitch once to the whole room instead of twenty separate times to one person."],
   ["A BUYER WHO CHOSE YOU", "They read the page, signed up and gave you an hour of their evening. That's a warm buyer."]]
    .forEach((c, i) => card(s, X0 + i * (w + 0.3), y, w, h, c[0], c[1], { size: 16, headSize: 20 }));
  stat(s, X0, 4.85, 6, "49 to 55 min", "average webinar engagement in recent ON24 benchmark data", { bigSize: 34, bigH: 0.6, labelH: 0.5 });
}

// 03 Money
{
  const s = content("The Money In It:", N.money);
  tag(s, "ILLUSTRATIVE");
  const w = 3.896, y = 1.75, h = 3.7;
  const cols = [
    ["PROJECT FEE", "One webinar built and run, start to finish, for a fixed price.", "Best for your first client", "€6,000"],
    ["MONTHLY RETAINER", "Run it every month, keep improving it, report the numbers.", "Best once the first one works", "€2,000 a month"],
    ["FEE PLUS A SHARE", "A smaller fee up front plus a cut of what the webinar brings in.", "Best with clean sales tracking", "€3,000 + 10%"],
  ];
  cols.forEach((c, i) => {
    const x = X0 + i * (w + 0.3);
    box(s, x, y, w, h, { gold: i === 0 });
    H(s, c[0], { x: x + 0.25, y: y + 0.25, w: w - 0.5, h: 0.4, color: GOLD, fontSize: 20 });
    T(s, c[1], { x: x + 0.25, y: y + 0.8, w: w - 0.5, h: 1.0, fontSize: 15 });
    T(s, c[2], { x: x + 0.25, y: y + 1.95, w: w - 0.5, h: 0.4, fontSize: 14, color: WHITE, italic: true });
    T(s, c[3], { x: x + 0.25, y: y + 2.55, w: w - 0.5, h: 0.8, fontFace: NUM, fontSize: 34, color: WHITE, valign: "bottom" });
  });
  T(s, "Published reference points: freelance funnel builders charge roughly $20 to $225 an hour (goLance, 2026). Consulting retainer examples sit around $4,000 to $7,500 a month (ClickUp, Clicksgeek). The euro figures above are for the builder example.",
    { x: X0, y: 5.65, w: CW, h: 0.7, fontSize: 12, color: MUTED });
}

// ---- Part One
sect("The Funnel");
divider("PART ONE", ["THE", "WEBINAR", "FUNNEL"], N.div1);

// 04 Funnel
{
  const s = content("The Full Webinar Funnel:", N.funnel);
  const stages = [
    ["TRAFFIC", "Ads, list, posts, partners"],
    ["REGISTRATION\nPAGE", "Name, email, mobile"],
    ["REMINDERS", "Email and text until start"],
    ["LIVE SESSION", "The hour itself"],
    ["OFFER", "Clear price, clear link"],
    ["FOLLOW UP", "Seven days after"],
    ["REPLAY", "Same deadline"],
  ];
  const gap = 0.22, w = (CW - gap * 6) / 7, y = 1.9, h = 2.0;
  const cx = [];
  stages.forEach((st, i) => {
    const x = X0 + i * (w + gap);
    cx.push(x + w / 2);
    const g = i === 3 || i === 4;
    box(s, x, y, w, h, { gold: g, fill: g ? GOLD : WHITE, fillT: g ? 88 : 94 });
    H(s, st[0], { x: x + 0.08, y: y + 0.2, w: w - 0.16, h: 0.75, fontSize: 15, charSpacing: 0.8, align: "center", valign: "middle", color: g ? GOLD : WHITE });
    T(s, st[1], { x: x + 0.12, y: y + 1.0, w: w - 0.24, h: 0.85, fontSize: 13, align: "center" });
  });
  // rate brackets
  const by = 4.25;
  const brackets = [[0, 1, "REGISTRATION RATE"], [1, 3, "SHOW RATE"], [3, 4, "BUY RATE"]];
  brackets.forEach(([a, b, lbl], k) => {
    const x1 = cx[a] + 0.06, x2 = cx[b] - 0.06;
    s.addShape(pres.shapes.LINE, { x: x1, y: by, w: x2 - x1, h: 0, line: { color: GOLD, width: 1.5 } });
    s.addShape(pres.shapes.LINE, { x: x1, y: by - 0.15, w: 0, h: 0.15, line: { color: GOLD, width: 1.5 } });
    s.addShape(pres.shapes.LINE, { x: x2, y: by - 0.15, w: 0, h: 0.15, line: { color: GOLD, width: 1.5 } });
    H(s, lbl, { x: x1 - 0.4, y: by + 0.1, w: x2 - x1 + 0.8, h: 0.35, fontSize: 14, color: GOLD, align: "center" });
  });
  T(s, "When a webinar isn't making money, one of these three rates is broken or the traffic is costing too much. Your job is finding which one.",
    { x: X0, y: 5.25, w: 11.2, h: 0.9, fontSize: 18, color: WHITE });
}

// 05 Traffic
{
  const s = content("Traffic: Where Registrants Come From:", N.traffic);
  const y = 1.75, w = 3.95, h = 2.05, gx = 0.3, gy = 0.3;
  const cs = [
    ["EMAIL LIST", "Free and warm. Past enquiries and customers who never went ahead."],
    ["ORGANIC CONTENT", "Posts, short videos, local groups. Free but slow, and hard to turn up when you need more."],
    ["PAID ADS", "Fast and scalable, but it costs money. Measure cost per registrant from day one."],
    ["PARTNERS", "Borrow a trusted audience. A kitchen firm or architect co hosts with the builder."],
  ];
  cs.forEach((c, i) => card(s, X0 + (i % 2) * (w + gx), y + Math.floor(i / 2) * (h + gy), w, h, c[0], c[1], { size: 15 }));
  const px = X0 + 2 * w + 2 * gx + 0.1, pw = 12.81 - px;
  box(s, px, y, pw, 2 * h + gy, { gold: true, fill: GOLD, fillT: 90 });
  H(s, "HOW TO CHOOSE", { x: px + 0.25, y: y + 0.25, w: pw - 0.5, h: 0.4, color: GOLD, fontSize: 20 });
  dots(s, [["List first,", "if they have one."], ["Proven offer and budget:", "add ads."], ["Neither:", "partners, and build the list as you go."], ["Always", "track cost per registrant."]],
    px + 0.25, y + 0.85, pw - 0.5, 0.82, { size: 15 });
}

// 06 Registration page
{
  const s = content("The Registration Page:", N.regpage);
  // wireframe
  const fx = 0.52, fy = 1.7, fw = 4.6, fh = 4.65;
  box(s, fx, fy, fw, fh, { fillT: 92 });
  const ix = fx + 0.3, iw = fw - 0.6;
  T(s, "Plan your extension without getting ripped off", { x: ix, y: fy + 0.25, w: iw, h: 0.75, fontSize: 17, bold: true, color: WHITE, charSpacing: 0 });
  T(s, "THURSDAY 7PM  ·  60 MINUTES  ·  FREE", { x: ix, y: fy + 1.05, w: iw, h: 0.3, fontFace: NUM, fontSize: 13, color: GOLD, charSpacing: 1.5 });
  ["What it should cost in your area", "The 3 costs left out of quotes", "How to spot a builder you can trust"].forEach((t, i) => {
    dot(s, ix, fy + 1.55 + i * 0.32 + 0.07, 0.08);
    T(s, t, { x: ix + 0.2, y: fy + 1.5 + i * 0.32, w: iw - 0.2, h: 0.3, fontSize: 12, color: GREY, charSpacing: 0.5 });
  });
  s.addShape(pres.shapes.OVAL, { x: ix, y: fy + 2.55, w: 0.38, h: 0.38, fill: { color: WHITE, transparency: 75 }, line: { color: GOLD, width: 1 } });
  T(s, "Hosted by the owner, 300 plus extensions built locally", { x: ix + 0.5, y: fy + 2.55, w: iw - 0.5, h: 0.4, fontSize: 11, valign: "middle", charSpacing: 0.3 });
  ["Name", "Email", "Mobile for reminders"].forEach((t, i) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: ix, y: fy + 3.1 + i * 0.36, w: iw, h: 0.3, rectRadius: 0.05, fill: { color: WHITE, transparency: 92 }, line: { color: WHITE, transparency: 70, width: 0.75 } });
    T(s, t, { x: ix + 0.1, y: fy + 3.1 + i * 0.36, w: iw - 0.2, h: 0.3, fontSize: 11, valign: "middle", color: MUTED, charSpacing: 0.3 });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: ix, y: fy + 4.17, w: iw, h: 0.34, rectRadius: 0.06, fill: { color: GOLD }, line: { color: GOLD, width: 0 } });
  T(s, "SAVE MY SEAT", { x: ix, y: fy + 4.17, w: iw, h: 0.34, fontFace: NUM, fontSize: 14, color: C.text1, align: "center", valign: "middle", charSpacing: 2 });
  // elements
  dots(s, [
    ["Headline:", "the result they want, in their words."],
    ["Date, time and length", "right at the top."],
    ["Three promises,", "each one specific."],
    ["Host photo", "and one line of real proof."],
    ["Short form:", "name, email, mobile for texts."],
    ["One button", "with an action on it."],
    ["Fast on mobile,", "button visible without scrolling far."],
  ], 5.6, 1.8, 7.2, 0.64, { size: 16 });
}

// 07 Registration fails
{
  const s = content("Why Registration Pages Fail:", N.regfail);
  box(s, X0, 1.75, 4.0, 4.5, { gold: true, fill: GOLD, fillT: 90 });
  T(s, "20 to 40%", { x: X0 + 0.3, y: 2.05, w: 3.4, h: 0.95, fontFace: NUM, fontSize: 50, color: GOLD, valign: "bottom" });
  T(s, "of visitors sign up on a typical webinar registration page. Warm traffic from an email list converts higher.", { x: X0 + 0.3, y: 3.15, w: 3.4, h: 1.7, fontSize: 15, color: WHITE });
  T(s, "Sources: GetResponse average of 22.84%; ClickMeeting 35 to 59% by traffic warmth.", { x: X0 + 0.3, y: 5.05, w: 3.4, h: 0.9, fontSize: 11, color: MUTED });
  const rows = [
    ["Headline about the business.", "Write the buyer's result in their words."],
    ["Date and time hidden.", "Put them at the top of the page."],
    ["Too many form fields.", "Ask only for what you'll use."],
    ["Slow on mobile.", "Test it on a phone over 4G first."],
    ["Ad and page don't match.", "Use the ad's promise as the headline."],
    ["Looks like a sales page.", "No prices on it, and one button."],
  ];
  const x = 4.9, w = 12.81 - x, rh = 0.62, gap = 0.155;
  rows.forEach((r, i) => {
    const y = 1.75 + i * (rh + gap);
    box(s, x, y, w, rh);
    T(s, r[0], { x: x + 0.25, y, w: 3.4, h: rh, fontSize: 15, color: WHITE, bold: true, valign: "middle", charSpacing: 0.5 });
    chevron(s, x + 3.75, y + rh / 2 - 0.12, 0.14, 0.24);
    T(s, r[1], { x: x + 4.1, y, w: w - 4.3, h: rh, fontSize: 15, valign: "middle", charSpacing: 0.5 });
  });
}

// 08 Reminders
{
  const s = content("Getting People To Turn Up:", N.reminders);
  const pts = [
    ["ON SIGN UP", "Email and text: time, link, calendar button"],
    ["2 TO 3 DAYS BEFORE", "Email: something useful and a reason to come"],
    ["24 HOURS BEFORE", "Email: what they'll get tomorrow"],
    ["MORNING OF", "Email and text: tonight at 7pm"],
    ["1 HOUR BEFORE", "Email: doors open soon, here's the link"],
    ["15 MINUTES BEFORE", "Text: we go live in 15"],
    ["WE'RE LIVE", "Email and text with the link"],
  ];
  const x1 = 1.05, x2 = 12.25, ly = 2.85, step = (x2 - x1) / 6, lw = 1.68;
  s.addShape(pres.shapes.LINE, { x: x1, y: ly, w: x2 - x1, h: 0, line: { color: GOLD, width: 1.5 } });
  pts.forEach((p, i) => {
    const cx = x1 + i * step;
    s.addShape(pres.shapes.OVAL, { x: cx - 0.11, y: ly - 0.11, w: 0.22, h: 0.22, fill: { color: GOLD }, line: { color: GOLD, width: 0 } });
    H(s, p[0], { x: cx - lw / 2, y: 1.75, w: lw, h: 0.9, fontSize: 15, color: GOLD, align: "center", valign: "bottom" });
    T(s, p[1], { x: cx - lw / 2, y: 3.1, w: lw, h: 1.25, fontSize: 13, align: "center", charSpacing: 0.5 });
  });
  stat(s, X0, 4.55, 5.6, "15 to 33%", "of registrants sign up on the day itself (GoTo, ON24, Livestorm data)", { bigSize: 36, bigH: 0.65, labelH: 0.7 });
  stat(s, 6.6, 4.55, 6.0, "30 to 50%", "typical live show rate (Goldcast, Univid, Livestorm data)", { bigSize: 36, bigH: 0.65, labelH: 0.7 });
}

// 09 Messages
{
  const s = content("Reminder Messages You Can Copy:", N.messages);
  const w = 3.896, y = 1.75, h = 4.0;
  const ms = [
    ["ON SIGN UP", "TEXT", "You're booked in for Planning Your Extension, Thursday at 7pm. Your link: [link]. Save this number so you get your reminder."],
    ["MORNING OF", "EMAIL", "Subject: Tonight at 7, the 3 costs builders leave out of quotes\n\nDoors open at 6.55pm. Bring your rough budget, I'll show you how to check any quote line by line. Join here: [link]"],
    ["15 MINUTES BEFORE", "TEXT", "We go live in 15 minutes. Grab a cuppa and join here: [link]"],
  ];
  ms.forEach((m, i) => {
    const x = X0 + i * (w + 0.3);
    box(s, x, y, w, h);
    H(s, m[0], { x: x + 0.25, y: y + 0.25, w: w - 1.3, h: 0.4, fontSize: 18, color: GOLD });
    T(s, m[1], { x: x + w - 1.05, y: y + 0.27, w: 0.8, h: 0.36, fontFace: NUM, fontSize: 13, color: MUTED, align: "right", valign: "middle", charSpacing: 2 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.25, y: y + 0.85, w: w - 0.5, h: h - 1.1, rectRadius: 0.08, fill: { color: C.text1, transparency: 40 }, line: { color: GOLD, transparency: 60, width: 0.75 } });
    T(s, m[2], { x: x + 0.45, y: y + 1.05, w: w - 0.9, h: h - 1.5, fontSize: 14, color: WHITE, charSpacing: 0.3, lineSpacingMultiple: 1.3 });
  });
  T(s, [{ text: "Test every link on your own phone ", options: { color: WHITE, bold: true } }, { text: "before the sequence goes live." }],
    { x: X0, y: 5.95, w: CW, h: 0.45, fontSize: 15 });
}

// ---- Part Two
sect("Running The Webinar");
divider("PART TWO", ["RUNNING", "THE", "WEBINAR"], N.div2);

// 10 Run of show
{
  const s = content("The Webinar, Section By Section:", N.runofshow);
  const segs = [["HOOK", 5], ["STORY", 5], ["TEACHING", 25], ["BRIDGE", 5], ["OFFER", 10], ["CLOSE", 5], ["Q AND A", 5]];
  const y = 2.0, h = 0.75; let x = X0; let t = 0;
  segs.forEach(([name, m], i) => {
    const w = CW * m / 60;
    const g = name === "OFFER" || name === "CLOSE";
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.03, y, w: w - 0.06, h, fill: { color: g ? GOLD : WHITE, transparency: g ? 15 : (name === "TEACHING" ? 80 : 88) }, line: { color: g ? GOLD : WHITE, transparency: g ? 0 : 80, width: 0.75 } });
    H(s, name, { x: x + 0.02, y: y + h + 0.15, w: w - 0.04, h: 0.4, fontSize: 14, charSpacing: 0.8, align: "center", color: g ? GOLD : WHITE });
    T(s, `${t} to ${t + m}`, { x: x + 0.02, y: y + h + 0.6, w: w - 0.04, h: 0.35, fontSize: 12, align: "center", charSpacing: 0 });
    t += m; x += w;
  });
  T(s, "Minutes into a 60 minute webinar", { x: X0, y: 3.75, w: 6, h: 0.3, fontSize: 12, color: MUTED });
  card(s, X0, 4.35, 6.0, 1.9, "ABOUT AN HOUR", "Typical length on ON24's platform, with average engagement of roughly 49 to 55 minutes.", { size: 15 });
  card(s, 6.81, 4.35, 6.0, 1.9, "THE RULE", "If you can't fill 60 minutes with good material, run 45. Padding loses people right before the offer.", { size: 15 });
}

// 11 Hook
{
  const s = content("The Hook And The First Five Minutes:", N.hook);
  const rows = [
    ["Say the result and who it's for.", "Start on time, start strong."],
    ["Give a reason to stay to the end.", "A bonus only for people who are live."],
    ["Deliver a quick win.", "Something useful in the first few minutes."],
    ["Get them typing in the chat.", "Early typers stay longer."],
    ["Lay out the plan for the hour.", "Mention you'll show how to work together at the end."],
  ];
  rows.forEach((r, i) => {
    const y = 1.75 + i * 0.9;
    H(s, `MIN ${i + 1}`, { x: X0, y: y + 0.02, w: 0.95, h: 0.4, fontSize: 18, color: GOLD });
    T(s, [{ text: r[0], options: { color: WHITE, bold: true, breakLine: true } }, { text: r[1], options: { color: GREY } }], { x: X0 + 1.05, y, w: 5.8, h: 0.85, fontSize: 15 });
  });
  const x = 7.6, w = 12.81 - x;
  box(s, x, 1.75, w, 4.5, { gold: true, fill: GOLD, fillT: 90 });
  H(s, "THE BUILDER'S OPENING LINE", { x: x + 0.3, y: 2.0, w: w - 0.6, h: 0.4, color: GOLD });
  T(s, "“By 8 o'clock tonight you'll know what your extension should cost, the three costs that get left out of quotes, and how to spot a builder you can trust before you hand over a deposit.”",
    { x: x + 0.3, y: 2.6, w: w - 0.6, h: 3.3, fontSize: 19, color: WHITE, italic: true, lineSpacingMultiple: 1.35, charSpacing: 0.3 });
}

// 12 Story
{
  const s = content("The Credibility Story:", N.story);
  const steps = [
    ["WHERE THEY WERE", "Working for a firm that underquoted every job."],
    ["WHAT WENT WRONG", "Families hit with extras halfway through the build."],
    ["WHAT CHANGED", "He started pricing every job line by line, with fixed quotes."],
    ["PROOF NOW", "300 plus extensions in the area, with photos and reviews."],
  ];
  const gap = 0.4, w = (CW - 3 * gap) / 4, y = 1.8, h = 2.55;
  steps.forEach((st, i) => {
    const x = X0 + i * (w + gap);
    card(s, x, y, w, h, st[0], st[1], { size: 15, gold: i === 3, headColor: GOLD, headH: 0.4 });
    if (i < 3) chevron(s, x + w + 0.09, y + h / 2 - 0.17);
  });
  T(s, [{ text: "Five minutes, and about the buyer. ", options: { color: WHITE, bold: true } }, { text: "Proof beats bragging: show a finished job with the homeowner's review. Use only what's true for your client.", options: {} }],
    { x: X0, y: 4.75, w: 11.5, h: 1.2, fontSize: 18 });
}

// 13 Teaching
{
  const s = content("Teaching That Sells Without Giving Everything Away:", N.teaching);
  card(s, X0, 1.75, 6.0, 1.3, "ON THE WEBINAR", "Teach the what and the why.", { size: 17, textColor: WHITE });
  card(s, 6.81, 1.75, 6.0, 1.3, "IN THE OFFER", "Sell the how and the doing.", { size: 17, textColor: WHITE, gold: true, fill: GOLD, fillT: 88 });
  H(s, "THREE POINTS, EACH ONE CLEARS A DOUBT", { x: X0, y: 3.3, w: 8, h: 0.4, fontSize: 18, color: GOLD });
  const pts = [
    ["What an extension costs per square metre locally", "“I can't afford it.”"],
    ["The three costs that get left out of quotes", "“Builders always rip you off.”"],
    ["How the process runs, with real timings", "“It'll take forever.”"],
  ];
  pts.forEach((p, i) => {
    const y = 3.85 + i * 0.8;
    box(s, X0, y, CW, 0.66);
    T(s, String(i + 1), { x: X0 + 0.2, y, w: 0.4, h: 0.66, fontFace: NUM, fontSize: 22, color: GOLD, valign: "middle" });
    T(s, p[0], { x: X0 + 0.7, y, w: 7.0, h: 0.66, fontSize: 16, color: WHITE, valign: "middle", charSpacing: 0.5 });
    T(s, "clears", { x: 7.9, y, w: 0.9, h: 0.66, fontSize: 13, color: MUTED, valign: "middle", italic: true });
    T(s, p[1], { x: 8.8, y, w: 3.85, h: 0.66, fontSize: 16, color: GREY, valign: "middle", italic: true, charSpacing: 0.5 });
  });
}

// 14 Bridge
{
  const s = content("The Bridge To The Offer:", N.bridge);
  box(s, X0, 1.75, CW, 2.05, { gold: true, fill: GOLD, fillT: 90 });
  T(s, "“You now know what it should cost and what to watch for. The quickest way to get it right is a fixed price plan for your house.”",
    { x: X0 + 0.4, y: 1.95, w: CW - 0.8, h: 1.65, fontSize: 22, color: WHITE, italic: true, valign: "middle", lineSpacingMultiple: 1.35, charSpacing: 0.3 });
  const steps = [["1  RECAP", "Run back through the three points so they feel what they've learned."], ["2  SHOW THE GAP", "Knowing what to do and getting it done are different things. Name what's missing."], ["3  ASK PERMISSION", "“Want me to show you how we do it with you? Pop a yes in the chat.” Wait for the yeses."]];
  const w = 3.896;
  steps.forEach((st, i) => card(s, X0 + i * (w + 0.3), 4.1, w, 2.15, st[0], st[1], { size: 15, headColor: GOLD }));
}

// 15 Offer
{
  const s = content("Presenting The Offer And Stacking Value:", N.offer);
  tag(s, "ILLUSTRATIVE");
  const hdr = { fontFace: NUM, fontSize: 14, color: GOLD, bold: false, charSpacing: 2 };
  const cell = (t, o = {}) => ({ text: t, options: Object.assign({ fontFace: BODY, fontSize: 15, color: GREY }, o) });
  const rows = [
    [cell("WHAT'S INCLUDED", hdr), cell("WHAT IT GETS THEM", hdr), cell("VALUE", Object.assign({}, hdr, { align: "right" }))],
    [cell("Measured survey", { color: WHITE }), cell("Exact sizes, no guesswork"), cell("€400", { align: "right", color: WHITE })],
    [cell("3D concept drawings", { color: WHITE }), cell("See it before you commit"), cell("€600", { align: "right", color: WHITE })],
    [cell("Fixed price written quote", { color: WHITE }), cell("Every line itemised"), cell("€250", { align: "right", color: WHITE })],
    [cell("Planning check", { color: WHITE }), cell("Know what's allowed"), cell("€300", { align: "right", color: WHITE })],
    [cell("Total value", { color: WHITE, bold: true }), cell(""), cell("€1,550", { align: "right", color: WHITE, bold: true })],
    [cell("Tonight", { color: GOLD, bold: true, fontSize: 18 }), cell("Comes off the build", { color: GOLD }), cell("€295", { align: "right", color: GOLD, bold: true, fontSize: 22, fontFace: NUM })],
  ];
  s.addTable(rows, {
    x: X0, y: 1.75, w: 7.6, colW: [2.9, 3.4, 1.3], rowH: 0.58, valign: "middle",
    border: { type: "solid", pt: 0.75, color: "3A3D42" }, fill: { color: WHITE, transparency: 100 }, margin: [0, 0.12, 0, 0.12],
  });
  const x = 8.5, w = 12.81 - x;
  box(s, x, 1.75, w, 4.5);
  H(s, "THE RULES", { x: x + 0.25, y: 2.0, w: w - 0.5, h: 0.4, color: GOLD, fontSize: 20 });
  dots(s, ["One line per item, with an outcome and an honest value.", "Say the price once, clearly.", "Live bonus: a priority start slot.", "Link on screen, in the chat, and said out loud."], x + 0.25, 2.65, w - 0.5, 0.88, { size: 15 });
}

// 16 Close
{
  const s = content("Handling The Live Close:", N.close);
  const cs = [
    ["A REAL DEADLINE", "Say when it ends and keep to it. Fake deadlines kill the next webinar."],
    ["A BONUS FOR TONIGHT", "Something that only makes sense for people who decide fast."],
    ["READ OUT BOOKINGS", "With permission, and only when they're real."],
    ["LINK STAYS ON SCREEN", "Through the whole of the questions."],
    ["REPEAT THE OFFER", "Two or three times as you answer questions. People join late."],
    ["ANSWER THE WORRY", "A question about timings is usually a worry about disruption."],
  ];
  const w = 3.896, h = 2.1;
  cs.forEach((c, i) => card(s, X0 + (i % 3) * (w + 0.3), 1.75 + Math.floor(i / 3) * (h + 0.3), w, h, c[0], c[1], { size: 15, headColor: GOLD }));
}

// 17 Objections
{
  const s = content("Objections On The Day:", N.objections);
  const cs = [
    ["“I can't afford it.”", "The €295 comes off the build, and you leave with a fixed price, so you know where you stand."],
    ["“I need to talk to my partner.”", "Book a time you're both home. Keep the drawings and quote even if you don't go ahead."],
    ["“I'm not sure it'll work for my house.”", "Type your situation in the chat and I'll answer it live, right now."],
    ["“I'll do it later.”", "Start dates book up months ahead. The priority slot is for this week's bookings only."],
  ];
  const w = 6.0, h = 2.1;
  cs.forEach((c, i) => {
    const x = X0 + (i % 2) * (w + 0.29), y = 1.75 + Math.floor(i / 2) * (h + 0.3);
    box(s, x, y, w, h);
    T(s, c[0], { x: x + 0.3, y: y + 0.25, w: w - 0.6, h: 0.45, fontSize: 19, color: GOLD, italic: true, charSpacing: 0.3 });
    T(s, c[1], { x: x + 0.3, y: y + 0.85, w: w - 0.6, h: 1.1, fontSize: 15 });
  });
}

// 18 Follow up
{
  const s = content("Follow Up: The 7 Day Sequence And The Replay:", N.followup);
  const days = [["0", "Replay link and offer recap"], ["1", "Top questions answered"], ["2", "Case study: one real job"], ["3", "The cost of waiting"], ["5", "Replay comes down tomorrow"], ["6", "Last day, email and text"], ["7", "Doors closed, next date"]];
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
  T(s, "Same deadline as the live offer. Add timestamps so people can jump to the offer. Take it down when you said you would.", { x: X0 + 0.3, y: 4.9, w: 6.6, h: 1.2, fontSize: 15, color: WHITE });
  stat(s, 7.9, 4.3, 4.6, "42 to 43%", "of webinar views come from on demand replays (Contrast; ON24, 2025)", { bigSize: 36, bigH: 0.65, labelH: 0.8 });
}

// ---- Part Three
sect("The Numbers");
divider("PART THREE", ["THE", "NUMBERS"], N.div3);

// 19 Metrics
{
  const s = content("The Five Numbers You Track:", N.metrics);
  const hdr = { fontFace: NUM, fontSize: 14, color: GOLD, charSpacing: 2 };
  const c = (t, o = {}) => ({ text: t, options: Object.assign({ fontFace: BODY, fontSize: 15, color: GREY }, o) });
  const rows = [
    [c("NUMBER", hdr), c("HOW TO WORK IT OUT", hdr), c("PLANNING RANGE", hdr), c("SOURCE", hdr)],
    [c("Cost per registrant", { color: WHITE, bold: true }), c("Ad spend ÷ registrants"), c("Varies widely, test your own", { color: WHITE }), c("GrowthSpree; WordStream", { fontSize: 12 })],
    [c("Registration rate", { color: WHITE, bold: true }), c("Registrants ÷ page visitors"), c("20 to 40%", { color: WHITE }), c("GetResponse; ClickMeeting", { fontSize: 12 })],
    [c("Show rate", { color: WHITE, bold: true }), c("Live attendees ÷ registrants"), c("30 to 50% live", { color: WHITE }), c("Goldcast; Univid; Livestorm", { fontSize: 12 })],
    [c("Buy rate", { color: WHITE, bold: true }), c("Buyers ÷ live attendees"), c("5 to 15% on a sales webinar", { color: WHITE }), c("ClickMeeting; EasyWebinar; Focus Digital", { fontSize: 12 })],
    [c("Revenue per attendee", { color: WHITE, bold: true }), c("Revenue ÷ live attendees"), c("Your own number to beat", { color: GOLD }), c("Your client's data", { fontSize: 12 })],
  ];
  s.addTable(rows, {
    x: X0, y: 1.75, w: CW, colW: [3.0, 3.5, 3.2, 2.59], rowH: 0.62, valign: "middle",
    border: { type: "solid", pt: 0.75, color: "3A3D42" }, fill: { color: WHITE, transparency: 100 }, margin: [0, 0.12, 0, 0.12],
  });
  T(s, "Published ranges come from vendor benchmarks and tell you where to look. Your client's own numbers, webinar after webinar, are what you manage.",
    { x: X0, y: 5.75, w: CW, h: 0.5, fontSize: 12, color: MUTED });
}

// 20 Diagnose
{
  const s = content("Find The Broken Stage:", N.diagnose);
  const cols = [["SYMPTOM", 0.52, 3.4], ["WHERE TO LOOK", 4.27, 3.2], ["FIRST FIX", 7.82, 4.99]];
  cols.forEach(([t, x, w]) => H(s, t, { x: x + 0.2, y: 1.7, w, h: 0.35, fontSize: 15, color: GOLD }));
  const rows = [
    ["High cost per registrant", "Ads and targeting", "Test three new ad angles to the same page"],
    ["Low registration rate", "The page and the promise", "Rewrite the headline on the result, cut fields"],
    ["Low show rate", "Reminders and timing", "Add texts, and check the slot suits the buyer"],
    ["Low buy rate", "The offer and the pitch", "Fix the bridge, the stack and the deadline"],
  ];
  rows.forEach((r, i) => {
    const y = 2.2 + i * 0.92, h = 0.76;
    cols.forEach(([, x, w], j) => {
      box(s, x, y, w, h, j === 2 ? { gold: true, fill: GOLD, fillT: 92 } : {});
      T(s, r[j], { x: x + 0.2, y, w: w - 0.4, h, fontSize: 15, valign: "middle", color: j === 0 ? WHITE : GREY, bold: j === 0, charSpacing: 0.5 });
    });
    chevron(s, 3.98, y + h / 2 - 0.12, 0.14, 0.24);
    chevron(s, 7.53, y + h / 2 - 0.12, 0.14, 0.24);
  });
  T(s, [{ text: "One fix at a time, then run it again. ", options: { color: WHITE, bold: true } }, { text: "Change four things at once and you'll never know which one worked." }],
    { x: X0, y: 5.95, w: CW, h: 0.45, fontSize: 15 });
}

// 21 Example before
{
  const s = content("Worked Example: The Builder, Before:", N.exbefore);
  tag(s, "ILLUSTRATIVE");
  const st = [
    ["€2,500", "ad spend a month"],
    ["250", "registrants at €10 each"],
    ["50", "live, a 20% show rate"],
    ["5", "design visits, a 10% buy rate"],
    ["2", "jobs, 40% of visits"],
    ["€12,000", "gross profit on €60,000 revenue"],
  ];
  const gap = 0.25, w = (CW - 5 * gap) / 6, y = 1.85, h = 2.25;
  st.forEach((p, i) => {
    const x = X0 + i * (w + gap);
    const broken = i === 2;
    box(s, x, y, w, h, broken ? { gold: true, fill: GOLD, fillT: 85 } : {});
    T(s, p[0], { x: x + 0.1, y: y + 0.2, w: w - 0.2, h: 0.8, fontFace: NUM, fontSize: 30, color: broken ? GOLD : WHITE, align: "center", valign: "middle" });
    T(s, p[1], { x: x + 0.15, y: y + 1.1, w: w - 0.3, h: 1.0, fontSize: 13, align: "center", charSpacing: 0.5 });
    if (i < 5) chevron(s, x + w + 0.06, y + h / 2 - 0.1, 0.12, 0.2);
  });
  const bx = X0 + 2 * (w + gap);
  H(s, "BROKEN STAGE", { x: bx, y: y + h + 0.12, w, h: 0.35, fontSize: 14, color: GOLD, align: "center" });
  box(s, X0, 4.85, CW, 1.4);
  T(s, [{ text: "Diagnosis: ", options: { color: WHITE, bold: true } }, { text: "cost per registrant and buy rate look healthy. A 20% show rate sits well below the 30 to 50% range. Reminders were email only, and the webinar ran at 1pm on a weekday while homeowners were at work." }],
    { x: X0 + 0.3, y: 4.85, w: CW - 0.6, h: 1.4, fontSize: 16, valign: "middle" });
}

// 22 Example after
{
  const s = content("Worked Example: Fixing One Stage:", N.exafter);
  tag(s, "ILLUSTRATIVE");
  const hdr = { fontFace: NUM, fontSize: 14, color: GOLD, charSpacing: 2 };
  const c = (t, o = {}) => ({ text: t, options: Object.assign({ fontFace: BODY, fontSize: 15, color: GREY }, o) });
  const rows = [
    [c("", hdr), c("BEFORE", Object.assign({ align: "right" }, hdr)), c("AFTER", Object.assign({ align: "right" }, hdr))],
    [c("Show rate", { color: WHITE }), c("20%", { align: "right" }), c("40%", { align: "right", color: GOLD, bold: true })],
    [c("Live attendees", { color: WHITE }), c("50", { align: "right" }), c("100", { align: "right", color: WHITE })],
    [c("Design visits", { color: WHITE }), c("5", { align: "right" }), c("10", { align: "right", color: WHITE })],
    [c("Jobs", { color: WHITE }), c("2", { align: "right" }), c("4", { align: "right", color: WHITE })],
    [c("Revenue", { color: WHITE }), c("€60,000", { align: "right" }), c("€120,000", { align: "right", color: WHITE })],
    [c("Gross profit", { color: WHITE, bold: true }), c("€12,000", { align: "right" }), c("€24,000", { align: "right", color: GOLD, bold: true })],
  ];
  s.addTable(rows, { x: X0, y: 1.75, w: 6.4, colW: [2.6, 1.9, 1.9], rowH: 0.56, valign: "middle", border: { type: "solid", pt: 0.75, color: "3A3D42" }, fill: { color: WHITE, transparency: 100 }, margin: [0, 0.12, 0, 0.12] });
  s.addChart(pres.charts.BAR, [{ name: "Gross profit", labels: ["Before", "After"], values: [12000, 24000] }], {
    x: 7.3, y: 1.75, w: 5.5, h: 3.95, barDir: "col", chartColors: ["8A8B8D", GOLD_HEX], invertedColors: [GOLD_HEX],
    showTitle: true, title: "Gross profit a month (€)", titleColor: "F6F6F6", titleFontSize: 14, titleFontFace: "+mn-lt",
    showValue: true, dataLabelPosition: "outEnd", dataLabelColor: "F6F6F6", dataLabelFontSize: 14, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "€#,##0",
    catAxisLabelColor: "A3A5A8", catAxisLabelFontSize: 13, catAxisLabelFontFace: "+mn-lt", valAxisHidden: true,
    valGridLine: { style: "none" }, catGridLine: { style: "none" }, showLegend: false, barGapWidthPct: 80, valAxisMaxVal: 28000, valAxisMinVal: 0,
    catAxisLineColor: "3A3D42",
  });
  T(s, [{ text: "Same €2,500 spend, same 250 registrants. ", options: { color: WHITE, bold: true } }, { text: "Texts added, slot moved to 7pm, profit doubled." }],
    { x: X0, y: 5.85, w: CW, h: 0.5, fontSize: 15 });
}

// ---- Part Four
sect("Becoming One");
divider("PART FOUR", ["BECOMING", "ONE"], N.div4);

// 23 Tools
{
  const s = content("The Tools And What Each Is For:", N.tools);
  const cs = [
    ["THE WEBINAR ROOM", "Runs the live session.", "Zoom Webinars, Livestorm, WebinarJam, ON24"],
    ["PAGES AND FORMS", "Your sign up pages.", "GoHighLevel, ClickFunnels, Leadpages, WordPress"],
    ["EMAIL AND TEXT", "Reminders and follow up.", "ActiveCampaign or GoHighLevel, plus a text provider"],
    ["BOOKING AND PAYMENTS", "Takes the money or the booking.", "Calendly, Stripe"],
    ["TRACKING", "Shows where sign ups came from.", "Meta pixel, Google Analytics, tagged links, one sheet"],
    ["SLIDES AND REPLAY", "The deck and the recording.", "Canva or Keynote, platform recording"],
  ];
  const w = 3.896, h = 2.15;
  cs.forEach((c, i) => {
    const x = X0 + (i % 3) * (w + 0.3), y = 1.75 + Math.floor(i / 3) * (h + 0.3);
    box(s, x, y, w, h);
    H(s, c[0], { x: x + 0.25, y: y + 0.2, w: w - 0.5, h: 0.4, color: GOLD });
    T(s, c[1], { x: x + 0.25, y: y + 0.68, w: w - 0.5, h: 0.6, fontSize: 15, color: WHITE });
    T(s, c[2], { x: x + 0.25, y: y + 1.33, w: w - 0.5, h: 0.7, fontSize: 13 });
  });
}

// 24 Skills
{
  const s = content("The Skills, In The Order To Learn Them:", N.skills);
  const sk = [
    ["FUNNEL MATHS", "A weekend with a spreadsheet"],
    ["COPYWRITING", "Write every single day"],
    ["WEBINAR SCRIPTING", "Script imaginary webinars"],
    ["TECH AND AUTOMATION", "Build your own demo funnel"],
    ["TRAFFIC BASICS", "Run a small Meta test"],
    ["READING THE NUMBERS", "Diagnose public webinars"],
    ["SELLING YOUR SERVICE", "Outreach, calls, proposals"],
  ];
  const gap = 0.15, w = (CW - 6 * gap) / 7, base = 6.3;
  sk.forEach((k, i) => {
    const h = 1.75 + i * 0.4, x = X0 + i * (w + gap), y = base - h;
    const last = i === 6;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: last ? GOLD : WHITE, transparency: last ? 82 : 92 - i }, line: { color: last ? GOLD : WHITE, transparency: last ? 0 : 82, width: 0.75 } });
    T(s, String(i + 1), { x: x + 0.15, y: y + 0.12, w: w - 0.3, h: 0.45, fontFace: NUM, fontSize: 24, color: GOLD });
    H(s, k[0], { x: x + 0.15, y: y + 0.6, w: w - 0.3, h: 0.6, fontSize: 14 });
    T(s, k[1], { x: x + 0.15, y: y + 1.2, w: w - 0.3, h: 0.5, fontSize: 12, charSpacing: 0 });
  });
}

// 25 Niche
{
  const s = content("Choosing A Niche And Your First Client:", N.niche);
  box(s, X0, 1.75, 6.0, 4.5);
  H(s, "WHAT MAKES A GOOD NICHE", { x: X0 + 0.25, y: 2.0, w: 5.5, h: 0.4, color: GOLD, fontSize: 20 });
  dots(s, [["High value sale,", "ideally €3,000 plus."], ["They sell by talking", "to people already."], ["They have leads", "or budget for them."], ["Someone can present,", "or you train them."], ["You understand", "their customer."]],
    X0 + 0.25, 2.65, 5.5, 0.68, { size: 16 });
  const x = 6.81, w = 6.0;
  H(s, "NICHES THAT FIT", { x, y: 1.75, w, h: 0.4, color: GOLD, fontSize: 20 });
  const chips = ["Extension builders", "Solar and heat pumps", "Dental implant clinics", "Financial advisers", "Mortgage brokers", "B2B software", "Accountants", "Training providers"];
  chips.forEach((t, i) => {
    const cx = x + (i % 2) * 3.05, cy = 2.3 + Math.floor(i / 2) * 0.55;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx, y: cy, w: 2.9, h: 0.42, rectRadius: 0.21, fill: { color: WHITE, transparency: 92 }, line: { color: GOLD, transparency: 40, width: 0.75 } });
    T(s, t, { x: cx, y: cy, w: 2.9, h: 0.42, fontSize: 14, color: WHITE, align: "center", valign: "middle", charSpacing: 0.5 });
  });
  card(s, x, 4.65, w, 1.6, "YOUR FIRST CLIENT", "Someone you can reach directly through your own network. Warm intros get meetings in days.", { size: 15, gold: true, fill: GOLD, fillT: 90 });
}

// 26 Outreach
{
  const s = content("Outreach Messages That Get Replies:", N.outreach);
  const w = 6.0, h = 3.85;
  const ms = [
    ["COLD, TO THE BUILDER", "Hi Declan, I tried calling twice this week and got voicemail both times, which makes sense when you're on site. Every missed call is a job going elsewhere. I build evening webinars where homeowners learn your process and book a paid design visit online, no phone tag. If that's worth a 15 minute chat, reply yes and I'll send two times."],
    ["WARM, TO PEOPLE YOU KNOW", "Hey Ciara, quick one. I've started building webinars that get local businesses booked sales, things like builders and clinics. If you know an owner who sells something over €3,000 and wants more of the right enquiries, I'd love an intro. I'll look after them."],
  ];
  ms.forEach((m, i) => {
    const x = X0 + i * (w + 0.29);
    box(s, x, 1.75, w, h);
    H(s, m[0], { x: x + 0.3, y: 1.98, w: w - 0.6, h: 0.4, color: GOLD });
    T(s, m[1], { x: x + 0.3, y: 2.55, w: w - 0.6, h: 2.95, fontSize: 15, color: WHITE, charSpacing: 0.3, lineSpacingMultiple: 1.3 });
  });
  T(s, [{ text: "20 a day is 100 a week. ", options: { color: WHITE, bold: true } }, { text: "No replies after 100, rewrite the message. Replies but no calls, fix your follow up." }],
    { x: X0, y: 5.85, w: CW, h: 0.45, fontSize: 15 });
}

// 27 Offer & call
{
  const s = content("A Simple Offer And What To Show On The Call:", N.offercall);
  tag(s, "ILLUSTRATIVE");
  box(s, X0, 1.75, 5.6, 4.5, { gold: true, fill: GOLD, fillT: 90 });
  H(s, "THE FIRST OFFER", { x: X0 + 0.3, y: 2.0, w: 5.0, h: 0.4, color: GOLD, fontSize: 20 });
  T(s, "“I'll build and run one webinar for you, start to finish, for €6,000. If it doesn't book at least 5 paid design visits, I'll run the next one free.”",
    { x: X0 + 0.3, y: 2.6, w: 5.0, h: 3.3, fontSize: 19, color: WHITE, italic: true, lineSpacingMultiple: 1.35, charSpacing: 0.3 });
  const x = 6.5, w = 12.81 - x;
  H(s, "WHAT TO SHOW ON THE CALL", { x, y: 1.75, w, h: 0.4, color: GOLD, fontSize: 20 });
  const items = ["Their numbers on the funnel diagram", "The cost of the problem, worked out with them", "A teardown of their current page or process", "A simple 30 day plan", "Proof: your demo funnel or a past result"];
  items.forEach((t, i) => {
    const y = 2.35 + i * 0.78;
    box(s, x, y, w, 0.64);
    T(s, String(i + 1), { x: x + 0.2, y, w: 0.4, h: 0.64, fontFace: NUM, fontSize: 20, color: GOLD, valign: "middle" });
    T(s, t, { x: x + 0.65, y, w: w - 0.85, h: 0.64, fontSize: 15, color: WHITE, valign: "middle", charSpacing: 0.5 });
  });
}

// 28 Pricing 1
{
  const s = content("Pricing: Put A Number On The Problem:", N.pricing1);
  tag(s, "ILLUSTRATIVE");
  const st = [["20", "missed calls a month"], ["1 in 10", "would have become a job"], ["2", "jobs lost a month"], ["€60,000", "revenue lost a month"], ["€12,000", "gross profit lost a month"]];
  const gap = 0.3, w = (CW - 4 * gap) / 5, y = 1.85, h = 2.1;
  st.forEach((p, i) => {
    const x = X0 + i * (w + gap);
    box(s, x, y, w, h);
    T(s, p[0], { x: x + 0.1, y: y + 0.2, w: w - 0.2, h: 0.85, fontFace: NUM, fontSize: 34, color: WHITE, align: "center", valign: "middle" });
    T(s, p[1], { x: x + 0.15, y: y + 1.15, w: w - 0.3, h: 0.8, fontSize: 14, align: "center", charSpacing: 0.5 });
    if (i < 4) chevron(s, x + w + 0.08, y + h / 2 - 0.1, 0.14, 0.2);
  });
  box(s, X0, 4.3, CW, 1.95, { gold: true, fill: GOLD, fillT: 88 });
  T(s, "€144,000", { x: X0 + 0.4, y: 4.45, w: 4.6, h: 1.65, fontFace: NUM, fontSize: 60, color: GOLD, valign: "middle" });
  T(s, [{ text: "a year in lost profit. ", options: { color: WHITE, bold: true } }, { text: "Work it out with the client using their own numbers, and write it where they can see it." }],
    { x: 5.3, y: 4.45, w: 7.2, h: 1.65, fontSize: 18, valign: "middle" });
}

// 29 Pricing 2
{
  const s = content("Price Against The Problem:", N.pricing2);
  tag(s, "ILLUSTRATIVE");
  T(s, [{ text: "Value of the fix: ", options: { color: WHITE, bold: true } }, { text: "4 jobs a month and €24,000 gross profit a month, from the worked example." }],
    { x: X0, y: 1.75, w: CW, h: 0.45, fontSize: 17 });
  const w = 3.896, y = 2.45, h = 3.0;
  const cs = [["PROJECT FEE", "€6,000", "Paid back by the profit on one job."], ["RETAINER", "€2,000 a month", "Three month minimum, run and improved monthly."], ["FEE PLUS SHARE", "€3,000 + 10%", "10% of gross profit on webinar jobs. At 4 jobs, €2,400 a month."]];
  cs.forEach((c, i) => {
    const x = X0 + i * (w + 0.3);
    box(s, x, y, w, h, { gold: i === 1 });
    H(s, c[0], { x: x + 0.25, y: y + 0.25, w: w - 0.5, h: 0.4, color: GOLD, fontSize: 20 });
    T(s, c[1], { x: x + 0.25, y: y + 0.75, w: w - 0.5, h: 0.8, fontFace: NUM, fontSize: 34, color: WHITE, valign: "middle" });
    T(s, c[2], { x: x + 0.25, y: y + 1.7, w: w - 0.5, h: 1.15, fontSize: 15 });
  });
  T(s, [{ text: "Against a €144,000 a year problem, every option is an easy yes. ", options: { color: GOLD, bold: true } }, { text: "" }],
    { x: X0, y: 5.75, w: CW, h: 0.55, fontSize: 16 });
}

// 30 Delivery
{
  const s = content("Delivering A Client Project:", N.delivery);
  const wk = [
    ["WEEK 1", "KICKOFF AND RESEARCH", ["Agree offer, date, numbers", "Interview 3 to 5 past customers", "Pull their words for the copy"]],
    ["WEEK 2", "BUILD", ["Script and slides", "Pages, reminders, follow up", "Tracking, client sign off"]],
    ["WEEK 3", "PROMOTE", ["Registration opens 7 to 10 days out", "Email the list, ads on", "Partner emails go out"]],
    ["WEEK 4", "LAUNCH", ["Full dry run two days before", "Go live, run the 7 days", "One page report and next steps"]],
  ];
  const gap = 0.3, w = (CW - 3 * gap) / 4, y = 1.75, h = 4.5;
  wk.forEach((k, i) => {
    const x = X0 + i * (w + gap);
    box(s, x, y, w, h, { gold: i === 3 });
    T(s, k[0], { x: x + 0.25, y: y + 0.2, w: w - 0.5, h: 0.55, fontFace: NUM, fontSize: 28, color: GOLD });
    H(s, k[1], { x: x + 0.25, y: y + 0.8, w: w - 0.5, h: 0.7, fontSize: 16 });
    dots(s, k[2], x + 0.25, y + 1.65, w - 0.5, 0.88, { size: 14 });
  });
}

// 31 Checklist
{
  const s = content("Launch Day Checklist:", N.checklist);
  const items = [
    "Every link tested on mobile", "Reminder sequence on and tested", "Payment tested with a real purchase", "Offer slide: price and deadline checked",
    "Presenter dry run on the platform", "Audio, camera, wired internet", "Chat moderator briefed with answers", "Recording switched on",
    "Backup link ready to text out", "Follow up sequence scheduled", "Replay page ready, same deadline", "Tracking sheet ready for tomorrow",
  ];
  items.forEach((t, i) => {
    const col = Math.floor(i / 6), r = i % 6;
    const x = X0 + col * 6.3, y = 1.8 + r * 0.73;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: y + 0.06, w: 0.32, h: 0.32, rectRadius: 0.04, fill: { color: WHITE, transparency: 100 }, line: { color: GOLD, width: 1.5 } });
    T(s, t, { x: x + 0.55, y, w: 5.5, h: 0.45, fontSize: 16, color: WHITE, valign: "middle", charSpacing: 0.5 });
  });
}

// 32/33 Mistakes
function mistakes(title, list, start, notes) {
  const s = content(title, notes);
  H(s, "MISTAKE", { x: X0 + 0.95, y: 1.7, w: 4, h: 0.35, fontSize: 15, color: GOLD });
  H(s, "FIX", { x: 6.95, y: 1.7, w: 4, h: 0.35, fontSize: 15, color: GOLD });
  list.forEach((m, i) => {
    const y = 2.15 + i * 0.83, h = 0.7;
    box(s, X0, y, CW, h);
    T(s, String(start + i), { x: X0 + 0.2, y, w: 0.6, h, fontFace: NUM, fontSize: 24, color: GOLD, valign: "middle" });
    T(s, m[0], { x: X0 + 0.95, y, w: 5.3, h, fontSize: 15, color: WHITE, valign: "middle", charSpacing: 0.5 });
    chevron(s, 6.55, y + h / 2 - 0.12, 0.14, 0.24);
    T(s, m[1], { x: 6.95, y, w: 5.7, h, fontSize: 15, valign: "middle", charSpacing: 0.5 });
  });
}
mistakes("Ten Mistakes That Kill Webinars, 1 To 5:", [
  ["The title is about the business", "Name the result the buyer wants, in their words"],
  ["Registration opens the day before", "Open 7 to 10 days out, push hardest in the last 48 hours"],
  ["Email only reminders", "Add texts for the morning of and 15 minutes before"],
  ["The time suits the business", "Pick when the buyer is free, then test one other slot"],
  ["Teaching everything", "Three points, the what and the why"],
], 1, N.mistakes1);
mistakes("Ten Mistakes That Kill Webinars, 6 To 10:", [
  ["The pitch comes out of nowhere", "Use the bridge: recap, show the gap, ask permission"],
  ["A vague offer", "Stack each item with an outcome and an honest value"],
  ["Fake scarcity", "A real deadline, and keep it"],
  ["No follow up", "Run the 7 day sequence and send the replay"],
  ["Numbers aren't tracked", "Five numbers in one sheet after every webinar"],
], 6, N.mistakes2);

// 34 30 day plan
{
  const s = content("Your 30 Day Plan To Land The First Client:", N.plan30);
  const wk = [
    ["DAYS 1 TO 7", ["Learn the funnel maths", "Build your own demo funnel", "Sign up to 5 webinars, take notes"]],
    ["DAYS 8 TO 14", ["Pick your niche", "List 100 businesses", "Write 3 teardowns"]],
    ["DAYS 15 TO 21", ["20 messages a day", "Follow up after 3 days", "Book calls"]],
    ["DAYS 22 TO 30", ["Run the calls", "Proposal within 24 hours", "Close one, run the kickoff"]],
  ];
  const gap = 0.3, w = (CW - 3 * gap) / 4, y = 1.75, h = 3.6;
  wk.forEach((k, i) => {
    const x = X0 + i * (w + gap);
    box(s, x, y, w, h, { gold: i === 3 });
    T(s, k[0], { x: x + 0.25, y: y + 0.22, w: w - 0.5, h: 0.5, fontFace: NUM, fontSize: 24, color: GOLD });
    dots(s, k[1], x + 0.25, y + 0.95, w - 0.5, 0.82, { size: 15 });
  });
  T(s, [{ text: "The goal is one client. ", options: { color: GOLD, bold: true } }, { text: "One client gets you a case study, and a case study gets you the next five." }],
    { x: X0, y: 5.65, w: CW, h: 0.55, fontSize: 17 });
}

// 35 Summary
{
  const s = content("Summary:", N.summary);
  const cs = [
    ["YOUR ROLE", "Own the whole system and get paid on the result."],
    ["FUNNEL", "Seven stages, three rates: registration, show, buy."],
    ["ON THE NIGHT", "Hook, story, teaching, bridge, offer, close, questions."],
    ["NUMBERS", "Fix one stage at a time. The builder doubled profit on the same spend."],
    ["PRICING", "Price against the problem: €144,000 a year makes €6,000 easy."],
    ["NEXT 30 DAYS", "Demo funnel, niche, 100 messages, one client in 30 days."],
  ];
  const w = 3.896, h = 1.75;
  cs.forEach((c, i) => card(s, X0 + (i % 3) * (w + 0.3), 1.75 + Math.floor(i / 3) * (h + 0.25), w, h, c[0], c[1], { size: 15, headColor: GOLD, headH: 0.38 }));
  T(s, "Pick your niche this week and send your first ten messages by Friday.", { x: X0, y: 5.85, w: CW, h: 0.5, fontSize: 19, color: WHITE, bold: true });
}

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT, "slides:", pres.slides.length);
})();
