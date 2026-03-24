import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const to = searchParams.get('to');

    if (!to) {
        return NextResponse.json({ error: 'Add ?to=youremail@gmail.com to the URL' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: `"Nurture Nova Learning" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Test Email from Nurture Nova',
            html: '<p>This is a test email. SMTP is working correctly.</p>',
        });
        return NextResponse.json({
            success: true,
            messageId: info.messageId,
            response: info.response,
            to,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
            to,
        }, { status: 500 });
    }
}
