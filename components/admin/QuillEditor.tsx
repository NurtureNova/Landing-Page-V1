"use client";

import { useRef, useMemo, useCallback, forwardRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { toast } from 'sonner';

interface QuillEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const QuillEditor = forwardRef<ReactQuill, QuillEditorProps>(
    ({ value, onChange, placeholder, className }, ref) => {
        const internalRef = useRef<ReactQuill>(null);
        const editorRef = (ref as React.RefObject<ReactQuill>) ?? internalRef;

        const imageHandler = useCallback(() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.click();
            input.onchange = async () => {
                const file = input.files?.[0];
                if (!file) return;
                const fd = new FormData();
                fd.append('file', file);
                try {
                    const res = await fetch('/api/upload', { method: 'POST', body: fd });
                    const json = await res.json();
                    if (json.success) {
                        const editor = editorRef.current?.getEditor();
                        const range = editor?.getSelection(true);
                        editor?.insertEmbed(range?.index ?? 0, 'image', json.url);
                        editor?.setSelection((range?.index ?? 0) + 1, 0);
                    } else {
                        toast.error('Image upload failed');
                    }
                } catch {
                    toast.error('Image upload failed');
                }
            };
        }, [editorRef]);

        const modules = useMemo(() => ({
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link', 'image'],
                    ['clean'],
                ],
                handlers: { image: imageHandler },
            },
        }), [imageHandler]);

        const formats = [
            'header', 'bold', 'italic', 'underline', 'strike',
            'list', 'link', 'image',
        ];

        return (
            <ReactQuill
                ref={editorRef}
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                className={className}
            />
        );
    }
);

QuillEditor.displayName = 'QuillEditor';

export default QuillEditor;
