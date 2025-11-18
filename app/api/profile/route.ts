// app/api/profile/route.ts

import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import {dbConnect} from "@/lib/dbConnect";
import Alumni from "@/models/Main";

// This function handles PUT requests to update a profile
export async function PUT(req: Request) {
  try {
    // 1. Authenticate the request to get the user's Clerk ID
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const uid = user.publicMetadata?.uid;
    if (!uid) {
      return new NextResponse("User profile is not fully configured.", {
        status: 400,
      });
    }

    // 3. Get the updated data from the request body
    const body = await req.json();

    await dbConnect();

    // 4. Find the user's document in the database using their unique alumni ID (uid)
    //    and update it with the new data.
    const updatedAlumni = await Alumni.findOneAndUpdate(
      { uid: uid },
      {
        $set: body,
      },
      { new: true, runValidators: true } // Options: return the updated document after the update is applied
    );

    if (!updatedAlumni) {
      return new NextResponse("Profile not found in database", { status: 404 });
    }

    // 5. Send a success response back to the client
    return NextResponse.json({
      message: "Profile updated successfully!",
      student: updatedAlumni,
    });
  } catch (error) {
    console.error("[PROFILE_UPDATE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
