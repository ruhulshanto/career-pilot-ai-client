"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/hooks/use-toast";
import { authApi } from "@/services/auth/auth-api";
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "@/features/auth/schemas/auth-schema";
import { BrandLogo } from "@/shared/components/layout/brand-logo";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="w-full rounded-xl border border-border/80 bg-card/95 p-6 text-center shadow-xl shadow-elevation/10">Loading reset form...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { toast } = useToast();
  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await authApi.resetPassword(token, data.password);
      toast({
        variant: "success",
        title: "Password updated",
        description: "You can now sign in with your new password.",
      });
      router.push("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Reset failed",
        description: error.message || "This reset link may be invalid or expired.",
      });
    }
  });

  return (
    <div className="w-full rounded-xl border border-border/80 bg-card/95 p-5 shadow-xl shadow-elevation/10 backdrop-blur-xl sm:p-6 xl:p-7">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-6 flex justify-center">
          <BrandLogo className="hover:scale-105" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">Create new password</h1>
        <p className="text-sm text-muted-foreground">
          Choose a strong password to protect your career workspace.
        </p>
      </div>

      {!token ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          Missing reset token. Request a new password reset link.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <PasswordField
            id="password"
            label="New password"
            register={form.register("password")}
            error={form.formState.errors.password?.message}
          />
          <PasswordField
            id="confirmPassword"
            label="Confirm password"
            register={form.register("confirmPassword")}
            error={form.formState.errors.confirmPassword?.message}
          />
          <Button type="submit" disabled={form.formState.isSubmitting} className="h-11 w-full">
            {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Update password
          </Button>
        </form>
      )}

      <div className="mt-8 text-center text-sm">
        <Link href="/login" className="font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

function PasswordField({
  id,
  label,
  register,
  error,
}: {
  id: string;
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input id={id} type="password" className="h-11 pl-10" {...register} />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
