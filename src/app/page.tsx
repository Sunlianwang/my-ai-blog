import Link from 'next/link'
import { getAllPostMeta } from '@/lib/posts'
import HomeContent from '@/components/HomeContent'

export default function Home() {
  const posts = getAllPostMeta()

  return <HomeContent posts={posts} />
}
