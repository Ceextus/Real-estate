"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  HiOutlineOfficeBuilding,
  HiOutlineUsers,
  HiOutlinePhotograph,
  HiOutlineChatAlt2,
  HiOutlineCalendar,
  HiOutlineCog,
} from "react-icons/hi";
import { BsArrowUpRight } from "react-icons/bs";
import { createClient } from "@/utils/supabase/client";
import { EASE } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";

const quickActions = [
  { title: "Add property", note: "List a new home", href: "/admin/properties", icon: HiOutlineOfficeBuilding },
  { title: "Upload media", note: "Manage gallery images", href: "/admin/gallery", icon: HiOutlinePhotograph },
  { title: "Manage team", note: "Add or edit members", href: "/admin/team", icon: HiOutlineUsers },
  { title: "Inspections", note: "Review tour requests", href: "/admin/inspections", icon: HiOutlineCalendar },
  { title: "Messages", note: "Reply to enquiries", href: "/admin/messages", icon: HiOutlineChatAlt2 },
  { title: "Settings", note: "Contact details & socials", href: "/admin/settings", icon: HiOutlineCog },
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

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

// Blur-up entrance shared by every block on the dashboard.
function Block({ i = 0, className, children, as = "div" }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, delay: 0.05 + i * 0.07, ease: EASE }}
      className={className}
    >
      {children}
    </Tag>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createClient();

      const [
        { count: properties },
        { count: team },
        { count: gallery },
        { count: messages },
        { count: unreadMessages },
        { count: pendingInspections },
        { data: latestMessages },
        { data: latestInspections },
      ] = await Promise.all([
        supabase.from("properties").select("*", { count: "exact", head: true }),
        supabase.from("team_members").select("*", { count: "exact", head: true }),
        supabase.from("gallery").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*", { count: "exact", head: true }).eq("status", "unread"),
        supabase.from("inspections").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("messages").select("id, name, created_at, subject").order("created_at", { ascending: false }).limit(4),
        supabase.from("inspections").select("id, name, created_at, property_title").order("created_at", { ascending: false }).limit(4),
      ]);

      setStats({
        properties: properties || 0,
        team: team || 0,
        gallery: gallery || 0,
        messages: messages || 0,
        unreadMessages: unreadMessages || 0,
        pendingInspections: pendingInspections || 0,
      });

      const activities = [
        ...(latestMessages || []).map((m) => ({
          id: `msg-${m.id}`,
          type: "Message",
          href: "/admin/messages",
          title: `New message from ${m.name}`,
          subtitle: m.subject || "No subject",
          date: new Date(m.created_at),
        })),
        ...(latestInspections || []).map((i) => ({
          id: `insp-${i.id}`,
          type: "Inspection",
          href: "/admin/inspections",
          title: `Inspection request from ${i.name}`,
          subtitle: i.property_title,
          date: new Date(i.created_at),
        })),
      ].sort((a, b) => b.date - a.date);

      setRecentActivity(activities.slice(0, 6));
    };

    fetchDashboardData();
  }, []);

  const statCards = stats && [
    { name: "Properties", value: stats.properties, note: "Live listings", href: "/admin/properties", icon: HiOutlineOfficeBuilding },
    { name: "Messages", value: stats.messages, note: `${stats.unreadMessages} unread`, href: "/admin/messages", icon: HiOutlineChatAlt2, alert: stats.unreadMessages > 0 },
    { name: "Inspections", value: stats.pendingInspections, note: "Pending requests", href: "/admin/inspections", icon: HiOutlineCalendar, alert: stats.pendingInspections > 0 },
    { name: "Gallery", value: stats.gallery, note: "Media assets", href: "/admin/gallery", icon: HiOutlinePhotograph },
    { name: "Team", value: stats.team, note: "Team members", href: "/admin/team", icon: HiOutlineUsers },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-10 pb-12">
      {/* Header */}
      <Block className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            {new Date().toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 className="mt-4 font-display font-bold text-4xl sm:text-5xl leading-[1.02] tracking-tight text-primary">
            {greeting()}, <span className="text-accent">welcome back.</span>
          </h1>
          <p className="mt-3 text-sm text-ink-soft">
            Here&apos;s what&apos;s happening across Andreams Homes today.
          </p>
        </div>
        <Link
          href="/admin/properties"
          className="group inline-flex w-fit items-center gap-2 bg-primary px-5 py-3 text-sm text-white transition-colors hover:bg-primary-light"
        >
          Add property
          <BsArrowUpRight className="text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </Block>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-px border border-line bg-line">
        {statCards
          ? statCards.map((s, i) => (
              <Block key={s.name} i={i + 1} className="bg-white last:col-span-2 lg:last:col-span-1">
                <Link href={s.href} className="group flex h-full flex-col justify-between p-5 sm:p-6 transition-colors hover:bg-canvas">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-[0.16em] text-ink-soft">{s.name}</span>
                    <s.icon className="text-lg text-primary/40 transition-colors group-hover:text-accent" />
                  </div>
                  <p className="mt-8 text-4xl sm:text-5xl font-semibold tracking-tight text-primary tabular-nums">
                    <CountUp value={s.value} duration={1.2} delay={0.2 + i * 0.08} />
                  </p>
                  <p className={`mt-2 flex items-center gap-1.5 text-xs ${s.alert ? "text-accent" : "text-ink-soft"}`}>
                    {s.alert && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                    {s.note}
                  </p>
                </Link>
              </Block>
            ))
          : Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="h-44 animate-pulse bg-white" />
            ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent activity */}
        <Block i={6} className="xl:col-span-2 border border-line bg-white">
          <div className="flex items-center justify-between border-b border-line px-6 py-5">
            <h2 className="font-display font-bold text-2xl text-primary">Recent activity</h2>
            <Link href="/admin/messages" className="group inline-flex items-center gap-1.5 text-[13px] text-ink-soft transition-colors hover:text-primary">
              View all
              <BsArrowUpRight className="text-[11px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {!stats ? (
            <ul>
              {Array.from({ length: 4 }, (_, i) => (
                <li key={i} className="flex gap-4 border-b border-line px-6 py-5 last:border-0">
                  <span className="h-10 w-10 animate-pulse bg-canvas" />
                  <span className="flex-1 space-y-2">
                    <span className="block h-3 w-2/3 animate-pulse bg-canvas" />
                    <span className="block h-3 w-1/3 animate-pulse bg-canvas" />
                  </span>
                </li>
              ))}
            </ul>
          ) : recentActivity.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm text-primary">No recent activity found.</p>
              <p className="mt-1 text-[13px] text-ink-soft">New messages and inspections will appear here.</p>
            </div>
          ) : (
            <ul>
              {recentActivity.map((a, i) => (
                <motion.li
                  key={a.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: EASE }}
                  className="border-b border-line last:border-0"
                >
                  <Link href={a.href} className="group flex items-start gap-4 px-6 py-5 transition-colors hover:bg-canvas">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center ${a.type === "Message" ? "bg-accent/12 text-accent" : "bg-primary/8 text-primary"}`}>
                      {a.type === "Message" ? <HiOutlineChatAlt2 className="text-lg" /> : <HiOutlineCalendar className="text-lg" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <span className="text-sm font-medium text-primary">{a.title}</span>
                        <span className="text-[11px] tabular-nums text-ink-soft">{formatTimeAgo(a.date)}</span>
                      </span>
                      <span className="mt-1 block truncate text-[13px] text-ink-soft">
                        <span className="mr-2 text-[10px] uppercase tracking-[0.14em] text-primary/50">{a.type}</span>
                        {a.subtitle}
                      </span>
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          )}
        </Block>

        {/* Quick actions */}
        <Block i={7} className="h-max border border-line bg-white xl:sticky xl:top-28">
          <div className="border-b border-line px-6 py-5">
            <h2 className="font-display font-bold text-2xl text-primary">Quick actions</h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-px bg-line">
            {quickActions.map((q) => (
              <li key={q.title} className="bg-white">
                <Link href={q.href} className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-canvas">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line text-primary transition-colors duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                    <q.icon className="text-lg" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-primary">{q.title}</span>
                    <span className="block text-xs text-ink-soft">{q.note}</span>
                  </span>
                  <BsArrowUpRight className="text-[11px] text-ink-soft transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                </Link>
              </li>
            ))}
          </ul>
        </Block>
      </div>
    </div>
  );
}
