import nodemailer from 'nodemailer';

export async function POST(req) {
  const { name, email, message } = await req.json();
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: "sajidhgn1@gmail.com",
        pass: "aezrsihhulyytajr",
      },
    });

    await transporter.sendMail({
      from: `"${name}"`, // Must match Gmail account
      replyTo: email, // ✅ reply goes to user's email
      to: 'sajidhgn1@gmail.com',
      subject: 'New Contact Message',
      text: `Message: ${message}\nFrom: ${name} <${email}>`,
      html: `<p><strong>Message:</strong> ${message}</p>`
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
    });
  }
}
