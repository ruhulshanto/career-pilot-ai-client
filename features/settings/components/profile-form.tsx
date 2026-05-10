"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { User } from "lucide-react";

export function ProfileForm() {
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="flex flex-col gap-3 border-b border-border/70 px-6 py-5">
        <div>
          <CardTitle className="text-2xl font-semibold text-foreground">
            Profile Settings
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Update your account details and notification preferences.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-10 p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#111827] border border-border text-muted-foreground">
              <User className="h-10 w-10" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Profile image
              </p>
              <p className="text-sm text-muted-foreground">
                Update your public avatar and display name.
              </p>
            </div>
          </div>
          <Button variant="outline" className="rounded-2xl h-12 px-6">
            Upload Image
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              First Name
            </label>
            <Input
              defaultValue="Alex"
              className="rounded-3xl h-14 bg-card border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Last Name
            </label>
            <Input
              defaultValue="Johnson"
              className="rounded-3xl h-14 bg-card border-border text-foreground"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground">
              Email Address
            </label>
            <Input
              defaultValue="alex@careerai.infra"
              className="rounded-3xl h-14 bg-card border-border text-foreground"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Your profile is secured and connected to your account preferences.
          </p>
          <Button className="rounded-3xl h-14 px-8">Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
