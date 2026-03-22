import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import EventApplication from '@/lib/models/EventApplication';
import CourseRegistration from '@/lib/models/CourseRegistration';
import { Types } from 'mongoose';

interface App {
    _id: Types.ObjectId;
    studentFullName: string;
    createdAt: Date;
    read?: boolean;
}

interface Reg {
    _id: Types.ObjectId;
    createdAt: Date;
    read?: boolean;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const unreadOnly = searchParams.get('unreadOnly') !== 'false';

    try {
        await dbConnect();

        const query = unreadOnly ? { read: { $ne: true } } : {};

        // Fetch recent applications
        const applications = await EventApplication.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        // Fetch recent registrations
        const registrations = await CourseRegistration.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        // Combine and format
        const activities = [
            ...applications.map((app: App) => ({
                id: app._id.toString(),
                type: 'application',
                title: 'New Event Application',
                description: `${app.studentFullName} applied for an event.`,
                timestamp: app.createdAt.toString(),
                read: !!app.read
            })),
            ...registrations.map((reg: Reg) => ({
                id: reg._id.toString(),
                type: 'registration',
                title: 'New Course Registration',
                description: 'A new parent has registered for a course.',
                timestamp: reg.createdAt.toString(),
                read: !!reg.read
            }))
        ];

        // Sort by most recent
        activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return NextResponse.json({
            success: true,
            data: activities.slice(0, limit)
        });
    } catch {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        
        const { action, id, type } = await request.json();

        if (action === 'mark_all_read') {
            await Promise.all([
                EventApplication.updateMany({ read: { $ne: true } }, { $set: { read: true } }),
                CourseRegistration.updateMany({ read: { $ne: true } }, { $set: { read: true } })
            ]);
            return NextResponse.json({ success: true, message: 'All notifications marked as read' });
        }

        if (action === 'mark_read' && id && type) {
            if (type === 'application') {
                await EventApplication.findByIdAndUpdate(id, { $set: { read: true } });
            } else if (type === 'registration') {
                await CourseRegistration.findByIdAndUpdate(id, { $set: { read: true } });
            }
            return NextResponse.json({ success: true, message: 'Notification marked as read' });
        }

        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    } catch {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
