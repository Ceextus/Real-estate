"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BsSave, BsImage, BsPalette, BsGlobe, BsTelephoneFill, BsCloudUpload, BsXCircleFill, BsTrash } from "react-icons/bs";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState("");

  // Settings state broken into sections
  const [general, setGeneral] = useState({
    headline: "",
    subheadline: "",
    about_text: "",
  });

  const [contact, setContact] = useState({
    phone1: "",
    phone2: "",
    email_support: "",
    email_inquiry: "",
    address: "",
    map_embed: "",
    socials: { facebook: "", twitter: "", instagram: "", linkedin: "" },
  });

  const [theme, setTheme] = useState({
    primary_color: "#1D4734",
    accent_color: "#E09B6B",
  });

  const [media, setMedia] = useState({
    hero_images: [],
  });

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (data) {
        if (data.general) setGeneral(data.general);
        if (data.contact) setContact(data.contact);
        if (data.theme) setTheme(data.theme);
        if (data.media) setMedia(data.media);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage("");

    const supabase = createClient();
    const { error } = await supabase
      .from("site_settings")
      .update({
        general,
        contact,
        theme,
        media,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    setIsSaving(false);

    if (error) {
      setSaveMessage(`Error: ${error.message}`);
    } else {
      setSaveMessage("Settings saved successfully!");
      router.refresh();
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const handleGeneralChange = (field, value) => {
    setGeneral((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (field, value) => {
    // Auto-extract src URL if user pastes a full <iframe> tag into map_embed
    if (field === "map_embed" && value.includes("<iframe")) {
      const match = value.match(/src="([^"]+)"/);
      if (match) value = match[1];
    }
    setContact((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (platform, value) => {
    setContact((prev) => ({
      ...prev,
      socials: { ...prev.socials, [platform]: value },
    }));
  };

  const handleThemeChange = (field, value) => {
    setTheme((prev) => ({ ...prev, [field]: value }));
  };

  // Hero image upload
  const handleHeroUpload = async (file) => {
    if (!file) return;
    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `hero/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("property-images")
      .upload(filePath, file);

    if (uploadError) {
      setSaveMessage(`Upload failed: ${uploadError.message}`);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("property-images")
      .getPublicUrl(filePath);

    setMedia((prev) => ({
      ...prev,
      hero_images: [...(prev.hero_images || []), urlData.publicUrl],
    }));
  };

  const removeHeroImage = async (index) => {
    const url = media.hero_images[index];
    const supabase = createClient();

    // Delete from storage if it's our bucket
    const bucketUrl = process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/property-images/";
    if (url.startsWith(bucketUrl)) {
      const filePath = url.replace(bucketUrl, "");
      await supabase.storage.from("property-images").remove([filePath]);
    }

    setMedia((prev) => ({
      ...prev,
      hero_images: prev.hero_images.filter((_, i) => i !== index),
    }));
  };

  const tabs = [
    { id: "general", label: "General Content", icon: BsGlobe },
    { id: "contact", label: "Contact Info", icon: BsTelephoneFill },
    { id: "theme", label: "Theme & Branding", icon: BsPalette },
    { id: "media", label: "Hero Media", icon: BsImage },
  ];

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center text-gray-400">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Website Settings</h1>
          <p className="text-gray-500">Manage all public-facing content and information instantly.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <BsSave className="text-lg" />
                Save All Changes
              </>
            )}
          </button>
          {saveMessage && (
            <p className={`text-sm font-medium ${saveMessage.startsWith("Error") ? "text-red-500" : "text-green-600"}`}>
              {saveMessage}
            </p>
          )}
        </div>
      </div>

      {/* Settings Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Sidebar Tabs */}
        <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100 p-4 md:p-6 flex flex-row md:flex-col gap-2 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap md:whitespace-normal text-left ${
                activeTab === tab.id
                  ? "bg-white text-primary shadow-sm ring-1 ring-gray-100"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              <tab.icon className={`text-lg ${activeTab === tab.id ? "text-accent" : "text-gray-400"}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-6 md:p-10">
          
          {/* GENERAL CONTENT TAB */}
          {activeTab === "general" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">Hero Section</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Main Headline</label>
                    <input 
                      type="text" 
                      value={general.headline}
                      onChange={(e) => handleGeneralChange("headline", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subheadline / Tagline</label>
                    <textarea 
                      rows={2}
                      value={general.subheadline}
                      onChange={(e) => handleGeneralChange("subheadline", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">About Us Snippet</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Company Vision Text</label>
                    <textarea 
                      rows={5}
                      value={general.about_text}
                      onChange={(e) => handleGeneralChange("about_text", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTACT INFO TAB */}
          {activeTab === "contact" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">Contact Details</h2>
                <p className="text-sm text-gray-500 mb-6">These details will be updated in the Footer and Contact page.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Company Phone 1</label>
                    <input 
                      type="text" 
                      value={contact.phone1}
                      onChange={(e) => handleContactChange("phone1", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Company Phone 2 (Optional)</label>
                    <input 
                      type="text" 
                      value={contact.phone2}
                      onChange={(e) => handleContactChange("phone2", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Support Email</label>
                    <input 
                      type="email" 
                      value={contact.email_support}
                      onChange={(e) => handleContactChange("email_support", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Inquiry Email</label>
                    <input 
                      type="email" 
                      value={contact.email_inquiry}
                      onChange={(e) => handleContactChange("email_inquiry", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Head Office Address</label>
                    <textarea 
                      rows={3}
                      value={contact.address}
                      onChange={(e) => handleContactChange("address", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors resize-none"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Google Maps Embed URL</label>
                    <p className="text-xs text-gray-400 mb-2">Go to Google Maps → find your location → click Share → Embed a map → copy the <code className="bg-gray-100 px-1 rounded">src</code> URL from the iframe code.</p>
                    <input 
                      type="url" 
                      value={contact.map_embed || ""}
                      onChange={(e) => handleContactChange("map_embed", e.target.value)}
                      placeholder="https://www.google.com/maps/embed?pb=..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">Social Links</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: "facebook", label: "Facebook" },
                    { key: "twitter", label: "Twitter (X)" },
                    { key: "instagram", label: "Instagram" },
                    { key: "linkedin", label: "LinkedIn" },
                  ].map((social) => (
                    <div key={social.key}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{social.label} URL</label>
                      <input 
                        type="url" 
                        value={contact.socials?.[social.key] || ""}
                        onChange={(e) => handleSocialChange(social.key, e.target.value)}
                        placeholder="https://"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* THEME & BRANDING TAB */}
          {activeTab === "theme" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">Brand Colors</h2>
                <p className="text-sm text-gray-500 mb-6">Change the global color palette of the website.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  
                  {/* Primary Color Picker */}
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                    <label className="block text-sm font-bold text-gray-800 mb-4">Primary Brand Color</label>
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-16 h-16 rounded-full shadow-inner ring-4 ring-white border border-gray-100" 
                        style={{ backgroundColor: theme.primary_color }}
                      />
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase mb-1">HEX</p>
                        <input 
                          type="text" 
                          value={theme.primary_color}
                          onChange={(e) => handleThemeChange("primary_color", e.target.value)}
                          className="w-full font-mono text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Accent Color Picker */}
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                    <label className="block text-sm font-bold text-gray-800 mb-4">Accent/Highlight Color</label>
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-16 h-16 rounded-full shadow-inner ring-4 ring-white border border-gray-100" 
                        style={{ backgroundColor: theme.accent_color }}
                      />
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase mb-1">HEX</p>
                        <input 
                          type="text" 
                          value={theme.accent_color}
                          onChange={(e) => handleThemeChange("accent_color", e.target.value)}
                          className="w-full font-mono text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none" 
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* HERO MEDIA TAB */}
          {activeTab === "media" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">Home Hero Images</h2>
                <p className="text-sm text-gray-500 mb-6">Manage the background images sliding on the homepage.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {(media.hero_images || []).map((url, index) => (
                    <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden group relative">
                      <div className="h-40 bg-gray-100 relative">
                        <Image src={url} alt={`Slide ${index + 1}`} fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                          <label className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-100 cursor-pointer">
                            Replace
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                // Upload new, then replace in array
                                const supabase = createClient();
                                const fileExt = file.name.split(".").pop();
                                const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
                                const filePath = `hero/${fileName}`;
                                const { error: uploadError } = await supabase.storage.from("property-images").upload(filePath, file);
                                if (uploadError) return;
                                const { data: urlData } = supabase.storage.from("property-images").getPublicUrl(filePath);
                                setMedia(prev => {
                                  const updated = [...prev.hero_images];
                                  updated[index] = urlData.publicUrl;
                                  return { ...prev, hero_images: updated };
                                });
                              }}
                            />
                          </label>
                          <button 
                            onClick={() => removeHeroImage(index)}
                            className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="p-4 bg-white">
                        <p className="text-sm font-bold text-gray-800">Slide Image {index + 1}</p>
                        <p className="text-xs text-gray-500 mt-1">1920x1080px recommended</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add New Slide */}
                  <label className="border-2 border-dashed border-gray-300 rounded-2xl h-full flex flex-col items-center justify-center min-h-[220px] hover:border-accent hover:bg-accent/5 transition-colors group cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-accent/10 flex items-center justify-center mb-3">
                      <span className="text-2xl text-gray-400 group-hover:text-accent">+</span>
                    </div>
                    <span className="text-sm font-bold text-gray-600 group-hover:text-accent">Add New Image</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleHeroUpload(e.target.files?.[0])}
                    />
                  </label>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
