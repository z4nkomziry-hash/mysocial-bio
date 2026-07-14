import { useState } from "react";
import { useGetMe, useGetPublicProfile, useRecordClick } from "@workspace/api-client-react";
import { useParams, Redirect } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Link as LinkIcon, MapPin, Mail, Calendar, ExternalLink, Linkedin } from "lucide-react";
import { SiInstagram, SiTiktok, SiYoutube, SiSnapchat, SiX, SiTwitch } from "react-icons/si";

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const { data: profile, isLoading, isError } = useGetPublicProfile(username || "", {
    query: {
      enabled: !!username,
      retry: false
    }
  });
  const recordClick = useRecordClick();

  const handleLinkClick = (linkId: number, url: string) => {
    // Record click asynchronously
    recordClick.mutate({ data: { linkId, username } });
    
    // Open URL in new tab
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col items-center pt-20 px-4">
        <Skeleton className="w-24 h-24 rounded-full mb-6" />
        <Skeleton className="w-48 h-8 mb-4" />
        <Skeleton className="w-64 h-4 mb-8" />
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="w-full h-14 rounded-xl" />
          <Skeleton className="w-full h-14 rounded-xl" />
          <Skeleton className="w-full h-14 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <span className="text-3xl">😕</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">پرۆفایل نەدۆزرایەوە</h1>
        <p className="text-muted-foreground mb-8">
          ئەم پرۆفایلە بوونی نییە یان سڕاوەتەوە.
        </p>
        <a href="/" className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:opacity-90 transition-opacity">
          گەڕانەوە بۆ پەیوەند
        </a>
      </div>
    );
  }

  // Get the first page (usually home page)
  const page = profile.pages && profile.pages.length > 0 ? profile.pages[0] : null;
  // Get visible blocks
  const blocks = profile.blocks ? profile.blocks.filter(b => b.isVisible).sort((a, b) => a.blockOrder - b.blockOrder) : [];

  return (
    <div className="min-h-[100dvh] bg-background selection:bg-primary/20 selection:text-primary flex flex-col pb-12">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-xl mx-auto px-4 pt-12 md:pt-20 flex-1 flex flex-col">
        
        {/* Header / Identity */}
        <header className="flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-background bg-card shadow-xl overflow-hidden mb-5">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-4xl font-bold">
                {profile.name.charAt(0)}
              </div>
            )}
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{profile.name}</h1>
          
          {profile.bio && (
            <p className="text-muted-foreground max-w-md mx-auto mb-6 whitespace-pre-wrap">
              {profile.bio}
            </p>
          )}

          {/* Social Icons Row */}
          <div className="flex flex-wrap justify-center gap-4 mb-2">
            {profile.instagram && (
              <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-card rounded-full hover:bg-muted transition-colors hover:scale-110 shadow-sm border border-border/50">
                <SiInstagram size={22} className="text-[#E1306C]" />
              </a>
            )}
            {profile.tiktok && (
              <a href={`https://tiktok.com/@${profile.tiktok}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-card rounded-full hover:bg-muted transition-colors hover:scale-110 shadow-sm border border-border/50">
                <SiTiktok size={22} className="text-foreground" />
              </a>
            )}
            {profile.youtube && (
              <a href={`https://youtube.com/${profile.youtube}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-card rounded-full hover:bg-muted transition-colors hover:scale-110 shadow-sm border border-border/50">
                <SiYoutube size={22} className="text-[#FF0000]" />
              </a>
            )}
            {profile.twitter && (
              <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-card rounded-full hover:bg-muted transition-colors hover:scale-110 shadow-sm border border-border/50">
                <SiX size={22} className="text-foreground" />
              </a>
            )}
            {profile.snapchat && (
              <a href={`https://snapchat.com/add/${profile.snapchat}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-card rounded-full hover:bg-muted transition-colors hover:scale-110 shadow-sm border border-border/50">
                <SiSnapchat size={22} className="text-[#FFFC00]" />
              </a>
            )}
            {profile.linkedin && (
              <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-card rounded-full hover:bg-muted transition-colors hover:scale-110 shadow-sm border border-border/50">
                <Linkedin size={22} className="text-[#0A66C2]" />
              </a>
            )}
            {profile.twitch && (
              <a href={`https://twitch.tv/${profile.twitch}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-card rounded-full hover:bg-muted transition-colors hover:scale-110 shadow-sm border border-border/50">
                <SiTwitch size={22} className="text-[#9146FF]" />
              </a>
            )}
          </div>
        </header>

        {/* Content Blocks */}
        <main className="flex-1 w-full space-y-6">
          {blocks.map((block) => (
            <div key={block.id} className="w-full">
              
              {/* Header Block */}
              {block.type === 'header' && (
                <div className="text-center pt-4 pb-2">
                  <h2 className="text-xl font-bold">{block.title}</h2>
                  {block.content && <p className="text-muted-foreground text-sm mt-1">{block.content}</p>}
                </div>
              )}

              {/* Text Block */}
              {block.type === 'text' && (
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 text-center">
                  {block.title && <h3 className="font-bold mb-2">{block.title}</h3>}
                  {block.content && <p className="text-muted-foreground whitespace-pre-wrap">{block.content}</p>}
                </div>
              )}

              {/* Links Block */}
              {block.type === 'links' && block.links && block.links.length > 0 && (
                <div className="space-y-3">
                  {block.title && <h3 className="text-sm font-bold text-muted-foreground px-2">{block.title}</h3>}
                  {block.links.sort((a, b) => a.linkOrder - b.linkOrder).map((link) => (
                    <button
                      key={link.id}
                      onClick={() => handleLinkClick(link.id, link.url)}
                      className="w-full relative group bg-card hover:bg-muted/50 transition-all border border-border/50 p-4 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mr-3">
                        <LinkIcon size={20} />
                      </div>
                      <div className="flex-1 text-center font-bold px-2 truncate">
                        {link.title}
                      </div>
                      <div className="w-10 flex justify-end shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
                        <ExternalLink size={20} />
                      </div>
                    </button>
                  ))}
                </div>
              )}

            </div>
          ))}

          {blocks.length === 0 && (
            <div className="text-center p-8 bg-card border border-dashed rounded-2xl">
              <p className="text-muted-foreground">هیچ زانیارییەک زیاد نەکراوە بۆ ئەم پرۆفایلە.</p>
            </div>
          )}
        </main>

        <footer className="mt-16 text-center">
          <a href="/" className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted rounded-full text-sm font-medium transition-colors border">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <LinkIcon size={12} />
            </span>
            <span>بنیاتنراوە بە پەیوەند</span>
          </a>
        </footer>

      </div>
    </div>
  );
}
