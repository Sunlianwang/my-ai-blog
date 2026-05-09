import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import gfm from 'remark-gfm'

const postsDirectory = path.join(process.cwd(), 'posts')

export interface PostMeta {
  slug: string
  title: string
  title_en?: string
  date: string
  summary: string
  summary_en?: string
  tags: string[]
  tags_en?: string[]
  coverImage?: string
  pinned?: boolean
}

export interface Post extends PostMeta {
  contentHtml: string
  contentHtml_en?: string
}

// 获取所有文章的元信息（按日期倒序）
export function getAllPostMeta(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory).filter((name) => name.endsWith('.md'))

  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)

    return {
      slug,
      title: data.title || slug,
      title_en: data.title_en || undefined,
      date: data.date || '2024-01-01',
      summary: data.summary || '',
      summary_en: data.summary_en || undefined,
      tags: data.tags || [],
      tags_en: data.tags_en || undefined,
      coverImage: data.coverImage || undefined,
      pinned: data.pinned === true || data.pinned === 'true',
    }
  })

  return allPostsData.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return a.date < b.date ? 1 : -1;
  })
}

// 获取所有文章的 slug（用于静态生成）
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  return fs
    .readdirSync(postsDirectory)
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.replace(/\.md$/, ''))
}

// 获取单篇文章的完整内容
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const processedContent = await remark().use(gfm).use(html).process(content)
  const contentHtml = processedContent.toString()

  // Load pre-translated English HTML if available
  const translationsDir = path.join(process.cwd(), 'translations')
  const enPath = path.join(translationsDir, `${slug}.en.html`)
  const contentHtml_en = fs.existsSync(enPath) ? fs.readFileSync(enPath, 'utf8') : undefined

  return {
    slug,
    title: data.title || slug,
    title_en: data.title_en || undefined,
    date: data.date || '2024-01-01',
    summary: data.summary || '',
    summary_en: data.summary_en || undefined,
    tags: data.tags || [],
    tags_en: data.tags_en || undefined,
    coverImage: data.coverImage || undefined,
    contentHtml,
    contentHtml_en,
  }
}
