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

const reduced = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function PlayPalPage() {
  const container = useRef<HTMLDivElement>(null)
  const { theme, toggle } = useTheme()
  const c = T[theme]
  const tr = 'transition-colors duration-300'

  const brand = {
    primary:  '#2978FF',
    secondary:'#FFC107',
    dark:     '#0151D9',
    bg:       '#080c14',
    glow:     'rgba(41,120,255,0.20)',
  }

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
      className={`min-h-screen overflow-x-hidden selection:text-black ${tr}`}
      style={{ background: c.bg, color: c.text }}
    >
      <SkipLink />
      <Grain opacity={c.grain} />
      <SiteNav c={c} projectName="PlayPal" />
      <ThemeToggle theme={theme} toggle={toggle} c={c} />

      {/* ── HERO ── */}
      <section
        id="main-content"
        className={`relative min-h-[70vh] flex flex-col justify-end px-6 md:px-16 pb-16 pt-28 border-b overflow-hidden ${tr}`}
        style={{ borderColor: c.border, background: theme === 'dark' ? brand.bg : c.bg }}
        aria-label="PlayPal — project hero"
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 30% 60%, ${brand.glow} 0%, transparent 65%)` }} aria-hidden="true" />

        <div className="project-fade-in mb-8 relative z-10">
          <BackButton c={c} />
        </div>

        {/* Real PlayPal logo */}
        <div className="project-fade-in mb-6 relative z-10">
          <Image
            src="/playpal-logo.png"
            alt="PlayPal"
            width={120}
            height={120}
            className="h-20 w-auto"
            style={{ filter: theme === 'dark' ? 'brightness(1)' : 'none' }}
          />
        </div>

        <div className="overflow-hidden mb-2 relative z-10">
          <div className="project-hero-title flex flex-wrap" aria-hidden="true">
            {'PLAYPAL'.split('').map((char, i) => (
              <span key={i} className="inline-block text-[14vw] md:text-[11vw] font-black uppercase leading-[0.85] tracking-tighter" style={{ color: brand.primary }}>{char}</span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden mb-8 relative z-10">
          <div className="project-hero-title flex flex-wrap" aria-hidden="true">
            {'COMMUNITY'.split('').map((char, i) => (
              <span key={i} className="inline-block text-[7vw] md:text-[5.5vw] font-black uppercase leading-[0.9] tracking-tighter" style={{ color: brand.secondary }}>{char}</span>
            ))}
          </div>
        </div>

        <p className="project-fade-in font-mono text-sm max-w-xl leading-relaxed mb-6 relative z-10" style={{ color: c.textMuted }}>
          A service and mobile app concept designed to help people find sports partners, organize games, and book nearby venues — with less social and logistical effort.
        </p>
        <div className="project-fade-in flex flex-wrap gap-2 relative z-10">
          {['Design System', 'Interaction Design', 'Figma', 'Service Design', 'UX Research'].map(tag => (
            <Tag key={tag} label={tag} c={c} />
          ))}
        </div>
      </section>

      {/* ── META ── */}
      <section className={`grid grid-cols-2 md:grid-cols-4 border-b ${tr}`} style={{ borderColor: c.border }}>
        {[
          { label: 'Role',     value: 'UI/UX Designer'   },
          { label: 'Timeline', value: 'Oct – Dec 2025'   },
          { label: 'Tools',    value: 'Figma'            },
          { label: 'Type',     value: 'Academic Project' },
        ].map((s, i) => (
          <div key={s.label} className={`px-6 md:px-12 ${tr} ${i < 3 ? 'border-r' : ''}`} style={{ borderColor: c.border }}>
            <Stat label={s.label} value={s.value} c={c} />
          </div>
        ))}
      </section>

      <div className="px-6 md:px-16 py-20 max-w-7xl mx-auto space-y-28">

        {/* ── APP SCREENS ── */}
        <div className="section-block">
          <SectionHeading num="00" title="App Screens" c={c} />
          <p className="font-mono text-sm leading-relaxed max-w-2xl mb-10" style={{ color: c.textMuted }}>
            Two core flows — the Home screen with upcoming events, find players, and find venue; and the Create Game flow with sport selection, skill level, venue booking, and player management.
          </p>
          <div className="flex flex-col gap-8">
            {/* Home screens — full width */}
            <div>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] mb-4" style={{ color: brand.primary }}>
                Home · Play · Book — Three Tab Views
              </p>
              <div className="rounded-2xl overflow-hidden border" style={{ borderColor: c.border }}>
                <Image
                  src="/home-screen.png"
                  alt="PlayPal Home, Play and Book screens"
                  width={1200}
                  height={700}
                  className="w-full h-auto"
                />
              </div>
            </div>
            {/* Create game screens — full width */}
            <div>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] mb-4" style={{ color: brand.primary }}>
                Create Game Flow
              </p>
              <div className="rounded-2xl overflow-hidden border" style={{ borderColor: c.border }}>
                <Image
                  src="/create-game.png"
                  alt="PlayPal Create Game flow"
                  width={1200}
                  height={700}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── PROBLEM ── */}
        <div className="section-block">
          <SectionHeading num="01" title="The Problem" c={c} />
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="text-xl md:text-2xl font-black uppercase leading-tight tracking-tight mb-5" style={{ color: c.text }}>
                Finding someone to play sports with is harder than it should be.
              </p>
              <blockquote className="border-l-2 pl-4 mt-6" style={{ borderColor: brand.primary }}>
                <p className="font-mono text-sm italic" style={{ color: c.textMuted }}>
                  "People give up on physical activity not because they lack motivation — but because they lack a partner."
                </p>
              </blockquote>
            </div>
            <div className="space-y-4">
              <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
                Casual sports players in cities rely on WhatsApp groups, social media posts, or pure luck to find partners. There's no dedicated, low-friction way to find people at the right skill level, at the right time, near the right venue.
              </p>
              <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
                Booking venues is a separate, often frustrating process — handled through phone calls or third-party platforms with no connection to the game or the players involved.
              </p>
            </div>
          </div>
        </div>

        {/* ── RESEARCH ── */}
        <div className="section-block">
          <SectionHeading num="02" title="Research & Key Insights" c={c} />
          <p className="font-mono text-sm leading-relaxed max-w-2xl mb-8" style={{ color: c.textMuted }}>
            Research focused on understanding how casual sports players currently organise games — the friction points, the workarounds, and what they actually need.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Players spend more time coordinating than playing — messaging across multiple platforms to confirm attendance.',
              'Skill level mismatch is a major frustration — playing with people who are too advanced or too casual kills enjoyment.',
              'Venue discovery is disconnected — users book courts on separate apps with no link to who they\'re playing with.',
              'Social barrier — asking strangers to play feels awkward without a structured, purpose-built platform.',
            ].map((text, i) => (
              <Card key={i} c={c} accentBorder={brand.primary}>
                <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>{text}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* ── DESIGN GOALS ── */}
        <div className="section-block">
          <SectionHeading num="03" title="Design Goals" c={c} />
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { title: 'Reduce coordination friction', desc: 'Let users create or join a game in under a minute — sport, time, location, skill level, done.' },
              { title: 'Match by skill level',         desc: 'Noobie, Proficient, Master — clear tiers so games feel balanced and enjoyable for everyone.' },
              { title: 'Unify venue booking',          desc: 'Browse, compare, and book venues directly inside the game creation flow — no separate app needed.' },
            ].map(g => (
              <Card key={g.title} c={c} accentBorder={brand.primary}>
                <div className="w-5 h-[1px] mb-4" style={{ background: brand.primary }} aria-hidden="true" />
                <h3 className="text-sm font-black uppercase tracking-tight mb-2" style={{ color: c.text }}>{g.title}</h3>
                <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>{g.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* ── DESIGN PROCESS ── */}
        <div className="section-block">
          <SectionHeading num="04" title="Design Process" c={c} />
          <div className="space-y-8">
            {[
              { step: '01 — Mapping the Core Flows', body: 'Three main flows were identified: finding players and joining an existing game, creating a new game with full settings, and discovering and booking venues. Each flow was mapped before any visual design began.' },
              { step: '02 — Design System First',    body: 'A component library was built before screens — button variants, input states, card types, tab navigation, and icon sets. This ensured consistency across all screens from the first high-fidelity frame.' },
              { step: '03 — Interaction Design',     body: 'Key micro-interactions were designed: sport filter chips, date carousel, skill level selection, game access toggle (Public vs Invite Only), and the player management screen with add/remove controls.' },
              { step: '04 — Iteration',              body: 'The create game flow went through multiple iterations — early versions had too many steps. The final version combines sport, area, date, time, access, and skill level on a single scrollable screen with a clear CTA.' },
            ].map(p => (
              <ProcessStep key={p.step} step={p.step} body={p.body} c={c} accentBorder={brand.primary} />
            ))}
          </div>
        </div>

        {/* ── KEY FEATURES ── */}
        <div className="section-block">
          <SectionHeading num="05" title="Key Features" c={c} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Find Players',   desc: 'Browse open games by sport, date, and skill level — join with one tap.' },
              { name: 'Create Game',    desc: 'Set sport, time, area, access type, skill level, and instructions in one flow.' },
              { name: 'Book Venue',     desc: 'Discover, compare, and book courts directly — price, rating, and amenities shown.' },
              { name: 'Manage Players', desc: 'Add players, set invite-only access, share game link, manage attendance.' },
            ].map(f => (
              <Card key={f.name} c={c} accentBorder={brand.primary}>
                <p className="text-[10px] uppercase font-mono tracking-widest mb-2" style={{ color: brand.primary }}>{f.name}</p>
                <p className="text-[10px] font-mono leading-relaxed" style={{ color: c.textMuted }}>{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* ── DESIGN SYSTEM ── */}
        <div className="section-block">
          <SectionHeading num="06" title="Design System" c={c} />
          <div className="grid md:grid-cols-3 gap-5">
            <Card c={c}>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] text-[#2978FF] mb-4">Color Palette</p>
              <div className="grid grid-cols-3 gap-2 mb-4" role="img" aria-label="PlayPal palette: blue primary, yellow secondary, dark text">
                {[
                  { bg: '#2978FF', label: 'Primary' },
                  { bg: '#FFC107', label: 'Secondary' },
                  { bg: '#333333', label: 'Text' },
                ].map(col => (
                  <div key={col.label} className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded border" style={{ background: col.bg, borderColor: c.border }} title={col.bg} />
                    <p className="text-[8px] font-mono" style={{ color: c.textFaint }}>{col.label}</p>
                  </div>
                ))}
              </div>
              <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>
                Restrained palette maintains clarity and reduces visual noise — supporting a low-pressure, approachable experience.
              </p>
            </Card>
            <Card c={c}>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] text-[#2978FF] mb-4">Typography</p>
              <p className="text-lg font-bold mb-1" style={{ color: c.text }}>Zalando Sans</p>
              <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>
                Bold, SemiBold, Medium, Regular — prioritizing readability and hierarchy. Supports quick scanning and reduces cognitive load.
              </p>
            </Card>
            <Card c={c}>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] text-[#2978FF] mb-4">Navigation Design</p>
              <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>
                Core actions — Home, Play, Create, Book, Profile — accessible through predictable patterns and clear labels. Repeated layouts across flows help users feel oriented when switching between tasks.
              </p>
            </Card>
          </div>
        </div>

        {/* ── REFLECTION ── */}
        <div className="section-block border-t pt-14" style={{ borderColor: c.border }}>
          <SectionHeading num="07" title="Reflection" c={c} />
          <div className="max-w-2xl space-y-4">
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
              PlayPal pushed me to think about social friction in product design — not just usability, but the psychological barrier of reaching out to strangers. The design had to make that feel natural and low-stakes.
            </p>
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
              Building the design system before the screens was a deliberate choice and the right one — it meant every screen felt consistent from the first draft, and iteration was faster because components just snapped together.
            </p>
          </div>
        </div>

        <ProjectNav
          prev={{ label: 'MyTown', href: '/projects/mytown' }}
          c={c}
        />
      </div>
    </main>
  )
}
