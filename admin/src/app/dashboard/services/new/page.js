'use client';

import Header from '@/components/Header';
import ServiceForm from '@/components/ServiceForm';

export default function NewServicePage() {
  return (
    <div className="flex-1 overflow-auto">
      <Header title="Create New Service" />
      <div className="p-6 max-w-4xl">
        <div className="admin-card p-6">
          <ServiceForm />
        </div>
      </div>
    </div>
  );
}
