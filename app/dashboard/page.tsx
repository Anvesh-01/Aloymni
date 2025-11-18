"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Users,
  Calendar,
  Briefcase,
  MapPin,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";

// Mock data for alumni
const upcomingEvents = [
  {
    id: 1,
    title: "Annual Alumni Gala",
    date: "March 15, 2024",
    location: "Grand Ballroom",
    attendees: 250,
  },
  {
    id: 2,
    title: "Tech Career Panel",
    date: "March 22, 2024",
    location: "Virtual Event",
    attendees: 150,
  },
  {
    id: 3,
    title: "Regional Meetup - Bay Area",
    date: "April 5, 2024",
    location: "San Francisco, CA",
    attendees: 75,
  },
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm shadow-sm border-slate-200">
        <div className="flex h-16 items-center px-6">
          <SidebarTrigger />
          <div className="ml-4">
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search alumni..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-white/80 border-slate-200 focus:border-slate-300 focus:ring-slate-200"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl p-6 shadow-lg border border-white/10">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Welcome back!
          </h2>
          <p className="text-blue-50/90">
            Stay connected with your alumni network and discover new
            opportunities.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">
                Total Alumni
              </CardTitle>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                10,247
              </div>
              <p className="text-xs text-green-600 font-medium">
                +12% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-1 gap-6">
          {/* Recent Alumni */}
          <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-transparent border-b border-slate-100">
              <CardTitle className="text-slate-800">
                Recently Joined Alumni
              </CardTitle>
              <CardDescription className="text-slate-600">
                New members who joined the network this month
              </CardDescription>
            </CardHeader>
            {/* <CardContent className="space-y-4">
              {Alumni.slice(0, 10).map((alumni) => (
                <div key={alumni.id} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={"/placeholder.svg"} />
                    <AvatarFallback>
                      {alumni.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/dashboard/profile/${alumni.id}`}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600"
                    >
                      {alumni.name}
                    </Link>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>
                        {alumni.course} '{alumni.yearOfPassingOut}
                      </span>
                      <span>•</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      {alumni.address}
                    </div>
                  </div>
                  <Button className="border-1 border-black " size="sm" asChild>
                    <Link href={`/dashboard/profile/${alumni.id}`}>View</Link>
                  </Button>
                </div>
              ))}
              <Button className="w-full border-1 border-black">
                View All Alumni
              </Button>
            </CardContent> */}
          </Card>
        </div>
      </div>
    </div>
  );
}
