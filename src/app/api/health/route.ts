import { NextResponse } from "next/server";

import { db } from "@/database/db";

/**
 *
 */
export async function GET() {
  try {
    // Check database connection
    await db.execute("SELECT 1");

    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        services: {
          database: "connected",
          app: "running",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
