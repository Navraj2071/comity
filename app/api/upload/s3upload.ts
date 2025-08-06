// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

// Setup AWS S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (typeof file.arrayBuffer !== "function") {
      return NextResponse.json(
        { error: "Invalid file data received." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueId = randomUUID();
    const extension = file.name.split(".").pop() || "bin";
    const filename = `${uniqueId}.${extension}`;

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;

    return NextResponse.json(
      {
        message: "File uploaded to S3 successfully.",
        url: fileUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("File upload to S3 failed:", error);
    return NextResponse.json({ error: "File upload failed." }, { status: 500 });
  }
}
