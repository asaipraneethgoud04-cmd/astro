import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Quote,
  ShieldCheck,
  Sparkles,
  Phone,
  ArrowRight,
  Lock,
  HeartHandshake,
  CheckCircle2,
  Calendar,
  Compass,
  HelpCircle,
  Award,
} from "lucide-react";
import ReviewForm from "./ReviewForm";

export const metadata: Metadata = {
  title: "Share Your Experience | TalkAstrologer - 30+ Years & 6 Generations of Vedic Guidance",
  description:
    "Share your consultation experience with Master Vijay Ji. Accepted reviews illuminate Voices of the Blessed across Texas and all 50 US states.",
};

const TRUST_PILLARS = [
  {
    icon: Star,
    title: "5.0 ★ Client Reverence",
    desc: "Over 1,200+ Seekers Guided",
  },
  {
    icon: Lock,
    title: "100% Privacy Shield",
    desc: "Optional Single-Initial Confidentiality",
  },
  {
    icon: Award,
    title: "30+ Years & 6 Generations",
    desc: "Bangalore Ancestral Lineage",
  },
  {
    icon: ShieldCheck,
    title: "Hand-Verified Sanctity",
    desc: "Authentic Reflections Only",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Rate Experience",
    desc: "Select 1 to 5 stars & sentiment",
  },
  {
    number: "02",
    title: "Choose Discipline",
    desc: "Horoscope, marriage, career, or remedies",
  },
  {
    number: "03",
    title: "Share Transformation",
    desc: "Pen your personal breakthrough & clarity",
  },
  {
    number: "04",
    title: "Live Preview",
    desc: "View card & top banner in real-time",
  },
];

const RECENT_REFLECTIONS = [
  {
    name: "Priya S.",
    city: "Dallas, Texas",
    service: "Love Marriage & Compatibility",
    format: "In-Person Consultation",
    quote:
      "Guruji accurately identified the planetary transition causing friction in our marriage. His suggested remedies and pooja brought harmony back into our home within weeks.",
  },
  {
    name: "Rajesh K.",
    city: "Austin, Texas",
    service: "Career, Education & Job Milestones",
    format: "Phone Consultation",
    quote:
      "After 11 months of career stagnation and visa anxiety, Guruji's horoscope reading pinpointed the exact month my breakthrough would arrive. Truly life-changing clarity and peace.",
  },
  {
    name: "Ananya M.",
    city: "San Jose, California",
    service: "Spiritual Healing & Remedies",
    format: "WhatsApp Video Consultation",
    quote:
      "No fear-mongering or commercial pressure. Just profound ancestral insight, patience, and compassion. You immediately feel a heavy weight lifted off your shoulders.",
  },
];

const FAQS = [
  {
    q: "How soon will my review appear on the website?",
    a: "All submissions are personally reviewed by our spiritual administration team within 24 to 48 hours to preserve the authentic sanctity and dignity of the community.",
  },
  {
    q: "Can I remain completely anonymous?",
    a: "Yes. Simply check the 'Privacy Shield Mode' switch in the form. Your review will appear publicly with only your first initial and city (e.g. 'P. · Dallas, TX') without disclosing your full identity.",
  },
  {
    q: "What details make a review most helpful for seekers?",
    a: "Mentioning the life challenge you faced, the consultation format (phone, WhatsApp, or in-person), and how Guruji's Vedic analysis or remedies brought peace of mind and turnaround.",
  },
  {
    q: "Can I modify or remove my reflection later?",
    a: "Yes, at any time. Simply contact our care team at support@talkastrologer.com or call +1 (214) 669-9699, and we will update or withdraw your reflection promptly.",
  },
];

