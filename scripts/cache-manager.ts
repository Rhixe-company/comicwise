#!/usr/bin/env node
import Redis from 'ioredis';

async function main() {
  const command = process.argv[2];
  const args = process.argv.slice(3);

  const client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

  try {
    switch (command) {
      case 'flush':
        await client.flushall();
        console.log('✅ Cache flushed successfully');
        break;

      case 'keys':
        const pattern = args[0] || '*';
        const keys = await client.keys(pattern);
        console.log(`Found ${keys.length} keys:`);
        keys.forEach((key: string) => console.log(`  - ${key}`));
        break;

      case 'get':
        if (!args[0]) {
          console.error('❌ Usage: pnpm cache:get <key>');
          process.exit(1);
        }
        const value = await client.get(args[0]);
        console.log(value || 'Key not found');
        break;

      case 'set':
        if (args.length < 2) {
          console.error('❌ Usage: pnpm cache:set <key> <value>');
          process.exit(1);
        }
        await client.set(args[0], args[1]);
        console.log('✅ Key set successfully');
        break;

      case 'del':
        if (!args[0]) {
          console.error('❌ Usage: pnpm cache:del <key>');
          process.exit(1);
        }
        await client.del(args[0]);
        console.log('✅ Key deleted successfully');
        break;

      case 'info':
        const info = await client.info();
        console.log(info);
        break;

      default:
        console.log(`
Cache Manager Commands:
  flush              - Clear all cache
  keys [pattern]     - List keys matching pattern
  get <key>          - Get value for key
  set <key> <value>  - Set key-value pair
  del <key>          - Delete key
  info               - Show Redis info
        `);
    }
  } finally {
    await client.disconnect();
  }
}

main();
