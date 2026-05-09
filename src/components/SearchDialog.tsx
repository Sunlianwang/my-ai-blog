'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/components/I18nProvider'
import { getLocalizedTitle, getLocalizedSummary, getLocalizedTags } from '@/lib/post-locale'
import type { PostMeta } from '@/lib/posts'

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  posts: PostMeta[]
}

export default function SearchDialog({ open, onOpenChange, posts }: SearchDialogProps) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? posts.filter((p) => {
        const title = getLocalizedTitle(p, locale)
        const summary = getLocalizedSummary(p, locale)
        const tags = getLocalizedTags(p, locale)
        return title.toLowerCase().includes(query.toLowerCase()) ||
          summary.toLowerCase().includes(query.toLowerCase()) ||
          tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      })
    : []

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onOpenChange])

  const handleSelect = useCallback(
    (slug: string) => {
      onOpenChange(false)
      router.push(`/posts/${slug}`)
    },
    [onOpenChange, router]
  )

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div className="relative max-w-lg mx-auto mt-[15vh] px-4">
        <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground flex-shrink-0">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              className="flex-1 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground/50 font-system"
            />
            <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono text-muted-foreground/60 border border-border rounded px-1.5 py-0.5">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[50vh] overflow-y-auto">
            {!query.trim() ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-muted-foreground/60 font-mono">{t('search.hint')}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-muted-foreground/60">{t('search.noResults')}</p>
                <p className="text-xs text-muted-foreground/40 font-mono mt-1">
                  &quot;{query}&quot;
                </p>
              </div>
            ) : (
              <div className="py-2">
                {filtered.map((post) => (
                  <button
                    key={post.slug}
                    onClick={() => handleSelect(post.slug)}
                    className="w-full text-left px-5 py-3.5 hover:bg-muted/60 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-1">
                          {getLocalizedTitle(post, locale)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {getLocalizedSummary(post, locale)}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <time className="text-[10px] font-mono text-muted-foreground/60">
                            {post.date}
                          </time>
                          {getLocalizedTags(post, locale).slice(0, 2).map((tag) => (
                            <span key={tag} className="text-[10px] font-mono text-muted-foreground/50">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100">
                        <path d="M3 8h10M9 4l4 4-4 4" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer hint */}
          <div className="px-5 py-2.5 border-t border-border flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted-foreground/40">
              {filtered.length > 0 ? `${filtered.length} results` : ''}
            </span>
            <div className="flex items-center gap-2">
              <kbd className="text-[10px] font-mono text-muted-foreground/40 border border-border/60 rounded px-1">↑↓</kbd>
              <span className="text-[10px] text-muted-foreground/30">navigate</span>
              <kbd className="text-[10px] font-mono text-muted-foreground/40 border border-border/60 rounded px-1">↵</kbd>
              <span className="text-[10px] text-muted-foreground/30">select</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
