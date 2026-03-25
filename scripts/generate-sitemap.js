import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Read .env manually (Vite env vars aren't available in plain Node scripts)
function loadEnv() {
  try {
    const envPath = resolve(__dirname, '../.env')
    const lines = readFileSync(envPath, 'utf-8').split('\n')
    for (const line of lines) {
      const [key, ...rest] = line.split('=')
      if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
    }
  } catch {
    // In CI/production, env vars are set directly — no .env file needed
  }
}

loadEnv()

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
const BASE_URL = 'https://sarjomaa.no'

console.log('SUPABASE_URL found:', !!SUPABASE_URL)
console.log('SUPABASE_ANON_KEY found:', !!SUPABASE_ANON_KEY)

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase env vars — skipping sitemap generation')
  process.exit(0)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const { data: recipes, error } = await supabase
  .from('recipes')
  .select('slug, created_at')

if (error) {
  console.error('Failed to fetch recipes:', error.message)
  process.exit(1)
}

const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/oppskrifter', priority: '0.9', changefreq: 'daily' },
]

const staticEntries = staticPages.map(({ url, priority, changefreq }) => `  <url>
    <loc>${BASE_URL}${url}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`)

const recipeEntries = recipes.map(({ slug, created_at }) => {
  const lastmod = new Date(created_at).toISOString().split('T')[0]
  return `  <url>
    <loc>${BASE_URL}/oppskrifter/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
})

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries.join('\n')}
${recipeEntries.join('\n')}
</urlset>`

const outputPath = resolve(__dirname, '../public/sitemap.xml')
writeFileSync(outputPath, sitemap, 'utf-8')
console.log(`Sitemap generated with ${recipes.length} recipes → public/sitemap.xml`)
