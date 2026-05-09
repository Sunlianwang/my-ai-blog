'use client'

import React, { useEffect, useRef, useState, useId } from 'react'
import { useI18n } from '@/components/I18nProvider'

// 动态加载 mermaid
async function loadMermaid() {
  const mermaid = (await import('mermaid')).default
  mermaid.initialize({
    startOnLoad: false,
    theme: 'neutral',
    securityLevel: 'loose',
    fontFamily: 'Noto Sans SC, system-ui, sans-serif',
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
      curve: 'basis',
    },
  })
  return mermaid
}

// 渲染单个 Mermaid 图表
function MermaidChart({ code, loadingText, errorText }: { code: string; loadingText: string; errorText: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const id = useId().replace(/:/g, 'm')

  useEffect(() => {
    let cancelled = false

    async function render() {
      if (!containerRef.current) return
      try {
        const mermaid = await loadMermaid()
        const { svg } = await mermaid.render(id, code.trim())
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      } catch (err) {
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = `<pre class="text-red-500 text-sm p-4">⚠️ ${errorText}</pre>`
        }
      }
    }

    render()
    return () => { cancelled = true }
  }, [code, id])

  return (
    <div
      ref={containerRef}
      className="my-6 flex justify-center overflow-x-auto rounded-xl bg-muted/40 p-5 border border-border/60"
    >
      <span className="text-muted-foreground text-sm">📊 {loadingText}</span>
    </div>
  )
}

// 主组件：接收原始 HTML，提取 mermaid 代码块并替换为渲染后的图表
interface PostContentProps {
  html: string
}

export default function PostContent({ html }: PostContentProps) {
  const { t } = useI18n()
  const [parts, setParts] = useState<Array<{ type: 'html' | 'mermaid'; content: string }>>([])

  useEffect(() => {
    // 从 HTML 中提取 mermaid 代码块
    // remark-html 会把 ```mermaid 渲染为 <pre><code class="language-mermaid">...</code></pre>
    const regex = /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g
    const result: Array<{ type: 'html' | 'mermaid'; content: string }> = []
    let lastIndex = 0
    let match

    while ((match = regex.exec(html)) !== null) {
      // mermaid 前面的 HTML
      if (match.index > lastIndex) {
        result.push({ type: 'html', content: html.slice(lastIndex, match.index) })
      }
      // mermaid 代码（需要解码 HTML 实体）
      const decoded = match[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/')
      result.push({ type: 'mermaid', content: decoded })
      lastIndex = match.index + match[0].length
    }

    // 剩余的 HTML
    if (lastIndex < html.length) {
      result.push({ type: 'html', content: html.slice(lastIndex) })
    }

    // 如果没有 mermaid 代码块，直接返回原始 HTML
    if (result.length === 0 || (result.length === 1 && result[0].type === 'html')) {
      setParts([{ type: 'html', content: html }])
    } else {
      setParts(result)
    }
  }, [html])

  return (
    <div className="prose">
      {parts.map((part, i) =>
        part.type === 'mermaid' ? (
          <MermaidChart key={`mermaid-${i}`} code={part.content} loadingText={t('post.loadingChart')} errorText={t('post.chartError')} />
        ) : (
          <div key={`html-${i}`} dangerouslySetInnerHTML={{ __html: part.content }} />
        )
      )}
    </div>
  )
}
