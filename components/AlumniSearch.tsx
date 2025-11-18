"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, MapPin, Users, Briefcase } from "lucide-react";
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
  placeOfWork?: string;
  designation?: string;
}

interface AlumniSearchProps {
  initialAlumni: Alumni[];
}

export default function AlumniSearch({ initialAlumni }: AlumniSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAlumni, setFilteredAlumni] = useState(initialAlumni);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredAlumni(initialAlumni);
    } else {
      const filtered = initialAlumni.filter(
        (alumni) =>
          alumni.name.toLowerCase().includes(query.toLowerCase()) ||
          alumni.department.toLowerCase().includes(query.toLowerCase()) ||
          alumni.course.toLowerCase().includes(query.toLowerCase()) ||
          (alumni.occupation &&
            alumni.occupation.toLowerCase().includes(query.toLowerCase())) ||
          (alumni.placeOfWork &&
            alumni.placeOfWork.toLowerCase().includes(query.toLowerCase())) ||
          (alumni.address &&
            alumni.address.toLowerCase().includes(query.toLowerCase())) ||
          alumni.yearOfPassingOut.toString().includes(query)
      );
      setFilteredAlumni(filtered);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search by name, department, course, company..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-white/90 border-slate-200 focus:border-blue-300 focus:ring-blue-200 shadow-sm"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-3 py-2 border border-blue-100">
          <Users className="h-4 w-4 text-blue-600" />
          <span className="text-slate-700 font-medium">
            {filteredAlumni.length} alumni found
          </span>
        </div>
      </div>

      {/* Alumni Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlumni.map((alumni) => (
          <Card
            key={alumni._id}
            className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-slate-50 border-slate-200/60 hover:border-slate-300/80 hover:-translate-y-1"
          >
            <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-transparent">
              <div className="flex items-center space-x-3">
                <Avatar className="border-2 border-white shadow-md">
                  <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-800 font-semibold">
                    {getInitials(alumni.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    {alumni.name}
                  </CardTitle>
                  <p className="text-sm text-slate-600 font-medium">
                    Class of {alumni.yearOfPassingOut}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <Badge
                  variant="secondary"
                  className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                >
                  {alumni.course}
                </Badge>
                <div className="text-sm text-slate-600 font-medium">
                  {alumni.department}
                </div>

                {/* Occupation/Job */}
                {alumni.occupation && (
                  <div className="flex items-center text-sm font-medium text-slate-800 bg-green-50 rounded-md px-2 py-1 border border-green-100">
                    <Briefcase className="h-3 w-3 mr-1 text-green-600" />
                    {alumni.occupation}
                  </div>
                )}

                {/* Place of Work */}
                {alumni.placeOfWork && (
                  <p className="text-sm font-medium text-gray-700">
                    {alumni.placeOfWork}
                  </p>
                )}

                {/* Designation */}
                {alumni.designation && (
                  <p className="text-xs text-gray-600">{alumni.designation}</p>
                )}

                {/* Location */}
                {alumni.address && (
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    {alumni.address}
                  </div>
                )}
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all shadow-sm"
                  asChild
                >
                  <Link href={`/dashboard/alumni/${alumni.uid}`}>
                    View Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredAlumni.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No alumni found
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? "Try adjusting your search criteria."
              : "No alumni data available."}
          </p>
        </div>
      )}
    </>
  );
}
