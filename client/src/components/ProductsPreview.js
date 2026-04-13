'use client';

import Link from 'next/link';
import ProductCard from './ProductCard';

export default function ProductsPreview({ products = [] }) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">AC Parts & Products</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Quality AC parts, refrigerants, and accessories for all your needs.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/products" className="btn-primary inline-block">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
