import './globals.css';
import { Toaster } from 'react-hot-toast';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'Admin Panel | Unique Air Conditioning',
  description: 'Admin dashboard for Unique Air Conditioning & Refrigeration'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
