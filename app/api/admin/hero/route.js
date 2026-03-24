import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { verifyAuth } from '../../../../lib/auth';

export async function GET(req) {
    const auth = verifyAuth(req);
    if (!auth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const hero = await prisma.hero.findFirst();
        return NextResponse.json(hero);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch hero' }, { status: 500 });
    }
}

export async function POST(req) {
    const auth = verifyAuth(req);
    if (!auth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const data = await req.json();
        const { id, ...rest } = data;

        let hero;
        if (id) {
            hero = await prisma.hero.update({
                where: { id },
                data: rest,
            });
        } else {
            hero = await prisma.hero.create({
                data: rest,
            });
        }

        return NextResponse.json(hero);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update hero' }, { status: 500 });
    }
}
