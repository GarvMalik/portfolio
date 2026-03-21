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

export default function PlayPalPage() {
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

  // ── PlayPal brand tokens — exact palette ──
  const brand = {
    primary:   '#2978FF',   // PlayPal primary blue
    secondary: '#FFC107',   // PlayPal secondary yellow
    dark:      '#0151D9',   // PlayPal dark blue
    bg:        '#080c14',   // deep blue-black
    glow:      'rgba(41,120,255,0.20)',
  }

  return (
    <main
      ref={container}
      className={`min-h-screen overflow-x-hidden selection:text-black ${tr}`}
      style={{ background: c.bg, color: c.text }}
    >
      <SkipLink />
      <Grain opacity={c.grain} />
      <SiteNav c={c} />
      <ThemeToggle theme={theme} toggle={toggle} c={c} />

      {/* ── HERO ── */}
      <section
        id="main-content"
        className={`relative min-h-[70vh] flex flex-col justify-end px-6 md:px-16 pb-16 pt-28 border-b overflow-hidden ${tr}`}
        style={{ borderColor: c.border, background: brand.bg }}
        aria-label="PlayPal — project hero"
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 30% 60%, ${brand.glow} 0%, transparent 65%)` }} aria-hidden="true" />

        <div className="project-fade-in mb-8 relative z-10">
          <BackButton c={c} />
        </div>

        {/* PlayPal basketball logo */}
        <div className="project-fade-in mb-6 relative z-10" aria-label="PlayPal logo">
          <svg width="48" height="52" viewBox="0 0 48 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            {/* Basketball circle */}
            <circle cx="24" cy="22" r="18" stroke={brand.primary} strokeWidth="3" fill="none"/>
            {/* Vertical line */}
            <line x1="24" y1="4" x2="24" y2="40" stroke={brand.primary} strokeWidth="2.5"/>
            {/* Horizontal line */}
            <line x1="6" y1="22" x2="42" y2="22" stroke={brand.primary} strokeWidth="2.5"/>
            {/* Arc left */}
            <path d="M24,4 Q10,14 10,22 Q10,30 24,40" stroke={brand.primary} strokeWidth="2.5" fill="none"/>
            {/* Arc right */}
            <path d="M24,4 Q38,14 38,22 Q38,30 24,40" stroke={brand.primary} strokeWidth="2.5" fill="none"/>
            {/* Yellow underline */}
            <line x1="2" y1="48" x2="46" y2="48" stroke={brand.secondary} strokeWidth="3" strokeLinecap="round"/>
            <line x1="6" y1="44" x2="42" y2="44" stroke={brand.secondary} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
          </svg>
          <p className="text-[10px] uppercase font-mono tracking-[0.5em] mt-2" style={{ color: brand.primary }}>PLAYPAL</p>
        </div>

        <div className="overflow-hidden mb-1 relative z-10" aria-label="PlayPal">
          <div className="project-hero-title flex flex-wrap" aria-hidden="true">
            {'PLAYPAL'.split('').map((char, i) => (
              <span key={i} className="inline-block text-[14vw] font-black uppercase leading-[0.85] tracking-tighter" style={{ color: brand.primary }}>
                {char}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden mb-8 relative z-10" aria-label="Community">
          <div className="project-hero-title flex flex-wrap" aria-hidden="true">
            {'COMMUNITY'.split('').map((char, i) => (
              <span key={i} className="inline-block text-[8vw] font-black uppercase leading-[0.9] tracking-tighter" style={{ color: brand.secondary }}>
                {char}
              </span>
            ))}
          </div>
        </div>
        <p className="project-fade-in font-mono text-sm max-w-xl leading-relaxed mb-6" style={{ color: c.textMuted }}>
          A service and mobile app concept designed to help people find sports partners, organize games, and book nearby venues — with less social and logistical effort.
        </p>
        <div className="project-fade-in flex flex-wrap gap-2" role="list" aria-label="Project tags">
          {['Design System', 'Interaction Design', 'Figma', 'Service Design', 'UX Research'].map(tag => (
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
          { label: 'Timeline', value: 'Aug 2025 – Oct 2025' },
          { label: 'Tools',    value: 'Figma, Mural, Canva' },
          { label: 'Type',     value: 'Group Project' },
          { label: 'Links',    value: 'Behance ↗' },
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
              I contributed across research, synthesis, and design phases. My main focus was on translating user insights into a clear service structure and usable interface.
            </p>
            <ul className="space-y-2" aria-label="Contributions">
              {[
                'Defined the conceptual model and sitemap for the service',
                'Designed wireframes and combined individual drafts into a cohesive structure',
                'Created high-fidelity screens — particularly the Play Game and Book Game flows',
                'Supported the design system to ensure consistency across screens',
                'Participated in user interviews, transcription, and collaborative analysis',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-xs font-mono" style={{ color: c.textMuted }}>
                  <span className="text-[#2978FF] mt-0.5 flex-shrink-0" aria-hidden="true">✦</span>
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
                People stop playing sports not because they lack motivation — because coordination is too hard.
              </p>
              <blockquote className="border-l-2 border-[#2978FF] pl-4">
                <p className="font-mono text-sm italic" style={{ color: c.textMuted }}>
                  "The key challenge: enabling people to move easily from wanting to play to actually having a game."
                </p>
              </blockquote>
            </div>
            <div className="space-y-4">
              <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
                Many people enjoy playing sports but struggle to do so regularly because organising group activities takes effort. Finding suitable partners, aligning schedules, booking venues, and considering travel distance often turns a simple plan into a frustrating task.
              </p>
              <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
                Existing solutions are fragmented across messaging apps, social media groups, and separate booking systems. The challenge was enabling people to move smoothly from intention to action, without social pressure or logistical friction.
              </p>
            </div>
          </div>
        </div>

        {/* 02 Research */}
        <div className="section-block" aria-labelledby="s-research">
          <SectionHeading num="02" title="Research & Key Insights" c={c} />
          <p className="font-mono text-sm leading-relaxed max-w-2xl mb-8" style={{ color: c.textMuted }}>
            Semi-structured interviews with people who regularly play sports such as badminton, football, or gym-based activities. Interviews focused on how participants find players, organise games, choose venues, and what prevents them from playing. Analysed collaboratively using affinity mapping.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {[
              { label: 'Primary barrier', insight: 'Coordination is the main barrier — not lack of interest or motivation.' },
              { label: 'Fragmented tools', insight: 'People rely on multiple disconnected tools to organize a single game.' },
              { label: 'Social friction',  insight: 'Social discomfort and uncertainty often stop people from reaching out.' },
              { label: 'Logistics matter', insight: 'Distance, venue availability, and timing strongly influence participation.' },
            ].map(item => (
              <Card key={item.label} c={c} accentBorder="#ff4d00">
                <p className="text-[9px] uppercase font-mono tracking-widest text-[#2978FF] mb-2">{item.label}</p>
                <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>{item.insight}</p>
              </Card>
            ))}
          </div>

          {/* Target users */}
          <Card c={c}>
            <p className="text-[9px] uppercase font-mono tracking-[0.3em] text-[#2978FF] mb-5">Target Users</p>
            <div className="grid md:grid-cols-3 gap-6" role="list">
              {[
                { name: 'Tim, 19',     desc: 'Highly active player who trains almost daily but wastes time finding games or suitable opponents.' },
                { name: 'Atharva, 25', desc: 'University student who loves badminton but struggles to find partners due to his introverted nature.' },
                { name: 'Liza, 35',    desc: 'Teacher who recently moved to a new city. Enjoys swimming and badminton but finds it hard to coordinate or discover safe, nearby venues.' },
              ].map(p => (
                <div key={p.name} role="listitem" className="border p-4" style={{ borderColor: c.border }}>
                  <p className="text-[10px] uppercase font-mono tracking-widest mb-2" style={{ color: c.text }}>{p.name}</p>
                  <p className="text-xs font-mono leading-relaxed" style={{ color: c.textMuted }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 03 Design Goals */}
        <div className="section-block" aria-labelledby="s-goals">
          <SectionHeading num="03" title="Design Goals & Service Concept" c={c} />
          <div className="grid md:grid-cols-3 gap-5 mb-6">
            {[
              { title: 'Reduce coordination effort', desc: 'Minimize the effort required to organize and join sports activities, especially in the early stages.' },
              { title: 'Support comfort levels',     desc: 'Work for hesitant players who prefer low-pressure participation and active users who value efficiency.' },
              { title: 'Increase confidence',        desc: 'Provide clear information about players, venues, distance, and availability to help users commit.' },
            ].map(g => (
              <Card key={g.title} c={c}>
                <div className="w-5 h-[1px] bg-[#2978FF] mb-4" aria-hidden="true" />
                <h3 className="text-sm font-black uppercase tracking-tight mb-2" style={{ color: c.text }}>{g.title}</h3>
                <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>{g.desc}</p>
              </Card>
            ))}
          </div>
          <Card c={c}>
            <p className="text-[9px] uppercase font-mono tracking-[0.3em] text-[#2978FF] mb-3">Service Concept</p>
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
              PlayPal is a central coordination service that brings together player discovery, game organization, and venue booking in one place. Users can join existing games or create their own — with clear information about skill level, location, timing, and participation status. The concept prioritizes clarity over complexity and spontaneity over long-term planning.
            </p>
          </Card>
        </div>

        {/* 04 Design System */}
        <div className="section-block" aria-labelledby="s-system">
          <SectionHeading num="04" title="Design System & UI Decisions" c={c} />
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

        {/* 05 Prototype */}
        <div className="section-block" aria-labelledby="s-prototype">
          <SectionHeading num="05" title="Prototype Highlights" c={c} />
          <div className="space-y-6">
            {[
              { flow: 'Finding Games & Booking Venues', desc: 'The discovery flow helps users quickly assess whether a game or venue fits their preferences. Filters for sport type, date, and location narrow options without excessive interaction. Key details — distance, time, skill level, remaining spots — are surfaced early. Venue booking is integrated directly into the experience.' },
              { flow: 'Creating and Managing a Game',   desc: 'The Create Game flow guides users through essential decisions: sport type, location, time, access level (public or invite only), and skill range. This helps reduce uncertainty for both organizer and invited players, increasing confidence before committing.' },
              { flow: 'Player Discovery',               desc: 'Users can sort, filter, and search for players directly. Profiles show sport preferences, skill level, and location — making it easier to find compatible partners without the social friction of cold outreach through messaging apps.' },
            ].map(f => (
              <ProcessStep key={f.flow} step={f.flow} body={f.desc} c={c} />
            ))}
          </div>
        </div>

        {/* 06 Evaluation */}
        <div className="section-block" aria-labelledby="s-eval">
          <SectionHeading num="06" title="Evaluation & Iteration" c={c} />
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
                The prototype was evaluated through informal walkthroughs, peer feedback sessions, and group discussions. Evaluations focused on clarity of flows, consistency across screens, and whether the interface supported the intended low-friction coordination experience.
              </p>
              <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
                Key scenarios tested: creating a game, browsing available games, and booking a venue — identifying where users might hesitate, feel uncertain, or require additional confirmation.
              </p>
            </div>
            <ul className="space-y-3" aria-label="Iteration outcomes">
              {[
                'Refined structure and ordering of inputs in Create Game flow to reduce cognitive load',
                'Adjusted labels and grouping to make essential information more visible earlier',
                'Improved visibility of location, time, and skill level information in browsing flows',
                'Small adjustments to spacing and hierarchy to support scannability',
              ].map(item => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-xs font-mono border p-3"
                  style={{ borderColor: c.border, color: c.textMuted, background: c.cardBg }}
                >
                  <span className="text-[#2978FF] mt-0.5 flex-shrink-0" aria-hidden="true">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 07 Reflection */}
        <div className="section-block border-t pt-14" style={{ borderColor: c.border }} aria-labelledby="s-reflection">
          <SectionHeading num="07" title="Reflection" c={c} />
          <div className="max-w-2xl space-y-4">
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
              This project helped me better understand how service design extends beyond interface design. While the final output included a mobile prototype, much of the value came from understanding the coordination challenges that exist before users ever interact with a screen.
            </p>
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
              Working with real user insights reinforced the importance of focusing on when friction occurs, not just where. The project shifted my thinking away from feature-driven design toward designing for confidence, clarity, and reduced effort.
            </p>
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
              Collaborating in a group setting highlighted the importance of shared understanding and alignment. Translating research insights into a coherent service concept required constant discussion, iteration, and compromise — especially when balancing different user needs and comfort levels.
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
