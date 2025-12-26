#!/usr/bin/env tsx
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROJECT SCAFFOLDING TEMPLATES - ComicWise
 * ═══════════════════════════════════════════════════════════════════════════
 */

import chalk from "chalk";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import inquirer from "inquirer";

console.log(chalk.cyan("\n╔══════════════════════════════════════════════════════════════╗"));
console.log(chalk.cyan("║          Project Scaffolding - ComicWise                     ║"));
console.log(chalk.cyan("╚══════════════════════════════════════════════════════════════╝\n"));

interface ScaffoldOptions {
  type: string;
  name: string;
  includeTests?: boolean;
  includeStories?: boolean;
}

const templates = {
  component: (name: string) => `import type { FC } from "react";

interface ${name}Props {
  className?: string;
}

export const ${name}: FC<${name}Props> = ({ className }) => {
  return (
    <div className={className}>
      <h1>${name}</h1>
    </div>
  );
};
`,

  hook: (name: string) => `import { useState, useEffect } from "react";

export interface Use${name}Options {
  initialValue?: unknown;
}

export function use${name}(options: Use${name}Options = {}) {
  const [value, setValue] = useState(options.initialValue);

  useEffect(() => {
    // Hook logic here
  }, []);

  return { value, setValue };
}
`,

  action: (name: string) => `"use server";

import type { ActionResponse } from "@/types/actions";

export async function ${name}Action(
  data: unknown
): Promise<ActionResponse<unknown>> {
  try {
    // Action logic here

    return {
      success: true,
      data: {},
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
`,

  api: (name: string) => `import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // GET logic here

    return NextResponse.json({
      success: true,
      data: {},
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An error occurred",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // POST logic here

    return NextResponse.json({
      success: true,
      data: {},
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An error occurred",
      },
      { status: 500 }
    );
  }
}
`,

  page: (name: string) => `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "${name}",
  description: "${name} page",
};

export default function ${name}Page() {
  return (
    <div>
      <h1>${name}</h1>
    </div>
  );
}
`,
};

async function scaffold() {
  const answers = await inquirer.prompt<ScaffoldOptions>([
    {
      type: "list",
      name: "type",
      message: "What would you like to scaffold?",
      choices: [
        { name: "React Component", value: "component" },
        { name: "Custom Hook", value: "hook" },
        { name: "Server Action", value: "action" },
        { name: "API Route", value: "api" },
        { name: "Next.js Page", value: "page" },
      ],
    },
    {
      type: "input",
      name: "name",
      message: "Enter the name (PascalCase):",
      validate: (input) => {
        if (!input) {
          return "Name is required";
        }
        if (!/^[A-Z][a-zA-Z0-9]*$/.test(input)) {
          return "Name must be in PascalCase (e.g., MyComponent)";
        }
        return true;
      },
    },
  ]);

  const { type, name } = answers;
  const template = templates[type as keyof typeof templates];

  if (!template) {
    console.log(chalk.red("Invalid template type"));
    return;
  }

  const paths = {
    component: `components/${name}.tsx`,
    hook: `hooks/use${name}.tsx`,
    action: `lib/actions/${name.charAt(0).toLowerCase() + name.slice(1)}.ts`,
    api: `app/api/${name.toLowerCase()}/route.ts`,
    page: `app/(root)/${name.toLowerCase()}/page.tsx`,
  };

  const filePath = paths[type as keyof typeof paths];
  const dir = filePath.substring(0, filePath.lastIndexOf("/"));

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  if (existsSync(filePath)) {
    console.log(chalk.yellow(`⚠ File already exists: ${filePath}`));
    return;
  }

  writeFileSync(filePath, template(name), "utf8");
  console.log(chalk.green(`✓ Created ${type}: ${filePath}`));
}

scaffold().catch((error) => {
  console.error(chalk.red("Error:"), error);
  process.exit(1);
});
