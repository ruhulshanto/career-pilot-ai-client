import { DashboardShell } from "@/shared/components/layout/dashboard-shell";
import { ChatbotPanel } from "@/features/chatbot/components/chatbot-panel";

export default function ChatPage() {
  return (
    <DashboardShell
      title="Career Assistant"
      description="Ask questions, run simulations, and get immediate career guidance from the AI assistant."
    >
      <ChatbotPanel />
    </DashboardShell>
  );
}
