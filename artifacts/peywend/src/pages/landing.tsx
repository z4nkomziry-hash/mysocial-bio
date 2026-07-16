import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import {
  ArrowLeft, Sparkles, Smartphone, BarChart3, Palette, Globe,
  CheckCircle2, LinkIcon, Zap, Star, TrendingUp, Users,
  Shield, MousePointerClick, ChevronLeft,
} from "lucide-react";
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";

/* ── helpers ─────────────────────────────────────────────────── */

function useAnimatedCounter(target: number, trigger: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 20);
    return () => clearInterval(timer);
  }, [target, trigger]);
  return count;
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useAnimatedCounter(value, inView);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};

const EXAMPLE_PROFILES = [
  { seed: "Sarwar",  name: "سەروەر ئەحمەد",  tag: "@sarwar",    bio: "فۆتۆگرافەر · کوردستان",      color: "#a78bfa", links: 8  },
  { seed: "Zhala",   name: "ژالە محەمەد",    tag: "@zhala",     bio: "دیزاینەر · موسیقا",         color: "#f472b6", links: 12 },
  { seed: "Baran",   name: "باران کریم",     tag: "@baran",     bio: "کرێکاری ناوەڕۆک · یوتیوب",  color: "#34d399", links: 6  },
  { seed: "Dilnoza", name: "دڵنۆزە ئەلی",   tag: "@dilnoza",   bio: "شەف · رێنمایی خواردن",     color: "#fb923c", links: 9  },
];

const FEATURES = [
  { icon: Smartphone,       title: "گونجاو بۆ مۆبایل",    desc: "دیزاینێکی شگرف کە لەسەر هەموو ئامێرێک کامڵ دیاردەبێت." },
  { icon: Palette,          title: "تایبەتکاری تەواو",    desc: "ڕەنگ، فۆنت، شێواز — هەموو شتێک بەپێی براندەکەی خۆتە." },
  { icon: BarChart3,        title: "ئامار و شیکاری",      desc: "کلیک، سەردان، و سەرچاوەی ترافیک بە تایمی ڕاستەقینە." },
  { icon: Globe,            title: "بەتەواوی کوردی",      desc: "یەکەمین پلاتفۆرمی لەم جۆرە کە کوردی بڕگەی یەکەمە." },
  { icon: Zap,              title: "خێرایی باڵا",          desc: "پرۆفایلەکانت لە کەمتر لە چرکەیەک کارو دەکەن." },
  { icon: Shield,           title: "ئارامی و پارێزگاری",  desc: "زانیارییەکانت پارێزراون، کەس بەستەرەکەت نادزێت." },
];

const HOW_STEPS = [
  { n: "١", title: "ناوی بەکارهێنەر هەڵبژێرە",  desc: "ناوی براندەکەت بنووسە بۆ دروستکردنی لینکەکەت." },
  { n: "٢", title: "لینک و زانیاری زیاد بکە",   desc: "سۆشیاڵ میدیاکانت، ماڵپەڕ، ڤیدیۆ و بەرهەمەکانت." },
  { n: "٣", title: "بڵاوی بکەرەوە",              desc: "لینکەکەت کۆپی بکە و لە بایۆی هەر سۆشیاڵی دایبنێ." },
];

const PLANS = [
  {
    name: "خۆڕای",
    price: "٠",
    color: "from-indigo-500/20 to-purple-500/20",
    badge: null,
    features: ["لینکی بێسنوور", "ئامارە بنەڕەتیەکان", "تیم و شێوازی ستاندارد", "پشتیوانی ئیمەیڵ"],
    cta: "دروستی بکە بەخۆڕایی",
    href: "/تومارکردن",
  },
  {
    name: "پرۆ",
    price: "٩",
    color: "from-violet-600/30 to-pink-600/30",
    badge: "بەناوبانگ",
    features: ["هەموو تایبەتمەندییەکانی خۆڕای", "ئامارە پێشکەوتووەکان", "تیمی تایبەت و پرۆ", "دۆمەینی تایبەت", "پشتیوانی پێشوەخت"],
    cta: "دەستپێبکە بە پرۆ",
    href: "/تومارکردن",
  },
];

/* ── phone mockup component ─────────────────────────────────── */

const MOCK_LINKS = ["ئینستاگرامم", "یوتیوب", "تیکتۆک", "دیزاینەکانم", "پەیوەندی"];

