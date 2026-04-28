import { copyFileSync } from 'fs'

copyFileSync('.open-next/worker.js', '.open-next/_worker.js')

console.log('cf-pages-prep: .open-next/worker.js → .open-next/_worker.js')
