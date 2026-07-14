import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ArrowLeft, Sparkles, Smartphone, BarChart3, Palette, Globe, CheckCircle2, LinkIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href="/چوونەژوورەوە">چوونەژوورەوە</Link>
            </Button>
            <Button asChild className="rounded-full px-6 shadow-sm shadow-primary/20">
              <Link href="/تومارکردن">دروستکردنی ژمارە</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute top-20 right-0 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-3xl -z-10 pointer-events-none" />
          
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-8 text-sm font-medium"
            >
              <Sparkles size={16} />
              <span>پلاتفۆرمی سەرەکی بۆ دروستکەرانی کورد</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.2] tracking-tight"
            >
              پەیوەند لینکەکانت،<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-secondary">
                گەیاندن بە جیهان
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              هەموو لینکەکانت، بەرهەمەکانت و کارەکانت لە یەک شوێنی تایبەت و جوان کۆبکەرەوە. 
              بەخۆڕایی، خێرا، و بەتەواوی بە زمانی کوردی.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button size="lg" className="w-full sm:w-auto rounded-full h-14 px-8 text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1" asChild>
                <Link href="/تومارکردن">
                  دەستپێبکە بەخۆڕایی
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full h-14 px-8 text-lg font-bold" asChild>
                <Link href="/چوونەژوورەوە">چوونەژوورەوە</Link>
              </Button>
            </motion.div>

            {/* Hero Mockup */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-20 relative mx-auto max-w-4xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 h-full" />
              <div className="relative rounded-2xl md:rounded-[2.5rem] border border-border/50 bg-card/50 backdrop-blur-sm p-2 md:p-4 shadow-2xl mx-4">
                <div className="aspect-[16/9] rounded-xl md:rounded-2xl overflow-hidden bg-muted relative flex items-center justify-center">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary p-1 mb-6 shadow-xl shadow-primary/20">
                      <div className="w-full h-full rounded-full border-4 border-background bg-card flex items-center justify-center overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Peywend" alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">ناوی بەکارهێنەر</h3>
                    <p className="text-muted-foreground mb-8">ئەمە شوێنی پرۆفایلی تۆیە</p>
                    <div className="w-full max-w-sm space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-full h-14 rounded-xl bg-card border shadow-sm flex items-center px-4 hover:scale-[1.02] transition-transform cursor-pointer">
                          <div className="w-8 h-8 rounded-full bg-muted mr-3"></div>
                          <div className="h-4 bg-muted rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">هەموو ئەوەی پێویستتە لە یەک جێگادا</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                پەیوەند تەنها بۆ دانانی لینک نییە. پلاتفۆرمێکی تەواوە بۆ پیشاندانی کەسایەتی، کارەکان و بەرهەمەکانت.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Smartphone, title: "گونجاو بۆ مۆبایل", desc: "دیزاینێکی جوان و خێرا کە لەسەر هەموو شاشەیەک بە باشی کاردەکات." },
                { icon: Palette, title: "دیزاینی تایبەت", desc: "ڕەنگەکان، فۆنتەکان و شێوازی پرۆفایلەکەت بە ویستی خۆت ڕێکبخە." },
                { icon: BarChart3, title: "ئامار و شیکاری", desc: "بزانە چەند کەس سەردانی پرۆفایلەکەی کردووە و کلیکی لەسەر لینکەکانت کردووە." },
                { icon: Globe, title: "زمانی کوردی", desc: "یەکەمین پلاتفۆرمی لەم جۆرە کە بەتەواوی پشتیوانی زمانی کوردی دەکات." },
                { icon: LinkIcon, title: "لینکی بێسنوور", desc: "هەرچەند لینکت هەیە زیادی بکە، بێ هیچ سنوورێک و بەرامبەرێک." },
                { icon: Sparkles, title: "کیتی میدیا", desc: "زانیارییەکانت و ئامارەکانت بەشێوەیەکی پرۆفیشناڵ پێشکەشی سپۆنسەرەکان بکە." },
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-3xl bg-background border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-24 overflow-hidden relative">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 lg:pl-12 space-y-10">
                <h2 className="text-3xl md:text-4xl font-bold leading-[1.3]">
                  لە چەند خولەکێکدا پرۆفایلەکەت ئامادە بکە
                </h2>
                
                <div className="space-y-8">
                  {[
                    { step: "١", title: "ناوی بەکارهێنەر هەڵبژێرە", desc: "ناوەکەت یان ناوی براندەکەت بنووسە بۆ دروستکردنی لینکەکەت." },
                    { step: "٢", title: "لینکەکانت زیاد بکە", desc: "سۆشیاڵ میدیاکانت، ماڵپەڕەکەت، ڤیدیۆکانت و بەرهەمەکانت دابنێ." },
                    { step: "٣", title: "لینکەکەت بڵاوبکەرەوە", desc: "لینکەکەت کۆپی بکە و لە بایۆی ئینستاگرام، تیکتۆک و تویتەر دایبنێ." },
                  ].map((s, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-12 h-12 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shadow-md shadow-primary/20">
                        {s.step}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                        <p className="text-muted-foreground">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button size="lg" className="rounded-full h-14 px-8 text-lg font-bold shadow-lg shadow-primary/25 w-full sm:w-auto" asChild>
                  <Link href="/تومارکردن">ئێستا دروستی بکە</Link>
                </Button>
              </div>
              
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[3rem] blur-3xl -z-10" />
                <div className="aspect-[4/5] max-w-md mx-auto rounded-[3rem] border-[8px] border-card bg-background shadow-2xl overflow-hidden relative">
                  {/* Phone Notch */}
                  <div className="absolute top-0 inset-x-0 h-6 bg-card rounded-b-3xl w-40 mx-auto z-20"></div>
                  
                  {/* Content Simulation */}
                  <div className="h-full flex flex-col p-6 bg-gradient-to-b from-primary/5 to-background pt-12">
                    <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 mb-4 animate-pulse"></div>
                    <div className="w-32 h-6 mx-auto bg-muted rounded-md mb-2"></div>
                    <div className="w-48 h-4 mx-auto bg-muted rounded-md mb-8"></div>
                    
                    <div className="space-y-4 flex-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-full h-12 bg-card rounded-xl border flex items-center px-4">
                          <div className="w-6 h-6 rounded-full bg-muted mr-3"></div>
                          <div className="w-1/2 h-3 bg-muted rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              ئامادەیت بۆ دەستپێکردن؟
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
              پەیوەندی بکە بە هەزاران دروستکەری ناوەڕۆکەوە کە پەیوەند بەکاردەهێنن. بەخۆڕایی دەستپێبکە.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto rounded-full h-14 px-8 text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1" asChild>
                <Link href="/تومارکردن">
                  دروستکردنی پرۆفایل
                </Link>
              </Button>
            </div>
            
            <div className="mt-10 flex items-center justify-center gap-6 text-sm font-medium text-primary-foreground/70">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} /> بەخۆڕایی</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} /> خێرا</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} /> کوردی</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card py-12 border-t">
        <div className="container mx-auto px-4 text-center">
          <Logo className="justify-center mb-6" asLink={false} />
          <p className="text-muted-foreground mb-8">
            بنیاتنراوە بۆ دروستکەرانی کورد. هەموو مافێک پارێزراوە.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">مەرجەکانی بەکارهێنان</a>
            <a href="#" className="hover:text-primary transition-colors">تایبەتمەندی</a>
            <a href="#" className="hover:text-primary transition-colors">پەیوەندی</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