export default function ReviewPage() {
  return (
    <div className="relative min-h-screen bg-[#faf6ee] text-[#2a1114] overflow-hidden page-top page-bottom">
      {/* ─────────────────────────────────────────────────────────────
          ATMOSPHERIC BACKGROUND ACCENTS
      ───────────────────────────────────────────────────────────── */}
      {/* Repeating Vedic sacred pattern with subtle watermark opacity */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[radial-gradient(#c59b27_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />

      {/* Top Ambient Gold & Burgundy Glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-[#d4af37]/15 to-transparent blur-3xl rounded-full"
        aria-hidden="true"
      />

      {/* Rotating Sacred Astrological Ring Watermark in the Top Center */}
      <div
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[620px] h-[620px] opacity-[0.05] animate-spin-slow select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/hero-ring-trimmed.png"
          alt=""
          fill
          sizes="620px"
          className="object-contain"
        />
      </div>

      <div className="site-container relative z-10">
        <div className="mx-auto max-w-6xl">
          {/* ─────────────────────────────────────────────────────────────
              1. GRAND HERO HEADER
          ───────────────────────────────────────────────────────────── */}
          <div className="text-center max-w-3xl mx-auto space-y-4 pt-4 sm:pt-6">
            {/* Top Sacred Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c59b27]/60 bg-[#fbf5e6] px-4 py-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#aa8016] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8c6708]">
                Sacred Seeker Reflections · Voices of the Blessed
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#aa8016] animate-pulse" />
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#38070e] tracking-tight leading-[1.15]">
              Share Your Consultation Journey
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg leading-relaxed text-[#614b4f] max-w-2xl mx-auto">
              Honoring 30+ years and 6 generations of ancestral Vedic Jyotish wisdom. Your authentic reflection lights the path for seekers navigating life&apos;s deepest crossroads across Texas and the United States.
            </p>

            {/* Central Ornate Divider */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <span className="w-16 h-px bg-gradient-to-r from-transparent to-[#c59b27]" />
              <span className="text-[#c59b27] text-xs">✦ ◆ ✦</span>
              <span className="w-16 h-px bg-gradient-to-l from-transparent to-[#c59b27]" />
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              2. 4 TRUST CREDENTIAL PILLARS
          ───────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-10">
            {TRUST_PILLARS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#ebdcc2] bg-white/80 backdrop-blur-xs p-3.5 sm:p-4 text-center shadow-xs transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#c59b27]/60"
                >
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#fdf8ed] border border-[#e5d0ad] text-[#8c6708] mb-2">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h2 className="text-xs sm:text-sm font-bold text-[#38070e]">
                    {item.title}
                  </h2>
                  <p className="text-[11px] text-[#7d6569] mt-0.5 font-medium">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ─────────────────────────────────────────────────────────────
              3. VISUAL 4-STEP SPIRITUAL GUIDANCE ROADMAP
          ───────────────────────────────────────────────────────────── */}
          <div className="mt-8 rounded-2xl border border-[#e5d0ad] bg-[#fdfbf7] p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#ebdcc2] pb-3 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#aa8016] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#aa8016]" />
                How Your Blessing Is Honored
              </span>
              <span className="text-[11px] text-[#8c7377] hidden sm:inline">
                Simple 4-Step Process
              </span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {STEPS.map((step) => (
                <div key={step.number} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#38070e] text-[10px] font-bold text-[#f6e27a]">
                      {step.number}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-[#38070e]">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#7d6569] leading-snug pl-7">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              4. THE MAIN REVIEW FORM & REAL-TIME PREVIEW
          ───────────────────────────────────────────────────────────── */}
          <div className="mt-10 sm:mt-12">
            <ReviewForm />
          </div>

          {/* ─────────────────────────────────────────────────────────────
              5. THE SANCTITY OF GENUINE CLIENT REFLECTIONS (3 PILLARS)
          ───────────────────────────────────────────────────────────── */}
          <div className="mt-20 pt-10 border-t border-[#e8dac2] space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#aa8016]">
                The Sanctity of Sacred Words
              </p>
              <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#38070e] tracking-tight">
                Why Every Seeker&apos;s Voice Matters
              </h2>
              <p className="text-sm text-[#614b4f] leading-relaxed">
                In Vedic Jyotish tradition, sharing genuine gratitude (Kritajnata) dispels hesitation and brings divine reassurance to others walking through trials.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="rounded-[24px] border border-[#ebdcc2] bg-white p-6 shadow-xs space-y-3 hover:border-[#c59b27] transition-all">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fbf5e6] border border-[#e5d0ad] text-[#8c6708]">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#38070e]">
                  A Beacon for Seekers in Turmoil
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-[#614b4f]">
                  Many contact Master Vijay Ji during sudden heartbreaks, divorce risks, or prolonged career roadblocks. Reading how another seeker found clarity gives them the courage to seek spiritual resolution.
                </p>
              </div>

              {/* Card 2 */}
              <div className="rounded-[24px] border border-[#ebdcc2] bg-white p-6 shadow-xs space-y-3 hover:border-[#c59b27] transition-all">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fbf5e6] border border-[#e5d0ad] text-[#8c6708]">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#38070e]">
                  Preserving Lineage Jyotish
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-[#614b4f]">
                  The online astrology realm is frequently marred by fear-mongering and false guarantees. Authentic client reflections validate our dedication to 30+ years of classical birth chart analysis and traditional remedies.
                </p>
              </div>

              {/* Card 3 */}
              <div className="rounded-[24px] border border-[#ebdcc2] bg-white p-6 shadow-xs space-y-3 hover:border-[#c59b27] transition-all">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fbf5e6] border border-[#e5d0ad] text-[#8c6708]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#38070e]">
                  Strict Seeker Confidentiality
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-[#614b4f]">
                  Your private life is safeguarded as a sacred trust. Phone numbers and email addresses are never disclosed publicly, and Privacy Shield mode keeps your full identity completely confidential.
                </p>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              6. RECENT VOICES OF THE BLESSED (COMMUNITY EXAMPLES)
          ───────────────────────────────────────────────────────────── */}
          <div className="mt-20 pt-10 border-t border-[#e8dac2] space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#aa8016]">
                  Community Benchmarks
                </p>
                <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#38070e] tracking-tight mt-1">
                  Recent Verified Reflections
                </h2>
              </div>
              <Link
                href="/#testimonials"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8b1827] hover:text-[#38070e] transition-colors"
              >
                <span>View All In Voices of the Blessed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {RECENT_REFLECTIONS.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-[26px] border border-[#ebdcc2] bg-gradient-to-b from-white via-[#fdfaf5] to-[#f8f2e7] p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#c59b27] transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-block rounded-full bg-[#f6e27a]/30 border border-[#c59b27]/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#734e06]">
                        ✦ {item.service}
                      </span>
                      <div className="flex items-center gap-0.5 text-[#d4af37]">
                        {[...Array(5)].map((_, s) => (
                          <Star key={s} className="w-3.5 h-3.5 fill-[#d4af37]" />
                        ))}
                      </div>
                    </div>

                    <blockquote className="font-serif italic text-sm sm:text-[15px] leading-relaxed text-[#38070e]/90">
                      “{item.quote}”
                    </blockquote>
                  </div>

                  <div className="border-t border-[#ebdcc2] pt-3">
                    <h4 className="font-serif text-base font-bold text-[#38070e]">
                      {item.name}
                    </h4>
                    <p className="text-[11px] font-semibold text-[#8b1827]">
                      {item.city}
                    </p>
                    <p className="text-[10px] text-[#8c7377] font-medium mt-0.5">
                      {item.format} · Verified Client
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              7. FREQUENTLY ASKED QUESTIONS ABOUT REVIEWS
          ───────────────────────────────────────────────────────────── */}
          <div className="mt-20 pt-10 border-t border-[#e8dac2] space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#aa8016] flex items-center justify-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#aa8016]" />
                Clarity & Transparency
              </p>
              <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#38070e] tracking-tight">
                Review Guidelines & Privacy FAQ
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#ebdcc2] bg-white p-5 sm:p-6 shadow-xs space-y-2"
                >
                  <h3 className="text-sm sm:text-base font-bold text-[#38070e] flex items-start gap-2">
                    <span className="text-[#c59b27] font-serif">Q.</span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#614b4f] leading-relaxed pl-5">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              8. URGENT GUIDANCE CONSULTATION HOTLINE BANNER
          ───────────────────────────────────────────────────────────── */}
          <div className="mt-16 relative overflow-hidden rounded-[30px] border-2 border-[#c59b27] bg-gradient-to-r from-[#240409] via-[#38070e] to-[#240409] p-8 sm:p-12 text-white shadow-[0_20px_50px_rgba(56,7,14,0.35)]">
            {/* Ambient Gold Glow Accents */}
            <div className="pointer-events-none absolute -top-12 -right-12 w-64 h-64 bg-[#d4af37]/20 blur-3xl rounded-full" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 w-64 h-64 bg-[#c59b27]/20 blur-3xl rounded-full" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#f6e27a]/40 bg-[#5a111c]/60 px-3 py-1 text-xs text-[#f6e27a]">
                  <Sparkles className="w-3.5 h-3.5 text-[#f6e27a]" />
                  <span>Immediate Sacred Assistance</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#fdfaf4] tracking-tight">
                  Facing an Urgent Crossroads Right Now?
                </h2>
                <p className="text-xs sm:text-sm text-[#eedec7] leading-relaxed max-w-xl">
                  If you are currently navigating a distressing life trial or relationship crisis, do not wait. Speak directly with Master Vijay Ji today. Private sanctuary visits in Texas, plus nationwide phone & WhatsApp consultations.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                <a
                  href="tel:12146699699"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#f6e27a] bg-[#f6e27a] px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#240409] hover:bg-white transition-all shadow-[0_6px_20px_rgba(246,226,122,0.3)]"
                >
                  <Phone className="w-4 h-4 text-[#240409]" />
                  <span>Call: +1 (214) 669-9699</span>
                </a>

                <Link
                  href="/book-appointment"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#c59b27] bg-[#38070e]/80 px-6 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#f6e27a] hover:bg-[#38070e] transition-all"
                >
                  <Calendar className="w-4 h-4 text-[#f6e27a]" />
                  <span>Book Sacred Appointment</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
