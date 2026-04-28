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

### Cloudflare Pages / Workers (dashboard build settings)

Use **`@opennextjs/cloudflare`** (OpenNext). Do **not** set the build command to the deprecated **`@cloudflare/next-on-pages`** adapter.

| Setting | Value |
| --- | --- |
| **Build command** | **`npm run pages:build`** (runs OpenNext build + copia `worker.js` → `_worker.js` para [Advanced Mode](https://developers.cloudflare.com/pages/functions/advanced-mode/)) |
| **Root directory** | Repository root (where `package.json` lives) |
| **Build output directory** | Leave empty / default if Pages lee **`wrangler.toml`**: `pages_build_output_dir = ".open-next"` |

**Archivos:**

- **`wrangler.toml`** — solo Cloudflare Pages (sin `main` / `assets` / `images`): `pages_build_output_dir`, compatibilidad. En Pages el nombre **`ASSETS`** está reservado para el runtime de Pages.
- **`wrangler.worker.jsonc`** — Worker OpenNext completo (`main`, binding `ASSETS`, `images`, etc.). Todo comando OpenNext/Wrangler que construya o despliegue el Worker debe usar **`--config wrangler.worker.jsonc`** (ya está en los scripts `npm`).

La documentación oficial de OpenNext orienta el deploy a **Cloudflare Workers** (`npm run deploy`). Pages usa **`wrangler.toml`** para CI + **`_worker.js`** en `.open-next/` (`scripts/cf-pages-prep.mjs`).

After `npm ci`, prueba localmente: `npm run pages:build`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
