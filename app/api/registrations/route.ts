import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import CourseRegistration from '@/lib/models/CourseRegistration';
import { verifyAdminToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { appendToSheet } from '@/lib/googleSheets';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const payload = await verifyAdminToken(token);
    if (!payload) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    try {
        await dbConnect();
        const registrations = await CourseRegistration.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: registrations });
    } catch {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        
        const registration = await CourseRegistration.create({ formData: body });

        // Background push to Google Sheets
        appendToSheet('Course_Registrations', {
            RegistrationId: registration._id.toString(),
            DateApplied: new Date().toLocaleString(),
            Status: 'Pending',
            ...body
        }).catch(() => {});

        return NextResponse.json({ success: true, data: registration }, { status: 201 });
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, message: errMessage }, { status: 400 });
    }
}
