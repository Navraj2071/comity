import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

// Define the directory where files will be stored.
// It's good practice to use the /tmp directory for temporary files.
const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

export async function POST(request: NextRequest) {
  try {
    // Ensure the upload directory exists.
    // The `recursive: true` option creates parent directories if they don't exist.
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Get the form data from the request.
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    // Check if a file was provided.
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

    // Convert the file data to a Buffer.
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate a unique identifier for the file.
    const uniqueId = randomUUID();
    // Get the file extension from the original filename.
    const extension = file.name.split(".").pop() || "tmp";
    const filename = `${uniqueId}.${extension}`;

    // Define the full path where the file will be saved.
    const filepath = join(UPLOAD_DIR, filename);

    // Write the file to the filesystem.
    await writeFile(filepath, buffer);

    console.log(`File uploaded successfully: ${filepath}`);

    // Return a success response with the unique ID of the uploaded file.
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

// 2. File Retrieval Endpoint: app/api/upload/[fileId]/route.ts
// This dynamic route handles GET requests to retrieve a file by its ID.

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
