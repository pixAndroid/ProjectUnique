import Link from 'next/link';
import { FaSnowflake, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <FaSnowflake className="text-primary-500 text-2xl" />
              <span className="font-bold text-white text-lg">Unique Air Conditioning</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Professional AC services, installation, repair, and maintenance. Trusted by thousands of customers.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><FaFacebook className="text-xl" /></a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors"><FaInstagram className="text-xl" /></a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors"><FaWhatsapp className="text-xl" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/services', label: 'Services' },
                { href: '/products', label: 'Products' },
                { href: '/blog', label: 'Blog' },
                { href: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm">
              {[
                'AC Repair & Maintenance',
                'AC Installation',
                'Gas Refilling',
                'Annual Maintenance Contract',
                'Commercial Refrigeration',
              ].map((service) => (
                <li key={service}>
                  <Link href="/services" className="text-gray-400 hover:text-white transition-colors">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-primary-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">123 Main Street, Your City, State 400001</span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="text-primary-500 flex-shrink-0" />
                <a href="tel:+911234567890" className="text-gray-400 hover:text-white transition-colors">+91 12345 67890</a>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-primary-500 flex-shrink-0" />
                <a href="mailto:info@uniqueaircon.com" className="text-gray-400 hover:text-white transition-colors">info@uniqueaircon.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Unique Air Conditioning & Refrigeration. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
