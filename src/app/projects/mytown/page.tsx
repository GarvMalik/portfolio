"use client"
import { useRef } from 'react'
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
        aria-label="MyTown — project hero"
      >
        <div className="project-fade-in mb-8">
          <BackButton c={c} />
        </div>
        <div className="overflow-hidden mb-1" aria-label="MyTown">
          <div className="project-hero-title flex flex-wrap" aria-hidden="true">
            {'MYTOWN'.split('').map((char, i) => (
              <span key={i} className="inline-block text-[14vw] font-black uppercase leading-[0.85] tracking-tighter" style={{ color: c.text }}>
                {char}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden mb-8" aria-label="Relocation">
          <div className="project-hero-title flex flex-wrap" aria-hidden="true">
            {'RELOCATION'.split('').map((char, i) => (
              <span key={i} className="inline-block text-[8vw] font-black uppercase leading-[0.9] tracking-tighter text-[#ff4d00]">
                {char}
              </span>
            ))}
          </div>
        </div>
        <p className="project-fade-in font-mono text-sm max-w-xl leading-relaxed mb-6" style={{ color: c.textMuted }}>
          A service concept and mobile app designed to support international students during their first weeks in Finland — centralizing practical guidance, local discovery, and peer support.
        </p>
        <div className="project-fade-in flex flex-wrap gap-2" role="list" aria-label="Project tags">
          {['Product Design', 'Service Concept', 'Figma', 'UX Research', 'Co-creation Workshop'].map(tag => (
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
          { label: 'Role',     value: 'UI/UX Designer, Product Designer' },
          { label: 'Timeline', value: 'Oct 2025 – Dec 2025' },
          { label: 'Tools',    value: 'Figma, Microsoft Whiteboard' },
          { label: 'Type',     value: 'Group Project' },
        ].map((s, i) => (
          <div key={s.label} className={`px-6 md:px-12 ${tr} ${i < 3 ? 'border-r' : ''}`} style={{ borderColor: c.border }}>
            <Stat label={s.label} value={s.value} c={c} />
          </div>
        ))}
      </section>

      <div className="px-6 md:px-16 py-20 max-w-7xl mx-auto space-y-28">

        {/* 00 What I Worked On */}
        <div className="section-block" aria-labelledby="s-role">
          <SectionHeading num="00" title="What I Worked On" c={c} />
          <div className="grid md:grid-cols-2 gap-10">
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
              This was a collaborative group project with shared responsibilities. I co-hosted the user workshop, analysed interview data, and contributed to affinity mapping and synthesis. I helped define the service concept, sitemap, and design direction, and contributed to the design system and high-fidelity prototype.
            </p>
            <ul className="space-y-2" aria-label="Contributions">
              {[
                'Co-hosted the user co-creation workshop',
                'Interview data analysis and affinity mapping',
                'User journey map and persona creation',
                'Service concept and sitemap definition',
                'Design system and high-fidelity prototype',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-xs font-mono" style={{ color: c.textMuted }}>
                  <span className="text-[#ff4d00] mt-0.5 flex-shrink-0" aria-hidden="true">✦</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 01 Problem */}
        <div className="section-block" aria-labelledby="s-problem">
          <SectionHeading num="01" title="The Problem" c={c} />
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="text-xl md:text-2xl font-black uppercase leading-tight tracking-tight mb-5" style={{ color: c.text }}>
                Not a lack of information — a lack of clarity, order, and emotional support.
              </p>
            </div>
            <div className="space-y-4">
              <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
                International students moving to Finland face a complex and fragmented settling-in process. Essential tasks — university registration, DVV appointments, bank account setup, transportation, housing — all happen at the same time, with limited step-by-step guidance.
              </p>
              <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
                Most information is scattered across university websites, emails, social media groups, and word-of-mouth. Students rely heavily on peers and tutors, creating stress and a feeling of being overwhelmed during the first weeks.
              </p>
            </div>
          </div>
        </div>

        {/* 02 Research */}
        <div className="section-block" aria-labelledby="s-research">
          <SectionHeading num="02" title="Research & Synthesis" c={c} />
          <div className="mb-8 space-y-4">
            <p className="font-mono text-sm leading-relaxed max-w-2xl" style={{ color: c.textMuted }}>
              Research used a qualitative, user-centered approach. Semi-structured interviews explored early settling-in experiences, practical challenges, emotional stress, and how students currently find support.
            </p>
            <p className="font-mono text-sm leading-relaxed max-w-2xl" style={{ color: c.textMuted }}>
              A co-creation workshop was organised with recently arrived international students. Participants individually documented challenges, successes, and unmet needs — then collaboratively grouped notes to perform affinity mapping within the workshop itself.
            </p>
          </div>

          {/* Persona */}
          <Card c={c}>
            <p className="text-[9px] uppercase font-mono tracking-[0.3em] text-[#ff4d00] mb-6">Persona — Sheldon</p>
            <PersonaGrid
              c={c}
              columns={[
                {
                  heading: 'About',
                  items: [
                    '18-year-old first-year student from the USA',
                    'Motivated and independent',
                    'Overwhelmed by unfamiliar systems and bureaucracy',
                    'Relies on peers and familiar tools',
                  ],
                },
                {
                  heading: 'Problems',
                  items: [
                    'Bureaucracy overload',
                    'Finnish-only documents',
                    'Information scattered across apps',
                    'Social isolation and homesickness',
                    'Confusing public transport rules',
                  ],
                },
                {
                  heading: 'Needs',
                  items: [
                    'Step-by-step settling guide',
                    'Clear instructions for DVV, banking, SIM',
                    'Essentials map with tips and locations',
                    'Peer and mentor support',
                  ],
                },
              ]}
            />
          </Card>

          {/* Journey stages */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6" role="list" aria-label="Journey map stages">
            {[
              { phase: 'Before Arrival', emotion: 'Anxious / Overwhelmed', note: 'No single trusted source of information' },
              { phase: 'Arrival Week',   emotion: 'Confused / Rushed',     note: 'Long queues, transport confusion, feels alone' },
              { phase: 'Settling In',    emotion: 'Curious / Lonely',      note: "Hard to socialise, doesn't know local events" },
              { phase: 'Long-Term',      emotion: 'Empowered / Confident', note: 'Hard to maintain engagement, seasonal challenges' },
            ].map(stage => (
              <Card key={stage.phase} c={c} accentBorder="#ff4d00">
                <p className="text-[9px] uppercase font-mono tracking-widest text-[#ff4d00] mb-2">{stage.phase}</p>
                <p className="text-xs font-mono mb-2" style={{ color: c.textMuted }}>{stage.emotion}</p>
                <p className="text-[10px] font-mono italic" style={{ color: c.textFaint }}>{stage.note}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* 03 Design Goals */}
        <div className="section-block" aria-labelledby="s-goals">
          <SectionHeading num="03" title="Design Goals & Service Concept" c={c} />
          <div className="grid md:grid-cols-3 gap-5 mb-6">
            {[
              { title: 'Simplify the settling-in', desc: 'Help students understand what to do, in what order, and where to go. Reduce mental overload.' },
              { title: 'Support existing habits',  desc: 'Add context and guidance around tools students already use, rather than replacing them.' },
              { title: 'Value beyond onboarding',  desc: 'Offer ongoing support through events, practical tips, and peer or mentor guidance.' },
            ].map(g => (
              <Card key={g.title} c={c}>
                <div className="w-5 h-[1px] mb-4" style={{ background: c.text }} aria-hidden="true" />
                <h3 className="text-sm font-black uppercase tracking-tight mb-2" style={{ color: c.text }}>{g.title}</h3>
                <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>{g.desc}</p>
              </Card>
            ))}
          </div>

          {/* Four pillars */}
          <Card c={c}>
            <p className="text-[9px] uppercase font-mono tracking-[0.3em] text-[#ff4d00] mb-5">The Four Pillars of MyTown</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4" role="list">
              {[
                { name: 'The Roadmaps',  desc: 'Step-by-step task guides: Arrival → DVV → Bank' },
                { name: 'Discovery Map', desc: 'University, groceries, student lunch, essentials' },
                { name: 'Student Life',  desc: 'Events, clubs, community connections' },
                { name: 'Support Hub',   desc: 'Mentor chat, AI FAQ, emergency info' },
              ].map(p => (
                <div key={p.name} role="listitem" className="text-center p-3 border" style={{ borderColor: c.border }}>
                  <p className="text-[10px] uppercase font-mono tracking-widest text-[#ff4d00] mb-2">{p.name}</p>
                  <p className="text-[10px] font-mono leading-relaxed" style={{ color: c.textFaint }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 04 Design System */}
        <div className="section-block" aria-labelledby="s-system">
          <SectionHeading num="04" title="Design System" c={c} />
          <div className="grid md:grid-cols-3 gap-5">
            <Card c={c}>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] text-[#ff4d00] mb-4">Color Tokens</p>
              <div className="grid grid-cols-3 gap-2 mb-4" role="img" aria-label="MyTown palette: orange primary, blue secondary, purple tertiary">
                {[
                  { bg: '#FF844B', label: 'Primary' },
                  { bg: '#4A86EC', label: 'Secondary' },
                  { bg: '#28285F', label: 'Tertiary' },
                ].map(col => (
                  <div key={col.label} className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded border" style={{ background: col.bg, borderColor: c.border }} title={col.bg} />
                    <p className="text-[8px] font-mono" style={{ color: c.textFaint }}>{col.label}</p>
                  </div>
                ))}
              </div>
              <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>
                Semantic tokens: primary_main, text_primary, grey_500 — calm neutral base with a strong orange accent.
              </p>
            </Card>
            <Card c={c}>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] text-[#ff4d00] mb-4">Typography</p>
              <p className="text-lg font-bold mb-1" style={{ color: c.text }}>Nunito</p>
              <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>
                Chosen for readability and friendly tone. Clear scale: Display, H1–H4, Body L/M/S, Button, Caption. Tokens connected to components.
              </p>
            </Card>
            <Card c={c}>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] text-[#ff4d00] mb-4">Components</p>
              <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>
                Buttons, inputs, switches, checkboxes, radio buttons — reusable with predefined states: default, focused, pressed, disabled, error. Icons follow Material Design Icons.
              </p>
            </Card>
          </div>
        </div>

        {/* 05 Prototype */}
        <div className="section-block" aria-labelledby="s-prototype">
          <SectionHeading num="05" title="Prototype Highlights" c={c} />
          <div className="space-y-6">
            {[
              { flow: 'Arrival & Onboarding Flow',       desc: 'Helps students complete essential tasks step by step during their first week. The "First Week Checklist" — SIM card, DVV, Polisi Card, Public Transport Card — with detailed step-by-step guidance, required documents, tips, and a completion state inside each task.' },
              { flow: 'Practical Guidance & Map View',   desc: 'A map-based view that highlights student-relevant locations such as offices, services, and everyday essentials. Categories include public spaces, grocery stores, and university buildings.' },
              { flow: 'Support Hub',                     desc: 'Centralizes guides, FAQs, and direct help. Students access step-by-step information, search common questions (Registration, Housing, Banking, Transport, Daily Life, Events), and get support through mentor chat or AI assistant.' },
              { flow: 'Events & Social Discovery',       desc: 'Helps students discover relevant academic and social activities without searching across multiple platforms. All events and university events separated, with robust filter options.' },
            ].map(f => (
              <ProcessStep key={f.flow} step={f.flow} body={f.desc} c={c} />
            ))}
          </div>
        </div>

        {/* 06 Reflection */}
        <div className="section-block border-t pt-14" style={{ borderColor: c.border }} aria-labelledby="s-reflection">
          <SectionHeading num="06" title="Reflection" c={c} />
          <div className="max-w-2xl space-y-4">
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
              This project changed how I think about design beyond interfaces. Coming from a computer science background and being relatively new to HCI, I initially approached the problem with a solution-first mindset. Through this course, I learned to slow down and focus on understanding why users struggle before designing features.
            </p>
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
              One key learning was the value of asking deeper questions. Students mentioned Google Maps and Telegram, but interviews revealed these choices were driven by trust and peer recommendations — helping us avoid designing unnecessary replacements.
            </p>
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
              I also learned to see research artifacts as decision-making tools rather than documentation. Personas and journey maps highlighted moments of confusion and overload that directly shaped our design priorities.
            </p>
          </div>
        </div>

        <ProjectNav
          prev={{ label: 'CityLoop', href: '/projects/cityloop' }}
          next={{ label: 'PlayPal',  href: '/projects/playpal' }}
          c={c}
        />
      </div>
    </main>
  )
}
