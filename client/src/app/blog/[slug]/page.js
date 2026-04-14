import api from '@/lib/api';
import PageTracker from '@/components/PageTracker';
import Link from 'next/link';
import { FaArrowLeft, FaCalendar, FaTag } from 'react-icons/fa';
import { resolveImageUrl } from '@/lib/imageUtils';

export const dynamic = 'force-dynamic';

async function getBlog(slug) {
  try {
    const res = await api.get(`/api/blogs/${slug}`);
    return res.data?.data || null;
  } catch {
    return null;
  }
}

async function getRelatedBlogs() {
  try {
    const res = await api.get('/api/blogs?limit=3');
    return res.data?.data?.blogs || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const blog = await getBlog(params.slug);
  return {
    title: blog?.metaTitle || `${blog?.title} | Unique Air Conditioning`,
    description: blog?.metaDescription || blog?.excerpt
  };
}

export default async function BlogDetailPage({ params }) {
  const [blog, relatedBlogs] = await Promise.all([
    getBlog(params.slug),
    getRelatedBlogs()
  ]);

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
        <Link href="/blog" className="btn-primary inline-block">Back to Blog</Link>
      </div>
    );
  }

  const date = new Date(blog.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const related = relatedBlogs.filter(p => p.slug !== params.slug).slice(0, 3);

  return (
    <>
      <PageTracker />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/blog" className="flex items-center gap-2 text-primary-600 mb-6 hover:underline">
          <FaArrowLeft className="text-sm" /> Back to Blog
        </Link>

        <article className="card overflow-hidden">
          {blog.image && (
            <div className="h-72 overflow-hidden">
              <img src={resolveImageUrl(blog.image)} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-8">
            <div className="flex flex-wrap gap-3 items-center text-sm text-gray-400 mb-4">
              <span className="flex items-center gap-1"><FaCalendar /> {date}</span>
              {blog.tags?.map(tag => (
                <span key={tag} className="flex items-center gap-1 bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">
                  <FaTag className="text-xs" /> {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">{blog.excerpt}</p>

            <div
              className="prose prose-lg max-w-none text-gray-700 prose-headings:text-gray-900 prose-a:text-primary-600"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </article>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((post) => (
                <div key={post._id} className="card p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="text-primary-600 text-sm font-medium hover:underline">
                    Read More →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
