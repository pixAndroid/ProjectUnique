import api from '@/lib/api';
import BlogCard from '@/components/BlogCard';
import PageTracker from '@/components/PageTracker';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Blog | Unique Air Conditioning',
  description: 'Tips, guides, and news about air conditioning and refrigeration.'
};

async function getBlogs() {
  try {
    const res = await api.get('/api/blogs?limit=20');
    return res.data?.data?.blogs || [];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <>
      <PageTracker />
      <section className="bg-gradient-to-r from-primary-700 to-accent-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Expert tips, guides, and insights about air conditioning and refrigeration.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {blogs.length === 0 ? (
            <p className="text-center text-gray-500">No blog posts available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((post, i) => (
                <BlogCard key={post._id} post={post} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
