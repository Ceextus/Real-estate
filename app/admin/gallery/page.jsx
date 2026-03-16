"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BsPlusLg, BsTrash, BsImage, BsCloudUpload, BsXCircleFill } from "react-icons/bs";
import Image from "next/image";
import AdminModal from "@/components/admin/AdminModal";
import { createClient } from "@/utils/supabase/client";
import LogoLoader from "@/components/LogoLoader";
import { useToast } from "@/components/Toast";

export default function AdminGallery() {
  const router = useRouter();
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Modal States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const categories = ["All", "Exterior", "Interior", "Amenities"];
  const toast = useToast();

  const fetchGallery = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setGallery(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openDeleteModal = (image) => {
    setSelectedImage(image);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedImage) return;
    setDeleting(true);
    const supabase = createClient();

    try {
      // If the URL is from our storage bucket, delete the storage object
      const bucketUrl = process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/property-images/";
      if (selectedImage.url.startsWith(bucketUrl)) {
        const filePath = selectedImage.url.replace(bucketUrl, "");
        const { error: storageError } = await supabase.storage.from("property-images").remove([filePath]);
        if (storageError) {
          throw new Error(`Storage delete failed: ${storageError.message}`);
        }
      }

      const { error: dbError } = await supabase.from("gallery").delete().eq("id", selectedImage.id);
      if (dbError) {
        throw new Error(`Database delete failed: ${dbError.message}`);
      }

      setIsDeleteModalOpen(false);
      setSelectedImage(null);
      toast.success("Image deleted successfully!");
      fetchGallery();
      router.refresh();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(`Failed to delete image: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleUploadSuccess = () => {
    setIsUploadModalOpen(false);
    fetchGallery();
    router.refresh();
  };

  const filteredGallery = activeCategory === "All" 
    ? gallery 
    : gallery.filter(img => img.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery Management</h1>
          <p className="text-gray-500">Upload and organize images for the public gallery.</p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
        >
          <BsPlusLg strokeWidth={1} />
          Upload Images
        </button>
      </div>

      {/* Categories / Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto hide-scrollbar">
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? "bg-accent text-white shadow-sm"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <LogoLoader />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGallery.map((image) => (
            <div key={image.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
              <Image 
                src={image.url} 
                alt={image.caption || `Gallery image`} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              
              {/* Overlay - always visible on mobile, hover on desktop */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent md:bg-black/50 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                <div className="flex justify-between items-start">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-xs font-bold leading-none shadow-sm">
                    {image.category}
                  </span>
                  <button 
                    onClick={() => openDeleteModal(image)}
                    className="w-8 h-8 bg-red-500/90 hover:bg-red-600 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors shadow-sm" 
                    title="Delete Image"
                  >
                    <BsTrash size={14} />
                  </button>
                </div>
                {image.caption && (
                  <p className="text-white text-xs font-medium text-center truncate">{image.caption}</p>
                )}
              </div>
            </div>
          ))}
          
          {/* Upload Placeholder inside Grid */}
          <div 
            onClick={() => setIsUploadModalOpen(true)}
            className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 flex flex-col items-center justify-center text-center p-6 hover:bg-accent/5 hover:border-accent hover:text-accent transition-colors group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-colors">
              <BsPlusLg className="text-2xl text-gray-400 group-hover:text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1 group-hover:text-accent transition-colors">Upload New</h3>
            <p className="text-xs text-gray-500 max-w-[150px]">Drag & drop or click to browse</p>
          </div>
        </div>
      )}

      {!loading && filteredGallery.length === 0 && (
        <div className="py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
          No images found in this category.
        </div>
      )}

      {/* MODALS */}

      {/* Upload Image Modal */}
      <AdminModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        title="Upload Images"
      >
        <UploadForm onSuccess={handleUploadSuccess} onClose={() => setIsUploadModalOpen(false)} categories={categories.filter(c => c !== "All")} />
      </AdminModal>

      {/* Delete Image Modal */}
      <AdminModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Delete Image"
      >
        {selectedImage && (
          <div className="space-y-6">
            <p className="text-gray-600">
              Are you sure you want to permanently delete this <strong className="text-gray-900">{selectedImage.category.toLowerCase()}</strong> image? This action cannot be undone.
            </p>
            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200">
               <Image src={selectedImage.url} alt="To delete" fill className="object-cover" />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
               <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={deleting}
                className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-sm disabled:opacity-70"
              >
                {deleting ? "Deleting..." : "Delete Image"}
              </button>
            </div>
          </div>
        )}
      </AdminModal>

    </div>
  );
}

// Upload Form Component with real Supabase upload
function UploadForm({ onSuccess, onClose, categories }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [category, setCategory] = useState("");
  const [caption, setCaption] = useState("");
  const toast = useToast();

  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const handleImageSelect = (file) => {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) { setError("Image must be under 10MB."); return; }
    if (!file.type.startsWith("image/")) { setError("Please select an image file."); return; }
    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleImageSelect(e.dataTransfer?.files?.[0]);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) { setError("Please select an image."); return; }
    if (!category) { setError("Please select a category."); return; }

    setSaving(true);
    setError("");

    const supabase = createClient();

    // Upload to storage
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("property-images")
      .upload(filePath, imageFile);

    if (uploadError) {
      setError(`Upload failed: ${uploadError.message}`);
      toast.error(`Upload failed: ${uploadError.message}`);
      setSaving(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("property-images")
      .getPublicUrl(filePath);

    // Insert row into gallery table
    const { error: insertError } = await supabase.from("gallery").insert({
      category,
      url: urlData.publicUrl,
      caption: caption || null,
    });

    if (insertError) {
      setError(`Save failed: ${insertError.message}`);
      toast.error(`Upload failed: ${insertError.message}`);
      setSaving(false);
      return;
    }

    toast.success("Image uploaded successfully!");
    onSuccess();
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      
      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
      )}

      {/* Image Upload Area */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 block">Image <span className="text-gray-400 font-normal">(max 10MB)</span></label>
        {imagePreview ? (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            <button type="button" onClick={clearImage}
              className="absolute top-2 right-2 bg-white rounded-full shadow-md p-1.5 hover:bg-red-50 transition-colors">
              <BsXCircleFill className="text-red-500 text-lg" />
            </button>
          </div>
        ) : (
          <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("gallery-image-upload").click()}
            className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 flex flex-col items-center justify-center p-6 text-center hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer group">
            <BsCloudUpload className="text-5xl text-gray-300 mb-4 group-hover:text-accent/50 transition-colors" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">Click or drag image here</h3>
            <p className="text-sm text-gray-500">Supports JPG, PNG, WEBP (Max 10MB)</p>
          </div>
        )}
        <input id="gallery-image-upload" type="file" accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden" onChange={(e) => handleImageSelect(e.target.files?.[0])} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 block">Category</label>
        <select 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-gray-700"
          required
        >
          <option value="">Select a category...</option>
          {categories.map(cat => (
             <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 block">Caption <span className="text-gray-400 font-normal">(optional)</span></label>
        <input 
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="e.g. Modern exterior design"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
        <button 
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-70"
        >
          {saving ? "Uploading..." : "Upload Image"}
        </button>
      </div>
      
    </form>
  );
}
