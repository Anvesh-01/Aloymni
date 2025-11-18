"use client";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function FinishSignUpPage() {
  const { user, isSignedIn } = useUser();
  useEffect(() => {
    if (isSignedIn && user) {
      const uid = user.publicMetadata?.uid;
      console.log("User UID:", uid); // Debugging line to check the UID
      if (uid) {
        redirect("/dashboard");
      } else {
        redirect("/register");
        // Finish sign-up logic here
      }
    }
  }, [isSignedIn, user]);

  return <p>Finishing sign-up for ....</p>;
}
