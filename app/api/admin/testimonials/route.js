import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { verifyAuth } from '../../../../lib/auth';

export async function GET(req) {
    const auth = verifyAuth(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const testimonials = await prisma.testimonial.findMany({
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(testimonials);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
    }
}

export async function POST(req) {
    const auth = verifyAuth(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const data = await req.json();
        const { id, ...rest } = data;

        let testimonial;
        if (id) {
            testimonial = await prisma.testimonial.update({
                where: { id },
                data: rest,
            });
        } else {
            testimonial = await prisma.testimonial.create({
                data: rest,
            });
        }

        return NextResponse.json(testimonial);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save testimonial' }, { status: 500 });
    }
}

export async function DELETE(req) {
    const auth = verifyAuth(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await prisma.testimonial.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Testimonial deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
    }
}
