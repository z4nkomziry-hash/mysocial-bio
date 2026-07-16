import { useAuth } from "@/context/AuthContext";
import { Link, Redirect, useLocation } from "wouter";
import { LayoutDashboard, Link as LinkIcon, BarChart3, Settings, ExternalLink, LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useLogout } from "@workspace/api-client-react";
import { motion } from "framer-motion";

const TABS = [
  { href: "/داشبۆرد",            label: "ئامادەکاری",   icon: LayoutDashboard },
  { href: "/داشبۆرد/لینکی-بیو", label: "لینکی بیو",    icon: LinkIcon        },
  { href: "/داشبۆرد/شیکاری",    label: "شیکاری",       icon: BarChart3       },
  { href: "/داشبۆرد/ڕێکخستن",   label: "ڕێکخستنەکان", icon: Settings        },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, setUser } = useAuth();
  const [location] = useLocation();
  const logout = useLogout();

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return <Redirect to="/چوونەژوورەوە" />;

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => {
        localStorage.removeItem("peywend_token");
        setUser(null);
      }
    });
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col pb-20 md:pb-0 md:flex-row">

      {/* ── Mobile top header ─────────────────────────────────── */}
      <header className="md:hidden flex items-center justify-between px-4 h-14 border-b bg-card/80 backdrop-blur-md sticky top-0 z-40">
        <Logo />
        <a href={`/${user.username}`} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition-colors">
          بینینی پرۆفایل
          <ExternalLink size={12} />
        </a>
      </header>

      {/* ── Desktop sidebar ───────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 border-l border-border/60 bg-card sticky top-0 h-[100dvh] shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border/40">
          <Logo />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {TABS.map((tab) => {
            const isActive = location === tab.href;
            return (
              <Link key={tab.href} href={tab.href} className="block">
                <div className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}>
                  {isActive && (
                    <motion.div layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl bg-gradient-to-l from-primary to-indigo-600 shadow-lg shadow-primary/30"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                  )}
                  <tab.icon size={18} className="relative z-10 shrink-0" />
                  <span className="relative z-10">{tab.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom user card */}
        <div className="p-3 border-t border-border/40 space-y-2">
          {/* Profile preview button */}
          <a href={`/${user.username}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-primary bg-primary/8 hover:bg-primary/15 transition-colors border border-primary/20 hover:border-primary/40">
            <ExternalLink size={15} className="shrink-0" />
            <span>بینینی پرۆفایل</span>
          </a>

          {/* User row */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/40 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden shadow-sm">
              {user.avatarUrl
                ? <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                : user.name.charAt(0)
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate leading-tight">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
            </div>
            <button onClick={handleLogout}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground shrink-0">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* ── Mobile bottom tab bar ─────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 border-t border-border/60 bg-card/95 backdrop-blur-md z-50">
        <div className="flex items-stretch justify-around px-2 py-1.5 safe-area-bottom">
          {TABS.map((tab) => {
            const isActive = location === tab.href;
            return (
              <Link key={tab.href} href={tab.href} className="flex-1">
                <div className="flex flex-col items-center gap-1 py-1.5 relative">
                  {isActive && (
                    <motion.div layoutId="mobile-tab-active"
                      className="absolute inset-0 rounded-xl bg-primary/10"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                  )}
                  <tab.icon size={22} className={`relative z-10 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`relative z-10 text-[10px] font-semibold ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {tab.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
