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

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
