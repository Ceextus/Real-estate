"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BsPlusLg, BsSearch, BsThreeDotsVertical, BsPencilSquare, BsTrash, BsCloudUpload, BsXCircleFill } from "react-icons/bs";
import Image from "next/image";
import AdminModal from "@/components/admin/AdminModal";
import { createClient } from "@/utils/supabase/client";

export default function AdminProperties() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Fetch properties from Supabase
  const fetchProperties = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setProperties(data);
    setLoading(false);
  };

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setProperties(data);
      setLoading(false);
    };
    load();
  }, []);

  const openEditModal = (property) => {
    setSelectedProperty(property);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (property) => {
    setSelectedProperty(property);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedProperty) return;
    const supabase = createClient();
    await supabase.from("properties").delete().eq("id", selectedProperty.id);
    setIsDeleteModalOpen(false);
    setSelectedProperty(null);
    fetchProperties();
    router.refresh();
  };

  const handleFormSuccess = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedProperty(null);
    fetchProperties();
    router.refresh();
  };

  const filteredProperties = properties.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Properties Management</h1>
          <p className="text-gray-500">Add, edit, or remove properties displayed on the site.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
        >
          <BsPlusLg strokeWidth={1} />
          Add New Property
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search properties by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors text-sm"
          />
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-gray-400">Loading properties...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Property</th>
                  <th className="py-4 px-6 font-semibold">Location</th>
                  <th className="py-4 px-6 font-semibold">Price</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0">
                          <Image src={property.image} alt={property.title} fill className="object-cover" />
                        </div>
                        <span className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{property.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-sm whitespace-nowrap">{property.location}</td>
                    <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">{property.price}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        property.property_type === "Move-In Ready" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(property)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="Edit Property"
                        >
                          <BsPencilSquare />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(property)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="Delete Property"
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
          
          {!loading && filteredProperties.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              No properties found.
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}

      {/* Add Property Modal */}
      <AdminModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add New Property"
      >
        <PropertyForm onSuccess={handleFormSuccess} onClose={() => setIsAddModalOpen(false)} />
      </AdminModal>

      {/* Edit Property Modal */}
      <AdminModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Edit Property"
      >
        {selectedProperty && <PropertyForm property={selectedProperty} onSuccess={handleFormSuccess} onClose={() => setIsEditModalOpen(false)} />}
      </AdminModal>

      {/* Delete Property Modal */}
      <AdminModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Delete Property"
      >
        {selectedProperty && (
          <div className="space-y-6">
            <p className="text-gray-600">
              Are you sure you want to permanently delete <strong className="text-gray-900">&quot;{selectedProperty.title}&quot;</strong>? This action cannot be undone.
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
                Delete Property
              </button>
            </div>
          </div>
        )}
      </AdminModal>

    </div>
  );
}

