'use client'

import { Separator } from '@/components/ui/separator'
import { useI18n } from '@/components/I18nProvider'

export default function FooterContent() {
  const { t } = useI18n()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/60 bg-muted/20">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <p className="text-sm text-foreground font-medium">
              © {currentYear} {t('footer.copyright')}
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              {t('footer.tagline')}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="font-mono text-xs">{t('footer.built')}</span>
            <Separator orientation="vertical" className="h-3" />
            <a
              href="https://github.com/Sunlianwang"
              target="_blank"
              rel="noopener noreferrer"
              className="link-like text-sm"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
