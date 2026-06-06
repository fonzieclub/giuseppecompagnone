import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const NOTIFY_EMAIL = Deno.env.get("CONTACT_NOTIFY_EMAIL") || "fitnessprogram.info@gmail.com";
const FROM_EMAIL = Deno.env.get("CONTACT_FROM_EMAIL") || "GC Fitness Coach <onboarding@resend.dev>";
const FALLBACK_FROM = "GC Fitness Coach <onboarding@resend.dev>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sendViaResend(payload: {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  text: string;
  html: string;
}) {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "Email service not configured" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { name, email, goal, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload = {
      to: [NOTIFY_EMAIL],
      reply_to: email,
      subject: `Nuovo messaggio da ${name} — giuseppecompagnone.com`,
      text: [
        "Hai ricevuto un nuovo messaggio dal sito giuseppecompagnone.com",
        "",
        `Nome: ${name}`,
        `Email: ${email}`,
        `Obiettivo: ${goal || "—"}`,
        "",
        "Messaggio:",
        message,
      ].join("\n"),
      html: `
        <h2>Nuovo messaggio dal sito</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Obiettivo:</strong> ${goal || "—"}</p>
        <p><strong>Messaggio:</strong></p>
        <p style="white-space:pre-wrap">${message}</p>
      `,
    };

    let res = await sendViaResend({ ...payload, from: FROM_EMAIL });

    if (!res.ok) {
      const errText = await res.text();
      const domainNotAuthorized = errText.includes("not authorized to send emails from");

      if (domainNotAuthorized && FROM_EMAIL !== FALLBACK_FROM) {
        console.warn("Custom FROM failed, falling back to onboarding@resend.dev");
        res = await sendViaResend({ ...payload, from: FALLBACK_FROM });
      } else {
        console.error("Resend error:", errText);
        return new Response(
          JSON.stringify({ success: false, error: errText }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend fallback error:", err);
      return new Response(
        JSON.stringify({ success: false, error: err }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Contact email error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
