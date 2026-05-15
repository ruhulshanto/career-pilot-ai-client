"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle2, KeyRound, MailWarning, ShieldAlert } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { authApi } from "@/services/auth/auth-api";
import { useAuthStore } from "@/shared/store/auth-store";
import { useToast } from "@/shared/hooks/use-toast";

export function SecurityAccount() {
  const { toast } = useToast();
  const storedUser = useAuthStore((state) => state.user);
  const userQuery = useQuery({
    queryKey: ["auth-me"],
    queryFn: async () => {
      const response = await authApi.me();
      return response.data;
    },
  });

  const email = userQuery.data?.email || storedUser?.email || "";
  const verified = Boolean(userQuery.data?.emailVerifiedAt);

  const resendMutation = useMutation({
    mutationFn: () => authApi.resendVerification(),
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Verification email sent",
        description: "Check your inbox for a fresh verification link.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Could not send verification",
        description: error.message || "Please try again.",
      });
    },
  });

  const passwordResetMutation = useMutation({
    mutationFn: () => authApi.forgotPassword(email),
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Password reset link sent",
        description: "Use the link in your inbox to change your password.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Could not send reset link",
        description: error.message || "Please try again.",
      });
    },
  });

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <ShieldAlert className="h-5 w-5 text-primary" />
          Sign-in security
        </CardTitle>
        <CardDescription>
          Manage email verification and password access for this account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-background/40 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              {verified ? <CheckCircle2 className="h-5 w-5" /> : <MailWarning className="h-5 w-5" />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">Email verification</p>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {email || "No email available"}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {verified
                  ? "Your email is verified."
                  : "Verify your email to secure recovery and account notices."}
              </p>
            </div>
          </div>
          <Button
            className="mt-4 w-full"
            variant={verified ? "outline" : "default"}
            disabled={verified || resendMutation.isPending}
            onClick={() => resendMutation.mutate()}
          >
            {verified ? "Verified" : "Resend verification"}
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-background/40 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Password</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Send a secure password reset link to your verified email address.
              </p>
            </div>
          </div>
          <Button
            className="mt-4 w-full"
            variant="outline"
            disabled={!email || passwordResetMutation.isPending}
            onClick={() => passwordResetMutation.mutate()}
          >
            Send password reset link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
