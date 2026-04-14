'use client';

import { use, useEffect, useState } from 'react';
import Header from '@/components/Header';
import ProductForm from '@/components/ProductForm';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function EditProductPage({ params }) {
  const { id } = use(params);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/admin/products/${id}`)
      .then(res => setProduct(res.data?.data || null))
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="flex-1 overflow-auto">
      <Header title="Edit Product" />
      <div className="p-6 max-w-4xl">
        <div className="admin-card p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-slate-600 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : product ? (
            <ProductForm product={product} />
          ) : (
            <p className="text-slate-400">Product not found</p>
          )}
        </div>
      </div>
    </div>
  );
}
