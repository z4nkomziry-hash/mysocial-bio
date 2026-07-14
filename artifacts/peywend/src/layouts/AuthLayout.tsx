import { useAuth } from "@/context/AuthContext";
import { Link, Redirect } from "wouter";
import { Logo } from "@/components/Logo";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Redirect to="/داشبۆرد" />;
  }

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background rtl:flex-row-reverse">
      {/* Left (or right in RTL) side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <Logo />
          </div>
          {children}
        </div>
      </div>
      
      {/* Right side - Visual */}
      <div className="hidden lg:block relative flex-1 bg-primary/5">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            پەیوەند لینکەکانت، گەیاندن بە جیهان
          </h2>
          <p className="text-lg text-muted-foreground max-w-md">
            هەموو لینکەکانت، بەرهەمەکانت و کارەکانت لە یەک شوێنی تایبەت و جوان کۆبکەرەوە.
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
