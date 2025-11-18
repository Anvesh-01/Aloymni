import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Users } from "lucide-react";
import Link from "next/link";
import {dbConnect} from "@/lib/dbConnect";
import Alumni from "@/models/Main";
import AlumniSearch from "@/components/AlumniSearch";


async function getAllAlumni() {
  try {
    await dbConnect();

    const alumni = await Alumni.find({})
      .select(
        "uid name email department course yearOfPassingOut address occupation placeOfWork designation"
      )
      .sort({ name: 1 })
      .lean();

    // Convert MongoDB documents to plain objects and stringify uid
    return alumni.map((alumni) => ({
      ...alumni,
      uid: alumni.uid.toString(),
    }));
  } catch (error) {
    console.error("Error fetching alumni:", error);
    return [];
  }
}

export default async function AlumniDirectory() {
  const allAlumni = await getAllAlumni();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm shadow-sm border-slate-200">
        <div className="flex h-16 items-center px-6">
          <SidebarTrigger />
          <div className="ml-4">
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              Alumni Directory
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-200/60 shadow-sm">
            <div className="p-1.5 bg-blue-50 rounded-md">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-slate-700 font-medium">
              {allAlumni.length} alumni found
            </span>
          </div>
        </div>

        {/* Search Component */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-lg p-1">
          <AlumniSearch initialAlumni={allAlumni} />
        </div>
      </div>
    </div>
  );
}
