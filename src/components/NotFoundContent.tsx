'use client'

import Link from 'next/link'
import { useI18n } from '@/components/I18nProvider'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function NotFoundContent() {
  const { t } = useI18n()

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <div className="text-7xl mb-8 opacity-80">🔍</div>
      <h1 className="font-editorial text-5xl font-bold text-foreground mb-3 tracking-tight">404</h1>
      <p className="text-muted-foreground font-mono text-sm mb-2">{t('404.title')}</p>
      <p className="text-muted-foreground/60 text-sm mb-10 max-w-sm">
        {t('404.desc')}
      </p>
      <Link href="/" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'font-mono text-xs gap-1.5')}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 8H3M7 4l-4 4 4 4" />
        </svg>
        {t('404.back')}
      </Link>
    </div>
  )
}
