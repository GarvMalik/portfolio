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

const BRAND = {
  primary:   '#8B5CF6',   // violet — neuro/brain
  secondary: '#10B981',   // emerald — accuracy/success
  bg:        '#08060f',
  glow:      'rgba(139,92,246,0.12)',
}

// Accuracy results for all models
const ML_RESULTS = [
  { name: 'Extra Trees',        acc: 75,   color: 'rgba(139,92,246,0.3)'  },
  { name: 'Random Forest',      acc: 81,   color: 'rgba(139,92,246,0.4)'  },
  { name: 'AdaBoost',           acc: 90,   color: 'rgba(139,92,246,0.55)' },
  { name: 'Logistic Regression',acc: 91,   color: 'rgba(139,92,246,0.62)' },
  { name: 'Gradient Boosting',  acc: 95,   color: 'rgba(139,92,246,0.72)' },
  { name: 'XGBoost',            acc: 97.8, color: 'rgba(139,92,246,0.88)' },
  { name: 'LightGBM',           acc: 98.5, color: '#8B5CF6'               },
]

export default function EEGADHDPage() {
  const container = useRef<HTMLDivElement>(null)
  const { theme, toggle } = useTheme()
  const c = T[theme]
  const tr = 'transition-colors duration-300'

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
      <SiteNav c={c} projectName="EEG ADHD" />
      <ThemeToggle theme={theme} toggle={toggle} c={c} />

      {/* ── HERO ── */}
      <section
        id="main-content"
        className={`relative min-h-[70vh] flex flex-col justify-end px-6 md:px-16 pb-16 pt-28 border-b overflow-hidden ${tr}`}
        style={{ borderColor: c.border, background: theme === 'dark' ? BRAND.bg : c.bg }}
        aria-label="EEG ADHD Classification — project hero"
      >
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 18% 55%, ${BRAND.glow} 0%, transparent 65%)` }}
          aria-hidden="true" />

        {/* Decorative EEG waveform — top right */}
        <svg
          className="absolute right-6 md:right-16 top-20 md:top-24 pointer-events-none opacity-25 z-0"
          width="320" height="80" viewBox="0 0 320 80"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <polyline
            points="0,40 30,40 50,40 68,16 84,64 98,28 112,46 130,40 160,40 180,40 198,40 216,15 232,65 248,26 262,44 280,40 320,40"
            stroke={BRAND.primary} strokeWidth="2.5" fill="none"
            strokeLinejoin="round" strokeLinecap="round"
          />
          <polyline
            points="0,40 30,40 50,40 68,28 80,52 90,34 100,42 110,40 130,40"
            stroke="rgba(16,185,129,0.5)" strokeWidth="1.2" fill="none"
            strokeLinejoin="round" strokeLinecap="round"
          />
          <circle cx="84" cy="64" r="3" fill={BRAND.secondary} opacity="0.8" />
        </svg>

        <div className="project-fade-in mb-8 relative z-10">
          <BackButton c={c} />
        </div>

        <p className="project-fade-in mb-4 relative z-10 text-[9px] uppercase font-mono tracking-[0.3em]"
          style={{ color: BRAND.primary }}>
          B.Tech Final Thesis · BML Munjal University · 2024
        </p>

        <div className="overflow-hidden mb-1 relative z-10">
          <div className="project-hero-title flex flex-wrap" aria-hidden="true">
            {'EEG'.split('').map((char, i) => (
              <span key={i} className="inline-block text-[22vw] md:text-[14vw] font-black uppercase leading-[0.85] tracking-tighter"
                style={{ color: BRAND.primary }}>{char}</span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden mb-1 relative z-10">
          <div className="project-hero-title flex flex-wrap" aria-hidden="true">
            {'ADHD'.split('').map((char, i) => (
              <span key={i} className="inline-block text-[14vw] md:text-[9vw] font-black uppercase leading-[0.88] tracking-tighter"
                style={{ color: c.text }}>{char}</span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden mb-8 relative z-10">
          <div className="project-hero-title flex flex-wrap" aria-hidden="true">
            {'CLASSIFICATION'.split('').map((char, i) => (
              <span key={i} className="inline-block text-[6.5vw] md:text-[4vw] font-black uppercase leading-[0.9] tracking-tighter"
                style={{ color: c.text }}>{char}</span>
            ))}
          </div>
        </div>

        <p className="project-fade-in font-mono text-sm max-w-xl leading-relaxed mb-6 relative z-10"
          style={{ color: c.textMuted }}>
          Can a machine read a child's brainwaves and detect ADHD? We built a CNN and tested seven
          ML models against 19-channel EEG from 121 children — reaching 98.53% accuracy.
        </p>

        <div className="project-fade-in flex flex-wrap gap-3 mb-6 relative z-10">
          {['Machine Learning', 'Deep Learning', 'EEG Signal Processing', 'CNN', 'Python', 'ADHD Research'].map(tag => (
            <Tag key={tag} label={tag} c={c} />
          ))}
        </div>

        {/* PDF download */}
        <div className="project-fade-in relative z-10">
          <a
            href="/garv-malik-thesis-eeg-adhd.pdf"
            download
            className="inline-flex items-center gap-3 px-5 py-2.5 border text-[10px] font-mono uppercase tracking-[0.2em] hover:border-[#8B5CF6] hover:text-[#8B5CF6] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B5CF6] rounded-sm"
            style={{ borderColor: c.border, color: c.textMuted }}
            aria-label="Download B.Tech thesis PDF"
          >
            Download Full Thesis ↓
          </a>
        </div>
      </section>

      {/* ── META ── */}
      <section className={`grid grid-cols-2 md:grid-cols-4 border-b ${tr}`} style={{ borderColor: c.border }}>
        {[
          { label: 'Role',       value: 'Sole Researcher & Author' },
          { label: 'Supervisor', value: 'Dr. Devanjali Relan, BML Munjal University' },
          { label: 'Period',     value: 'March – July 2024' },
          { label: 'Type',       value: 'B.Tech Final Thesis (CS)' },
        ].map((s, i) => (
          <div key={s.label} className={`px-6 md:px-12 ${tr} ${i < 3 ? 'border-r' : ''}`}
            style={{ borderColor: c.border }}>
            <Stat label={s.label} value={s.value} c={c} />
          </div>
        ))}
      </section>

      <div className="px-6 md:px-16 py-20 max-w-7xl mx-auto space-y-28">

        {/* ── KEY RESULTS ── */}
        <div className="section-block">
          <SectionHeading num="00" title="Key Results" c={c} />
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {[
              {
                stat: '98.53%',
                label: 'CNN accuracy at 3000 epochs',
                desc: '5-block CNN with batch normalisation, LeakyReLU, max-pooling, and dropout layers. Validated with 10-fold cross-validation on 19-channel EEG data.',
              },
              {
                stat: '98.5%',
                label: 'LightGBM — best traditional ML',
                desc: 'Gradient boosting on 13 extracted time-domain features with StandardScaler preprocessing. Outperformed 6 other classifiers including XGBoost (97.8%) and Random Forest (81%).',
              },
              {
                stat: '121',
                label: 'Children in the dataset',
                desc: '61 diagnosed with ADHD, 60 controls. Ages 7–12. EEG recorded at 128 Hz across 19 channels during a visual attention task designed specifically for children.',
              },
            ].map((f, i) => (
              <Card key={i} c={c} accentBorder={BRAND.primary}>
                <p className="text-2xl font-black mb-1" style={{ color: BRAND.primary }}>{f.stat}</p>
                <p className="text-[10px] uppercase font-mono tracking-widest mb-3" style={{ color: c.text }}>{f.label}</p>
                <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>{f.desc}</p>
              </Card>
            ))}
          </div>

          <div className="border-l-2 pl-6 py-2" style={{ borderColor: BRAND.primary }}>
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.text }}>
              The CNN's advantage came from automatic hierarchical feature extraction — it learned
              spatial and temporal patterns directly from raw EEG without hand-engineering features,
              matching what gradient boosting needed 13 manually extracted features to achieve.
            </p>
          </div>
        </div>

        {/* ── PROBLEM ── */}
        <div className="section-block">
          <SectionHeading num="01" title="The Problem" c={c} />
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="text-xl md:text-2xl font-black uppercase leading-tight tracking-tight mb-5"
                style={{ color: c.text }}>
                ADHD affects millions of children. Diagnosis today still relies on subjective behavioural checklists.
              </p>
              <blockquote className="border-l-2 pl-4 mt-6" style={{ borderColor: BRAND.primary }}>
                <p className="font-mono text-sm italic" style={{ color: c.textMuted }}>
                  "Early detection is very important for effective intervention — EEG signals
                  offer a great way to objectively classify ADHD based on characteristic brain wave patterns."
                </p>
              </blockquote>
            </div>
            <div className="space-y-4">
              <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
                Attention Deficit Hyperactivity Disorder is a prevalent neurodevelopmental condition
                that primarily impacts children and can persist into adulthood. It affects learning,
                social interaction, and quality of life — yet accurate early diagnosis remains
                challenging due to its reliance on clinician observation and parent/teacher reports.
              </p>
              <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
                Electroencephalography (EEG) captures brain electrical activity non-invasively.
                Prior research showed ADHD produces distinct brainwave signatures — the goal of
                this thesis was to automate that detection with machine learning.
              </p>
            </div>
          </div>
        </div>

        {/* ── DATASET ── */}
        <div className="section-block">
          <SectionHeading num="02" title="Dataset" c={c} />
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[
              { stat: '121',   label: 'Children total' },
              { stat: '61/60', label: 'ADHD / Control' },
              { stat: '7–12',  label: 'Age range (years)' },
              { stat: '19',    label: 'EEG channels' },
            ].map(({ stat, label }) => (
              <Card key={label} c={c}>
                <p className="text-3xl font-black mb-1" style={{ color: BRAND.primary }}>{stat}</p>
                <p className="font-mono text-xs uppercase tracking-widest" style={{ color: c.textMuted }}>{label}</p>
              </Card>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <Card c={c} accentBorder={BRAND.primary}>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] mb-3" style={{ color: BRAND.primary }}>EEG Setup</p>
              <div className="space-y-2">
                {[
                  'Sampling rate: 128 Hz',
                  '19 channels: Fz, Cz, Pz, C3, T3, C4, T4, Fp1, Fp2, F3, F4, F7, F8, P3, P4, T5, T6, O1, O2',
                  'Standard 10-20 electrode placement system',
                  'ADHD diagnoses by psychiatrists via DSM-5 criteria',
                ].map(item => (
                  <div key={item} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: BRAND.primary }} />
                    <p className="font-mono text-xs" style={{ color: c.textMuted }}>{item}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card c={c} accentBorder={BRAND.secondary}>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] mb-3" style={{ color: BRAND.secondary }}>Recording Task</p>
              <p className="font-mono text-xs leading-relaxed mb-3" style={{ color: c.textMuted }}>
                Children viewed images of cartoon characters and counted them (5–16 per image).
                After each response, the image was immediately replaced — maintaining constant
                visual attention stimulation throughout the recording.
              </p>
              <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>
                Recording duration varied per child based on performance. Gender-balanced:
                98 boys (48 ADHD, 50 control), 23 girls (13 ADHD, 10 control).
              </p>
            </Card>
          </div>
        </div>

        {/* ── PIPELINE ── */}
        <div className="section-block">
          <SectionHeading num="03" title="ML Pipeline" c={c} />
          <div className="space-y-8">
            {[
              {
                step: '01 — Signal Preprocessing',
                body: 'Raw EEG files loaded from ADHD and control folders. Unnecessary columns stripped, channel names assigned to 10-20 standard placement. MNE library used to construct RawArray objects at 128 Hz. Continuous recordings segmented into 6-second epochs for analysis.',
              },
              {
                step: '02 — Feature Extraction',
                body: '13 time-domain statistical features computed per channel per segment: mean, standard deviation, variance, peak-to-peak, min, max, arg-min, arg-max, RMS, absolute difference, skewness, kurtosis. Each EEG segment became a 1D feature vector for the ML models.',
              },
              {
                step: '03 — Traditional ML Evaluation',
                body: '7 classifiers evaluated with 6 preprocessing scalers each: MinMaxScaler, StandardScaler, MaxAbsScaler, PowerTransformer, QuantileTransformer, Normalizer. 80/20 train-test split with 10-fold cross-validation. Models: Extra Trees, Random Forest, XGBoost, LightGBM, Gradient Boosting, AdaBoost, Logistic Regression.',
              },
              {
                step: '04 — CNN Model',
                body: '5-block CNN trained directly on raw EEG (no manual features needed). Each block: Conv1D(5 filters, kernel=3) → BatchNorm → LeakyReLU → MaxPool1D(pool=2) → Dropout(0.4). Followed by Dense(48) → Dense(32) → Dense(1, sigmoid). Adam optimizer (lr=0.0003), binary cross-entropy loss. 10-fold CV.',
              },
            ].map(p => (
              <ProcessStep key={p.step} step={p.step} body={p.body} c={c} accentBorder={BRAND.primary} />
            ))}
          </div>
        </div>

        {/* ── MODEL COMPARISON ── */}
        <div className="section-block">
          <SectionHeading num="04" title="Model Comparison" c={c} />
          <p className="text-[9px] uppercase font-mono tracking-[0.3em] mb-6" style={{ color: BRAND.primary }}>
            Accuracy by classifier
          </p>
          <div className="space-y-3 mb-8">
            {ML_RESULTS.map(({ name, acc, color }) => (
              <div key={name} className="flex items-center gap-4">
                <span className="font-mono text-[10px] uppercase tracking-wide w-40 flex-shrink-0 text-right"
                  style={{ color: c.textMuted }}>{name}</span>
                <div className="flex-1 h-7 rounded-sm overflow-hidden" style={{ background: c.border }}>
                  <div
                    className="h-full flex items-center px-3 rounded-sm"
                    style={{ width: `${acc}%`, background: color }}
                  >
                    <span className="font-mono text-[10px] font-bold whitespace-nowrap"
                      style={{ color: acc > 95 ? '#fff' : 'rgba(255,255,255,0.7)' }}>
                      {acc}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <Card c={c} accentBorder={BRAND.primary}>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] mb-3" style={{ color: BRAND.primary }}>CNN vs Best ML</p>
              <div className="space-y-3">
                {[
                  { label: 'CNN (3000 epochs)',     val: '98.53%', highlight: true  },
                  { label: 'LightGBM + StandardScaler', val: '98.5%', highlight: true },
                  { label: 'XGBoost',              val: '97.8%', highlight: false },
                  { label: 'CNN (50 epochs only)', val: '78.76%', highlight: false },
                ].map(({ label, val, highlight }) => (
                  <div key={label} className="flex justify-between items-center border-b pb-2" style={{ borderColor: c.border }}>
                    <p className="font-mono text-xs" style={{ color: c.textMuted }}>{label}</p>
                    <p className="font-mono text-xs font-bold" style={{ color: highlight ? BRAND.primary : c.textFaint }}>{val}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card c={c} accentBorder={BRAND.secondary}>
              <p className="text-[9px] uppercase font-mono tracking-[0.3em] mb-3" style={{ color: BRAND.secondary }}>CNN Epochs vs Accuracy</p>
              <div className="space-y-3">
                {[
                  { epochs: '50',   acc: '78.76%' },
                  { epochs: '200',  acc: '~88%'   },
                  { epochs: '500',  acc: '~93%'   },
                  { epochs: '1000', acc: '~96%'   },
                  { epochs: '3000', acc: '98.53%' },
                ].map(({ epochs, acc }) => (
                  <div key={epochs} className="flex justify-between items-center border-b pb-2" style={{ borderColor: c.border }}>
                    <p className="font-mono text-xs" style={{ color: c.textMuted }}>{epochs} epochs</p>
                    <p className="font-mono text-xs font-bold" style={{ color: BRAND.secondary }}>{acc}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* ── CNN ARCHITECTURE ── */}
        <div className="section-block">
          <SectionHeading num="05" title="CNN Architecture" c={c} />
          <p className="font-mono text-sm leading-relaxed max-w-2xl mb-8" style={{ color: c.textMuted }}>
            A 5-block convolutional architecture designed to extract hierarchical temporal and
            spatial features from raw EEG signals without manual feature engineering.
          </p>
          <div className="flex flex-col md:flex-row gap-3 mb-8 items-stretch">
            {[
              { label: 'Input', detail: '19-ch EEG\nsegments' },
              { label: '×5 Conv Block', detail: 'Conv1D → BatchNorm\nLeakyReLU → MaxPool\nDropout(0.4)' },
              { label: 'Flatten', detail: '3D → 1D\nvector' },
              { label: 'Dense', detail: '48 units\n32 units\nReLU + Dropout' },
              { label: 'Output', detail: '1 unit\nSigmoid\nADHD / Control' },
            ].map((layer, i) => (
              <div key={layer.label} className="flex md:flex-col items-center gap-2 flex-1">
                <div className="w-full flex-1 border p-3 rounded-sm text-center"
                  style={{ borderColor: i === 1 ? BRAND.primary : c.border, background: i === 4 ? `${BRAND.primary}18` : c.cardBg }}>
                  <p className="font-mono text-[9px] uppercase tracking-widest mb-1"
                    style={{ color: i === 1 ? BRAND.primary : c.textFaint }}>{layer.label}</p>
                  <p className="font-mono text-[9px] leading-relaxed whitespace-pre-line"
                    style={{ color: c.textMuted }}>{layer.detail}</p>
                </div>
                {i < 4 && <span className="text-[#8B5CF6] text-sm hidden md:block" aria-hidden="true">→</span>}
              </div>
            ))}
          </div>
          <Card c={c}>
            <p className="text-[9px] uppercase font-mono tracking-[0.3em] mb-3" style={{ color: BRAND.primary }}>Training Configuration</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { k: 'Optimizer',    v: 'Adam' },
                { k: 'Learning rate', v: '0.0003' },
                { k: 'Loss',         v: 'Binary cross-entropy' },
                { k: 'Validation',   v: '10-fold CV' },
              ].map(({ k, v }) => (
                <div key={k}>
                  <p className="font-mono text-[8px] uppercase tracking-widest mb-1" style={{ color: c.textFaint }}>{k}</p>
                  <p className="font-mono text-xs" style={{ color: c.text }}>{v}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── REFLECTION ── */}
        <div className="section-block">
          <SectionHeading num="06" title="What I Learned" c={c} />
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
                This thesis was done before I pivoted to UX — but the research mindset it built
                has been inseparable from my design work ever since. Running a full ML pipeline
                from raw signal data to validated model taught me what it actually means to work
                with evidence.
              </p>
              <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>
                The most interesting tension was CNN vs gradient boosting. Both hit ~98.5%, but
                through completely different routes — one through hand-crafted features, the other
                through automatic representation learning. Watching a model learn better features
                than I could engineer manually was a turning point.
              </p>
            </div>
            <div className="space-y-4">
              <div className="border-l-2 pl-5" style={{ borderColor: BRAND.primary }}>
                <p className="font-mono text-sm font-bold mb-2" style={{ color: c.text }}>
                  Design connection
                </p>
                <p className="font-mono text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  ADHD affects how children interact with any interface — attention span, impulsivity,
                  response latency. Having studied it at a signal level makes me think differently
                  about accessible and neurodiverse-inclusive design. The quantitative rigor here
                  feeds directly into how I frame research questions in UX studies.
                </p>
              </div>
              <div className="space-y-2">
                {[
                  'Full ML pipeline: preprocessing → feature extraction → model selection',
                  'EEG signal analysis with MNE library',
                  'Cross-validation methodology and avoiding data leakage',
                  'Interpreting model performance beyond accuracy (overfitting, generalisation)',
                ].map(item => (
                  <div key={item} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: BRAND.primary }} />
                    <p className="font-mono text-xs" style={{ color: c.textMuted }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── DOWNLOAD ── */}
        <div className="section-block border rounded-sm p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{ borderColor: c.border }}>
          <div>
            <p className="text-[9px] uppercase font-mono tracking-[0.3em] mb-2" style={{ color: BRAND.primary }}>
              Full thesis document
            </p>
            <p className="font-mono text-sm" style={{ color: c.text }}>EEG-based ADHD Classification using Machine Learning</p>
            <p className="font-mono text-xs mt-1" style={{ color: c.textMuted }}>
              BML Munjal University · B.Tech Practice School III · July 2024 · 25 pages
            </p>
          </div>
          <a
            href="/garv-malik-thesis-eeg-adhd.pdf"
            download
            className="inline-flex items-center gap-3 px-5 py-3 border text-[10px] font-mono uppercase tracking-[0.2em] hover:border-[#8B5CF6] hover:text-[#8B5CF6] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B5CF6] rounded-sm flex-shrink-0"
            style={{ borderColor: c.border, color: c.textMuted }}
            aria-label="Download thesis PDF"
          >
            Download PDF ↓
          </a>
        </div>

        <ProjectNav
          prev={{ label: 'Talos Care', href: '/projects/talos' }}
          c={c}
        />
      </div>
    </main>
  )
}
