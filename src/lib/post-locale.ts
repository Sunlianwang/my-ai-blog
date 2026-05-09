/** Client-safe locale helpers for post data (no fs dependency) */

export type Locale = 'zh' | 'en'

export interface LocalizablePost {
  title: string
  title_en?: string
  summary: string
  summary_en?: string
  tags: string[]
  tags_en?: string[]
}

/** Get localized title for a post */
export function getLocalizedTitle(post: LocalizablePost, locale: Locale): string {
  if (locale === 'en' && post.title_en) return post.title_en
  return post.title
}

/** Get localized summary for a post */
export function getLocalizedSummary(post: LocalizablePost, locale: Locale): string {
  if (locale === 'en' && post.summary_en) return post.summary_en
  return post.summary
}

/** Get localized tags for a post */
export function getLocalizedTags(post: LocalizablePost, locale: Locale): string[] {
  if (locale === 'en' && post.tags_en) return post.tags_en
  return post.tags
}
