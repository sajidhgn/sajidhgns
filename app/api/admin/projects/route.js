import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { verifyAuth } from '../../../../lib/auth';

export async function GET(req) {
    const auth = verifyAuth(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const projects = await prisma.project.findMany({
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

export async function POST(req) {
    const auth = verifyAuth(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const data = await req.json();
        const { id, ...rest } = data;

        let project;
        if (id) {
            project = await prisma.project.update({
                where: { id },
                data: rest,
            });
        } else {
            project = await prisma.project.create({
                data: rest,
            });
        }

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
    }
}

export async function DELETE(req) {
    const auth = verifyAuth(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await prisma.project.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Project deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
