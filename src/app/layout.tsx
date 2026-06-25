import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import FooterContent from '@/components/FooterContent'
import { I18nProvider } from '@/components/I18nProvider'
import { getAllPostMeta } from '@/lib/posts'

export const metadata: Metadata = {
  title: {
    default: 'AI 学习笔记',
    template: '%s | AI 学习笔记',
  },
  description: '记录 AI 使用和开发技巧的个人博客，涵盖大模型应用、Prompt Engineering、AI 工具使用心得等。',
  keywords: ['AI', '人工智能', '大模型', 'LLM', 'Prompt Engineering', 'ChatGPT', '技术博客'],
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const posts = getAllPostMeta()

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans">
        <I18nProvider>
          <Header posts={posts} />
          <main className="flex-1 max-w-3xl w-full mx-auto px-5 sm:px-8 py-10 sm:py-14">
            {children}
          </main>
          <FooterContent />
        </I18nProvider>
      </body>
    </html>
  )
}
