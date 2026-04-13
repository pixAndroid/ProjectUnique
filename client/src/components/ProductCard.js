'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaTag } from 'react-icons/fa';

export default function ProductCard({ product, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="card overflow-hidden group"
    >
      <div className="h-48 bg-gradient-to-br from-primary-50 to-accent-500/10 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <FaTag className="text-4xl text-primary-200" />
        )}
      </div>
      <div className="p-5">
        {product.category && (
          <span className="text-xs font-medium text-accent-600 bg-accent-500/10 px-2 py-1 rounded-full">
            {product.category}
          </span>
        )}
        <h3 className="font-semibold text-gray-900 mt-2 mb-1">{product.title}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.shortDescription}</p>
        <div className="flex items-center justify-between">
          {product.price && (
            <span className="font-bold text-primary-600 text-lg">{product.price}</span>
          )}
          <Link
            href={`/products/${product._id}`}
            className="btn-primary text-sm py-1.5 px-4 ml-auto"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
