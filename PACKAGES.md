# ComicWise - Package Documentation

> **Last Updated**: December 6, 2025  
> **Node Version**: 22+  
> **Package Manager**: pnpm 9+

---

## 📦 Dependencies (Production)

### Core Framework

| Package     | Version | Purpose                                                           | Documentation                                      |
| ----------- | ------- | ----------------------------------------------------------------- | -------------------------------------------------- |
| `next`      | 16.0.7  | React framework with App Router, Server Components, and Turbopack | [Next.js Docs](https://nextjs.org/docs)            |
| `react`     | 19.2.1  | UI library with React Server Components                           | [React Docs](https://react.dev)                    |
| `react-dom` | 19.2.1  | React DOM renderer for web applications                           | [React DOM](https://react.dev/reference/react-dom) |

### Authentication

| Package                 | Version       | Purpose                                   | Documentation                                                           |
| ----------------------- | ------------- | ----------------------------------------- | ----------------------------------------------------------------------- |
| `next-auth`             | 5.0.0-beta.30 | Authentication library with OAuth support | [NextAuth.js](https://authjs.dev)                                       |
| `@auth/drizzle-adapter` | 1.11.1        | Drizzle ORM adapter for NextAuth          | [Auth.js Adapters](https://authjs.dev/getting-started/adapters/drizzle) |
| `bcryptjs`              | 3.0.3         | Password hashing library                  | [bcryptjs](https://github.com/dcodeIO/bcrypt.js)                        |

### Database & ORM

| Package       | Version | Purpose                       | Documentation                                       |
| ------------- | ------- | ----------------------------- | --------------------------------------------------- |
| `drizzle-orm` | 0.45.0  | Type-safe ORM for PostgreSQL  | [Drizzle ORM](https://orm.drizzle.team)             |
| `postgres`    | 3.4.7   | PostgreSQL client for Node.js | [postgres.js](https://github.com/porsager/postgres) |

### Form Handling & Validation

| Package                      | Version | Purpose                                  | Documentation                                             |
| ---------------------------- | ------- | ---------------------------------------- | --------------------------------------------------------- |
| `react-hook-form`            | 7.68.0  | Performant form library with validation  | [React Hook Form](https://react-hook-form.com)            |
| `@hookform/resolvers`        | 5.2.2   | Validation resolvers for React Hook Form | [Resolvers](https://github.com/react-hook-form/resolvers) |
| `zod`                        | 4.1.13  | TypeScript-first schema validation       | [Zod Docs](https://zod.dev)                               |
| `@zxcvbn-ts/core`            | 3.0.4   | Password strength estimation             | [zxcvbn-ts](https://zxcvbn-ts.github.io/zxcvbn/)          |
| `@zxcvbn-ts/language-common` | 3.0.4   | Common language pack for zxcvbn          | [zxcvbn-ts](https://zxcvbn-ts.github.io/zxcvbn/)          |
| `@zxcvbn-ts/language-en`     | 3.0.2   | English language pack for zxcvbn         | [zxcvbn-ts](https://zxcvbn-ts.github.io/zxcvbn/)          |

### UI Components - Radix UI

| Package                                  | Version | Purpose                             | Documentation                                                                           |
| ---------------------------------------- | ------- | ----------------------------------- | --------------------------------------------------------------------------------------- |
| `@radix-ui/react-accordion`              | 1.2.12  | Accessible accordion component      | [Radix Accordion](https://www.radix-ui.com/docs/primitives/components/accordion)        |
| `@radix-ui/react-alert-dialog`           | 1.1.15  | Modal dialog for important messages | [Radix Alert Dialog](https://www.radix-ui.com/docs/primitives/components/alert-dialog)  |
| `@radix-ui/react-aspect-ratio`           | 1.1.8   | Aspect ratio container              | [Radix Aspect Ratio](https://www.radix-ui.com/docs/primitives/components/aspect-ratio)  |
| `@radix-ui/react-avatar`                 | 1.1.11  | Avatar component with fallback      | [Radix Avatar](https://www.radix-ui.com/docs/primitives/components/avatar)              |
| `@radix-ui/react-checkbox`               | 1.3.3   | Accessible checkbox component       | [Radix Checkbox](https://www.radix-ui.com/docs/primitives/components/checkbox)          |
| `@radix-ui/react-collapsible`            | 1.1.12  | Expandable content container        | [Radix Collapsible](https://www.radix-ui.com/docs/primitives/components/collapsible)    |
| `@radix-ui/react-context-menu`           | 2.2.16  | Right-click context menu            | [Radix Context Menu](https://www.radix-ui.com/docs/primitives/components/context-menu)  |
| `@radix-ui/react-dialog`                 | 1.1.15  | Modal dialog component              | [Radix Dialog](https://www.radix-ui.com/docs/primitives/components/dialog)              |
| `@radix-ui/react-dropdown-menu`          | 2.1.16  | Dropdown menu component             | [Radix Dropdown](https://www.radix-ui.com/docs/primitives/components/dropdown-menu)     |
| `@radix-ui/react-hover-card`             | 1.1.15  | Hover card for rich previews        | [Radix Hover Card](https://www.radix-ui.com/docs/primitives/components/hover-card)      |
| `@radix-ui/react-icons`                  | 1.3.2   | Icon library for Radix UI           | [Radix Icons](https://www.radix-ui.com/icons)                                           |
| `@radix-ui/react-label`                  | 2.1.8   | Accessible label component          | [Radix Label](https://www.radix-ui.com/docs/primitives/components/label)                |
| `@radix-ui/react-menubar`                | 1.1.16  | Menu bar component                  | [Radix Menubar](https://www.radix-ui.com/docs/primitives/components/menubar)            |
| `@radix-ui/react-navigation-menu`        | 1.2.14  | Navigation menu component           | [Radix Navigation](https://www.radix-ui.com/docs/primitives/components/navigation-menu) |
| `@radix-ui/react-popover`                | 1.1.15  | Popover component                   | [Radix Popover](https://www.radix-ui.com/docs/primitives/components/popover)            |
| `@radix-ui/react-progress`               | 1.1.8   | Progress bar component              | [Radix Progress](https://www.radix-ui.com/docs/primitives/components/progress)          |
| `@radix-ui/react-radio-group`            | 1.3.8   | Radio button group                  | [Radix Radio Group](https://www.radix-ui.com/docs/primitives/components/radio-group)    |
| `@radix-ui/react-scroll-area`            | 1.2.10  | Custom scrollbar container          | [Radix Scroll Area](https://www.radix-ui.com/docs/primitives/components/scroll-area)    |
| `@radix-ui/react-select`                 | 2.2.6   | Select dropdown component           | [Radix Select](https://www.radix-ui.com/docs/primitives/components/select)              |
| `@radix-ui/react-separator`              | 1.1.8   | Visual divider component            | [Radix Separator](https://www.radix-ui.com/docs/primitives/components/separator)        |
| `@radix-ui/react-slider`                 | 1.3.6   | Slider input component              | [Radix Slider](https://www.radix-ui.com/docs/primitives/components/slider)              |
| `@radix-ui/react-slot`                   | 1.2.4   | Slot primitive for composability    | [Radix Slot](https://www.radix-ui.com/docs/primitives/utilities/slot)                   |
| `@radix-ui/react-switch`                 | 1.2.6   | Toggle switch component             | [Radix Switch](https://www.radix-ui.com/docs/primitives/components/switch)              |
| `@radix-ui/react-tabs`                   | 1.1.13  | Tabs component                      | [Radix Tabs](https://www.radix-ui.com/docs/primitives/components/tabs)                  |
| `@radix-ui/react-toggle`                 | 1.1.10  | Toggle button component             | [Radix Toggle](https://www.radix-ui.com/docs/primitives/components/toggle)              |
| `@radix-ui/react-toggle-group`           | 1.1.11  | Toggle button group                 | [Radix Toggle Group](https://www.radix-ui.com/docs/primitives/components/toggle-group)  |
| `@radix-ui/react-tooltip`                | 1.2.8   | Tooltip component                   | [Radix Tooltip](https://www.radix-ui.com/docs/primitives/components/tooltip)            |
| `@radix-ui/react-use-controllable-state` | 1.2.2   | Hook for controllable state         | [Radix Hooks](https://www.radix-ui.com/docs/primitives/overview/introduction)           |
| `radix-ui`                               | 1.4.3   | Radix UI meta package               | [Radix UI](https://www.radix-ui.com)                                                    |

### UI Libraries & Icons

| Package               | Version | Purpose                       | Documentation                           |
| --------------------- | ------- | ----------------------------- | --------------------------------------- |
| `@tabler/icons-react` | 3.35.0  | Icon library with 4000+ icons | [Tabler Icons](https://tabler-icons.io) |
| `lucide-react`        | 0.556.0 | Beautiful icon library        | [Lucide Icons](https://lucide.dev)      |
| `cmdk`                | 1.1.1   | Command palette component     | [cmdk](https://cmdk.paco.me)            |
| `vaul`                | 1.1.2   | Drawer component for mobile   | [Vaul](https://vaul.emilkowal.ski)      |
| `sonner`              | 2.0.7   | Toast notification library    | [Sonner](https://sonner.emilkowal.ski)  |

### Tables & Data Display

| Package                 | Version | Purpose                        | Documentation                                |
| ----------------------- | ------- | ------------------------------ | -------------------------------------------- |
| `@tanstack/react-table` | 8.21.3  | Powerful table library         | [TanStack Table](https://tanstack.com/table) |
| `recharts`              | 3.5.1   | Chart library built with React | [Recharts](https://recharts.org)             |

### Rich Text Editor

| Package               | Version | Purpose                     | Documentation                                                               |
| --------------------- | ------- | --------------------------- | --------------------------------------------------------------------------- |
| `@tiptap/react`       | 3.13.0  | Headless rich text editor   | [Tiptap](https://tiptap.dev)                                                |
| `@tiptap/starter-kit` | 3.13.0  | Essential Tiptap extensions | [Tiptap Starter Kit](https://tiptap.dev/docs/editor/extensions/starter-kit) |

### Drag & Drop

| Package              | Version | Purpose               | Documentation                                                            |
| -------------------- | ------- | --------------------- | ------------------------------------------------------------------------ |
| `@dnd-kit/core`      | 6.3.1   | Drag and drop toolkit | [dnd kit](https://docs.dndkit.com)                                       |
| `@dnd-kit/modifiers` | 9.0.0   | Modifiers for dnd kit | [dnd kit Modifiers](https://docs.dndkit.com/api-documentation/modifiers) |

### File Upload & Images

| Package                   | Version | Purpose                   | Documentation                                                                 |
| ------------------------- | ------- | ------------------------- | ----------------------------------------------------------------------------- |
| `react-dropzone`          | 14.3.8  | Drag-and-drop file upload | [React Dropzone](https://react-dropzone.js.org)                               |
| `react-image-crop`        | 11.0.10 | Image cropping component  | [React Image Crop](https://github.com/DominicTobias/react-image-crop)         |
| `react-medium-image-zoom` | 5.4.0   | Image zoom on click       | [React Medium Image Zoom](https://github.com/rpearce/react-medium-image-zoom) |

### Media & Carousel

| Package                | Version | Purpose                   | Documentation                                            |
| ---------------------- | ------- | ------------------------- | -------------------------------------------------------- |
| `embla-carousel-react` | 8.6.0   | Carousel/slider component | [Embla Carousel](https://www.embla-carousel.com)         |
| `media-chrome`         | 4.16.1  | Media player controls     | [Media Chrome](https://www.media-chrome.org)             |
| `react-fast-marquee`   | 1.6.5   | Marquee/scrolling text    | [React Fast Marquee](https://www.react-fast-marquee.com) |

### Email

| Package                   | Version | Purpose                    | Documentation                                                      |
| ------------------------- | ------- | -------------------------- | ------------------------------------------------------------------ |
| `nodemailer`              | 7.0.11  | Email sending library      | [Nodemailer](https://nodemailer.com)                               |
| `react-email`             | 5.0.5   | Email template framework   | [React Email](https://react.email)                                 |
| `@react-email/components` | 1.0.1   | Pre-built email components | [React Email Components](https://react.email/docs/components/html) |

### Styling

| Package                    | Version | Purpose                                    | Documentation                                               |
| -------------------------- | ------- | ------------------------------------------ | ----------------------------------------------------------- |
| `tailwind-merge`           | 3.4.0   | Merge Tailwind classes without conflicts   | [tailwind-merge](https://github.com/dcastil/tailwind-merge) |
| `class-variance-authority` | 0.7.1   | Type-safe component variants               | [CVA](https://cva.style/docs)                               |
| `clsx`                     | 2.1.1   | Utility for constructing className strings | [clsx](https://github.com/lukeed/clsx)                      |
| `color`                    | 5.0.3   | Color conversion and manipulation          | [color](https://github.com/Qix-/color)                      |

### Theme & Layout

| Package                  | Version | Purpose                     | Documentation                                                               |
| ------------------------ | ------- | --------------------------- | --------------------------------------------------------------------------- |
| `next-themes`            | 0.4.6   | Theme switching for Next.js | [next-themes](https://github.com/pacocoursey/next-themes)                   |
| `react-resizable-panels` | 3.0.6   | Resizable panel layouts     | [React Resizable Panels](https://github.com/bvaughn/react-resizable-panels) |

### Date & Time

| Package            | Version | Purpose                     | Documentation                                       |
| ------------------ | ------- | --------------------------- | --------------------------------------------------- |
| `date-fns`         | 4.1.0   | Modern date utility library | [date-fns](https://date-fns.org)                    |
| `react-day-picker` | 9.11.3  | Date picker component       | [React Day Picker](https://react-day-picker.js.org) |

### State Management

| Package   | Version | Purpose                                 | Documentation                           |
| --------- | ------- | --------------------------------------- | --------------------------------------- |
| `zustand` | 5.0.9   | Lightweight state management            | [Zustand](https://zustand-demo.pmnd.rs) |
| `jotai`   | 2.15.2  | Primitive and flexible state management | [Jotai](https://jotai.org)              |

### Utilities

| Package           | Version | Purpose                   | Documentation                               |
| ----------------- | ------- | ------------------------- | ------------------------------------------- |
| `lodash.debounce` | 4.0.8   | Debounce utility function | [Lodash](https://lodash.com/docs#debounce)  |
| `glob`            | 13.0.0  | File pattern matching     | [glob](https://github.com/isaacs/node-glob) |
| `papaparse`       | 5.5.3   | CSV parsing library       | [Papa Parse](https://www.papaparse.com)     |

### Input Components

| Package     | Version | Purpose             | Documentation                           |
| ----------- | ------- | ------------------- | --------------------------------------- |
| `input-otp` | 1.4.2   | OTP input component | [input-otp](https://input-otp.rodz.dev) |

### Animation

| Package  | Version  | Purpose                           | Documentation                |
| -------- | -------- | --------------------------------- | ---------------------------- |
| `motion` | 12.23.25 | Animation library (Framer Motion) | [Motion](https://motion.dev) |

---

## 🛠️ Dev Dependencies

### TypeScript

| Package                         | Version | Purpose                          | Documentation                                                         |
| ------------------------------- | ------- | -------------------------------- | --------------------------------------------------------------------- |
| `typescript`                    | 5+      | TypeScript language              | [TypeScript](https://www.typescriptlang.org)                          |
| `@types/node`                   | 24.10.1 | Node.js type definitions         | [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) |
| `@types/react`                  | 19      | React type definitions           | [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) |
| `@types/react-dom`              | 19      | React DOM type definitions       | [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) |
| `@types/bcryptjs`               | 3.0.0   | bcryptjs type definitions        | [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) |
| `@types/color`                  | 4.2.0   | color type definitions           | [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) |
| `@types/lodash.debounce`        | 4.0.9   | lodash.debounce type definitions | [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) |
| `@types/nodemailer`             | 7.0.4   | nodemailer type definitions      | [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) |
| `@types/papaparse`              | 5.5.1   | papaparse type definitions       | [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) |
| `@types/eslint-plugin-jsx-a11y` | 6.10.1  | ESLint jsx-a11y plugin types     | [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) |

### ESLint

| Package                            | Version | Purpose                          | Documentation                                                                              |
| ---------------------------------- | ------- | -------------------------------- | ------------------------------------------------------------------------------------------ |
| `eslint`                           | 9       | JavaScript/TypeScript linter     | [ESLint](https://eslint.org)                                                               |
| `eslint-config-next`               | 16.0.7  | Next.js ESLint configuration     | [Next.js ESLint](https://nextjs.org/docs/app/building-your-application/configuring/eslint) |
| `eslint-config-prettier`           | 10.1.8  | Disable conflicting ESLint rules | [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)               |
| `@eslint/js`                       | 9.39.1  | ESLint JavaScript config         | [ESLint](https://eslint.org)                                                               |
| `@eslint/json`                     | 0.14.0  | ESLint JSON plugin               | [ESLint JSON](https://github.com/eslint/json)                                              |
| `@eslint/css`                      | 0.14.1  | ESLint CSS plugin                | [ESLint CSS](https://github.com/eslint/css)                                                |
| `@eslint/markdown`                 | 7.5.1   | ESLint Markdown plugin           | [ESLint Markdown](https://github.com/eslint/markdown)                                      |
| `@eslint/eslintrc`                 | 3.3.3   | ESLint RC utilities              | [ESLint](https://eslint.org)                                                               |
| `typescript-eslint`                | 8.48.1  | TypeScript ESLint integration    | [typescript-eslint](https://typescript-eslint.io)                                          |
| `@typescript-eslint/eslint-plugin` | 8.48.1  | TypeScript ESLint rules          | [typescript-eslint](https://typescript-eslint.io)                                          |
| `@typescript-eslint/parser`        | 8.48.1  | TypeScript parser for ESLint     | [typescript-eslint](https://typescript-eslint.io)                                          |

### ESLint Plugins

| Package                            | Version | Purpose                      | Documentation                                                                             |
| ---------------------------------- | ------- | ---------------------------- | ----------------------------------------------------------------------------------------- |
| `eslint-plugin-react`              | 7.37.5  | React-specific linting rules | [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react)                  |
| `eslint-plugin-react-hooks`        | 7.0.1   | React Hooks linting rules    | [React Hooks](https://react.dev/reference/react/hooks)                                    |
| `eslint-plugin-jsx-a11y`           | 6.10.2  | Accessibility linting        | [jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)                          |
| `eslint-plugin-import`             | 2.32.0  | Import/export syntax linting | [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import)                 |
| `eslint-plugin-prettier`           | 5.5.4   | Run Prettier as ESLint rule  | [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)              |
| `eslint-plugin-better-tailwindcss` | 3.7.11  | Tailwind CSS linting         | [better-tailwindcss](https://github.com/francoismassart/eslint-plugin-tailwindcss)        |
| `eslint-plugin-drizzle`            | 0.2.3   | Drizzle ORM linting          | [eslint-plugin-drizzle](https://orm.drizzle.team/docs/eslint-plugin)                      |
| `eslint-plugin-security`           | 3.0.1   | Security-focused linting     | [eslint-plugin-security](https://github.com/eslint-community/eslint-plugin-security)      |
| `eslint-plugin-sonarjs`            | 3.0.5   | Code quality rules           | [eslint-plugin-sonarjs](https://github.com/SonarSource/eslint-plugin-sonarjs)             |
| `eslint-plugin-unused-imports`     | 4.3.0   | Remove unused imports        | [eslint-plugin-unused-imports](https://github.com/sweepline/eslint-plugin-unused-imports) |
| `eslint-plugin-simple-import-sort` | 12.1.1  | Auto-sort imports            | [simple-import-sort](https://github.com/lydell/eslint-plugin-simple-import-sort)          |
| `eslint-plugin-zod`                | 1.4.0   | Zod schema linting           | [eslint-plugin-zod](https://github.com/JoshuaKGoldberg/eslint-plugin-zod)                 |
| `eslint-formatter-compact`         | 9.0.1   | Compact error formatter      | [ESLint Formatters](https://eslint.org/docs/latest/use/formatters/)                       |

### Prettier

| Package                            | Version | Purpose               | Documentation                                                                                         |
| ---------------------------------- | ------- | --------------------- | ----------------------------------------------------------------------------------------------------- |
| `prettier`                         | 3.7.4   | Code formatter        | [Prettier](https://prettier.io)                                                                       |
| `prettier-plugin-tailwindcss`      | 0.7.2   | Sort Tailwind classes | [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)            |
| `prettier-plugin-organize-imports` | 4.3.0   | Organize imports      | [prettier-plugin-organize-imports](https://github.com/simonhaenisch/prettier-plugin-organize-imports) |

### Tailwind CSS

| Package                | Version | Purpose                     | Documentation                                                             |
| ---------------------- | ------- | --------------------------- | ------------------------------------------------------------------------- |
| `tailwindcss`          | 4       | Utility-first CSS framework | [Tailwind CSS](https://tailwindcss.com)                                   |
| `tailwindcss-animate`  | 1.0.7   | Animation utilities         | [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate) |
| `tw-animate-css`       | 1.4.0   | Additional animations       | [tw-animate-css](https://github.com/ben-rogerson/tw-animate-css)          |
| `@tailwindcss/postcss` | 4       | PostCSS integration         | [Tailwind CSS](https://tailwindcss.com)                                   |
| `autoprefixer`         | 10.4.22 | Add vendor prefixes         | [Autoprefixer](https://github.com/postcss/autoprefixer)                   |

### PostCSS

| Package          | Version | Purpose          | Documentation                                               |
| ---------------- | ------- | ---------------- | ----------------------------------------------------------- |
| `postcss-import` | 16.1.1  | Import CSS files | [postcss-import](https://github.com/postcss/postcss-import) |
| `postcss-nested` | 7.0.2   | Nested CSS rules | [postcss-nested](https://github.com/postcss/postcss-nested) |
| `cssnano`        | 7.1.2   | CSS minification | [cssnano](https://cssnano.github.io/cssnano/)               |

### Database Tools

| Package       | Version | Purpose               | Documentation                                             |
| ------------- | ------- | --------------------- | --------------------------------------------------------- |
| `drizzle-kit` | 0.31.8  | Drizzle ORM CLI tools | [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) |

### Testing

| Package            | Version | Purpose               | Documentation                        |
| ------------------ | ------- | --------------------- | ------------------------------------ |
| `@playwright/test` | 1.57.0  | E2E testing framework | [Playwright](https://playwright.dev) |

### Build Tools

| Package  | Version | Purpose               | Documentation                               |
| -------- | ------- | --------------------- | ------------------------------------------- |
| `tsx`    | 4.21.0  | TypeScript execution  | [tsx](https://github.com/privatenumber/tsx) |
| `rimraf` | 6.1.2   | Cross-platform rm -rf | [rimraf](https://github.com/isaacs/rimraf)  |

### React Compiler

| Package                       | Version | Purpose                         | Documentation                                            |
| ----------------------------- | ------- | ------------------------------- | -------------------------------------------------------- |
| `babel-plugin-react-compiler` | 1.0.0   | React Compiler for optimization | [React Compiler](https://react.dev/learn/react-compiler) |

### Utilities

| Package             | Version | Purpose                          | Documentation                                                          |
| ------------------- | ------- | -------------------------------- | ---------------------------------------------------------------------- |
| `cspell`            | 9.4.0   | Spell checker                    | [cSpell](https://cspell.org)                                           |
| `npm-check-updates` | 19.1.2  | Update package.json dependencies | [npm-check-updates](https://github.com/raineorshine/npm-check-updates) |
| `dotenv`            | 17.2.3  | Load environment variables       | [dotenv](https://github.com/motdotla/dotenv)                           |
| `dotenv-safe`       | 9.1.0   | Validate environment variables   | [dotenv-safe](https://github.com/rolodato/dotenv-safe)                 |
| `globals`           | 16.5.0  | Global variable definitions      | [globals](https://github.com/sindresorhus/globals)                     |

---

## 📊 Package Statistics

- **Total Dependencies**: 90
- **Total Dev Dependencies**: 53
- **Total Packages**: 143

### By Category

| Category          | Count |
| ----------------- | ----- |
| UI Components     | 35    |
| Development Tools | 28    |
| Build & Bundling  | 12    |
| Database & ORM    | 2     |
| Authentication    | 3     |
| Testing           | 1     |
| Styling           | 8     |
| State Management  | 2     |
| Form & Validation | 7     |
| Email             | 3     |
| Utilities         | 42    |

---

## 🔄 Update Schedule

### Regular Updates (Monthly)

- Patch updates for all packages
- Minor updates for non-breaking changes
- Review security advisories

### Major Updates (Quarterly)

- Plan major version upgrades
- Test in staging environment
- Update documentation

### Commands

```bash
# Check for outdated packages
pnpm outdated

# Interactive update
pnpm update --interactive --latest

# Check for security vulnerabilities
pnpm audit

# Fix vulnerabilities
pnpm audit --fix
```

---

## 🔒 Security Considerations

### Packages with Security Focus

- `eslint-plugin-security` - Detect security issues in code
- `bcryptjs` - Secure password hashing
- `zod` - Runtime type validation
- `dotenv-safe` - Validate required environment variables

### Security Best Practices

1. Regularly update dependencies
2. Run security audits (`pnpm audit`)
3. Review package licenses
4. Use lock file (`pnpm-lock.yaml`)
5. Validate environment variables
6. Use type-safe database queries

---

## 📚 Additional Resources

- [pnpm Documentation](https://pnpm.io)
- [Next.js 16 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Drizzle ORM Documentation](https://orm.drizzle.team)

---

**Last Updated**: December 6, 2025  
**Maintained by**: ComicWise Team
