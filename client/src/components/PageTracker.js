'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import api from '@/lib/api';

export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    api.post('/api/track', { type: 'pageview', page: pathname }).catch(() => {});
  }, [pathname]);

  return null;
}
