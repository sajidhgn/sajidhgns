import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: { email },
        });

        if (!user) {
            // Don't reveal if user exists for security, but in this case we can for simplicity if they are admins
            return NextResponse.json({ message: 'If an account exists with that email, a reset link has been sent' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            secure: process.env.SMTP_PORT === '465',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

        await transporter.sendMail({
            from: `"Sajid Admin" <${process.env.SMTP_USER}>`,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p style="color: #555;">You requested a password reset. Please click the button below to reset your password. This link is valid for 1 hour.</p>
                    <a href="${resetUrl}" style="display: inline-block; background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
                    <p style="color: #555;">If you did not request this, you can safely ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #999;">If the button doesn't work, copy and paste this link: <br> ${resetUrl}</p>
                </div>
            `,
        });

        return NextResponse.json({ message: 'Reset email sent' });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
    }
}
