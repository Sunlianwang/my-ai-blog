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

// ── Shared expand overlay ──────────────────────────────────────────
function createExpandOverlay(options: {
  headerLabel: string
  renderBody: (container: HTMLElement) => void
  showCopyBtn?: boolean
  onCopy?: () => void
}) {
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

  // Header
  const header = document.createElement('div')
  header.style.cssText = `
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px; border-bottom: 1px solid hsl(0 0% 90%);
  `

  const langLabel = document.createElement('span')
  langLabel.textContent = options.headerLabel
  langLabel.style.cssText = `
    font-size: 12px; font-family: 'Inter', system-ui, sans-serif;
    color: hsl(0 0% 50%); text-transform: uppercase; letter-spacing: 0.05em;
  `

  const headerBtns = document.createElement('div')
  headerBtns.style.cssText = 'display: flex; gap: 6px;'

  if (options.showCopyBtn && options.onCopy) {
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
    modalCopy.addEventListener('click', () => {
      options.onCopy!()
      modalCopy.textContent = '✓ Copied'
      setTimeout(() => { modalCopy.textContent = 'Copy' }, 2000)
    })
    headerBtns.appendChild(modalCopy)
  }

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

  headerBtns.appendChild(closeBtn)
  header.appendChild(langLabel)
  header.appendChild(headerBtns)

  // Body
  const body = document.createElement('div')
  body.style.cssText = `
    overflow: auto; flex: 1; padding: 16px;
    display: flex; align-items: center; justify-content: center;
  `
  options.renderBody(body)

  modal.appendChild(header)
  modal.appendChild(body)
  overlay.appendChild(modal)

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove()
  })

  const onEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      overlay.remove()
      document.removeEventListener('keydown', onEsc)
    }
  }
  document.addEventListener('keydown', onEsc)

  document.body.appendChild(overlay)
}

// ── Enlarge button factory ────────────────────────────────────────
const btnBase = `
  padding: 4px 8px; font-size: 14px;
  font-family: 'Inter', system-ui, sans-serif;
  background: hsl(0 0% 100%);
  color: hsl(0 0% 40%);
  border: 1px solid hsl(0 0% 85%);
  border-radius: 6px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s, background 0.15s;
  z-index: 10;
  line-height: 1;
`

