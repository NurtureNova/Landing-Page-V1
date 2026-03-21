import mongoose from 'mongoose';
import fs from 'node:fs';
import path from 'node:path';

async function createAdmin() {
    let MONGODB_URI;
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const match = envContent.match(/^MONGODB_URI=(.*)$/m);
        if (match) {
            MONGODB_URI = match[1].trim();
        }
    } catch (e) {
        console.error('Error reading .env file:', e.message);
    }

    if (!MONGODB_URI) {
        console.error('MONGODB_URI not found in .env');
        process.exit(1);
    }

    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
        console.log('Usage: node scripts/create-admin.mjs <email> <password>');
        process.exit(1);
    }

    const AdminSchema = new mongoose.Schema({
        password: { type: String, required: true },
        email: { type: String, required: true, unique: true },
    }, { timestamps: true });

    // Hash password before saving (consistent with model)
    AdminSchema.pre('save', async function () {
        if (!this.isModified('password')) {
            return;
        }
        // We use dynamic import for bcrypt here as it might not be in the node path for this script easily
        const bcrypt = (await import('bcryptjs')).default;
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    });

    const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            console.log(`Admin with email ${email} already exists.`);
            return;
        }

        await Admin.create({ email, password });
        console.log(`Admin ${email} created successfully!`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

createAdmin();
