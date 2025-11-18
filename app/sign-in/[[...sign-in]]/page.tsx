"use client";
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function SignInPage() {
  return (
    <div className="flex justify-center py-16">
        <SignIn forceRedirectUrl="/dashboard"/>
    </div>
  );
}
