'use client';

import { useState } from 'react';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
}

export default function ImageUpload({ onImageUploaded }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/blog/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.image_url) {
        onImageUploaded(data.image_url);
      } else {
        throw new Error(data.error || data.message || 'アップロードに失敗しました');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'アップロードに失敗しました');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="relative mt-1">
        <button
          type="button"
          onClick={() => document.querySelector<HTMLInputElement>('#content-image-upload')?.click()}
          className="px-4 py-2 text-gray-200 bg-gray-800 border border-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={isUploading}
        >
          {isUploading ? "アップロード中..." : "本文に画像を挿入"}
        </button>
        <input
          id="content-image-upload"
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              await handleUpload(file);
              e.target.value = ''; // リセット
            }
          }}
          className="hidden"
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
} 