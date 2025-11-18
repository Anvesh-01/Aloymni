// app/api/alumni/route.js
import { NextResponse } from "next/server"
import {dbConnect} from "@/lib/dbConnect"
import Alumni from "@/models/Main"

export async function GET() {
  try {
    // Connect to MongoDB
    await dbConnect()

    // Fetch all alumni records
    const alumni = await Alumni.find({}).lean()

    return NextResponse.json({ success: true, alumni })
  } catch (error) {
    console.error("Error fetching alumni:", error)
    return NextResponse.json({ error: "Failed to fetch alumni" }, { status: 500 })
  }
}