// Reusable Form Component for Add/Edit — now wired to Supabase
function PropertyForm({ property = null, onSuccess, onClose }) {
  const isEditing = !!property;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(property?.image || null);

  const [form, setForm] = useState({
    title: property?.title || "",
    location: property?.location || "",
    price: property?.price || "",
    type: property?.type || "",
    image: property?.image || "",
    images: property?.images || [], // <--- New array field
    beds: property?.beds || "",
    status: property?.status || "",
    property_type: property?.property_type || "Move-In Ready",
    size: property?.size || "",
    description: property?.description || "",
    features: property?.features?.join("\n") || "",
    video_placeholder: property?.video_placeholder || "",
    map_embed: property?.map_embed || "",
  });

  // State for multiple auxiliary images
  const [auxImageFiles, setAuxImageFiles] = useState([]);
  const [auxImagePreviews, setAuxImagePreviews] = useState([]);
  const [existingAuxImages, setExistingAuxImages] = useState(property?.images || []);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleImageSelect = (file) => {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setError("Main image must be under 10MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAuxImagesSelect = (files) => {
    if (!files || files.length === 0) return;
    const validFiles = Array.from(files).filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        setError(`File ${file.name} is too large (max 10MB).`);
        return false;
      }
      if (!file.type.startsWith("image/")) {
        setError(`File ${file.name} is not a valid image.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setError("");
      setAuxImageFiles(prev => [...prev, ...validFiles]);
      setAuxImagePreviews(prev => [
        ...prev, 
        ...validFiles.map(f => URL.createObjectURL(f))
      ]);
    }
  };

  const removeNewAuxImage = (index) => {
    setAuxImageFiles(prev => prev.filter((_, i) => i !== index));
    setAuxImagePreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]); // Free memory
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const removeExistingAuxImage = (urlToRemove) => {
    setExistingAuxImages(prev => prev.filter(url => url !== urlToRemove));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    handleImageSelect(file);
  };

  const handleAuxDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    handleAuxImagesSelect(files);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(isEditing ? property?.image : null);
  };

  const handleChange = (e) => {
    let value = e.target.value;
    // Auto-extract src URL if user pastes a full <iframe> tag into map_embed
    if (e.target.name === "map_embed" && value.includes("<iframe")) {
      const match = value.match(/src="([^"]+)"/);
      if (match) value = match[1];
    }
    setForm(prev => ({ ...prev, [e.target.name]: value }));
  };

  // Generate slug from title
  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const supabase = createClient();
    let imageUrl = form.image;

    // Upload image if a new file was selected
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `properties/${fileName}`;

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
    } else if (!isEditing) {
      // New property requires a main image
      if (!form.image) {
        setError("Please upload a main property image.");
        setSaving(false);
        return;
      }
    }

    // Upload newly selected auxiliary images
    let uploadedAuxUrls = [];
    if (auxImageFiles.length > 0) {
      for (const file of auxImageFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `aux-${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        const filePath = `properties/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(filePath, file);

        if (uploadError) {
          setError(`Aux Image Upload failed: ${uploadError.message}`);
          setSaving(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from("property-images")
          .getPublicUrl(filePath);
        
        uploadedAuxUrls.push(urlData.publicUrl);
      }
    }

    // Combine existing aux images that weren't deleted + newly uploaded aux images
    const finalAuxImagesArray = [...existingAuxImages, ...uploadedAuxUrls];

    const payload = {
      title: form.title,
      slug: generateSlug(form.title),
      location: form.location,
      price: form.price,
      type: form.type,
      image: imageUrl,
      images: finalAuxImagesArray, // Save the array of strings
      beds: form.beds,
      status: form.status,
      property_type: form.property_type,
      size: form.size,
      description: form.description,
      features: form.features.split("\n").filter(f => f.trim() !== ""),
      video_placeholder: form.video_placeholder || null,
      map_embed: form.map_embed || null,
    };

    let result;
    if (isEditing) {
      result = await supabase.from("properties").update(payload).eq("id", property.id);
    } else {
      result = await supabase.from("properties").insert(payload);
    }

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      
      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 block">Property Title</label>
        <input 
          type="text" name="title" value={form.title} onChange={handleChange}
          placeholder="e.g. Luxury 5-Bedroom Detached Duplex" required
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">Location</label>
          <input 
            type="text" name="location" value={form.location} onChange={handleChange}
            placeholder="e.g. Lekki Phase 1, Lagos" required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">Price</label>
          <input 
            type="text" name="price" value={form.price} onChange={handleChange}
            placeholder="e.g. ₦ 350,000,000" required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">Type (e.g. 5 Bed Detached)</label>
          <input 
            type="text" name="type" value={form.type} onChange={handleChange}
            placeholder="e.g. 4 Bed Terraced" required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">Beds</label>
          <input 
            type="text" name="beds" value={form.beds} onChange={handleChange}
            placeholder="e.g. 4 Bedroom Penthouse Suite"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">Property Category</label>
          <select 
            name="property_type" value={form.property_type} onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-gray-700"
          >
            <option value="Buy & Build">Buy & Build</option>
            <option value="Move-In Ready">Move-In Ready</option>
            <option value="Investment / Residential">Investment / Residential</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">Status</label>
          <input 
            type="text" name="status" value={form.status} onChange={handleChange}
            placeholder="e.g. Fully Finished, Off-Plan"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">Size</label>
          <input 
            type="text" name="size" value={form.size} onChange={handleChange}
            placeholder="e.g. 450 sqm"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
      </div>

      {/* Main Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 block">Main Property Image (Thumbnail) <span className="text-gray-400 font-normal">(max 10MB)</span></label>
        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 h-48 w-full sm:w-1/2">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 bg-white rounded-full shadow-md p-1 hover:bg-red-50 transition-colors"
            >
              <BsXCircleFill className="text-red-500 text-lg" />
            </button>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("main-image-upload").click()}
            className="w-full sm:w-1/2 py-10 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:border-accent/50 hover:bg-accent/5 transition-colors cursor-pointer flex flex-col items-center gap-2"
          >
            <BsCloudUpload className="text-3xl text-gray-400" />
            <p className="text-sm text-gray-500 font-medium">Click or drag main image here</p>
          </div>
        )}
        <input
          id="main-image-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => handleImageSelect(e.target.files?.[0])}
        />
      </div>

      {/* Auxiliary Images Upload */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Additional Gallery Images</label>
          <p className="text-xs text-gray-500 mb-3">Upload multiple images. Build a complete showcase.</p>
          
          <div
            onDrop={handleAuxDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("aux-images-upload").click()}
            className="w-full py-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:border-accent/50 hover:bg-accent/5 transition-colors cursor-pointer flex flex-col items-center gap-2"
          >
            <BsCloudUpload className="text-2xl text-gray-400" />
            <p className="text-sm text-gray-500 font-medium">Click or drag & drop multiple files here</p>
          </div>
          <input
            id="aux-images-upload"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => handleAuxImagesSelect(e.target.files)}
          />
        </div>

        {/* Previews Grid */}
        {(existingAuxImages.length > 0 || auxImagePreviews.length > 0) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Existing Ones */}
            {existingAuxImages.map((url, idx) => (
              <div key={`existing-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
                <img src={url} alt={`Existing Aux ${idx}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingAuxImage(url)}
                  className="absolute top-2 right-2 bg-white rounded-full shadow-md p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 text-red-500"
                  title="Remove image"
                >
                  <BsTrash size={14} />
                </button>
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm text-white text-[10px] rounded-full font-medium">Saved</div>
              </div>
            ))}
            
            {/* New Previews */}
            {auxImagePreviews.map((preview, idx) => (
              <div key={`new-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-accent/30 bg-gray-50 group">
                <img src={preview} alt={`New Aux ${idx}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewAuxImage(idx)}
                  className="absolute top-2 right-2 bg-white rounded-full shadow-md p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 text-red-500"
                  title="Undo selection"
                >
                  <BsXCircleFill size={14} />
                </button>
                 <div className="absolute top-2 left-2 px-2 py-0.5 bg-accent text-white text-[10px] rounded-full font-medium">New</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 block">Description</label>
        <textarea 
          name="description" value={form.description} onChange={handleChange}
          rows={3} placeholder="Detailed description of the property..."
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 block">Features (one per line)</label>
        <textarea 
          name="features" value={form.features} onChange={handleChange}
          rows={4} placeholder="Smart Home-Ready Design&#10;24/7 Security&#10;Swimming Pool"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 block">YouTube Video Tour <span className="text-gray-400 font-normal">(paste YouTube link)</span></label>
        <input 
          type="text" name="video_placeholder" value={form.video_placeholder} onChange={handleChange}
          placeholder="e.g. https://www.youtube.com/watch?v=abc123"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 font-mono text-sm"
        />
        <p className="text-xs text-gray-400">Supports youtube.com/watch, youtu.be, and embed links</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 block">Google Maps Embed <span className="text-gray-400 font-normal">(paste full iframe or src URL)</span></label>
        <input 
          type="text" name="map_embed" value={form.map_embed} onChange={handleChange}
          placeholder="Paste Google Maps iframe code or src URL here"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 font-mono text-sm"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
        <button 
          type="button" onClick={onClose}
          className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit" disabled={saving}
          className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-70"
        >
          {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Property"}
        </button>
      </div>
      
    </form>
  );
}
