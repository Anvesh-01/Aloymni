"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";

const upcomingEvents = [
  {
    id: 1,
    title: "Annual Alumni Gala",
    date: "March 15, 2024",
    time: "7:00 PM",
    location: "Grand Ballroom, Downtown Hotel",
    attendees: 250,
    description:
      "Join us for an elegant evening of networking, dining, and celebrating our alumni achievements.",
    category: "Networking",
  },
  {
    id: 2,
    title: "Tech Career Panel",
    date: "March 22, 2024",
    time: "6:00 PM",
    location: "Virtual Event",
    attendees: 150,
    description:
      "Learn from successful alumni in the tech industry about career paths and opportunities.",
    category: "Career",
  },
  {
    id: 3,
    title: "Regional Meetup - Bay Area",
    date: "April 5, 2024",
    time: "12:00 PM",
    location: "San Francisco, CA",
    attendees: 75,
    description:
      "Casual lunch meetup for Bay Area alumni to connect and share experiences.",
    category: "Social",
  },
];

export default function Events() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="flex h-16 items-center px-6">
          <SidebarTrigger />
          <div className="ml-4">
            <h1 className="text-2xl font-semibold">Events</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Upcoming Events</h2>
          <p className="text-gray-600">
            Connect with fellow alumni at these exciting events.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {upcomingEvents.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <Badge variant="outline" className="mt-2">
                      {event.category}
                    </Badge>
                  </div>
                  <Badge variant="secondary">{event.attendees} attending</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {event.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {event.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                </div>
                <Button className="w-full mt-4">Register for Event</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
