# OpenNext Starter

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Read the documentation at https://opennext.js.org/cloudflare.

## Develop

Run the Next.js development server:

```bash
npm run dev
# or similar package manager command
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Preview

Preview the application locally on the Cloudflare runtime:

```bash
npm run preview
# or similar package manager command
```

## Deploy

Deploy the application to Cloudflare:

```bash
npm run deploy
# or similar package manager command
```

### Cloudflare Pages / Workers

Seguir **[OpenNext Cloudflare — Get started](https://opennext.js.org/cloudflare/get-started)**.

| Setting | Value |
| --- | --- |
| **Build command** | `npm run pages:build` → equivale a `npx @opennextjs/cloudflare build` |
| **Root directory** | Raíz del repo (donde está `package.json`) |
| **Build output directory** | Vacío / por defecto si Wrangler lee **`wrangler.toml`**: debe figurar **`pages_build_output_dir`: `.open-next`** en ese archivo (salida OpenNext) |

**Archivos:**

- **`wrangler.toml`** — Configuración Pages: `pages_build_output_dir`, compatibilidad Node, `NEXTJS_ENV` en `[vars]`.

Compatibilidad: **`@opennextjs/cloudflare`** peer dependency exige **`next` ≥ 16.2.3**; este proyecto usa **Next.js 16.2.3**.

Tras `npm ci`: `npm run pages:build` o `npm run preview`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
