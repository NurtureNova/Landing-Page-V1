import mongoose from 'mongoose';

const EventApplicationSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    studentFullName: { type: String, required: true },
    parentFullName: { type: String, required: true },
    parentEmail: { type: String, required: true },
    parentPhone: { type: String, required: true },
    schoolYear: { type: String, required: true },
    programmeChoice: { type: String, required: true },
    source: { type: String, required: true },
    sourceOther: { type: String },
    status: {
        type: String,
        default: 'Received'
    },
    read: { type: Boolean, default: false }
}, { timestamps: true });

// Delete the model if it exists to ensure schema updates are applied
if (mongoose.models.EventApplication) {
    delete mongoose.models.EventApplication;
}

export default mongoose.model('EventApplication', EventApplicationSchema);
