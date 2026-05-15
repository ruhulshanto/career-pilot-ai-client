"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/shared/hooks/use-toast";
import { authApi } from "@/services/auth/auth-api";

type VerifyState = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="w-full rounded-xl border border-border/80 bg-card/95 p-6 text-center shadow-xl shadow-elevation/10">Checking verification link...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { toast } = useToast();
  const [state, setState] = useState<VerifyState>("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    let cancelled = false;

    if (!token) {
      setState("error");
      setMessage("Missing verification token.");
      return;
    }

    authApi
      .verifyEmail(token)
      .then(() => {
        if (cancelled) return;
        setState("success");
        setMessage("Your email is verified.");
        toast({
          variant: "success",
          title: "Email verified",
          description: "Your account now has a verified email.",
        });
      })
      .catch((error: any) => {
        if (cancelled) return;
        setState("error");
        setMessage(error.message || "This verification link is invalid or expired.");
        toast({
          variant: "destructive",
          title: "Verification failed",
          description: error.message || "Request a new verification link.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [toast, token]);

  const Icon =
    state === "loading" ? Loader2 : state === "success" ? CheckCircle2 : XCircle;

  return (
    <div className="w-full rounded-xl border border-border/80 bg-card/95 p-5 text-center shadow-xl shadow-elevation/10 backdrop-blur-xl sm:p-6 xl:p-7">
      <div className="mb-6 flex justify-center">
        <Icon
          className={`h-12 w-12 ${
            state === "loading"
              ? "animate-spin text-primary"
              : state === "success"
                ? "text-accent"
                : "text-destructive"
          }`}
        />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">Email verification</h1>
      <p className="mb-8 text-sm text-muted-foreground">{message}</p>
      {state === "loading" ? (
        <Button disabled className="h-11 w-full">
          Verifying...
        </Button>
      ) : state === "success" ? (
        <Button asChild className="h-11 w-full">
          <Link href="/dashboard/user">Continue to dashboard</Link>
        </Button>
      ) : (
        <Button asChild variant="outline" className="h-11 w-full">
          <Link href="/login">Back to sign in</Link>
        </Button>
      )}
    </div>
  );
}
