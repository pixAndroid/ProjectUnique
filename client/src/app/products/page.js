import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import PageTracker from '@/components/PageTracker';
import { FaBox } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Products | Unique Air Conditioning',
  description: 'AC parts, refrigerants, and accessories for all your air conditioning needs.'
};

async function getProducts() {
  try {
    const res = await api.get('/api/products');
    return res.data?.data || [];
  } catch {
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  return (
    <>
      <PageTracker />
      <section className="bg-gradient-to-r from-primary-700 to-accent-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <FaBox className="text-2xl" />
          </div>
          <h1 className="text-4xl font-bold mb-4">AC Parts & Products</h1>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Quality AC parts, refrigerants, and accessories for all your needs.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <p className="text-center text-gray-500">No products available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
