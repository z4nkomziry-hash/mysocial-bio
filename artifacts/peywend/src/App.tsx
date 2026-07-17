import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AuthProvider } from '@/context/AuthContext';

import Landing from '@/pages/landing';
import Login from '@/pages/auth/login';
import RegisterStep1 from '@/pages/auth/register-step1';
import RegisterStep2 from '@/pages/auth/register-step2';
import ForgotPassword from '@/pages/auth/forgot-password';
import ResetPassword from '@/pages/auth/reset-password';
import DashboardHome from '@/pages/dashboard/home';
import LinkInBio from '@/pages/dashboard/link-in-bio';
import Analytics from '@/pages/dashboard/analytics';
import Settings from '@/pages/dashboard/settings';
import PublicProfile from '@/pages/public-profile';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />

      {/* Auth */}
      <Route path="/چوونەژوورەوە"               component={Login} />
      <Route path="/تومارکردن"                   component={RegisterStep1} />
      <Route path="/تومارکردن/زانیاری"           component={RegisterStep2} />
      <Route path="/وشەی-نهێنی-فەرامۆشکردم"     component={ForgotPassword} />
      <Route path="/ڕێکخستنەوەی-وشەی-نهێنی"    component={ResetPassword} />

      {/* Dashboard */}
      <Route path="/داشبۆرد"               component={DashboardHome} />
      <Route path="/داشبۆرد/لینکی-بیو"    component={LinkInBio} />
      <Route path="/داشبۆرد/شیکاری"       component={Analytics} />
      <Route path="/داشبۆرد/ڕێکخستن"     component={Settings} />

      {/* Public profile — must come last */}
      <Route path="/:username" component={PublicProfile} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
