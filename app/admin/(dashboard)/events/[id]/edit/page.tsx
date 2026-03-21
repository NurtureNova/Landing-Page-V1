"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Calendar, MapPin, Clock, ImageIcon, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { getEventStatus } from '@/lib/event-utils';
import ImageUpload from '@/components/admin/ImageUpload';
import DeleteConfirmationModal from '@/components/admin/DeleteConfirmationModal';

const QuillEditor = dynamic(() => import('@/components/admin/QuillEditor'), { ssr: false });

export default function EditEventPage() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
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
        status: 'Upcoming',
        accordions: [] as { title: string; content: string }[],
        footerContent: '',
        customEmailSubject: '',
        customEmailHtml: '',
    });

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

    useEffect(() => {
        if (formData.date && formData.time) {
            const calculatedStatus = getEventStatus(formData.date, formData.time);
            if (calculatedStatus !== formData.status) {
                setFormData(prev => ({ ...prev, status: calculatedStatus }));
            }
        }
    }, [formData.date, formData.time, formData.status]);

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
        setDeleting(true);
        try {
            const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
            const json = await res.json();
            if (json.success) {
                toast.success('Event deleted successfully');
                router.push('/admin/events');
            } else {
                toast.error(json.message || 'Failed to delete event');
            }
        } catch {
            toast.error('A network error occurred while deleting');
        } finally {
            setDeleting(false);
            setDeleteModalOpen(false);
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
            onClick={() => setDeleteModalOpen(true)}
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
                    <QuillEditor
                      value={formData.description}
                      onChange={(content) =>
                        setFormData({ ...formData, description: content })
                      }
                      className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden min-h-[250px] text-slate-900 font-medium"
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

            {/* Accordion Sections */}
            <div className="pt-8 border-t border-slate-100 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <span className="bg-amber-100 text-amber-600 p-2 rounded-lg mr-3">
                  <Calendar className="w-5 h-5" />
                </span>
                Accordion Sections
              </h3>

              <div className="space-y-4">
                {formData.accordions.map((accordion, index) => (
                  <div key={index} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">Section {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.accordions.filter((_, i) => i !== index);
                          setFormData({ ...formData, accordions: updated });
                        }}
                        className="flex items-center px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg text-xs font-bold transition"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Section Title</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                        placeholder="e.g. What to Expect"
                        value={accordion.title}
                        onChange={(e) => {
                          const updated = [...formData.accordions];
                          updated[index] = { ...updated[index], title: e.target.value };
                          setFormData({ ...formData, accordions: updated });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Section Content</label>
                      <div className="prose-editor text-black">
                        <QuillEditor
                          value={accordion.content}
                          onChange={(content) => {
                            const updated = [...formData.accordions];
                            updated[index] = { ...updated[index], content };
                            setFormData({ ...formData, accordions: updated });
                          }}
                          className="bg-white border border-slate-200 rounded-xl overflow-hidden"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, accordions: [...formData.accordions, { title: '', content: '' }] })}
                  className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 hover:border-blue-400 hover:text-blue-600 font-bold transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Accordion Section
                </button>
              </div>
            </div>

            {/* Footer Content */}
            <div className="pt-8 border-t border-slate-100 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <span className="bg-teal-100 text-teal-600 p-2 rounded-lg mr-3">
                  <ImageIcon className="w-5 h-5" />
                </span>
                Footer Content
              </h3>
              <div className="prose-editor text-black">
                <QuillEditor
                  value={formData.footerContent}
                  onChange={(content) => setFormData({ ...formData, footerContent: content })}
                  className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden"
                />
              </div>
            </div>

            {/* Custom Email */}
            <div className="pt-8 border-t border-slate-100 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <span className="bg-rose-100 text-rose-600 p-2 rounded-lg mr-3">
                  <Clock className="w-5 h-5" />
                </span>
                Custom Application Email
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email Subject</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                    placeholder="e.g. Your application has been received"
                    value={formData.customEmailSubject}
                    onChange={(e) => setFormData({ ...formData, customEmailSubject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email Body (HTML)</label>
                  <div className="prose-editor text-black">
                    <QuillEditor
                      value={formData.customEmailHtml}
                      onChange={(content) => setFormData({ ...formData, customEmailHtml: content })}
                      className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden"
                    />
                  </div>
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
                  Cover Image
                </label>
                <ImageUpload
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                />
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

        <DeleteConfirmationModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleDelete}
            loading={deleting}
            title="Delete Event"
            message="Are you sure you want to permanently delete this event? This action cannot be undone and will affect all related applications."
        />
      </div>
    );
}
