"use client"
import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  useTheme, T,
  Grain, ThemeToggle, SiteNav, BackButton, ProjectNav,
  Stat, SectionHeading, ProcessStep, Card, Tag, SkipLink,
} from '../_shared'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)


// Brand tokens are constant — defined outside component to avoid recreation on every render
const CITYLOOP_BRAND = {
  primary:  '#D95F30',
  secondary:'#D7DFD8',
  dark:     '#A14421',
  bg:       '#0e0b09',
  glow:     'rgba(217,95,48,0.18)',
}

export default function CityLoopPage() {
  const container = useRef<HTMLDivElement>(null)
  const { theme, toggle } = useTheme()
  const c = T[theme]
  const tr = 'transition-colors duration-300'

  const brand = CITYLOOP_BRAND

  useGSAP(() => {
    // Compute reduced-motion inside useGSAP — safe on both client and server
    const reduced = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
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

  const screens = [
    { src: '/home-moodcast.png', label: 'Moodcast Home' },
    { src: '/dining.png',        label: 'Dining'        },
    { src: '/event.png',         label: 'Events'        },
    { src: '/movies.png',        label: 'Movies'        },
  ]

  return (
    <main
      ref={container}
      className={`min-h-screen overflow-x-hidden selection:text-black ${tr}`}
      style={{ background: c.bg, color: c.text }}
    >
      <SkipLink />
      <Grain opacity={c.grain} />
      <SiteNav c={c} projectName="CityLoop" />
      <ThemeToggle theme={theme} toggle={toggle} c={c} />

      {/* ── HERO ── */}
      <section
        id="main-content"
        className={`relative min-h-[70vh] flex flex-col justify-end px-6 md:px-16 pb-16 pt-28 border-b overflow-hidden ${tr}`}
        style={{ borderColor: c.border, background: theme === 'dark' ? brand.bg : c.bg }}
        aria-label="CityLoop — project hero"
      >
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 70% 40%, ${brand.glow} 0%, transparent 65%)` }} aria-hidden="true" />

        <div className="project-fade-in mb-8 relative z-10">
          <BackButton c={c} />
        </div>

        {/* Real CityLoop logo */}
        <div className="project-fade-in mb-6 relative z-10">
          <Image src="/cityloop_logo.png" alt="CityLoop" width={220} height={55} className="h-10 md:h-14 w-auto" />
        </div>

        <div className="overflow-hidden mb-2 relative z-10">
          <div className="project-hero-title flex flex-wrap" aria-hidden="true">
            {'CITYLOOP'.split('').map((char, i) => (
              <span key={i} className="inline-block text-[13vw] md:text-[11vw] font-black uppercase leading-[0.85] tracking-tighter" style={{ color: brand.primary }}>{char}</span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden mb-8 relative z-10">
          <div className="project-hero-title flex flex-wrap" aria-hidden="true">
            {'DISCOVERY'.split('').map((char, i) => (
              <span key={i} className="inline-block text-[13vw] md:text-[11vw] font-black uppercase leading-[0.85] tracking-tighter" style={{ color: c.text }}>{char}</span>
            ))}
          </div>
        </div>

        <p className="project-fade-in font-mono text-sm max-w-xl leading-relaxed mb-6 relative z-10" style={{ color: c.textMuted }}>
          A mobile city discovery app that helps people find places and events based on their mood, weather, and time of day — designed for Tampere, Finland.
        </p>
        <div className="project-fade-in flex flex-wrap gap-2 relative z-10">
          {['UX/UI Design', 'Figma', 'UX Research', 'Interaction Design'].map(tag => (
            <Tag key={tag} label={tag} c={c} />
          ))}
        </div>
      </section>

      {/* ── META ── */}
      <section className={`grid grid-cols-2 md:grid-cols-4 border-b ${tr}`} style={{ borderColor: c.border }}>
        {[
          { label: 'Role',     value: 'UI/UX Designer'   },
          { label: 'Timeline', value: 'Oct – Dec 2025'   },
          { label: 'Tools',    value: 'Figma, Mural'     },
          { label: 'Type',     value: 'Academic Project' },
        ].map((s, i) => (
          <div key={s.label} className={`px-6 md:px-12 ${tr} ${i < 3 ? 'border-r' : ''}`} style={{ borderColor: c.border }}>
            <Stat label={s.label} value={s.value} c={c} />
          </div>
        ))}
      </section>

      <div className="px-6 md:px-16 py-20 max-w-7xl mx-auto space-y-28">

        {/* ── PROTOTYPE SCREENS ── */}
        <div className="section-block">
          <SectionHeading num="00" title="App Screens" c={c} />
          <p className="font-mono text-sm leading-relaxed max-w-2xl mb-10" style={{ color: c.textMuted }}>
            Four core screens — Moodcast home, Dining, Events, and Movies — each surfacing contextual discovery based on weather, time of day, and mood.
          </p>

          {/* 4 phones in a row — scrollable on mobile, grid on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {screens.map(({ src, label }) => (
              <div key={src} className="flex flex-col gap-3">
                <div className="rounded-2xl overflow-hidden border" style={{ borderColor: c.border }}>
                  <Image src={src} alt={label} width={300} height={620} className="w-full h-auto" />
                </div>
                <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-center" style={{ color: c.textFaint }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── PROBLEM ── */}
        <div className="section-block">
          <SectionHeading num="01" title="The Problem" c={c} />
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="text-xl md:text-2xl font-black uppercase leading-tight tracking-tight mb-5" style={{ color: c.text }}>
                Discovering what to do in a city feels more complicated than it should.
              </p>
              <blockquote className="border-l-2 pl-4 mt-6" style={{ borderColor: brand.primary }}>
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
                Weather plays a big role in daily decisions in Finland, yet most apps ignore it completely.
              </p>
            </div>
          </div>
        </div>

        {/* ── RESEARCH ── */}
        <div className="section-block">
          <SectionHeading num="02" title="Research & Key Insights" c={c} />
          <p className="font-mono text-sm leading-relaxed max-w-2xl mb-8" style={{ color: c.textMuted }}>
            Research combined observation of existing platforms with heuristic evaluation and cognitive walkthroughs — identifying friction in discovery flows.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'People rarely open a city app with a clear goal. They browse casually and need guidance, not filters.',
              'Weather and time strongly influence decisions, but most apps treat them as secondary information.',
              'Users trust simple, calm interfaces over feature-heavy ones, especially for everyday decisions.',
              'Smaller local events and new businesses are easy to miss because they lack visibility on large platforms.',
            ].map((text, i) => (
              <Card key={i} c={c} accentBorder={brand.primary}>
                <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>{text}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* ── PROCESS ── */}
        <div className="section-block">
          <SectionHeading num="03" title="Design Process" c={c} />
          <div className="space-y-8">
            {[
              { step: '01 — Defining the Structure',      body: 'We defined the main activities users would perform: discovering nearby events, browsing by mood, checking weather suitability, and viewing details. The Moodcast screen became the primary hub.' },
              { step: '02 — Wireframes to Visual Design', body: 'Early wireframes focused on content hierarchy. As the structure stabilised, we moved to high-fidelity screens — maintaining strong contrast, readable typography, and clear spacing.' },
              { step: '03 — Interaction Design',          body: 'Focused on making the experience feel calm and predictable. Weather and mood cues are subtle and supportive rather than dominant.' },
              { step: '04 — Evaluation and Iteration',    body: 'Reviewed using heuristic evaluation and cognitive walkthroughs. This helped simplify flows, clarify labels, and remove unnecessary steps.' },
            ].map(p => (
              <ProcessStep key={p.step} step={p.step} body={p.body} c={c} accentBorder={brand.primary} />
            ))}
          </div>
        </div>

        {/* ── DESIGN SYSTEM ── */}
        <div className="section-block">
          <SectionHeading num="04" title="Design System" c={c} />
          <div className="grid md:grid-cols-3 gap-5">
            <Card c={c}>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] mb-4" style={{ color: brand.primary }}>Color Palette</p>
              <div className="flex gap-2 mb-4">
                {['#D95F30','#D7DFD8','#101110','#A14421','#686C68'].map(col => (
                  <div key={col} className="w-8 h-8 rounded border" style={{ background: col, borderColor: c.border }} title={col} />
                ))}
              </div>
              <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>
                Warm orange primary (#D95F30). Sage secondary (#D7DFD8). Near-black base (#101110).
              </p>
            </Card>
            <Card c={c}>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] mb-4" style={{ color: brand.primary }}>Typography</p>
              <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>
                Clear hierarchy for quick scanning. Headings guide attention to featured content; body text remains neutral and legible.
              </p>
            </Card>
            <Card c={c}>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] mb-4" style={{ color: brand.primary }}>Spacing</p>
              <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>
                8-point system throughout. Consistent rhythm across cards, sections, and safe areas — reducing clutter while keeping content navigable.
              </p>
            </Card>
          </div>
        </div>

        {/* ── REFLECTION ── */}
        <div className="section-block border-t pt-14" style={{ borderColor: c.border }}>
          <SectionHeading num="05" title="Reflection" c={c} />
          <div className="max-w-2xl space-y-4">
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
              This project helped strengthen my ability to design with context rather than focusing only on individual screens. Working on CityLoop pushed me to think about how mood, weather, and time influence everyday decisions, especially in a Nordic environment.
            </p>
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
              I learned the importance of restraint in design — it was often more valuable to remove features or simplify interactions than to add more. CityLoop reinforced my interest in designing calm, human-centered interfaces that support real-life decisions without overwhelming users.
            </p>
          </div>
        </div>

        <ProjectNav next={{ label: 'MyTown', href: '/projects/mytown' }} c={c} />
      </div>
    </main>
  )
}
