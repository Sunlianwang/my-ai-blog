'use client'

import Link from 'next/link'
import { useI18n } from '@/components/I18nProvider'
import PostContent from '@/components/PostContent'
import { getLocalizedTitle, getLocalizedSummary, getLocalizedTags } from '@/lib/post-locale'
import type { Post } from '@/lib/posts'

interface PostDetailContentProps {
  post: Post
}

export default function PostDetailContent({ post }: PostDetailContentProps) {
  const { t, locale } = useI18n()

  return (
    <article className="max-w-none">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10 group"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
          <path d="M13 8H3M7 4l-4 4 4 4" />
        </svg>
        <span className="font-mono text-xs tracking-wide">{t('post.back')}</span>
      </Link>

      {/* Article header */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <time className="text-xs font-mono text-muted-foreground tracking-wide">
            {post.date}
          </time>
          <span className="w-1 h-1 rounded-full bg-border" />
          <div className="flex items-center gap-1.5 flex-wrap">
            {getLocalizedTags(post, locale).map((tag) => (
              <span
                key={tag}
                className="inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-5 tracking-tight">
          {getLocalizedTitle(post, locale)}
        </h1>

        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
          {getLocalizedSummary(post, locale)}
        </p>

        <div className="flex items-center gap-3 mt-10">
          <div className="flex-1 h-px bg-gradient-to-r from-border via-border/60 to-transparent" />
          <span className="text-[10px] font-mono text-muted-foreground/40 tracking-widest">{t('post.article')}</span>
          <div className="flex-1 h-px bg-gradient-to-l from-border via-border/60 to-transparent" />
        </div>
      </header>

      {/* Article content */}
      {locale === 'en' && !post.contentHtml_en && (
        <div
          className="mb-8 p-4 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: t('post.noTranslation') }}
        />
      )}
      {locale === 'en' && post.contentHtml_en && (
        <div className="mb-8 flex items-center gap-2 text-xs font-mono text-muted-foreground/50 tracking-wide">
          <span dangerouslySetInnerHTML={{ __html: t('post.translated') }} />
        </div>
      )}
      <div className="prose">
        <PostContent html={
          locale === 'en' && post.contentHtml_en
            ? post.contentHtml_en
            : post.contentHtml
        } />
      </div>

      {/* Article footer */}
      <div className="flex items-center gap-3 mt-16 mb-4">
        <div className="flex-1 h-px bg-gradient-to-r from-border via-border/60 to-transparent" />
        <span className="text-[10px] font-mono text-muted-foreground/40 tracking-widest">{t('post.end')}</span>
        <div className="flex-1 h-px bg-gradient-to-l from-border via-border/60 to-transparent" />
      </div>

      <div className="flex justify-between items-center pt-4 pb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
            <path d="M13 8H3M7 4l-4 4 4 4" />
          </svg>
          <span className="font-mono text-xs tracking-wide">{t('post.back')}</span>
        </Link>
      </div>
    </article>
  )
}
