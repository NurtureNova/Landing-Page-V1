import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/lib/models/Event';
import { verifyAdminToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        await dbConnect();
        const events = await Event.find({}).sort({ date: 1 });
        return NextResponse.json({ success: true, data: events });
    } catch (error) {
        console.error('API /events GET error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    // Protect route
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const payload = await verifyAdminToken(token);
    if (!payload) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    try {
        await dbConnect();
        const body = await request.json();
        const event = await Event.create(body);
        return NextResponse.json({ success: true, data: event }, { status: 201 });
    } catch (error) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
        console.error('API /events POST error:', error);
        return NextResponse.json({ success: false, message: errMessage }, { status: 400 });
    }
}
