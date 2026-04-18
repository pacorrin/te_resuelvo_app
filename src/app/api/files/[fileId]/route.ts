import fs from "node:fs";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth/auth";
import { FileService } from "@/src/lib/services/file.service";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    fileId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { fileId } = await context.params;

    if (!fileId) {
      return new NextResponse("File ID is required", { status: 400 });
    }

    const file = await FileService.getById(Number(fileId));
    if (!file) {
      return new NextResponse("File not found", { status: 404 });
    }

    const mimeType = file.mimeType;
    const fileStream = fs.createReadStream(file.relativePath);
    const body = Readable.toWeb(fileStream);

    return new NextResponse(body as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": file.size.toString(),
        "Cache-Control": "private, max-age=3600",
        "Content-Disposition": `inline; filename="${file.originalName}"`,
      },
    });
  } catch (error) {
    console.error("GET /api/files/[fileId] error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}