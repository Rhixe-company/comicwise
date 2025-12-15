import { NextResponse } from "next/server";

type GetFn = (id: string | number) => Promise<unknown>;
type UpdateFn = (id: string | number, data: unknown) => Promise<unknown>;
type DeleteFn = (id: string | number) => Promise<unknown>;

interface ValidationResult {
  success: boolean;
  value?: unknown;
}

type ValidationFn = (value: unknown) => ValidationResult;

export function zodToValidationResult(_schema: unknown) {
  // Return a simple validator function that always accepts (stub)
  return (value: unknown): ValidationResult => ({ success: true, value });
}

export async function getGenericEntity(
  id: string | number,
  opts: { getFn: GetFn; validateFn?: ValidationFn; entityName?: string }
) {
  try {
    const data = await opts.getFn(id);
    if (!data)
      return NextResponse.json(
        { error: `${opts.entityName || "entity"} not found` },
        { status: 404 }
      );
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function updateGenericEntity(
  id: string | number,
  body: unknown,
  opts: {
    updateFn: UpdateFn;
    idValidateFn?: ValidationFn;
    dataValidateFn?: ValidationFn;
    entityName?: string;
  }
) {
  try {
    // naive validation stubs
    if (opts.idValidateFn) {
      const r = opts.idValidateFn(id);
      if (r?.success === false) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    if (opts.dataValidateFn) {
      const r = opts.dataValidateFn(body);
      if (r?.success === false)
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const result = await opts.updateFn(id, body);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function deleteGenericEntity(
  id: string | number,
  opts: { deleteFn: DeleteFn; validateFn?: ValidationFn; entityName?: string }
) {
  try {
    if (opts.validateFn) {
      const r = opts.validateFn(id);
      if (r?.success === false) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const result = await opts.deleteFn(id);
    return NextResponse.json({ success: !!result });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
