import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    isVirtual: { type: Boolean, default: false },
    imageUrl: { type: String },
    requiresApplication: { type: Boolean, default: true },
    maxApplicants: { type: Number },
    status: {
        type: String,
        enum: ['Upcoming', 'Ongoing', 'Completed'],
        default: 'Upcoming'
    },
    accordions: [{
        title: { type: String },
        content: { type: String }
    }],
    footerContent: { type: String },
    customEmailSubject: { type: String },
    customEmailHtml: { type: String },
}, { timestamps: true });

const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const eventData = {
            title: "NurtureNova Learning 11+ & SATs 2026 Bootcamp",
            slug: "nnl-11-plus-sats-2026-bootcamp",
            description: `
                <p><strong>Is Your Child Ready for the 11+ and SATs Exams?</strong></p>
                <p>Preparing for the 11+ and SATs exams can be challenging, especially with increasing competition and exam pressure. Many students struggle not because they lack ability, but because they lack structured preparation, exam strategies, and time-management skills.</p>
                <p>To support parents and students, NurtureNova Learning is hosting a <strong>Free 4-Week 11+ & SATs Readiness Bootcamp</strong> starting 25th April 2026.</p>
                <p>This focused online programme will help students improve exam techniques, speed, confidence, and problem-solving skills in key subjects including Mathematics, English, Science, and Verbal/Non-Verbal Reasoning.</p>
            `,
            date: new Date("2026-04-25T10:00:00"),
            time: "10:00",
            location: "Zoom (Online)",
            isVirtual: true,
            imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80",
            requiresApplication: true,
            maxApplicants: 100,
            status: "Upcoming",
            accordions: [
                {
                    title: "What the Bootcamp Includes",
                    content: `
                        <p>Students will:</p>
                        <ul>
                            <li>Take a short diagnostic assessment to identify strengths and improvement areas</li>
                            <li>Learn effective 11+ & SATs problem-solving strategies</li>
                            <li>Practise timed exam-style questions in Maths, English, Science, VR and NVR</li>
                            <li>Improve speed, accuracy, and exam confidence</li>
                        </ul>
                    `
                },
                {
                    title: "Bootcamp Dates",
                    content: `
                        <p>25th April<br>2nd May<br>9th May<br>16th May</p>
                        <p><strong>Duration:</strong> 60 minutes per session</p>
                    `
                },
                {
                    title: "What Happens After the Bootcamp?",
                    content: `
                        <p>At the end of the programme, parents will receive a summary report highlighting:</p>
                        <ul>
                            <li>Your child’s key strengths</li>
                            <li>Areas that may need further improvement</li>
                            <li>A recommended preparation pathway for the 11+ and SATs</li>
                        </ul>
                        <p>This report will help you clearly understand your child’s current level and the best next steps for their exam preparation.</p>
                    `
                }
            ],
            footerContent: `<p><strong>Reserve your child’s free spot today:</strong> limited Zoom seats available.</p>`,
            customEmailSubject: "You're In! Welcome to the NurtureNova 11+ & SATs Bootcamp",
            customEmailHtml: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
                    <h2 style="color: #2563eb;">You're In! Welcome to the NurtureNova 11+ & SATs Bootcamp</h2>
                    <p>Dear Parent/Guardian,</p>
                    <p>Thank you for registering your child for the <strong>NurtureNova Learning 11+ & SATs Bootcamp</strong>.</p>
                    <p>We are excited to support your child in strengthening the key skills needed to succeed in competitive exams. Over the course of this 4-Saturday online bootcamp, students will receive focused instruction in:</p>
                    <ul style="list-style: none; padding-left: 0;">
                        <li>✅ Mathematics</li>
                        <li>✅ English</li>
                        <li>✅ Non-Verbal Reasoning (NVR)</li>
                        <li>✅ Verbal Reasoning (VR)</li>
                        <li>✅ Science</li>
                    </ul>
                    <p>Each session is designed to help students build confidence, improve problem-solving ability, and learn smart exam strategies used by top-performing students.</p>
                    
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #e5e7eb;">
                        <h3 style="margin-top: 0; color: #1e40af;">Bootcamp Details</h3>
                        <p style="margin-bottom: 5px;"><strong>Start Date:</strong> 25 April 2026</p>
                        <p style="margin-bottom: 5px;"><strong>End Date:</strong> 16 May 2026</p>
                        <p style="margin-bottom: 5px;"><strong>Schedule:</strong> Saturdays only</p>
                        <p style="margin-bottom: 5px;"><strong>Duration:</strong> 90 minutes per session</p>
                        <p style="margin-bottom: 0;"><strong>Venue:</strong> Zoom</p>
                    </div>

                    <p>Closer to the start date, we will send you:</p>
                    <ul>
                        <li>Zoom access details</li>
                        <li>Preparation instructions for the first session</li>
                    </ul>
                    
                    <p>We are looking forward to supporting your child's academic journey.</p>
                    
                    <p>Warm regards,<br><strong>NurtureNova Learning Team</strong></p>
                </div>
            `
        };

        const existing = await Event.findOne({ slug: eventData.slug });
        if (existing) {
            await Event.updateOne({ slug: eventData.slug }, eventData);
            console.log('Event updated');
        } else {
            await Event.create(eventData);
            console.log('Event created');
        }

        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seed();
