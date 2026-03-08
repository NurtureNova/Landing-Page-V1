import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/lib/models/Event';
import EventApplication from '@/lib/models/EventApplication';
import { verifyAdminToken } from '@/lib/auth';
import { cookies } from 'next/headers';

async function isAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return false;
    const payload = await verifyAdminToken(token);
    return !!payload;
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        
        let event;
        // Check if it's a valid ObjectId, otherwise treat it as a slug
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
        
        if (isValidObjectId) {
            event = await Event.findById(id).lean();
        } else {
            event = await Event.findOne({ slug: id }).lean();
        }

        if (!event) return NextResponse.json({ success: false, message: 'Not Found' }, { status: 404 });
        
        // Count applications for this event
        const applicationCount = await EventApplication.countDocuments({ eventId: event._id });
        
        return NextResponse.json({ 
            success: true, 
            data: { 
                ...event, 
                applicationCount 
            } 
        });
    } catch (error) {
        console.error('Event fetch error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await isAdmin())) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();
        const event = await Event.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!event) return NextResponse.json({ success: false, message: 'Not Found' }, { status: 404 });
        return NextResponse.json({ success: true, data: event });
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, message: errMessage }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await isAdmin())) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const { id } = await params;
        const event = await Event.findByIdAndDelete(id);
        if (!event) return NextResponse.json({ success: false, message: 'Not Found' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Event deleted' });
    } catch {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
