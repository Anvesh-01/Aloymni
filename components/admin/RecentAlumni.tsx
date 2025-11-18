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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Briefcase, GraduationCap } from "lucide-react";
import Link from "next/link";

interface Alumni {
  _id: string;
  uid: string;
  name: string;
  email: string;
  department: string;
  course: string;
  yearOfPassingOut: number;
  address?: string;
  occupation?: string;
  createdAt: number | string; // Clerk uses timestamp (number) or ISO string
  clerkId?: string;
}

export default function RecentAlumni() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentAlumni = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/recent-alumni");

        if (!response.ok) {
          throw new Error("Failed to fetch recent alumni");
        }

        const data = await response.json();
        setAlumni(data.alumni || []);

        // Console log all createdAt values here
        data.alumni?.forEach((member: Alumni) => {
          console.log("Member:", member.name, "CreatedAt:", member.createdAt);
          console.log("Type of createdAt:", typeof member.createdAt);
          console.log("Clerk ID:", member.clerkId);
        });
      } catch (err) {
        console.error("Error fetching recent alumni:", err);
        setError(err instanceof Error ? err.message : "Failed to load alumni");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAlumni();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateValue: number | string) => {
    console.log("Formatting date:", dateValue, "Type:", typeof dateValue);

    if (!dateValue) {
      return "No date";
    }

    let date: Date;

    // Handle Clerk timestamp (number) or ISO string
    if (typeof dateValue === "number") {
      // Clerk timestamps are in milliseconds
      date = new Date(dateValue);
    } else {
      // Handle ISO string
      date = new Date(dateValue);
    }

    if (isNaN(date.getTime())) {
      console.log("Invalid date detected for:", dateValue);
      return "Recently added";
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recently Joined Alumni</CardTitle>
          <CardDescription>
            New members who joined the network recently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-4">
            <div className="text-sm text-muted-foreground">
              Loading recent alumni...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recently Joined Alumni</CardTitle>
          <CardDescription>
            New members who joined the network recently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-4">
            <div className="text-sm text-red-500">Error: {error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recently Joined Alumni</CardTitle>
        <CardDescription>
          {alumni.length > 0
            ? `${alumni.length} new members joined recently`
            : "No recent alumni found"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {alumni.length === 0 ? (
          <div className="text-center py-4">
            <div className="text-sm text-muted-foreground">
              No alumni have joined recently
            </div>
          </div>
        ) : (
          <>
            {alumni.map((member) => {
              // Console log here inside the map function
              console.log(
                "Rendering member:",
                member.name,
                "CreatedAt:",
                member.createdAt
              );

              return (
                <div
                  key={member._id}
                  className="flex items-center space-x-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {member.name}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(member.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 mt-1">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        {member.course} '{member.yearOfPassingOut}
                      </div>
                      <span className="text-xs text-muted-foreground">•</span>
                      <div className="text-xs text-muted-foreground">
                        {member.department}
                      </div>
                    </div>

                    {member.occupation && (
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {member.occupation}
                      </div>
                    )}

                    {member.address && (
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {member.address}
                      </div>
                    )}
                  </div>

                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/adminDashboard/alumni/${member._id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              );
            })}

            <Button variant="outline" className="w-full" asChild>
              <Link href="/adminDashboard/alumni">View All Alumni</Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
