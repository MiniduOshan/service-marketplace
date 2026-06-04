import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Wrench, 
  X, 
  Sparkles, 
  Check, 
  AlertCircle,
  Image,
  ImagePlus
} from 'lucide-react';
import WorkerLayout from '../../components/layout/WorkerLayout';
import { apiRequest, getStoredSessionUser } from '../../lib/api';
import { uploadImageToSupabase } from '../../lib/supabase';

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-scaleIn">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <h2 className="text-xl font-bold text-slate-950">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[calc(92vh-74px)] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function WorkerServices() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [duration, setDuration] = useState('60');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const currentUser = getStoredSessionUser();

  async function loadData() {
    try {
      setLoading(true);
      const servicesRes = await apiRequest('/auth/worker/services');
      const categoriesRes = await apiRequest('/categories');

      setServices(servicesRes.data || servicesRes);
      
      const cats = categoriesRes.data || categoriesRes;
      setCategories(cats);
      
      // Default category to worker's own primary category if available
      if (currentUser?.primary_service_category_id) {
        setCategoryId(currentUser.primary_service_category_id.toString());
      } else if (cats.length > 0) {
        setCategoryId(cats[0].id.toString());
      }

      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load services.');
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function triggerSuccess(msg) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  }

  function openAddModal() {
    setEditingService(null);
    setTitle('');
    setPrice('');
    setDescription('');
    if (currentUser?.primary_service_category_id) {
      setCategoryId(currentUser.primary_service_category_id.toString());
    } else if (categories.length > 0) {
      setCategoryId(categories[0].id.toString());
    }
    setDuration('60');
    setImageUrl('');
    setIsModalOpen(true);
  }

  function openEditModal(service) {
    setEditingService(service);
    setTitle(service.title);
    setPrice(service.price.toString());
    setDescription(service.description || '');
    setCategoryId(service.service_category_id.toString());
    setDuration(service.duration_minutes ? service.duration_minutes.toString() : '60');
    setImageUrl(service.image_url || '');
    setIsModalOpen(true);
  }

  async function handleImageSelect(file) {
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const publicUrl = await uploadImageToSupabase(file, 'service-packages');
      setImageUrl(publicUrl);
    } catch (err) {
      alert(err.message || 'Failed to upload image.');
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    const priceVal = parseFloat(price.replace(/[^0-9.]/g, ''));
    if (!title.trim() || isNaN(priceVal) || !description.trim() || !categoryId) return;

    try {
      if (editingService) {
        // Edit Mode
        const res = await apiRequest(`/auth/worker/services/${editingService.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            title: title.trim(),
            price: priceVal,
            description: description.trim(),
            service_category_id: parseInt(categoryId),
            duration_minutes: parseInt(duration) || null,
            image_url: imageUrl || null,
          }),
        });
        const updated = res.data || res;
        setServices(current =>
          current.map(s => s.id === editingService.id ? updated : s)
        );
        triggerSuccess('Service package updated successfully.');
      } else {
        // Create Mode
        const res = await apiRequest('/auth/worker/services', {
          method: 'POST',
          body: JSON.stringify({
            title: title.trim(),
            price: priceVal,
            description: description.trim(),
            service_category_id: parseInt(categoryId),
            duration_minutes: parseInt(duration) || null,
            location_type: 'onsite',
            image_url: imageUrl || null,
          }),
        });
        const newPkg = res.data || res;
        setServices(current => [newPkg, ...current]);
        triggerSuccess('New service package added successfully.');
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to save service.');
    }
  }

  async function toggleActiveStatus(id, currentActive) {
    try {
      const res = await apiRequest(`/auth/worker/services/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: !currentActive }),
      });
      const updated = res.data || res;
      setServices(current =>
        current.map(s => s.id === id ? updated : s)
      );
      triggerSuccess(`Service is now ${!currentActive ? 'Active' : 'Inactive'}.`);
    } catch (err) {
      alert(err.message || 'Failed to update service status.');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this service package? This action cannot be undone.')) return;
    try {
      await apiRequest(`/auth/worker/services/${id}`, {
        method: 'DELETE',
      });
      setServices(current => current.filter(s => s.id !== id));
      triggerSuccess('Service package deleted successfully.');
    } catch (err) {
      alert(err.message || 'Failed to delete service.');
    }
  }

  if (loading) {
    return (
      <WorkerLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-700 border-t-transparent" />
        </div>
      </WorkerLayout>
    );
  }

  return (
    <WorkerLayout>
      <div className="mx-auto w-full max-w-[1560px]">
        {/* Success Alert Banner */}
        {successMsg && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800 animate-slideDown">
            <Check size={18} className="shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
              My Services
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your service package listings, set pricing, and modify active listings.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 active:scale-[0.98]"
          >
            <Plus size={18} />
            Add New Service
          </button>
        </div>

        {services.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Wrench size={32} />
            </div>
            <h2 className="mt-6 text-xl font-bold text-slate-900">No Services Added</h2>
            <p className="mt-2 max-w-sm text-sm text-slate-500 leading-relaxed">
              Create service packages detailing what you offer so customers can book you.
            </p>
            <button
              type="button"
              onClick={openAddModal}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
            >
              Add Your First Service
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => {
              const categoryName = service.category?.name || 'General';
              const isActive = service.is_active === true || service.is_active === 1;

              return (
                <div 
                  key={service.id} 
                  className={`flex flex-col justify-between overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md ${
                    isActive ? 'border-slate-200' : 'border-slate-200 opacity-70'
                  }`}
                >
                  {service.image_url ? (
                    <div className="h-44 w-full overflow-hidden border-b border-slate-100">
                      <img src={service.image_url} alt={service.title} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-44 w-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center border-b border-slate-100 text-slate-300">
                      <Image size={32} />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {categoryName}
                      </span>
                      
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        <span className="text-xs font-bold text-slate-500">
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-slate-950 leading-snug line-clamp-1">
                      {service.title}
                    </h3>
                    
                    <p className="mt-3 text-sm text-slate-500 leading-relaxed line-clamp-3 min-h-[60px]">
                      {service.description || 'No description provided.'}
                    </p>

                    <div className="mt-5 border-t border-slate-100 pt-4 flex justify-between items-baseline">
                      <span className="text-xs font-medium text-slate-400">Rate / task</span>
                      <span className="text-2xl font-extrabold text-emerald-700">
                        LKR {parseFloat(service.price).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex divide-x divide-slate-100 border-t border-slate-100 bg-slate-50/50">
                    <button
                      type="button"
                      onClick={() => toggleActiveStatus(service.id, isActive)}
                      className="flex flex-1 items-center justify-center gap-2 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      {isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(service)}
                      className="flex flex-1 items-center justify-center gap-2 py-3 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(service.id)}
                      className="flex items-center justify-center px-4 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      aria-label="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Modal Dialog */}
      {isModalOpen && (
        <Modal 
          title={editingService ? 'Edit Service Package' : 'Add New Service Package'} 
          onClose={() => setIsModalOpen(false)}
        >
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">
                Service Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Living Room Wall Painting"
                className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">
                  Base Price (LKR)
                </label>
                <input
                  type="text"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 15000"
                  className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">
                Duration (Minutes)
              </label>
              <input
                type="number"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 60"
                className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">
                Service Description
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what is included in this package, what materials you use, and details about the workflow..."
                className="min-h-32 w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">
                Service Package Image
              </label>
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {imageUrl ? 'Replace package image' : 'Add package image'}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Images make your service package stand out to customers.
                    </p>
                  </div>

                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 shrink-0">
                    <ImagePlus size={17} />
                    {isUploadingImage ? 'Uploading...' : 'Select Image'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageSelect(e.target.files?.[0])}
                      disabled={isUploadingImage}
                    />
                  </label>
                </div>

                {imageUrl && (
                  <div className="relative mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <img src={imageUrl} alt="Package preview" className="h-40 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950/60 text-white hover:bg-red-600 transition"
                      aria-label="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || !price || !description.trim()}
                className="rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Package
              </button>
            </div>
          </form>
        </Modal>
      )}
    </WorkerLayout>
  );
}
