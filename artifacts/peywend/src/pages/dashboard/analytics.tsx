import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useGetAnalytics } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart3, MousePointerClick, TrendingUp, Link as LinkIcon, ExternalLink, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};

const RANK_COLORS = ["#f59e0b", "#94a3b8", "#b45309"];
const RANK_BG    = ["bg-amber-500/15 text-amber-500 border-amber-500/30",
                     "bg-slate-400/15 text-slate-400 border-slate-400/30",
                     "bg-amber-700/15 text-amber-700 border-amber-700/30"];

export default function Analytics() {
  const { data: analytics, isLoading } = useGetAnalytics();

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">شیکاری</h1>
        <p className="text-muted-foreground mt-1 text-sm">ئاماری وردی سەردانیکەران و کلیکەکانی پرۆفایلەکەت</p>
      </motion.div>

      {/* ── Stat cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        {[
          {
            label: "کۆی گشتی کلیکەکان", loading: isLoading,
            value: (analytics?.totalClicks ?? 0).toLocaleString(),
            sub: "لە سەرەتای دروستکردنەوە",
            icon: MousePointerClick,
            gradient: "from-violet-600 to-indigo-500",
          },
          {
            label: "لینکی تۆمارکراو", loading: isLoading,
            value: (analytics?.totalLinks ?? 0).toLocaleString(),
            sub: "ئێستا لە پرۆفایلەکەتدا",
            icon: LinkIcon,
            gradient: "from-pink-600 to-rose-500",
          },
        ].map((card, i) => (
          <motion.div key={card.label} variants={fadeUp} custom={i} initial="hidden" animate="show"
            className="relative rounded-2xl border border-border/60 bg-card overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-shadow">
            <div className={`absolute top-0 right-0 w-full h-0.5 bg-gradient-to-l ${card.gradient}`} />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
                <div className={`p-2 rounded-xl bg-gradient-to-br ${card.gradient}`}>
                  <card.icon size={17} className="text-white" />
                </div>
              </div>
              {card.loading
                ? <Skeleton className="h-9 w-24 mb-2" />
                : <div className="text-3xl font-black tracking-tight mb-1">{card.value}</div>
              }
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <TrendingUp size={11} className="text-emerald-500" />
                {card.sub}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Chart ── */}
      <motion.div variants={fadeUp} custom={2} initial="hidden" animate="show"
        className="rounded-2xl border border-border/60 bg-card overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-border/40 flex items-center justify-between">
          <div>
            <h2 className="font-black text-base">کلیکەکان لە ٣٠ ڕۆژی ڕابردوودا</h2>
            <p className="text-xs text-muted-foreground mt-0.5">ژمارەی کلیک لەسەر سەرجەم لینکەکانت</p>
          </div>
          <div className="p-2 rounded-xl bg-primary/10">
            <BarChart3 size={16} className="text-primary" />
          </div>
        </div>
        <div className="p-6">
          {isLoading ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : analytics?.clicksByDay && analytics.clicksByDay.length > 0 ? (
            <div className="h-[280px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.clicksByDay} margin={{ top: 10, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(v) => { const d = new Date(v); return `${d.getDate()}/${d.getMonth()+1}`; }} />
                  <YAxis axisLine={false} tickLine={false}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "12px", boxShadow: "0 8px 30px rgba(0,0,0,.12)" }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                    labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: 4, fontSize: 11 }}
                    labelFormatter={(v) => new Date(v as string).toLocaleDateString("ku-IQ", { weekday: "short", month: "long", day: "numeric" })}
                    formatter={(v) => [v, "کلیک"]}
                    cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1, strokeDasharray: "4 4" }}
                  />
                  <Area type="monotone" dataKey="clicks"
                    stroke="hsl(var(--primary))" strokeWidth={2.5}
                    fillOpacity={1} fill="url(#clicksGrad)"
                    dot={false} activeDot={{ r: 5, fill: "hsl(var(--primary))", strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-2xl gap-3">
              <BarChart3 size={40} className="opacity-20" />
              <p className="text-sm">هێشتا هیچ داتایەک نییە</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Top links ── */}
      <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show"
        className="rounded-2xl border border-border/60 bg-card overflow-hidden">
        <div className="px-6 py-5 border-b border-border/40 flex items-center justify-between">
          <div>
            <h2 className="font-black text-base">باشترین لینکەکان</h2>
            <p className="text-xs text-muted-foreground mt-0.5">ئەو لینکانەی زۆرترین کلیکیان لەسەر کراوە</p>
          </div>
          <div className="p-2 rounded-xl bg-amber-500/10">
            <Trophy size={16} className="text-amber-500" />
          </div>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
          </div>
        ) : analytics?.topLinks && analytics.topLinks.length > 0 ? (
          <div className="divide-y divide-border/40">
            {analytics.topLinks.map((link, i) => {
              const maxClicks = analytics.topLinks[0]?.clicks ?? 1;
              const pct = maxClicks > 0 ? Math.round((link.clicks / maxClicks) * 100) : 0;
              return (
                <div key={link.linkId}
                  className="relative flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors group overflow-hidden">
                  {/* bar background */}
                  <div className="absolute inset-0 bg-primary/4 origin-right transition-all duration-500"
                    style={{ transform: `scaleX(${pct / 100})`, transformOrigin: "right" }} />
                  <div className="relative flex items-center gap-4 min-w-0">
                    {/* rank badge */}
                    <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-black shrink-0 ${RANK_BG[i] ?? "bg-muted/50 text-muted-foreground border-border"}`}>
                      {i < 3 ? ["🥇","🥈","🥉"][i] : i + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">{link.title}</p>
                      <a href={link.url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 truncate"
                        dir="ltr" onClick={e => e.stopPropagation()}>
                        {link.url}
                        <ExternalLink size={9} className="shrink-0" />
                      </a>
                    </div>
                  </div>
                  <div className="relative flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full shrink-0 text-sm font-black">
                    {link.clicks.toLocaleString()}
                    <span className="font-normal text-xs text-primary/70">کلیک</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-14 text-center text-muted-foreground text-sm">
            هێشتا هیچ کلیکێک نەکراوە لەسەر لینکەکانت.
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
