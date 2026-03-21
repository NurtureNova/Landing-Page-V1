/**
 * Utility to determine the status of an event based on its date and time.
 * @param date The date of the event (string or Date object)
 * @param time The time of the event (string, e.g., "14:00")
 * @returns 'Upcoming' | 'Ongoing' | 'Completed'
 */
export const getEventStatus = (date: string | Date, time: string): string => {
    try {
        if (!date || !time) return 'Upcoming';
        
        // Create a date object from the date part
        const eventDate = new Date(date);
        
        // Extract hours and minutes from time string (e.g., "14:30")
        const [hours, minutes] = time.split(':').map(Number);
        
        // Set the time on the eventDate (using local time as that's how it's input in the form)
        eventDate.setHours(hours, minutes, 0, 0);
        
        const now = new Date();
        
        // Assume a default duration of 3 hours for the event to be 'Ongoing'
        const durationMs = 3 * 60 * 60 * 1000;
        const eventEndTime = new Date(eventDate.getTime() + durationMs);
        
        if (now < eventDate) {
            return 'Upcoming';
        } else if (now > eventEndTime) {
            return 'Completed';
        } else {
            return 'Ongoing';
        }
    } catch (e) {
        console.error('Error calculating event status:', e);
        return 'Upcoming';
    }
};
