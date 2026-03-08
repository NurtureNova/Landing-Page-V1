import mongoose from 'mongoose';
import fs from 'node:fs';
import path from 'node:path';

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')    // Remove all non-word chars
        .replace(/--+/g, '-')       // Replace multiple - with single -
        .replace(/^-+/, '')         // Trim - from start of text
        .replace(/-+$/, '');        // Trim - from end of text
}

async function migrateSlugs() {
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

    const EventSchema = new mongoose.Schema({
        title: { type: String, required: true },
        slug: { type: String, unique: true },
    }, { timestamps: true });

    const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const events = await Event.find({ $or: [{ slug: { $exists: false } }, { slug: '' }] });
        console.log(`Found ${events.length} events without slugs.`);

        for (const event of events) {
            let baseSlug = slugify(event.title);
            let slug = baseSlug;
            let counter = 1;

            // Ensure uniqueness
            while (await Event.findOne({ slug, _id: { $ne: event._id } })) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }

            event.slug = slug;
            await event.save();
            console.log(`Updated event "${event.title}" with slug "${slug}"`);
        }

        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

migrateSlugs();
