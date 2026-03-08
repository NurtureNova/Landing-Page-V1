import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is not defined in production environment');
}

const SECRET_KEY = JWT_SECRET || 'fallback_secret_for_development_only';
const encodedSecret = new TextEncoder().encode(SECRET_KEY);

export async function signAdminToken(adminId: string) {
    const token = await new SignJWT({ 
        role: 'admin',
        sub: adminId
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h') // 24 hours expiry
        .sign(encodedSecret);

    return token;
}

export async function verifyAdminToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, encodedSecret);
        return payload;
    } catch {
        return null;
    }
}
