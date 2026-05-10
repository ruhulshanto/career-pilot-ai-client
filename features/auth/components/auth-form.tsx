"use client";

import React from "react";
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
  Github,
  Facebook,
  AtSign,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/hooks/use-toast";
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

interface AuthFormProps {
  mode: "login" | "signup";
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const setSession = useAuthStore((state) => state.setSession);

  const loginMutation = useLoginMutation();
  const signupMutation = useSignupMutation();

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
        setSession({
          accessToken: response.data.accessToken,
          role: response.data.user.role,
          user: {
            name: response.data.user.firstName || "User",
            email: response.data.user.email,
          },
        });
        toast({
          title: "Welcome back",
          description: "Successfully signed in to your account",
        });
        router.push("/");
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
        setSession({
          accessToken: response.data.accessToken,
          role: response.data.user.role,
          user: {
            name: response.data.user.firstName || "User",
            email: response.data.user.email,
          },
        });

        toast({
          title: "Account created",
          description:
            "Welcome to CareerAI! Your account has been created successfully.",
        });
        router.push("/");
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

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card border border-border rounded-2xl shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
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
            <motion.form key="login" onSubmit={onLogin} className="space-y-6">
              <div className="space-y-4">
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
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
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
            <motion.form key="signup" onSubmit={onSignup} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
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
              <div className="grid grid-cols-2 gap-4">
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

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-card px-4 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Button variant="outline" className="h-11">
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </Button>
          <Button variant="outline" className="h-11">
            <Github className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="h-11">
            <Facebook className="h-4 w-4 text-blue-600" />
          </Button>
        </div>

        <div className="mt-8 text-center text-sm">
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
