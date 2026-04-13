'use client';

import Header from '@/components/Header';
import ProductForm from '@/components/ProductForm';

export default function NewProductPage() {
  return (
    <div className="flex-1 overflow-auto">
      <Header title="Create New Product" />
      <div className="p-6 max-w-4xl">
        <div className="admin-card p-6">
          <ProductForm />
        </div>
      </div>
    </div>
  );
}
