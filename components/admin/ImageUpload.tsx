"use client";

import { useState, useRef } from 'react';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const json = await res.json();

            if (json.success) {
                onChange(json.url);
                toast.success('Image uploaded successfully');
            } else {
                toast.error(json.message || 'Upload failed');
            }
        } catch {
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-3">
            <div
                onClick={() => !uploading && inputRef.current?.click()}
                className="relative border-2 border-dashed border-slate-200 rounded-xl overflow-hidden cursor-pointer hover:border-blue-400 transition-colors bg-slate-50 group"
            >
                {value ? (
                    <div className="relative h-52">
                        <Image src={value} alt="Cover image" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload className="w-6 h-6 text-white" />
                            <p className="text-white text-sm font-bold">Click to replace</p>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onChange(''); }}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-md"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="h-52 flex flex-col items-center justify-center gap-3 text-slate-400 group-hover:text-blue-500 transition-colors">
                        {uploading ? (
                            <>
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                <p className="text-sm font-bold text-blue-500">Uploading...</p>
                            </>
                        ) : (
                            <>
                                <div className="p-3 bg-slate-100 group-hover:bg-blue-50 rounded-2xl transition-colors">
                                    <ImageIcon className="w-7 h-7" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold">Click to upload cover image</p>
                                    <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
            />
        </div>
    );
}
