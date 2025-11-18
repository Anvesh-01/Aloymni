import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner"
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Alumini Connect",
  description: "A platform to connect alumni and students.",
  generator: "Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl={"/"}
      signInUrl="/sign-in"
      signUpUrl="/sign-up">
      <html lang="en">
        <body className={poppins.className}>{children}</body>
          <Toaster />
        {/* Added satoshi.className here */}
      </html>
    </ClerkProvider>
  );
}
