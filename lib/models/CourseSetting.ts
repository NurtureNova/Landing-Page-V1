import mongoose from 'mongoose';

const FormFieldSchema = new mongoose.Schema({
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, required: true }, // e.g. text, email, tel, select, textarea
    required: { type: Boolean, default: false },
    options: [{ type: String }] // For select fields
});

const CourseSettingSchema = new mongoose.Schema({
    key: { type: String, unique: true, default: 'default_registration_form' },
    title: { type: String, default: 'Course Registration' },
    description: { type: String, default: 'Please fill out the form below to register your child for our courses.' },
    isOpen: { type: Boolean, default: true },
    fields: [FormFieldSchema]
}, { timestamps: true });

// Delete the model if it already exists to force schema update in development
if (mongoose.models.CourseSetting) {
    delete mongoose.models.CourseSetting;
}

export default mongoose.model('CourseSetting', CourseSettingSchema);