// 渲染单个 Mermaid 图表
function MermaidChart({ code, loadingText, errorText }: { code: string; loadingText: string; errorText: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
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

  // Add enlarge button after SVG is rendered
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const addBtn = () => {
      if (wrapper.querySelector('.mermaid-enlarge-btn')) return
      const svg = wrapper.querySelector('svg')
      if (!svg) return

      wrapper.style.position = 'relative'

      const btn = document.createElement('button')
      btn.className = 'mermaid-enlarge-btn'
      btn.textContent = '⤢'
      btn.title = 'Enlarge diagram'
      btn.style.cssText = btnBase + 'position: absolute; top: 8px; right: 8px;'

      wrapper.addEventListener('mouseenter', () => { btn.style.opacity = '1' })
      wrapper.addEventListener('mouseleave', () => { btn.style.opacity = '0' })
      btn.addEventListener('mouseenter', () => { btn.style.background = 'hsl(0 0% 96%)' })
      btn.addEventListener('mouseleave', () => { btn.style.background = 'hsl(0 0% 100%)' })

      btn.addEventListener('click', () => {
        createExpandOverlay({
          headerLabel: 'diagram',
          renderBody: (body) => {
            const clone = svg.cloneNode(true) as SVGSVGElement
            clone.style.cssText = 'max-width: 100%; max-height: 70vh; width: auto; height: auto;'
            clone.removeAttribute('width')
            clone.removeAttribute('height')
            body.appendChild(clone)
          },
        })
      })

      wrapper.appendChild(btn)
    }

    // Wait for SVG to be rendered
    const timer = setInterval(() => {
      const svg = wrapper.querySelector('svg')
      if (svg) {
        clearInterval(timer)
        addBtn()
      }
    }, 100)

    setTimeout(() => clearInterval(timer), 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div
      ref={wrapperRef}
      className="my-6 flex justify-center overflow-x-auto rounded-xl bg-muted/40 p-5 border border-border/60"
    >
      <div ref={containerRef}>
        <span className="text-muted-foreground text-sm">📊 {loadingText}</span>
      </div>
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

  // Inject enlarge + copy buttons for code blocks, images, and diagrams
  useEffect(() => {
    const proseEl = document.querySelector('.prose')
    if (!proseEl) return

    const hoverShow = (el: HTMLElement) => {
      el.querySelectorAll('.enlarge-btn').forEach(b => (b as HTMLElement).style.opacity = '1')
    }
    const hoverHide = (el: HTMLElement) => {
      el.querySelectorAll('.enlarge-btn').forEach(b => (b as HTMLElement).style.opacity = '0')
    }

    // ── Helper: copy text ──
    const copyText = async (text: string, btn?: HTMLElement) => {
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
      if (btn) {
        const orig = btn.textContent || ''
        btn.textContent = '✓ Copied'
        btn.style.color = 'hsl(0 0% 20%)'
        setTimeout(() => {
          btn.textContent = orig
          btn.style.color = 'hsl(0 0% 40%)'
        }, 2000)
      }
    }

    // ── 1. <pre> code blocks ──
    const pres = proseEl.querySelectorAll('pre')
    pres.forEach((pre) => {
      if (pre.querySelector('.code-actions')) return
      const code = pre.querySelector('code')
      if (!code) return

      pre.style.position = 'relative'

      const btnGroup = document.createElement('div')
      btnGroup.className = 'code-actions'
      btnGroup.style.cssText = `
        position: absolute; top: 8px; right: 8px;
        display: flex; gap: 4px; z-index: 10;
      `

      const makeBtn = (text: string, title: string, extraStyle = '') => {
        const b = document.createElement('button')
        b.textContent = text
        b.title = title
        b.className = 'enlarge-btn'
        b.style.cssText = `
          padding: 4px 10px; font-size: 12px;
          font-family: 'Inter', system-ui, sans-serif;
          background: hsl(0 0% 100%);
          color: hsl(0 0% 40%);
          border: 1px solid hsl(0 0% 85%);
          border-radius: 6px; cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s, background 0.15s;
          z-index: 10;
          ${extraStyle}
        `
        b.addEventListener('mouseenter', () => { b.style.background = 'hsl(0 0% 96%)' })
        b.addEventListener('mouseleave', () => { b.style.background = 'hsl(0 0% 100%)' })
        return b
      }

      // Copy
      const copyBtn = makeBtn('Copy', 'Copy code')
      copyBtn.addEventListener('click', () => copyText(code.textContent || '', copyBtn))

      // Enlarge
      const enlargeBtn = makeBtn('⤢', 'Expand code', 'font-size: 14px; padding: 4px 8px;')
      enlargeBtn.addEventListener('click', () => {
        const text = code.textContent || ''
        const lang = (code.className.match(/language-(\w+)/) || [])[1] || ''
        createExpandOverlay({
          headerLabel: lang || 'code',
          showCopyBtn: true,
          onCopy: () => copyText(text),
          renderBody: (body) => {
            body.style.cssText = `
              overflow: auto; flex: 1; padding: 16px;
              font-family: 'IBM Plex Mono', 'Fira Code', monospace;
              font-size: 14px; line-height: 1.6;
              color: hsl(0 0% 15%);
              white-space: pre; tab-size: 2;
              display: block;
            `
            const codeEl = document.createElement('code')
            codeEl.textContent = text
            body.appendChild(codeEl)
          },
        })
      })

      btnGroup.appendChild(copyBtn)
      btnGroup.appendChild(enlargeBtn)
      pre.appendChild(btnGroup)
      pre.addEventListener('mouseenter', () => hoverShow(btnGroup))
      pre.addEventListener('mouseleave', () => hoverHide(btnGroup))
    })

    // ── 2. <img> elements ──
    const imgs = proseEl.querySelectorAll('img')
    imgs.forEach((img) => {
      if (img.parentElement?.querySelector('.img-enlarge-btn')) return

      const wrapper = document.createElement('span')
      wrapper.style.cssText = 'position: relative; display: inline-block;'
      img.parentNode?.insertBefore(wrapper, img)
      wrapper.appendChild(img)

      const btn = document.createElement('button')
      btn.className = 'img-enlarge-btn enlarge-btn'
      btn.textContent = '⤢'
      btn.title = 'Enlarge image'
      btn.style.cssText = btnBase + 'position: absolute; top: 8px; right: 8px;'

      wrapper.addEventListener('mouseenter', () => { btn.style.opacity = '1' })
      wrapper.addEventListener('mouseleave', () => { btn.style.opacity = '0' })
      btn.addEventListener('mouseenter', () => { btn.style.background = 'hsl(0 0% 96%)' })
      btn.addEventListener('mouseleave', () => { btn.style.background = 'hsl(0 0% 100%)' })

      btn.addEventListener('click', () => {
        createExpandOverlay({
          headerLabel: 'image',
          renderBody: (body) => {
            const clone = img.cloneNode(true) as HTMLImageElement
            clone.style.cssText = 'max-width: 100%; max-height: 70vh; width: auto; height: auto; border-radius: 8px;'
            body.appendChild(clone)
          },
        })
      })

      wrapper.appendChild(btn)
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
