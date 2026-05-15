"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  Loader2,
  AtSign,
  ShieldCheck,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/hooks/use-toast";
import { cn } from "@/shared/lib/utils";
import {
  loginSchema,
  signupSchema,
  type LoginSchema,
  type SignupSchema,
} from "../schemas/auth-schema";
import {
  useLoginMutation,
  useSignupMutation,
} from "../hooks/use-auth-mutations";
import { useAuthStore } from "@/shared/store/auth-store";
import { authApi } from "@/services/auth/auth-api";
import {
  getRoleDashboardHref,
  resolveWorkspaceHref,
} from "@/shared/lib/role-routing";

interface AuthFormProps {
  mode: "login" | "signup";
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const setSession = useAuthStore((state) => state.setSession);
  const [nextPath, setNextPath] = useState("/");
  const [demoRoleLoading, setDemoRoleLoading] = useState<"USER" | "ADMIN" | "MENTOR" | null>(null);

  const loginMutation = useLoginMutation();
  const signupMutation = useSignupMutation();

  useEffect(() => {
    const next = new URLSearchParams(window.location.search).get("next");
    if (next?.startsWith("/") && !next.startsWith("//")) {
      setNextPath(next);
    }
  }, []);

  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLogin = loginForm.handleSubmit(async (data) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      if (response.success) {
        finishAuth(response);
        toast({
          title: "Welcome back",
          description: "Successfully signed in to your account",
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description:
          err.response?.data?.message ||
          err.message ||
          "Invalid email or password",
      });
    }
  });

  const onSignup = signupForm.handleSubmit(async (data) => {
    try {
      const { confirmPassword, ...registerData } = data;
      const response = await signupMutation.mutateAsync(registerData as any);

      if (response.success) {
        finishAuth(response);

        toast({
          title: "Account created",
          description:
            "Welcome to CareerAI! We sent you an email verification link.",
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description:
          err.response?.data?.message ||
          err.message ||
          "Failed to create account",
      });
    }
  });

  const finishAuth = (response: Awaited<ReturnType<typeof authApi.demoLogin>>, fallbackPath = nextPath) => {
    setSession({
      accessToken: response.data.accessToken,
      role: response.data.user.role,
      user: {
        id: response.data.user.id,
        name:
          response.data.user.name ||
          [response.data.user.firstName, response.data.user.lastName]
            .filter(Boolean)
            .join(" ") ||
          "Demo User",
        email: response.data.user.email,
      },
    });

    const rolePath = getRoleDashboardHref(response.data.user.role);

    router.replace(
      fallbackPath === "/" ? rolePath : resolveWorkspaceHref(rolePath, fallbackPath),
    );
  };

  const onDemoLogin = async (role: "USER" | "ADMIN" | "MENTOR") => {
    setDemoRoleLoading(role);
    try {
      const response = await authApi.demoLogin(role).catch((err) => {
        if (role === "MENTOR" && [400, 404, 500].includes(err?.status)) {
          return authApi.demoLogin("COACH");
        }

        throw err;
      });
      finishAuth(response);
      toast({
        variant: "success",
        title: "Demo account ready",
        description:
          role === "ADMIN"
            ? "Opening the demo admin dashboard."
            : role === "MENTOR"
              ? "Opening the demo mentor experience."
              : "Opening the demo user workspace.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Demo login failed",
        description:
          err.response?.data?.message ||
          err.message ||
          "Demo accounts may need to be seeded on the server.",
      });
    } finally {
      setDemoRoleLoading(null);
    }
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full rounded-xl border border-border/80 bg-card/95 p-4 shadow-xl shadow-elevation/10 backdrop-blur-xl sm:p-5 xl:p-6"
      >
        <div className="mb-5 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </div>
          <h1 className="mb-1.5 text-2xl font-bold text-foreground sm:text-[1.7rem]">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {mode === "login"
              ? "Sign in to your account to continue"
              : "Get started with your career journey"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {mode === "login" ? (
            <motion.form key="login" onSubmit={onLogin} className="space-y-4">
              <div className="space-y-3.5">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 h-11"
                      {...loginForm.register("email")}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10 h-11"
                      {...loginForm.register("password")}
                    />
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full h-11"
              >
                {loginMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Sign in
              </Button>
            </motion.form>
          ) : (
            <motion.form key="signup" onSubmit={onSignup} className="space-y-3.5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    First name
                  </label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    className="h-11"
                    {...signupForm.register("firstName")}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    Last name
                  </label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    className="h-11"
                    {...signupForm.register("lastName")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="johndoe"
                    className="pl-10 h-11"
                    {...signupForm.register("username")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10 h-11"
                    {...signupForm.register("email")}
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create password"
                    className="h-11"
                    {...signupForm.register("password")}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    className="h-11"
                    {...signupForm.register("confirmPassword")}
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={signupMutation.isPending}
                className="w-full h-11"
              >
                {signupMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Create account
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        {mode === "login" ? (
          <>
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/80" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-3 text-muted-foreground">
                  Demo access
                </span>
              </div>
            </div>

            <div className="mb-5 space-y-2.5 rounded-xl border border-primary/15 bg-primary/[0.045] p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Demo workspaces</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Seeded accounts with realistic career data.
                </p>
              </div>
              <div className="grid gap-2.5">
                <DemoButton
                  icon={Sparkles}
                  label="User Workspace"
                  badge="USER"
                  description="Career tools and personal progress"
                  loading={demoRoleLoading === "USER"}
                  disabled={Boolean(demoRoleLoading) || loginMutation.isPending || signupMutation.isPending}
                  onClick={() => onDemoLogin("USER")}
                />
                <DemoButton
                  icon={ShieldCheck}
                  label="Admin Workspace"
                  badge="ADMIN"
                  description="Analytics and platform monitoring"
                  loading={demoRoleLoading === "ADMIN"}
                  disabled={Boolean(demoRoleLoading) || loginMutation.isPending || signupMutation.isPending}
                  onClick={() => onDemoLogin("ADMIN")}
                />
                <DemoButton
                  icon={GraduationCap}
                  label="Mentor Workspace"
                  badge="MENTOR"
                  description="Mentor-level review experience"
                  loading={demoRoleLoading === "MENTOR"}
                  disabled={Boolean(demoRoleLoading) || loginMutation.isPending || signupMutation.isPending}
                  onClick={() => onDemoLogin("MENTOR")}
                />
              </div>
            </div>
          </>
        ) : null}

        <div className="mt-5 text-center text-sm">
          <span className="text-muted-foreground">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>
          <Link
            href={mode === "login" ? "/register" : "/login"}
            className="ml-2 text-primary hover:underline font-medium"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

function DemoButton({
  icon: Icon,
  label,
  badge,
  description,
  loading,
  disabled,
  onClick,
}: {
  icon: typeof Sparkles;
  label: string;
  badge: string;
  description: string;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      className={cn(
        "group h-auto w-full justify-start rounded-lg border border-border/80 bg-background/55 p-2.5 text-left hover:border-primary/30 hover:bg-primary/10",
        "items-start"
      )}
      disabled={disabled}
      onClick={onClick}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0 text-sm font-semibold text-foreground">{label}</span>
          <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">
            {badge}
          </span>
        </div>
        <p className="mt-0.5 whitespace-normal text-xs font-normal leading-4 text-muted-foreground">
          {description}
        </p>
      </div>
    </Button>
  );
}
