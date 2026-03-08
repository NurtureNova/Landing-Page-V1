import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
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
        const application = await EventApplication.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!application) return NextResponse.json({ success: false, message: 'Not Found' }, { status: 404 });
        return NextResponse.json({ success: true, data: application });
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

    try {
        await dbConnect();
        const { id } = await params;
        const application = await EventApplication.findByIdAndDelete(id);
        if (!application) return NextResponse.json({ success: false, message: 'Not Found' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Application deleted' });
    } catch {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
