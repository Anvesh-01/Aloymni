import { NextRequest, NextResponse } from 'next/server';
import {dbConnect} from '@/lib/dbConnect';
import User from '@/models/students';
import Alumni from '@/models/Main'; // Import to verify alumni exists

export async function PATCH(
    request: NextRequest,
    { params }: { params: { uid: string } }
) {
    try {
        console.log('PATCH /api/users/[uid]/verify - Request received');

        const { uid } = params;
        const { verified } = await request.json();

        console.log('UID:', uid);
        console.log('New verification status:', verified);

        if (!uid) {
            console.log('Error: UID is missing');
            return NextResponse.json({ error: 'UID is required' }, { status: 400 });
        }

        if (typeof verified !== 'boolean') {
            console.log('Error: Verified status must be boolean');
            return NextResponse.json({ error: 'Verified status must be boolean' }, { status: 400 });
        }

        console.log('Connecting to database...');
        await dbConnect();
        console.log('Database connected successfully');

        // Optional: Check if alumni exists (for validation)
        const alumni = await Alumni.findOne({ uid: uid });
        if (!alumni) {
            console.log('Warning: Alumni not found for UID:', uid);
            // You can choose to return error or continue
            // return NextResponse.json({ error: 'Alumni not found' }, { status: 404 });
        }

        console.log('Updating user verification status...');
        const updatedUser = await User.findOne({ uid });
        if (updatedUser) {
            updatedUser.verified = verified;
            await updatedUser.save();
            console.log('User updated:', updatedUser);
        }

        if (!updatedUser) {
            console.log('Failed to update/create user');
            return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
        }

        console.log('User verification status updated successfully');
        return NextResponse.json({
            success: true,
            message: 'Verification status updated successfully',
            data: {
                uid: updatedUser.uid,
                verified: updatedUser.verified
            }
        });

    } catch (error) {
        console.error('Error updating verification status:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}