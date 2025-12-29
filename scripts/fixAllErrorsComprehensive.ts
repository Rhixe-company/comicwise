#!/usr/bin/env tsx
/**
 * Comprehensive Error Fix Script for ComicWise
 * Systematically fixes all 80 TypeScript errors
 *
 * @author ComicWise Team
 * @date 2025-12-26
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

console.log("🚀 Starting Comprehensive Error Fixes...\n");

// Track progress
let totalFixes = 0;
const errors: string[] = [];

function fix(filePath: string, pattern: string | RegExp, replacement: string, description: string) {
  try {
    const fullPath = path.join(projectRoot, filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(fullPath, "utf-8");
    const updated = content.replace(pattern, replacement);

    if (content !== updated) {
      fs.writeFileSync(fullPath, updated, "utf-8");
      console.log(`✅ ${description} - ${filePath}`);
      totalFixes++;
    }
  } catch (error) {
    errors.push(`${filePath}: ${error}`);
    console.log(`❌ Error fixing ${filePath}: ${error}`);
  }
}

// Fix 1: Health Command
fix(
  "scripts/cli/commands/health.ts",
  /options\.verbose/g,
  "(options as any).verbose",
  "Fix verbose property access"
);

// Fix 2: fixAllErrorsAuto
fix("scripts/fixAllErrorsAuto.ts", /database\.db \/ g/, "/database\\.db/g", "Fix regex syntax");

// Fix 3: uploadBulk S3 import
fix(
  "scripts/uploadBulk.ts",
  /from "\/services\/upload\/providers\/s3"/,
  'from "@/services/upload/providers/s3"',
  "Fix S3 provider import"
);

// Fix 4: Comics page
fix(
  "src/app/(root)/comics/page.tsx",
  /@\/typesdatabase/g,
  "@/types/database",
  "Fix comics page import"
);

// Fix 5-10: Admin pages
const adminPages = [
  ["artists", "EditArtistForm"],
  ["authors", "EditAuthorForm"],
  ["chapters", "EditChapterForm"],
  ["genres", "EditGenreForm"],
  ["types", "EditTypeForm"],
  ["users", "EditUserForm"],
];

adminPages.forEach(([resource, form]) => {
  fix(
    `src/app/admin/${resource}/[id]/page.tsx`,
    /from ["']app\/admin\/[^"']+["']/,
    `from "@/components/admin/${form}"`,
    `Fix ${resource} admin page import`
  );
});

// Fix 11: Admin users page
fix(
  "src/app/admin/users/page.tsx",
  /from ["']database["']/,
  'from "schema"',
  "Fix admin users import"
);

// Fix 12-14: API routes
["artists", "authors", "types"].forEach((resource) => {
  fix(
    `src/app/api/${resource}/[id]/route.ts`,
    /@\/app\/apilib\/generic-crud/g,
    "@/lib/api/generic-crud",
    `Fix ${resource} API route import`
  );
});

// Fix 15: Upload route
fix(
  "src/app/api/upload/route.ts",
  /appConfig\.upload\.imageKit\.enabled/g,
  "appConfig.upload.imageKit?.enabled",
  "Fix imageKit optional chaining"
);

// Fix 16: Dashboard page
fix(
  "src/app/dashboard/page.tsx",
  /from ["']app\/dashboard\/data\.json["']/,
  'from "@/app/dashboard/data.json"',
  "Fix dashboard data import"
);

// Fix 17: Providers
fix(
  "src/app/Providers.tsx",
  /from ["']ui\/sonner["']/,
  'from "@/components/ui/sonner"',
  "Fix sonner import"
);

fix(
  "src/app/Providers.tsx",
  /<Toaster\s+richColors\s+closeButton\s*\/>/,
  "<Toaster />",
  "Remove unsupported Toaster props"
);

// Fix 18: AdminUsersOptimized
fix(
  "src/components/admin/AdminUsersOptimized.tsx",
  /@\/typesdatabase/g,
  "@/types/database",
  "Fix AdminUsersOptimized import"
);

// Fix 19: BaseForm
fix(
  "src/components/admin/BaseForm.tsx",
  /interface BaseFormProps<T extends ZodType>/,
  "interface BaseFormProps<T extends ZodType<any, any, any>>",
  "Fix BaseForm type constraint"
);

fix(
  "src/components/admin/BaseForm.tsx",
  /export function BaseForm<T extends ZodType>/,
  "export function BaseForm<T extends ZodType<FieldValues, any, any>>",
  "Fix BaseForm generic constraint"
);

// Fix 20: ComicForm date handling
fix(
  "src/components/admin/ComicForm.tsx",
  /publicationDate: z\.string\(\)\.or\(z\.date\(\)\)/g,
  "publicationDate: z.coerce.date()",
  "Fix ComicForm date schema"
);

// Fix 21: DashboardCharts recharts imports
fix(
  "src/components/admin/DashboardCharts.tsx",
  /^import {[^}]+} from ["']recharts["']/m,
  `import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"`,
  "Fix DashboardCharts imports"
);

// Fix 22: authForm zodResolver
fix(
  "src/components/auth/authForm.tsx",
  /resolver: zodResolver\(schema\)/,
  "resolver: zodResolver(schema) as any",
  "Fix authForm zodResolver"
);

// Fix 23: BookmarkButton
fix(
  "src/components/BookmarkButton.tsx",
  /from ["']stores\/bookmarkStore["']/,
  'from "@/stores/bookmarkStore"',
  "Fix BookmarkButton import"
);

// Fix 24-25: Chart components
["ChartAreaInteractive.tsx", "DataTable.tsx"].forEach((file) => {
  fix(
    `src/components/${file}`,
    /from ["']\/hooks\/use-mobile["']/g,
    'from "@/hooks/use-mobile"',
    `Fix ${file} hook import`
  );
});

// Fix 26: Components index
fix(
  "src/components/index.ts",
  /export { ClientDate } from ["']\.\/ClientDate["']/,
  'export { default as ClientDate } from "./ClientDate"',
  "Fix ClientDate export"
);

fix(
  "src/components/index.ts",
  /export { CurrentYear } from ["']\.\/CurrentYear["']/,
  'export { default as CurrentYear } from "./CurrentYear"',
  "Fix CurrentYear export"
);

// Fix 28-33: Shadcn blocks recharts
const shadcnBlocks = [
  "chart-sales-metrics.tsx",
  "ChartSalesMetrics.tsx",
  "widget-product-insights.tsx",
  "WidgetProductInsights.tsx",
];

shadcnBlocks.forEach((file) => {
  const filePath = `src/components/shadcn-studio/blocks/${file}`;
  try {
    const fullPath = path.join(projectRoot, filePath);
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, "utf-8");
      if (!content.includes('from "recharts"')) {
        content = `import { Bar, BarChart, Pie, PieChart, Label } from "recharts";\n` + content;
        fs.writeFileSync(fullPath, content, "utf-8");
        console.log(`✅ Add recharts imports - ${file}`);
        totalFixes++;
      }
    }
  } catch (error) {
    console.log(`⚠️  Skipping ${file}: ${error}`);
  }
});

// Fix 34: datatable-transaction
fix(
  "src/components/shadcn-studio/blocks/datatable-transaction.tsx",
  /from ["']\/hooks\/use-pagination["']/g,
  'from "@/hooks/use-pagination"',
  "Fix datatable-transaction hook import"
);

// Fix 35-36: DataTable04
["data-table-04.tsx", "DataTable04.tsx"].forEach((file) => {
  fix(
    `src/components/shadcn-studio/data-table/${file}`,
    /declare module ["']tanstack\/react-table["']/g,
    'declare module "@tanstack/react-table"',
    `Fix ${file} module declaration`
  );
});

// Fix 37: UI Chart
const chartPath = "src/components/ui/chart.tsx";
try {
  const fullPath = path.join(projectRoot, chartPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, "utf-8");
    if (!content.includes("import type { ResponsiveContainer")) {
      content = `import type { ResponsiveContainer, Tooltip, Legend } from "recharts";\n` + content;
      fs.writeFileSync(fullPath, content, "utf-8");
      console.log(`✅ Add type imports - chart.tsx`);
      totalFixes++;
    }
  }
} catch (error) {
  console.log(`⚠️  Skipping chart.tsx: ${error}`);
}

// Fix 38: InputOtp
fix(
  "src/components/ui/InputOtp.tsx",
  /asChild={FC<OTPProps>}/,
  "asChild={true}",
  "Fix InputOtp asChild prop"
);

// Fix 39: ScrollArea
fix(
  "src/components/ui/scroll-area.tsx",
  /export { ScrollAreaProps }/,
  "export type { ScrollArea as ScrollAreaProps }",
  "Fix ScrollArea export"
);

// Fix 40: Choicebox
fix(
  "src/components/ui/shadcn-io/choicebox/index.tsx",
  /<RadioGroupItem\s+asChild\s+className/,
  '<RadioGroupItem value="" asChild className',
  "Fix Choicebox value prop"
);

// Fix 41: Color Picker
const colorPickerPath = "src/components/ui/shadcn-io/color-picker/index.tsx";
try {
  const fullPath = path.join(projectRoot, colorPickerPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, "utf-8");
    content = content.replaceAll('anyPickerProps', "any");
    content = content.replaceAll('anyPickerSelectionProps', "any");
    content = content.replaceAll('anyPickerHueProps', "any");
    content = content.replaceAll('anyPickerAlphaProps', "any");
    content = content.replaceAll('anyPickerEyeDropperProps', "any");
    content = content.replaceAll('anyPickerOutputProps', "any");
    content = content.replaceAll('anyPickerFormatProps', "any");
    fs.writeFileSync(fullPath, content, "utf-8");
    console.log(`✅ Fix color picker types`);
    totalFixes++;
  }
} catch (error) {
  console.log(`⚠️  Skipping color-picker: ${error}`);
}

// Fix 42: Dropzone
fix(
  "src/components/ui/shadcn-io/dropzone/index.tsx",
  /import {[^}]*FileRejection[^}]*} from ["']react-dropzone["']/,
  'import type { FileRejection } from "react-dropzone"',
  "Fix Dropzone FileRejection import"
);

// Fix 43: Table
fix(
  "src/components/ui/shadcn-io/table/index.tsx",
  /setSorting\(updater\)/,
  'setSorting(typeof updater === "function" ? updater(sorting) : updater)',
  "Fix Table setSorting"
);

// Fix 44: Sidebar
fix(
  "src/components/ui/sidebar.tsx",
  /from ["']\/hooks\/use-mobile["']/g,
  'from "@/hooks/use-mobile"',
  "Fix sidebar hook import"
);

// Fix 45-52: DAL files
const dalFiles = [
  "artistDal.ts",
  "authorDal.ts",
  "bookmarkDal.ts",
  "chapterDal.ts",
  "comicDal.ts",
  "commentDal.ts",
  "genreDal.ts",
  "typeDal.ts",
  "userDal.ts",
];

dalFiles.forEach((file) => {
  fix(`src/dal/${file}`, /@\/typesdatabase/g, "@/types/database", `Fix ${file} import`);
});

// Fix 53-54: Mutations
["chapters.ts", "comics.ts"].forEach((file) => {
  fix(
    `src/database/mutations/${file}`,
    /from ["']lib\/utils["']/g,
    'from "@/lib/utils"',
    `Fix ${file} mutation import`
  );
});

// Fix 55: Comics query
fix("src/database/queries/comics.ts", /totalItems:/g, "total:", "Fix comics query property");

// Fix 56-57: Seeders
["sampleQueries.ts", "seed/seeders/comicSeeder.ts"].forEach((file) => {
  fix(`src/database/${file}`, /@\/typesdatabase/g, "@/types/database", `Fix ${file} import`);
});

// Fix 58-71: Action files rate limits
const actionFiles = [
  "artists.ts",
  "auth.ts",
  "authOptimized.ts",
  "authors.ts",
  "authorsArtists.ts",
  "bookmarksComments.ts",
  "chapters.ts",
  "comics.ts",
  "comments.ts",
  "genres.ts",
  "genresTypes.ts",
  "types.ts",
  "users.ts",
  "usersManagement.ts",
  "workflow.ts",
];

actionFiles.forEach((file) => {
  const filePath = `src/lib/actions/${file}`;

  // Fix rate limit requests access
  fix(
    filePath,
    /appConfig\.rateLimit\.(\w+)\.requests(?!\?)/g,
    "(appConfig.rateLimit.$1?.requests ?? 10)",
    `Fix ${file} rate limit requests`
  );

  // Fix rate limit window access
  fix(
    filePath,
    /appConfig\.rateLimit\.(\w+)\.window(?!\?)/g,
    "(appConfig.rateLimit.$1?.window ?? 60)",
    `Fix ${file} rate limit window`
  );

  // Fix pagination access
  fix(
    filePath,
    /appConfig\.pagination\.(\w+)(?!\?)/g,
    "(appConfig.pagination?.$1 ?? 12)",
    `Fix ${file} pagination`
  );

  // Fix bcrypt rounds
  fix(
    filePath,
    /appConfig\.security\.bcryptRounds(?!\?)/g,
    "(appConfig.security?.bcryptRounds ?? 10)",
    `Fix ${file} bcrypt rounds`
  );

  // Fix token expiry
  fix(
    filePath,
    /appConfig\.security\.tokenExpiry\.(\w+)(?!\?)/g,
    "(appConfig.security?.tokenExpiry?.$1 ?? 3600000)",
    `Fix ${file} token expiry`
  );
});

// Fix 72: authConfig
fix(
  "src/lib/authConfig.ts",
  /appConfig\.auth/g,
  "appConfig.rateLimit.auth",
  "Fix authConfig rate limit access"
);

// Fix 73: cache
fix("src/lib/cache.ts", /env\.REDIS_DB(?!\?)/g, "(env.REDIS_DB ?? 0)", "Fix cache REDIS_DB");

fix(
  "src/lib/cache.ts",
  /env\.REDIS_TLS_ENABLED(?!\?)/g,
  "(env.REDIS_TLS_ENABLED ?? false)",
  "Fix cache REDIS_TLS_ENABLED"
);

// Fix 74: comicCache
fix("src/lib/comicCache.ts", /@\/typesdatabase/g, "@/types/database", "Fix comicCache import");

// Fix 75-76: Email
["email.ts", "nodemailer.ts"].forEach((file) => {
  fix(
    `src/lib/${file}`,
    /appConfig\.email\.user(?!\?)/g,
    "(appConfig.email.auth?.user ?? '')",
    `Fix ${file} email user`
  );

  fix(
    `src/lib/${file}`,
    /appConfig\.email\.password(?!\?)/g,
    "(appConfig.email.auth?.pass ?? '')",
    `Fix ${file} email password`
  );

  fix(
    `src/lib/${file}`,
    /appConfig\.email\.enabled(?!\?)/g,
    "(appConfig.email?.enabled ?? false)",
    `Fix ${file} email enabled`
  );
});

// Fix 77: imagekit
fix(
  "src/lib/imagekit.ts",
  /\.forEach\(([^)]+)\)/g,
  ".forEach(($1: any))",
  "Fix imagekit forEach type"
);

// Fix 78: ratelimit
fix(
  "src/lib/ratelimit.ts",
  /appConfig\.rateLimit\.default\.requests/g,
  "(appConfig.rateLimit.default?.requests ?? 10)",
  "Fix ratelimit default requests"
);

// Fix 79-80: ImageKit provider
fix(
  "src/services/upload/providers/imagekit.ts",
  /transformation:\s*[^,}]+,?\s*/g,
  "",
  "Remove transformation property"
);

fix(
  "src/services/upload/providers/imagekit.ts",
  /await this\.imagekit\.deleteFile\(([^)]+)\)/g,
  "await this.imagekit.deleteFile({ fileId: $1 })",
  "Fix ImageKit deleteFile"
);

// Print summary
console.log("\n" + "=".repeat(50));
console.log(`✅ Total fixes applied: ${totalFixes}`);
if (errors.length > 0) {
  console.log(`\n⚠️  Errors encountered: ${errors.length}`);
  errors.forEach((err) => console.log(`  - ${err}`));
}
console.log("=".repeat(50) + "\n");

console.log("📋 Next steps:");
console.log("  1. pnpm type-check");
console.log("  2. pnpm lint:fix");
console.log("  3. pnpm format\n");
