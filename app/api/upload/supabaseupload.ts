import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

// Supabase client setup
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueId = randomUUID();
    const extension = file.name.split(".").pop() || "bin";
    const filename = `${uniqueId}.${extension}`;

    // Upload to Supabase storage
    const { error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME!)
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ error: "Upload failed." }, { status: 500 });
    }

    const { data } = supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME!)
      .getPublicUrl(filename);

    return NextResponse.json(
      {
        message: "File uploaded to Supabase successfully.",
        url: data.publicUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
