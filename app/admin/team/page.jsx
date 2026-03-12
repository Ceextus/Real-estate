"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BsPlusLg, BsSearch, BsPencilSquare, BsTrash, BsCloudUpload, BsXCircleFill } from "react-icons/bs";
import Image from "next/image";
import AdminModal from "@/components/admin/AdminModal";
import { createClient } from "@/utils/supabase/client";

export default function AdminTeam() {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("team_members")
        .select("*")
        .order("sort_order", { ascending: true });
      if (data) setMembers(data);
      setLoading(false);
    };
    load();
  }, []);

  const fetchMembers = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("team_members")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setMembers(data);
  };

  const openEditModal = (member) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (member) => {
    setSelectedMember(member);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedMember) return;
    const supabase = createClient();
    await supabase.from("team_members").delete().eq("id", selectedMember.id);
    setIsDeleteModalOpen(false);
    setSelectedMember(null);
    fetchMembers();
    router.refresh();
  };

  const handleFormSuccess = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedMember(null);
    fetchMembers();
    router.refresh();
  };

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Members</h1>
          <p className="text-gray-500">Manage the &apos;Meet the Minds&apos; section on the About page.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
        >
          <BsPlusLg strokeWidth={1} />
          Add Team Member
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors text-sm"
          />
        </div>
      </div>

      {/* Team Grid */}
      {loading ? (
        <div className="py-16 text-center text-gray-400">Loading team members...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow relative">
              
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  member.status === "Active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {member.status}
                </span>
              </div>

              <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-gray-50 group-hover:border-accent/20 transition-colors">
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  fill 
                  className="object-cover" 
                />
              </div>
              
              <h3 className="font-bold text-gray-900 text-lg mb-1">{member.name}</h3>
              <p className="text-accent font-medium text-sm mb-2">{member.role}</p>
              {member.email && <p className="text-gray-500 text-sm mb-6">{member.email}</p>}

              <div className="flex w-full gap-2 mt-auto pt-6 border-t border-gray-100">
                <button 
                  onClick={() => openEditModal(member)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <BsPencilSquare /> Edit
                </button>
                <div className="w-px bg-gray-100 my-2" />
                <button 
                  onClick={() => openDeleteModal(member)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <BsTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredMembers.length === 0 && (
        <div className="py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
          No team members found.
        </div>
      )}

      {/* MODALS */}

      <AdminModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add Team Member"
      >
        <TeamForm onSuccess={handleFormSuccess} onClose={() => setIsAddModalOpen(false)} />
      </AdminModal>

      <AdminModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Edit Team Member"
      >
        {selectedMember && <TeamForm member={selectedMember} onSuccess={handleFormSuccess} onClose={() => setIsEditModalOpen(false)} />}
      </AdminModal>

      <AdminModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Delete Team Member"
      >
        {selectedMember && (
          <div className="space-y-6">
            <p className="text-gray-600">
              Are you sure you want to permanently remove <strong className="text-gray-900">&quot;{selectedMember.name}&quot;</strong> from the team? This action cannot be undone.
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
                Remove Member
              </button>
            </div>
          </div>
        )}
      </AdminModal>

    </div>
  );
}

// Team Form with image upload
function TeamForm({ member = null, onSuccess, onClose }) {
  const isEditing = !!member;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(member?.image || null);

  const [form, setForm] = useState({
    name: member?.name || "",
    role: member?.role || "",
    email: member?.email || "",
    status: member?.status || "Active",
    bio: member?.bio?.join("\n") || "",
    sort_order: member?.sort_order || 0,
  });

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
    setImagePreview(isEditing ? member?.image : null);
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const supabase = createClient();
    let imageUrl = member?.image || "";

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `team/${fileName}`;

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
    } else if (!isEditing && !imagePreview) {
      setError("Please upload a photo.");
      setSaving(false);
      return;
    }

    const payload = {
      name: form.name,
      role: form.role,
      email: form.email || null,
      image: imageUrl,
      status: form.status,
      bio: form.bio.split("\n").filter(b => b.trim() !== ""),
      sort_order: parseInt(form.sort_order) || 0,
    };

    let result;
    if (isEditing) {
      result = await supabase.from("team_members").update(payload).eq("id", member.id);
    } else {
      result = await supabase.from("team_members").insert(payload);
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

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 block">Profile Photo <span className="text-gray-400 font-normal">(max 10MB)</span></label>
        {imagePreview ? (
          <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border border-gray-200 bg-gray-50">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            <button type="button" onClick={clearImage}
              className="absolute top-1 right-1 bg-white rounded-full shadow-md p-1 hover:bg-red-50 transition-colors">
              <BsXCircleFill className="text-red-500 text-sm" />
            </button>
          </div>
        ) : (
          <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("team-image-upload").click()}
            className="w-full py-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:border-accent/50 hover:bg-accent/5 transition-colors cursor-pointer flex flex-col items-center gap-2">
            <BsCloudUpload className="text-3xl text-gray-400" />
            <p className="text-sm text-gray-500 font-medium">Click or drag & drop to upload</p>
            <p className="text-xs text-gray-400">JPG, PNG, WebP — max 10MB</p>
          </div>
        )}
        <input id="team-image-upload" type="file" accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden" onChange={(e) => handleImageSelect(e.target.files?.[0])} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 block">Full Name</label>
        <input type="text" name="name" value={form.name} onChange={handleChange}
          placeholder="e.g. John Doe" required
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">Role / Title</label>
          <input type="text" name="role" value={form.role} onChange={handleChange}
            placeholder="e.g. Senior Architect" required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">Status</label>
          <select name="status" value={form.status} onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-gray-700">
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">Email <span className="text-gray-400 font-normal">(optional)</span></label>
          <input type="email" name="email" value={form.email} onChange={handleChange}
            placeholder="e.g. john@andreamhomes.com"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">Display Order</label>
          <input type="number" name="sort_order" value={form.sort_order} onChange={handleChange}
            placeholder="0"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 block">Bio <span className="text-gray-400 font-normal">(one paragraph per line)</span></label>
        <textarea name="bio" value={form.bio} onChange={handleChange}
          rows={4} placeholder="A visionary leader with over two decades of experience..."
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
        <button type="button" onClick={onClose}
          className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={saving}
          className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-70">
          {saving ? "Saving..." : isEditing ? "Save Changes" : "Save Member"}
        </button>
      </div>
      
    </form>
  );
}
