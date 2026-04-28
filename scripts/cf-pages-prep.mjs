import { copyFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Cloudflare Pages (Advanced / OpenNext): el entry del Worker debe ser `_worker.js`
 * en la raíz del directorio de salida (`pages_build_output_dir` = `.open-next`).
 * OpenNext emite `worker.js`; Pages lo enlaza como `_worker.js`.
 * @see https://developers.cloudflare.com/pages/functions/advanced-mode/
 */
const out = '.open-next'
const src = join(out, 'worker.js')
const dest = join(out, '_worker.js')

if (!existsSync(src)) {
  console.error(`cf-pages-prep: no existe ${src} — ejecuta primero @opennextjs/cloudflare build.`)
  process.exit(1)
}

copyFileSync(src, dest)
console.log(`cf-pages-prep: ${src} → ${dest}`)
