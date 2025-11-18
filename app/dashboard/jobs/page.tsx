"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Building } from "lucide-react"

const jobPostings = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $160k",
    postedBy: "Sarah Johnson '18",
    postedDate: "2 days ago",
    description: "We're looking for a senior software engineer to join our growing team...",
  },
  {
    id: 2,
    title: "Product Manager",
    company: "StartupXYZ",
    location: "New York, NY",
    type: "Full-time",
    salary: "$100k - $140k",
    postedBy: "Michael Chen '19",
    postedDate: "1 week ago",
    description: "Join our product team to help shape the future of our platform...",
  },
  {
    id: 3,
    title: "Marketing Specialist",
    company: "Creative Agency",
    location: "Austin, TX",
    type: "Contract",
    salary: "$60k - $80k",
    postedBy: "Emily Rodriguez '20",
    postedDate: "3 days ago",
    description: "Looking for a creative marketing specialist to drive our campaigns...",
  },
]

export default function Jobs() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="flex h-16 items-center px-6">
          <SidebarTrigger />
          <div className="ml-4">
            <h1 className="text-2xl font-semibold">Job Board</h1>
          </div>
          <div className="ml-auto">
            <Button>Post a Job</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Latest Job Opportunities</h2>
          <p className="text-gray-600">Discover career opportunities shared by fellow alumni.</p>
        </div>

        <div className="space-y-6">
          {jobPostings.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1 text-gray-600">
                      <Building className="h-4 w-4" />
                      <span>{job.company}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{job.type}</Badge>
                    <p className="text-sm font-medium text-green-600 mt-1">{job.salary}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{job.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {job.postedDate}
                    </div>
                  </div>
                  <span>Posted by {job.postedBy}</span>
                </div>
                <div className="flex space-x-2">
                  <Button>Apply Now</Button>
                  <Button variant="outline">Save Job</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
