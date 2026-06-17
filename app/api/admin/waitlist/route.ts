import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const pwd = req.nextUrl.searchParams.get("password");

  if (!process.env.ADMIN_PASSWORD || pwd !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("waitlist")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ entries: data });
}
