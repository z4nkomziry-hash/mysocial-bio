import { useAuth } from "@/context/AuthContext";
import { Link, Redirect, useLocation } from "wouter";
import { LayoutDashboard, Link as LinkIcon, BarChart3, Settings, ExternalLink } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

const TABS = [
  { href: "/داشبۆرد", label: "ئامادەکاری", icon: LayoutDashboard },
  { href: "/داشبۆرد/لینکی-بیو", label: "لینکی بیو", icon: LinkIcon },
  { href: "/داشبۆرد/شیکاری", label: "شیکاری", icon: BarChart3 },
  { href: "/داشبۆرد/ڕێکخستن", label: "ڕێکخستنەکان", icon: Settings },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/چوونەژوورەوە" />;
  }

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col pb-20 md:pb-0 md:flex-row rtl:flex-row-reverse">
      
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b bg-card sticky top-0 z-40">
        <Logo />
        <Button variant="outline" size="sm" asChild className="gap-2">
          <a href={`/${user.username}`} target="_blank" rel="noopener noreferrer">
            <span className="hidden sm:inline">بینینی پرۆفایل</span>
            <ExternalLink size={16} />
          </a>
        </Button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-l bg-card sticky top-0 h-[100dvh]">
        <div className="p-6">
          <Logo />
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {TABS.map((tab) => {
            const isActive = location === tab.href;
            return (
              <Link key={tab.href} href={tab.href} className="block">
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? "bg-primary text-primary-foreground font-medium shadow-sm" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}>
                  <tab.icon size={20} className={isActive ? "text-primary-foreground" : "text-muted-foreground"} />
                  <span>{tab.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden shrink-0">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
            </div>
          </div>
          
          <Button variant="outline" className="w-full justify-start gap-2" asChild>
            <a href={`/${user.username}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={16} />
              <span>بینینی پرۆفایل</span>
            </a>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-card/95 backdrop-blur-md pb-safe z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {TABS.map((tab) => {
            const isActive = location === tab.href;
            return (
              <Link key={tab.href} href={tab.href} className="flex-1">
                <div className="flex flex-col items-center justify-center py-1 gap-1">
                  <div className={`p-1.5 rounded-full ${isActive ? "bg-primary/10" : ""}`}>
                    <tab.icon 
                      size={24} 
                      className={isActive ? "text-primary" : "text-muted-foreground"} 
                    />
                  </div>
                  <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
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
