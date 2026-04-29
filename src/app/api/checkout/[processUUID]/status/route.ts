import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth/auth";
import { TenderBuyerService } from "@/src/lib/services/tender-buyer.service";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    processUUID: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await auth();
    const userId = Number(session?.user?.id);

    if (!Number.isFinite(userId)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { processUUID } = await context.params;
    if (!processUUID) {
      return NextResponse.json(
        { success: false, error: "Process UUID is required" },
        { status: 400 },
      );
    }

    const row = await TenderBuyerService.getTenderBuyerByProcessUuid(processUUID);
    if (row.buyedBy !== userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    return NextResponse.json({
      success: true,
      paymentStatus: row.paymentStatus,
      tenderId: row.tenderId,
      processUUID: row.processUuid,
    });
  } catch (error) {
    console.error("GET /api/checkout/[processUUID]/status error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
