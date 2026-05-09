#!/usr/bin/env tsx
/**
 * Build-time article translation script using DeepSeek API.
 *
 * Usage:
 *   npx tsx scripts/translate-articles.ts
 *
 * Reads all markdown files from posts/, translates the body content
 * (not frontmatter) to English, and saves the translated HTML to
 * translations/{slug}.en.html.
 *
 * Requires DEEPSEEK_API_KEY in .env.local (or environment).
 * Translations are cached — already-translated files are skipped
 * unless you pass --force.
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import gfm from 'remark-gfm'

// Load .env.local manually (no dotenv dependency)
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  const lines = fs.readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    let value = trimmed.slice(eqIdx + 1).trim()
    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

loadEnv()

const POSTS_DIR = path.join(process.cwd(), 'posts')
const TRANSLATIONS_DIR = path.join(process.cwd(), 'translations')
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'
const FORCE = process.argv.includes('--force')

const SYSTEM_PROMPT = `You are a professional Chinese-to-English translator for a tech blog about AI and software development.

Rules:
1. Translate the Chinese text into natural, fluent English.
2. Keep ALL markdown formatting exactly as-is (headings, lists, code blocks, bold, italic, links, blockquotes, tables, etc.).
3. Keep code inside code blocks (both inline \`code\` and fenced blocks) completely untranslated.
4. Keep technical terms that are commonly used in English as-is (e.g., "Prompt Engineering", "LLM", "API", "React", "Next.js").
5. Keep URLs, image paths, and HTML tags unchanged.
6. Produce ONLY the translated markdown — no explanations, no wrapping, no extra commentary.
7. If a sentence mixes Chinese and English, translate only the Chinese parts.
8. Maintain the original tone: informative, friendly, educational.`

async function translateWithDeepSeek(content: string): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY is not set. Add it to .env.local')
  }

  const url = `${DEEPSEEK_BASE_URL}/v1/chat/completions`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Translate the following Chinese markdown to English:\n\n${content}` },
      ],
      temperature: 0.3,
      max_tokens: 8192,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`DeepSeek API error (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  const translated = data.choices?.[0]?.message?.content

  if (!translated) {
    throw new Error('DeepSeek returned empty response')
  }

  return translated.trim()
}

async function markdownToHtml(markdown: string): Promise<string> {
  const processed = await remark().use(gfm).use(html).process(markdown)
  return processed.toString()
}

async function translateArticle(slug: string, force: boolean): Promise<boolean> {
  const outPath = path.join(TRANSLATIONS_DIR, `${slug}.en.html`)

  // Skip if already translated (unless --force)
  if (!force && fs.existsSync(outPath)) {
    console.log(`  ⏭  ${slug} — already translated, skipping`)
    return false
  }

  const mdPath = path.join(POSTS_DIR, `${slug}.md`)
  const fileContents = fs.readFileSync(mdPath, 'utf8')
  const { content } = matter(fileContents)

  if (!content.trim()) {
    console.log(`  ⏭  ${slug} — empty content, skipping`)
    return false
  }

  console.log(`  🔄 ${slug} — translating...`)

  try {
    const translatedMarkdown = await translateWithDeepSeek(content)
    const translatedHtml = await markdownToHtml(translatedMarkdown)

    fs.writeFileSync(outPath, translatedHtml, 'utf8')
    console.log(`  ✅ ${slug} — translated and saved`)
    return true
  } catch (err: any) {
    console.error(`  ❌ ${slug} — translation failed: ${err.message}`)
    return false
  }
}

async function main() {
  console.log('📝 Article Translation Script')
  console.log('─'.repeat(40))

  if (!DEEPSEEK_API_KEY) {
    console.error('\n❌ DEEPSEEK_API_KEY is not set!')
    console.error('   Create a .env.local file with:')
    console.error('   DEEPSEEK_API_KEY=sk-your-key-here')
    console.error('')
    console.error('   Get your key at: https://platform.deepseek.com')
    process.exit(1)
  }

  // Ensure translations directory exists
  if (!fs.existsSync(TRANSLATIONS_DIR)) {
    fs.mkdirSync(TRANSLATIONS_DIR, { recursive: true })
  }

  // Get all markdown files
  const mdFiles = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'))
  console.log(`\nFound ${mdFiles.length} article(s)\n`)

  let translated = 0
  let skipped = 0
  let failed = 0

  for (const file of mdFiles) {
    const slug = file.replace(/\.md$/, '')
    try {
      const didTranslate = await translateArticle(slug, FORCE)
      if (didTranslate) translated++
      else skipped++
    } catch {
      failed++
    }

    // Rate limit: wait 1s between API calls
    if (mdFiles.indexOf(file) < mdFiles.length - 1) {
      await new Promise(r => setTimeout(r, 1000))
    }
  }

  console.log('\n' + '─'.repeat(40))
  console.log(`Done! Translated: ${translated} | Skipped: ${skipped} | Failed: ${failed}`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
