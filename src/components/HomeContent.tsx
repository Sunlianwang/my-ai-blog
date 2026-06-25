'use client'

import Link from 'next/link'
import { useI18n } from '@/components/I18nProvider'
import { getLocalizedTitle, getLocalizedSummary, getLocalizedTags } from '@/lib/post-locale'
import type { PostMeta } from '@/lib/posts'

interface HomeContentProps {
  posts: PostMeta[]
}

export default function HomeContent({ posts }: HomeContentProps) {
  const { t, locale } = useI18n()

  const pinnedPost = posts.find(p => p.pinned)
  const regularPosts = pinnedPost ? posts.filter(p => p.slug !== pinnedPost.slug) : posts

  return (
    <div className="space-y-16">
      {/* Posts List */}
      <section>
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">
            {t('home.articles')}
          </h2>
          <span className="text-xs font-mono text-muted-foreground">
            {posts.length} {t('home.entry')}
          </span>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-xl">
            <p className="text-4xl mb-4">✍️</p>
            <p className="text-muted-foreground text-lg font-editorial">{t('home.empty.title')}</p>
            <p className="text-muted-foreground/60 text-sm mt-2 font-mono">
              {t('home.empty.desc')}
            </p>
          </div>
        ) : (
          <div className="space-y-0 divide-y divide-border/60">
              {/* Pinned Post */}
              {pinnedPost && (
                <Link
                  key={pinnedPost.slug}
                  href={`/posts/${pinnedPost.slug}`}
                  className="group block py-6 first:pt-0 last:pb-0 relative"
                >
                  {/* Pinned badge — top right corner */}
                  <span className="absolute top-4 right-0 text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-sm tracking-wider flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="opacity-70">
                      <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                    </svg>
                    置顶
                  </span>

                  <article className="flex items-start gap-5">
                    <span className="text-xs font-mono text-primary tabular-nums mt-1.5 w-6 text-right flex-shrink-0 flex items-center justify-end">
                      📌
                    </span>

                    <div className="flex-1 min-w-0">
                      <time className="text-xs font-mono text-muted-foreground tracking-wide">
                        {pinnedPost.date}
                      </time>

                      <h3 className="font-editorial text-lg font-bold text-foreground mt-1.5 mb-2 group-hover:text-primary transition-colors duration-200 leading-snug">
                        {getLocalizedTitle(pinnedPost, locale)}
                      </h3>

                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                        {getLocalizedSummary(pinnedPost, locale)}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap">
                        {getLocalizedTags(pinnedPost, locale).map((tag) => (
                          <span
                            key={tag}
                            className="inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <span className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-8 opacity-0 group-hover:opacity-100">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 8h10M9 4l4 4-4 4" />
                      </svg>
                    </span>
                  </article>
                </Link>
              )}

              {regularPosts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="group block py-6 first:pt-0 last:pb-0"
              >
                <article className="flex items-start gap-5">
                  <span className="text-xs font-mono text-muted-foreground tabular-nums mt-1.5 w-6 text-right flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="flex-1 min-w-0">
                    <time className="text-xs font-mono text-muted-foreground tracking-wide">
                      {post.date}
                    </time>

                    <h3 className="font-editorial text-lg font-bold text-foreground mt-1.5 mb-2 group-hover:text-primary transition-colors duration-200 leading-snug">
                      {getLocalizedTitle(post, locale)}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                      {getLocalizedSummary(post, locale)}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
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

                  <span className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-8 opacity-0 group-hover:opacity-100">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </span>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Bottom ornament */}
      <div className="flex justify-center pt-4">
        <div className="flex items-center gap-3 text-muted-foreground/30">
          <div className="w-8 h-px bg-current" />
          <span className="text-xs font-mono tracking-widest">EOF</span>
          <div className="w-8 h-px bg-current" />
        </div>
      </div>
    </div>
  )
}




