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

  // Add copy + enlarge buttons to all code blocks after render
  useEffect(() => {
    const proseEl = document.querySelector('.prose')
    if (!proseEl) return

    const btnStyle = `
      padding: 4px 10px;
      font-size: 12px;
      font-family: 'Inter', system-ui, sans-serif;
      background: hsl(0 0% 100%);
      color: hsl(0 0% 40%);
      border: 1px solid hsl(0 0% 85%);
      border-radius: 6px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s, background 0.15s;
      z-index: 10;
    `

    const showBtns = (btnGroup: HTMLDivElement) => {
      btnGroup.querySelectorAll('button').forEach(b => { b.style.opacity = '1' })
    }
    const hideBtns = (btnGroup: HTMLDivElement) => {
      btnGroup.querySelectorAll('button').forEach(b => { b.style.opacity = '0' })
    }

    const pres = proseEl.querySelectorAll('pre')
    pres.forEach((pre) => {
      if (pre.querySelector('.code-actions')) return

      pre.style.position = 'relative'

      const code = pre.querySelector('code')
      if (!code) return

      // Button group container
      const btnGroup = document.createElement('div')
      btnGroup.className = 'code-actions'
      btnGroup.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        display: flex;
        gap: 4px;
        z-index: 10;
      `

      // Copy button
      const copyBtn = document.createElement('button')
      copyBtn.textContent = 'Copy'
      copyBtn.style.cssText = btnStyle

      copyBtn.addEventListener('mouseenter', () => { copyBtn.style.background = 'hsl(0 0% 96%)' })
      copyBtn.addEventListener('mouseleave', () => { copyBtn.style.background = 'hsl(0 0% 100%)' })

      copyBtn.addEventListener('click', async () => {
        const text = code.textContent || ''
        try {
          await navigator.clipboard.writeText(text)
        } catch {
          const ta = document.createElement('textarea')
          ta.value = text
          ta.style.position = 'fixed'
          ta.style.left = '-9999px'
          document.body.appendChild(ta)
          ta.select()
          document.execCommand('copy')
          document.body.removeChild(ta)
        }
        copyBtn.textContent = '✓ Copied'
        copyBtn.style.color = 'hsl(0 0% 20%)'
        setTimeout(() => {
          copyBtn.textContent = 'Copy'
          copyBtn.style.color = 'hsl(0 0% 40%)'
        }, 2000)
      })

      // Enlarge button
      const enlargeBtn = document.createElement('button')
      enlargeBtn.textContent = '⤢'
      enlargeBtn.title = 'Expand'
      enlargeBtn.style.cssText = btnStyle + 'font-size: 14px; padding: 4px 8px;'

      enlargeBtn.addEventListener('mouseenter', () => { enlargeBtn.style.background = 'hsl(0 0% 96%)' })
      enlargeBtn.addEventListener('mouseleave', () => { enlargeBtn.style.background = 'hsl(0 0% 100%)' })

      enlargeBtn.addEventListener('click', () => {
        const text = code.textContent || ''
        const lang = (code.className.match(/language-(\w+)/) || [])[1] || ''

        // Create modal
        const overlay = document.createElement('div')
        overlay.style.cssText = `
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px; animation: fadeIn 0.15s ease;
        `

        const modal = document.createElement('div')
        modal.style.cssText = `
          background: hsl(0 0% 100%); border-radius: 12px;
          width: min(90vw, 900px); max-height: 85vh;
          display: flex; flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
          overflow: hidden; animation: zoomIn 0.2s ease;
        `

        // Modal header
        const header = document.createElement('div')
        header.style.cssText = `
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px; border-bottom: 1px solid hsl(0 0% 90%);
        `

        const langLabel = document.createElement('span')
        langLabel.textContent = lang || 'code'
        langLabel.style.cssText = `
          font-size: 12px; font-family: 'Inter', system-ui, sans-serif;
          color: hsl(0 0% 50%); text-transform: uppercase; letter-spacing: 0.05em;
        `

        const headerBtns = document.createElement('div')
        headerBtns.style.cssText = 'display: flex; gap: 6px;'

        const modalCopy = document.createElement('button')
        modalCopy.textContent = 'Copy'
        modalCopy.style.cssText = `
          padding: 4px 12px; font-size: 12px;
          font-family: 'Inter', system-ui, sans-serif;
          background: hsl(0 0% 96%); color: hsl(0 0% 30%);
          border: 1px solid hsl(0 0% 85%); border-radius: 6px;
          cursor: pointer; transition: background 0.15s;
        `
        modalCopy.addEventListener('mouseenter', () => { modalCopy.style.background = 'hsl(0 0% 92%)' })
        modalCopy.addEventListener('mouseleave', () => { modalCopy.style.background = 'hsl(0 0% 96%)' })
        modalCopy.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(text)
          } catch {
            const ta = document.createElement('textarea')
            ta.value = text
            ta.style.position = 'fixed'
            ta.style.left = '-9999px'
            document.body.appendChild(ta)
            ta.select()
            document.execCommand('copy')
            document.body.removeChild(ta)
          }
          modalCopy.textContent = '✓ Copied'
          setTimeout(() => { modalCopy.textContent = 'Copy' }, 2000)
        })

        const closeBtn = document.createElement('button')
        closeBtn.textContent = '✕'
        closeBtn.style.cssText = `
          width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
          font-size: 14px; background: none; border: 1px solid hsl(0 0% 85%);
          border-radius: 6px; cursor: pointer; color: hsl(0 0% 40%);
          transition: background 0.15s;
        `
        closeBtn.addEventListener('mouseenter', () => { closeBtn.style.background = 'hsl(0 0% 96%)' })
        closeBtn.addEventListener('mouseleave', () => { closeBtn.style.background = 'none' })
        closeBtn.addEventListener('click', () => overlay.remove())

        headerBtns.appendChild(modalCopy)
        headerBtns.appendChild(closeBtn)
        header.appendChild(langLabel)
        header.appendChild(headerBtns)

        // Modal body
        const body = document.createElement('div')
        body.style.cssText = `
          overflow: auto; flex: 1; padding: 16px;
          font-family: 'IBM Plex Mono', 'Fira Code', monospace;
          font-size: 14px; line-height: 1.6;
          color: hsl(0 0% 15%);
          white-space: pre; tab-size: 2;
        `
        const codeEl = document.createElement('code')
        codeEl.textContent = text
        body.appendChild(codeEl)

        modal.appendChild(header)
        modal.appendChild(body)
        overlay.appendChild(modal)

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) overlay.remove()
        })

        // Close on Escape
        const onEsc = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            overlay.remove()
            document.removeEventListener('keydown', onEsc)
          }
        }
        document.addEventListener('keydown', onEsc)

        document.body.appendChild(overlay)
      })

      btnGroup.appendChild(copyBtn)
      btnGroup.appendChild(enlargeBtn)
      pre.appendChild(btnGroup)

      pre.addEventListener('mouseenter', () => showBtns(btnGroup))
      pre.addEventListener('mouseleave', () => hideBtns(btnGroup))
    })
  }, [parts])

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
