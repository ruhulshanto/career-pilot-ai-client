"use client"

import { useToast } from "@/shared/hooks/use-toast"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/shared/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider duration={2000}>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const isDestructive = variant === "destructive"

        return (
          <Toast key={id} variant={variant} duration={2000} {...props}>
            <div
              className={
                isDestructive
                  ? "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive-foreground/20 text-destructive-foreground"
                  : "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-foreground/20 text-accent-foreground"
              }
            >
              {isDestructive ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
            </div>
            <div className="grid min-w-0 flex-1 gap-1 pr-2">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

