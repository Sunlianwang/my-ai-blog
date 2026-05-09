import { Separator } from '@/components/ui/separator'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/60 bg-muted/20">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <p className="text-sm text-foreground font-medium">
              © {currentYear} AI 学习笔记
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              持续学习，持续成长
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="font-mono text-xs">Next.js + Tailwind</span>
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
