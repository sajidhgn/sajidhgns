import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { verifyAuth } from '../../../../lib/auth';

export async function GET(req) {
    const auth = verifyAuth(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const about = await prisma.about.findFirst();
        return NextResponse.json(about);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch about' }, { status: 500 });
    }
}

export async function POST(req) {
    const auth = verifyAuth(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const data = await req.json();
        const { id, ...rest } = data;

        let about;
        if (id) {
            about = await prisma.about.update({
                where: { id },
                data: rest,
            });
        } else {
            about = await prisma.about.create({
                data: rest,
            });
        }

        return NextResponse.json(about);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update about' }, { status: 500 });
    }
}
