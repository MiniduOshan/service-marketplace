import React, { useEffect, useState } from 'react';
import { Blocks, Edit3, RefreshCw, Trash2, FolderPlus, ToggleLeft, ToggleRight } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { apiRequest } from '../../lib/api';

const popularIcons = [
  { key: 'hammer', label: 'Hammer (Carpentry/Construction)' },
  { key: 'plug', label: 'Plug (Electrical)' },
  { key: 'droplet', label: 'Droplet (Plumbing)' },
  { key: 'paint-roller', label: 'Paint Roller (Painting)' },
  { key: 'scissors', label: 'Scissors (Salon/Tailoring)' },
  { key: 'car', label: 'Car (Automotive)' },
  { key: 'home', label: 'Home (Cleaning/Gardening)' },
  { key: 'brush', label: 'Brush (Arts/Design)' },
  { key: 'sparkles', label: 'Sparkles (Beauty/Premium)' },
  { key: 'help-circle', label: 'Other/General' },
];

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [draft, setDraft] = useState({
    name: '',
    description: '',
    icon: 'hammer',
    is_active: true,
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('/admin/categories');
      setCategories(Array.isArray(response.data) ? response.data : []);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const resetDraft = () => {
    setEditingCategoryId(null);
    setDraft({
      name: '',
      description: '',
      icon: 'hammer',
      is_active: true,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!draft.name.trim()) {
      setStatusMessage('Category name is required.');
      return;
    }

    const payload = {
      name: draft.name.trim(),
      description: draft.description.trim() || null,
      icon: draft.icon,
      is_active: draft.is_active,
    };

    try {
      if (editingCategoryId) {
        await apiRequest(`/admin/categories/${editingCategoryId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        setStatusMessage('Category updated successfully.');
      } else {
        await apiRequest('/admin/categories', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setStatusMessage('Category added successfully.');
      }

      await loadCategories();
      resetDraft();
    } catch (error) {
      setErrorMessage(error.message || 'Failed to save category.');
    }
  };

  const handleEdit = (category) => {
    setEditingCategoryId(category.id);
    setDraft({
      name: category.name,
      description: category.description || '',
      icon: category.icon || 'hammer',
      is_active: !!category.is_active,
    });
    setStatusMessage(`Editing category: ${category.name}`);
  };

  const handleDelete = (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    apiRequest(`/admin/categories/${categoryId}`, { method: 'DELETE' })
      .then(async () => {
        if (editingCategoryId === categoryId) {
          resetDraft();
        }
        setStatusMessage('Category deleted successfully.');
        await loadCategories();
      })
      .catch((error) => {
        setErrorMessage(error.message || 'Failed to delete category.');
      });
  };

  const clearMessages = () => {
    setStatusMessage('');
    setErrorMessage('');
  };

  useEffect(() => {
    if (statusMessage || errorMessage) {
      const timeout = window.setTimeout(() => clearMessages(), 3500);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [statusMessage, errorMessage]);

  return (
    <AdminLayout>
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50">
              <Blocks size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Manage Service Categories</h2>
              <p className="text-xs text-slate-500">Add, edit, or remove service categories. Changes will be reflected instantly.</p>
            </div>
          </div>
          <button
            onClick={loadCategories}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Form panel */}
        <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-600">
            {editingCategoryId ? 'Edit Category' : 'Create New Category'}
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Category Name</label>
              <input
                type="text"
                value={draft.name}
                onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                placeholder="e.g. Plumbing"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Icon Type</label>
              <select
                value={draft.icon}
                onChange={(event) => setDraft((current) => ({ ...current, icon: event.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                {popularIcons.map((opt) => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Description</label>
              <input
                type="text"
                value={draft.description}
                onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
                placeholder="Short description of services"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Status</label>
              <div className="flex items-center mt-1.5">
                <button
                  type="button"
                  onClick={() => setDraft((current) => ({ ...current, is_active: !current.is_active }))}
                  className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-800 transition"
                >
                  {draft.is_active ? (
                    <ToggleRight size={24} className="text-emerald-600" />
                  ) : (
                    <ToggleLeft size={24} className="text-slate-400" />
                  )}
                  <span>{draft.is_active ? 'Active (Shows on site)' : 'Inactive (Hidden)'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-200/60 pt-3">
            {editingCategoryId && (
              <button
                type="button"
                onClick={resetDraft}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <FolderPlus size={14} />
              {editingCategoryId ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>

        {/* Feedback alerts */}
        {errorMessage && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-100">
            {errorMessage}
          </div>
        )}
        {statusMessage && (
          <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 border border-emerald-100">
            {statusMessage}
          </div>
        )}

        {/* Categories Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-bold rounded-l-lg">Category</th>
                <th className="px-4 py-3 font-bold">Slug</th>
                <th className="px-4 py-3 font-bold">Description</th>
                <th className="px-4 py-3 font-bold">Packages Count</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold rounded-r-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && categories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-slate-400">Loading categories...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-slate-400">No categories found. Add one above.</td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="capitalize text-emerald-600 font-mono bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100/50">
                          {category.icon || 'tag'}
                        </span>
                        <span>{category.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500">{category.slug}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate" title={category.description}>
                      {category.description || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-800">{category.service_packages_count || 0}</span> packages
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        category.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {category.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(category)}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="rounded p-1 text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
