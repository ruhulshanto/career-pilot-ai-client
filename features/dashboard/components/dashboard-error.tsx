"use client";

import Link from "next/link";
import { AlertCircle, LogIn, RefreshCw } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";

type Props = {
  message: string;
  onRetry: () => void;
};

export function DashboardError({ message, onRetry }: Props) {
  const isSessionExpired = message.toLowerCase().includes("session has expired");

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle>Dashboard unavailable</AlertTitle>
      <AlertDescription className="space-y-4">
        <p>{message}</p>
        {isSessionExpired ? (
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href="/login">
              <LogIn className="h-4 w-4" />
              Sign in again
            </Link>
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={onRetry}
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
