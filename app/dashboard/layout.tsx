"use client";

import type React from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [verificationLoading, setVerificationLoading] = useState(true);
  const [accessError, setAccessError] = useState<string | null>(null);

  // Check verification status
  const checkVerification = async () => {
    console.log("🔍 Starting verification check...");
    console.log("👤 User object:", user);

    // Check if user has UID in metadata
    if (!user?.publicMetadata?.uid) {
      console.log("❌ No UID found in user.publicMetadata");
      console.log("📋 User publicMetadata:", user?.publicMetadata);
      setAccessError("no-uid");
      setVerificationLoading(false);
      setIsVerified(false);
      return;
    }

    console.log("✅ UID found:", user.publicMetadata.uid);

    try {
      console.log("🚀 Making API call to /api/is-verified");
      
      const response = await fetch("/api/is-verified", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: user.publicMetadata.uid }),
      });

      console.log("📡 API Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Verification response data:", data);
        setIsVerified(data.verified);
        if (!data.verified) {
          setAccessError("not-verified");
        }
      } else {
        console.log("❌ API request failed with status:", response.status);
        setAccessError("api-error");
        setIsVerified(false);
      }
    } catch (error) {
      console.error("💥 Error checking verification:", error);
      setAccessError("network-error");
      setIsVerified(false);
    } finally {
      setVerificationLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      checkVerification();
    } else if (isLoaded && !isSignedIn) {
      // User is not signed in, redirect to sign-in
      redirect("/sign-in");
    }
  }, [isLoaded, isSignedIn, user]);

  // Loading state - checking auth and verification
  if (!isLoaded || verificationLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>
            {!isLoaded ? "Loading authentication..." : "Checking verification status..."}
          </p>
        </div>
      </div>
    );
  }

  // Not signed in
  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <UserX className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              Please sign in to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => redirect("/sign-in")}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

 if (accessError === "no-uid") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-blue-600">Registration Required</CardTitle>
            <CardDescription>
              Please complete your registration to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => redirect("/register")}>
              Complete Registration
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (accessError === "not-verified" || isVerified === false) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-orange-600">Account Pending Verification</CardTitle>
            <CardDescription>
              Your account is yet to be verified by the administrator. Please wait for approval or contact support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              You will receive access to the dashboard once your account is verified.
            </p>
            <Button variant="outline" onClick={() => checkVerification()}>
              Check Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (accessError === "api-error" || accessError === "network-error") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-600">Connection Error</CardTitle>
            <CardDescription>
              Unable to verify your account status. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => checkVerification()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  // User is signed in and verified - show dashboard
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">{children}</main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}