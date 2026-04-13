import api from '@/lib/api';
import PageTracker from '@/components/PageTracker';
import Link from 'next/link';
import { FaArrowLeft, FaPhone } from 'react-icons/fa';

async function getService(id) {
  try {
    const res = await api.get(`/api/services/${id}`);
    return res.data?.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const service = await getService(params.id);
  return {
    title: service?.metaTitle || `${service?.title} | Unique Air Conditioning`,
    description: service?.metaDescription || service?.shortDescription
  };
}

export default async function ServiceDetailPage({ params }) {
  const service = await getService(params.id);

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
        <Link href="/services" className="btn-primary inline-block">Back to Services</Link>
      </div>
    );
  }

  return (
    <>
      <PageTracker />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/services" className="flex items-center gap-2 text-primary-600 mb-6 hover:underline">
          <FaArrowLeft className="text-sm" /> Back to Services
        </Link>

        <div className="card overflow-hidden">
          {service.image && (
            <div className="h-64 overflow-hidden">
              <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{service.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{service.shortDescription}</p>

            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: service.description }}
            />

            <div className="mt-8 p-6 bg-primary-50 rounded-xl">
              <h3 className="font-semibold text-primary-900 mb-2">Interested in this service?</h3>
              <p className="text-primary-700 mb-4">Get a free quote from our experts today.</p>
              <div className="flex gap-3">
                <Link href="/contact" className="btn-primary">Request a Quote</Link>
                <a href="tel:+911234567890" className="btn-secondary flex items-center gap-2">
                  <FaPhone className="text-sm" /> Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
