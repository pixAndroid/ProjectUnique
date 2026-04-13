'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import { PageViewsChart, TopPagesChart } from '@/components/AnalyticsChart';
import api from '@/lib/api';
import { FaBlog, FaTools, FaBox, FaEnvelope, FaEye, FaUsers } from 'react-icons/fa';

export default function DashboardPage() {
  const [stats, setStats] = useState({ blogs: 0, services: 0, products: 0, enquiries: 0 });
  const [analytics, setAnalytics] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [blogsRes, servicesRes, productsRes, enquiriesRes, analyticsRes] = await Promise.all([
          api.get('/api/admin/blogs'),
          api.get('/api/admin/services'),
          api.get('/api/admin/products'),
          api.get('/api/admin/enquiries'),
          api.get('/api/admin/analytics').catch(() => ({ data: { data: null } }))
        ]);
        setStats({
          blogs: blogsRes.data?.data?.length || 0,
          services: servicesRes.data?.data?.length || 0,
          products: productsRes.data?.data?.length || 0,
          enquiries: enquiriesRes.data?.data?.length || 0
        });
        setAnalytics(analyticsRes.data?.data);
        setEnquiries((enquiriesRes.data?.data || []).slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const statusColors = { new: 'bg-blue-500/20 text-blue-400', read: 'bg-yellow-500/20 text-yellow-400', replied: 'bg-green-500/20 text-green-400' };

  return (
    <div className="flex-1 overflow-auto">
      <Header title="Dashboard Overview" />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Blogs" value={stats.blogs} icon={FaBlog} color="indigo" />
          <StatsCard title="Services" value={stats.services} icon={FaTools} color="blue" />
          <StatsCard title="Products" value={stats.products} icon={FaBox} color="green" />
          <StatsCard title="Enquiries" value={stats.enquiries} icon={FaEnvelope} color="yellow" />
        </div>

        {analytics && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatsCard title="Total Page Views" value={analytics.totalPageviews?.toLocaleString() || '0'} icon={FaEye} color="indigo" trend="All time" />
            <StatsCard title="Recent Views" value={analytics.recentPageviews?.toLocaleString() || '0'} icon={FaEye} color="blue" trend="Last 30 days" />
            <StatsCard title="Unique Visitors" value={analytics.uniqueVisitors?.toLocaleString() || '0'} icon={FaUsers} color="green" trend="Last 30 days" />
          </div>
        )}

        {/* Charts */}
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PageViewsChart data={analytics.dailyPageviews || []} />
            <TopPagesChart data={analytics.topPages || []} />
          </div>
        )}

        {/* Recent Enquiries */}
        <div className="admin-card">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-white font-semibold">Recent Enquiries</h3>
          </div>
          <div className="divide-y divide-slate-700">
            {enquiries.length === 0 ? (
              <p className="text-slate-400 text-sm p-4">No enquiries yet</p>
            ) : (
              enquiries.map(e => (
                <div key={e._id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">{e.name}</p>
                    <p className="text-slate-400 text-xs">{e.email || e.phone} · {e.serviceRequired}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[e.status] || statusColors.new}`}>
                    {e.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
