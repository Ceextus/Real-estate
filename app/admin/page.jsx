"use client";

import { useState, useEffect } from "react";
import { 
  BsBuildings, 
  BsPeopleFill, 
  BsImages, 
  BsEnvelopePaperHeart 
} from "react-icons/bs";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import LogoLoader from "@/components/LogoLoader";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    properties: 0,
    team: 0,
    gallery: 0,
    messages: 0,
    unreadMessages: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createClient();

      // Fetch counts in parallel
      const [
        { count: propertiesCount },
        { count: teamCount },
        { count: galleryCount },
        { count: messagesCount },
        { count: unreadCount },
      ] = await Promise.all([
        supabase.from("properties").select("*", { count: "exact", head: true }),
        supabase.from("team_members").select("*", { count: "exact", head: true }),
        supabase.from("gallery").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*", { count: "exact", head: true }).eq("status", "unread"),
      ]);

      setStats({
        properties: propertiesCount || 0,
        team: teamCount || 0,
        gallery: galleryCount || 0,
        messages: messagesCount || 0,
        unreadMessages: unreadCount || 0,
      });

      // Fetch recent activity (latest messages + latest inspections)
      const { data: latestMessages } = await supabase
        .from("messages")
        .select("id, name, created_at, subject")
        .order("created_at", { ascending: false })
        .limit(3);

      const { data: latestInspections } = await supabase
        .from("inspections")
        .select("id, name, created_at, property_title")
        .order("created_at", { ascending: false })
        .limit(3);

      // Combine and sort
      const activities = [];
      if (latestMessages) {
        activities.push(...latestMessages.map(m => ({
          id: `msg-${m.id}`,
          type: "message",
          title: `New message from ${m.name}`,
          subtitle: `Subject: ${m.subject || "No subject"}`,
          date: new Date(m.created_at),
        })));
      }
      if (latestInspections) {
        activities.push(...latestInspections.map(i => ({
          id: `insp-${i.id}`,
          type: "inspection",
          title: `Inspection request from ${i.name}`,
          subtitle: `For: ${i.property_title}`,
          date: new Date(i.created_at),
        })));
      }

      activities.sort((a, b) => b.date - a.date);
      setRecentActivity(activities.slice(0, 5));
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { name: "Total Properties", value: stats.properties, icon: BsBuildings, color: "bg-blue-500", trend: "Live assets" },
    { name: "Team Members", value: stats.team, icon: BsPeopleFill, color: "bg-primary", trend: "Active staff" },
    { name: "Gallery Images", value: stats.gallery, icon: BsImages, color: "bg-purple-500", trend: "Media assets" },
    { name: "Total Messages", value: stats.messages, icon: BsEnvelopePaperHeart, color: "bg-accent", trend: `${stats.unreadMessages} unread` },
  ];

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Live System Status
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-2 font-medium">Welcome back to the Andream Homes administration portal.</p>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <LogoLoader />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, i) => (
              <div 
                key={stat.name} 
                className="bg-white rounded-[2rem] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Decorative Background Blob */}
                <div className={`absolute -right-6 -top-6 w-32 h-32 ${stat.color} opacity-[0.03] rounded-full blur-2xl group-hover:opacity-[0.08] transition-opacity duration-500`} />
                <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-[0.02] rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-125`} />
                
                <div className="relative z-10 flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-2xl text-white ${stat.color} flex items-center justify-center shadow-lg shadow-${stat.color.split('-')[1]}-500/30 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="text-2xl" />
                  </div>
                </div>
                
                <div className="relative z-10">
                  <p className="text-4xl font-extrabold text-gray-900 mb-1 tracking-tight">{stat.value}</p>
                  <h3 className="text-gray-500 text-sm font-semibold mb-2">{stat.name}</h3>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-500 font-medium">{stat.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Recent Activity Feed */}
            <div className="xl:col-span-2 bg-white rounded-[2rem] p-7 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <Link href="/admin/messages" className="text-sm font-medium text-primary hover:text-accent transition-colors">
                  View full history &rarr;
                </Link>
              </div>

              {recentActivity.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <BsEnvelopePaperHeart className="text-2xl text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">No recent activity found.</p>
                  <p className="text-sm text-gray-400 mt-1">New messages and inspections will appear here.</p>
                </div>
              ) : (
                <div className="space-y-6 relative">
                  {/* Vertical timeline line */}
                  <div className="absolute left-[21px] top-6 bottom-4 w-px bg-gray-100 hidden sm:block" />

                  {recentActivity.map((activity, index) => (
                    <div key={activity.id} className="relative flex gap-5 sm:gap-6 group">
                      
                      {/* Timeline Icon */}
                      <div className={`relative z-10 w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center shadow-sm shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                        activity.type === 'message' 
                          ? 'bg-accent/10 text-accent border border-accent/20' 
                          : 'bg-primary/10 text-primary border border-primary/20'
                      }`}>
                        {activity.type === 'message' ? <BsEnvelopePaperHeart className="text-lg" /> : <BsBuildings className="text-lg" />}
                      </div>

                      {/* Content Card */}
                      <div className="flex-1 bg-gray-50/50 group-hover:bg-white border border-transparent group-hover:border-gray-100 rounded-2xl p-4 sm:p-5 transition-all duration-300 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                          <p className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors">{activity.title}</p>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-gray-200 text-gray-500 whitespace-nowrap shadow-sm">
                            {formatTimeAgo(activity.date)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">{activity.subtitle}</p>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white rounded-[2rem] p-7 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 h-max sticky top-28">
              <h2 className="text-xl font-bold text-gray-900 mb-8">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
                
                <Link href="/admin/properties" className="group p-5 rounded-2xl border border-gray-100 hover:border-primary/30 bg-white hover:bg-primary/5 transition-all duration-300 flex items-center gap-4 hover:shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-inner">
                    <BsBuildings className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">Add Property</h3>
                    <p className="text-xs text-gray-500 mt-0.5">List a new home</p>
                  </div>
                </Link>

                <Link href="/admin/gallery" className="group p-5 rounded-2xl border border-gray-100 hover:border-accent/30 bg-white hover:bg-accent/5 transition-all duration-300 flex items-center gap-4 hover:shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-300 shadow-inner">
                    <BsImages className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-accent transition-colors">Upload Media</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Manage gallery images</p>
                  </div>
                </Link>

                <Link href="/admin/team" className="group p-5 rounded-2xl border border-gray-100 hover:border-gray-900/30 bg-white hover:bg-gray-50 transition-all duration-300 flex items-center gap-4 hover:shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 group-hover:bg-gray-800 group-hover:text-white transition-colors duration-300 shadow-inner">
                    <BsPeopleFill className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-gray-800 transition-colors">Manage Team</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Add or edit agents</p>
                  </div>
                </Link>

                <Link href="/admin/inspections" className="group p-5 rounded-2xl border border-gray-100 hover:border-green-500/30 bg-white hover:bg-green-50/50 transition-all duration-300 flex items-center gap-4 hover:shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300 shadow-inner">
                    <BsEnvelopePaperHeart className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">Inspections</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Review tour requests</p>
                  </div>
                </Link>

              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
