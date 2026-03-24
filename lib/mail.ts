import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Nurture Nova Learning <admin@nurturenovalearning.com>',
            to,
            subject,
            html,
        });

        if (error) {
            console.error('sendEmail failed:', error);
            return { success: false, error };
        }

        return { success: true, messageId: data?.id };
    } catch (error) {
        console.error('sendEmail failed:', error);
        return { success: false, error };
    }
}
