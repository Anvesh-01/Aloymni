'use client';
import { SignedOut, SignedIn, SignUp, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";


export default function SignUpPage() {
  //     const { user, isSignedIn } = useUser();
  // const [url, setUrl] = useState<string | null>();
  
  // useEffect(() => {


  //     const uid = user?.publicMetadata?.uid;// Debugging line to check the UID
  //     console.log("👤 User object:", user);
  //     if (!uid) {
  //       setUrl('/register');
  //       // Finish sign-up logic here
  //     }
  //     else if(uid){
  //       setUrl('/dashboard');
  //     }
  //   console.log("url:", url);
  // }, [isSignedIn, user]);

    return (
        <div className="flex justify-center mt-10">
                <SignUp forceRedirectUrl="/finish-sign-up" />
        </div>
    );
}
