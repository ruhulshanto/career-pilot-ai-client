'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Loader2, Sparkles, Github, Facebook, AtSign } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/hooks/use-toast';
import { loginSchema, signupSchema, type LoginSchema, type SignupSchema } from '../schemas/auth-schema';
import { useLoginMutation, useSignupMutation } from '../hooks/use-auth-mutations';
import { useAuthStore } from '@/shared/store/auth-store';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const setSession = useAuthStore((state) => state.setSession);
  
  const loginMutation = useLoginMutation();
  const signupMutation = useSignupMutation();
  
  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const signupForm = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: { firstName: '', lastName: '', username: '', email: '', password: '', confirmPassword: '' }
  });

  const onLogin = loginForm.handleSubmit(async (data) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      if (response.success) {
        setSession({ 
          accessToken: response.data.accessToken, 
          role: response.data.user.role 
        });
        toast({ title: "Welcome back", description: "Successfully signed in to your account" });
        router.push('/');
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: err.response?.data?.message || err.message || "Invalid email or password",
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
          role: response.data.user.role 
        });
        
        toast({ title: "Account created", description: "Welcome to CareerAI! Your account has been created successfully." });
        router.push('/');
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: err.response?.data?.message || err.message || "Failed to create account",
      });
    }
  });

  return (
    <div className="w-full max-w-xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-10 lg:p-16 relative overflow-hidden"
      >
        {/* Cinematic Background */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] animate-pulse [animation-delay:1.5s]" />

        <div className="relative z-10">
          <div className="text-center mb-12">
            <motion.div 
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-primary via-indigo-600 to-indigo-800 shadow-2xl shadow-primary/40 mb-8 mx-auto"
            >
              <Sparkles className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-5xl font-black tracking-tighter mb-4 text-white uppercase">
              {mode === 'login' ? 'System Access' : 'Identity Genesis'}
            </h1>
            <p className="text-foreground/40 text-sm font-black uppercase tracking-[0.3em]">
              {mode === 'login' ? 'Restore Professional State' : 'Initialize Talent Metadata'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.form key="login" onSubmit={onLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
                    <Input placeholder="Digital Coordinate (Email)" className="pl-14 h-16 bg-white/5 border-white/5 focus:border-primary/50 text-white font-bold rounded-2xl" {...loginForm.register('email')} />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
                    <Input type="password" placeholder="Access Protocol (Password)" className="pl-14 h-16 bg-white/5 border-white/5 focus:border-primary/50 text-white font-bold rounded-2xl" {...loginForm.register('password')} />
                  </div>
                </div>
                <Button type="submit" disabled={loginMutation.isPending} className="w-full h-16 rounded-2xl text-lg font-black uppercase tracking-widest gap-3 shadow-2xl shadow-primary/40 group">
                  {loginMutation.isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : 'INITIALIZE HANDSHAKE'}
                  {!loginMutation.isPending && <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />}
                </Button>
              </motion.form>
            ) : (
              <motion.form key="signup" onSubmit={onSignup} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/20" />
                    <Input placeholder="First Name" className="pl-14 h-14 bg-white/5 border-white/5 rounded-2xl font-bold text-white" {...signupForm.register('firstName')} />
                  </div>
                  <Input placeholder="Last Name" className="h-14 bg-white/5 border-white/5 rounded-2xl font-bold text-white" {...signupForm.register('lastName')} />
                </div>
                <div className="relative">
                  <AtSign className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/20" />
                  <Input placeholder="Unique Identifier" className="pl-14 h-14 bg-white/5 border-white/5 rounded-2xl font-bold text-white" {...signupForm.register('username')} />
                </div>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/20" />
                  <Input placeholder="Communication Node (Email)" className="pl-14 h-14 bg-white/5 border-white/5 rounded-2xl font-bold text-white" {...signupForm.register('email')} />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <Input type="password" placeholder="Key Phrase" className="h-14 bg-white/5 border-white/5 rounded-2xl font-bold text-white" {...signupForm.register('password')} />
                  <Input type="password" placeholder="Verification" className="h-14 bg-white/5 border-white/5 rounded-2xl font-bold text-white" {...signupForm.register('confirmPassword')} />
                </div>
                <Button type="submit" disabled={signupMutation.isPending} className="w-full h-16 rounded-2xl text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/40 mt-4">
                  {signupMutation.isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : 'CONSTRUCT IDENTITY'}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="relative my-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[9px] uppercase tracking-[0.5em] font-black">
              <span className="bg-[#0B1120] px-6 text-foreground/20">Omni-Channel Auth</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
             <Button variant="outline" className="rounded-2xl h-16 bg-white/5 border-white/5 hover:bg-white/10 transition-all border">
                <svg className="h-6 w-6" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
             </Button>
             <Button variant="outline" className="rounded-2xl h-16 bg-white/5 border-white/5 hover:bg-white/10 transition-all border">
                <Github className="h-7 w-7 text-white" />
             </Button>
             <Button variant="outline" className="rounded-2xl h-16 bg-white/5 border-white/5 hover:bg-white/10 transition-all border">
                <Facebook className="h-7 w-7 text-blue-500" />
             </Button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">
              {mode === 'login' ? "UNREGISTERED?" : "EXISTING ENTITY?"}
              <Link href={mode === 'login' ? '/register' : '/login'} className="ml-3 text-primary hover:text-white transition-colors">
                {mode === 'login' ? 'INITIALIZE NEW STATE' : 'RECLAIM HANDSHAKE'}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
      
      <p className="text-center mt-10 text-[10px] text-foreground/10 uppercase tracking-[0.6em] font-black">
        CareerAI Network • Secure Portal • Tier 4 Infrastructure
      </p>
    </div>
  );
};



