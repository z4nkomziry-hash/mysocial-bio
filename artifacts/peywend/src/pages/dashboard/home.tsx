import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useGetDashboardStats, useGetPages, useCreatePage, useGetMe } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MousePointerClick, Link as LinkIcon, Eye, Sparkles, ArrowUpRight, TrendingUp, ArrowLeft, Copy, CheckCheck, BarChart3, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] } }),
};

function StatCard({
  label, value, sub, icon: Icon, gradient, loading, i,
}: {
  label: string; value: string | number; sub?: React.ReactNode;
  icon: React.ElementType; gradient: string; loading: boolean; i: number;
}) {
  return (
    <motion.div variants={fadeUp} custom={i} initial="hidden" animate="show"
      className="relative rounded-2xl border border-border/60 bg-card overflow-hidden group hover:shadow-lg hover:shadow-primary/5 transition-shadow">
      {/* accent bar */}
      <div className={`absolute top-0 right-0 w-full h-0.5 bg-gradient-to-l ${gradient} opacity-70`} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <div className={`p-2 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-10 shadow-sm`}>
            <Icon size={17} className="text-white" />
          </div>
        </div>
        {loading
          ? <Skeleton className="h-9 w-24 mb-2" />
          : <div className="text-3xl font-black tracking-tight mb-1">{value}</div>
        }
        {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      </div>
    </motion.div>
  );
}

export default function DashboardHome() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: user } = useGetMe();
  const { data: pages } = useGetPages();
  const createPage = useCreatePage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const hasTriedCreate = useRef(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (pages && pages.length === 0 && !hasTriedCreate.current) {
      hasTriedCreate.current = true;
      createPage.mutate({ data: { title: "ماڵپەڕ" } }, {
        onSuccess: () => {
          toast({ title: "پەڕەی سەرەکی دروستکرا", description: "ئێستا دەتوانیت لینکەکانت زیاد بکەیت." });
        },
        onError: () => { hasTriedCreate.current = false; }
      });
    }
  }, [pages]); // eslint-disable-line react-hooks/exhaustive-deps

  const profileUrl = user ? `${window.location.origin}/${user.username}` : "";

  const handleCopy = async () => {
    if (!profileUrl) return;
    await navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const firstName = user?.name?.split(" ")[0] ?? "";

  return (
    <DashboardLayout>
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              بەخێربێیتەوە، {firstName} 👋
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">ئامارەکانی ئەمڕۆ بکەرە بینی</p>
          </div>
          {/* Profile URL quick-copy */}
          {user && (
            <div className="flex items-center gap-2 bg-muted/60 border border-border/60 rounded-xl px-3 py-2 min-w-0 max-w-xs sm:max-w-sm">
              <span className="text-xs text-muted-foreground truncate flex-1 font-medium" dir="ltr">
                peywend.com/{user.username}
              </span>
              <button onClick={handleCopy}
                className="shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                {copied ? <CheckCheck size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
              <a href={profileUrl} target="_blank" rel="noopener noreferrer"
                className="shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Stat cards ── */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <StatCard i={0} label="بینینی پرۆفایل" loading={statsLoading}
          value={(stats?.profileViews ?? 0).toLocaleString()}
          sub="لە سەرەتای دروستکردنەوە"
          icon={Eye}
          gradient="from-violet-600 to-indigo-500" />
        <StatCard i={1} label="کلیکی گشتی" loading={statsLoading}
          value={(stats?.totalClicks ?? 0).toLocaleString()}
          sub={
            <span className="flex items-center gap-1">
              <TrendingUp size={11} className="text-emerald-500" />
              <span className="text-emerald-500 font-semibold">+{stats?.recentClicks ?? 0}</span>
              <span>هەفتەی ڕابردوو</span>
            </span>
          }
          icon={MousePointerClick}
          gradient="from-pink-600 to-rose-500" />
        <StatCard i={2} label="لینکی چالاک" loading={statsLoading}
          value={(stats?.totalLinks ?? 0).toLocaleString()}
          sub="لینکی تۆمارکراو"
          icon={LinkIcon}
          gradient="from-amber-500 to-orange-500" />
      </div>

      {/* ── Action cards ── */}
      <div className="grid gap-5 sm:grid-cols-2 mb-8">
        {/* Link-in-bio CTA */}
        <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show"
          className="relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 to-secondary/5 p-6 overflow-hidden group hover:border-primary/40 transition-colors">
          <div className="absolute -top-8 -left-8 w-36 h-36 rounded-full bg-primary/10 blur-2xl pointer-events-none group-hover:bg-primary/15 transition-colors" />
          <LinkIcon size={28} className="text-primary mb-3 relative z-10" />
          <h3 className="font-black text-lg mb-1 relative z-10">لینکی بیوت نوێ بکەرەوە</h3>
          <p className="text-muted-foreground text-sm mb-5 relative z-10">
            بەرهەم، سۆشیاڵ میدیا و لینکە نوێکانت زیاد بکە.
          </p>
          <Button asChild size="sm" className="rounded-xl font-bold relative z-10 gap-2 shadow-md shadow-primary/20">
            <Link href="/داشبۆرد/لینکی-بیو">
              <span>بڕۆ بۆ ئەدیتەر</span>
              <ArrowLeft size={14} />
            </Link>
          </Button>
        </motion.div>

        {/* Analytics CTA */}
        <motion.div variants={fadeUp} custom={4} initial="hidden" animate="show"
          className="relative rounded-2xl border border-border/60 bg-card p-6 overflow-hidden group hover:border-primary/20 hover:shadow-md transition-all">
          <div className="absolute -top-8 -left-8 w-36 h-36 rounded-full bg-secondary/8 blur-2xl pointer-events-none group-hover:bg-secondary/12 transition-colors" />
          <BarChart3 size={28} className="text-secondary mb-3 relative z-10" />
          <h3 className="font-black text-lg mb-1 relative z-10">شیکاری تەواو ببینە</h3>
          <p className="text-muted-foreground text-sm mb-5 relative z-10">
            ببینە کێ کلیک دەکات، لەکوێ و کەی.
          </p>
          <Button asChild size="sm" variant="outline" className="rounded-xl font-bold relative z-10 gap-2 hover:bg-secondary/10 hover:border-secondary/40 hover:text-secondary transition-colors">
            <Link href="/داشبۆرد/شیکاری">
              <span>بینینی شیکاری</span>
              <ArrowLeft size={14} />
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* ── AI assistant placeholder ── */}
      <motion.div variants={fadeUp} custom={5} initial="hidden" animate="show"
        className="relative rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-600/8 via-purple-600/5 to-pink-600/5 p-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="animate-blob-drift absolute -top-10 -right-10 w-48 h-48 rounded-full bg-violet-600/10 blur-3xl" />
          <div className="animate-blob-drift-2 absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-pink-600/10 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center shadow-lg shadow-violet-500/30 shrink-0">
            <Sparkles size={22} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-lg mb-1">یاریدەدەری زیرەک — بەزووی دێت</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              یاریدەدەرێکی AI کە پرۆفایلەکەت شیدەکاتەوە و ئامۆژگاری دەدات بۆ زیادکردنی کلیک و سەردانیکەر.
            </p>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-600/15 text-violet-600 dark:text-violet-400 text-xs font-bold border border-violet-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              بەزووی
            </span>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
