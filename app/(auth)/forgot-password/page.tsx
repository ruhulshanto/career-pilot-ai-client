"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/hooks/use-toast";
import { authApi } from "@/services/auth/auth-api";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "@/features/auth/schemas/auth-schema";
import { BrandLogo } from "@/shared/components/layout/brand-logo";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await authApi.forgotPassword(data.email);
      toast({
        variant: "success",
        title: "Reset link sent",
        description: "Check your inbox for a secure password reset link.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Reset request failed",
        description: error.message || "Please try again in a moment.",
      });
    }
  });

  return (
    <div className="w-full rounded-xl border border-border/80 bg-card/95 p-5 shadow-xl shadow-elevation/10 backdrop-blur-xl sm:p-6 xl:p-7">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-6 flex justify-center">
          <BrandLogo className="hover:scale-105" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">Reset password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we will send a secure reset link.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              className="h-11 pl-10"
              placeholder="you@example.com"
              {...form.register("email")}
            />
          </div>
          {form.formState.errors.email ? (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          ) : null}
        </div>
        <Button type="submit" disabled={form.formState.isSubmitting} className="h-11 w-full">
          {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Send reset link
        </Button>
      </form>

      <div className="mt-8 text-center text-sm">
        <Link href="/login" className="font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
