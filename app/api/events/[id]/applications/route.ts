import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import EventApplication from '@/lib/models/EventApplication';
import Event from '@/lib/models/Event';
import { verifyAdminToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { appendToSheet } from '@/lib/googleSheets';
import { sendEmail } from '@/lib/mail';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const payload = await verifyAdminToken(token);
    if (!payload) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    try {
        await dbConnect();
        const { id } = await params;
        const applications = await EventApplication.find({ eventId: id }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: applications });
    } catch {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();

        const event = await Event.findById(id);
        if (!event) return NextResponse.json({ success: false, message: 'Event Not Found' }, { status: 404 });

        // Check if event is completed
        if (event.status === 'Completed') {
            return NextResponse.json({ success: false, message: 'This event has already been completed.' }, { status: 400 });
        }

        // Check 30-minute cutoff
        const [hours, minutes] = event.time.split(':').map(Number);
        const eventFullDate = new Date(event.date);
        eventFullDate.setHours(hours, minutes, 0, 0);
        const diffInMins = (eventFullDate.getTime() - new Date().getTime()) / (1000 * 60);

        if (diffInMins < 30) {
            return NextResponse.json({ success: false, message: 'Applications for this event are now closed (cutoff reached).' }, { status: 400 });
        }

        // Check capacity
        if (event.maxApplicants) {
            const currentCount = await EventApplication.countDocuments({ eventId: id });
            if (currentCount >= event.maxApplicants) {
                return NextResponse.json({ success: false, message: 'This event has reached its maximum capacity of applicants.' }, { status: 400 });
            }
        }

        const appData = { ...body, eventId: id };
        const application = await EventApplication.create(appData);

        // Background tasks
        const sheetData = {
            ApplicationId: application._id.toString(),
            EventId: id,
            EventName: event.title,
            EventDate: event.date ? new Date(event.date).toLocaleDateString() : 'N/A',
            EventTime: event.time || 'N/A',
            EventLocation: event.location || 'N/A',
            DateApplied: new Date().toLocaleString(),
            Status: 'Received',
            StudentFullName: body.studentFullName || 'N/A',
            ParentFullName: body.parentFullName || 'N/A',
            ParentEmail: body.parentEmail || 'N/A',
            ParentPhone: body.parentPhone || 'N/A',
            SchoolYear: body.schoolYear || 'N/A',
            ProgrammeChoice: body.programmeChoice || 'N/A',
            Source: body.source === 'Others' ? (body.sourceOther || 'Others') : (body.source || 'N/A'),
        };

        // Push to Google Sheets
        appendToSheet('Event_Applications', sheetData).catch(err => {
            console.error('Background task failed (Google Sheets push):', err);
        });

        // Send Confirmation Email
        let subject = `Confirmation: Application for ${event.title}`;
        let emailHtml = "";

        if (event.customEmailHtml) {
            subject = event.customEmailSubject || subject;
            emailHtml = event.customEmailHtml.replace(/Parent\/Guardian/g, body.parentFullName || 'Parent/Guardian');
        } else {
            emailHtml = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #2563eb;">Application Received!</h2>
                    <p>Dear ${body.parentFullName},</p>
                    <p>Thank you for applying for your child, <strong>${body.studentFullName}</strong>, to join the <strong>${event.title}</strong>.</p>
                    <p>We have received your application and will keep you updated with further details about the event.</p>
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 20px;">
                        <h3 style="margin-top: 0;">Application Summary:</h3>
                        <ul style="list-style: none; padding: 0;">
                            <li><strong>Event:</strong> ${event.title}</li>
                            <li><strong>Programme:</strong> ${body.programmeChoice}</li>
                            <li><strong>Student:</strong> ${body.studentFullName}</li>
                            <li><strong>School Year:</strong> ${body.schoolYear}</li>
                        </ul>
                    </div>
                    <p style="margin-top: 20px;">If you have any questions, feel free to reply to this email.</p>
                    <p>Best regards,<br>The Nurture Nova Learning Team</p>
                </div>
            `;
        }

        sendEmail({
            to: body.parentEmail,
            subject: subject,
            html: emailHtml
        }).catch(err => {
            console.error('Background task failed (Email sending):', err);
        });

        return NextResponse.json({ success: true, data: application }, { status: 201 });
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, message: errMessage }, { status: 400 });
    }
}
