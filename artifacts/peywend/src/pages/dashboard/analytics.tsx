import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useGetAnalytics } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart3, MousePointerClick, TrendingUp, Link as LinkIcon, ExternalLink } from "lucide-react";

export default function Analytics() {
  const { data: analytics, isLoading } = useGetAnalytics();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">شیکاری</h1>
        <p className="text-muted-foreground mt-2">ئاماری وردی سەردانیکەران و کلیکەکانی پرۆفایلەکەت.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card className="bg-card shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کۆی گشتی کلیکەکان</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <MousePointerClick size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics?.totalClicks?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp size={12} className="text-green-500" />
              لە سەرەتای دروستکردنەوە
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">لینکی تۆمارکراو</CardTitle>
            <div className="p-2 bg-secondary/10 rounded-full text-secondary">
              <LinkIcon size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics?.totalLinks?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">ئێستا لە پرۆفایلەکەتدا هەیە</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card shadow-sm border-border/50 mb-8 rounded-2xl overflow-hidden">
        <CardHeader className="bg-muted/20 border-b border-border/50">
          <CardTitle>کلیکەکان لە ٣٠ ڕۆژی ڕابردوودا</CardTitle>
          <CardDescription>ژمارەی کلیک لەسەر سەرجەم لینکەکانت</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {analytics?.clicksByDay && analytics.clicksByDay.length > 0 ? (
            <div className="h-[300px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analytics.clicksByDay}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                      direction: 'rtl'
                    }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
                    labelFormatter={(value) => {
                      const date = new Date(value as string);
                      return date.toLocaleDateString('ku-IQ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                    }}
                    formatter={(value) => [value, 'کلیک']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorClicks)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border/50 rounded-xl">
              <BarChart3 size={48} className="mb-4 text-muted/50" />
              <p>هێشتا هیچ داتایەک نییە بۆ پیشاندان.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card shadow-sm border-border/50 rounded-2xl overflow-hidden">
        <CardHeader className="bg-muted/20 border-b border-border/50">
          <CardTitle>باشترین لینکەکان</CardTitle>
          <CardDescription>ئەو لینکانەی زۆرترین کلیکیان لەسەر کراوە</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {analytics?.topLinks && analytics.topLinks.length > 0 ? (
            <div className="divide-y divide-border/50">
              {analytics.topLinks.map((link, index) => (
                <div key={link.linkId} className="flex items-center justify-between p-4 sm:px-6 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{link.title}</p>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-muted-foreground hover:text-primary hover:underline flex items-center gap-1 truncate"
                        dir="ltr"
                      >
                        {link.url}
                        <ExternalLink size={10} className="shrink-0" />
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1 rounded-full shrink-0">
                    <span className="font-bold">{link.clicks}</span>
                    <span className="text-xs">کلیک</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              هێشتا هیچ کلیکێک نەکراوە لەسەر لینکەکانت.
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}