"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';

type FormField = {
    id: string;
    label: string;
    type: string;
    required: boolean;
    options?: string[]; // stored as string[] or CSV
};

export default function CourseRegistrationSettings() {
    const [fields, setFields] = useState<FormField[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isOpen, setIsOpen] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings/course-registration');
            if (!res.ok) throw new Error('Failed to fetch settings');
            const json = await res.json();
            if (json.success && json.data) {
                setFields(json.data.fields || []);
                setTitle(json.data.title || '');
                setDescription(json.data.description || '');
                setIsOpen(json.data.isOpen !== false); // Default to true if not defined
            }
        } catch (err) {
            console.error('An error occurred:', err);
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        setMessage('');
        try {
            const res = await fetch('/api/settings/course-registration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fields, title, description, isOpen }),
            });
            if (!res.ok) throw new Error('Failed to save settings');
            const json = await res.json();
            if (json.success) setMessage('Settings saved successfully!');
            else setMessage('Error saving settings.');
        } catch (err) {
            console.error(err);
            setMessage('Error occurred while saving.');
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const addField = () => {
        const newField: FormField = {
            id: `field_${Date.now()}`,
            label: 'New Field',
            type: 'text',
            required: false,
        };
        setFields([...fields, newField]);
    };

    const removeField = (index: number) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const updateField = (index: number, key: keyof FormField, value: string | boolean | string[]) => {
        const updated = [...fields];
        updated[index] = { ...updated[index], [key]: value };
        setFields(updated);
    };

    if (loading) return <div className="p-8 text-gray-500">Loading settings...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Registration Form Builder</h1>
                    <p className="text-slate-500 font-medium">Dynamically manage the fields students/parents must fill out.</p>
                </div>
                <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="flex items-center px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-100 transition-all active:scale-95"
                >
                    <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 ${message.includes('success') ? 'bg-green-50 text-green-800 border-green-100' : 'bg-red-50 text-red-800 border-red-100'}`}>
                    <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-3 ${message.includes('success') ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="font-semibold">{message}</span>
                    </div>
                </div>
            )}

            <div className="bg-white shadow-sm rounded-2xl border border-slate-200 p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Form Status</h2>
                        <p className="text-sm text-slate-500">Enable or disable public registrations.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isOpen ? 'bg-green-500' : 'bg-slate-300'}`}
                    >
                        <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isOpen ? 'translate-x-9' : 'translate-x-1'}`} />
                        <span className="sr-only">{isOpen ? 'Close Registration' : 'Open Registration'}</span>
                    </button>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-4 pt-2">Form Header Settings</h2>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Form Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none sm:text-sm p-3 border text-slate-900 bg-white transition-all font-semibold"
                                placeholder="e.g. Course Registration"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Form Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={2}
                                className="w-full border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none sm:text-sm p-3 border text-slate-900 bg-white transition-all"
                                placeholder="e.g. Please fill out the form below..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-2xl border border-slate-200 p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Registration Form Builder</h2>
                </div>
                <div className="space-y-6">
                    {fields.length === 0 && (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-400 font-medium italic">No fields added yet. Start by clicking the button below.</p>
                        </div>
                    )}
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-4 items-start p-6 bg-slate-50/50 rounded-2xl border border-slate-200 relative group hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Field Label</label>
                                    <input
                                        type="text"
                                        value={field.label}
                                        onChange={(e) => updateField(index, 'label', e.target.value)}
                                        className="w-full border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none sm:text-sm p-3 border text-slate-900 bg-white transition-all"
                                        placeholder="e.g. Parent's Full Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Field Type</label>
                                    <select
                                        value={field.type}
                                        onChange={(e) => updateField(index, 'type', e.target.value)}
                                        className="w-full border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none sm:text-sm p-3 border text-slate-900 bg-white transition-all"
                                    >
                                        <option value="text">Text (Single Line)</option>
                                        <option value="email">Email</option>
                                        <option value="tel">Phone</option>
                                        <option value="textarea">Long Text (Paragraph)</option>
                                        <option value="select">Dropdown Select</option>
                                    </select>
                                </div>
                                <div className="flex items-end pb-1.5">
                                    <label className="flex items-center space-x-3 text-sm font-semibold text-slate-700 cursor-pointer group/check">
                                        <input
                                            type="checkbox"
                                            checked={field.required}
                                            onChange={(e) => updateField(index, 'required', e.target.checked)}
                                            className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                                        />
                                        <span className="group-hover/check:text-blue-600 transition-colors">Required Field</span>
                                    </label>
                                </div>
                            </div>

                            {field.type === 'select' && (
                                <div className="w-full mt-6 bg-white p-5 border border-slate-100 rounded-2xl shadow-sm">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Options (comma separated)</label>
                                    <input
                                        type="text"
                                        value={field.options?.join(', ') || ''}
                                        onChange={(e) => updateField(index, 'options', e.target.value.split(',').map(s => s.trim()))}
                                        className="w-full border-slate-200 rounded-xl shadow-sm p-3 border text-sm text-slate-900 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        placeholder="Option 1, Option 2, Option 3"
                                    />
                                </div>
                            )}

                            <button
                                onClick={() => removeField(index)}
                                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-all p-2 hover:bg-red-50 rounded-xl"
                                title="Remove Field"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    onClick={addField}
                    className="mt-8 flex items-center justify-center w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-all group"
                >
                    <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" /> Add New Field
                </button>
            </div>
        </div>
    );
}
