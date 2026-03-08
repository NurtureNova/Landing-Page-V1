import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import CourseRegistration from '@/lib/models/CourseRegistration';
import { verifyAdminToken } from '@/lib/auth';
import { cookies } from 'next/headers';

async function isAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return false;
    const payload = await verifyAdminToken(token);
    return !!payload;
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await isAdmin())) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    try {
        const { id } = await params;
        const body = await request.json();
        const registration = await CourseRegistration.findByIdAndUpdate(id, body, { new: true });
        if (!registration) return NextResponse.json({ success: false, message: 'Not Found' }, { status: 404 });
        return NextResponse.json({ success: true, data: registration });
    } catch {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await isAdmin())) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    try {
        const { id } = await params;
        const registration = await CourseRegistration.findByIdAndDelete(id);
        if (!registration) return NextResponse.json({ success: false, message: 'Not Found' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Deleted' });
    } catch {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
