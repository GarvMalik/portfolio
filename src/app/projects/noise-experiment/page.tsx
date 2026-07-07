"use client"
import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  useTheme, T,
  ThemeToggle, SiteNav, BackButton, ProjectNav,
  Stat, SectionHeading, ProcessStep, Card, Tag, SkipLink,
} from '../_shared'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

// Brand tokens — defined outside component to avoid recreation on every render
const NOISE_BRAND = {
  primary:  '#E8B84B',   // warm amber — research/academic feel
  secondary:'#4B7BE8',   // blue — data/science feel
  dark:     '#1a1400',
  bg:       '#0c0b08',
  glow:     'rgba(232,184,75,0.15)',
}

// Light-theme variant — same hues, darkened for contrast on the cream background
const NOISE_BRAND_LIGHT = {
  primary: '#9e7d33',
  secondary: '#33549e',
  dark: '#120e00',
  bg: '#0c0b08',
  glow: 'rgba(232,184,75,0.15)',
}

export default function NoiseExperimentPage() {
  const container = useRef<HTMLDivElement>(null)
  const { theme, toggle } = useTheme()
  const c = T[theme]
  const tr = 'transition-colors duration-300'
  const brand = theme === 'dark' ? NOISE_BRAND : NOISE_BRAND_LIGHT

  useGSAP(() => {
    ScrollTrigger.getAll().forEach(t => t.kill())
    // Arrived via the cinematic route transition? Hold the entrance until the veil lifts.
    const td = typeof window !== 'undefined' && window.__ptActive ? 0.75 : 0
    const reduced = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      gsap.set(['.project-hero-title span', '.project-fade-in', '.section-block'], { clearProps: 'all' })
      return
    }
    gsap.fromTo('.project-hero-title span',
      { yPercent: 110 },
      { yPercent: 0, duration: 1.2, stagger: 0.04, ease: 'power4.out', delay: td + 0.1 }
    )
    gsap.fromTo('.project-fade-in',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', delay: td + 0.5 }
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
      style={{ background: c.bg, color: c.text, '--accent-hover': c.accentText } as React.CSSProperties}
    >
      <SkipLink />
      <h1 className="sr-only">Effect of Environmental Noise on Reaction Time — experimental research study by Garv Malik.</h1>
      <SiteNav c={c} projectName="Noise Study" />
      <ThemeToggle theme={theme} toggle={toggle} c={c} />

      {/* ── HERO ── */}
      <section
        id="main-content"
        className={`relative min-h-[70vh] flex flex-col justify-end px-6 md:px-16 pb-16 pt-28 border-b overflow-hidden ${tr}`}
        style={{ borderColor: c.border, background: theme === 'dark' ? brand.bg : c.bg }}
        aria-label="Noise Experiment — project hero"
      >
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 20% 60%, ${brand.glow} 0%, transparent 65%)` }}
          aria-hidden="true" />

        {/* Decorative waveform — visual nod to sound/noise */}
        <div className="absolute right-8 md:right-20 top-24 md:top-20 pointer-events-none opacity-20 z-0" aria-hidden="true">
          {Array.from({ length: 28 }).map((_, i) => {
            const h = 8 + Math.abs(Math.sin(i * 0.7 + 1.2) * 48 + Math.sin(i * 1.3) * 24)
            return (
              <span
                key={i}
                className="inline-block mx-[1.5px] rounded-full align-middle"
                style={{
                  width: '3px',
                  height: `${h}px`,
                  background: i % 3 === 0 ? brand.primary : `rgba(232,184,75,0.4)`,
                  verticalAlign: 'middle',
                }}
              />
            )
          })}
        </div>

        <div className="project-fade-in mb-8 relative z-10">
          <BackButton c={c} />
        </div>

        {/* Course label */}
        <p className="project-fade-in mb-4 relative z-10 text-[9px] uppercase font-mono tracking-[0.3em]"
          style={{ color: brand.primary }}>
          HTI.350 Experimental Research · Tampere University
        </p>

        <div className="overflow-hidden mb-2 relative z-10">
          <div className="project-hero-title flex flex-wrap" aria-hidden="true">
            {'NOISE'.split('').map((char, i) => (
              <span key={i} className="inline-block text-[18vw] md:text-[11vw] font-black uppercase leading-[0.85] tracking-tighter"
                style={{ color: brand.primary }}>{char}</span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden mb-2 relative z-10">
          <div className="project-hero-title flex flex-wrap" aria-hidden="true">
            {'&'.split('').map((char, i) => (
              <span key={i} className="inline-block text-[18vw] md:text-[11vw] font-black uppercase leading-[0.85] tracking-tighter"
                style={{ color: c.text }}>{char}</span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden mb-8 relative z-10">
          <div className="project-hero-title flex flex-wrap" aria-hidden="true">
            {'REACTION'.split('').map((char, i) => (
              <span key={i} className="inline-block text-[10vw] md:text-[6vw] font-black uppercase leading-[0.9] tracking-tighter"
                style={{ color: c.text }}>{char}</span>
            ))}
          </div>
        </div>

        <p className="project-fade-in font-mono text-sm max-w-xl leading-relaxed mb-6 relative z-10"
          style={{ color: c.textMuted }}>
          Does environmental noise affect how fast people react? We designed and ran a controlled
          experiment to find out — and the answer was more nuanced than we expected.
        </p>
        <div className="project-fade-in flex flex-wrap gap-2 relative z-10">
          {['Experimental Research', 'ANOVA', 'E-Prime', 'User Study', 'Data Analysis', 'SPSS'].map(tag => (
            <Tag key={tag} label={tag} c={c} />
          ))}
        </div>
      </section>

      {/* ── META ── */}
      <section className={`grid grid-cols-2 md:grid-cols-4 border-b ${tr}`} style={{ borderColor: c.border }}>
        {[
          { label: 'Role',       value: 'Researcher (Co-author)' },
          { label: 'Course',     value: 'HTI.350 Experimental Research' },
          { label: 'Team',       value: 'Dilara Albayrak, Heejin Kang, Garv Malik' },
          { label: 'Type',       value: 'Academic Research Study' },
        ].map((s, i) => (
          <div key={s.label} className={`px-6 md:px-12 ${tr} ${i < 3 ? 'border-r' : ''}`}
            style={{ borderColor: c.border }}>
            <Stat label={s.label} value={s.value} c={c} />
          </div>
        ))}
      </section>

      <div className="px-6 md:px-16 py-20 max-w-7xl mx-auto space-y-28">

        {/* ── KEY FINDINGS FIRST ── */}
        <div className="section-block">
          <SectionHeading num="00" title="Key Findings" c={c} />
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {[
              {
                stat: 'p = .687',
                label: 'No significant effect on reaction time',
                desc: 'Environmental noise did not produce a statistically significant effect on raw reaction time across silent, moderate, and loud conditions.',
              },
              {
                stat: '6 ms',
                label: 'Largest RT difference across conditions',
                desc: 'Silent (563ms) vs. loud (569ms) — a difference too small to perceive, equivalent to the blink of an eye.',
              },
              {
                stat: 'p = .020',
                label: 'Noise DID affect self-reported focus',
                desc: 'Participants reported significantly better focus in silence than in loud conditions — even though their actual performance was the same.',
              },
            ].map((f, i) => (
              <Card key={i} c={c} accentBorder={brand.primary}>
                <p className="text-2xl font-black mb-1" style={{ color: brand.primary }}>{f.stat}</p>
                <p className="text-[10px] uppercase font-mono tracking-widest mb-3" style={{ color: c.text }}>{f.label}</p>
                <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>{f.desc}</p>
              </Card>
            ))}
          </div>

          {/* The interesting tension — the key UX insight */}
          <div className="border-l-2 pl-6 py-2" style={{ borderColor: brand.primary }}>
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.text }}>
              The most interesting finding: noise didn't slow people down, but it made them
              <em> feel</em> like they were performing worse. This gap between objective performance
              and subjective experience is a core challenge in interaction design.
            </p>
          </div>
        </div>

        {/* ── RESEARCH QUESTION ── */}
        <div className="section-block">
          <SectionHeading num="01" title="The Question" c={c} />
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="text-xl md:text-2xl font-black uppercase leading-tight tracking-tight mb-5"
                style={{ color: c.text }}>
                Over 20% of Europeans are exposed to unhealthy noise levels. Does it actually slow them down?
              </p>
              <blockquote className="border-l-2 pl-4 mt-6" style={{ borderColor: brand.primary }}>
                <p className="font-mono text-sm italic" style={{ color: c.textMuted }}>
                  "Noise affects performance and human error in relation to impairment in perception,
                  memory, and attention processes." — Smith, 1991
                </p>
              </blockquote>
            </div>
            <div className="space-y-4">
              <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
                Environmental noise is a documented health risk — linked to sleep disturbances,
                cognitive impairment, and cardiovascular disorders. But its effect on simple
                interaction tasks had not been clearly established.
              </p>
              <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
                Our hypothesis: exposure to high noise levels would lead to slower reaction times
                compared to silent conditions. We tested this with a controlled button-clicking task
                across three noise levels.
              </p>
            </div>
          </div>
        </div>

        {/* ── EXPERIMENTAL DESIGN ── */}
        <div className="section-block">
          <SectionHeading num="02" title="Experimental Design" c={c} />
          <p className="font-mono text-sm leading-relaxed max-w-2xl mb-8" style={{ color: c.textMuted }}>
            Within-subject design with noise level as the independent variable. Each participant
            completed all three conditions, reducing individual variation as a confounding factor.
          </p>

          {/* Design variables */}
          <div className="grid md:grid-cols-2 gap-5 mb-8">
            <Card c={c} accentBorder={brand.primary}>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] mb-4" style={{ color: brand.primary }}>Independent Variable</p>
              <p className="font-bold mb-2" style={{ color: c.text }}>Environmental Noise Level</p>
              <div className="space-y-2">
                {[
                  { cond: 'Silent',   range: '< 40 dB',    desc: 'Noise-cancelling headphones only' },
                  { cond: 'Moderate', range: '40 – 60 dB', desc: 'Traffic noise audio' },
                  { cond: 'Loud',     range: '60 – 80 dB', desc: 'Traffic noise audio, higher volume' },
                ].map(({ cond, range, desc }) => (
                  <div key={cond} className="flex items-start gap-3">
                    <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: brand.primary }} />
                    <p className="font-mono text-xs" style={{ color: c.textMuted }}>
                      <span style={{ color: c.text }}>{cond}</span> ({range}) — {desc}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
            <Card c={c} accentBorder={brand.secondary}>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] mb-4" style={{ color: brand.secondary }}>Dependent Variable</p>
              <p className="font-bold mb-2" style={{ color: c.text }}>Reaction Time (ms)</p>
              <p className="font-mono text-xs leading-relaxed mb-4" style={{ color: c.textMuted }}>
                Measured in milliseconds using E-Prime software and the Chronos response device.
                Numbers 1–5 appeared on screen; participants pressed the corresponding button
                as fast and accurately as possible.
              </p>
              <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>
                30 trials per condition · 90 total · Latin square counterbalancing
              </p>
            </Card>
          </div>

          {/* Apparatus */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: 'E-Prime 3.0',    desc: 'Stimulus presentation and reaction time recording with millisecond accuracy' },
              { name: 'Chronos Device', desc: '5-button response device — records button presses with ms precision' },
              { name: 'Sony WH-1000XM5', desc: 'Noise-cancelling headphones for controlled noise delivery' },
            ].map(a => (
              <Card key={a.name} c={c}>
                <p className="text-[9px] uppercase font-mono tracking-widest mb-2" style={{ color: brand.primary }}>{a.name}</p>
                <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>{a.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* ── PARTICIPANTS ── */}
        <div className="section-block">
          <SectionHeading num="03" title="Participants" c={c} />
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { stat: '8',          label: 'Total participants' },
              { stat: '21–29',      label: 'Age range' },
              { stat: '25.5 yrs',   label: 'Mean age' },
              { stat: '7 / 1',      label: 'Right / left-handed' },
            ].map(({ stat, label }) => (
              <Card key={label} c={c}>
                <p className="text-3xl font-black mb-1" style={{ color: brand.primary }}>{stat}</p>
                <p className="font-mono text-xs uppercase tracking-widest" style={{ color: c.textMuted }}>{label}</p>
              </Card>
            ))}
          </div>
          <p className="font-mono text-xs leading-relaxed mt-5 max-w-2xl" style={{ color: c.textMuted }}>
            Inclusion criteria: normal hearing, normal or corrected-to-normal vision, no discomfort
            with loud sounds, normal hand mobility. Signed informed consent obtained from all
            participants. Order of noise conditions counterbalanced using a Latin square design.
          </p>
        </div>

        {/* ── PROCEDURE ── */}
        <div className="section-block">
          <SectionHeading num="04" title="Procedure" c={c} />
          <div className="space-y-8">
            {[
              {
                step: '01 — Briefing & Consent',
                body: 'Participants were informed about the experiment, given the opportunity to ask questions, and provided signed informed consent. Background forms collected age, gender, dominant hand, and prerequisite checks.',
              },
              {
                step: '02 — Practice Trial',
                body: '10 familiarisation trials in the silent condition before the actual experiment began. This ensured participants understood the button-number mapping and were comfortable with the device.',
              },
              {
                step: '03 — Experimental Trials',
                body: '90 trials total — 30 per noise condition. Conditions were presented in counterbalanced order. 1–2 minute breaks between each condition. Total duration approximately 20 minutes.',
              },
              {
                step: '04 — Post-experiment Questionnaire',
                body: '5-item Likert-scale questionnaire after each condition. Items covered ability to focus, mental distraction, difficulty concentrating, perceived performance, and perceived reaction time speed.',
              },
            ].map(p => (
              <ProcessStep key={p.step} step={p.step} body={p.body} c={c} accentBorder={brand.primary} />
            ))}
          </div>
        </div>

        {/* ── RESULTS ── */}
        <div className="section-block">
          <SectionHeading num="05" title="Results" c={c} />

          {/* Reaction time bar chart — built with divs */}
          <div className="mb-10">
            <p className="text-[9px] uppercase font-mono tracking-[0.3em] mb-6" style={{ color: brand.primary }}>
              Mean Reaction Time by Noise Condition
            </p>
            <div className="flex items-end gap-6 md:gap-12 h-48 mb-3">
              {[
                { label: 'Silent',   ms: 563, pct: 85 },
                { label: 'Moderate', ms: 591, pct: 95 },
                { label: 'Loud',     ms: 569, pct: 87 },
              ].map(({ label, ms, pct }) => (
                <div key={label} className="flex flex-col items-center gap-2 flex-1">
                  <p className="font-mono text-xs font-bold" style={{ color: brand.primary }}>{ms} ms</p>
                  <div
                    className="w-full rounded-t-sm transition-all duration-500"
                    style={{
                      height: `${pct}%`,
                      background: `linear-gradient(to top, ${brand.primary}, rgba(232,184,75,0.5))`,
                    }}
                  />
                  <p className="font-mono text-[9px] uppercase tracking-widest text-center" style={{ color: c.textMuted }}>{label}</p>
                </div>
              ))}
            </div>
            <p className="font-mono text-xs" style={{ color: c.textFaint }}>
              χ²(2) = 0.75, p = .687 — no statistically significant effect of noise on reaction time
            </p>
          </div>

          {/* Statistical findings */}
          <div className="grid md:grid-cols-2 gap-5">
            <Card c={c} accentBorder={brand.primary}>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] mb-4" style={{ color: brand.primary }}>Reaction Time — Objective</p>
              <div className="space-y-3">
                {[
                  { test: 'Friedman test', result: 'χ²(2) = 0.75, p = .687', sig: false },
                  { test: 'Silent vs Moderate', result: 'Z = -1.68, p = .093', sig: false },
                  { test: 'Moderate vs Loud', result: 'Z = -.560, p = .575', sig: false },
                  { test: 'Silent vs Loud', result: 'Z = -.560, p = .575', sig: false },
                ].map(({ test, result, sig }) => (
                  <div key={test} className="flex justify-between items-center border-b pb-2" style={{ borderColor: c.border }}>
                    <p className="font-mono text-xs" style={{ color: c.textMuted }}>{test}</p>
                    <p className="font-mono text-xs" style={{ color: sig ? brand.primary : c.textFaint }}>{result}</p>
                  </div>
                ))}
              </div>
              <p className="font-mono text-xs mt-4 italic" style={{ color: c.textFaint }}>
                Bonferroni-corrected Wilcoxon signed-rank tests, threshold p &lt; .017
              </p>
            </Card>

            <Card c={c} accentBorder={brand.secondary}>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] mb-4" style={{ color: brand.secondary }}>Subjective Focus — Self-reported</p>
              <div className="space-y-3">
                {[
                  { measure: 'Ability to focus', result: 'F(2,14) = 5.25, p = .020 *', sig: true },
                  { measure: 'Silent vs Loud (focus)', result: 'p = .044 *', sig: true },
                  { measure: 'Mental distraction', result: 'F(2,14) = 1.78, p = .206', sig: false },
                  { measure: 'Hard to concentrate', result: 'F(2,14) = 2.12, p = .158', sig: false },
                  { measure: 'Perceived performance', result: 'F(1.11,7.77) = 0.54, p = .503', sig: false },
                ].map(({ measure, result, sig }) => (
                  <div key={measure} className="flex justify-between items-center border-b pb-2" style={{ borderColor: c.border }}>
                    <p className="font-mono text-xs" style={{ color: c.textMuted }}>{measure}</p>
                    <p className="font-mono text-xs" style={{ color: sig ? brand.secondary : c.textFaint }}>{result}</p>
                  </div>
                ))}
              </div>
              <p className="font-mono text-xs mt-4 italic" style={{ color: c.textFaint }}>
                * Statistically significant. Greenhouse-Geisser correction applied where sphericity violated.
              </p>
            </Card>
          </div>
        </div>

        {/* ── DISCUSSION ── */}
        <div className="section-block">
          <SectionHeading num="06" title="Discussion & UX Implications" c={c} />
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
                The null result on reaction time makes sense in hindsight. The task was cognitively
                simple — press a button matching a number. Tasks with low cognitive demand may not
                be sufficiently challenging for noise to produce a measurable effect. This aligns
                with Smith (1991), who noted noise primarily impairs memory and attention, not
                simple motor responses.
              </p>
              <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
                The more interesting finding is the subjective one. Participants felt significantly
                less focused in loud conditions — even though their actual performance was
                statistically identical. This is a classic example of the gap between perceived
                and actual usability.
              </p>
            </div>
            <div className="space-y-4">
              <div className="border-l-2 pl-5" style={{ borderColor: brand.primary }}>
                <p className="font-mono text-sm font-bold mb-2" style={{ color: c.text }}>
                  UX Insight: perceived usability ≠ measured usability
                </p>
                <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  If we only measured task performance, we'd conclude noise doesn't matter.
                  But users feeling worse — even if they perform the same — is a real UX
                  problem. It affects trust, satisfaction, and willingness to use a product again.
                  This is exactly why subjective measures like SUS belong alongside performance metrics.
                </p>
              </div>
              <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>
                <strong style={{ color: c.text }}>Limitation:</strong> N=8 is small, limiting statistical power
                and generalisability. A larger sample might reveal effects that were
                underpowered here.
              </p>
            </div>
          </div>
        </div>

        {/* ── MY CONTRIBUTION ── */}
        <div className="section-block">
          <SectionHeading num="07" title="My Contribution" c={c} />
          <div className="grid md:grid-cols-2 gap-5">
            <Card c={c} accentBorder={brand.primary}>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] mb-4" style={{ color: brand.primary }}>What I Did (33% contribution)</p>
              <div className="space-y-2">
                {[
                  'Research plan writing and study design',
                  'Documentation and consent form preparation',
                  'Experimental setup and apparatus configuration',
                  'Participant recruitment',
                  'Data collection (running sessions)',
                  'Statistical analysis in SPSS',
                  'Report writing and proof reading',
                ].map(item => (
                  <div key={item} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: brand.primary }} />
                    <p className="font-mono text-xs" style={{ color: c.textMuted }}>{item}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card c={c}>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] mb-4" style={{ color: brand.primary }}>What I Learned</p>
              <div className="space-y-3">
                <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  Running a controlled experiment from scratch — ethics documentation, Latin square
                  counterbalancing, E-Prime scripting, SPSS analysis — gave me a rigorous
                  understanding of what makes research valid and what makes it fragile.
                </p>
                <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  The null result was the most educational outcome. It forced us to think about
                  effect size, statistical power, and whether our task was sensitive enough to
                  detect the phenomenon we were measuring. Most real research looks like this.
                </p>
                <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  And the subjective/objective gap reinforced something I now apply to every
                  UX project: always measure both what users do and how they feel about it.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* ── REFLECTION ── */}
        <div className="section-block border-t pt-14" style={{ borderColor: c.border }}>
          <SectionHeading num="08" title="Reflection" c={c} />
          <div className="max-w-2xl space-y-4">
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
              This project sits outside my typical design work, and that's exactly why it matters.
              Most UX designers can run a usability test — fewer can design a controlled experiment,
              handle counterbalancing, apply non-parametric statistics, and interpret a null result correctly.
            </p>
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
              The finding that noise didn't affect objective performance but did affect subjective
              experience is something I now carry into every project. Users' feelings about their
              experience are as real as their measured performance — and sometimes more important
              for product decisions.
            </p>
          </div>
        </div>

        <ProjectNav
          prev={{ label: 'PlayPal', href: '/projects/playpal' }}
          next={{ label: 'Talos Care', href: '/projects/talos' }}
          c={c}
        />
      </div>
    </main>
  )
}
