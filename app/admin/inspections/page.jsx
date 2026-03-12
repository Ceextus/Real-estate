"use client";

import { useState, useEffect } from "react";
import { BsSearch, BsCalendarEvent, BsCheckCircleFill, BsXCircleFill, BsTelephoneFill, BsTrash } from "react-icons/bs";
import { createClient } from "@/utils/supabase/client";

export default function AdminInspections() {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchInspections = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("inspections")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setInspections(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  const updateStatus = async (id, newStatus) => {
    const supabase = createClient();
    await supabase.from("inspections").update({ status: newStatus }).eq("id", id);
    fetchInspections();
  };

  const deleteInspection = async (id) => {
    const supabase = createClient();
    await supabase.from("inspections").delete().eq("id", id);
    fetchInspections();
  };

  const filteredInspections = inspections.filter((insp) => {
    const matchesTab = activeTab === "all" || insp.status === activeTab;
    const matchesSearch =
      insp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insp.property_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insp.phone.includes(searchTerm);
    return matchesTab && matchesSearch;
  });

  const statusColors = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const pendingCount = inspections.filter((i) => i.status === "pending").length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Inspection Bookings
          {pendingCount > 0 && (
            <span className="ml-3 text-sm bg-amber-500 text-white px-2.5 py-1 rounded-full align-middle">
              {pendingCount} pending
            </span>
          )}
        </h1>
        <p className="text-gray-500">Manage property tour requests from potential clients.</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, property, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {["all", "pending", "confirmed", "completed", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Inspections List */}
      {loading ? (
        <div className="py-16 text-center text-gray-400">Loading inspections...</div>
      ) : filteredInspections.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-2xl border border-gray-100">
          <BsCalendarEvent className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No inspection bookings found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInspections.map((insp) => (
            <div
              key={insp.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{insp.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[insp.status]}`}>
                      {insp.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium text-primary">{insp.property_title}</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <BsTelephoneFill className="text-xs" />
                      <a href={`tel:${insp.phone}`} className="hover:text-accent transition-colors">{insp.phone}</a>
                    </span>
                    {insp.preferred_date && (
                      <span className="flex items-center gap-1.5">
                        <BsCalendarEvent className="text-xs" />
                        {new Date(insp.preferred_date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    )}
                    <span className="text-gray-400 text-xs">
                      Submitted {new Date(insp.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {insp.status === "pending" && (
                    <button
                      onClick={() => updateStatus(insp.id, "confirmed")}
                      className="px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                    >
                      <BsCheckCircleFill /> Confirm
                    </button>
                  )}
                  {insp.status === "confirmed" && (
                    <button
                      onClick={() => updateStatus(insp.id, "completed")}
                      className="px-4 py-2 bg-green-50 text-green-600 text-xs font-bold rounded-xl hover:bg-green-100 transition-colors flex items-center gap-1.5"
                    >
                      <BsCheckCircleFill /> Complete
                    </button>
                  )}
                  {(insp.status === "pending" || insp.status === "confirmed") && (
                    <button
                      onClick={() => updateStatus(insp.id, "cancelled")}
                      className="px-4 py-2 bg-gray-50 text-gray-500 text-xs font-bold rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors flex items-center gap-1.5"
                    >
                      <BsXCircleFill /> Cancel
                    </button>
                  )}
                  <button
                    onClick={() => deleteInspection(insp.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete"
                  >
                    <BsTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
