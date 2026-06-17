import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";

function emailHtml(email: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#000;color:#fff;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;padding:60px 40px;">
    <tr>
      <td style="text-align:center;padding-bottom:48px;">
        <div style="font-size:64px;font-weight:900;letter-spacing:-2px;font-family:Arial,sans-serif;line-height:1;">ENTOURAGE</div>
        <div style="font-size:10px;letter-spacing:5px;color:#444;margin-top:10px;text-transform:uppercase;">EST. 2026</div>
      </td>
    </tr>
    <tr>
      <td style="border-top:1px solid #1a1a1a;border-bottom:1px solid #1a1a1a;padding:48px 0;text-align:center;">
        <p style="font-size:22px;font-style:italic;color:#ddd;line-height:1.5;margin:0 0 12px;">
          Every entourage has a visionary at the centre.
        </p>
        <p style="font-size:26px;font-style:italic;font-weight:700;color:#fff;line-height:1.3;margin:0;">
          You&rsquo;re it.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding-top:40px;text-align:center;">
        <p style="font-size:11px;letter-spacing:3px;color:#555;text-transform:uppercase;margin:0 0 10px;">
          DROP 01 &middot; LATE 2026 &middot; N&deg; &mdash; / 100
        </p>
        <p style="font-size:12px;color:#444;margin:0;">
          You&rsquo;re on the list. We&rsquo;ll reach out when Drop 01 is ready.
        </p>
        <p style="font-size:11px;color:#333;margin:24px 0 0;">${email}</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const clean = email.toLowerCase().trim();

    const sb = supabaseAdmin();
    const { error } = await sb
      .from("waitlist")
      .insert({ email: clean, source: "website" });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "You're already on the list." },
          { status: 409 }
        );
      }
      throw error;
    }

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "ENTOURAGE <noreply@entourageclo.com>",
        to: clean,
        subject: "You're in the circle. — ENTOURAGE",
        html: emailHtml(clean),
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[waitlist]", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
