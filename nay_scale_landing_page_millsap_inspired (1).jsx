export default function NayScaleLanding() {
  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 antialiased">
      {/* Top announcement bar */}
      <div className="w-full bg-neutral-900 border-b border-neutral-800 text-center text-sm py-2 px-4">
        <span className="opacity-80">Serious coaches only. Limited slots each week.</span>
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-50 backdrop-blur bg-neutral-950/60 border-b border-neutral-900">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-500" />
            <span className="font-semibold tracking-tight">NayScale</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm opacity-90">
            <a href="#why" className="hover:opacity-100">Why You’re Stuck</a>
            <a href="#system" className="hover:opacity-100">The System</a>
            <a href="#proof" className="hover:opacity-100">Proof by Logic</a>
            <a href="#answers" className="hover:opacity-100">Answers</a>
          </nav>
          <a href="https://cal.com/nathan-dunne/call-with-nayscale" target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-xl bg-white text-neutral-900 px-4 py-2 text-sm font-semibold hover:opacity-90 transition">Book Your Call</a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_-10%,rgba(120,120,120,0.25),transparent)]" />
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs mb-5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Predictable client acquisition for online coaches</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              You don’t need more content.
              <span className="block opacity-90">You need a <span className="underline decoration-neutral-500">system</span>.</span>
            </h1>
            <p className="mt-5 text-lg md:text-xl opacity-80 max-w-2xl">
              If you don’t have a repeatable way to attract and sign clients, you don’t have a business—you have a hobby. NayScale installs the operating system that turns attention into consistent revenue.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="https://cal.com/nathan-dunne/call-with-nayscale" target="_blank" rel="noopener" className="rounded-2xl bg-white text-neutral-900 px-6 py-3 font-semibold text-base hover:opacity-90">Book Your Call</a>
            </div>
            <p className="mt-4 text-xs opacity-60">No fluff. No courses. Strategy + implementation if you’re accepted.</p>
          </div>
        </div>
      </section>

      {/* Social proof style strip (placeholders) */}
      <section className="border-y border-neutral-900 bg-neutral-950">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-6 gap-6 opacity-60">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 bg-neutral-800/40 rounded" />
          ))}
        </div>
      </section>

      {/* Why you’re stuck vs What works */}
      <section id="why" className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-3xl border border-neutral-900 bg-neutral-950 p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold">⚠️ Why most coaches stay stuck</h2>
            <ul className="mt-6 space-y-3 text-base opacity-90">
              <li>
                <span className="inline-block w-5">•</span> Random content ≠ clients. Likes don’t pay invoices.
              </li>
              <li>
                <span className="inline-block w-5">•</span> Relying on referrals = gambling with your income.
              </li>
              <li>
                <span className="inline-block w-5">•</span> Copying offers that don’t match your strengths.
              </li>
              <li>
                <span className="inline-block w-5">•</span> No roadmap. No accountability. Burnout.
              </li>
            </ul>
          </div>
          <div className="rounded-3xl border border-neutral-900 bg-neutral-950 p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold">✅ What actually scales</h2>
            <ul className="mt-6 space-y-3 text-base opacity-90">
              <li><span className="inline-block w-5">•</span> Avatar clarity → content that attracts buyers.</li>
              <li><span className="inline-block w-5">•</span> Daily, strategic outputs (2–5 videos + 4 stories) with purpose.</li>
              <li><span className="inline-block w-5">•</span> A DM flow that moves stranger → client.</li>
              <li><span className="inline-block w-5">•</span> Scaling levers: community, offers, and ops.</li>
            </ul>
            <a href="#system" className="mt-6 inline-block text-sm font-semibold underline underline-offset-4 opacity-90 hover:opacity-100">See the System</a>
          </div>
        </div>
      </section>

      {/* The System (sell the need) */}
      <section id="system" className="border-y border-neutral-900 bg-neutral-950/60">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">The four parts of a predictable client engine</h2>
          <p className="mt-3 opacity-80 max-w-3xl">You don’t rise to the level of your motivation; you fall to the level of your systems. Install these four and your income becomes math, not hope.</p>
          <div className="mt-10 grid md:grid-cols-4 gap-6">
            {[
              { t: 'Clarity', d: 'Precisely define who you help, the pain you solve, and the premium outcome.' },
              { t: 'Content', d: 'Strategic daily outputs that build demand and authority (no guessing).'},
              { t: 'Conversion', d: 'A simple DM + call flow that turns attention into paid clients.'},
              { t: 'Scaling', d: 'Stack levers: community, pricing, delivery, ops. Grow without chaos.'},
            ].map((item, idx) => (
              <div key={idx} className="rounded-3xl border border-neutral-900 bg-neutral-950 p-6">
                <div className="text-sm opacity-60">Pillar {idx+1}</div>
                <div className="mt-2 text-xl font-semibold">{item.t}</div>
                <p className="mt-3 text-sm opacity-80">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof by logic / inevitability math */}
      <section id="proof" className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold">It’s math, not magic</h3>
            <p className="mt-4 opacity-80">Post 2–5 strategic videos daily = 60–150 shots/month. 1% warm replies = 20―50 leads. Convert 15–25% on calls = clients every week. The right system makes this inevitable.</p>
            <ul className="mt-6 space-y-2 text-sm opacity-90">
              <li>• Inputs you control → outputs you can predict</li>
              <li>• No viral luck required</li>
              <li>• Works with small audiences if you’re consistent</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-neutral-900 bg-neutral-950 p-6">
            <div className="text-sm opacity-60">Example month</div>
            <div className="mt-3 grid grid-cols-2 gap-4 text-center">
              {[
                ['Strategic posts', '90'],
                ['Warm replies (1%)', '30'],
                ['Booked calls (40%)', '12'],
                ['New clients (25%)', '3'],
              ].map(([k,v], i) => (
                <div key={i} className="rounded-2xl border border-neutral-800 p-4">
                  <div className="text-3xl font-extrabold">{v}</div>
                  <div className="mt-1 text-xs opacity-70">{k}</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs opacity-60">Illustrative only. Your numbers scale with inputs and offer.</p>
          </div>
        </div>
      </section>

      {/* Story / Credibility */}
      <section className="border-y border-neutral-900 bg-neutral-950/60">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="rounded-3xl border border-neutral-900 bg-neutral-950 p-6 md:p-10">
            <div className="text-sm opacity-60 mb-2">From Jobstown → systems that scale</div>
            <h3 className="text-2xl md:text-3xl font-bold">Hustle started me. Systems set me free.</h3>
            <p className="mt-4 opacity-80 max-w-3xl">I grew up in a council apartment in Jobstown, Dublin. I watched my mam hustle her ass off to build a better life. That’s what drove me into business—and it’s why I help coaches build predictable systems. Not more chaos. Not more burnout. A real business.</p>
          </div>
        </div>
      </section>

      {/* Answers / FAQ */}
      <section id="answers" className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <h3 className="text-3xl font-extrabold tracking-tight">Answers to the questions you’re thinking</h3>
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {[
            ['Do I need a big following?', 'No. This is consistency + system. Small audiences convert when the offer and DM flow are correct.'],
            ['Is this a course?', 'No. It’s strategy + implementation if you’re accepted. Real work, real outcomes.'],
            ['What if I’ve tried before?', 'You tried tactics without a system. This fixes the root, not the symptoms.'],
            ['What if I’m new?', 'Great. Clean slate. We build foundations fast and focus on revenue activities first.'],
          ].map(([q,a], idx) => (
            <details key={idx} className="group rounded-2xl border border-neutral-900 bg-neutral-950 p-5">
              <summary className="marker:content-[''] cursor-pointer list-none flex items-center justify-between">
                <span className="font-semibold">{q}</span>
                <span className="transition group-open:rotate-45 text-xl">+</span>
              </summary>
              <p className="mt-3 text-sm opacity-80">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_-10%,rgba(255,255,255,0.08),transparent)]" />
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="rounded-3xl border border-neutral-900 bg-neutral-950 p-8 md:p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-extrabold">If you’re serious, book your call</h3>
            <p className="mt-3 opacity-80 max-w-2xl mx-auto">We’ll map your revenue bottlenecks and outline the system to fix them. If it’s a fit, we’ll implement together. If not, you’ll leave with clarity.</p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <a href="https://cal.com/nathan-dunne/call-with-nayscale" target="_blank" rel="noopener" className="rounded-2xl bg-white text-neutral-900 px-6 py-3 font-semibold hover:opacity-90">Book Your Call</a>
              <a href="#answers" className="rounded-2xl border border-neutral-800 px-6 py-3 font-semibold hover:bg-neutral-900">Still have questions?</a>
            </div>
            <p className="mt-4 text-xs opacity-60">Limited weekly slots. No time-wasters.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm opacity-70">© {new Date().getFullYear()} NayScale. All rights reserved.</div>
          <div className="text-sm opacity-60 flex items-center gap-6">
            <a href="#" className="hover:opacity-100">Privacy</a>
            <a href="#" className="hover:opacity-100">Terms</a>
            <a href="#" className="hover:opacity-100">Contact</a>
          </div>
        </div>
      </footer>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-4 inset-x-0 px-4">
        <div className="mx-auto max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-950/90 backdrop-blur flex flex-col md:flex-row items-center justify-between gap-3 px-4 py-3">
          <p className="text-sm opacity-80">Serious about scaling? Map your system on a free call.</p>
          <a href="https://cal.com/nathan-dunne/call-with-nayscale" target="_blank" rel="noopener" className="rounded-xl bg-white text-neutral-900 px-4 py-2 text-sm font-semibold hover:opacity-90">Book Your Call</a>
        </div>
      </div>
    </div>
  );
}
