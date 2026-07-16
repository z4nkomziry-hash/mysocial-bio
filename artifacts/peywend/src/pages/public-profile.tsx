import { useState } from "react";
import { useGetPublicProfile, useRecordClick } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, LinkIcon, Share2, CheckCheck } from "lucide-react";
import { SiInstagram, SiTiktok, SiYoutube, SiSnapchat, SiX, SiTwitch } from "react-icons/si";
import { Linkedin } from "lucide-react";

const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }
  }),
};

const linkVariant = {
  hidden: { opacity: 0, scale: 0.93, y: 14 },
  show: (i: number) => ({
    opacity: 1, scale: 1, y: 0,
    transition: { delay: 0.3 + i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }
  }),
};

/* gradient colors cycling for links */
const LINK_GRADIENTS = [
  ["#7c3aed", "#6d28d9"],
  ["#db2777", "#be185d"],
  ["#0891b2", "#0e7490"],
  ["#059669", "#047857"],
  ["#d97706", "#b45309"],
  ["#2563eb", "#1d4ed8"],
];

function SkeletonProfile() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center pt-20 px-4 bg-background">
      <div className="w-28 h-28 rounded-full bg-muted animate-pulse mb-5" />
      <div className="w-40 h-6 bg-muted rounded-full animate-pulse mb-3" />
      <div className="w-64 h-4 bg-muted rounded-full animate-pulse mb-10" />
      <div className="w-full max-w-sm space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="w-full h-14 bg-muted rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const { data: profile, isLoading, isError } = useGetPublicProfile(username || "", {
    query: { enabled: !!username, retry: false }
  });
  const recordClick = useRecordClick();
  const [copied, setCopied] = useState(false);

  const handleLinkClick = (linkId: number, url: string) => {
    recordClick.mutate({ data: { linkId, username } });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: profile?.name, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) return <SkeletonProfile />;

  if (isError || !profile) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-4 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 text-4xl">
          😕
        </motion.div>
        <h1 className="text-2xl font-bold mb-2">پرۆفایل نەدۆزرایەوە</h1>
        <p className="text-muted-foreground mb-8">ئەم پرۆفایلە بوونی نییە یان سڕاوەتەوە.</p>
        <a href="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
          <LinkIcon size={16} />
          گەڕانەوە بۆ پەیوەند
        </a>
      </div>
    );
  }

  const themeColor = profile.themeColor || "#7c3aed";
  const blocks = profile.blocks
    ? profile.blocks.filter(b => b.isVisible).sort((a, b) => a.blockOrder - b.blockOrder)
    : [];

  const socials = [
    { key: "instagram", href: `https://instagram.com/${profile.instagram}`,    Icon: SiInstagram, color: "#E1306C" },
    { key: "tiktok",    href: `https://tiktok.com/@${profile.tiktok}`,         Icon: SiTiktok,    color: "#ffffff" },
    { key: "youtube",   href: `https://youtube.com/${profile.youtube}`,        Icon: SiYoutube,   color: "#FF0000" },
    { key: "twitter",   href: `https://twitter.com/${profile.twitter}`,        Icon: SiX,         color: "#ffffff" },
    { key: "snapchat",  href: `https://snapchat.com/add/${profile.snapchat}`,  Icon: SiSnapchat,  color: "#FFFC00" },
    { key: "linkedin",  href: `https://linkedin.com/in/${profile.linkedin}`,   Icon: Linkedin,    color: "#0A66C2" },
    { key: "twitch",    href: `https://twitch.tv/${profile.twitch}`,           Icon: SiTwitch,    color: "#9146FF" },
  ].filter(s => !!(profile as any)[s.key]);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground selection:bg-primary/20 flex flex-col">

      {/* Gradient header background */}
      <div className="fixed inset-x-0 top-0 h-72 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse 80% 60% at 50% -10%, ${themeColor}30 0%, transparent 70%)`
        }} />
      </div>

      {/* Share button */}
      <div className="fixed top-4 left-4 z-50">
        <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          onClick={handleShare}
          className="glass-light dark:glass w-10 h-10 rounded-full flex items-center justify-center shadow-lg border border-border/50 text-foreground hover:scale-105 active:scale-95 transition-transform">
          <AnimatePresence mode="wait">
            {copied
              ? <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><CheckCheck size={16} className="text-emerald-500" /></motion.span>
              : <motion.span key="share" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Share2 size={16} /></motion.span>
            }
          </AnimatePresence>
        </motion.button>
      </div>

      <div className="w-full max-w-md mx-auto px-4 pt-14 pb-16 flex-1 flex flex-col">

        {/* ── Avatar & Identity ── */}
        <motion.header initial="hidden" animate="show" className="flex flex-col items-center text-center mb-8">
          <motion.div variants={fadeUp} custom={0} className="relative mb-5">
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full blur-xl opacity-50 scale-110"
              style={{ background: `radial-gradient(circle, ${themeColor}60, transparent)` }} />
            <div className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-background shadow-2xl"
              style={{ boxShadow: `0 0 0 3px ${themeColor}40, 0 20px 40px ${themeColor}30` }}>
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl font-black text-white"
                  style={{ background: `linear-gradient(135deg, ${themeColor}, ${themeColor}99)` }}>
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
          </motion.div>

          <motion.h1 variants={fadeUp} custom={1} className="text-2xl font-black mb-1.5">{profile.name}</motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-sm text-muted-foreground mb-1 font-medium">@{profile.username}</motion.p>

          {profile.bio && (
            <motion.p variants={fadeUp} custom={3}
              className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed mt-3 whitespace-pre-wrap">
              {profile.bio}
            </motion.p>
          )}

          {/* Social icons */}
          {socials.length > 0 && (
            <motion.div variants={fadeUp} custom={4} className="flex flex-wrap justify-center gap-2.5 mt-5">
              {socials.map(({ key, href, Icon, color }) => (
                <motion.a key={key} href={href} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.92 }}
                  className="w-10 h-10 rounded-2xl bg-muted/60 border border-border/50 flex items-center justify-center hover:bg-muted transition-colors shadow-sm">
                  <Icon size={18} style={{ color }} />
                </motion.a>
              ))}
            </motion.div>
          )}
        </motion.header>

        {/* ── Content blocks ── */}
        <main className="flex-1 w-full space-y-5">
          {blocks.map((block, blockIdx) => (
            <div key={block.id}>

              {/* Header block */}
              {block.type === "header" && (
                <motion.div variants={fadeUp} custom={blockIdx} initial="hidden" animate="show"
                  className="text-center py-3">
                  <h2 className="text-base font-bold text-muted-foreground uppercase tracking-widest">{block.title}</h2>
                  {block.content && <p className="text-muted-foreground text-sm mt-1">{block.content}</p>}
                </motion.div>
              )}

              {/* Text block */}
              {block.type === "text" && (
                <motion.div variants={fadeUp} custom={blockIdx} initial="hidden" animate="show"
                  className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 text-center">
                  {block.title && <h3 className="font-bold mb-2">{block.title}</h3>}
                  {block.content && <p className="text-muted-foreground text-sm whitespace-pre-wrap">{block.content}</p>}
                </motion.div>
              )}

              {/* Links block */}
              {block.type === "links" && block.links && block.links.length > 0 && (
                <div className="space-y-3">
                  {block.title && (
                    <motion.p variants={fadeUp} custom={blockIdx} initial="hidden" animate="show"
                      className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">
                      {block.title}
                    </motion.p>
                  )}
                  {[...block.links].sort((a, b) => a.linkOrder - b.linkOrder).map((link, i) => {
                    const [from, to] = LINK_GRADIENTS[i % LINK_GRADIENTS.length];
                    return (
                      <motion.button key={link.id}
                        variants={linkVariant} custom={i} initial="hidden" animate="show"
                        whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                        onClick={() => handleLinkClick(link.id, link.url)}
                        className="w-full relative group overflow-hidden rounded-2xl shadow-md border border-border/30 transition-shadow hover:shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${from}18, ${to}10)` }}>
                        {/* shimmer sweep on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ background: `linear-gradient(135deg, ${from}10, ${to}18)` }} />
                        <div className="relative flex items-center p-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mr-3"
                            style={{ background: `linear-gradient(135deg, ${from}30, ${to}20)`, border: `1px solid ${from}30` }}>
                            <LinkIcon size={18} style={{ color: from }} />
                          </div>
                          <span className="flex-1 text-center font-bold text-sm truncate px-2">{link.title}</span>
                          <div className="w-8 flex justify-end shrink-0">
                            <ExternalLink size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                          </div>
                        </div>
                        {/* click count badge */}
                        {link.clickCount != null && link.clickCount > 0 && (
                          <div className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: `${from}25`, color: from }}>
                            {link.clickCount}
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}

            </div>
          ))}

          {blocks.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-center py-16 bg-muted/30 rounded-3xl border border-dashed border-border">
              <div className="text-4xl mb-3">🌱</div>
              <p className="text-muted-foreground text-sm">هیچ زانیارییەک زیاد نەکراوە هێشتا.</p>
            </motion.div>
          )}
        </main>

        {/* Footer badge */}
        <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="mt-14 flex justify-center">
          <a href="/" className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-muted/50 hover:bg-muted rounded-full text-sm font-bold transition-colors border border-border/50 shadow-sm hover:shadow-md group">
            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm shadow-violet-500/30">
              <LinkIcon size={12} className="text-white" />
            </span>
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">بنیاتنراوە بە پەیوەند</span>
          </a>
        </motion.footer>
      </div>
    </div>
  );
}
