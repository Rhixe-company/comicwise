#!/usr/bin/env node
import { Command } from "commander";
import { cache } from "./commands/cache";
import { ci } from "./commands/ci";
import { db as database } from "./commands/db";
import { health } from "./commands/health";
import { queue } from "./commands/queue";
import { scaffold } from "./commands/scaffold";
import { upload } from "./commands/upload";

const program = new Command();

program.name("cw").description("ComicWise Development CLI").version("1.0.0");

program
  .command("scaffold <template>")
  .description("Create from template (component, page, action, api)")
  .option("-n, --name <name>", "Component name")
  .option("-p, --path <path>", "Output path")
  .action(scaffold);

program
  .command("health")
  .description("System health check")
  .option("-v, --verbose", "Verbose output")
  .action(health);

program
  .command("cache <action>")
  .description("Cache management (clear, stats, flush)")
  .option("-k, --key <key>", "Cache key")
  .action(cache);

program
  .command("queue <action>")
  .description("Queue management (start, stop, status)")
  .option("-w, --workers <number>", "Number of workers")
  .action(queue);

program
  .command("upload <provider>")
  .description("Bulk upload to provider (cloudinary, s3, imagekit)")
  .option("-d, --dir <directory>", "Source directory")
  .action(upload);

program
  .command("db <action>")
  .description("Database operations (migrate, seed, reset)")
  .action(database);

program.command("ci <action>").description("CI/CD operations (test, build, deploy)").action(ci);

program.parse();
