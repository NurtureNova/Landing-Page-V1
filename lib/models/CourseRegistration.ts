import mongoose from 'mongoose';

const CourseRegistrationSchema = new mongoose.Schema({
    formData: { type: Map, of: mongoose.Schema.Types.Mixed, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    read: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.CourseRegistration || mongoose.model('CourseRegistration', CourseRegistrationSchema);
