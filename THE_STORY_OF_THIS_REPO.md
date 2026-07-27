# The Story of Comicwise

_The comic platform that learned subscriptions are harder than comics_

---

## Prologue: The Digital Comic Dream

"I want to read comics on my phone. Without ads. Without missing chapters. With my library synced."

Simple request. The implementation? Not so much.

---

## Chapter 1: The Stack Choice (2023)

**Next.js 13** had just dropped App Router. **Prisma** was the hot ORM. **Stripe** for payments. **Vercel** for deploy.

```bash
pnpm create next-app@latest comicwise --typescript --tailwind --app --eslint
```

The team knew React. They didn't know Next.js 13's Server Components, Server Actions, or the new caching semantics.

**Lesson 1:** _App Router is a paradigm shift, not an upgrade._

---

## Chapter 2: The Prisma Learning Curve

```prisma
// prisma/schema.prisma
model Comic {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  chapters    Chapter[]
  subscribers Subscription[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Chapter {
  id        String   @id @default(cuid())
  comicId   String
  comic     Comic    @relation(fields: [comicId], references: [id])
  number    Int
  pages     String[] // URLs
  published Boolean  @default(false)
  @@unique([comicId, number])
}
```

**Migration hell:** `pnpm db:push` in dev. `prisma migrate deploy` in prod. Drift happens.

**Lesson 2:** _Use `prisma migrate dev` locally. Commit the migration files. Never `db:push` in shared environments._

---

## Chapter 3: Stripe Subscriptions — The Webhook Maze

```
User clicks "Subscribe"
       │
       ▼
Stripe Checkout Session → Success URL → Your site
       │
       ▼ (async, seconds later)
Stripe Webhook: checkout.session.completed
       │
       ▼
Your API: Create Subscription record → Grant access
       │
       ▼
Webhook: invoice.payment_succeeded (recurring)
       │
       ▼
Your API: Extend subscription → Send receipt
```

**Edge cases discovered:**

- Webhook arrives before user returns from Checkout
- User closes browser before redirect
- Stripe retries failed webhooks (exponential backoff)
- `customer.subscription.updated` fires for _everything_ (pause, resume, quantity change)

**The fix:** Idempotency keys on every webhook handler. `stripe_webhook_events` table with `processed_at`.

```typescript
// lib/stripe/webhooks.ts
export async function handleWebhook(event: Stripe.Event) {
  const exists = await db.stripeWebhookEvent.findUnique({
    where: { stripeEventId: event.id }
  });
  if (exists) return { received: true, duplicate: true };

  await db.stripeWebhookEvent.create({
    data: { stripeEventId: event.id }
  });

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckout(event.data.object);
      break;
    case "invoice.payment_succeeded":
      await handlePayment(event.data.object);
      break;
    case "customer.subscription.updated":
      await handleSubscriptionChange(event.data.object);
      break;
  }
}
```

---

## Chapter 4: Image Optimization — The Bandwidth Bill

Comics = images. Lots of images.

**First attempt:** Store originals on S3. Serve via CloudFront. `next/image` with remote patterns.

**Problem:** 500MB chapter = 500MB transfer per read. No optimization.

**Second attempt:** Upload → Lambda (Sharp) → WebP/AVIF → Multiple widths → S3.

**Cost:** Lambda invocations + storage variants + CloudFront.

**Third attempt (current):** UploadThing handles variants. `next/image` with `loader='custom'`.

```tsx
// components/comics/ChapterReader.tsx
<Image
  src={pageUrl}
  alt={`Page ${pageNumber}`}
  width={800}
  height={1200}
  loader={customLoader}
  placeholder="blur"
  blurDataURL={blurHash}
/>
```

**Lesson 3:** _Image optimization is a product feature, not an afterthought._

---

## Chapter 5: The Consolidation Verdict

July 2025. Three comic projects:

| Project | Stack | Status |
| --- | --- | --- |
| `comicwise` | Next.js 15 + Prisma + Stripe | **Active** |
| `rhixe_scans` | Next.js 15 + Prisma + Stripe/PayPal | Active |
| `rhixecompany-comics` | Django + Next.js 16 | **Survivor** |

**P1 Priority:** Merge `comicwise` + `rhixe_scans` + `Django-Scrapy-Selenium` + `selenium_webdriver` → `rhixecompany-comics`

**comicwise contributes:**

- Stripe subscription flow (battle-tested)
- Prisma schema patterns
- Next.js App Router patterns
- shadcn/ui component library

**What dies:** The separate deployment, the duplicate auth, the duplicate comic models.

---

## Epilogue: The Subscription That Worked

Users subscribe. Webhooks fire. Access grants. Comics load. Revenue recurs.

The code isn't perfect. The webhook handler has 200 lines. The Prisma schema has 15 models. The Stripe integration has 3 retry policies.

But **it works**. Every month, the webhooks fire. Every month, the subscriptions renew.

_The best billing system is the one you forget exists — until you check Stripe dashboard and see the MRR growing._

---

_Written by the workspace chronicler, July 25, 2025.  
Filed at `projects/comicwise/THE_STORY_OF_THIS_REPO.md`._
