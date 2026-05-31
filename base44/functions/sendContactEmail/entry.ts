import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { Resend } from 'npm:resend@2.0.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const contact = body.data || body;
    const { name, email, goal, message } = contact;

    await resend.emails.send({
      from: 'GC Fitness Coach <onboarding@resend.dev>',
      to: 'fitnessprogram.info@gmail.com',
      subject: `Nuovo messaggio da ${name || 'Visitatore'}`,
      text: `
Hai ricevuto un nuovo messaggio dal sito GC Fitness Coach.

Nome: ${name || '—'}
Email: ${email || '—'}
Obiettivo: ${goal || '—'}

Messaggio:
${message || '—'}
      `.trim(),
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});