import { NextRequest, NextResponse } from 'next/server';
import {dbConnect} from '@/lib/dbConnect';
import User from '@/models/students'; // Import your User model

export async function POST(request: NextRequest) {
    try {
        console.log('POST /api/is-verified - Request received');
        
        const { uid } = await request.json();
        console.log('Extracted UID:', uid);

        if (!uid) {
            console.log('Error: UID is missing');
            return NextResponse.json({ error: 'UID is required' }, { status: 400 });
        }

        console.log('Connecting to database...');
        await dbConnect();
        console.log('Database connected successfully');

        console.log('Searching for user with UID:', uid);
        const user = await User.findOne({ uid: uid }).lean();
        console.log('User found:', user ? 'Yes' : 'No');
        console.log('User details:', user);

        if (!user) {
            console.log('User not found, returning verified: false');
            return NextResponse.json({ verified: false }, { status: 404 });
        }

        const isVerified = (user as any).verified || false;
        console.log('User verification status:', isVerified);
        return NextResponse.json({ verified: isVerified });
    } catch (error) {
        console.error('Error checking verification status:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
