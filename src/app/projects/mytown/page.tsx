"use client"
import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  useTheme, T,
  Grain, ThemeToggle, SiteNav, BackButton, ProjectNav,
  Stat, SectionHeading, ProcessStep, Card, Tag, PersonaGrid, SkipLink,
} from '../_shared'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const reduced = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function MyTownPage() {
  const container = useRef<HTMLDivElement>(null)
  const { theme, toggle } = useTheme()
  const c = T[theme]
  const tr = 'transition-colors duration-300'

  const brand = {
    primary:   '#FF844B',
    secondary: '#55A6EC',
    tertiary:  '#28285F',
    bg:        '#0d1318',
    glow:      'rgba(255,132,75,0.15)',
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
      <SiteNav c={c} projectName="MyTown" />
      <ThemeToggle theme={theme} toggle={toggle} c={c} />

      {/* ── HERO ── */}
      <section
        id="main-content"
        className={`relative min-h-[70vh] flex flex-col justify-end px-6 md:px-16 pb-16 pt-28 border-b overflow-hidden ${tr}`}
        style={{ borderColor: c.border, background: theme === 'dark' ? brand.bg : c.bg }}
        aria-label="MyTown — project hero"
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 20% 60%, ${brand.glow} 0%, transparent 65%)` }} aria-hidden="true" />

        <div className="project-fade-in mb-8 relative z-10">
          <BackButton c={c} />
        </div>

        {/* Real MyTown logo */}
        <div className="project-fade-in mb-6 relative z-10">
          <Image
            src="/mytown-logo.png"
            alt="MyTown"
            width={160}
            height={100}
            className="h-16 w-auto"
            style={{ filter: theme === 'dark' ? 'brightness(1)' : 'none' }}
          />
        </div>

        <div className="overflow-hidden mb-2 relative z-10">
          <div className="project-hero-title flex flex-wrap" aria-hidden="true">
            {'MYTOWN'.split('').map((char, i) => (
              <span key={i} className="inline-block text-[14vw] md:text-[11vw] font-black uppercase leading-[0.85] tracking-tighter" style={{ color: brand.secondary }}>{char}</span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden mb-8 relative z-10">
          <div className="project-hero-title flex flex-wrap" aria-hidden="true">
            {'RELOCATION'.split('').map((char, i) => (
              <span key={i} className="inline-block text-[7vw] md:text-[5.5vw] font-black uppercase leading-[0.9] tracking-tighter" style={{ color: brand.primary }}>{char}</span>
            ))}
          </div>
        </div>

        <p className="project-fade-in font-mono text-sm max-w-xl leading-relaxed mb-6 relative z-10" style={{ color: c.textMuted }}>
          A service concept and mobile app designed to support international students during their first weeks in Finland — centralizing practical guidance, local discovery, and peer support.
        </p>
        <div className="project-fade-in flex flex-wrap gap-2 relative z-10">
          {['Product Design', 'Service Concept', 'Figma', 'UX Research', 'Co-creation'].map(tag => (
            <Tag key={tag} label={tag} c={c} />
          ))}
        </div>
      </section>

      {/* ── META ── */}
      <section className={`grid grid-cols-2 md:grid-cols-4 border-b ${tr}`} style={{ borderColor: c.border }}>
        {[
          { label: 'Role',     value: 'UI/UX Designer, Product Designer' },
          { label: 'Timeline', value: 'Oct – Dec 2025' },
          { label: 'Tools',    value: 'Figma, Whiteboard' },
          { label: 'Type',     value: 'Group Project' },
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
            Three core flows — the Home checklist for first-week tasks, the Events discovery screen, and the Support Hub with guides and FAQs — each designed to reduce friction during the settling-in process.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { src: '/home.png',        label: 'Home — First Week Checklist' },
              { src: '/events.png',      label: 'Events Discovery' },
              { src: '/support-hub.png', label: 'Support Hub & FAQs' },
            ].map(({ src, label }) => (
              <div key={src} className="flex flex-col gap-3">
                <div className="rounded-2xl overflow-hidden border" style={{ borderColor: c.border }}>
                  <Image src={src} alt={label} width={500} height={900} className="w-full h-auto" />
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
                Not a lack of information — a lack of clarity, order, and emotional support.
              </p>
              <blockquote className="border-l-2 pl-4 mt-6" style={{ borderColor: brand.primary }}>
                <p className="font-mono text-sm italic" style={{ color: c.textMuted }}>
                  "Students rely heavily on peers and tutors, creating stress during their first weeks."
                </p>
              </blockquote>
            </div>
            <div className="space-y-4">
              <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
                International students moving to Finland face a complex and fragmented settling-in process. Essential tasks — university registration, DVV appointments, bank account setup, transportation, housing — all happen at the same time, with limited step-by-step guidance.
              </p>
              <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
                Most information is scattered across university websites, emails, social media groups, and word-of-mouth.
              </p>
            </div>
          </div>
        </div>

        {/* ── RESEARCH ── */}
        <div className="section-block">
          <SectionHeading num="02" title="Research & Synthesis" c={c} />
          <div className="mb-8 space-y-4">
            <p className="font-mono text-sm leading-relaxed max-w-2xl" style={{ color: c.textMuted }}>
              Research used a qualitative, user-centered approach. Semi-structured interviews explored early settling-in experiences, practical challenges, emotional stress, and how students currently find support. A co-creation workshop was organised with recently arrived international students.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Bureaucracy overload — multiple official tasks (DVV, banking, SIM) happen simultaneously with no clear order.',
              'Finnish-only documents and interfaces create confusion for non-Finnish speakers.',
              'Social isolation hits hardest in the first weeks — students feel disconnected before they find their community.',
              'Information is scattered — students switch between university portals, WhatsApp groups, and tutors to get answers.',
            ].map((text, i) => (
              <Card key={i} c={c} accentBorder={brand.primary}>
                <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>{text}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* ── SITEMAP ── */}
        <div className="section-block">
          <SectionHeading num="03" title="Information Architecture" c={c} />
          <p className="font-mono text-sm leading-relaxed max-w-2xl mb-8" style={{ color: c.textMuted }}>
            The sitemap maps the four core pillars of MyTown — Discover, Student Life & Events, Help, and Support Hub — organised around the user's natural settling-in journey.
          </p>
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: c.border }}>
            <Image src="/sitemap.png" alt="MyTown Sitemap" width={1400} height={800} className="w-full h-auto" />
          </div>
        </div>

        {/* ── DESIGN PROCESS ── */}
        <div className="section-block">
          <SectionHeading num="04" title="Design Process" c={c} />
          <div className="space-y-8">
            {[
              { step: '01 — Co-creation Workshop', body: 'We co-hosted a workshop with recently arrived international students. Participants individually documented challenges, successes, and unmet needs — then collaboratively performed affinity mapping within the session itself.' },
              { step: '02 — Defining the Service Concept', body: 'Four pillars emerged from research: The Roadmaps (step-by-step task guides), Discovery Map (essentials around campus), Student Life (events and clubs), and Support Hub (mentor chat, AI FAQ, emergency info).' },
              { step: '03 — Wireframes to High-Fidelity', body: 'We moved from low-fidelity flows to a complete design system in Figma — including a full color token library, button system, form controls, and component states.' },
              { step: '04 — Heuristic Evaluation', body: 'The prototype was reviewed using heuristic evaluation and cognitive walkthroughs. This helped simplify the onboarding flow and clarify the first-week checklist priority order.' },
            ].map(p => (
              <ProcessStep key={p.step} step={p.step} body={p.body} c={c} accentBorder={brand.primary} />
            ))}
          </div>
        </div>

        {/* ── DESIGN SYSTEM ── */}
        <div className="section-block">
          <SectionHeading num="05" title="Design System" c={c} />
          <p className="font-mono text-sm leading-relaxed max-w-2xl mb-10" style={{ color: c.textMuted }}>
            A complete design system was built in Figma — color tokens, button variants, form controls, and icon libraries — ensuring consistency across all screens and states.
          </p>

          {/* Color system */}
          <div className="mb-6">
            <p className="text-[9px] uppercase font-mono tracking-[0.3em] mb-4" style={{ color: brand.primary }}>Color System</p>
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: c.border }}>
              <Image src="/Colors.png" alt="MyTown Color System" width={1200} height={700} className="w-full h-auto" />
            </div>
          </div>

          {/* Button + Form side by side */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] mb-4" style={{ color: brand.primary }}>Button System</p>
              <div className="rounded-xl overflow-hidden border" style={{ borderColor: c.border }}>
                <Image src="/Button_System.png" alt="MyTown Button System" width={800} height={600} className="w-full h-auto" />
              </div>
            </div>
            <div>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] mb-4" style={{ color: brand.primary }}>Form Controls</p>
              <div className="rounded-xl overflow-hidden border" style={{ borderColor: c.border }}>
                <Image src="/Form_Controls.png" alt="MyTown Form Controls" width={800} height={600} className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* ── FOUR PILLARS ── */}
        <div className="section-block">
          <SectionHeading num="06" title="The Four Pillars" c={c} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'The Roadmaps',  desc: 'Step-by-step task guides: Arrival → DVV → Bank → SIM' },
              { name: 'Discovery Map', desc: 'University, groceries, student lunch, essentials nearby' },
              { name: 'Student Life',  desc: 'Events, clubs, community connections' },
              { name: 'Support Hub',   desc: 'Mentor chat, AI FAQ, settling guides, emergency info' },
            ].map(p => (
              <Card key={p.name} c={c} accentBorder={brand.primary}>
                <p className="text-[10px] uppercase font-mono tracking-widest mb-2" style={{ color: brand.primary }}>{p.name}</p>
                <p className="text-[10px] font-mono leading-relaxed" style={{ color: c.textMuted }}>{p.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* ── REFLECTION ── */}
        <div className="section-block border-t pt-14" style={{ borderColor: c.border }}>
          <SectionHeading num="07" title="Reflection" c={c} />
          <div className="max-w-2xl space-y-4">
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
              This project changed how I think about design beyond interfaces. Coming from a computer science background, I initially approached the problem with a solution-first mindset. Through this course, I learned to slow down and focus on understanding why users struggle before designing features.
            </p>
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
              One key learning was the value of asking deeper questions. Students mentioned Google Maps and Telegram, but interviews revealed these choices were driven by trust and peer recommendations — helping us avoid designing unnecessary replacements.
            </p>
          </div>
        </div>

        <ProjectNav
          prev={{ label: 'CityLoop', href: '/projects/cityloop' }}
          next={{ label: 'PlayPal',  href: '/projects/playpal'  }}
          c={c}
        />
      </div>
    </main>
  )
}
