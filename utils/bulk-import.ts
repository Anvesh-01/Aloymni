// // bulk-import.ts
// import { Clerk, ClerkOptions } from '@clerk/clerk-sdk-node';
// import mongoose from 'mongoose';
// import User   from '@/models/Main';
// import {dbConnect} from "@/lib/dbConnect";
// import 'dotenv/config';

// // --- SETUP ---
// const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;


// if (!CLERK_SECRET_KEY || '') {
//   throw new Error("CLERK_SECRET_KEY must be set in your .env file");
// }

// const clerk = Clerk({ secretKey: CLERK_SECRET_KEY });

// // --- MAIN LOGIC ---
// async function runImport(): Promise<void> {
//   try {
//     await dbConnect();
//     console.log("✅ Database connected.");

//     const usersToImport = await User.find({ clerkId: { $exists: false } });

//     if (usersToImport.length === 0) {
//       console.log("All users are already synced.");
//       return;
//     }

//     console.log(`🔍 Found ${usersToImport.length} users to import to Clerk...`);

//     for (const user of usersToImport) {
//       try {
//         const clerkUser = await clerk.users.createUser({
//           emailAddress: [user.email],
//           password: (user as any).password || "TempPass@123", // fallback password
//           firstName: user.name?.split(" ")[0] || "User",
//           lastName: user.name?.split(" ")[1] || "",
//           skipPasswordChecks: true,
//         });

//         await User.updateOne(
//           { _id: user._id },
//           { $set: { clerkId: clerkUser.id } }
//         );

//         console.log(`✅ Synced: ${user.email} -> ${clerkUser.id}`);
//       } catch (error: any) {
//         console.error(`❌ Failed to sync ${user.email}:`, error?.errors?.[0]?.longMessage || error.message);
//       }
//     }
//   } catch (error) {
//     console.error("❌ Bulk import error:", error);
//   } finally {
//     await mongoose.disconnect();
//     console.log("🔌 Database disconnected.");
//   }
// }

// runImport();
