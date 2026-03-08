"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Calendar, MapPin, Clock, ImageIcon, Globe, Trash2 } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { toast } from 'sonner';

export default function EditEventPage() {
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill-new'), { ssr: false }), []);
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        _id: '',
        title: '',
        slug: '',
        description: '',
        date: '',
        time: '',
        location: '',
        isVirtual: false,
        imageUrl: '',
        requiresApplication: true,
        maxApplicants: '',
        status: 'Upcoming'
    });

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link'
    ];

    useEffect(() => {
        if (id) {
            fetch(`/api/events/${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        const event = data.data;
                        setFormData({
                            ...event,
                            date: event.date ? new Date(event.date).toISOString().split('T')[0] : ''
                        });
                    }
                })
                .catch(() => toast.error('Failed to load event data'))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/events/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const json = await res.json();
            if (json.success) {
                toast.success('Event updated successfully!');
                router.push('/admin/events');
            } else {
                toast.error(json.message || 'Failed to update event');
            }
        } catch {
            toast.error('A network error occurred');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this event permanently?")) return;
        
        try {
            const res = await fetch(`/api/events/${id}`, {
                method: "DELETE",
            });
            const json = await res.json();
            if (json.success) {
                toast.success('Event deleted successfully');
                router.push("/admin/events");
            } else {
                toast.error(json.message || 'Failed to delete event');
            }
        } catch {
            toast.error('A network error occurred while deleting');
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <span className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Fetching Event Data...</span>
        </div>
    );

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/admin/events"
              className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Edit Event
            </h1>
            <p className="text-slate-500 font-medium">
              Update the event information and save changes.
            </p>
          </div>

          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl font-bold transition-all border border-red-100 shadow-sm"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete Event
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-12"
        >
          <div className="p-8 space-y-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                  <Calendar className="w-5 h-5" />
                </span>
                Basic Information
              </h3>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Event Slug (URL ID) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-mono text-xs"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })
                    }
                  />
                  <p className="text-[10px] text-slate-500 font-medium px-1">This will be used in the URL: /events/<b>{formData.slug || 'your-slug'}</b></p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Detailed Description <span className="text-red-500">*</span>
                  </label>
                  <div className="prose-slate">
                    <ReactQuill
                      theme="snow"
                      value={formData.description}
                      onChange={(content) =>
                        setFormData({ ...formData, description: content })
                      }
                      modules={modules}
                      formats={formats}
                      className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden min-h-[250px]  focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule & Location */}
            <div className="pt-8 border-t border-slate-100 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <span className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3">
                  <Clock className="w-5 h-5" />
                </span>
                Schedule & Location
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Event Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Event Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Location/Venue <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      required={!formData.isVirtual}
                      disabled={formData.isVirtual}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium disabled:bg-slate-100 disabled:text-slate-400"
                      value={
                        formData.isVirtual
                          ? "Online Session"
                          : formData.location
                      }
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Initial Status
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-bold"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex items-center p-4 bg-blue-50/50 text-blue-800 rounded-2xl border border-blue-100">
                  <input
                    type="checkbox"
                    id="isVirtual"
                    className="w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    checked={formData.isVirtual}
                    onChange={(e) =>
                      setFormData({ ...formData, isVirtual: e.target.checked })
                    }
                  />
                  <label
                    htmlFor="isVirtual"
                    className="ml-3 text-sm font-bold cursor-pointer"
                  >
                    This is a fully virtual/online event
                  </label>
                </div>

                <div className="flex-1 flex flex-col gap-3 p-4 bg-emerald-50/50 text-emerald-800 rounded-2xl border border-emerald-100">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requiresApplication"
                      className="w-5 h-5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      checked={formData.requiresApplication}
                      onChange={(e) =>
                        setFormData({ ...formData, requiresApplication: e.target.checked })
                      }
                    />
                    <label
                      htmlFor="requiresApplication"
                      className="ml-3 text-sm font-bold cursor-pointer"
                    >
                      Enable Application Form
                    </label>
                  </div>
                  
                  {formData.requiresApplication && (
                    <div className="ml-8 mt-2 space-y-2">
                      <label className="text-xs font-bold text-emerald-700">
                        Maximum Applicants (Optional)
                      </label>
                      <input
                        type="number"
                        placeholder="Unlimited"
                        className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                        value={formData.maxApplicants}
                        onChange={(e) =>
                          setFormData({ ...formData, maxApplicants: e.target.value })
                        }
                      />
                      <p className="text-[10px] text-emerald-600 font-medium">Leave empty for no limit.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Media & Options */}
            <div className="pt-8 border-t border-slate-100 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3">
                  <ImageIcon className="w-5 h-5" />
                </span>
                Media & Options
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Cover Image URL
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="url"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
            <Link
              href="/admin/events"
              className="px-8 py-3 text-slate-600 font-bold hover:text-slate-900 transition"
            >
              Discard Changes
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-50 flex items-center"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              ) : (
                <Save className="w-5 h-5 mr-3" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    );
}
