/**
 * Cloudflare Pages (Advanced Mode) espera `_worker.js` dentro del directorio de salida.
 * OpenNext genera `worker.js` — copiamos para que Pages enlace el runtime correctamente.
 * @see https://developers.cloudflare.com/pages/functions/advanced-mode/
 */
import { copyFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const worker = resolve(root, '.open-next/worker.js')
const adv = resolve(root, '.open-next/_worker.js')

if (!existsSync(worker)) {
  console.error('cf-pages-prep: falta .open-next/worker.js — ejecuta antes: npx @opennextjs/cloudflare build')
  process.exit(1)
}
copyFileSync(worker, adv)
console.log('cf-pages-prep: .open-next/worker.js → .open-next/_worker.js')
