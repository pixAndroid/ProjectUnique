import api from '@/lib/api';
import ServiceCard from '@/components/ServiceCard';
import PageTracker from '@/components/PageTracker';
import { FaWrench } from 'react-icons/fa';

export const metadata = {
  title: 'Our Services | Unique Air Conditioning',
  description: 'Professional AC services including repair, installation, gas refilling, AMC, and commercial refrigeration.'
};

async function getServices() {
  try {
    const res = await api.get('/api/services');
    return res.data?.data || [];
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageTracker />
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-700 to-accent-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <FaWrench className="text-2xl" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Comprehensive air conditioning and refrigeration services for residential and commercial needs.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {services.length === 0 ? (
            <p className="text-center text-gray-500">No services available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <ServiceCard key={service._id} service={service} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
