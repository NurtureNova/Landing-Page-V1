import { cookies } from 'next/headers';
import { verifyAdminToken } from './auth';

export async function getAdminSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
        return null;
    }

    const payload = await verifyAdminToken(token);
    
    if (!payload || payload.role !== 'admin') {
        return null;
    }

    return {
        id: payload.sub as string,
        role: payload.role as string
    };
}
