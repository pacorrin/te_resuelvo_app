import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth/auth";
import { ExampleService } from "@/src/lib/services/example.service";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    exampleId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { exampleId } = await context.params;
    const id = Number(exampleId);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid id" },
        { status: 400 },
      );
    }

    const row = await ExampleService.getById(id);
    if (!row) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 },
      );
    }

    // TODO: authorize session user for this row via domain service

    return NextResponse.json({
      success: true,
      data: ExampleService.serialize(row),
    });
  } catch (error) {
    console.error("GET /api/example/[exampleId] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
