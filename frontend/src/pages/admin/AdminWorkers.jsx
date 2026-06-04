import React, { useState, useEffect } from 'react';
import { CheckCircle2, PauseCircle, Trash2, ShieldCheck, Eye, X, FileText, Image, ChevronDown, ChevronUp } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { apiRequest } from '../../lib/api';

export default function AdminWorkers() {
  const [workers, setWorkers] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [expandedWorkerId, setExpandedWorkerId] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  const filteredWorkers = workers.filter((worker) => {
    if (worker.verification === 'Rejected') return false;
    if (filter === 'All') return true;
    if (filter === 'Approved') return worker.verification === 'Verified';
    if (filter === 'Hold') return worker.verification === 'Pending verification';
    return false;
  });

  const loadWorkers = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('/admin/workers');
      // Handle both paginated (response.data.data) and non-paginated (response.data) responses
      const workersData = response.data?.data ? response.data.data : response.data;
      setWorkers(Array.isArray(workersData) ? workersData : []);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to load workers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkers();
  }, []);

  const updateWorker = async (workerId, status, verification) => {
    try {
      await apiRequest(`/admin/workers/${workerId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status, verification }),
      });
      loadWorkers();
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update worker.');
    }
  };

  const handleDeleteWorker = async (workerId) => {
    if (!window.confirm('Are you sure you want to delete this worker and all associated packages, bookings, reviews, and wallet records? This action cannot be undone.')) {
      return;
    }
    try {
      await apiRequest(`/admin/users/${workerId}`, {
        method: 'DELETE',
      });
      loadWorkers();
    } catch (error) {
      setErrorMessage(error.message || 'Failed to delete worker.');
    }
  };

  const toggleExpand = (workerId) => {
    setExpandedWorkerId((prev) => (prev === workerId ? null : workerId));
  };

  const hasDocuments = (worker) => {
    return worker.nic_front || worker.nic_back || (worker.certificates && worker.certificates.length > 0) || worker.police_clearance;
  };

  const getVerificationBadge = (status) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            <CheckCircle2 size={10} /> Verified
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
            <Eye size={10} /> Pending
          </span>
        );
    }
  };

  return (
    <AdminLayout>
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Monitor Workers</h2>
              <p className="text-xs text-slate-500">Review documents, approve, suspend, or remove worker accounts.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-xs border-slate-200 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 px-3 py-1.5"
            >
              <option value="All">All</option>
              <option value="Approved">Approved</option>
              <option value="Hold">Hold</option>
            </select>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-500">
            Loading workers...
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="grid gap-4 bg-slate-50 border-b border-slate-200 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:grid-cols-[1.2fr_1fr_0.8fr_0.6fr_1.2fr] sm:px-6">
              <span>Name</span><span>Category</span><span>City</span><span>Status</span><span>Actions</span>
            </div>

            <div className="divide-y divide-slate-100 bg-white">
              {filteredWorkers.length > 0 ? (
                filteredWorkers.map((worker) => (
                  <div key={worker.id}>
                    {/* Main Row */}
                    <div className="grid gap-4 px-4 py-3 sm:grid-cols-[1.2fr_1fr_0.8fr_0.6fr_1.2fr] sm:px-6">
                      <div>
                        <p className="font-semibold text-xs text-slate-900">{worker.name}</p>
                        <p className="mt-0.5 text-[11px] text-slate-500">{worker.email}</p>
                        {worker.phone && (
                          <p className="mt-0.5 text-[11px] text-slate-400">{worker.phone}</p>
                        )}
                      </div>
                      <div className="text-xs text-slate-600 self-center">{worker.category}</div>
                      <div className="text-xs text-slate-600 self-center">{worker.city}</div>
                      <div className="self-center">{getVerificationBadge(worker.verification)}</div>
                      <div className="flex flex-wrap gap-1.5 self-center">
                        <button
                          type="button"
                          onClick={() => toggleExpand(worker.id)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/50 px-3 py-1 text-xs font-semibold text-indigo-700 transition-colors cursor-pointer"
                        >
                          <FileText size={12} />
                          View Form
                          {expandedWorkerId === worker.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteWorker(worker.id)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-red-50 hover:bg-red-100 border border-red-200/50 px-3 py-1 text-xs font-semibold text-red-700 transition-colors cursor-pointer"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Expandable Document Review Panel */}
                    {expandedWorkerId === worker.id && (
                      <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-4 sm:px-6">
                        <div className="mb-4 flex items-center justify-between border-b border-slate-200/60 pb-3">
                          <div className="flex items-center gap-2">
                            <FileText size={16} className="text-indigo-600" />
                            <h3 className="text-sm font-bold text-slate-800">Registration Details — {worker.name}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => updateWorker(worker.id, 'Active', 'Verified')} className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors shadow-sm"><CheckCircle2 size={14} /> Approve</button>
                            <button type="button" onClick={() => updateWorker(worker.id, 'Suspended', 'Pending verification')} className="inline-flex items-center gap-1.5 rounded-md bg-amber-500 hover:bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors shadow-sm"><PauseCircle size={14} /> Hold</button>
                          </div>
                        </div>

                        {worker.bio && (
                          <div className="mb-4 rounded-lg border border-slate-200 bg-white p-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Bio</p>
                            <p className="text-xs text-slate-700 leading-relaxed">{worker.bio}</p>
                          </div>
                        )}

                        {/* NIC Section */}
                        <div className="mb-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">National Identity Card (NIC)</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* NIC Front */}
                            <div className="rounded-lg border border-slate-200 bg-white p-3">
                              <p className="text-[10px] font-semibold text-slate-500 mb-2">Front Side</p>
                              {worker.nic_front ? (
                                <button
                                  type="button"
                                  onClick={() => setLightboxImage({ url: worker.nic_front, title: `${worker.name} — NIC Front` })}
                                  className="group relative block w-full overflow-hidden rounded-md border border-slate-200 hover:border-indigo-300 transition-colors"
                                >
                                  <img
                                    src={worker.nic_front}
                                    alt="NIC Front"
                                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-200"
                                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                  />
                                  <div className="hidden items-center justify-center w-full h-36 bg-slate-100 text-slate-400 text-xs">
                                    <Image size={16} className="mr-1" /> Image unavailable
                                  </div>
                                  <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-colors flex items-center justify-center">
                                    <Eye size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                                  </div>
                                </button>
                              ) : (
                                <div className="flex items-center justify-center w-full h-36 rounded-md border border-dashed border-slate-300 bg-slate-50 text-slate-400 text-xs">
                                  <Image size={16} className="mr-1.5" /> Not uploaded
                                </div>
                              )}
                            </div>

                            {/* NIC Back */}
                            <div className="rounded-lg border border-slate-200 bg-white p-3">
                              <p className="text-[10px] font-semibold text-slate-500 mb-2">Back Side</p>
                              {worker.nic_back ? (
                                <button
                                  type="button"
                                  onClick={() => setLightboxImage({ url: worker.nic_back, title: `${worker.name} — NIC Back` })}
                                  className="group relative block w-full overflow-hidden rounded-md border border-slate-200 hover:border-indigo-300 transition-colors"
                                >
                                  <img
                                    src={worker.nic_back}
                                    alt="NIC Back"
                                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-200"
                                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                  />
                                  <div className="hidden items-center justify-center w-full h-36 bg-slate-100 text-slate-400 text-xs">
                                    <Image size={16} className="mr-1" /> Image unavailable
                                  </div>
                                  <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-colors flex items-center justify-center">
                                    <Eye size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                                  </div>
                                </button>
                              ) : (
                                <div className="flex items-center justify-center w-full h-36 rounded-md border border-dashed border-slate-300 bg-slate-50 text-slate-400 text-xs">
                                  <Image size={16} className="mr-1.5" /> Not uploaded
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Certificates Section */}
                        <div className="mb-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Certificates</p>
                          {worker.certificates && worker.certificates.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {worker.certificates.map((cert, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setLightboxImage({ url: cert, title: `${worker.name} — Certificate ${idx + 1}` })}
                                  className="group relative block w-full overflow-hidden rounded-md border border-slate-200 bg-white hover:border-indigo-300 transition-colors"
                                >
                                  <img
                                    src={cert}
                                    alt={`Certificate ${idx + 1}`}
                                    className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-200"
                                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                  />
                                  <div className="hidden items-center justify-center w-full h-28 bg-slate-100 text-slate-400 text-xs">
                                    <FileText size={14} className="mr-1" /> File
                                  </div>
                                  <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-colors flex items-center justify-center">
                                    <Eye size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                                  </div>
                                  <p className="py-1.5 text-center text-[10px] font-medium text-slate-500 border-t border-slate-100">Certificate {idx + 1}</p>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center w-full py-4 rounded-md border border-dashed border-slate-300 bg-white text-slate-400 text-xs">
                              <FileText size={14} className="mr-1.5" /> No certificates uploaded
                            </div>
                          )}
                        </div>

                        {/* Police Clearance Section */}
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Police Clearance</p>
                          {worker.police_clearance ? (
                            <button
                              type="button"
                              onClick={() => setLightboxImage({ url: worker.police_clearance, title: `${worker.name} — Police Clearance` })}
                              className="group relative block w-full sm:w-1/2 overflow-hidden rounded-md border border-slate-200 bg-white hover:border-indigo-300 transition-colors"
                            >
                              <img
                                src={worker.police_clearance}
                                alt="Police Clearance"
                                className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-200"
                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                              />
                              <div className="hidden items-center justify-center w-full h-36 bg-slate-100 text-slate-400 text-xs">
                                <FileText size={14} className="mr-1" /> File
                              </div>
                              <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-colors flex items-center justify-center">
                                <Eye size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                              </div>
                            </button>
                          ) : (
                            <div className="flex items-center justify-center w-full py-4 rounded-md border border-dashed border-slate-300 bg-white text-slate-400 text-xs">
                              <FileText size={14} className="mr-1.5" /> No police clearance uploaded
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center sm:px-6">
                  <p className="text-xs font-semibold text-slate-800">No worker accounts registered yet.</p>
                  <p className="mt-1 text-xs text-slate-500">Registered workers will show up here for moderation.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Lightbox Modal for full-size document viewing */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Image size={14} className="text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-800">{lightboxImage.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="grid h-7 w-7 place-items-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-slate-100 min-h-[300px] max-h-[70vh]">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-w-full max-h-[65vh] object-contain rounded-md shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}