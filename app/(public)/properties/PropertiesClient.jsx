"use client";

import { useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import { HiSearch } from "react-icons/hi";

export default function PropertiesClient({ properties }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filterOptions = ["All", "Buy & Build", "Move-In Ready", "Investment / Residential"];

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === "All" || property.property_type === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <main className="min-h-screen bg-primary pt-32 pb-24 selection:bg-accent selection:text-white">
      
      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-accent text-sm font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
          <span className="w-8 h-px bg-accent"></span>
          Our Portfolio
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-8">
          Discover Exceptional <br /> Properties
        </h1>
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 backdrop-blur-md p-4 rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.2)] border border-white/10">
          
          {/* Search Input */}
          <div className="relative w-full md:max-w-md flex items-center">
            <HiSearch className="absolute left-4 text-gray-400 text-xl" />
            <input 
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/20 border-none outline-none rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:ring-2 focus:ring-accent transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex bg-black/20 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto hide-scrollbar">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => setActiveFilter(option)}
                className={`flex-shrink-0 px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all duration-300 ${
                  activeFilter === option 
                    ? "bg-accent text-white shadow-md transform scale-[1.02]" 
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Properties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
            <div className="text-6xl mb-4 text-white/20">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No properties found</h3>
            <p className="text-white/60">We couldn&apos;t find anything matching your search criteria.</p>
            <button 
              onClick={() => { setSearchTerm(""); setActiveFilter("All"); }}
              className="mt-6 text-accent font-bold hover:text-white transition-colors hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

    </main>
  );
}
