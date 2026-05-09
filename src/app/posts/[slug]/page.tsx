import { getAllPostSlugs, getPostBySlug } from '@/lib/posts'
import { notFound } from 'next/navigation'
import PostDetailContent from '@/components/PostDetailContent'

// 静态生成所有文章页
export async function generateStaticParams() {
  const slugs = getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

// 动态 metadata
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  if (!post) return { title: '文章未找到' }
  return {
    title: post.title,
    description: post.summary,
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return <PostDetailContent post={post} />
}
