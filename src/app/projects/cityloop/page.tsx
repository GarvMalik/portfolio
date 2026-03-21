"use client"
import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  useTheme, T,
  Grain, ThemeToggle, SiteNav, BackButton, ProjectNav,
  Stat, SectionHeading, ProcessStep, Card, Tag, SkipLink,
} from '../_shared'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const reduced = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function CityLoopPage() {
  const container = useRef<HTMLDivElement>(null)
  const { theme, toggle } = useTheme()
  const c = T[theme]
  const tr = 'transition-colors duration-300'

  useGSAP(() => {
    if (reduced) {
      gsap.set(['.project-hero-title span', '.project-fade-in', '.section-block'], { clearProps: 'all' })
      return
    }
    gsap.fromTo('.project-hero-title span',
      { yPercent: 110 },
      { yPercent: 0, duration: 1.2, stagger: 0.04, ease: 'power4.out', delay: 0.1 }
    )
    gsap.fromTo('.project-fade-in',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', delay: 0.5 }
    )
    gsap.utils.toArray<HTMLElement>('.section-block').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 82%' } }
      )
    })
  }, { scope: container })

  return (
    <main
      ref={container}
      className={`min-h-screen overflow-x-hidden selection:bg-[#ff4d00] selection:text-black ${tr}`}
      style={{ background: c.bg, color: c.text }}
    >
      <SkipLink />
      <Grain opacity={c.grain} />
      <SiteNav c={c} />
      <ThemeToggle theme={theme} toggle={toggle} c={c} />

      {/* ── HERO ── */}
      <section
        id="main-content"
        className={`relative min-h-[70vh] flex flex-col justify-end px-6 md:px-16 pb-16 pt-28 border-b ${tr}`}
        style={{ borderColor: c.border }}
        aria-label="CityLoop — project hero"
      >
        <div className="project-fade-in mb-8">
          <BackButton c={c} />
        </div>

        {/* Large title */}
        <div className="overflow-hidden mb-2" aria-label="CityLoop">
          <div className="project-hero-title flex flex-wrap" aria-hidden="true">
            {'CITYLOOP'.split('').map((char, i) => (
              <span key={i} className="inline-block text-[13vw] md:text-[14vw] font-black uppercase leading-[0.85] tracking-tighter" style={{ color: c.accentGreen }}>
                {char}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden mb-8" aria-label="Discovery">
          <div className="project-hero-title flex flex-wrap" aria-hidden="true">
            {'DISCOVERY'.split('').map((char, i) => (
              <span key={i} className="inline-block text-[13vw] md:text-[14vw] font-black uppercase leading-[0.85] tracking-tighter" style={{ color: c.text }}>
                {char}
              </span>
            ))}
          </div>
        </div>

        <p className="project-fade-in font-mono text-sm max-w-xl leading-relaxed mb-6" style={{ color: c.textMuted }}>
          A mobile city discovery app that helps people find places and events based on their mood, weather, and time of day.
        </p>
        <div className="project-fade-in flex flex-wrap gap-2" role="list" aria-label="Project tags">
          {['UX/UI Design', 'Figma', 'UX Research', 'Interaction Design'].map(tag => (
            <Tag key={tag} label={tag} c={c} />
          ))}
        </div>
      </section>

      {/* ── META ── */}
      <section
        className={`grid grid-cols-2 md:grid-cols-4 border-b ${tr}`}
        style={{ borderColor: c.border }}
        aria-label="Project metadata"
      >
        {[
          { label: 'Role',     value: 'UI/UX Designer' },
          { label: 'Timeline', value: 'Oct 2025 – Dec 2025' },
          { label: 'Tools',    value: 'Figma, Mural' },
          { label: 'Links',    value: 'Behance ↗' },
        ].map((s, i) => (
          <div
            key={s.label}
            className={`px-6 md:px-12 ${tr} ${i < 3 ? 'border-r' : ''}`}
            style={{ borderColor: c.border }}
          >
            <Stat label={s.label} value={s.value} c={c} />
          </div>
        ))}
      </section>

      {/* ── BODY ── */}
      <div className="px-6 md:px-16 py-20 max-w-7xl mx-auto space-y-28">

        {/* 01 Problem */}
        <div className="section-block" aria-labelledby="s-problem">
          <SectionHeading num="01" title="The Problem" c={c} />
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="text-xl md:text-2xl font-black uppercase leading-tight tracking-tight mb-5" style={{ color: c.text }}>
                Discovering what to do in a city feels more complicated than it should.
              </p>
              <blockquote className="border-l-2 border-[#ff4d00] pl-4 mt-6">
                <p className="font-mono text-sm italic" style={{ color: c.textMuted }}>
                  "Users spend more time deciding than actually experiencing the city."
                </p>
              </blockquote>
            </div>
            <div className="space-y-4">
              <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
                People switch between multiple apps to check events, restaurants, weather, and directions. Information is scattered, often outdated, and rarely considers the user's context — mood, time of day, or weather.
              </p>
              <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
                For newcomers and tourists, it's hard to know where to start. For locals, discovery turns into routine — the same places repeated while smaller events and local creators remain unnoticed. Weather plays a big role in daily decisions in Finland, yet most apps ignore it completely.
              </p>
            </div>
          </div>
        </div>

        {/* 02 Research */}
        <div className="section-block" aria-labelledby="s-research">
          <SectionHeading num="02" title="Research & Key Insights" c={c} />
          <p className="font-mono text-sm leading-relaxed max-w-2xl mb-8" style={{ color: c.textMuted }}>
            Research combined observation of existing platforms with heuristic evaluation and cognitive walkthroughs — identifying friction in discovery flows and understanding why users feel overwhelmed when planning their day.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'People rarely open a city app with a clear goal. They are browsing casually and need guidance, not filters.',
              'Weather and time strongly influence decisions, but most apps treat them as secondary information.',
              'Users trust simple, calm interfaces over feature-heavy ones, especially for everyday decisions.',
              'Smaller local events and new businesses are easy to miss because they lack visibility on large platforms.',
            ].map((text, i) => (
              <Card key={i} c={c} accentBorder={c.accentGreen}>
                <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>{text}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* 03 Design Goals */}
        <div className="section-block" aria-labelledby="s-goals">
          <SectionHeading num="03" title="Design Goals" c={c} />
          <div className="grid md:grid-cols-3 gap-5 mb-6">
            {[
              { title: 'Reduce decision fatigue',    desc: 'Help users quickly understand what fits their day without overwhelming them with choices.' },
              { title: 'Context-aware discovery',    desc: 'Use weather, time, and mood to surface relevant suggestions without complex filtering.' },
              { title: 'Support local visibility',   desc: 'Give fair visibility to local events, new businesses, and emerging creators.' },
            ].map(g => (
              <Card key={g.title} c={c} accentBorder={c.accentGreen}>
                <div className="w-5 h-[1px] mb-4" style={{ background: c.accentGreen }} aria-hidden="true" />
                <h3 className="text-sm font-black uppercase tracking-tight mb-2" style={{ color: c.text }}>{g.title}</h3>
                <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>{g.desc}</p>
              </Card>
            ))}
          </div>
          <Card c={c}>
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
              <span style={{ color: c.accentGreen }}>Dark-first visual direction: </span>
              As a conscious design choice, a darker interface was used to create a distinct look and mood — the dark background reduces visual noise and helps event imagery stand out, especially in evening or low-light use.
            </p>
          </Card>
        </div>

        {/* 04 Design Process */}
        <div className="section-block" aria-labelledby="s-process">
          <SectionHeading num="04" title="Design Process" c={c} />
          <div className="space-y-8">
            {[
              { step: '01 — Defining the Structure',      body: 'We started by defining the main activities users would perform: discovering nearby events, browsing by mood, checking weather suitability, and viewing details. The Moodcast screen became the primary hub — bringing together weather-based suggestions, mood-driven discovery, and highlights of what is happening today.' },
              { step: '02 — Wireframes to Visual Design', body: 'Early wireframes focused on content hierarchy rather than visual detail. We explored different ways to group information without overwhelming the user on the home screen. As the structure stabilized, we moved to high-fidelity screens in Figma — maintaining strong contrast, readable typography, and clear spacing.' },
              { step: '03 — Interaction Design',          body: 'Interaction design focused on making the experience feel calm and predictable. Buttons, chips, and cards provide immediate visual feedback. Weather and mood cues are subtle and supportive rather than dominant. Particular attention was paid to screen transitions.' },
              { step: '04 — Evaluation and Iteration',    body: 'The design was reviewed using heuristic evaluation and cognitive walkthroughs to identify friction points early. This helped simplify flows, clarify labels, and remove unnecessary steps. Guerrilla testing and usability testing were considered for future validation.' },
            ].map(p => (
              <ProcessStep key={p.step} step={p.step} body={p.body} c={c} accentBorder={c.accentGreen} />
            ))}
          </div>
        </div>

        {/* 05 Design System */}
        <div className="section-block" aria-labelledby="s-system">
          <SectionHeading num="05" title="Design System" c={c} />
          <div className="grid md:grid-cols-3 gap-5">
            <Card c={c}>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] text-[#ff4d00] mb-4">Color System</p>
              <div className="flex gap-2 mb-4" role="img" aria-label="CityLoop palette: light grey, burnt orange, near-black">
                <div className="w-10 h-10 rounded border" style={{ background: '#D7DFD8', borderColor: c.border }} title="#D7DFD8" />
                <div className="w-10 h-10 rounded border" style={{ background: '#D95F30', borderColor: c.border }} title="#D95F30" />
                <div className="w-10 h-10 rounded border" style={{ background: '#101110', borderColor: c.border }} title="#101110" />
              </div>
              <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>
                Dark-first. Warm orange accent (#D95F30). Soft grey text (#D7DFD8). Near-black base (#101110).
              </p>
            </Card>
            <Card c={c}>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] text-[#ff4d00] mb-4">Typography</p>
              <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>
                Clear typographic hierarchy for quick scanning and calm reading. Headings guide attention to featured content; body text remains neutral and legible for descriptions and metadata.
              </p>
            </Card>
            <Card c={c}>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] text-[#ff4d00] mb-4">Spacing System</p>
              <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>
                8-point–based spacing for consistent rhythm and alignment. Defined rules for cards, sections, and safe areas — reducing clutter and keeping dense content navigable.
              </p>
            </Card>
          </div>
        </div>

        {/* 06 Final Solution */}
        <div className="section-block" aria-labelledby="s-outcome">
          <SectionHeading num="06" title="Final Solution" c={c} />
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="text-xl md:text-2xl font-black uppercase leading-tight tracking-tight mb-5" style={{ color: c.accentGreen }}>
                One calm interface for the whole city.
              </p>
              <p className="font-mono text-sm leading-relaxed mb-4" style={{ color: c.textMuted }}>
                The Moodcast home screen acts as the central hub — surfaces context-aware recommendations based on current weather and time, highlights what is popular today, and promotes new or emerging local places.
              </p>
              <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
                Detail pages provide just enough information to support decision-making. Throughout the app, the visual style remains calm and focused, supporting everyday use without distraction.
              </p>
            </div>
            <div className="space-y-3" role="list" aria-label="Key screens">
              {[
                { screen: 'Moodcast Home', desc: 'Weather-based picks, top 5 today, emerging locals' },
                { screen: 'Dining',        desc: 'Mood-filtered restaurant discovery with details & booking' },
                { screen: 'Events',        desc: 'Featured and all events with explore categories' },
                { screen: 'Movies',        desc: 'Spotlight section with seat selection and payment flow' },
              ].map(s => (
                <div
                  key={s.screen}
                  role="listitem"
                  className="flex items-start gap-4 border p-4 transition-colors duration-200"
                  style={{ borderColor: c.border, background: c.cardBg }}
                >
                  <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: c.accentGreen }} aria-hidden="true" />
                  <div>
                    <p className="text-[9px] uppercase font-mono tracking-widest mb-1" style={{ color: c.accentGreen }}>{s.screen}</p>
                    <p className="text-xs font-mono" style={{ color: c.textMuted }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 07 Reflection */}
        <div className="section-block border-t pt-14" style={{ borderColor: c.border }} aria-labelledby="s-reflection">
          <SectionHeading num="07" title="Reflection" c={c} />
          <div className="max-w-2xl space-y-4">
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
              This project helped strengthen my ability to design with context rather than focusing only on individual screens. Working on CityLoop pushed me to think about how mood, weather, and time influence everyday decisions, especially in a Nordic environment.
            </p>
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
              I learned the importance of restraint in design — it was often more valuable to remove features or simplify interactions than to add more. CityLoop reinforced my interest in designing calm, human-centered interfaces that support real-life decisions without overwhelming users.
            </p>
          </div>
        </div>

        {/* Project nav */}
        <ProjectNav next={{ label: 'MyTown', href: '/projects/mytown' }} c={c} />
      </div>
    </main>
  )
}
