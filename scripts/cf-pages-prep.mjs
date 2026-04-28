import { copyFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Salida lista para Cloudflare Pages (CI/Git): tras `opennextjs-cloudflare build`, Pages espera
 * `_worker.js` en la raíz del directorio publicado (`pages_build_output_dir`). OpenNext escribe
 * `worker.js`; esta copia NO usa Wrangler en runtime (solo fs en la máquina de build).
 *
 * @see https://developers.cloudflare.com/pages/functions/advanced-mode/
 */
const out = '.open-next'
const src = join(out, 'worker.js')
const dest = join(out, '_worker.js')

if (!existsSync(src)) {
  console.error(`cf-pages-prep: no existe ${src} — ejecuta primero @opennextjs/cloudflare build.`)
  process.exit(1)
}

// Copia binaria: mismo directorio `.open-next/`, imports relativos tipo `./chunks/*` siguen resolviendo igual que desde worker.js.
copyFileSync(src, dest)
console.log(`cf-pages-prep: ${src} → ${dest}`)
