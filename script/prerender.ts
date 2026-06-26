import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  rmSync,
  copyFileSync,
} from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { content } from '../src/data/content.ts'

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '../dist')

const { render } = (await import(resolve(dist, 'server/entry-server.js'))) as {
  render: (url: string) => string
}

const routes = [
  '/',
  '/articles',
  ...Object.keys(content).map((slug) => `/articles/${slug}`),
]
const template = readFileSync(resolve(dist, 'index.html'), 'utf-8')

for (const url of routes) {
  const html = template.replace(
    '<div id="root"></div>',
    `<div id="root">${render(url)}</div>`,
  )
  const outDir = url === '/' ? dist : resolve(dist, url.replace(/^\//, ''))
  mkdirSync(outDir, { recursive: true })
  writeFileSync(resolve(outDir, 'index.html'), html)
}

// SPA fallback: unknown paths on GitHub Pages serve 404.html, which boots the app.
copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
rmSync(resolve(dist, 'server'), { recursive: true, force: true })
console.log(`✓ prerendered ${routes.join(', ')} + 404.html`)
