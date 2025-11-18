import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/backend";
import { NextResponse } from "next/server";
import {dbConnect} from "@/lib/dbConnect";
import User from "@/models/students";

export async function POST(req: Request) {
  // Clerk signs webhooks with svix
  console.log("📬 Received Clerk webhook");
  const payload = await  req.text();
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");
  let evt: any;

  try {
    console.log("🔐 Verifying webhook signature");
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) ;
  } catch (err) {
    console.log("❌ Error verifying webhook:", err);
    return new Response("Invalid signature", { status: 400 });
  }
  console.log("✅ Webhook verified:", evt.type);
  const { type, data } = evt;

  try {
    await dbConnect();
    console.log("🔗 Database connected for webhook processing");

    if (type === "user.created") {
      console.log("🔔 Handling user.created event");
      const clerkId = data.id;
      const email = data.email_addresses?.[0]?.email_address;
      const name = data.first_name
        ? `${data.first_name} ${data.last_name || ""}`
        : email;

      // match with user that was pre-invited by CSV (uid/email)
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        existingUser.clerkId = clerkId;
        existingUser.invitationSent = true;
        existingUser.invitationSentAt = new Date();
        await existingUser.save();
        console.log("✅ Linked Clerk user to DB:", existingUser.uid);
      } else {
        // fallback: create a new record
        const newUser = await User.create({
          email,
          name,
          clerkId,
          role: "user",
          verified: false,
        });
        console.log("🆕 Created new alumni user:", newUser.uid);
      }
    }

    if (type === "user.updated") {
      // e.g., name change, email update, etc.
      const clerkId = data.id;
      await User.findOneAndUpdate(
        { clerkId },
        {
          name: data.first_name
            ? `${data.first_name} ${data.last_name || ""}`
            : undefined,
          email: data.email_addresses?.[0]?.email_address,
        }
      );
      console.log("🔄 Synced user update for clerkId:", clerkId);
    }
  } catch (err) {
    console.error("Webhook handling error:", err);
    return new Response("Webhook error", { status: 500 });
  }

  return NextResponse.json({ success: true });
}
