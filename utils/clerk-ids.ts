// bulk-import.js
import { createClerkClient } from '@clerk/backend'
import mongoose from 'mongoose';
import User from "@/models/students" // Your Mongoose Alumni model
import { Types } from 'mongoose';
import {dbConnect} from '@/lib/dbConnect';
// import { clerkClient } from "@clerk/nextjs/server";
// Make sure to run 'npm install dotenv'

// --- SETUP ---
const { CLERK_SECRET_KEY, MONGODB_URI } = process.env;

if (!CLERK_SECRET_KEY || !MONGODB_URI) {
  throw new Error("CLERK_SECRET_KEY and MONGODB_URI must be set in your .env file");
}

const clerk = createClerkClient({ secretKey: CLERK_SECRET_KEY });

// --- MAIN LOGIC ---

async function runImport() {
  console.log("Starting bulk import...");
  // await dbConnect();
  // Connect to your database
  // Find all users in your DB that do NOT have a clerkId yet
  const usersToImport = await User.find({ clerkId: { $exists: false } }) as Array<{
    _id: Types.ObjectId;
    email: string;
    name: string;
    uid: string;
    clerkId?: string;
  }>;
  // const usersToImport = await User.find({ clerkId: { $exists: false } });
  
  if (usersToImport.length === 0) {
    console.log("All users are already synced.");
    await mongoose.disconnect();
    return;
  }
console.log(`Found ${usersToImport.length} users to import to Clerk...`);

  
  const createdUsers = [];
  
  // Loop through each user found in your database
  for (const user of usersToImport) {
        try {
        // Step 1: Create the user in Clerk
  //         const clerkUser = await clerkClient.users .createUser({
  //   emailAddress: [user.email],
  //   firstName: user.name,
  // });
// 2. Create user in Clerk with a temporary password
// const clerkUser = await clerk.users.createUser({
//   emailAddress: [user.email],
//   firstName: user.name,
//   password: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
//   publicMetadata: {
//     uid: user.uid,
//   },
// });

// const invitation = await clerk.invitations.createInvitation({
//   emailAddress: user.email,
//   redirectUrl: `https://alumini-mocha.vercel.app/alumini/${user.uid}`,
// });
      // 2. Create user in Clerk without password and send invitation
const invitation = await clerk.invitations.createInvitation({
  emailAddress: user.email,
  redirectUrl: `${process.env.MAIN_URL}/sign-up`,
  publicMetadata: {
    uid: user.uid,
  },
  notify: true // sends the invitation email
});

      //       emailAddress: user.email,
      //       redirectUrl: `${process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || 'https://alumini-mocha.vercel.app/dashboard'}`,
      //       notify: true // This sends the email invitation
      //     });
        // Step 2: GET THE CLERK ID from the response

  const newClerkId = invitation.id;

        // Step 3: CONNECT by updating your MongoDB document with the new Clerk ID
await User.updateOne(
  { _id: user._id },
  { 
    $set: { 
      clerkInvitationId: invitation.id,
      invitationSent: true,
      invitationSentAt: new Date()
    } 
  }
);
              createdUsers.push({ uid: user.uid, email: user.email });

        
        console.log(`✅ Synced: ${user.email} -> ${newClerkId}`);
        } catch (error: any) {
        console.error(`❌ Failed to sync ${user.email}: ${error.errors ? error.errors[0].longMessage : error.message}`);
        }
    }

  console.log("Bulk import finished.");
  await mongoose.disconnect();
}

export { runImport };
