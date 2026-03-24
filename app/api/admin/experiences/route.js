import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { verifyAuth } from '../../../../lib/auth';

export async function GET(req) {
    const auth = verifyAuth(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const experiences = await prisma.experience.findMany({
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(experiences);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
    }
}

export async function POST(req) {
    const auth = verifyAuth(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const data = await req.json();
        const { id, ...rest } = data;

        let experience;
        if (id) {
            experience = await prisma.experience.update({
                where: { id },
                data: rest,
            });
        } else {
            experience = await prisma.experience.create({
                data: rest,
            });
        }

        return NextResponse.json(experience);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save experience' }, { status: 500 });
    }
}

export async function DELETE(req) {
    const auth = verifyAuth(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await prisma.experience.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Experience deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
    }
}
