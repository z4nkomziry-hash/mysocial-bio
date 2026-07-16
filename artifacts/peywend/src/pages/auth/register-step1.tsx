import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, Link } from "wouter";
import { useCheckUsername } from "@workspace/api-client-react";
import { usernameSchema } from "@/lib/schemas";

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
import { ArrowLeft, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

export default function RegisterStep1() {
  const [, setLocation] = useLocation();
  const [debouncedUsername, setDebouncedUsername] = useState("");
  
  const form = useForm<z.infer<typeof usernameSchema>>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: "",
    },
    mode: "onChange",
  });

  const watchUsername = form.watch("username");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleUsernameChange = (val: string) => {
    const formatted = val.toLowerCase().replace(/[^a-z0-9_.]/g, "");
    form.setValue("username", formatted, { shouldValidate: true });

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedUsername(formatted.length >= 3 ? formatted : "");
    }, 500);
  };

  const { data: checkData, isLoading: isChecking, isError: isCheckError } = useCheckUsername(debouncedUsername, {
    query: {
      enabled: debouncedUsername.length >= 3,
      retry: false
    }
  });

  const isAvailable = checkData?.available;
  const isValidLength = watchUsername.length >= 3;
  // Allow proceeding when API is unreachable (error) — step 2 will catch duplicates
  const canProceed = isValidLength && !isChecking && (isAvailable === true || isCheckError);

  function onSubmit(values: z.infer<typeof usernameSchema>) {
    if (isAvailable) {
      // Navigate to step 2 with username in state
      sessionStorage.setItem("peywend_signup_username", values.username);
      setLocation("/تومارکردن/زانیاری");
    }
  }

  return (
    <AuthLayout>
      <div className="bg-card border shadow-sm rounded-2xl p-6 sm:p-8">
        <h1 className="text-2xl font-bold mb-2">لینکەکەت دروست بکە</h1>
        <p className="text-muted-foreground mb-8">
          ناوەکەت یان ناوی براندەکەت هەڵبژێرە بۆ بەستەرە نوێیەکەت.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ناوی بەکارهێنەر</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center" dir="ltr">
                      <span className="absolute left-4 text-muted-foreground font-medium select-none">
                        peywend.com/
                      </span>
                      <Input 
                        placeholder="username" 
                        className="pl-[105px] h-14 text-lg font-medium" 
                        {...field}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                      />
                      <div className="absolute right-4">
                        {isChecking && isValidLength && (
                          <Loader2 className="animate-spin text-muted-foreground" size={20} />
                        )}
                        {!isChecking && isValidLength && checkData && (
                          isAvailable ? (
                            <CheckCircle2 className="text-green-500" size={20} />
                          ) : (
                            <XCircle className="text-destructive" size={20} />
                          )
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <div className="flex items-center justify-between text-sm mt-2">
                    {isValidLength && checkData && !isChecking && (
                      <span className={isAvailable ? "text-green-500 font-medium" : "text-destructive font-medium"}>
                        {isAvailable ? "کراوەیە" : "بەکارهاتووە"}
                      </span>
                    )}
                    <FormMessage className="m-0 text-right w-full" />
                  </div>
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full h-14 rounded-xl text-lg mt-6 gap-2 font-bold" 
              disabled={!canProceed}
            >
              پێشەوە
              <ArrowLeft size={20} />
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
