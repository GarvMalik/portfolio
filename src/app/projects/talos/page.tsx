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

// Brand tokens — defined outside component to avoid recreation on every render
const TALOS_BRAND = {
  primary:   '#386641',   // deep forest green
  secondary: '#5B9B43',   // lighter sage green
  tertiary:  '#A7C957',   // yellow-green accent
  bg:        '#080c08',   // near-black with green tint
  bgLight:   '#F8F3E6',   // warm parchment (app's light bg)
  glow:      'rgba(56,102,65,0.22)',
}

export default function TalosCare() {
  const container = useRef<HTMLDivElement>(null)
  const { theme, toggle } = useTheme()
  const c = T[theme]
  const tr = 'transition-colors duration-300'
  const brand = TALOS_BRAND

  useGSAP(() => {
    ScrollTrigger.getAll().forEach(t => t.kill())
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

  return (
    <main
      ref={container}
      className={`min-h-screen overflow-x-hidden ${tr}`}
      style={{ background: c.bg, color: c.text }}
    >
      <SkipLink />
      <SiteNav c={c} projectName="Talos Care" />
      <ThemeToggle theme={theme} toggle={toggle} c={c} />

      {/* ── HERO ── */}
      <section
        id="main-content"
        className={`relative min-h-[70vh] flex flex-col justify-end px-6 md:px-16 pb-16 pt-28 border-b overflow-hidden ${tr}`}
        style={{ borderColor: c.border, background: theme === 'dark' ? brand.bg : c.bg }}
        aria-label="Talos Care — project hero"
      >
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 25% 55%, ${brand.glow} 0%, transparent 65%)` }}
          aria-hidden="true"
        />

        {/* Decorative ECG / heartbeat line — visual nod to health/clinical context */}
        <div className="absolute right-6 md:right-16 top-24 md:top-28 pointer-events-none opacity-25 z-0" aria-hidden="true">
          <svg width="280" height="80" viewBox="0 0 280 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polyline
              points="0,40 30,40 45,40 55,10 65,70 75,20 85,55 95,40 130,40 160,40 175,40 185,15 195,65 205,25 215,50 225,40 280,40"
              stroke={brand.secondary}
              strokeWidth="1.8"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="project-fade-in mb-8 relative z-10">
          <BackButton c={c} />
        </div>

        {/* Course label */}
        <p
          className="project-fade-in mb-4 relative z-10 text-[9px] uppercase font-mono tracking-[0.3em]"
          style={{ color: brand.secondary }}
        >
          HTI.560 Conversational AI · Tampere University
        </p>

        <div className="overflow-hidden mb-1 relative z-10">
          <div className="project-hero-title flex flex-wrap" aria-hidden="true">
            {'TALOS'.split('').map((char, i) => (
              <span key={i} className="inline-block text-[18vw] md:text-[11vw] font-black uppercase leading-[0.85] tracking-tighter"
                style={{ color: brand.primary }}>{char}</span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden mb-8 relative z-10">
          <div className="project-hero-title flex flex-wrap" aria-hidden="true">
            {'CARE'.split('').map((char, i) => (
              <span key={i} className="inline-block text-[18vw] md:text-[11vw] font-black uppercase leading-[0.85] tracking-tighter"
                style={{ color: c.text }}>{char}</span>
            ))}
          </div>
        </div>

        <p
          className="project-fade-in font-mono text-sm max-w-xl leading-relaxed mb-6 relative z-10"
          style={{ color: c.textMuted }}
        >
          A multimodal conversational AI that helps patients disclose sensitive health information before a doctor's appointment — without the fear of human judgment.
        </p>
        <div className="project-fade-in flex flex-wrap gap-2 relative z-10">
          {['Conversational UX', 'Voice Design', 'AI Integration', 'Accessibility', 'Figma', 'JavaScript'].map(tag => (
            <Tag key={tag} label={tag} c={c} />
          ))}
        </div>
      </section>

      {/* ── META ── */}
      <section className={`grid grid-cols-2 md:grid-cols-4 border-b ${tr}`} style={{ borderColor: c.border }}>
        {[
          { label: 'Role',     value: 'UX Engineer & System Architect' },
          { label: 'Course',   value: 'HTI.560 · Jan – May 2026'       },
          { label: 'Tools',    value: 'Figma · Groq API · Web Speech API · JavaScript' },
          { label: 'Team',     value: 'Harshith Arava, Vishakha Thakur, Donya Davoodi' },
        ].map((s, i) => (
          <div key={s.label} className={`px-6 md:px-12 ${tr} ${i < 3 ? 'border-r' : ''}`}
            style={{ borderColor: c.border }}>
            <Stat label={s.label} value={s.value} c={c} />
          </div>
        ))}
      </section>

      <div className="px-6 md:px-16 py-20 max-w-7xl mx-auto space-y-28">

        {/* ── THE PROBLEM ── */}
        <div className="section-block">
          <SectionHeading num="01" title="The Problem" c={c} />
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="text-xl md:text-2xl font-black uppercase leading-tight tracking-tight mb-5"
                style={{ color: c.text }}>
                Patients lie to their doctors. Not out of malice — out of shame.
              </p>
              <blockquote className="border-l-2 pl-4 mt-6" style={{ borderColor: brand.primary }}>
                <p className="font-mono text-sm italic" style={{ color: c.textMuted }}>
                  "Patients are often more willing to disclose stigmatized information to a machine because it lacks the capacity to judge socially." — Blease, The BMJ, 2024
                </p>
              </blockquote>
            </div>
            <div className="space-y-4">
              <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
                Sensitive symptoms — substance use, sexual health, mental health struggles — are routinely withheld or downplayed during clinical appointments. Patients fear moral judgment from doctors. Clinical time is limited; a 15-minute slot rarely builds the trust needed for honest disclosure.
              </p>
              <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
                This information gap leads to inaccurate diagnoses and worse care outcomes. The question was: could a carefully designed AI agent, positioned before the appointment, fix this?
              </p>
            </div>
          </div>
        </div>

        {/* ── RESEARCH & INSIGHTS ── */}
        <div className="section-block">
          <SectionHeading num="02" title="Research & Key Insights" c={c} />
          <p className="font-mono text-sm leading-relaxed max-w-2xl mb-8" style={{ color: c.textMuted }}>
            We grounded every design decision in academic literature on the Automaton Effect, ethical AI in healthcare, and patient-chatbot interaction styles.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {[
              {
                title: 'The Automaton Effect',
                text: 'Research by Blease (2024) confirms patients disclose more sensitive information to machines than to clinicians, precisely because the machine cannot socially judge them.',
              },
              {
                title: 'Fake Empathy Backfires',
                text: 'CHI 2024 research by Lyu et al. showed that chatbots saying "I\'m so sorry for your pain" were perceived as creepy and insincere. Users preferred "Clinical Validation" — clear, task-focused acknowledgment.',
              },
              {
                title: 'Autonomy is Non-Negotiable',
                text: 'Ethical AI literature on mental health tools (JMIR 2025) found that explicit opt-out controls are critical — users need to feel in control, not interrogated.',
              },
              {
                title: 'Users Are Emotionally Vulnerable',
                text: 'Clinical environments involve anxiety, pain, and distraction. Interfaces must be high-contrast, forgiving of errors, and never force a yes/no binary on ambiguous symptoms.',
              },
            ].map((insight, i) => (
              <Card key={i} c={c} accentBorder={brand.primary}>
                <p className="text-[9px] uppercase font-mono tracking-widest mb-2" style={{ color: brand.secondary }}>{insight.title}</p>
                <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>{insight.text}</p>
              </Card>
            ))}
          </div>

          {/* User personas */}
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {[
              {
                name: 'Anxious Alex',
                age: '22',
                context: 'Seeking advice on sexual health',
                painPoints: ['Fear of moral judgment', 'Intimidated by authority figures'],
                goals: ['Disclose symptoms accurately', 'Feel reassured of confidentiality'],
              },
              {
                name: 'Private Patricia',
                age: '65',
                context: 'Experiencing early signs of cognitive decline',
                painPoints: ['Deep embarrassment', 'Fear of losing independence'],
                goals: ['Slow-paced, patient interaction', 'Explain symptoms in her own words'],
              },
            ].map((persona) => (
              <div key={persona.name} className="border p-5 transition-colors duration-300" style={{ borderColor: c.border, background: c.cardBg }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ background: brand.primary + '33', color: brand.secondary }}>
                    {persona.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-mono text-sm font-bold" style={{ color: c.text }}>{persona.name}</p>
                    <p className="text-[9px] uppercase font-mono tracking-[0.25em]" style={{ color: c.textFaint }}>Age {persona.age} · {persona.context}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[8px] uppercase font-mono tracking-widest mb-2" style={{ color: brand.primary }}>Pain Points</p>
                    {persona.painPoints.map(p => (
                      <p key={p} className="font-mono text-xs leading-relaxed mb-1" style={{ color: c.textMuted }}>— {p}</p>
                    ))}
                  </div>
                  <div>
                    <p className="text-[8px] uppercase font-mono tracking-widest mb-2" style={{ color: brand.secondary }}>Goals</p>
                    {persona.goals.map(g => (
                      <p key={g} className="font-mono text-xs leading-relaxed mb-1" style={{ color: c.textMuted }}>— {g}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── DESIGN PROCESS ── */}
        <div className="section-block">
          <SectionHeading num="03" title="Design Process" c={c} />
          <div className="space-y-8">
            {[
              {
                step: '01 — Literature Review & Concept',
                body: 'Grounded the entire system in the Automaton Effect and established the ethical opt-out framework. Defined personas and scoped the system to pre-clinical screening — not diagnosis. The AI was never allowed to act like a doctor.',
              },
              {
                step: '02 — Conversation Scripting',
                body: 'Drafted dialogue trees for high-sensitivity conditions (anxiety, sexual health). Applied the "Clinical Validation" principle from CHI research — acknowledgment over fake empathy. Wrote the two-step closing protocol to ensure the AI always summarizes before ending.',
              },
              {
                step: '03 — Interface Design in Figma',
                body: 'Designed the full component library — the Voice Orb states, quick-reply button variants, the sticky action bar with persistent "Prefer not to answer" affordance, and the final PDF Review screen. High-contrast, forgiving, and mobile-first throughout.',
              },
              {
                step: '04 — AI Integration & Prompt Engineering',
                body: 'Connected the front-end to the Groq API (Llama-4-Scout) using strict JSON-mode prompting. This constrained the AI to ask exactly one question per turn, prevented unsolicited diagnoses, and reliably generated dynamic on-screen buttons alongside spoken responses.',
              },
              {
                step: '05 — Voice UX & Error Handling',
                body: 'Implemented the Web Speech API with custom pitch-shifting logic for three distinct voice personas. Designed multimodal fallback: if speech recognition confidence dropped below 60%, the system automatically switched to on-screen buttons, preventing dead ends.',
              },
            ].map(p => (
              <ProcessStep key={p.step} step={p.step} body={p.body} c={c} accentBorder={brand.primary} />
            ))}
          </div>
        </div>

        {/* ── THE SOLUTION ── */}
        <div className="section-block">
          <SectionHeading num="04" title="The Solution" c={c} />
          <p className="font-mono text-sm leading-relaxed max-w-2xl mb-10" style={{ color: c.textMuted }}>
            A zero-backend, multimodal conversational web app. Every design decision was driven by one constraint: the patient must always feel in control, never interrogated.
          </p>

          {/* Core principles */}
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {[
              {
                principle: 'Neutral-Supportive Persona',
                desc: 'Clinical validation over fake empathy. The agent acknowledges inputs clearly without performing emotions it cannot actually have.',
                accent: brand.primary,
              },
              {
                principle: 'Explicit Autonomy',
                desc: 'A persistent "Prefer not to answer" button is always visible. Every sensitive topic opens with a reminder that skipping is always an option.',
                accent: brand.secondary,
              },
              {
                principle: 'No Dead Ends',
                desc: 'Speech recognition failure, hesitation, or ambiguity never ends the conversation — the system always offers a clear next step.',
                accent: brand.tertiary,
              },
            ].map((p) => (
              <Card key={p.principle} c={c} accentBorder={p.accent}>
                <div className="w-6 h-[2px] mb-4" style={{ background: p.accent }} />
                <p className="text-[9px] uppercase font-mono tracking-widest mb-2" style={{ color: p.accent }}>{p.principle}</p>
                <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>{p.desc}</p>
              </Card>
            ))}
          </div>

          {/* Key features */}
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                feature: 'Voice Orb with Silence Detection',
                desc: 'A continuous listening interface with distinct visual states — idle, listening, processing. Silence detection automatically stops recording, removing the need to tap a button.',
              },
              {
                feature: 'Dynamic Quick-Reply Buttons',
                desc: 'The Groq LLM generates context-aware on-screen buttons for each question in real time via JSON prompting. Users can tap or speak — both inputs are equally first-class.',
              },
              {
                feature: 'Two-Step Closing Protocol',
                desc: 'Before any session ends, the AI is forced to produce a structured summary and ask for the patient\'s final confirmation. Nothing gets submitted without explicit patient approval.',
              },
              {
                feature: 'Zero-Backend Privacy Architecture',
                desc: 'The entire session runs locally in the browser. jsPDF generates the clinical document on-device. EmailJS routes it directly to the doctor. Patient data never touches a central server.',
              },
            ].map((f, i) => (
              <Card key={i} c={c} accentBorder={brand.primary}>
                <p className="text-[9px] uppercase font-mono tracking-widest mb-2" style={{ color: brand.secondary }}>{f.feature}</p>
                <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* ── TECHNICAL STACK ── */}
        <div className="section-block">
          <SectionHeading num="05" title="Technical Stack" c={c} />
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                layer: 'AI Engine',
                value: 'Groq API (Llama-4-Scout)',
                detail: 'Strict JSON-mode prompting. Constrained to one question per turn. Prevented from diagnosing.',
              },
              {
                layer: 'Voice Engine',
                value: 'Web Speech API + ElevenLabs',
                detail: 'Custom pitch-shifting logic for Male, Female, and Neutral voice personas. Multimodal fallback at <60% confidence.',
              },
              {
                layer: 'Frontend',
                value: 'HTML / CSS / Vanilla JS',
                detail: 'Deployed live via GitHub Pages. No framework dependencies — fast load, zero build overhead.',
              },
              {
                layer: 'Privacy Layer',
                value: 'localStorage + jsPDF',
                detail: 'All session data stays on-device. Clinical PDF generated in-browser. No backend database.',
              },
              {
                layer: 'Clinical Handoff',
                value: 'EmailJS',
                detail: 'Automated doctor email triggered on patient "Submit". PDF attached. Zero server infrastructure.',
              },
              {
                layer: 'Design',
                value: 'Figma',
                detail: 'Full component library covering all interface states — orb, buttons, summaries, error states.',
              },
            ].map((s) => (
              <Card key={s.layer} c={c}>
                <p className="text-[8px] uppercase font-mono tracking-[0.3em] mb-1" style={{ color: brand.secondary }}>{s.layer}</p>
                <p className="font-mono text-sm font-bold mb-2" style={{ color: c.text }}>{s.value}</p>
                <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>{s.detail}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* ── MY CONTRIBUTION ── */}
        <div className="section-block">
          <SectionHeading num="06" title="My Contribution" c={c} />
          <div className="grid md:grid-cols-2 gap-5">
            <Card c={c} accentBorder={brand.primary}>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] mb-4" style={{ color: brand.primary }}>UX Engineer & System Architect</p>
              <div className="space-y-2">
                {[
                  'System architecture — zero-backend privacy model',
                  'Groq API integration and JSON-mode prompt engineering',
                  'Constraining LLM to clinical-safe behaviour (no diagnosis)',
                  'Multimodal voice state machine (orb, silence detection)',
                  'Error handling for API rate limits with animated fallback UI',
                  'GitHub deployment pipeline and live app delivery',
                  'Figma component library for interaction states',
                ].map(item => (
                  <div key={item} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: brand.primary }} />
                    <p className="font-mono text-xs" style={{ color: c.textMuted }}>{item}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card c={c}>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] mb-4" style={{ color: brand.secondary }}>What I Learned</p>
              <div className="space-y-3">
                <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  Bridging UI design and live AI constraints is its own discipline. Writing prompts that produce predictable, safe, one-question-at-a-time clinical dialogue required weeks of iteration — not minutes.
                </p>
                <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  We underestimated the complexity of voice-to-text mode switching. State management for overlapping audio streams had to be fully rewritten mid-project to fix an audio collision bug.
                </p>
                <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  Designing for vulnerable users sharpens every instinct. Error messages, loading states, and fallback paths cannot be afterthoughts when the user might be anxious, in pain, or distracted.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* ── OUTCOME ── */}
        <div className="section-block">
          <SectionHeading num="07" title="Outcomes" c={c} />
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {[
              { stat: '15–20',  label: 'Questions per session',  desc: 'Strict LLM prompting kept the screening focused and clinically efficient.' },
              { stat: '10 min', label: 'Live demo validated',    desc: 'Fully functional prototype demonstrated in real time to course faculty.' },
              { stat: '0',      label: 'Backend servers needed', desc: 'Complete zero-backend privacy architecture — patient data never leaves the device.' },
            ].map((o, i) => (
              <Card key={i} c={c} accentBorder={brand.primary}>
                <p className="text-3xl font-black mb-1" style={{ color: brand.primary }}>{o.stat}</p>
                <p className="text-[9px] uppercase font-mono tracking-widest mb-3" style={{ color: c.text }}>{o.label}</p>
                <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>{o.desc}</p>
              </Card>
            ))}
          </div>

          <div className="border-l-2 pl-6 py-2" style={{ borderColor: brand.primary }}>
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.text }}>
              The most significant design outcome: the AI was successfully constrained to never act as a doctor. It asks. It records. It hands off. That boundary — between data collection and clinical judgement — was the hardest design problem and the most important one to get right.
            </p>
          </div>
        </div>

        {/* ── REFLECTION ── */}
        <div className="section-block border-t pt-14" style={{ borderColor: c.border }}>
          <SectionHeading num="08" title="Reflection" c={c} />
          <div className="max-w-2xl space-y-4">
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
              Talos Care sits at the intersection of conversational UX, clinical ethics, and real AI implementation. Most portfolio projects exist as Figma prototypes. This one runs in a browser, speaks to users in a chosen voice, and generates a real PDF for a real doctor's inbox.
            </p>
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
              Designing for patients who are afraid required a level of care I hadn't applied to consumer apps. Every label, every fallback message, every moment of silence had to be intentional. The research wasn't decoration — it was load-bearing. The "Neutral bot is more trustworthy than Empathetic bot" finding directly rewrote our scripting.
            </p>
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
              What I carry forward: the habit of designing the unhappy path with the same rigor as the happy path. And the understanding that in high-stakes interaction design, the system's limits are as important as its capabilities.
            </p>
          </div>
        </div>

        <ProjectNav
          prev={{ label: 'Noise Study', href: '/projects/noise-experiment' }}
          c={c}
        />
      </div>
    </main>
  )
}
