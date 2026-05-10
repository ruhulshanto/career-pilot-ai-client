import React from "react";
import { AuthForm } from "@/features/auth/components/auth-form";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <AuthForm mode="login" />
    </div>
  );
}
