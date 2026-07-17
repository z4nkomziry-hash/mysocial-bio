import { useState } from "react";
import { Link, Redirect, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, CheckCircle2 } from "lucide-react";
import { customFetch } from "@workspace/api-client-react";

export default function ResetPassword() {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!isLoading && user) return <Redirect to="/داشبۆرد" />;

  // Extract token from query string
  const token = new URLSearchParams(window.location.search).get("token") ?? "";

  if (!token) return <Redirect to="/وشەی-نهێنی-فەرامۆشکردم" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) { setError("وشەی نهێنی دەبێت کەمتر نەبێت لە ٦ پیت"); return; }
    if (password !== confirm) { setError("وشەی نهێنی و دووبارەکردنەوەکەی یەک نین"); return; }
    setPending(true);
    setError("");
    try {
      await customFetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
        headers: { "Content-Type": "application/json" },
      });
      setDone(true);
    } catch (err: any) {
      setError(err?.data?.error || "تۆکنەکە نادروستە یان کاتی تەواو بووە.");
    } finally {
      setPending(false);
    }
  };

  if (done) {
    return (
      <AuthLayout>
        <div className="bg-card border shadow-sm rounded-2xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">وشەی نهێنی گۆڕدرا!</h1>
          <p className="text-muted-foreground mb-6 text-sm">ئێستا دەتوانیت بە وشەی نهێنی نوێ بچیتە ژوورەوە.</p>
          <Button asChild className="rounded-xl font-bold">
            <Link href="/چوونەژوورەوە">چوونەژوورەوە</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="bg-card border shadow-sm rounded-2xl p-6 sm:p-8">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
          <KeyRound size={26} className="text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">وشەی نهێنی نوێ دابنێ</h1>
        <p className="text-muted-foreground mb-8 text-sm">وشەی نهێنی نوێ بنووسە، کەمتر نەبێت لە ٦ پیت.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label>وشەی نهێنی نوێ</Label>
            <Input
              type="password" dir="ltr" className="text-left"
              value={password} onChange={e => setPassword(e.target.value)}
              required minLength={6}
            />
          </div>
          <div className="space-y-1.5">
            <Label>دووبارەکردنەوەی وشەی نهێنی</Label>
            <Input
              type="password" dir="ltr" className="text-left"
              value={confirm} onChange={e => setConfirm(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full h-12 rounded-xl font-bold gap-2" disabled={pending}>
            {pending
              ? <div className="w-5 h-5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
              : <><KeyRound size={18} /> پاشکەوتکردنی وشەی نهێنی نوێ</>
            }
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
