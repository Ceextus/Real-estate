"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BsPlusLg, BsSearch, BsPencilSquare, BsTrash, BsCloudUpload, BsXCircleFill, BsEye, BsEyeSlash } from "react-icons/bs";
import Image from "next/image";
import AdminModal from "@/components/admin/AdminModal";
import { createClient } from "@/utils/supabase/client";
import LogoLoader from "@/components/LogoLoader";
import { useToast } from "@/components/Toast";

export default function AdminBlog() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchPosts = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const openEditModal = (post) => {
    setSelectedPost(post);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (post) => {
    setSelectedPost(post);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedPost) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from("blog_posts").delete().eq("id", selectedPost.id);
      if (error) throw error;
      toast.success("Blog post deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedPost(null);
      fetchPosts();
      router.refresh();
    } catch (err) {
      toast.error(`Failed to delete post: ${err.message}`);
    }
  };

  const handleFormSuccess = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedPost(null);
    fetchPosts();
    router.refresh();
  };

  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.author || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric"
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Management</h1>
          <p className="text-gray-500">Create, edit, or remove blog posts and news articles.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
        >
          <BsPlusLg strokeWidth={1} />
          New Blog Post
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors text-sm"
          />
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <LogoLoader />
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Post</th>
                  <th className="py-4 px-6 font-semibold">Author</th>
                  <th className="py-4 px-6 font-semibold">Date</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                          {post.image && (
                            <Image src={post.image} alt={post.title} fill className="object-cover" />
                          )}
                        </div>
                        <span className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{post.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-sm whitespace-nowrap">{post.author || "Andream Homes"}</td>
                    <td className="py-4 px-6 text-gray-500 text-sm whitespace-nowrap">{formatDate(post.created_at)}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        post.published ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
                      }`}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(post)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Post"
                        >
                          <BsPencilSquare />
                        </button>
                        <button
                          onClick={() => openDeleteModal(post)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Post"
                        >
                          <BsTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && filteredPosts.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              No blog posts found.
            </div>
          )}
        </div>
      </div>

      {/* Add Post Modal */}
      <AdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Blog Post"
      >
        <BlogPostForm onSuccess={handleFormSuccess} onClose={() => setIsAddModalOpen(false)} />
      </AdminModal>

      {/* Edit Post Modal */}
      <AdminModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Blog Post"
      >
        {selectedPost && <BlogPostForm post={selectedPost} onSuccess={handleFormSuccess} onClose={() => setIsEditModalOpen(false)} />}
      </AdminModal>

      {/* Delete Post Modal */}
      <AdminModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Blog Post"
      >
        {selectedPost && (
          <div className="space-y-6">
            <p className="text-gray-600">
              Are you sure you want to permanently delete <strong className="text-gray-900">&quot;{selectedPost.title}&quot;</strong>? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-sm"
              >
                Delete Post
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}

// Blog Post Form Component
function BlogPostForm({ post = null, onSuccess, onClose }) {
  const isEditing = !!post;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(post?.image || null);
  const toast = useToast();

  const [form, setForm] = useState({
    title: post?.title || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    author: post?.author || "Andream Homes",
    youtube_url: post?.youtube_url || "",
    published: post?.published ?? true,
  });

  // Multiple gallery images
  const [auxImageFiles, setAuxImageFiles] = useState([]);
  const [auxImagePreviews, setAuxImagePreviews] = useState([]);
  const [existingAuxImages, setExistingAuxImages] = useState(post?.images || []);

  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const handleImageSelect = (file) => {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) { setError("Image must be under 10MB."); return; }
    if (!file.type.startsWith("image/")) { setError("Please select an image file."); return; }
    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAuxImagesSelect = (files) => {
    if (!files || files.length === 0) return;
    const validFiles = Array.from(files).filter(file => {
      if (file.size > MAX_FILE_SIZE) { setError(`File ${file.name} is too large (max 10MB).`); return false; }
      if (!file.type.startsWith("image/")) { setError(`File ${file.name} is not a valid image.`); return false; }
      return true;
    });
    if (validFiles.length > 0) {
      setError("");
      setAuxImageFiles(prev => [...prev, ...validFiles]);
      setAuxImagePreviews(prev => [...prev, ...validFiles.map(f => URL.createObjectURL(f))]);
    }
  };

  const removeNewAuxImage = (index) => {
    setAuxImageFiles(prev => prev.filter((_, i) => i !== index));
    setAuxImagePreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const removeExistingAuxImage = (urlToRemove) => {
    setExistingAuxImages(prev => prev.filter(url => url !== urlToRemove));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(isEditing ? post?.image : null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const supabase = createClient();
    let imageUrl = post?.image || "";

    // Upload main image
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(filePath, imageFile);

      if (uploadError) {
        setError(`Upload failed: ${uploadError.message}`);
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("property-images")
        .getPublicUrl(filePath);

      imageUrl = urlData.publicUrl;
    } else if (!isEditing && !imageUrl) {
      setError("Please upload a cover image.");
      setSaving(false);
      return;
    }

    // Upload auxiliary images
    let uploadedAuxUrls = [];
    if (auxImageFiles.length > 0) {
      for (const file of auxImageFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `blog-aux-${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        const filePath = `blog/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(filePath, file);

        if (uploadError) {
          setError(`Image upload failed: ${uploadError.message}`);
          setSaving(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from("property-images")
          .getPublicUrl(filePath);
        uploadedAuxUrls.push(urlData.publicUrl);
      }
    }

    const finalAuxImagesArray = [...existingAuxImages, ...uploadedAuxUrls];

    const payload = {
      title: form.title,
      slug: generateSlug(form.title),
      excerpt: form.excerpt || null,
      content: form.content,
      image: imageUrl,
      images: finalAuxImagesArray,
      youtube_url: form.youtube_url || null,
      author: form.author || "Andream Homes",
      published: form.published,
      updated_at: new Date().toISOString(),
    };

    let result;
    if (isEditing) {
      result = await supabase.from("blog_posts").update(payload).eq("id", post.id);
    } else {
      result = await supabase.from("blog_posts").insert(payload);
    }

    if (result.error) {
      setError(result.error.message);
      toast.error(`Operation failed: ${result.error.message}`);
      setSaving(false);
    } else {
      toast.success(isEditing ? "Blog post updated!" : "Blog post published!");
      onSuccess();
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 block">Post Title</label>
        <input
          type="text" name="title" value={form.title} onChange={handleChange}
          placeholder="e.g. Andream Global Launches New Estate in Lekki" required
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
      </div>

      {/* Author & Published */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">Author</label>
          <input
            type="text" name="author" value={form.author} onChange={handleChange}
            placeholder="Andream Homes"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">Status</label>
          <label className="flex items-center gap-3 cursor-pointer bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <input
              type="checkbox" name="published" checked={form.published} onChange={handleChange}
              className="w-4 h-4 rounded accent-accent"
            />
            <span className="text-sm text-gray-700 font-medium">
              {form.published ? "Published — visible to visitors" : "Draft — hidden from visitors"}
            </span>
          </label>
        </div>
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 block">Excerpt <span className="text-gray-400 font-normal">(shown on cards)</span></label>
        <textarea
          name="excerpt" value={form.excerpt} onChange={handleChange}
          rows={2} placeholder="A brief summary of the article..."
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 block">Full Content</label>
        <textarea
          name="content" value={form.content} onChange={handleChange}
          rows={8} placeholder="Write the full blog post content here..." required
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y"
        />
      </div>

      {/* Cover Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 block">Cover Image <span className="text-gray-400 font-normal">(max 10MB)</span></label>
        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 h-48 w-full sm:w-1/2">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            <button type="button" onClick={clearImage}
              className="absolute top-2 right-2 bg-white rounded-full shadow-md p-1 hover:bg-red-50 transition-colors">
              <BsXCircleFill className="text-red-500 text-lg" />
            </button>
          </div>
        ) : (
          <div
            onDrop={(e) => { e.preventDefault(); handleImageSelect(e.dataTransfer?.files?.[0]); }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("blog-cover-upload").click()}
            className="w-full sm:w-1/2 py-10 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:border-accent/50 hover:bg-accent/5 transition-colors cursor-pointer flex flex-col items-center gap-2"
          >
            <BsCloudUpload className="text-3xl text-gray-400" />
            <p className="text-sm text-gray-500 font-medium">Click or drag cover image here</p>
          </div>
        )}
        <input id="blog-cover-upload" type="file" accept="image/*" className="hidden"
          onChange={(e) => handleImageSelect(e.target.files?.[0])} />
      </div>

      {/* Gallery Images Upload */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Additional Images</label>
          <p className="text-xs text-gray-500 mb-3">Upload multiple images for the article gallery.</p>
          <div
            onDrop={(e) => { e.preventDefault(); handleAuxImagesSelect(e.dataTransfer?.files); }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("blog-aux-upload").click()}
            className="w-full py-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:border-accent/50 hover:bg-accent/5 transition-colors cursor-pointer flex flex-col items-center gap-2"
          >
            <BsCloudUpload className="text-2xl text-gray-400" />
            <p className="text-sm text-gray-500 font-medium">Click or drag & drop multiple files</p>
          </div>
          <input id="blog-aux-upload" type="file" multiple accept="image/*" className="hidden"
            onChange={(e) => handleAuxImagesSelect(e.target.files)} />
        </div>

        {(existingAuxImages.length > 0 || auxImagePreviews.length > 0) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {existingAuxImages.map((url, idx) => (
              <div key={`existing-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
                <img src={url} alt={`Existing ${idx}`} className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeExistingAuxImage(url)}
                  className="absolute top-2 right-2 bg-white rounded-full shadow-md p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 text-red-500"
                  title="Remove image">
                  <BsTrash size={14} />
                </button>
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm text-white text-[10px] rounded-full font-medium">Saved</div>
              </div>
            ))}
            {auxImagePreviews.map((preview, idx) => (
              <div key={`new-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-accent/30 bg-gray-50 group">
                <img src={preview} alt={`New ${idx}`} className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeNewAuxImage(idx)}
                  className="absolute top-2 right-2 bg-white rounded-full shadow-md p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 text-red-500"
                  title="Undo selection">
                  <BsXCircleFill size={14} />
                </button>
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-accent text-white text-[10px] rounded-full font-medium">New</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* YouTube URL */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 block">YouTube Video <span className="text-gray-400 font-normal">(optional)</span></label>
        <input
          type="text" name="youtube_url" value={form.youtube_url} onChange={handleChange}
          placeholder="e.g. https://www.youtube.com/watch?v=abc123"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 font-mono text-sm"
        />
        <p className="text-xs text-gray-400">Supports youtube.com/watch, youtu.be, and embed links</p>
      </div>

      {/* Submit */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
        <button type="button" onClick={onClose}
          className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={saving}
          className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-70">
          {saving ? "Saving..." : isEditing ? "Save Changes" : "Publish Post"}
        </button>
      </div>
    </form>
  );
}
