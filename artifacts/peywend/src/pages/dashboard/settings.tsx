import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useGetMe, useUpdateProfile, useUpdateSocialLinks, getGetMeQueryKey } from "@workspace/api-client-react";
import { customFetch } from "@workspace/api-client-react";
import { profileSchema, socialLinksSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel,
  FormMessage, FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { Save, User, Link as LinkIcon, Palette, Upload, Camera } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Settings() {
  const { data: user, isLoading } = useGetMe();
  const updateProfile    = useUpdateProfile();
  const updateSocialLinks = useUpdateSocialLinks();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", bio: "", avatarUrl: "" },
  });

  const socialForm = useForm<z.infer<typeof socialLinksSchema>>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: { instagram: "", tiktok: "", youtube: "", snapchat: "", twitter: "", linkedin: "", twitch: "" },
  });

  const initializedRef = useRef(false);
  useEffect(() => {
    if (user && !initializedRef.current) {
      initializedRef.current = true;
      profileForm.reset({ name: user.name || "", bio: user.bio || "", avatarUrl: user.avatarUrl || "" });
      socialForm.reset({
        instagram: user.instagram || "", tiktok: user.tiktok || "", youtube: user.youtube || "",
        snapchat: user.snapchat || "", twitter: user.twitter || "", linkedin: user.linkedin || "", twitch: user.twitch || "",
      });
    }
  }, [user]);

  // ── Avatar file upload ──────────────────────────────────────────────────
  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const data = await customFetch<{ avatarUrl: string }>("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });
      profileForm.setValue("avatarUrl", data.avatarUrl);
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      toast({ title: "وێنەکە بار کرا", description: "وێنەی پرۆفایلت نوێ کرایەوە." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "هەڵە", description: err?.data?.error || "نەتوانرا وێنەکە بار بکرێت." });
    } finally {
      setAvatarUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onProfileSubmit = (values: z.infer<typeof profileSchema>) => {
    updateProfile.mutate({ data: values }, {
      onSuccess: (updated) => {
        queryClient.setQueryData(getGetMeQueryKey(), updated);
        toast({ title: "پاشکەوتکرا", description: "زانیارییەکانی پرۆفایلەکەت پاشکەوتکرا." });
      },
      onError: () => toast({ variant: "destructive", title: "هەڵە", description: "نەتوانرا زانیارییەکان پاشکەوت بکرێن." }),
    });
  };

  const onSocialSubmit = (values: z.infer<typeof socialLinksSchema>) => {
    updateSocialLinks.mutate({ data: values }, {
      onSuccess: (updated) => {
        queryClient.setQueryData(getGetMeQueryKey(), updated);
        toast({ title: "پاشکەوتکرا", description: "لینکە کۆمەڵایەتییەکانت پاشکەوتکرا." });
      },
      onError: () => toast({ variant: "destructive", title: "هەڵە", description: "نەتوانرا زانیارییەکان پاشکەوت بکرێن." }),
    });
  };

  if (isLoading) return (
    <DashboardLayout>
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    </DashboardLayout>
  );

  const avatarPreview = profileForm.watch("avatarUrl");

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">ڕێکخستنەکان</h1>
        <p className="text-muted-foreground mt-1 text-sm">پرۆفایلەکەت و زانیارییە کەسییەکانت لێرە ڕێکبخە.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6" dir="rtl">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="profile" className="rounded-lg gap-2 text-sm"><User size={16} />زانیاری کەسی</TabsTrigger>
          <TabsTrigger value="social"  className="rounded-lg gap-2 text-sm"><LinkIcon size={16} />سۆشیاڵ میدیا</TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-lg gap-2 text-sm" disabled>
            <Palette size={16} />ڕووکار <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full mr-2">بەمزوانە</span>
          </TabsTrigger>
        </TabsList>

        {/* ── Profile tab ──────────────────────────────────────────── */}
        <TabsContent value="profile">
          <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border/50">
              <CardTitle>زانیاری پرۆفایل</CardTitle>
              <CardDescription>ئەم زانیارییانە لە پەڕەی گشتیتدا دەردەکەون.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar section */}
                    <div className="flex flex-col items-center gap-3 shrink-0">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-md bg-primary/10">
                        {avatarPreview
                          ? <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-primary text-3xl font-bold">{user?.name?.charAt(0) || "U"}</div>
                        }
                        {avatarUploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>

                      {/* Upload button */}
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
                      <Button type="button" variant="outline" size="sm" className="gap-2 rounded-xl text-xs"
                        onClick={() => fileRef.current?.click()} disabled={avatarUploading}>
                        <Camera size={14} />
                        بارکردنی وێنە
                      </Button>
                    </div>

                    <div className="flex-1 space-y-5">
                      <FormField control={profileForm.control} name="avatarUrl" render={({ field }) => (
                        <FormItem>
                          <FormLabel>لینکی وێنەی پرۆفایل</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/avatar.jpg" dir="ltr" className="text-left" {...field} />
                          </FormControl>
                          <FormDescription>لینکێکی وێنە دابنێ یان وێنەیەک بار بکە.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={profileForm.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>ناوی پیشاندراو</FormLabel>
                          <FormControl><Input placeholder="ناوی تەواوت" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={profileForm.control} name="bio" render={({ field }) => (
                        <FormItem>
                          <FormLabel>بایۆ / دەربارە</FormLabel>
                          <FormControl>
                            <Textarea placeholder="کەمێک دەربارەی خۆت بنووسە..." className="resize-none h-24" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-border/50">
                    <Button type="submit" className="rounded-xl px-8 gap-2 font-bold" disabled={updateProfile.isPending}>
                      {updateProfile.isPending ? <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
                      پاشکەوتکردن
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Social tab ───────────────────────────────────────────── */}
        <TabsContent value="social">
          <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border/50">
              <CardTitle>لینکە کۆمەڵایەتییەکان</CardTitle>
              <CardDescription>بەستەری هەژمارەکانت لە سۆشیاڵ میدیا دابنێ.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...socialForm}>
                <form onSubmit={socialForm.handleSubmit(onSocialSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      { name: "instagram" as const, label: "Instagram", prefix: "@" },
                      { name: "tiktok"    as const, label: "TikTok",    prefix: "@" },
                      { name: "youtube"   as const, label: "YouTube",   prefix: "@" },
                      { name: "twitter"   as const, label: "Twitter / X", prefix: "@" },
                      { name: "snapchat"  as const, label: "Snapchat",  prefix: "@" },
                      { name: "linkedin"  as const, label: "LinkedIn",  prefix: "in/" },
                    ].map(({ name, label, prefix }) => (
                      <FormField key={name} control={socialForm.control} name={name} render={({ field }) => (
                        <FormItem>
                          <FormLabel>{label}</FormLabel>
                          <FormControl>
                            <div className="relative flex items-center" dir="ltr">
                              <span className="absolute left-3 text-muted-foreground select-none text-sm">{prefix}</span>
                              <Input placeholder="username" className={`${prefix.length > 1 ? "pl-9" : "pl-8"} text-left`}
                                {...field} value={field.value || ""} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    ))}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-border/50">
                    <Button type="submit" className="rounded-xl px-8 gap-2 font-bold" disabled={updateSocialLinks.isPending}>
                      {updateSocialLinks.isPending ? <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
                      پاشکەوتکردن
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
