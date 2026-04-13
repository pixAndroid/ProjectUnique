'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaCalendar, FaTag } from 'react-icons/fa';

export default function BlogCard({ post, index = 0 }) {
  const date = new Date(post.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="card overflow-hidden group"
    >
      <div className="h-52 bg-gradient-to-br from-primary-100 to-accent-500/20 overflow-hidden">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary-300 text-4xl">📰</div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1"><FaCalendar /> {date}</span>
          {post.tags && post.tags[0] && (
            <span className="flex items-center gap-1 bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">
              <FaTag className="text-xs" /> {post.tags[0]}
            </span>
          )}
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {post.title}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
        <Link
          href={`/blog/${post.slug}`}
          className="text-primary-600 text-sm font-medium hover:underline"
        >
          Read More →
        </Link>
      </div>
    </motion.div>
  );
}
