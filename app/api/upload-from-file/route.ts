
import { NextResponse } from 'next/server';
import {dbConnect} from '@/lib/dbConnect';
import Alumni from '@/models/Main';
import bcrypt from 'bcryptjs';
import User from '@/models/students';
import { sendCredentialsEmail } from '@/utils/sendMail';
import { runImport } from '@/utils/clerk-ids'; // Assuming this is the function to sync with Clerk



export async function POST(req: Request) {
    try {
        await dbConnect();

        const body = await req.json();
        const data = body.data;
        // console.log("Received data:", data);

        if (!Array.isArray(data)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }
        
        const alumniArray = [];
        const userArray = [];
        // const emailQueue = [];

         for (const entry of data) {
      const { uid, alumniData } = entry;

      alumniArray.push({ ...alumniData });

      // const hashedPassword = await bcrypt.hash(password, 10);
      userArray.push({
        email: alumniData.email,
        name: alumniData.name,
        uid: uid,
        role: 'user',
        alumniRef: null,
        verified: true,
      });

      // emailQueue.push({ name: alumniData.name, email: alumniData.email, uid });
    }

    const insertedAlumni = await Alumni.insertMany(alumniArray, { ordered: false });

    for (let i = 0; i < insertedAlumni.length; i++) {
      userArray[i].alumniRef = insertedAlumni[i]._id as any;
    }

    await User.insertMany(userArray, { ordered: false });

    // const batchSize = 100;
    // for (let i = 0; i < emailQueue.length; i += batchSize) {
    //   const batch = emailQueue.slice(i, i + batchSize);
    //   await Promise.allSettled(
    //     batch.map(user =>
    //       sendCredentialsEmail(user.name, user.email, user.uid, user.password)
    //     )
    //   );
    //   await new Promise(r => setTimeout(r, 1500)); // small delay between batches
    // }

    return NextResponse.json({
      message: 'Upload completed',
      inserted: insertedAlumni.length,
    });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}


