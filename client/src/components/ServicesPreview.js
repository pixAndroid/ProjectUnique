'use client';

import Link from 'next/link';
import ServiceCard from './ServiceCard';

export default function ServicesPreview({ services = [] }) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Comprehensive air conditioning and refrigeration solutions for homes and businesses.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 6).map((service, i) => (
            <ServiceCard key={service._id} service={service} index={i} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/services" className="btn-primary inline-block">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
