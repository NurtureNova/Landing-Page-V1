# Nurture Nova Learning — Repository Quick Reference

## Project Snapshot

- **Framework**: Next.js (App Router)
- **Language**: TypeScript with React Server/Client Components
- **Styling**: Tailwind CSS + custom utility classes
- **Package manager**: npm (lockfile committed)

## Get Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
4. Start production preview:
   ```bash
   npm run start
   ```

## Project Layout

- **app/**: App Router pages, layouts, API routes, and global styles (`globals.css`).
- **components/**: Reusable UI blocks. Client components are marked with `"use client"` when needed.
- **data/**: Static data (e.g., tutor profiles).
- **public/**: Static assets.
- **tailwind.config.ts**: Theme extensions and design tokens.

## Coding Guidelines

- **TypeScript First**: Use typed props and interfaces. Prefer explicit types over `any`.
- **File Naming**: PascalCase for components, camelCase for helpers.
- **Client Components**: Include `"use client"` at the top when using hooks, browser-only APIs, or state.
- **Server Components**: Default to server components; only opt into client components when necessary.
- **Hooks & Utilities**: Place shared hooks/utilities under a dedicated directory before reuse becomes widespread.

## Styling Rules

- **Tailwind**: Compose utility classes directly in JSX. Avoid spreading inline styles unless Tailwind cannot cover the case.
- **Responsive Design**: Utilize Tailwind breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`). Test on wide screens to prevent excessive whitespace.
- **Custom Classes**: Add custom styles in `app/globals.css` when utilities are insufficient. Document new classes with a comment.

## Components & State

- Keep components focused; extract child components when JSX exceeds ~200 lines.
- Derive state where possible instead of duplicating data.
- Validate props with TypeScript interfaces and narrow them early.

## Data & Fetching

- Prefer static data (`data/`) or static JSON when possible.
- For dynamic data fetching, use Next.js data fetching patterns (e.g., `fetch` in server components, `useSWR`/`useEffect` in client components).

## Testing

- Ensure new functionality is covered by unit or integration tests if the testing framework is present.
- For components with complex interactions, plan to add React Testing Library tests under a future `__tests__` directory.

## Accessibility & SEO

- Use semantic HTML elements.
- Provide alt text for images in `public/images`.
- Leverage Next.js metadata exports in `app/**/page.tsx` for improved SEO when needed.

## Deployment Notes

- Confirm `npm run build` passes locally before merging.
- Keep environment variables documented in a `.env.example` (add if missing).

## Contribution Workflow

1. Create a feature branch from `main`.
2. Implement changes with clear commits.
3. Run the linter and build before opening a PR.
4. Request review and address feedback promptly.

Keep this document updated as the project evolves to help new contributors ramp up quickly.
