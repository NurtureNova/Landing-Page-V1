import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/lib/models/Event';
import EventApplication from '@/lib/models/EventApplication';
import CourseRegistration from '@/lib/models/CourseRegistration';
import { verifyAdminToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const payload = await verifyAdminToken(token);
    if (!payload) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    try {
        await dbConnect();

        // Get total counts
        const [totalEvents, totalApplications, totalRegistrations] = await Promise.all([
            Event.countDocuments(),
            EventApplication.countDocuments(),
            CourseRegistration.countDocuments()
        ]);

        // Get recent (last 7 days) counts for "trends"
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const [recentEvents, recentApplications, recentRegistrations] = await Promise.all([
            Event.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
            EventApplication.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
            CourseRegistration.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
        ]);

        return NextResponse.json({
            success: true,
            data: {
                events: { total: totalEvents, recent: recentEvents },
                applications: { total: totalApplications, recent: recentApplications },
                registrations: { total: totalRegistrations, recent: recentRegistrations }
            }
        });
    } catch (error) {
        console.error('Stats error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
