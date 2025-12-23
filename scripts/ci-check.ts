#!/usr/bin/env node
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface CheckResult {
  name: string;
  status: 'passed' | 'failed';
  duration: number;
  error?: string;
}

async function runCheck(name: string, command: string): Promise<CheckResult> {
  const start = Date.now();
  try {
    await execAsync(command);
    return {
      name,
      status: 'passed',
      duration: Date.now() - start
    };
  } catch (error) {
    return {
      name,
      status: 'failed',
      duration: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function main() {
  console.log('🔍 Running CI checks...\n');

  const checks = [
    { name: 'Lint', command: 'pnpm lint' },
    { name: 'Type Check', command: 'pnpm type-check' },
    { name: 'Build', command: 'pnpm build' },
    { name: 'Test', command: 'pnpm test' }
  ];

  const results: CheckResult[] = [];

  for (const check of checks) {
    console.log(`Running ${check.name}...`);
    const result = await runCheck(check.name, check.command);
    results.push(result);

    const icon = result.status === 'passed' ? '✅' : '❌';
    console.log(`${icon} ${check.name}: ${result.status} (${result.duration}ms)\n`);
    
    if (result.error) {
      console.error(`Error: ${result.error}\n`);
    }
  }

  const passed = results.filter(r => r.status === 'passed').length;
  const total = results.length;

  console.log(`\n${'='.repeat(50)}`);
  console.log(`CI Check Results: ${passed}/${total} passed`);
  console.log(`${'='.repeat(50)}\n`);

  if (passed === total) {
    console.log('✅ All checks passed!');
    process.exit(0);
  } else {
    console.error('❌ Some checks failed');
    process.exit(1);
  }
}

main();
