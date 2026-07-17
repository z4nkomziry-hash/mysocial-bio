import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, Redirect, useLocation } from "wouter";
import { useLogin } from "@workspace/api-client-react";
import { loginSchema } from "@/lib/schemas";
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
import { LogIn } from "lucide-react";

export default function Login() {
  const { login, user, isLoading } = useAuth();
  const { toast } = useToast();
  const loginMutation = useLogin();
  const [, setLocation] = useLocation();

  // Redirect already-authenticated users straight to the dashboard
  if (!isLoading && user) return <Redirect to="/داشبۆرد" />;

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    loginMutation.mutate(
      { data: values },
      {
        onSuccess: (data) => {
          login(data.user, data.token);
          toast({ title: "بەخێربێیتەوە!", description: "بە سەرکەوتوویی چوویتە ژوورەوە." });
          setLocation("/داشبۆرد");
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "هەڵە ڕوویدا",
            description: (error.data as any)?.error || "ئیمەیڵ یان وشەی نهێنی هەڵەیە.",
          });
        },
      }
    );
  }

  return (
    <AuthLayout>
      <div className="bg-card border shadow-sm rounded-2xl p-6 sm:p-8">
        <h1 className="text-2xl font-bold mb-2">بەخێربێیتەوە</h1>
        <p className="text-muted-foreground mb-8">زانیارییەکانت بنووسە بۆ چوونەژوورەوە</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <div className="w-5 h-5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
              ) : (
                <><LogIn size={20} /> چوونەژوورەوە</>
              )}
            </Button>
          </form>
        </Form>
      </div>

      <div className="text-center mt-6 text-sm text-muted-foreground">
        ژمارەت نییە؟{" "}
        <Link href="/تومارکردن" className="text-primary hover:underline font-bold">
          دروستکردنی ژمارە
        </Link>
      </div>
    </AuthLayout>
  );
}
