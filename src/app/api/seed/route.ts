/**
 * Seed API Route - CRUD Operations
 */

import {
  clearAll,
  resetDatabase,
  seedAll,
  seedChapters,
  seedComics,
  seedUsers,
  validateSeedData,
} from "@/database/seed/seedHelpersEnhanced";
import type { SeedOptions } from "@/database/seed/types";
import { NextResponse } from "next/server";
import { z } from "zod";

const seedOptionsSchema = z.object({
  batchSize: z.number().int().positive().max(1000).optional(),
  verbose: z.boolean().optional(),
  dryRun: z.boolean().optional(),
  skipValidation: z.boolean().optional(),
  forceOverwrite: z.boolean().optional(),
});

function validateOptions(body: unknown): SeedOptions {
  try {
    return seedOptionsSchema.parse(body || {});
  } catch (error) {
    throw new Error(`Invalid seed options: ${error}`);
  }
}

function errorResponse(message: string, status = 500) {
  return NextResponse.json({ success: false, error: message }, { status });
}

function successResponse(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export async function GET() {
  try {
    const validation = await validateSeedData({ dryRun: true });
    return successResponse({ message: "Validation complete", results: validation });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Validation failed");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const options = validateOptions(body.options || {});
    const entities = body.entities || "all";

    let result;
    if (entities === "all") {
      result = await seedAll(options);
    } else if (entities === "users") {
      result = await seedUsers(options);
    } else if (entities === "comics") {
      result = await seedComics(options);
    } else if (entities === "chapters") {
      result = await seedChapters(options);
    } else {
      return errorResponse("Invalid entity specified", 400);
    }

    return successResponse({ message: "Seeding completed successfully", results: result });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Seeding failed");
  }
}

export async function DELETE() {
  try {
    await clearAll();
    return successResponse({ message: "All data cleared successfully" });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Clear failed");
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const options = validateOptions(body.options || {});
    await resetDatabase(options);
    return successResponse({ message: "Database reset successfully" });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Reset failed");
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const options = validateOptions(body.options || {});
    const entities = body.entities || "all";
    const upsertOptions = { ...options, forceOverwrite: true };

    let result;
    if (entities === "all") {
      result = await seedAll(upsertOptions);
    } else if (entities === "users") {
      result = await seedUsers(upsertOptions);
    } else if (entities === "comics") {
      result = await seedComics(upsertOptions);
    } else if (entities === "chapters") {
      result = await seedChapters(upsertOptions);
    } else {
      return errorResponse("Invalid entity specified", 400);
    }

    return successResponse({ message: "Upsert completed successfully", results: result });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Upsert failed");
  }
}
