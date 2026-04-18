import { NextResponse } from "next/server";
import { saveRequestBodyToLocalFile } from "@/src/lib/storage/local-storage.service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    const fileName =
      request.headers.get("x-file-name") || `upload-${Date.now()}.bin`;

    if (!request.body) {
      return NextResponse.json(
        { success: false, error: "Request body is empty." },
        { status: 400 },
      );
    }

    const result = await saveRequestBodyToLocalFile({
      body: request.body,
      fileName,
      folder: "documents",
      contentType,
    });

    console.log(result);

    return NextResponse.json({
      success: true,
      file: result,
    });
  } catch (error) {
    console.error("Upload route error:", error);

    return NextResponse.json(
      { success: false, error: "Upload failed." },
      { status: 500 },
    );
  }
}