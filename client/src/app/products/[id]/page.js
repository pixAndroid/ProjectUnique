import api from '@/lib/api';
import PageTracker from '@/components/PageTracker';
import Link from 'next/link';
import { FaArrowLeft, FaPhone, FaTag } from 'react-icons/fa';

async function getProduct(id) {
  try {
    const res = await api.get(`/api/products/${id}`);
    return res.data?.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  return {
    title: `${product?.title || 'Product'} | Unique Air Conditioning`,
    description: product?.shortDescription || ''
  };
}

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.id);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <Link href="/products" className="btn-primary inline-block">Back to Products</Link>
      </div>
    );
  }

  return (
    <>
      <PageTracker />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/products" className="flex items-center gap-2 text-primary-600 mb-6 hover:underline">
          <FaArrowLeft className="text-sm" /> Back to Products
        </Link>

        <div className="card overflow-hidden">
          <div className="md:flex">
            {product.image && (
              <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-8 flex-1">
              {product.category && (
                <span className="inline-flex items-center gap-1 bg-accent-500/10 text-accent-600 text-xs px-3 py-1 rounded-full mb-3">
                  <FaTag className="text-xs" /> {product.category}
                </span>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.title}</h1>
              {product.price && (
                <div className="text-3xl font-bold text-primary-600 mb-4">{product.price}</div>
              )}
              <p className="text-gray-600 mb-6">{product.shortDescription}</p>
              <div
                className="prose max-w-none text-gray-700 mb-6"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
              <div className="flex gap-3">
                <Link href="/contact" className="btn-primary">Enquire Now</Link>
                <a href="tel:+911234567890" className="btn-secondary flex items-center gap-2">
                  <FaPhone className="text-sm" /> Call
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
