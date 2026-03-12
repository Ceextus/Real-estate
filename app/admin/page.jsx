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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome to the Andream Homes administration portal.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat) => (
              <div key={stat.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col pt-8 relative overflow-hidden group hover:shadow-md transition-shadow">
                
                <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`} />
                
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl text-white ${stat.color} flex items-center justify-center shadow-sm`}>
                    <stat.icon className="text-2xl" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.name}</h3>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-400 font-medium">{stat.trend}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity / Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              {recentActivity.length === 0 ? (
                <p className="text-gray-500 py-4 text-sm">No recent activity found.</p>
              ) : (
                <div className="space-y-6">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-4">
                      <div className={`w-2 h-2 mt-2 rounded-full ${activity.type === 'message' ? 'bg-accent' : 'bg-primary'}`} />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                        <p className="text-xs text-gray-500 leading-relaxed mt-1">{activity.subtitle}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(activity.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/admin/messages" className="block text-center w-full mt-6 py-3 text-sm font-medium text-primary hover:bg-gray-50 rounded-xl transition-colors">
                View all activity
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/admin/properties" className="p-4 border border-gray-100 rounded-xl hover:border-primary hover:shadow-sm flex flex-col items-center justify-center gap-2 group transition-all">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <BsBuildings />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Add Property</span>
                </Link>
                <Link href="/admin/gallery" className="p-4 border border-gray-100 rounded-xl hover:border-accent hover:shadow-sm flex flex-col items-center justify-center gap-2 group transition-all">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <BsImages />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Upload Media</span>
                </Link>
                <Link href="/admin/team" className="p-4 border border-gray-100 rounded-xl hover:border-gray-800 hover:shadow-sm flex flex-col items-center justify-center gap-2 group transition-all">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 group-hover:bg-gray-800 group-hover:text-white transition-colors">
                    <BsPeopleFill />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Add Member</span>
                </Link>
                <Link href="/admin/inspections" className="p-4 border border-gray-100 rounded-xl hover:border-green-500 hover:shadow-sm flex flex-col items-center justify-center gap-2 group transition-all">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                    <BsEnvelopePaperHeart />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Inspections</span>
                </Link>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
