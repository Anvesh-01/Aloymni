
import { NextResponse } from 'next/server';
import {dbConnect} from '@/lib/dbConnect';
import Alumni from '@/models/Main';
import User from '@/models/students';
import { ok } from 'assert';
import { clerkClient } from '@clerk/clerk-sdk-node';





export async function POST(req: Request) {
    try {
      console.log("Received registration request");
        await dbConnect();

        const body = await req.json();
        const data = body.data;
        console.log("Received data:", data);
        const { alumniData } = data.entry;
        const uid = alumniData.regNo;
        const userId = alumniData.userId ; // Use userId from data or fallback to uid
        console.log("Extracted UID:", uid);

        console.log("Alumni Data:", alumniData);


        const alumniDocument = {
            ...alumniData,
            uid: uid,
            registerNo: alumniData.regNo // Map regNo to registerNo as per schema
        };


      console.log("Alumni Data:", alumniDocument);


        // Create the user document
        const userDocument = {
            email: alumniData.email,
            name: alumniData.name,
            uid: uid, // Add uid to user document too
            role: 'user',
            alumniRef: null,
            verified: false,
            clerkId: userId
        };


      const insertedAlumni = await Alumni.create(alumniDocument);
// Update user document with alumni reference
        userDocument.alumniRef = insertedAlumni._id as any;

   // Insert single user document
        await User.create( userDocument);

 await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      uid: uid,
    },
  })
        return NextResponse.json({
          message: 'User registered successfully',
          success: true,
          ok: true,
          uid: uid
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}


