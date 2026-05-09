import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import NotFoundContent from '@/components/NotFoundContent'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <div className="text-7xl mb-8 opacity-80">🔍</div>
      <h1 className="font-editorial text-5xl font-bold text-foreground mb-3 tracking-tight">404</h1>
      <p className="text-muted-foreground font-mono text-sm mb-2">page not found</p>
      <p className="text-muted-foreground/60 text-sm mb-10 max-w-sm">
        可能是链接错误，或者文章已经被移除了。
      </p>
      <Link href="/" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'font-mono text-xs gap-1.5')}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 8H3M7 4l-4 4 4 4" />
        </svg>
        back to home
      </Link>
    </div>
  )
}
