"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, ShieldCheck, MapPin, Phone, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { useToast } from "@/shared/hooks/use-toast";
import { supportApi } from "@/services/api/support";
import { CareerPilotTrajectoryIcon } from "@/shared/components/icons/CareerPilotTrajectoryIcon";
import { useAuthStore } from "@/shared/store/auth-store";
import Link from "next/link";

export default function ContactPage() {
  const { toast } = useToast();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
       toast({
         title: "Authentication Required",
         description: "Please login to send a message.",
         variant: "destructive",
         duration: 3500,
       });
       return;
    }
    setIsSubmitting(true);

    try {
      const response = await supportApi.sendContactMessage(formData);
      if (response.success) {
        setIsSuccess(true);
        toast({
          variant: "success",
          duration: 2500,
          title: "Message Sent",
          description: "We've received your inquiry and will get back to you shortly.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
        duration: 3500,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Thank you!</h1>
          <p className="mt-4 text-lg text-muted-foreground">Your message has been sent successfully. Check your email for a confirmation.</p>
          <Button className="mt-8 rounded-xl" onClick={() => setIsSuccess(false)}>
            Send another message
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background pt-32 pb-20">
      {/* ── Background Aesthetics ── */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      <div className="absolute left-[-10%] top-[10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute right-[-5%] bottom-[10%] h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
          
          {/* Left Column: Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                <Mail className="h-3.5 w-3.5" />
                Contact Support
              </div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl">
                Let's talk about your <span className="text-primary">career journey.</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Have questions about our AI features, career roadmaps, or enterprise solutions? 
                Our team is here to help you navigate the future of work.
              </p>

              <div className="mt-12 space-y-8">
                <div className="flex items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-card shadow-sm">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Chat with us</h3>
                    <p className="text-sm text-muted-foreground mt-1">Our AI assistant is available 24/7 for immediate help.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-card shadow-sm">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Verified Support</h3>
                    <p className="text-sm text-muted-foreground mt-1">Direct access to our career experts and product team.</p>
                  </div>
                </div>
              </div>

              <div className="mt-16 pt-10 border-t border-border/50">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CareerPilotTrajectoryIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Operating System</p>
                    <p className="text-sm font-bold text-foreground">Career Pilot AI v1.2</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="rounded-[2.5rem] border border-border/60 bg-card p-8 sm:p-12 shadow-2xl shadow-primary/5 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                    <Input 
                      required
                      placeholder="John Doe"
                      className="h-12 rounded-xl border-border/60 bg-muted/20 focus:bg-background"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                    <Input 
                      required
                      type="email"
                      placeholder="john@example.com"
                      className="h-12 rounded-xl border-border/60 bg-muted/20 focus:bg-background"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Subject</label>
                  <Input 
                    required
                    placeholder="How can we help?"
                    className="h-12 rounded-xl border-border/60 bg-muted/20 focus:bg-background"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Your Message</label>
                  <Textarea 
                    required
                    placeholder="Describe your inquiry..."
                    className="min-h-[160px] rounded-2xl border-border/60 bg-muted/20 focus:bg-background p-4 leading-relaxed"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                {accessToken ? (
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Inquiry
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="flex flex-col items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
                    <p className="text-sm font-medium text-muted-foreground">
                      Please log in to your account to send a support inquiry.
                    </p>
                    <Button asChild className="w-full rounded-xl">
                      <Link href="/login">Login to Contact</Link>
                    </Button>
                  </div>
                )}

                <p className="text-center text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest">
                   Typically responds within 24 hours
                </p>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
