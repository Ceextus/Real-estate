"use client";

import { useState, useEffect } from "react";
import { BsSearch, BsEnvelopeFill, BsCheckCircleFill, BsArchiveFill, BsTrash, BsArrowLeft } from "react-icons/bs";
import { createClient } from "@/utils/supabase/client";
import LogoLoader from "@/components/LogoLoader";
import { useToast } from "@/components/Toast";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setMessages(data);
      setLoading(false);
    };
    load();
  }, []);

  const fetchMessages = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setMessages(data);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("messages").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
      if (newStatus === "archived") toast.success("Message archived");
      fetchMessages();
    } catch (err) {
      toast.error(`Failed to update status: ${err.message}`);
    }
  };

  const deleteMessage = async (id) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw error;
      
      toast.success("Message deleted successfully!");
      if (selectedMessage === id) setSelectedMessage(null);
      fetchMessages();
    } catch (err) {
      toast.error(`Failed to delete message: ${err.message}`);
    }
  };

  const handleSelectMessage = async (msg) => {
    setSelectedMessage(msg.id);
    // Auto-mark as read when opened
    if (msg.status === "unread") {
      updateStatus(msg.id, "read");
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesTab = activeTab === "all" || msg.status === activeTab;
    const matchesSearch = msg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (msg.subject || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const unreadCount = messages.filter(m => m.status === "unread").length;
  const currentMsg = messages.find(m => m.id === selectedMessage);

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-120px)] animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      
      {/* Left Column: Inbox List */}
      <div className={`w-full lg:w-1/3 flex-col gap-6 ${selectedMessage ? "hidden lg:flex" : "flex"}`}>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Messages
            {unreadCount > 0 && (
              <span className="ml-3 text-sm bg-accent text-white px-2.5 py-1 rounded-full align-middle">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-gray-500 text-sm">Manage inquiries from the Contact page.</p>
        </div>

        {/* Search */}
        <div className="relative w-full">
          <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white shadow-sm border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors text-sm"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {["all", "unread", "read", "archived"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab 
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto space-y-3 hide-scrollbar pb-10">
          {loading ? (
            <LogoLoader />
          ) : (
            filteredMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => handleSelectMessage(msg)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedMessage === msg.id
                    ? "bg-primary text-white border-primary shadow-md transform scale-[1.02]"
                    : `bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm ${msg.status === "unread" ? "border-l-4 border-l-accent" : ""}`
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`font-bold truncate pr-3 ${selectedMessage === msg.id ? "text-white" : "text-gray-900"}`}>
                    {msg.name}
                  </span>
                  <span className={`text-[10px] font-bold uppercase whitespace-nowrap px-2 py-0.5 rounded-full ${
                    msg.status === "unread" 
                      ? selectedMessage === msg.id ? "bg-white/20 text-white" : "bg-accent/10 text-accent"
                      : selectedMessage === msg.id ? "bg-white/10 text-white/70" : "bg-gray-100 text-gray-500"
                  }`}>
                    {msg.status}
                  </span>
                </div>
                <p className={`text-sm font-medium truncate mb-1 ${selectedMessage === msg.id ? "text-white/90" : "text-gray-700"}`}>
                  {msg.subject || "No subject"}
                </p>
                <p className={`text-xs truncate ${selectedMessage === msg.id ? "text-white/60" : "text-gray-500"}`}>
                  {msg.message}
                </p>
              </button>
            ))
          )}

          {!loading && filteredMessages.length === 0 && (
            <div className="p-8 text-center bg-gray-50 border border-gray-100 rounded-2xl border-dashed">
              <BsEnvelopeFill className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm font-medium">No messages found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Message Detail View */}
      <div className={`flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex-col h-[700px] lg:h-auto ${selectedMessage ? "flex" : "hidden lg:flex"}`}>
        {currentMsg ? (
          <>
            {/* Detail Header */}
            <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
              
              {/* Mobile Back Button */}
              <button 
                onClick={() => setSelectedMessage(null)}
                className="lg:hidden mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium text-sm transition-colors"
              >
                <BsArrowLeft className="text-lg" />
                Back to Inbox
              </button>

              <div className="flex justify-between items-start mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight pr-8">{currentMsg.subject || "No subject"}</h2>
                <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                  {currentMsg.status !== "archived" && (
                    <button 
                      onClick={() => updateStatus(currentMsg.id, "archived")}
                      className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-amber-500 hover:border-amber-400 hover:bg-amber-50 transition-all shadow-sm" 
                      title="Archive"
                    >
                      <BsArchiveFill />
                    </button>
                  )}
                  {currentMsg.status === "read" && (
                    <button 
                      onClick={() => updateStatus(currentMsg.id, "unread")}
                      className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all shadow-sm" 
                      title="Mark as Unread"
                    >
                      <BsCheckCircleFill />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteMessage(currentMsg.id)}
                    className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-all shadow-sm" 
                    title="Delete"
                  >
                    <BsTrash />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shadow-inner">
                  {currentMsg.name.charAt(0)}
                </div>
                <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4">
                  <div>
                    <p className="font-bold text-gray-900">{currentMsg.name}</p>
                    <p className="text-sm text-gray-500">&lt;{currentMsg.email}&gt;{currentMsg.phone ? ` • ${currentMsg.phone}` : ""}</p>
                  </div>
                  <span className="text-xs font-semibold text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm w-fit">
                    {new Date(currentMsg.created_at).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Detail Body */}
            <div className="p-6 md:p-8 flex-1 overflow-y-auto bg-white">
              {currentMsg.interest && (
                <div className="mb-4 inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full uppercase tracking-wider">
                  {currentMsg.interest === "buy" ? "Buying" : currentMsg.interest === "build" ? "Building" : currentMsg.interest === "invest" ? "Investment" : "Consultation"}
                </div>
              )}
              <div className="prose max-w-none text-gray-700 leading-relaxed text-[15px] whitespace-pre-wrap">
                {currentMsg.message}
              </div>
            </div>

            {/* Quick action footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
              <a 
                href={`mailto:${currentMsg.email}?subject=Re: ${currentMsg.subject || "Your Inquiry"}`}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-md"
              >
                Reply via Email
              </a>
              {currentMsg.phone && (
                <a 
                  href={`tel:${currentMsg.phone}`}
                  className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-bold border border-gray-200 flex items-center gap-2 transition-all"
                >
                  Call Back
                </a>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
            <div className="w-24 h-24 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center mb-6">
              <BsEnvelopeFill className="text-4xl text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Message Selected</h2>
            <p className="text-gray-500 max-w-sm">Select a message from the list on the left to read its contents and reply.</p>
          </div>
        )}
      </div>

    </div>
  );
}
