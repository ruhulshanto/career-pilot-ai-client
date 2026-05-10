import { Card, CardContent } from "@/shared/components/ui/card";
import {
  BrainCircuit,
  BriefcaseBusiness,
  Gauge,
  MessageSquareText,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

export function AnalyticsCards() {
  const cards = [
    {
      label: "AI Resume Score",
      value: "92",
      change: "+8 ATS points",
      icon: Gauge,
      color: "cyan",
    },
    {
      label: "Interview Signal",
      value: "84%",
      change: "+5% confidence",
      icon: MessageSquareText,
      color: "purple",
    },
    {
      label: "Job Match Radar",
      value: "219",
      change: "14 elite matches",
      icon: BriefcaseBusiness,
      color: "cyan",
    },
    {
      label: "Skill Gap Index",
      value: "76%",
      change: "3 priority skills",
      icon: BrainCircuit,
      color: "indigo",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "indigo":
        return "bg-[#4F46E5]/10 text-[#4F46E5] border-[#4F46E5]/20";
      case "purple":
        return "bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/20";
      case "cyan":
        return "bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  const getBarColor = (color: string) => {
    switch (color) {
      case "indigo":
        return "bg-[#4F46E5]";
      case "purple":
        return "bg-[#7C3AED]";
      case "cyan":
        return "bg-[#06B6D4]";
      default:
        return "bg-primary";
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.label}
          className="h-full border border-white/10 bg-white/[0.055] shadow-xl shadow-black/20 transition hover:border-cyan-300/25"
        >
          <CardContent className="p-6 flex h-full flex-col justify-between">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div
                className={cn(
                  "inline-flex items-center justify-center rounded-2xl p-3 border",
                  getColorClasses(card.color),
                )}
              >
                <card.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-cyan-100/80">
                {card.change}
              </span>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-3">
                {card.label}
              </p>
              <h3 className="text-3xl font-semibold text-foreground">
                {card.value}
              </h3>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className={cn("h-full rounded-full", getBarColor(card.color))}
                  style={{
                    width: card.value.includes("%") ? card.value : "72%",
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