function PhoneMockup() {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    if (visible >= MOCK_LINKS.length) return;
    const t = setTimeout(() => setVisible(v => v + 1), 600);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <div className="relative mx-auto w-[220px] sm:w-[260px]">
      {/* Glow */}
      <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-violet-600/40 to-pink-600/40 blur-3xl scale-110 opacity-60" />
      {/* Frame */}
      <div className="relative rounded-[2.5rem] border-[6px] border-white/10 bg-[#0d0d18] shadow-2xl overflow-hidden">
        {/* Notch */}
        <div className="h-6 bg-[#0d0d18] flex items-center justify-center">
          <div className="w-20 h-3 bg-black/60 rounded-full" />
        </div>
        {/* Content */}
        <div className="px-4 pb-8 pt-4 min-h-[420px] flex flex-col items-center">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-16 h-16 rounded-full border-2 border-violet-500/50 overflow-hidden mb-2 shadow-lg shadow-violet-500/30"
          >
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Peywend&backgroundColor=b6e3f4" alt="" className="w-full h-full" />
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-white font-bold text-sm mb-0.5">سەروەر ئەحمەد</motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-white/50 text-xs mb-5">فۆتۆگرافەر · کوردستان</motion.p>

          <div className="w-full space-y-2.5">
            <AnimatePresence>
              {MOCK_LINKS.slice(0, visible).map((label, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="w-full h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${["#7c3aed","#db2777","#059669","#d97706","#2563eb"][i % 5]}33, ${["#7c3aed","#db2777","#059669","#d97706","#2563eb"][i % 5]}22)`,
                    border: `1px solid ${["#7c3aed","#db2777","#059669","#d97706","#2563eb"][i % 5]}44`,
                  }}
                >
                  {label}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── main page ───────────────────────────────────────────────── */

export default function Landing() {
  const statsRef    = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true });

  return (
    /* Force dark on the entire marketing page */
    <div className="dark min-h-[100dvh] bg-[#060610] text-white overflow-x-hidden selection:bg-violet-500/30">

      {/* ── Background blobs (always present) ─── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="animate-blob-drift   absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/25 blur-[120px]" />
        <div className="animate-blob-drift-2 absolute top-[30%]  left-[-15%] w-[500px] h-[500px] rounded-full bg-pink-600/20   blur-[100px]" />
        <div className="animate-blob-drift-3 absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] rounded-full bg-indigo-500/15  blur-[80px]"  />
      </div>

      {/* ══ HEADER ══════════════════════════════════════════════ */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="glass rounded-2xl px-4 py-2 flex items-center gap-4">
            <Logo />
          </div>
          <div className="flex items-center gap-3">
            <Link href="/چوونەژوورەوە">
              <Button variant="ghost" className="hidden sm:inline-flex text-white/80 hover:text-white hover:bg-white/10 rounded-xl">
                چوونەژوورەوە
              </Button>
            </Link>
            <Link href="/تومارکردن">
              <Button className="rounded-xl px-5 font-bold shadow-lg shadow-violet-500/30 bg-gradient-to-l from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border-0 text-white">
                دروستکردنی ژمارە
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ══ HERO ════════════════════════════════════════════════ */}
        <section className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-20 pb-16 px-4">
          {/* Badge */}
          <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show"
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8 text-sm font-semibold text-violet-300 border border-violet-500/30">
            <Sparkles size={14} className="text-violet-400" />
            پلاتفۆرمی سەرەکی بۆ دروستکەرانی کورد
            <Sparkles size={14} className="text-violet-400" />
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="show"
            className="text-center text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.15] tracking-tight mb-6 max-w-5xl">
            هەموو لینکەکانت<br />
            <span className="grad-text">لە یەک شوێن</span>
          </motion.h1>

          <motion.p variants={fadeUp} custom={2} initial="hidden" animate="show"
            className="text-white/60 text-lg sm:text-xl max-w-xl text-center mb-10 leading-relaxed">
            پرۆفایلی بیو-لینکت دروست بکە، لینکەکانت کۆبکەرەوە، و ئامارەکانت شیبکەرەوە — بەخۆڕایی و بەزمانی کوردی.
          </motion.p>

          {/* CTA row */}
          <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show"
            className="flex flex-col sm:flex-row gap-4 items-center mb-20">
            <Link href="/تومارکردن">
              <Button size="lg"
                className="h-14 px-10 text-lg font-black rounded-2xl shadow-2xl shadow-violet-500/40 bg-gradient-to-l from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 border-0 text-white hover:-translate-y-1 transition-transform">
                دەستپێبکە بەخۆڕایی
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#چۆن" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors font-medium">
              <span>چۆن کاردەکات؟</span>
              <ChevronLeft size={18} />
            </a>
          </motion.div>

          {/* Phone + floating cards */}
          <motion.div variants={fadeUp} custom={4} initial="hidden" animate="show"
            className="relative w-full max-w-5xl mx-auto flex items-end justify-center gap-8">

            {/* Left floating card */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="hidden lg:block glass rounded-2xl p-4 w-52 shadow-xl shadow-violet-900/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
                <div>
                  <div className="text-xs font-bold text-white">ژالە محەمەد</div>
                  <div className="text-[10px] text-white/40">@zhala</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-bold">
                <TrendingUp size={14} />
                <span>٤٨ کلیک ئەمڕۆ</span>
              </div>
            </motion.div>

            {/* Phone */}
            <div className="animate-float-y-slow">
              <PhoneMockup />
            </div>

            {/* Right floating card */}
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              className="hidden lg:block glass rounded-2xl p-4 w-52 shadow-xl shadow-pink-900/30">
              <div className="text-xs text-white/50 mb-1">سەردانی ئەمهەفتە</div>
              <div className="text-2xl font-black text-white mb-2">١٢,٤٠٠</div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"
                  initial={{ width: 0 }} animate={{ width: "78%" }} transition={{ delay: 1.2, duration: 1.2, ease: "easeOut" }} />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ══ STATS BAR ══════════════════════════════════════════ */}
        <section ref={statsRef} className="py-16 border-y border-white/5">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 10000, suffix: "+", label: "دروستکەر" },
              { value: 500000, suffix: "+", label: "کلیک" },
              { value: 98, suffix: "%", label: "ڕەزامەندی" },
              { value: 1, suffix: "s", label: "خێرایی بارکردن" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl sm:text-4xl font-black grad-text mb-1">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </div>
                <div className="text-white/50 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CREATOR SHOWCASE ══════════════════════════════════ */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }}
              className="text-center mb-14">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-violet-400 font-semibold text-sm mb-4 glass rounded-full px-4 py-1.5 border border-violet-500/20">
                <Users size={14} /> دروستکەرانی پەیوەند
              </motion.div>
              <motion.h2 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl font-black mb-4">
                دروستکەرانی واقعی،<br /><span className="grad-text">نتیجەی واقعی</span>
              </motion.h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {EXAMPLE_PROFILES.map((p, i) => (
                <motion.div key={p.seed}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="glass rounded-3xl p-6 flex flex-col items-center text-center cursor-pointer border border-white/5 hover:border-white/15 transition-colors">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-white/10">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.seed}`} alt="" className="w-full h-full" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#060610]"
                      style={{ background: p.color }} />
                  </div>
                  <div className="font-bold text-white mb-0.5">{p.name}</div>
                  <div className="text-white/40 text-xs mb-3">{p.tag}</div>
                  <div className="text-white/60 text-sm mb-4">{p.bio}</div>
                  <div className="glass rounded-full px-3 py-1 text-xs font-semibold" style={{ color: p.color }}>
                    {p.links} لینک
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FEATURES ══════════════════════════════════════════ */}
        <section ref={featuresRef} className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-14">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-pink-400 font-semibold text-sm mb-4 glass rounded-full px-4 py-1.5 border border-pink-500/20">
                <Sparkles size={14} /> تایبەتمەندییەکان
              </motion.div>
              <motion.h2 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl font-black mb-4">
                هەموو ئەوەی پێویستتە<br /><span className="grad-text">لە یەک شوێن</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-white/50 max-w-xl mx-auto">
                پەیوەند تەنها بۆ دانانی لینک نییە. پلاتفۆرمێکی تەواوە بۆ نیشاندانی براندی خۆت.
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f, i) => (
                <motion.div key={f.title}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  className="glass rounded-3xl p-7 border border-white/5 hover:border-violet-500/30 transition-colors group">
                  <div className="w-12 h-12 rounded-2xl mb-5 flex items-center justify-center
                    bg-gradient-to-br from-violet-600/30 to-pink-600/20 border border-violet-500/20
                    group-hover:from-violet-600/50 group-hover:border-violet-500/40 transition-all">
                    <f.icon size={22} className="text-violet-300 group-hover:text-violet-200" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ════════════════════════════════════════ */}
        <section id="چۆن" className="py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-4 glass rounded-full px-4 py-1.5 border border-emerald-500/20">
                <Zap size={14} /> زۆر ئاسان
              </motion.div>
              <motion.h2 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl font-black">
                لە چەند خولەکێکدا<br /><span className="grad-text">ئامادەی دەبیت</span>
              </motion.h2>
            </motion.div>

            <div className="relative">
              {/* connector line */}
              <div className="hidden md:block absolute top-10 right-[16.5%] left-[16.5%] h-px bg-gradient-to-l from-transparent via-violet-500/40 to-transparent" />
              <div className="grid md:grid-cols-3 gap-8 text-center">
                {HOW_STEPS.map((s, i) => (
                  <motion.div key={s.n}
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.55 }}>
                    <div className="w-20 h-20 mx-auto mb-6 rounded-3xl glass border border-violet-500/30 flex items-center justify-center
                      text-3xl font-black grad-text shadow-lg shadow-violet-900/30">
                      {s.n}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.4 }}
              className="text-center mt-14">
              <Link href="/تومارکردن">
                <Button size="lg" className="h-14 px-10 text-lg font-black rounded-2xl
                  bg-gradient-to-l from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400
                  border-0 text-white shadow-2xl shadow-violet-500/30 hover:-translate-y-1 transition-transform">
                  ئێستا دروستی بکە
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ══ PRICING ═════════════════════════════════════════════ */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-14">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-amber-400 font-semibold text-sm mb-4 glass rounded-full px-4 py-1.5 border border-amber-500/20">
                <Star size={14} /> پلانەکان
              </motion.div>
              <motion.h2 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl font-black">
                بۆ هەرکەسێک<br /><span className="grad-text">پلانێکی گونجاو</span>
              </motion.h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {PLANS.map((plan, i) => (
                <motion.div key={plan.name}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.55 }}
                  className={`relative glass rounded-3xl p-8 border ${i === 1 ? "border-violet-500/40 shadow-2xl shadow-violet-900/40" : "border-white/5"}`}>
                  {/* Popular badge */}
                  {plan.badge && (
                    <div className="absolute -top-3.5 right-8 bg-gradient-to-l from-violet-600 to-pink-600 text-white text-xs font-black px-4 py-1 rounded-full shadow-lg">
                      {plan.badge}
                    </div>
                  )}
                  {/* gradient accent */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${plan.color} pointer-events-none`} />
                  <div className="relative">
                    <div className="text-white/60 text-sm font-semibold mb-2">{plan.name}</div>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-5xl font-black text-white">${plan.price}</span>
                      <span className="text-white/40 text-sm">/مانگ</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-sm text-white/80">
                          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href={plan.href}>
                      <Button className={`w-full h-12 rounded-xl font-bold text-white border-0 ${
                        i === 1
                          ? "bg-gradient-to-l from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 shadow-lg shadow-violet-500/30"
                          : "bg-white/10 hover:bg-white/20"
                      }`}>
                        {plan.cta}
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FINAL CTA ════════════════════════════════════════════ */}
        <section className="py-32 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/60 to-pink-900/40 pointer-events-none" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="animate-spin-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-violet-500/10" />
            <div className="animate-spin-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-pink-500/10" style={{ animationDirection: "reverse" }} />
          </div>
          <div className="relative max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center shadow-2xl shadow-violet-500/40">
                <LinkIcon size={36} className="text-white" />
              </div>
              <h2 className="text-5xl sm:text-6xl font-black mb-6">
                ئامادەیت؟<br /><span className="grad-text">بەخۆڕایی دەستپێبکە</span>
              </h2>
              <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
                کارت پێویست نییە. لە کەمتر لە دوو خولەک پرۆفایلەکەت ئامادە دەبێت.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/تومارکردن">
                  <Button size="lg" className="h-14 px-12 text-lg font-black rounded-2xl
                    bg-gradient-to-l from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400
                    border-0 text-white shadow-2xl shadow-violet-500/40 hover:-translate-y-1 transition-transform">
                    دروستکردنی پرۆفایل
                    <ArrowLeft className="mr-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center justify-center gap-8 text-sm font-medium text-white/40">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400" /> بەخۆڕایی</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400" /> کارت پێویست نییە</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400" /> بەزمانی کوردی</span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ══ FOOTER ═════════════════════════════════════════════ */}
      <footer className="border-t border-white/5 py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <Logo className="mb-3 opacity-90" asLink={false} />
              <p className="text-white/30 text-sm">بنیاتنراوە بۆ دروستکەرانی کورد</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/40">
              <a href="#" className="hover:text-white transition-colors">مەرجەکان</a>
              <a href="#" className="hover:text-white transition-colors">تایبەتمەندی</a>
              <a href="#" className="hover:text-white transition-colors">پەیوەندی</a>
              <a href="#" className="hover:text-white transition-colors">بلۆگ</a>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-white/5 text-center text-white/20 text-xs">
            © ٢٠٢٥ پەیوەند · هەموو مافێک پارێزراوە
          </div>
        </div>
      </footer>
    </div>
  );
}
