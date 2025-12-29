import { NextResponse } from "next/server";

type GetFunction = (id: string | number) => Promise<unknown>;
type UpdateFunction = (id: string | number, data: unknown) => Promise<unknown>;
type DeleteFunction = (id: string | number) => Promise<unknown | boolean>;

interface ValidationResult {
  success: boolean;
  value?: unknown;
}

type ValidationFunction = (value: unknown) => ValidationResult;

export function zodToValidationResult(_schema: unknown) {
  // Return a simple validator function that always accepts (stub)
  return (value: unknown): ValidationResult => ({ success: true, value });
}

export async function getGenericEntity(
  id: string | number,
  options: { getFn: GetFunction; validateFn?: ValidationFunction; entityName?: string }
) {
  try {
    const data = await options.getFn(id);
    if (!data)
      return NextResponse.json(
        { error: `${options.entityName || "entity"} not found` },
        { status: 404 }
      );
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function updateGenericEntity(
  id: string | number,
  body: unknown,
  options: {
    updateFn: UpdateFunction;
    idValidateFn?: ValidationFunction;
    dataValidateFn?: ValidationFunction;
    entityName?: string;
  }
) {
  try {
    // naive validation stubs
    if (options.idValidateFn) {
      const r = options.idValidateFn(id);
      if (r?.success === false) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    if (options.dataValidateFn) {
      const r = options.dataValidateFn(body);
      if (r?.success === false)
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const result = await options.updateFn(id, body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function deleteGenericEntity(
  id: string | number,
  options: { deleteFn: DeleteFunction; validateFn?: ValidationFunction; entityName?: string }
) {
  try {
    if (options.validateFn) {
      const r = options.validateFn(id);
      if (r?.success === false) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const result = await options.deleteFn(id);
    return NextResponse.json({ success: !!result });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
