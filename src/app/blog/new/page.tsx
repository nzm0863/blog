"use client";

import { useState } from "react";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 画像プレビュー生成
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      // 既存のファイルに新しいファイルを追加
      const newFiles = [...files, ...selectedFiles];
      setFiles(newFiles);
      
      // 新しいファイルのプレビューURLを生成
      const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
      
      // 入力フィールドをリセット（同じファイルを再度選択できるように）
      e.target.value = '';
    }
  };

  // ファイル選択をクリア
  const clearFileSelection = () => {
    setFiles([]);
    // プレビューURLを解放
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setUploadedImageUrls([]);
  };

  // 個別の画像を削除
  const removeImage = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    const newUploadedUrls = uploadedImageUrls.filter((_, i) => i !== index);
    
    // 削除されたプレビューURLを解放
    URL.revokeObjectURL(previewUrls[index]);
    
    setFiles(newFiles);
    setPreviewUrls(newPreviewUrls);
    setUploadedImageUrls(newUploadedUrls);
  };

  // 画像アップロードAPI
  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('/api/blog/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    console.log('画像アップロードAPIレスポンス:', data);
    
    // PHPから返された正しいURLをそのまま使います
    if (data.success && data.image_url) {
      setUploadedImageUrls(prev => [...prev, data.image_url]);
      return data.image_url;
    } else {
      throw new Error(data.error || data.message || '画像アップロードに失敗しました');
    }
  };

  // 本文に画像を挿入
  const insertImageToContent = async (fileIndex: number) => {
    try {
      const file = files[fileIndex];
      if (!file) return;

      // 画像をアップロード
      const imageUrl = await handleImageUpload(file);
      
      // カーソル位置に画像のMarkdownを挿入
      const textArea = document.querySelector('textarea') as HTMLTextAreaElement;
      if (textArea) {
        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;
        // 必ず正しいURLが埋め込まれるように修正
        const imageMarkdown = `<img src="${imageUrl}" alt="アップロード画像">`;
        const newContent = content.substring(0, start) + imageMarkdown + content.substring(end);
        setContent(newContent);
        
        // カーソル位置を画像の後ろに移動
        setTimeout(() => {
          textArea.focus();
          const newPosition = start + imageMarkdown.length;
          textArea.setSelectionRange(newPosition, newPosition);
        }, 0);
      }
    } catch (error) {
      console.error('画像挿入エラー:', error);
      alert('画像の挿入に失敗しました');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 送信前にすべての画像をアップロードする
      const uploadPromises = files.map(async (file) => {
        // uploadedImageUrlsにすでにURLがあるかチェック。ただし、単純なインデックスではなく、ファイル名で関連付けるべき。
        // ここでは、簡単化のため、まだURLがないものだけアップロードする
        const existingUrl = uploadedImageUrls.find(url => url.includes(encodeURIComponent(file.name)));
        if (existingUrl) {
          return existingUrl;
        }
        return handleImageUpload(file);
      });

      const resolvedUrls = await Promise.all(uploadPromises);
      setUploadedImageUrls(resolvedUrls); // stateを更新

      // 本文(content)内の画像パスを完全なURLに置換する
      let finalContent = content;
      const urlMap = new Map<string, string>();
      files.forEach((file, index) => {
        if (resolvedUrls[index]) {
            urlMap.set(file.name, resolvedUrls[index]);
        }
      });

      for (const [filename, url] of urlMap.entries()) {
        // 正規表現で使うためにファイル名をエスケープ
        const escapedFilename = filename.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        // <img src="filename.jpg" ...> を置換
        const imgRegex = new RegExp(`<img src="${escapedFilename}"([^>]*)>`, "g");
        finalContent = finalContent.replace(imgRegex, `<img src="${url}"$1>`);
      }

      const res = await fetch('/api/blog/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: finalContent, // 置換後の本文を送信
          image_url: resolvedUrls.length > 0 ? resolvedUrls[0] : null,
        }),
      });
      const data = await res.json();
      console.log('記事投稿APIレスポンス:', data);
      if (data.success) {
        window.location.href = "/blog";
      } else {
        setError(data.error || data.message || "投稿に失敗しました");
      }
    } catch (error) {
      setError("投稿中にエラーが発生しました");
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container main-content">
      <h1>新規投稿</h1>
      
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label>
            <span className="form-label">タイトル</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
              placeholder="記事のタイトルを入力"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            <span className="form-label">本文</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={15}
              className="form-input"
              placeholder="Markdownで記事を書く"
            />
          </label>
        </div>

        <div className="form-group">
          <span className="form-label">
            画像 {files.length > 0 && `(${files.length}枚選択中)`}
          </span>
          <div className="file-upload">
            <button
              type="button"
              onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
              className="btn"
            >
              画像を選択
            </button>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          {files.length > 0 && (
            <div className="file-actions">
              <button
                type="button"
                onClick={clearFileSelection}
                className="text-action text-danger"
              >
                すべてクリア
              </button>
              <span className="separator">|</span>
              <span className="text-hint">画像を追加で選択できます</span>
            </div>
          )}
        </div>

        {previewUrls.map((url, index) => (
          <div key={index} className="image-preview">
            <div className="image-preview-header">
              <h3>選択された画像:</h3>
              <div className="image-actions">
                <button
                  type="button"
                  onClick={() => insertImageToContent(index)}
                  className="text-action"
                >
                  本文に挿入
                </button>
                <span className="separator">|</span>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="text-action text-danger"
                >
                  削除
                </button>
              </div>
            </div>
            
            <div className="image-info">
              <p>
                ファイル名: {files[index]?.name}
              </p>
              <p>
                サイズ: {files[index] ? (files[index].size / 1024 / 1024).toFixed(2) : '0'} MB
              </p>
            </div>
            
            <div className="image-container">
              <img 
                src={url} 
                alt={`Preview ${index + 1}`}
                className="preview-image"
              />
            </div>
          </div>
        ))}

        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? "投稿中..." : "投稿する"}
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}
