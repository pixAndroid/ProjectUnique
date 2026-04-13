import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'Unique Air Conditioning & Refrigeration',
  description: 'Professional AC services, installation, repair, and maintenance. Serving your city with expert air conditioning solutions.',
  keywords: 'AC repair, air conditioning, AC installation, gas refilling, AC maintenance',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
