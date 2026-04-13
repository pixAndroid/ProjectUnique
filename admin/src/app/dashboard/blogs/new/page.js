'use client';

import Header from '@/components/Header';
import BlogForm from '@/components/BlogForm';

export default function NewBlogPage() {
  return (
    <div className="flex-1 overflow-auto">
      <Header title="Create New Blog" />
      <div className="p-6 max-w-4xl">
        <div className="admin-card p-6">
          <BlogForm />
        </div>
      </div>
    </div>
  );
}
