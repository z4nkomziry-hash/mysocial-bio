import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useGetMe, useUpdateProfile, useUpdateSocialLinks } from "@workspace/api-client-react";
import { profileSchema, socialLinksSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useRef } from "react";
import { Save, User, Link as LinkIcon, Palette } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetMeQueryKey } from "@workspace/api-client-react";

export default function Settings() {
  const { data: user, isLoading } = useGetMe();
  const updateProfile = useUpdateProfile();
  const updateSocialLinks = useUpdateSocialLinks();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      bio: "",
      avatarUrl: "",
    },
  });

  const socialForm = useForm<z.infer<typeof socialLinksSchema>>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
      instagram: "",
      tiktok: "",
      youtube: "",
      snapchat: "",
      twitter: "",
      linkedin: "",
      twitch: "",
    },
  });

  const initializedRef = useRef(false);

  useEffect(() => {
    if (user && !initializedRef.current) {
      initializedRef.current = true;
      profileForm.reset({
        name: user.name || "",
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
      });
      socialForm.reset({
        instagram: user.instagram || "",
        tiktok: user.tiktok || "",
        youtube: user.youtube || "",
        snapchat: user.snapchat || "",
        twitter: user.twitter || "",
        linkedin: user.linkedin || "",
        twitch: user.twitch || "",
      });
    }
  }, [user, profileForm, socialForm]);

  function onProfileSubmit(values: z.infer<typeof profileSchema>) {
    updateProfile.mutate(
      { data: values },
      {
        onSuccess: (updatedUser) => {
          queryClient.setQueryData(getGetMeQueryKey(), updatedUser);
          toast({
            title: "پاشکەوتکرا",
            description: "زانیارییەکانی پرۆفایلەکەت بە سەرکەوتوویی پاشکەوتکرا.",
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "هەڵە",
            description: "نەتوانرا زانیارییەکان پاشکەوت بکرێن.",
          });
        }
      }
    );
  }

  function onSocialSubmit(values: z.infer<typeof socialLinksSchema>) {
    updateSocialLinks.mutate(
      { data: values },
      {
        onSuccess: (updatedUser) => {
          queryClient.setQueryData(getGetMeQueryKey(), updatedUser);
          toast({
            title: "پاشکەوتکرا",
            description: "لینکە کۆمەڵایەتییەکانت بە سەرکەوتوویی پاشکەوتکرا.",
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "هەڵە",
            description: "نەتوانرا زانیارییەکان پاشکەوت بکرێن.",
          });
        }
      }
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ڕێکخستنەکان</h1>
          <p className="text-muted-foreground mt-2">پرۆفایلەکەت و زانیارییە کەسییەکانت لێرە ڕێکبخە.</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6" dir="rtl">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="profile" className="rounded-lg gap-2 text-sm">
            <User size={16} />
            زانیاری کەسی
          </TabsTrigger>
          <TabsTrigger value="social" className="rounded-lg gap-2 text-sm">
            <LinkIcon size={16} />
            سۆشیاڵ میدیا
          </TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-lg gap-2 text-sm" disabled>
            <Palette size={16} />
            ڕووکار <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full mr-2">بەمزوانە</span>
          </TabsTrigger>
        </TabsList>

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
                    {/* Avatar preview */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold overflow-hidden border-4 border-background shadow-md">
                        {profileForm.watch("avatarUrl") ? (
                          <img src={profileForm.watch("avatarUrl")} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          user?.name?.charAt(0) || "U"
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-5">
                      <FormField
                        control={profileForm.control}
                        name="avatarUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>لینکی وێنەی پرۆفایل</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/avatar.jpg" dir="ltr" className="text-left" {...field} />
                            </FormControl>
                            <FormDescription>
                              لینکێکی وێنە دابنێ بۆ پرۆفایلەکەت.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ناوی پیشاندراو</FormLabel>
                            <FormControl>
                              <Input placeholder="ناوی تەواوت" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>بایۆ / دەربارە</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="کەمێک دەربارەی خۆت بنووسە..." 
                                className="resize-none h-24"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t border-border/50">
                    <Button 
                      type="submit" 
                      className="rounded-xl px-8 gap-2 font-bold" 
                      disabled={updateProfile.isPending}
                    >
                      {updateProfile.isPending ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground" />
                      ) : (
                        <Save size={18} />
                      )}
                      پاشکەوتکردن
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border/50">
              <CardTitle>لینکە کۆمەڵایەتییەکان</CardTitle>
              <CardDescription>بەستەری هەژمارەکانت لە سۆشیاڵ میدیا دابنێ بۆ ئەوەی بە ئایکۆن لە پرۆفایلەکەت دەربکەون.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...socialForm}>
                <form onSubmit={socialForm.handleSubmit(onSocialSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={socialForm.control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram</FormLabel>
                          <FormControl>
                            <div className="relative flex items-center" dir="ltr">
                              <span className="absolute left-3 text-muted-foreground select-none">@</span>
                              <Input placeholder="username" className="pl-8 text-left" {...field} value={field.value || ''} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={socialForm.control}
                      name="tiktok"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>TikTok</FormLabel>
                          <FormControl>
                            <div className="relative flex items-center" dir="ltr">
                              <span className="absolute left-3 text-muted-foreground select-none">@</span>
                              <Input placeholder="username" className="pl-8 text-left" {...field} value={field.value || ''} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={socialForm.control}
                      name="youtube"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>YouTube</FormLabel>
                          <FormControl>
                            <div className="relative flex items-center" dir="ltr">
                              <span className="absolute left-3 text-muted-foreground select-none">@</span>
                              <Input placeholder="channel" className="pl-8 text-left" {...field} value={field.value || ''} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={socialForm.control}
                      name="twitter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twitter / X</FormLabel>
                          <FormControl>
                            <div className="relative flex items-center" dir="ltr">
                              <span className="absolute left-3 text-muted-foreground select-none">@</span>
                              <Input placeholder="username" className="pl-8 text-left" {...field} value={field.value || ''} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={socialForm.control}
                      name="snapchat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Snapchat</FormLabel>
                          <FormControl>
                            <div className="relative flex items-center" dir="ltr">
                              <span className="absolute left-3 text-muted-foreground select-none">@</span>
                              <Input placeholder="username" className="pl-8 text-left" {...field} value={field.value || ''} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={socialForm.control}
                      name="linkedin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn</FormLabel>
                          <FormControl>
                            <div className="relative flex items-center" dir="ltr">
                              <span className="absolute left-3 text-muted-foreground select-none">in/</span>
                              <Input placeholder="username" className="pl-9 text-left" {...field} value={field.value || ''} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t border-border/50">
                    <Button 
                      type="submit" 
                      className="rounded-xl px-8 gap-2 font-bold" 
                      disabled={updateSocialLinks.isPending}
                    >
                      {updateSocialLinks.isPending ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground" />
                      ) : (
                        <Save size={18} />
                      )}
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
