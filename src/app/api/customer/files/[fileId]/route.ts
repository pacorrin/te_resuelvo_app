import fs from "node:fs";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { getCustomerTenderSession } from "@/src/lib/auth/customer-tender-session";
import { FileService } from "@/src/lib/services/file.service";
import { ServiceTicketRepository } from "@/src/lib/repositories/ServiceTickets.repo";
import { FileOwnerType } from "@/src/lib/storage/storage.enums";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    fileId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await getCustomerTenderSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { fileId } = await context.params;
    const id = Number(fileId);
    if (!Number.isFinite(id) || id <= 0) {
      return new NextResponse("File ID is required", { status: 400 });
    }

    const file = await FileService.getById(id);
    if (!file) {
      return new NextResponse("File not found", { status: 404 });
    }

    if (file.ownerType !== FileOwnerType.SERVICE_TICKET_QUOTE) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const ticket = await ServiceTicketRepository.findOneBy({
      id: file.ownerId,
    });
    if (!ticket || ticket.tenderId !== session.tenderId) {
      return new NextResponse("Forbidden", { status: 403 });
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
    console.error("GET /api/customer/files/[fileId] error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
