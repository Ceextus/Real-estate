"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BsPlusLg, BsSearch, BsThreeDotsVertical, BsPencilSquare, BsTrash, BsCloudUpload, BsXCircleFill } from "react-icons/bs";
import Image from "next/image";
import AdminModal from "@/components/admin/AdminModal";
import { createClient } from "@/utils/supabase/client";
import LogoLoader from "@/components/LogoLoader";
import { useToast } from "@/components/Toast";

export default function AdminProperties() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();
  
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
    try {
      const supabase = createClient();
      const { error } = await supabase.from("properties").delete().eq("id", selectedProperty.id);
      if (error) throw error;
      
      toast.success("Property deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedProperty(null);
      fetchProperties();
      router.refresh();
    } catch (err) {
      toast.error(`Failed to delete property: ${err.message}`);
    }
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
            <LogoLoader />
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
  const toast = useToast();

  const [form, setForm] = useState({
    title: property?.title || "",
    location: property?.location || "",
    price: property?.price || "",
    type: property?.type || "",
    image: property?.image || "",
    images: property?.images || [],
    beds: property?.beds || "",
    status: property?.status || "",
    property_type: property?.property_type || "Move-In Ready",
    size: property?.size || "",
    description: property?.description || "",
    features: property?.features?.join("\n") || "",
    video_placeholder: property?.video_placeholder || "",
    map_embed: property?.map_embed || "",
    developer: property?.developer || "",
    supported_by: property?.supported_by || "",
    registration_fee: property?.registration_fee || "",
    payment_options: property?.payment_options?.join("\n") || "",
    facilities: property?.facilities || [],
  });

  // Plot types state (dynamic rows)
  const [plotTypes, setPlotTypes] = useState(
    property?.plot_types?.length ? property.plot_types : [{ type: "", size: "", units: "", price: "" }]
  );

  // Service plots state (dynamic rows)
  const [servicePlots, setServicePlots] = useState(
    property?.service_plots?.length ? property.service_plots : [{ size: "", house_type: "", price: "" }]
  );

  // Bank details state (dynamic rows)
  const [bankDetails, setBankDetails] = useState(
    property?.bank_details?.length ? property.bank_details : [{ bank: "", account_name: "", account_no: "" }]
  );

  // Show/hide extended fields
  const [showProjectDetails, setShowProjectDetails] = useState(false);

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

  // Generate SEO-friendly slug from title + location
  const generateSlug = (title, location = "") => {
    const base = location ? `${title} ${location}` : title;
    return base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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
      slug: generateSlug(form.title, form.location),
      location: form.location,
      price: form.price,
      type: form.type,
      image: imageUrl,
      images: finalAuxImagesArray,
      beds: form.beds,
      status: form.status,
      property_type: form.property_type,
      size: form.size,
      description: form.description,
      features: form.features.split("\n").filter(f => f.trim() !== ""),
      video_placeholder: form.video_placeholder || null,
      map_embed: form.map_embed || null,
      developer: form.developer || null,
      supported_by: form.supported_by || null,
      registration_fee: form.registration_fee || null,
      plot_types: plotTypes.filter(p => p.type || p.size || p.price),
      service_plots: servicePlots.filter(s => s.size || s.house_type || s.price),
      payment_options: form.payment_options.split("\n").filter(f => f.trim() !== ""),
      bank_details: bankDetails.filter(b => b.bank || b.account_name || b.account_no),
      facilities: form.facilities.filter(f => f),
    };

    let result;
    if (isEditing) {
      result = await supabase.from("properties").update(payload).eq("id", property.id);
    } else {
      result = await supabase.from("properties").insert(payload);
    }

    if (result.error) {
      setError(result.error.message);
      toast.error(`Operation failed: ${result.error.message}`);
      setSaving(false);
    } else {
      toast.success(isEditing ? "Property updated successfully!" : "Property created successfully!");
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
            placeholder="e.g. Karu, Abuja FCT" required
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

      {/* ─── Extended Project Details (Collapsible) ─── */}
      <div className="border-t border-gray-100 pt-6">
        <button
          type="button"
          onClick={() => setShowProjectDetails(!showProjectDetails)}
          className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <span>📋 Project Details (Plot Types, Payment Plans, Bank Info)</span>
          <span className="text-gray-400">{showProjectDetails ? "▲" : "▼"}</span>
        </button>

        {showProjectDetails && (
          <div className="space-y-6 mt-6 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
            {/* Developer & Supported By */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block">Developer / Company</label>
                <input
                  type="text" name="developer" value={form.developer} onChange={handleChange}
                  placeholder="e.g. Andreams Global Properties Ltd"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block">Supported By</label>
                <input
                  type="text" name="supported_by" value={form.supported_by} onChange={handleChange}
                  placeholder="e.g. Brook Fields Company"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
            </div>

            {/* Registration Fee */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">Registration Fee</label>
              <input
                type="text" name="registration_fee" value={form.registration_fee} onChange={handleChange}
                placeholder="e.g. ₦10,000"
                className="w-full sm:w-1/2 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>

            {/* Plot Types (Dynamic Rows) */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 block">Plot Types & Pricing</label>
              {plotTypes.map((plot, idx) => (
                <div key={idx} className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-end">
                  <input
                    placeholder="Type (e.g. 4-Bed Duplex)"
                    value={plot.type} onChange={(e) => { const n = [...plotTypes]; n[idx].type = e.target.value; setPlotTypes(n); }}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 col-span-2"
                  />
                  <input
                    placeholder="Size (e.g. 840 sqm)"
                    value={plot.size} onChange={(e) => { const n = [...plotTypes]; n[idx].size = e.target.value; setPlotTypes(n); }}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                  <input
                    placeholder="Units"
                    value={plot.units} onChange={(e) => { const n = [...plotTypes]; n[idx].units = e.target.value; setPlotTypes(n); }}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                  <div className="flex gap-2">
                    <input
                      placeholder="Price"
                      value={plot.price} onChange={(e) => { const n = [...plotTypes]; n[idx].price = e.target.value; setPlotTypes(n); }}
                      className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                    {plotTypes.length > 1 && (
                      <button type="button" onClick={() => setPlotTypes(plotTypes.filter((_, i) => i !== idx))}
                        className="px-2 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm"
                      >✕</button>
                    )}
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => setPlotTypes([...plotTypes, { type: "", size: "", units: "", price: "" }])}
                className="text-sm text-accent font-semibold hover:underline"
              >+ Add Plot Type</button>
            </div>

            {/* Service Plots (Dynamic Rows) */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 block">Service Plots</label>
              {servicePlots.map((sp, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
                  <input
                    placeholder="Size (e.g. 500 sqm)"
                    value={sp.size} onChange={(e) => { const n = [...servicePlots]; n[idx].size = e.target.value; setServicePlots(n); }}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                  <input
                    placeholder="House Type (e.g. 4-Bed Duplex)"
                    value={sp.house_type} onChange={(e) => { const n = [...servicePlots]; n[idx].house_type = e.target.value; setServicePlots(n); }}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 col-span-1 sm:col-span-2"
                  />
                  <div className="flex gap-2">
                    <input
                      placeholder="Price"
                      value={sp.price} onChange={(e) => { const n = [...servicePlots]; n[idx].price = e.target.value; setServicePlots(n); }}
                      className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                    {servicePlots.length > 1 && (
                      <button type="button" onClick={() => setServicePlots(servicePlots.filter((_, i) => i !== idx))}
                        className="px-2 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm"
                      >✕</button>
                    )}
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => setServicePlots([...servicePlots, { size: "", house_type: "", price: "" }])}
                className="text-sm text-accent font-semibold hover:underline"
              >+ Add Service Plot</button>
            </div>

            {/* Payment Options */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">Payment Options (one per line)</label>
              <textarea
                name="payment_options" value={form.payment_options} onChange={handleChange}
                rows={4} placeholder={"Outright Full Payment (5% discount)\nDown Payment: 40%\nInstallmental: 50%, 30% & 20% within 1 year\nRegistration Fee: ₦10,000"}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y text-sm"
              />
            </div>

            {/* Bank Details (Dynamic Rows) */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 block">Bank Details</label>
              {bankDetails.map((bd, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
                  <input
                    placeholder="Bank Name"
                    value={bd.bank} onChange={(e) => { const n = [...bankDetails]; n[idx].bank = e.target.value; setBankDetails(n); }}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                  <input
                    placeholder="Account Name"
                    value={bd.account_name} onChange={(e) => { const n = [...bankDetails]; n[idx].account_name = e.target.value; setBankDetails(n); }}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 col-span-1 sm:col-span-2"
                  />
                  <div className="flex gap-2">
                    <input
                      placeholder="Account No"
                      value={bd.account_no} onChange={(e) => { const n = [...bankDetails]; n[idx].account_no = e.target.value; setBankDetails(n); }}
                      className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                    {bankDetails.length > 1 && (
                      <button type="button" onClick={() => setBankDetails(bankDetails.filter((_, i) => i !== idx))}
                        className="px-2 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm"
                      >✕</button>
                    )}
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => setBankDetails([...bankDetails, { bank: "", account_name: "", account_no: "" }])}
                className="text-sm text-accent font-semibold hover:underline"
              >+ Add Bank Account</button>
            </div>

            {/* Facilities Checkboxes */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 block">Standard Facilities</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  "Water (Bore Holes)",
                  "Electricity (PHCN)",
                  "Access Road / Police Post",
                  "Clinic / School",
                  "Religious Centres",
                  "Corner Shops / Malls",
                  "Sport Facilities",
                  "Administrative Office",
                  "Gas Station",
                  "ATM Galaxy",
                  "Estate Transports",
                ].map((facility) => (
                  <label key={facility} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.facilities.includes(facility)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm(prev => ({ ...prev, facilities: [...prev.facilities, facility] }));
                        } else {
                          setForm(prev => ({ ...prev, facilities: prev.facilities.filter(f => f !== facility) }));
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
                    />
                    {facility}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
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
