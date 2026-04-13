'use client';

import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'Homeowner',
    content: 'Excellent service! The technician arrived on time and fixed my AC within an hour. Very professional and affordable. Highly recommend Unique Air Conditioning!',
    rating: 5,
    avatar: 'RK'
  },
  {
    name: 'Priya Sharma',
    role: 'Restaurant Owner',
    content: 'We have their AMC for all our commercial refrigeration units. The team is responsive and the preventive maintenance has saved us from costly breakdowns.',
    rating: 5,
    avatar: 'PS'
  },
  {
    name: 'Amit Patel',
    role: 'Office Manager',
    content: 'Installed 10 ACs in our new office. The installation was clean, professional, and completed ahead of schedule. The pricing was transparent and fair.',
    rating: 5,
    avatar: 'AP'
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-blue-200 max-w-2xl mx-auto">
            Trusted by thousands of happy customers across the city.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <FaQuoteLeft className="text-yellow-400 text-2xl mb-4" />
              <p className="text-blue-100 mb-6 leading-relaxed">{t.content}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-blue-300">{t.role}</div>
                </div>
                <div className="ml-auto flex">
                  {[...Array(t.rating)].map((_, j) => (
                    <FaStar key={j} className="text-yellow-400 text-sm" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
