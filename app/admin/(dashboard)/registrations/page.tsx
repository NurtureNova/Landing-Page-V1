"use client";

import { useState, useEffect } from 'react';
import { Eye, Trash2, CheckCircle, XCircle, Clock, Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import DeleteConfirmationModal from '@/components/admin/DeleteConfirmationModal';

type Registration = {
    _id: string;
    formData: Record<string, string | number | boolean | string[]>;
    status: string;
    createdAt: string;
};

export default function AdminRegistrationsPage() {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalReg, setModalReg] = useState<Registration | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [regToDelete, setRegToDelete] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const res = await fetch('/api/registrations');
            if (!res.ok) throw new Error('Failed to fetch registrations');
            const json = await res.json();
            if (json.success) setRegistrations(json.data);
        } catch (err) {
            console.error('An error occurred:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/registrations/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const json = await res.json();
            if (json.success) {
                toast.success(`Application ${newStatus}`);
                setRegistrations(registrations.map(r => r._id === id ? { ...r, status: newStatus } : r));
                if (modalReg?._id === id) setModalReg({ ...modalReg, status: newStatus });
            } else {
                toast.error(json.message || 'Failed to update status');
            }
        } catch {
            toast.error('Failed to update status');
        }
    };

    const deleteRegistration = (id: string) => {
        setRegToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!regToDelete) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/registrations/${regToDelete}`, { method: 'DELETE' });
            const json = await res.json();
            if (json.success) {
                toast.success('Registration deleted successfully');
                setRegistrations(registrations.filter(r => r._id !== regToDelete));
                if (modalReg?._id === regToDelete) setModalReg(null);
                setDeleteModalOpen(false);
                setRegToDelete(null);
            } else {
                toast.error(json.message || 'Failed to delete registration');
            }
        } catch {
            toast.error('Failed to delete registration');
        } finally {
            setDeleting(false);
        }
    };

    const filteredRegs = registrations.filter(reg => {
        const searchStr = JSON.stringify(reg.formData).toLowerCase();
        return searchStr.includes(searchTerm.toLowerCase());
    });

    const StatusBadge = ({ status }: { status: string }) => {
        if (status === 'Approved') return <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800 border border-green-200"><CheckCircle className="w-3 h-3 mr-1 my-auto" /> Approved</span>;
        if (status === 'Rejected') return <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-red-100 text-red-800 border border-red-200"><XCircle className="w-3 h-3 mr-1 my-auto" /> Rejected</span>;
        return <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200"><Clock className="w-3 h-3 mr-1 my-auto" /> Pending</span>;
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Course Registrations</h1>
                    <p className="text-slate-500 font-medium">Manage and review all incoming applications for our courses.</p>
                </div>
                
                <div className="relative max-w-sm w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Search className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search registrations..."
                        className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <span className="text-slate-500 font-medium animate-pulse">Loading registrations...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Applicant Preview</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Date Submitted</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {filteredRegs.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                                            No registrations found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRegs.map((reg) => {
                                        const firstFieldKey = Object.keys(reg.formData)[0];
                                        const secondFieldKey = Object.keys(reg.formData)[1];
                                        return (
                                            <tr key={reg._id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-slate-900">{reg.formData[firstFieldKey] || 'N/A'}</div>
                                                    <div className="text-xs text-slate-500 truncate max-w-[200px]">{reg.formData[secondFieldKey] || ''}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                    {new Date(reg.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <StatusBadge status={reg.status} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end items-center gap-3">
                                                    <button
                                                        onClick={() => setModalReg(reg)}
                                                        className="text-blue-600 hover:text-blue-800 transition p-2 bg-blue-50 rounded-lg hover:bg-blue-100"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteRegistration(reg._id)}
                                                        className="text-red-500 hover:text-red-700 transition p-2 bg-red-50 rounded-lg hover:bg-red-100"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {modalReg && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center p-8 border-b border-slate-100">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Registration Details</h2>
                                <p className="text-sm text-slate-500 mt-1">Submitted on {new Date(modalReg.createdAt).toLocaleString()}</p>
                            </div>
                            <button onClick={() => setModalReg(null)} className="text-slate-400 hover:text-slate-600 transition bg-slate-100 hover:bg-slate-200 rounded-full p-2.5">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                            <div className="flex justify-between items-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current Status</span>
                                    <div className="pt-1"><StatusBadge status={modalReg.status} /></div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => updateStatus(modalReg._id, 'Approved')}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${modalReg.status === 'Approved' ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'bg-white text-green-600 border border-green-200 hover:bg-green-50'}`}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => updateStatus(modalReg._id, 'Rejected')}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${modalReg.status === 'Rejected' ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-white text-red-600 border border-red-200 hover:bg-red-50'}`}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(modalReg.formData).map(([label, value]) => (
                                    <div key={label} className="space-y-1.5 p-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
                                        <div className="text-slate-900 font-medium whitespace-pre-wrap">{value?.toString() || <span className="text-slate-300 italic">No entry</span>}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 border-t border-slate-100 flex justify-end bg-slate-50 rounded-b-3xl">
                            <button
                                onClick={() => deleteRegistration(modalReg._id)}
                                className="px-6 py-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-sm font-bold transition-all border border-red-100"
                            >
                                Delete Permanent Record
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                loading={deleting}
                title="Delete Registration"
                message="Are you sure you want to permanently delete this registration? This action cannot be undone."
            />
        </div>
    );
}
