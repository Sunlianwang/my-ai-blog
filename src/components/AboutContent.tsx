'use client'

import { useState } from 'react'
import { useI18n } from '@/components/I18nProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function AboutContent() {
  const { t, locale } = useI18n()
  const [modal, setModal] = useState<{ type: 'email' | 'wechat' } | null>(null)

  const topics = [
    { emoji: '🤖', key: 'about.topic1' as const },
    { emoji: '🔧', key: 'about.topic2' as const },
    { emoji: '📊', key: 'about.topic3' as const },
    { emoji: '🧠', key: 'about.topic4' as const },
    { emoji: '💻', key: 'about.topic5' as const },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center">
        <Avatar className="w-20 h-20 mx-auto mb-6 border-2 border-border">
          <AvatarFallback className="text-3xl bg-gradient-to-br from-primary/5 to-muted font-editorial">
            🧑‍💻
          </AvatarFallback>
        </Avatar>
        <h1 className="font-editorial text-3xl font-bold text-foreground mb-2 tracking-tight">{t('about.title')}</h1>
        <p className="text-sm font-mono text-muted-foreground">{t('about.subtitle')}</p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="w-12 h-px bg-border" />
          <span className="text-[10px] font-mono text-muted-foreground/40 tracking-widest">ABOUT</span>
          <div className="w-12 h-px bg-border" />
        </div>
      </div>

      {/* Intro */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="font-editorial text-lg">👋 {t('about.hello')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 text-foreground/80 leading-[1.85]">
          <p dangerouslySetInnerHTML={{ __html: t('about.intro1') }} />
          <p dangerouslySetInnerHTML={{ __html: t('about.intro2') }} />
          <p>{t('about.learning')}</p>
          <ul className="space-y-3 pl-0 list-none">
            {topics.map((item) => (
              <li key={item.key} className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0">{item.emoji}</span>
                <span className="text-sm leading-relaxed">{t(item.key)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="font-editorial text-lg">🛠️ {t('about.skills')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              'Python', 'TypeScript', 'React', 'Next.js', 'OpenAI API',
              'LangChain', 'Tailwind CSS', 'Git & GitHub', 'Prompt Engineering', 'AI Agent',
            ].map((skill) => (
              <span
                key={skill}
                className="inline-block text-xs font-mono px-2.5 py-1 rounded border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="border-border/60 bg-muted/10">
        <CardHeader className="pb-3">
          <CardTitle className="font-editorial text-lg">📮 {t('about.contact')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80 mb-6 leading-relaxed">
            {t('about.contactDesc')}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/Sunlianwang"
              target="_blank"
              rel="noopener noreferrer"
              className="link-like text-sm font-mono"
            >
              github →
            </a>
            <span className="text-muted-foreground/30">·</span>
            <button
              onClick={() => setModal({ type: 'email' })}
              className="link-like text-sm font-mono bg-transparent border-none cursor-pointer p-0"
            >
              email →
            </button>
            <span className="text-muted-foreground/30">·</span>
            <button
              onClick={() => setModal({ type: 'wechat' })}
              className="link-like text-sm font-mono bg-transparent border-none cursor-pointer p-0"
            >
              微信 →
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Contact Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-background border border-border/60 rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModal(null)}
              className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors text-sm"
            >
              ✕
            </button>
            <div className="text-center">
              <div className="mb-3 flex justify-center">
                {modal.type === 'email' ? (
                  <span className="text-3xl">📧</span>
                ) : (
                  <svg className="w-9 h-9 text-[#07C160]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.045.247.247 0 0 0 .242-.245c0-.06-.024-.12-.04-.178l-.325-1.233a.492.492 0 0 1 .178-.553C23.028 18.333 24 16.592 24 14.628c0-3.299-3.063-5.77-7.062-5.77zm-2.18 2.56c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.36 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z"/>
                  </svg>
                )}
              </div>
              <p className="text-xs font-mono text-muted-foreground mb-2 tracking-wider">
                {modal.type === 'email' ? '联系邮箱' : '联系微信'}
              </p>
              <p className="text-foreground font-editorial text-lg font-semibold tracking-tight">
                {modal.type === 'email' ? '1958232837@qq.com' : 'u15055522256'}
              </p>
              <div className="mt-5 pt-4 border-t border-border/40">
                <button
                  onClick={() => {
                    if (modal.type === 'email') {
                      navigator.clipboard?.writeText('1958232837@qq.com')
                    } else {
                      navigator.clipboard?.writeText('u15055522256')
                    }
                    setModal(null)
                  }}
                  className="text-xs font-mono px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  {modal.type === 'email' ? t('about.copyEmail') : t('about.copyWechat')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
