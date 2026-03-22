import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function appendToSheet(sheetName: string, data: Record<string, string | number | boolean>) {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    // Handle escaped newlines from env variables
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!clientEmail || !privateKey || !sheetId) {
        return;
    }

    try {
        const auth = new JWT({
            email: clientEmail,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(sheetId, auth);
        await doc.loadInfo();

        let sheet = doc.sheetsByTitle[sheetName];

        const headers = Object.keys(data);

        if (!sheet) {
            sheet = await doc.addSheet({ headerValues: headers, title: sheetName });
        } else {
            try {
                await sheet.loadHeaderRow();
                const existingHeaders = sheet.headerValues;
                const missingHeaders = headers.filter(h => !existingHeaders.includes(h));

                if (missingHeaders.length > 0) {
                    // Combine existing and missing headers while preserving order
                    await sheet.setHeaderRow([...existingHeaders, ...missingHeaders]);
                }
            } catch {
                // If header row loading fails (e.g., empty sheet), set headers
                await sheet.setHeaderRow(headers);
            }
        }

        await sheet.addRow(data);
    } catch (error) {
        throw error;
    }
}
