"use client";

import type React from "react";
import Link from "next/link";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, Users, Calendar, Award } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  SignOutButton,
  SignUpButton,
} from "@clerk/nextjs";
import { Sign } from "crypto";

export default function LandingPage() {
  const cheese = "cheese"; // Placeholder for cheese variable, not used in this example
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Simulate login - in real app, this would validate credentials
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Aloymni
              </span>
            </div>
            {/* Auth buttons in header */}
            <div className="flex items-center space-x-4">
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition duration-300">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition duration-300">
                    Register
                  </button>
                </SignUpButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
                Connect with Your{" "}
                <span className="text-blue-600">Alumni Network for St Aloysius Test For CI/CD</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                Stay connected with your college community. Discover
                opportunities, share experiences, and build lasting professional
                relationships.
              </p>

              {/* Features */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="ml-2 text-sm text-gray-600">
                    10,000+ Alumni
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="ml-2 text-sm text-gray-600">
                    Regular Events
                  </span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-blue-600" />
                  <span className="ml-2 text-sm text-gray-600">
                    Career Support
                  </span>
                </div>
              </div>

              {/* Call to Action for signed out users */}
              <div className="mt-10">
                <SignedOut>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <SignInButton mode="modal">
                      <button className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105">
                        Get Started - Join Now
                      </button>
                    </SignInButton>
                    <Link
                      href="/sign-in"
                      className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50 transition duration-300"
                    >
                      View More
                    </Link>
                  </div>
                </SignedOut>

                <SignedIn>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/dashboard"
                      className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                    >
                      Go to Dashboard
                    </Link>
                    <button className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50 transition duration-300">
                      Explore Network
                    </button>
                  </div>
                </SignedIn>
              </div>
            </div>

            {/* Login Form - only show for signed out users */}
            <SignedOut>
              <div className="lg:justify-self-end">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>
                      Sign in to access your alumni network
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SignInButton mode="modal" />
                  </CardContent>
                </Card>
              </div>
            </SignedOut>

            {/* Welcome message for signed in users */}
            <SignedIn>
              <div className="lg:justify-self-end">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>Welcome Back!</CardTitle>
                    <CardDescription>
                      Ready to explore your alumni network?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          You are signed in. 🎉
                        </p>
                      </div>
                      <Link
                        href="/finish-sign-up"
                        className="w-full inline-block text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                      >
                        View Your Page
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">10,000+</div>
              <div className="text-gray-600">Active Alumni</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">50+</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">25</div>
              <div className="text-gray-600">Years of Excellence</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
