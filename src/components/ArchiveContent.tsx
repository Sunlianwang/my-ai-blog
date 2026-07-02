'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { useI18n } from '@/components/I18nProvider'
import { getLocalizedTitle, getLocalizedSummary, getLocalizedTags } from '@/lib/post-locale'
import type { PostMeta } from '@/lib/posts'

interface ArchiveContentProps {
  posts: PostMeta[]
}

interface YearGroup {
  year: string
  months: {
    month: string
    monthKey: string
    posts: PostMeta[]
  }[]
  count: number
}

function groupByYearMonth(posts: PostMeta[], monthFn: (m: number) => string): YearGroup[] {
  const map = new Map<string, Map<string, PostMeta[]>>()

  for (const post of posts) {
    const [year, month] = post.date.split('-')
    const m = parseInt(month, 10)
    if (!map.has(year)) map.set(year, new Map())
    const yearMap = map.get(year)!
    const key = monthFn(m)
    if (!yearMap.has(key)) yearMap.set(key, [])
    yearMap.get(key)!.push(post)
  }

  const result: YearGroup[] = []
  const sortedYears = Array.from(map.keys()).sort((a, b) => b.localeCompare(a))

  for (const year of sortedYears) {
    const monthMap = map.get(year)!
    const sortedMonths = Array.from(monthMap.keys())
    const months = sortedMonths.map((m) => ({
      month: m,
      monthKey: m,
      posts: monthMap.get(m)!,
    }))
    const count = months.reduce((sum, m) => sum + m.posts.length, 0)
    result.push({ year, months, count })
  }

  return result
}

export default function ArchiveContent({ posts }: ArchiveContentProps) {
  const { t, locale } = useI18n()

  const getMonthLabel = (m: number): string => {
    return t(`month.${m}` as any)
  }

  // State for collapsible years and months
  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>({})
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({})

  // Initialize all years as expanded
  const yearGroups = useMemo(() => {
    const groups = groupByYearMonth(posts, getMonthLabel)
    const initialYears: Record<string, boolean> = {}
    const initialMonths: Record<string, boolean> = {}
    
    for (const group of groups) {
      initialYears[group.year] = true
      for (const month of group.months) {
        initialMonths[`${group.year}-${month.monthKey}`] = true
      }
    }
    
    setExpandedYears(initialYears)
    setExpandedMonths(initialMonths)
    
    return groups
  }, [posts, t])

  const toggleYear = (year: string) => {
    setExpandedYears(prev => ({ ...prev, [year]: !prev[year] }))
  }

  const toggleMonth = (year: string, monthKey: string) => {
    const key = `${year}-${monthKey}`
    setExpandedMonths(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="max-w-none">
      {yearGroups.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-xl">
          <p className="text-4xl mb-4">📂</p>
          <p className="text-muted-foreground text-lg font-editorial">{t('archive.empty')}</p>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Year groups with collapsible functionality */}
          {yearGroups.map((group) => (
            <div key={group.year} className="relative">
              {/* Year heading with toggle */}
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => toggleYear(group.year)}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <svg
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${expandedYears[group.year] ? '' : '-rotate-90'}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                  <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                    {group.year}
                  </h2>
                </button>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                  {group.count}
                </span>
              </div>

              {/* Collapsible content */}
              <div className={`transition-all duration-300 ${expandedYears[group.year] ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                {/* Timeline line */}
                <div className="relative pl-6 sm:pl-10 border-l-2 border-border/50">
                  {group.months.map((monthGroup) => (
                    <div key={monthGroup.month} className="mb-10 last:mb-0 relative">
                      {/* Month dot on timeline */}
                      <div className="absolute -left-[calc(1.5rem+5px)] sm:-left-[calc(2.5rem+5px)] top-1.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />

                      {/* Month heading with toggle */}
                      <div className="flex items-center gap-3 mb-4">
                        <button
                          onClick={() => toggleMonth(group.year, monthGroup.monthKey)}
                          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                          <svg
                            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${expandedMonths[`${group.year}-${monthGroup.monthKey}`] ? '' : '-rotate-90'}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                          <h3 className="font-mono text-sm font-semibold text-foreground tracking-wide">
                            {monthGroup.month}
                          </h3>
                        </button>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                          {monthGroup.posts.length}
                        </span>
                        <div className="flex-1 h-px bg-border/40" />
                      </div>

                      {/* Collapsible month content */}
                      <div className={`transition-all duration-300 ${expandedMonths[`${group.year}-${monthGroup.monthKey}`] ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                        {/* Article list under this month */}
                        <div className="space-y-0 divide-y divide-border/40">
                          {monthGroup.posts.map((post) => (
                            <Link
                              key={post.slug}
                              href={`/posts/${post.slug}`}
                              className="group block py-3.5 first:pt-0 last:pb-0"
                            >
                              <div className="flex items-start gap-4">
                                <time className="text-xs font-mono text-muted-foreground tracking-wide mt-1.5 flex-shrink-0 w-20 tabular-nums">
                                  {post.date}
                                </time>

                                <div className="flex-1 min-w-0">
                                  <h4 className="font-editorial text-base font-bold text-foreground group-hover:text-primary transition-colors duration-200 leading-snug mb-1.5">
                                    {getLocalizedTitle(post, locale)}
                                  </h4>

                                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-1 mb-2">
                                    {getLocalizedSummary(post, locale)}
                                  </p>

                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {getLocalizedTags(post, locale).map((tag) => (
                                      <span
                                        key={tag}
                                        className="inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <span className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1.5 opacity-0 group-hover:opacity-100">
                                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 8h10M9 4l4 4-4 4" />
                                  </svg>
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom ornament */}
      <div className="flex justify-center pt-12">
        <div className="flex items-center gap-3 text-muted-foreground/30">
          <div className="w-8 h-px bg-current" />
          <span className="text-xs font-mono tracking-widest">EOF</span>
          <div className="w-8 h-px bg-current" />
        </div>
      </div>
    </div>
  )
}
