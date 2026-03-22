import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import CourseSetting from '@/lib/models/CourseSetting';
import { verifyAdminToken } from '@/lib/auth';
import { cookies } from 'next/headers';

async function isAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return false;
    const payload = await verifyAdminToken(token);
    return !!payload;
}

export async function GET() {
    try {
        await dbConnect();
        const settings = await CourseSetting.findOne({ key: 'default_registration_form' });

        const defaultData = {
            fields: [],
            title: 'Course Registration',
            description: 'Please fill out the form below to register your child for our courses.',
            isOpen: true
        };

        if (!settings) {
            return NextResponse.json({ success: true, data: defaultData });
        }

        // Merge with defaults in case of existing document without title/description
        const finalData = {
            ...defaultData,
            ...settings.toObject()
        };

        return NextResponse.json({ success: true, data: finalData });
    } catch {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!(await isAdmin())) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const body = await request.json();
        const { fields, title, description, isOpen } = body;

        // Use updateOne with upsert to be more explicit and potentially bypass model caching issues
        await CourseSetting.updateOne(
            { key: 'default_registration_form' },
            { $set: { fields, title, description, isOpen } },
            { upsert: true }
        );

        const settings = await CourseSetting.findOne({ key: 'default_registration_form' });

        return NextResponse.json({ success: true, data: settings });
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, message: errMessage }, { status: 400 });
    }
}
