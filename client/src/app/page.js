import api from '@/lib/api';
import HeroSection from '@/components/HeroSection';
import ServicesPreview from '@/components/ServicesPreview';
import ProductsPreview from '@/components/ProductsPreview';
import TestimonialsSection from '@/components/TestimonialsSection';
import CallToAction from '@/components/CallToAction';
import PageTracker from '@/components/PageTracker';

async function getData() {
  try {
    const [servicesRes, productsRes] = await Promise.all([
      api.get('/api/services'),
      api.get('/api/products')
    ]);
    return {
      services: servicesRes.data?.data || [],
      products: productsRes.data?.data || []
    };
  } catch {
    return { services: [], products: [] };
  }
}

export default async function HomePage() {
  const { services, products } = await getData();

  return (
    <>
      <PageTracker />
      <HeroSection />
      <ServicesPreview services={services} />
      <ProductsPreview products={products} />
      <TestimonialsSection />
      <CallToAction />
    </>
  );
}
