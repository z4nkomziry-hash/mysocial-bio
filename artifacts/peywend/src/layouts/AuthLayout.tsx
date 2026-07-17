import { useAuth } from "@/context/AuthContext";
import { Link, Redirect } from "wouter";
import { Logo } from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, Users, Star } from "lucide-react";

const FLOATING_CARDS = [
  { icon: TrendingUp, label: "٤٨ کلیک ئەمڕۆ",     color: "#34d399", x: "10%",  y: "25%", delay: 0   },
  { icon: Users,      label: "٢,٤٠٠ سەردانکەر",   color: "#a78bfa", x: "72%",  y: "18%", delay: 0.4 },
  { icon: Star,       label: "پرۆفایلی نوێ",        color: "#fb923c", x: "18%",  y: "68%", delay: 0.8 },
  { icon: Sparkles,   label: "دروستکەری کورد",      color: "#f472b6", x: "65%",  y: "70%", delay: 1.2 },
];

const MOCK_PROFILES = [
  { seed: "Sarwar", name: "سەروەر",  color: "#a78bfa" },
  { seed: "Zhala",  name: "ژالە",   color: "#f472b6" },
  { seed: "Baran",  name: "باران",  color: "#34d399" },
];

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (user) return <Redirect to="/داشبۆرد" />;

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background">

      {/* ── Form side ── */}
      <div className="flex-1 flex flex-col justify-center px-5 sm:px-8 lg:px-16 xl:px-24 py-12 order-2 md:order-1">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <Logo />
          </div>
          {children}
        </div>
      </div>

      {/* ── Visual side (hidden on mobile) ── */}
      <div className="hidden md:flex relative flex-1 order-1 md:order-2 overflow-hidden dark bg-[#070712]">
        {/* Background blobs */}
        <div className="animate-blob-drift   absolute top-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-violet-600/30 blur-[80px] pointer-events-none" />
        <div className="animate-blob-drift-2 absolute bottom-[-10%] left-[-10%]  w-[350px] h-[350px] rounded-full bg-pink-600/25   blur-[70px] pointer-events-none" />
        <div className="animate-blob-drift-3 absolute top-[40%]   left-[30%]     w-[200px] h-[200px] rounded-full bg-indigo-500/20 blur-[50px] pointer-events-none" />

        {/* Spinning ring */}
        <div className="animate-spin-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-violet-500/10 pointer-events-none" />

        {/* Floating stat cards */}
        {FLOATING_CARDS.map((card, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: card.delay + 0.5, duration: 0.5 }}
            style={{ position: "absolute", left: card.x, top: card.y }}
            className="glass rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-xl border border-white/10">
            <card.icon size={14} style={{ color: card.color }} />
            <span className="text-white/80 text-xs font-semibold">{card.label}</span>
          </motion.div>
        ))}

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-10 text-center">
          {/* Profile stack */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center justify-center mb-8">
            {MOCK_PROFILES.map((p, i) => (
              <motion.div key={p.seed}
                initial={{ x: i === 0 ? -20 : i === 2 ? 20 : 0, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="w-14 h-14 rounded-full border-4 border-[#070712] overflow-hidden shadow-lg"
                style={{ marginLeft: i > 0 ? "-12px" : 0, zIndex: i }}>
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.seed}`} alt={p.name} className="w-full h-full" />
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="w-14 h-14 rounded-full border-4 border-[#070712] glass flex items-center justify-center text-xs font-black text-white/80"
              style={{ marginLeft: "-12px" }}>
              +٢ک
            </motion.div>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }} className="text-3xl xl:text-4xl font-black text-white leading-[1.25] mb-4">
            بگەورە بە<br />
            <span className="grad-text">زمانی خۆت</span>
          </motion.h2>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }} className="text-white/50 text-sm leading-relaxed max-w-xs">
            زیاتر لە ١٠,٠٠٠ دروستکەری کوردی پەیوەندیان بەکاردەهێنن. تۆش وردەکەیتەوە.
          </motion.p>

          {/* Animated mock phone */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="mt-10 animate-float-y">
            <div className="relative w-[160px] mx-auto">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-violet-600/40 to-pink-600/30 blur-2xl scale-110 opacity-60" />
              <div className="relative rounded-[2rem] border-[5px] border-white/10 bg-[#0a0a18] overflow-hidden shadow-2xl">
                <div className="h-4 flex items-center justify-center">
                  <div className="w-12 h-2 bg-black/60 rounded-full" />
                </div>
                <div className="px-3 pb-5 pt-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 mx-auto mb-2 shadow-lg" />
                  <div className="w-20 h-2 bg-white/20 rounded-full mx-auto mb-1" />
                  <div className="w-14 h-1.5 bg-white/10 rounded-full mx-auto mb-3" />
                  {["", "", ""].map((_, i) => (
                    <motion.div key={i} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                      transition={{ delay: 1.2 + i * 0.2, duration: 0.4 }}
                      className="w-full h-6 rounded-lg mb-1.5 origin-right"
                      style={{ background: ["#7c3aed33","#db277733","#05966933"][i], border: `1px solid ${["#7c3aed","#db2777","#059669"][i]}22` }} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
