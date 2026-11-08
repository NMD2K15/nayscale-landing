import html, re, sys

src = open("deck_text.md", encoding="utf-8").read()
blocks = re.split(r"<!-- Slide number: (\d+) -->\n", src)[1:]
slides = []
for i in range(0, len(blocks), 2):
    n = int(blocks[i]); body = blocks[i + 1]
    top, notes = body.split("### Notes:", 1)
    lines = [l for l in top.strip().splitlines() if l.strip()]
    if n == 1:
        title = "Title: " + " ".join(lines[:2]).title()
    elif lines[0].startswith("PART"):
        title = lines[0].title() + ": " + lines[1].title()
    else:
        title = lines[0] + "  " + lines[1].rstrip(":")
    slides.append((n, title, notes.strip()))

SOURCES = [
    ("Registration to attendee rate 56% (2023), 57% (2024), 60% (2025), live plus on demand; average engagement roughly 49 to 55 minutes; on demand around 43% of views in 2025; typical webinar about an hour",
     "ON24, Webinar Benchmarks Report key takeaways", "https://www.on24.com/blog/key-takeaways-from-the-webinar-benchmarks-report/"),
    ("Live show up rate 47.7% across 33,786 sessions in 2025; 15.3% register on the event day",
     "Livestorm 2026 Webinar Benchmark Report (as quoted by AEvent and Stealth Agents; primary report not opened)", "https://stealthagents.com/research/webinar-registration-attendance-statistics-2026"),
    ("33% headline attendance rate, calendar 2024, 19,531 B2B webinars",
     "Goldcast B2B Webinar Benchmark Report", "https://www.goldcast.io/reports/b2b-webinar-benchmark-report"),
    ("Live attendance 49%; about 4 in 10 attendees watch the replay",
     "Univid Webinar Insights 2026", "https://www.univid.io/webinar-statistics"),
    ("Webinar landing pages average about 22.84% (vs 7.12% for all landing pages)",
     "GetResponse study, as quoted by LanderLab and LearnyBox (primary study not opened)", "https://landerlab.io/blog/landing-page-conversion-rate"),
    ("Registration 35 to 59% depending on traffic warmth, 40% plus target on warm traffic; buyer conversion 5 to 20% for teaching led webinars with clear return",
     "ClickMeeting, Webinars That Convert", "https://blog.clickmeeting.com/webinars-that-convert"),
    ("Sales webinars 10 to 20% attendee to action",
     "EasyWebinar, Webinar Analytics 2026", "https://easywebinar.com/blog/webinar-analytics/"),
    ("Attendee to customer around 1.2% for B2B SaaS and marketing agencies, 2.1% oil and gas",
     "Focus Digital, Webinar Conversion Rates by Industry (Dec 2023)", "https://focus-digital.co/webinar-conversion-rates-by-industry/"),
    ("Meta cost per webinar registration roughly $8 to $12 (B2B SaaS, vendor estimate)",
     "GrowthSpree, Meta Ads Webinar Promotion for B2B SaaS 2026", "https://www.growthspreeofficial.com/blogs/meta-ads-webinar-promotion-b2b-saas-2026.md"),
    ("Average Facebook cost per lead $27.66 in 2025, up 21% year on year",
     "WordStream Facebook Ads Benchmarks", "https://www.wordstream.com/blog/facebook-ads-benchmarks"),
    ("33% of registrations on the day of the event; 68% in the final week (350,890 webinars)",
     "GoTo Webinar, 2017 Big Book of Webinar Stats", "https://www.gotomeeting.com/webinar/gtw-2017-book-of-webinar-stats"),
    ("22% register on the day, 37% in the week before",
     "ON24 Webinar Benchmarks Report 2017", "https://resources.martechseries.com/whitepapers/ON24_Webinar-Benchmarks-Report-2017.pdf"),
    ("42% of all webinar views come from on demand replays",
     "Contrast, Webinar Benchmarks", "https://blog.getcontrast.io/webinar-benchmarks/"),
    ("Freelance funnel builders roughly $20 to $225 an hour, mid level around $60",
     "goLance Freelance Rate Guide 2026 (a competing marketplace, so treat as indicative)", "https://golance.com/hiring/best-freelance-funnel-builders-hourly-rate"),
    ("Retainer example: $100 an hour at 40 hours a week gives a $4,000 monthly retainer",
     "ClickUp, How Retainers Work for Consultants", "https://clickup.com/blog/consulting-retainer/"),
    ("Conversion consultant examples at $150 an hour and a $7,500 monthly retainer; hybrid fee plus performance models",
     "Clicksgeek, Conversion Optimisation Consultant Rates", "https://clicksgeek.com/conversion-optimization-consultant-rates/"),
]

