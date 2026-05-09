import { getAllPostMeta } from '@/lib/posts'
import ArchiveContent from '@/components/ArchiveContent'

export default function ArchivePage() {
  const posts = getAllPostMeta()
  return <ArchiveContent posts={posts} />
}
