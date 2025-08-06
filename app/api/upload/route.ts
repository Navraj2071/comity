import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

const s3 = new S3Client({
  forcePathStyle: true,
  region: process.env.AWS_REGION!,
  endpoint: process.env.SUPABASE_S3_ENPOINT!,
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
      console.error(
        "The 'file' object received does not have an arrayBuffer method.",
        file
      );
      return NextResponse.json(
        { error: "Invalid file data received." },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueId = randomUUID();
    const extension = file.name.split(".").pop() || "tmp";
    const filename = `${uniqueId}.${extension}`;

    if (process.env.ENV === "production") {
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
      };

      await s3.send(new PutObjectCommand(uploadParams));

      const fileUrl = `${process.env.SUPABASE_FILE_ENPOINT}${filename}`;
      return NextResponse.json(
        {
          message: "File uploaded to S3 successfully.",
          url: fileUrl,
        },
        { status: 201 }
      );
    }

    console.log("local environment");

    const filepath = join(UPLOAD_DIR, filename);
    await mkdir(UPLOAD_DIR, { recursive: true });

    await writeFile(filepath, buffer);
    return NextResponse.json(
      {
        message: "File uploaded successfully.",
        url: `/uploads/${filename}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("File upload failed:", error);
    return NextResponse.json({ error: "File upload failed." }, { status: 500 });
  }
}

import { readdir, readFile } from "fs/promises";

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const { fileId } = params;

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required." },
        { status: 400 }
      );
    }

    // Read the contents of the upload directory to find the file.
    const files = await readdir(UPLOAD_DIR);

    // Find the filename that starts with the provided unique ID.
    const filename = files.find((file) => file.startsWith(fileId));

    if (!filename) {
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }

    // Construct the full path to the file.
    const filepath = join(UPLOAD_DIR, filename);

    // Read the file from the filesystem.
    const buffer = await readFile(filepath);

    // Determine the content type based on the file extension.
    // This is a simplified example; a more robust solution would use a library
    // like `mime-types` to get the correct MIME type.
    const extension = filename.split(".").pop()?.toLowerCase() || "";
    let contentType = "application/octet-stream"; // Default content type

    if (extension === "jpg" || extension === "jpeg") {
      contentType = "image/jpeg";
    } else if (extension === "png") {
      contentType = "image/png";
    } else if (extension === "pdf") {
      contentType = "application/pdf";
    } else if (extension === "txt") {
      contentType = "text/plain";
    }

    // Return the file content as a response.
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Optional: Suggest a filename for download.
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Failed to retrieve file:", error);
    return NextResponse.json(
      { error: "Failed to retrieve file." },
      { status: 500 }
    );
  }
}
