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
import EditableContactCard from "@/components/EditableContactCard";
import EditableBioCard from "@/components/EditableBioCard";
import EditableProfessionalCard from "@/components/EditableProfessionalCard";
import EditableExpertiseCard from "@/components/EditableExpertiseCard";
import { SidebarTrigger } from "@/components/ui/sidebar";
import EditbleAcademicCard from "@/components/EditableAcademicCard";
export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const uid = user.publicMetadata?.uid;

    // if (!uid) {
    //   throw new Error("UID not found in user's public metadata.");
    // }

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
                Your profile could not be found.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
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
                    My Profile
                  </h1>
                </div>
              </div>
            </header>
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-lg shadow-sm border border-slate-200/60 backdrop-blur-sm">
              <div className="relative">
                <div className="h-28 w-full bg-gradient-to-r from-blue-100 via-indigo-50 to-purple-100 rounded-t-lg" />
                <div className="absolute -bottom-12 left-6">
                  <Image
                    src={user.imageUrl}
                    alt={student.name || "User profile picture"}
                    width={96}
                    height={96}
                    className="rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-blue-100"
                  />
                </div>
              </div>
              <div className="pt-16 pb-4 px-6 bg-gradient-to-b from-transparent to-slate-50/30">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {student.name}
                </h1>
                <p className="text-md text-slate-600 mt-1 font-medium">
                  {student.course} • {student.department}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Cards Section */}
          <div className="space-y-6 flex-1 gap-10 mb-9">
            <EditableBioCard
              name={student.name}
              yearOfPassing={student.yearOfPassingOut}
              course={student.course}
              department={student.department}
              bio={student.bio}
              occupation={student.occupation}
            />

            <EditableProfessionalCard
              occupation={student.occupation}
              placeOfWork={student.placeOfWork}
              designation={student.designation}
              officialAddress={student.officialAddress}
            />

            <EditableExpertiseCard
              areaOfExpertise={student.areaOfExpertise}
              willingToContact={student.willingToContact}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EditableContactCard
                email={student.email}
                contactNo={student.contactNo}
                address={student.address}
              />

              <EditbleAcademicCard
                highestDegree={student.highestDegree?.specify}
                institution={student.higherEducation?.institution}
                yearOfCompletion={student.highestDegree?.year}
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
            <CardDescription>Could not load your profile.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
}
