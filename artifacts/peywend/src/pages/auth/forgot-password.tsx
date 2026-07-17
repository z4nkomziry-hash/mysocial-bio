import { useState } from "react";
import { Link, Redirect } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { customFetch } from "@workspace/api-client-react";

export default function ForgotPassword() {
  const { user, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isLoading && user) return <Redirect to="/داشبۆرد" />;

  const resetLink = resetToken
    ? `${window.location.origin}/ڕێکخستنەوەی-وشەی-نهێنی?token=${resetToken}`
    : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(resetLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setPending(true);
    setError("");
    try {
      const data = await customFetch<{ success: boolean; resetToken?: string }>(
        "/api/auth/forgot-password",
        { method: "POST", body: JSON.stringify({ email }), headers: { "Content-Type": "application/json" } }
      );
      setResetToken(data.resetToken ?? null);
    } catch (err: any) {
      setError(err?.data?.error || "هەڵەیەک ڕوویدا، دووبارە هەوڵبدەرەوە.");
    } finally {
      setPending(false);
    }
  };

  if (resetToken) {
    return (
      <AuthLayout>
        <div className="bg-card border shadow-sm rounded-2xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">بەستەری ڕێکخستنەوە</h1>
          <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
            لە دەمی ئاستەنگیی ئیمەیڵ، بەستەری ڕێکخستنەوە لێرەدا دەردەکەوێت. کلیک بکە بۆ ڕێکخستنەوەی وشەی نهێنی.
          </p>

          <div className="flex items-center gap-2 bg-muted/50 rounded-xl p-3 mb-4 text-left" dir="ltr">
            <span className="text-xs text-muted-foreground truncate flex-1 font-mono">{resetLink}</span>
            <button onClick={handleCopy} className="shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors">
              {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </button>
          </div>

          <div className="flex gap-3 justify-center">
            <Button asChild className="gap-2 rounded-xl">
              <a href={resetLink}>
                <ExternalLink size={16} />
                ڕێکخستنەوەی وشەی نهێنی
              </a>
            </Button>
          </div>
        </div>
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <Link href="/چوونەژوورەوە" className="text-primary hover:underline font-bold">گەڕانەوە بۆ چوونەژوورەوە</Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="mb-4">
        <Link href="/چوونەژوورەوە" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowRight size={16} />
          گەڕانەوە
        </Link>
      </div>

      <div className="bg-card border shadow-sm rounded-2xl p-6 sm:p-8">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
          <Mail size={26} className="text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">وشەی نهێنیت فەرامۆش کردووە؟</h1>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          ئیمەیڵەکەت بنووسە، بەستەری ڕێکخستنەوەی وشەی نهێنیت ئەوردەینێ.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label>ئیمەیڵ</Label>
            <Input
              type="email" placeholder="name@example.com"
              dir="ltr" className="text-left"
              value={email} onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full h-12 rounded-xl font-bold gap-2" disabled={pending}>
            {pending
              ? <div className="w-5 h-5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
              : <><Mail size={18} /> ناردنی بەستەری ڕێکخستنەوە</>
            }
          </Button>
        </form>
      </div>

      <div className="text-center mt-6 text-sm text-muted-foreground">
        وشەی نهێنیت لەبیرت هاتەوە؟{" "}
        <Link href="/چوونەژوورەوە" className="text-primary hover:underline font-bold">چوونەژوورەوە</Link>
      </div>
    </AuthLayout>
  );
}
