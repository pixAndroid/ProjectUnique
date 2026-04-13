'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaTools, FaArrowRight } from 'react-icons/fa';

export default function ServiceCard({ service, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="card p-6 group cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div className="bg-primary-50 text-primary-600 p-3 rounded-xl group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
          <FaTools className="text-xl" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg mb-2">{service.title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-4">{service.shortDescription}</p>
          <Link
            href={`/services/${service._id}`}
            className="flex items-center gap-2 text-primary-600 text-sm font-medium hover:gap-3 transition-all duration-200"
          >
            Learn More <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
