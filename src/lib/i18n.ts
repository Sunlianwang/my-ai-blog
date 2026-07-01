export type Locale = 'zh' | 'en'

export const translations = {
  // Header
  'nav.home': { zh: '首页', en: 'Home' },
  'nav.archive': { zh: '归档', en: 'Archive' },
  'nav.about': { zh: '关于我', en: 'About' },
  'nav.search': { zh: '搜索', en: 'Search' },
  'nav.lang': { zh: 'EN', en: '中' },

  // Home
  'home.greeting': { zh: '从', en: 'From' },
  'home.greeting2': { zh: '平凡', en: 'Ordinary' },
  'home.greeting3': { zh: '走向', en: 'To' },
  'home.greeting4': { zh: '伟大', en: 'Greatness' },
  'home.greeting_sub': { zh: '——我是 AI 学习者', en: "——I'm an AI Learner" },
  'home.desc': {
    zh: '这里记录我每天自学 AI 使用和开发技巧的过程。从 Prompt Engineering 到大模型应用开发，用文字见证成长的每一步。',
    en: 'Documenting my daily journey of learning AI — from Prompt Engineering to LLM app development. Every step, in writing.',
  },
  'home.tags': { zh: 'Prompt Engineering', en: 'Prompt Engineering' },
  'home.tags2': { zh: 'LLM 应用', en: 'LLM Apps' },
  'home.tags3': { zh: 'AI 工具', en: 'AI Tools' },
  'home.tags4': { zh: '开发技巧', en: 'Dev Tips' },
  'home.articles': { zh: '文章', en: 'Articles' },
  'home.entry': { zh: '篇', en: 'entries' },
  'home.empty.title': { zh: '还没有文章', en: 'No articles yet' },
  'home.empty.desc': {
    zh: '在 posts/ 文件夹中添加 Markdown 文件',
    en: 'Add Markdown files to the posts/ folder',
  },

  // Post detail
  'post.back': { zh: '返回列表', en: 'back to index' },
  'post.notFound': { zh: '文章未找到', en: 'Post not found' },
  'post.article': { zh: 'ARTICLE', en: 'ARTICLE' },
  'post.end': { zh: 'END', en: 'END' },
  'post.loadingChart': { zh: '正在加载图表...', en: 'Loading diagram...' },
  'post.chartError': { zh: '图表渲染出错，请检查 Mermaid 语法', en: 'Diagram render error — check Mermaid syntax' },
  'post.noTranslation': { zh: '', en: '📝 This article is originally written in Chinese. The English translation is being prepared — run <code>npm run translate</code> to generate it.' },
  'post.translated': { zh: '', en: '🤖 Translated from Chinese by AI' },

  // Archive
  'archive.title': { zh: '归档', en: 'Archive' },
  'archive.desc': { zh: '按时间线浏览所有文章', en: 'Browse all articles by timeline' },
  'archive.count': { zh: '篇文章', en: 'articles' },
  'archive.total': { zh: '共', en: 'Total' },
  'archive.empty': { zh: '暂无文章', en: 'No articles yet' },
  'archive.contributionGraph': { zh: '贡献图', en: 'Contribution Graph' },

  // Search
  'search.placeholder': { zh: '搜索文章标题...', en: 'Search article titles...' },
  'search.noResults': { zh: '没有找到匹配的文章', en: 'No matching articles found' },
  'search.hint': { zh: '输入关键词搜索', en: 'Type to search' },
  'search.shortcut': { zh: '搜索', en: 'Search' },

  // About
  'about.title': { zh: '关于我', en: 'About Me' },
  'about.subtitle': { zh: 'AI 爱好者 · 持续学习者', en: 'AI Enthusiast · Lifelong Learner' },
  'about.hello': { zh: '你好！', en: 'Hello!' },
  'about.intro1': {
    zh: '我是一名对 <strong>人工智能</strong> 充满热情的自学者。每天我都会花时间学习 AI 相关的知识和技术，并把学到的东西记录在这个博客里。',
    en: "I'm a self-taught learner passionate about <strong>artificial intelligence</strong>. Every day I spend time learning AI knowledge and techniques, documenting everything in this blog.",
  },
  'about.intro2': {
    zh: '我相信 <em>"教是最好的学"</em>，通过写作来整理思路、深化理解，也希望能帮助到同样在学习路上的你。',
    en: 'I believe <em>"teaching is the best way to learn"</em> — writing helps me organize thoughts and deepen understanding, and I hope it helps you too.',
  },
  'about.learning': { zh: '目前我的学习方向包括：', en: "Here's what I'm currently learning:" },
  'about.topic1': { zh: 'Prompt Engineering — 如何更好地与 AI 对话', en: 'Prompt Engineering — How to communicate better with AI' },
  'about.topic2': { zh: 'LLM 应用开发 — 基于大模型构建实用工具', en: 'LLM App Development — Building practical tools with large models' },
  'about.topic3': { zh: 'AI 工具使用 — 提高工作效率的各种 AI 工具', en: 'AI Tools — Using AI tools to boost productivity' },
  'about.topic4': { zh: 'AI Agent — 智能体的设计与开发', en: 'AI Agent — Design and development of intelligent agents' },
  'about.topic5': { zh: '前端开发 — Next.js、React、TypeScript', en: 'Frontend Dev — Next.js, React, TypeScript' },
  'about.skills': { zh: '技术栈', en: 'Tech Stack' },
  'about.contact': { zh: '联系我', en: 'Contact' },
  'about.contactDesc': {
    zh: '如果你对我的文章有任何想法，或者想交流 AI 学习心得，欢迎联系我！',
    en: 'If you have thoughts on my articles or want to exchange AI learning insights, feel free to reach out!',
  },
  'about.copyEmail': { zh: '复制邮箱', en: 'Copy Email' },
  'about.copyWechat': { zh: '复制微信号', en: 'Copy WeChat ID' },

  // 404
  '404.title': { zh: '页面未找到', en: 'Page Not Found' },
  '404.desc': { zh: '可能是链接错误，或者文章已经被移除了。', en: 'The link may be broken, or the article may have been removed.' },
  '404.back': { zh: '返回首页', en: 'back to home' },

  // Footer
  'footer.copyright': { zh: 'AI 学习笔记', en: 'AI Learning Notes' },
  'footer.tagline': { zh: '持续学习，持续成长', en: 'Keep learning, keep growing' },
  'footer.built': { zh: 'Next.js + Tailwind', en: 'Next.js + Tailwind' },

  // Months
  'month.1': { zh: '1月', en: 'Jan' },
  'month.2': { zh: '2月', en: 'Feb' },
  'month.3': { zh: '3月', en: 'Mar' },
  'month.4': { zh: '4月', en: 'Apr' },
  'month.5': { zh: '5月', en: 'May' },
  'month.6': { zh: '6月', en: 'Jun' },
  'month.7': { zh: '7月', en: 'Jul' },
  'month.8': { zh: '8月', en: 'Aug' },
  'month.9': { zh: '9月', en: 'Sep' },
  'month.10': { zh: '10月', en: 'Oct' },
  'month.11': { zh: '11月', en: 'Nov' },
  'month.12': { zh: '12月', en: 'Dec' },

  // Common
  'common.status': { zh: '学习进行中', en: 'learning in progress' },
  'common.and': { zh: '和', en: '&' },
} as const

export type TranslationKey = keyof typeof translations

export function t(key: TranslationKey, locale: Locale): string {
  return translations[key][locale]
}
