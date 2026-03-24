import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
    const config = {
        host: 'smtp.hostinger.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    };

    const transporter = nodemailer.createTransport(config);

    try {
        await transporter.verify();
        return NextResponse.json({
            success: true,
            message: 'SMTP connection verified successfully',
            user: process.env.EMAIL_USER,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
            user: process.env.EMAIL_USER,
            passSet: !!process.env.EMAIL_PASS,
        }, { status: 500 });
    }
}
