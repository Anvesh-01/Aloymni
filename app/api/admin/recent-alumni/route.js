import {dbConnect} from "@/lib/dbConnect";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Alumni from "@/models/Main";

export async function GET() {
  try {
    // Check if user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    // Get Clerk client
    const client = await clerkClient();

    // Fetch all users from Clerk (with pagination if needed)
    const clerkUsers = await client.users.getUserList({
      limit: 3, // Adjust as needed
      orderBy: "-created_at", // Order by creation date, newest first
    });

    console.log("Clerk users found:", clerkUsers.data.length);

    // Extract UIDs and creation dates from Clerk users
    const userDataWithDates = clerkUsers.data
      .filter((user) => user.publicMetadata?.uid) // Only users with UID
      .map((user) => ({
        uid: user.publicMetadata.uid,
        createdAt: user.createdAt, // This is the Clerk creation timestamp
        clerkId: user.id,
      }));

    console.log("Users with UIDs:", userDataWithDates.length);

    // Get the UIDs to query alumni collection
    const uids = userDataWithDates.map((u) => u.uid);

    // Fetch corresponding alumni data
    const alumniData = await Alumni.find({ uid: { $in: uids } })
      .select(
        "uid name email department course yearOfPassingOut address occupation"
      )
      .lean();

    console.log("Alumni data found:", alumniData.length);

    // Merge alumni data with Clerk creation dates
    const recentAlumni = userDataWithDates
      .map((userData) => {
        const alumni = alumniData.find((a) => a.uid === userData.uid);
        if (alumni) {
          return {
            ...alumni,
            createdAt: userData.createdAt, // Use Clerk's createdAt
            clerkId: userData.clerkId,
          };
        }
        return null;
      })
      .filter(Boolean) // Remove null entries
      .slice(0, 5); // Limit to 5 most recent

    console.log("Final merged data:", recentAlumni.length);

    return NextResponse.json({
      alumni: recentAlumni,
      count: recentAlumni.length,
    });
  } catch (error) {
    console.error("Error fetching recent alumni:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent alumni" },
      { status: 500 }
    );
  }
}
