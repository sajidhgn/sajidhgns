import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from '../../../../lib/prisma';

export async function GET() {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findFirst({
            where: { id: decoded.userId },
            select: { id: true, username: true, email: true }
        });

        if (!user) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        return NextResponse.json({ authenticated: true, user });
    } catch (error) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
}
