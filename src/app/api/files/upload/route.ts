import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth/auth";
import { saveRequestBodyToLocalFile } from "@/src/lib/storage/local-storage.service";
import { FileCategory, FileOwnerType } from "@/src/lib/storage/storage.enums";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 },
      );
    }

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
      fileMetadata: {
        category: FileCategory.DOCUMENT,
        ownerType: FileOwnerType.USER,
        ownerId: session.user.id,
      },
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