// app/api/achievements/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { dbConnect } from '@/lib/dbConnect';
import Achievement from '@/models/Achievement';

// GET - Fetch all achievements
export async function GET() {
  try {
    await dbConnect();
    
    const achievements = await Achievement.find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean();

    return NextResponse.json({
      success: true,
      achievements,
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}

// POST - Create new achievement
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { title, description, image, alumniName, alumniDesignation } = body;

    // Validate required fields
    if (!title || !description || !image || !alumniName || !alumniDesignation) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    const achievement = await Achievement.create({
      title,
      description,
      image,
      alumniName,
      alumniDesignation,
    });

    return NextResponse.json({
      success: true,
      message: 'Achievement created successfully',
      achievement,
    });
  } catch (error) {
    console.error('Error creating achievement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create achievement' },
      { status: 500 }
    );
  }
}

// PUT - Update achievement
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { id, title, description, image, alumniName, alumniDesignation } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Achievement ID is required' },
        { status: 400 }
      );
    }

    const achievement = await Achievement.findByIdAndUpdate(
      id,
      { title, description, image, alumniName, alumniDesignation },
      { new: true, runValidators: true }
    );

    if (!achievement) {
      return NextResponse.json(
        { success: false, error: 'Achievement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Achievement updated successfully',
      achievement,
    });
  } catch (error) {
    console.error('Error updating achievement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update achievement' },
      { status: 500 }
    );
  }
}

// DELETE - Delete achievement
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Achievement ID is required' },
        { status: 400 }
      );
    }

    const achievement = await Achievement.findByIdAndDelete(id);

    if (!achievement) {
      return NextResponse.json(
        { success: false, error: 'Achievement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Achievement deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete achievement' },
      { status: 500 }
    );
  }
}