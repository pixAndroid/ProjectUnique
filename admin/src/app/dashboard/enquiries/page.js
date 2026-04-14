'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import api from '@/lib/api';
import { useNotifications } from '@/lib/useNotifications';
import { FaEnvelope, FaPhone } from 'react-icons/fa';

const statusColors = {
  new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  read: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  replied: 'bg-green-500/20 text-green-400 border-green-500/30'
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const { refreshNewEnquiries } = useNotifications();

  const fetchEnquiries = async () => {
    try {
      const res = await api.get('/api/admin/enquiries');
      setEnquiries(res.data?.data || []);
    } catch {
      toast.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEnquiries(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/admin/enquiries/${id}`, { status });
      setEnquiries(prev => prev.map(e => e._id === id ? { ...e, status } : e));
      toast.success('Status updated');
      refreshNewEnquiries();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <Header title="Enquiries" />
      <div className="p-6">
        <p className="text-slate-400 text-sm mb-6">{enquiries.length} total enquiries</p>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-slate-600 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : enquiries.length === 0 ? (
          <div className="admin-card p-8 text-center">
            <FaEnvelope className="text-slate-600 text-4xl mx-auto mb-3" />
            <p className="text-slate-400">No enquiries yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {enquiries.map(e => (
              <div key={e._id} className="admin-card overflow-hidden">
                <div
                  className="p-4 cursor-pointer hover:bg-slate-700/20 transition-colors"
                  onClick={() => setExpanded(expanded === e._id ? null : e._id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white">{e.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColors[e.status] || statusColors.new}`}>
                          {e.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                        {e.email && <span className="flex items-center gap-1"><FaEnvelope /> {e.email}</span>}
                        {e.phone && <span className="flex items-center gap-1"><FaPhone /> {e.phone}</span>}
                        {e.serviceRequired && <span className="text-slate-500">· {e.serviceRequired}</span>}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-slate-400">
                        {new Date(e.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>

                {expanded === e._id && (
                  <div className="px-4 pb-4 border-t border-slate-700">
                    {e.message && (
                      <div className="mt-3 p-3 bg-slate-700/30 rounded-lg">
                        <p className="text-xs text-slate-400 mb-1">Message</p>
                        <p className="text-slate-300 text-sm">{e.message}</p>
                      </div>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-slate-400">Update Status:</span>
                      {['new', 'read', 'replied'].map(s => (
                        <button
                          key={s}
                          onClick={() => updateStatus(e._id, s)}
                          className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${
                            e.status === s
                              ? statusColors[s]
                              : 'bg-transparent text-slate-400 border-slate-600 hover:border-slate-500'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
