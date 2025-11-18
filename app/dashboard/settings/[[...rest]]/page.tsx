import { UserProfile } from "@clerk/nextjs";
import { NextPage } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
const SettingsPage: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="flex h-16 items-center px-6">
          <SidebarTrigger />
          <div className="ml-4">
            <h1 className="text-2xl font-semibold">Settings</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 max-w-2xl">
        <div className="space-y-6">
          {/* Account Settings */}

          <UserProfile />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
