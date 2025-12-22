import chalk from "chalk";
import fs from "fs-extra";
import ora from "ora";
import path from "path";

const templates = {
  component: `import React from 'react';

export const {{name}} = () => {
  return <div>{{name}}</div>;
};`,
  page: `export default function {{name}}Page() {
  return <main>{{name}}</main>;
}`,
  action: `"use server";

export async function {{camelName}}Action() {
  return { success: true };
}`,
  api: `import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ data: [] });
}`,
};

function toCamelCase(string_: string): string {
  return string_.charAt(0).toLowerCase() + string_.slice(1);
}

/**
 *
 * @param template
 * @param options
 */
export async function scaffold(template: string, options: any) {
  const spinner = ora("Scaffolding...").start();

  try {
    const name = options.name || "Component";
    const content = templates[template as keyof typeof templates];

    if (!content) {
      spinner.fail(`Template "${template}" not found`);
      console.log(chalk.yellow("\nAvailable templates:"), Object.keys(templates).join(", "));
      return;
    }

    const processed = content
      .replaceAll("{{name}}", name)
      .replaceAll("{{camelName}}", toCamelCase(name));

    const outputPath = options.path || `src/components/${name}.tsx`;
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, processed);

    spinner.succeed(`Created: ${outputPath}`);
  } catch (error) {
    spinner.fail("Failed to scaffold");
    console.error(error);
  }
}
