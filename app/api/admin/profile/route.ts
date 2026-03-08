import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/lib/models/Admin';
import bcrypt from 'bcryptjs';

async function getAdmin() {
    await dbConnect();
    return await Admin.findOne({});
}

export async function GET() {
    try {
        const admin = await getAdmin();
        if (!admin) return NextResponse.json({ success: false, message: 'Admin not found' }, { status: 404 });

        return NextResponse.json({ 
            success: true, 
            data: { 
                email: admin.email 
            } 
        });
    } catch {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { email, currentPassword, newPassword } = await request.json();
        const admin = await getAdmin();
        if (!admin) return NextResponse.json({ success: false, message: 'Admin not found' }, { status: 404 });

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, message: 'Current password is incorrect' }, { status: 400 });
        }

        // Update basic info
        admin.email = email || admin.email;

        // Update password if provided
        if (newPassword) {
            admin.password = newPassword;
        }

        await admin.save();

        return NextResponse.json({ success: true, message: 'Profile updated successfully' });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Server Error';
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
}
