import { NextResponse } from 'next/server';
import { signAdminToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Admin from '@/lib/models/Admin';
import bcrypt from 'bcryptjs';

// Simple in-memory rate limiting (Note: resets on server restart/serverless cold start)
const loginAttempts = new Map<string, { count: number, resetTime: number }>();
const MAX_ATTEMPTS = 5;
const COOLDOWN_PERIOD = 15 * 60 * 1000; // 15 minutes

export async function POST(request: Request) {
    try {
        const ip = request.headers.get('x-forwarded-for') || 'anonymous';
        
        // Check rate limit
        const now = Date.now();
        const record = loginAttempts.get(ip);
        
        if (record) {
            if (now < record.resetTime) {
                if (record.count >= MAX_ATTEMPTS) {
                    return NextResponse.json({ 
                        success: false, 
                        message: 'Too many login attempts. Please try again in 15 minutes.' 
                    }, { status: 429 });
                }
            } else {
                // Reset if cooldown passed
                loginAttempts.delete(ip);
            }
        }

        await dbConnect();
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
        }

        // 1. Try to find the admin in the database by email
        const admin = await Admin.findOne({ email });

        // 2. Verify the password
        if (admin) {
            const isMatch = await bcrypt.compare(password, admin.password);
            
            if (isMatch) {
                // Success: reset attempts for this IP
                loginAttempts.delete(ip);
                
                const token = await signAdminToken(admin._id.toString());

                const response = NextResponse.json({ success: true, message: 'Logged in successfully' });

                response.cookies.set({
                    name: 'admin_token',
                    value: token,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 48, // 48 hours
                    path: '/',
                });

                return response;
            }
        }

        // Failure: increment attempts
        const currentRecord = loginAttempts.get(ip) || { count: 0, resetTime: now + COOLDOWN_PERIOD };
        currentRecord.count += 1;
        loginAttempts.set(ip, currentRecord);

        return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