ILLUSTRATIVE = [
    "The extension builder and every number attached to it: €30,000 average job, 20% gross profit (€6,000 a job), 20 missed calls a month, 1 in 10 enquiries becoming a job, €144,000 a year lost profit.",
    "Worked example funnel: €2,500 ad spend, €10 per registrant, 250 registrants, 20% then 40% show rate, 10% buy rate, 40% visit to job rate, €60,000 to €120,000 revenue, €12,000 to €24,000 gross profit.",
    "Offer stack values (€400, €600, €250, €300, total €1,550) and the €295 design visit.",
    "Fees: €6,000 project, €2,000 a month retainer, €3,000 plus 10% of gross profit (€2,400 a month at 4 jobs), and the 5 visit guarantee.",
    "Names in example messages (Declan, Ciara, Sarah) and the 300 plus extensions credential.",
]

css = """
@page { size: A4; margin: 18mm 18mm 20mm 18mm; }
body { font-family: Inter, Arial, sans-serif; color: #1c1e22; font-size: 10.5pt; line-height: 1.55; }
h1 { font-family: Montserrat, Arial, sans-serif; font-size: 22pt; letter-spacing: 1px; margin: 0 0 4px; color: #06090f; }
h1 span { color: #B49143; }
.sub { color: #6b6d70; margin: 0 0 18px; font-size: 10pt; }
.slide { break-inside: auto; border-top: 1px solid #e3dccb; padding-top: 10px; margin-top: 14px; }
.slide h2 { font-family: Oswald, Arial, sans-serif; font-weight: 500; font-size: 13pt; letter-spacing: 0.5px; color: #8a6d2c; margin: 0 0 6px; }
.slide p { margin: 0 0 7px; }
.sources { break-before: page; }
.sources h2 { font-family: Oswald, Arial, sans-serif; font-weight: 500; color: #8a6d2c; font-size: 16pt; margin: 0 0 8px; }
table { width: 100%; border-collapse: collapse; font-size: 7.6pt; line-height: 1.3; table-layout: fixed; }
col.a { width: 44%; } col.b { width: 27%; } col.c { width: 29%; }
th { text-align: left; font-family: Oswald, Arial, sans-serif; font-weight: 500; color: #8a6d2c; border-bottom: 1.5px solid #B49143; padding: 4px 6px; }
td { border-bottom: 1px solid #eee6d6; padding: 2.5px 5px; vertical-align: top; }
td a { color: #1c1e22; word-break: break-all; }
.ill { font-size: 7.8pt; margin-top: 8px; line-height: 1.35; }
.ill li { margin-bottom: 2px; }
.note { font-size: 7.8pt; color: #555; margin-top: 8px; }
"""
out = [f"<!doctype html><html><head><meta charset='utf-8'><title>Speaker Notes</title><style>{css}</style></head><body>"]
out.append("<h1>THE WEBINAR <span>GROWTH</span> SPECIALIST</h1>")
out.append("<p class='sub'>Datasets VIP · Speaker notes for all 40 slides, with sources on the last page</p>")
for n, title, notes in slides:
    paras = "".join(f"<p>{html.escape(p.strip())}</p>" for p in notes.split("\n\n") if p.strip())
    out.append(f"<div class='slide'><h2>Slide {n} · {html.escape(title)}</h2>{paras}</div>")
out.append("<div class='sources'><h2>Sources</h2><table><colgroup><col class='a'><col class='b'><col class='c'></colgroup><tr><th>Figure used</th><th>Source</th><th>Link</th></tr>")
for fig, name, url in SOURCES:
    out.append(f"<tr><td>{html.escape(fig)}</td><td>{html.escape(name)}</td><td><a href='{url}'>{html.escape(url)}</a></td></tr>")
out.append("</table><div class='ill'><b>Illustrative, made up to show the maths:</b><ul>")
out += [f"<li>{html.escape(x)}</li>" for x in ILLUSTRATIVE]
out.append("</ul></div><p class='note'>These figures came from web research on 8 November 2026. Several are vendor benchmarks or secondary summaries, and definitions differ (live only versus live plus replay, B2B versus consumer). No published rate card for webinar strategists specifically was found.</p></div>")
out.append("</body></html>")
open("speaker_notes.html", "w", encoding="utf-8").write("".join(out))
print(len(slides), "slides")
