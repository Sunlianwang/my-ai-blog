# 🤖 AI 学习笔记 - 个人博客

记录 AI 使用和开发技巧的个人博客，使用 Next.js + Tailwind CSS 构建，部署在 GitHub Pages。

## ✨ 功能

- 📝 Markdown 文章写作（支持 frontmatter 元数据）
- 📊 Mermaid 图表渲染（流程图、时序图、架构图等）
- 🏷️ 文章标签分类
- 📱 响应式设计（手机 / 平板 / 电脑）
- 🔍 SEO 优化
- 🚀 GitHub Pages 自动部署

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **内容**: Markdown + gray-matter + remark
- **图表**: Mermaid.js
- **部署**: GitHub Pages + GitHub Actions

## 📁 项目结构

```
blog/
├── posts/                  # Markdown 文章（在这里写文章）
│   ├── prompt-engineering-basics.md
│   └── mermaid-diagrams.md
├── public/                 # 静态资源（图片等）
├── src/
│   ├── app/
│   │   ├── layout.tsx      # 全局布局
│   │   ├── page.tsx        # 首页（文章列表）
│   │   ├── globals.css     # 全局样式
│   │   ├── not-found.tsx   # 404 页面
│   │   ├── about/page.tsx  # 关于我页面
│   │   └── posts/[slug]/page.tsx  # 文章详情页
│   ├── components/
│   │   ├── Header.tsx      # 顶部导航
│   │   ├── Footer.tsx      # 底部信息
│   │   └── PostContent.tsx # 文章内容渲染（含 Mermaid 支持）
│   └── lib/
│       └── posts.ts        # 文章读取工具函数
├── .github/workflows/deploy.yml  # GitHub Pages 自动部署
└── next.config.js
```

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 即可预览。

### 写新文章

在 `posts/` 文件夹中创建 `.md` 文件：

```markdown
---
title: "文章标题"
date: "2026-05-08"
summary: "文章摘要，会显示在首页列表中"
tags: ["标签1", "标签2"]
---

这里是正文内容...
```

### 部署到 GitHub Pages

1. 在 GitHub 上创建仓库
2. 推送代码到 `main` 分支
3. 进入仓库 Settings → Pages → Source 选择 **GitHub Actions**
4. 每次推送代码会自动构建和部署

## 📊 Mermaid 图表

在文章中直接写 Mermaid 代码块即可：

```markdown
​```mermaid
graph LR
    A["开始"] --> B["结束"]
​```
```

支持：流程图、时序图、状态图、甘特图、ER 图等。

## 📝 License

MIT
