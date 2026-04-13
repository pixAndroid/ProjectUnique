'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaPhoneAlt } from 'react-icons/fa';

export default function CallToAction() {
  return (
    <section className="py-16 bg-gradient-to-r from-accent-600 to-primary-700 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get a Free Quote Today</h2>
          <p className="text-blue-100 text-lg mb-8">
            Contact us now for a free assessment and quote. Our experts are available 7 days a week.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="flex items-center gap-2 bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg">
              <FaPhoneAlt />
              Request a Quote
            </Link>
            <a href="tel:+911234567890" className="flex items-center gap-2 bg-white/20 text-white border border-white/40 px-8 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors">
              <FaPhoneAlt />
              Call Now: +91 12345 67890
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
