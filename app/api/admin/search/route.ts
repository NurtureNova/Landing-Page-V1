import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import EventApplication from '@/lib/models/EventApplication';
import CourseRegistration from '@/lib/models/CourseRegistration';
import Event from '@/lib/models/Event';
import { verifyAdminToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { Types } from 'mongoose';

interface IEventApplication {
    _id: Types.ObjectId;
    studentFullName: string;
    programmeChoice: string;
}

interface IEvent {
    _id: Types.ObjectId;
    title: string;
    date: Date;
}

interface ICourseRegistration {
    _id: Types.ObjectId;
    formData: Record<string, unknown> | Map<string, unknown>;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
        return NextResponse.json({ success: true, data: [] });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const payload = await verifyAdminToken(token);
    if (!payload) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    try {
        await dbConnect();

        const regex = new RegExp(query, 'i');

        // Search Event Applications
        const applications = await EventApplication.find({
            $or: [
                { studentFullName: regex },
                { parentFullName: regex },
                { parentEmail: regex },
                { programmeChoice: regex }
            ]
        }).limit(5).lean();

        // Search Events
        const events = await Event.find({
            $or: [
                { title: regex },
                { description: regex },
                { location: regex }
            ]
        }).limit(5).lean();

        // Search Course Registrations
        const registrations = await CourseRegistration.find({
            $or: [
                { "formData.parentFullName": regex },
                { "formData.studentFullName": regex },
                { "formData.email": regex },
                { "formData.parentEmail": regex },
                { "formData.phone": regex }
            ]
        }).limit(5).lean();

        // Format results
        const results = [
            ...applications.map((app: IEventApplication) => ({
                id: app._id.toString(),
                type: 'application',
                title: app.studentFullName,
                subtitle: `Event Application - ${app.programmeChoice}`,
                url: `/admin/applications`
            })),
            ...events.map((evt: IEvent) => ({
                id: evt._id.toString(),
                type: 'event',
                title: evt.title,
                subtitle: `Event - ${new Date(evt.date).toLocaleDateString()}`,
                url: `/admin/events`
            })),
            ...registrations.map((reg: ICourseRegistration) => {
                const fd = (reg.formData instanceof Map ? Object.fromEntries(reg.formData) : reg.formData) as Record<string, string>;
                return {
                    id: reg._id.toString(),
                    type: 'registration',
                    title: fd.studentFullName || fd.parentFullName || 'New Registration',
                    subtitle: `Course Registration - ${fd.programme || 'General'}`,
                    url: `/admin/registrations`
                };
            })
        ];

        return NextResponse.json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
