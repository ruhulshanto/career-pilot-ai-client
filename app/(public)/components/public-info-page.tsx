import Link from "next/link";
import { ArrowRight, Compass, Layers3, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

type PublicInfoPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
  ctaHref?: string;
  ctaLabel?: string;
};

export function PublicInfoPage({
  eyebrow,
  title,
  description,
  items,
  ctaHref = "/register",
  ctaLabel = "Start free",
}: PublicInfoPageProps) {
  const itemIcons = [Compass, Layers3, ShieldCheck, Sparkles] as const;

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-background px-4 pb-16 pt-28 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          {description}
        </p>

        <div className="mt-8">
          <Button asChild>
            <Link href={ctaHref}>
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {items.map((item, index) => {
            const Icon = itemIcons[index % itemIcons.length];
            return (
            <Card key={item} className="border-border/80 bg-card">
              <CardContent className="flex gap-3 p-5">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <p className="text-sm leading-6 text-muted-foreground">{item}</p>
              </CardContent>
            </Card>
          )})}
        </div>
      </div>
    </section>
  );
}
