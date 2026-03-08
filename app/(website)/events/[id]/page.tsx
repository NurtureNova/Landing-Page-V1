import { Metadata } from 'next';
import dbConnect from '@/lib/db';
import Event from '@/lib/models/Event';
import EventDetailClient from './EventDetailClient';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

function stripHtml(html: string) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    
    await dbConnect();
    
    let event;
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    
    if (isValidObjectId) {
        event = await Event.findById(id).lean();
    } else {
        event = await Event.findOne({ slug: id }).lean();
    }

    if (!event) return { title: 'Event Not Found' };

    const plainDescription = stripHtml(event.description);
    const title = `${event.title} | NurtureNova Learning`;
    const description = plainDescription.substring(0, 160);
    const imageUrl = event.imageUrl || "https://nurturenovalearning.com/nurture-nova.png";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [imageUrl],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        },
    };
}

export default async function Page({ params }: Props) {
    const { id } = await params;
    
    await dbConnect();
    
    let eventExists;
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    
    if (isValidObjectId) {
        eventExists = await Event.exists({ _id: id });
    } else {
        eventExists = await Event.exists({ slug: id });
    }

    if (!eventExists) {
        notFound();
    }

    return <EventDetailClient id={id} />;
}
