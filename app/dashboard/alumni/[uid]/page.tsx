import {dbConnect} from "@/lib/dbConnect";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Alumni from "@/models/Main";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  GraduationCap,
  Briefcase,
  Calendar,
  Mail,
  Edit,
} from "lucide-react";
import Image from "next/image";
import StaticContactCard from "@/components/StaticContactCard";
import StaticBioCard from "@/components/StaticBioCard";
import StaticProfessionalCard from "@/components/StaticProfessionalCard";
import StaticExpertiseCard from "@/components/StaticExpertiseCard";
import { SidebarTrigger } from "@/components/ui/sidebar";
import StaticAcademicCard from "@/components/StaticAcademicCard";

// Add the params interface
interface ProfilePageProps {
  params: {
    uid: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  try {
    // Extract UID from URL parameters
    const uid = params.uid;
    console.log("Extracted UID from URL:", uid);

    if (!uid) {
      throw new Error("UID not found in URL parameters.");
    }

    await dbConnect();
    const student = await Alumni.findOne({ uid: uid }).lean();
    console.log("Fetched student profile:", student);

    if (!student) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <Card className="w-full max-w-md text-center bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
            <CardHeader>
              <CardTitle className="text-red-600">Profile Not Found</CardTitle>
              <CardDescription>
                Alumni profile with UID "{uid}" could not be found.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    }

    // Get Clerk user data for the profile owner's image
    let userImage = null;
    try {
      const client = await clerkClient();
      // Find user by the UID in public metadata
      const usersList = await client.users.getUserList({
        limit: 500, // Adjust limit as needed
      });

      const profileUser = usersList.data.find(
        (user) => user.publicMetadata?.uid === uid
      );

      if (profileUser) {
        userImage = profileUser.imageUrl;
      }
    } catch (error) {
      console.log("Could not fetch profile owner's image:", error);
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-4 max-w-4xl">
          {/* Header Section */}
          <div className="mb-8">
            <header className="border-b bg-white/80 backdrop-blur-sm">
              <div className="flex h-16 items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-semibold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                    Alumni Profile
                  </h1>
                </div>
              </div>
            </header>
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-lg shadow-sm border border-slate-200/60 backdrop-blur-sm">
              <div className="relative">
                <div className="h-28 w-full bg-gradient-to-r from-emerald-100 via-teal-50 to-cyan-100 rounded-t-lg" />
                <div className="absolute -bottom-12 left-6">
                  {userImage ? (
                    <Image
                      src={userImage}
                      alt={student.name || "User profile picture"}
                      width={96}
                      height={96}
                      className="rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-emerald-100"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 border-4 border-white shadow-lg ring-2 ring-emerald-100 flex items-center justify-center">
                      <span className="text-2xl font-semibold bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {student.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-16 pb-4 px-6 bg-gradient-to-b from-transparent to-slate-50/30">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {student.name}
                </h1>
                <p className="text-md text-slate-600 mt-1 font-medium">
                  {student.course} • {student.department}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  UID: {student.uid}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Cards with proper spacing */}
          <div className="space-y-6">
            <StaticBioCard
              bio={
                student.bio ||
                "Passionate professional with experience in their field. Part of our alumni network."
              }
              occupation={student.occupation || "Not specified"}
              yearOfPassing={student.yearOfPassingOut}
              address={student.address}
            />

            <StaticProfessionalCard
              occupation={student.occupation}
              placeOfWork={student.placeOfWork}
              designation={student.designation}
              officialAddress={student.officialAddress}
            />

            <StaticExpertiseCard
              areaOfExpertise={student.areaOfExpertise}
              willingToContact={student.willingToContact}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StaticContactCard
                email={student.email}
                contactNo={student.contactNo}
                address={student.address}
              />

              <StaticAcademicCard
                course={student.course}
                department={student.department}
                yearOfPassingOut={student.yearOfPassingOut}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center bg-white/80 backdrop-blur-sm border-slate-200/60">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>
              Could not load the profile. Please try again.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
}
