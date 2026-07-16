import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useGetDashboardStats, useGetPages, useCreatePage, useGetMe } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MousePointerClick, Link as LinkIcon, Eye, Sparkles, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DashboardHome() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: user } = useGetMe();
  const { data: pages, isLoading: pagesLoading } = useGetPages();
  const createPage = useCreatePage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const hasTriedCreate = useRef(false);

  // Initialize a default page if user has none — guarded by a ref so it
  // fires at most once regardless of how many times the component re-renders.
  useEffect(() => {
    if (pages && pages.length === 0 && !hasTriedCreate.current) {
      hasTriedCreate.current = true;
      createPage.mutate({ data: { title: "ماڵپەڕ" } }, {
        onSuccess: () => {
          toast({
            title: "پەڕەی سەرەکی دروستکرا",
            description: "ئێستا دەتوانیت لینکەکانت زیاد بکەیت.",
          });
        },
        onError: () => {
          // Allow retry on next mount if creation failed
          hasTriedCreate.current = false;
        }
      });
    }
  }, [pages]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">بەخێربێیتەوە، {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-muted-foreground mt-2">ئامارەکانی پرۆفایلەکەت ببینە و لینکەکانت بەڕێوەببە.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="bg-card shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">بینینی پرۆفایل</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <Eye size={16} />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-3xl font-bold">{stats?.profileViews?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">لە سەرەتای دروستکردنەوە</p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کلیکی گشتی</CardTitle>
            <div className="p-2 bg-secondary/10 rounded-full text-secondary">
              <MousePointerClick size={16} />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-3xl font-bold">{stats?.totalClicks?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500 font-medium inline-flex items-center">
                    <ArrowUpRight size={12} className="mr-1" />
                    +{stats?.recentClicks || 0}
                  </span>{" "}
                  هەفتەی ڕابردوو
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">لینکەکان</CardTitle>
            <div className="p-2 bg-accent/10 rounded-full text-accent">
              <LinkIcon size={16} />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-3xl font-bold">{stats?.totalLinks?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">لینکی چالاک</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 text-primary/10 group-hover:scale-110 transition-transform duration-500">
            <Sparkles size={120} />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center p-2 bg-background rounded-lg text-primary mb-4 shadow-sm">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">یاریدەدەری زیرەک</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              پرسیار لە یاریدەدەری زیرەک بکە بۆ ئەوەی باشترین ئامۆژگاریت بداتێ بۆ زیادکردنی سەردانیکەر و ڕێکخستنی پرۆفایلەکەت.
            </p>
            <Button className="rounded-xl font-medium shadow-md hover:shadow-lg transition-all" variant="default">
              دەستپێکردنی گفتوگۆ
            </Button>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4 text-muted-foreground">
            <LinkIcon size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">لینکەکانت نوێ بکەرەوە</h3>
          <p className="text-muted-foreground mb-6">
            دواترین بەرهەمەکانت و سۆشیاڵ میدیاکانت زیاد بکە بۆ ئەوەی شوێنکەوتووانت ئاگادار بن.
          </p>
          <Button asChild className="rounded-xl font-medium">
            <Link href="/داشبۆرد/لینکی-بیو">چوون بۆ لینکی بیو</Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
