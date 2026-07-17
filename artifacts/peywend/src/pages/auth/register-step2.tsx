import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, Link, Redirect } from "wouter";
import { useRegister } from "@workspace/api-client-react";
import { registerSchema } from "@/lib/schemas";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserPlus, ArrowRight } from "lucide-react";

export default function RegisterStep2() {
  const [, setLocation] = useLocation();
  const { login, user, isLoading } = useAuth();
  const { toast } = useToast();
  const registerMutation = useRegister();

  // Read username stored by step 1
  const [username] = useState(() => sessionStorage.getItem("peywend_signup_username") ?? "");

  // Redirect already-authenticated users
  if (!isLoading && user) return <Redirect to="/داشبۆرد" />;

  // No username means the user navigated here directly — send back to step 1
  if (!username) return <Redirect to="/تومارکردن" />;

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username, name: "", email: "", password: "" },
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    registerMutation.mutate(
      { data: values },
      {
        onSuccess: (data) => {
          sessionStorage.removeItem("peywend_signup_username");
          login(data.user, data.token);
          toast({ title: "بەخێربێیت!", description: "ژمارەکەت بە سەرکەوتوویی دروستکرا." });
          setLocation("/داشبۆرد");
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "هەڵە ڕوویدا",
            description: (error.data as any)?.error || "نەتوانرا ژمارە دروست بکرێت. تکایە دووبارە هەوڵبدەرەوە.",
          });
        },
      }
    );
  }

  return (
    <AuthLayout>
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground"
          onClick={() => setLocation("/تومارکردن")}
        >
          <ArrowRight size={16} />
          گەڕانەوە
        </Button>
      </div>

      <div className="bg-card border shadow-sm rounded-2xl p-6 sm:p-8">
        {/* Show chosen username */}
        <div className="flex items-center gap-2 mb-3">
          <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold" dir="ltr">
            peywend.com/{username}
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">دروستکردنی ژمارە</h1>
        <p className="text-muted-foreground mb-8">
          زانیارییە کەسییەکانت پڕبکەرەوە بۆ تەواوکردنی پرۆسەکە.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ناو</FormLabel>
                  <FormControl>
                    <Input placeholder="ناوی تەواوت بنووسە" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ئیمەیڵ</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" type="email" dir="ltr" className="text-left" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وشەی نهێنی</FormLabel>
                  <FormControl>
                    <Input type="password" dir="ltr" className="text-left" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-md mt-6 gap-2"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <div className="w-5 h-5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
              ) : (
                <><UserPlus size={20} /> تومارکردن</>
              )}
            </Button>
          </form>
        </Form>
      </div>

      <div className="text-center mt-6 text-sm text-muted-foreground">
        پێشتر ژمارەت هەیە؟{" "}
        <Link href="/چوونەژوورەوە" className="text-primary hover:underline font-bold">
          چوونەژوورەوە
        </Link>
      </div>
    </AuthLayout>
  );
}
