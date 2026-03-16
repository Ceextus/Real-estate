"use client";

import { useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import { HiSearch, HiChevronLeft, HiChevronRight } from "react-icons/hi";

const ITEMS_PER_PAGE = 9;

export default function PropertiesClient({ properties }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filterOptions = ["All", "Buy & Build", "Move-In Ready", "Investment / Residential"];

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === "All" || property.property_type === activeFilter;

    return matchesSearch && matchesFilter;
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Calculate pagination
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to first page when search or filter changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (option) => {
    setActiveFilter(option);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
              onChange={handleSearchChange}
              className="w-full bg-black/20 border-none outline-none rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:ring-2 focus:ring-accent transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex bg-black/20 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto hide-scrollbar">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleFilterChange(option)}
                className={`shrink-0 px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all duration-300 ${
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16">
                <button
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white disabled:opacity-30 disabled:hover:bg-white/5 transition-all outline-none focus:ring-2 focus:ring-accent/50"
                  aria-label="Previous Page"
                >
                  <HiChevronLeft className="text-xl" />
                </button>

                <div className="flex items-center gap-2 mx-4 bg-white/5 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        currentPage === page
                          ? "bg-accent text-white shadow-md transform scale-110"
                          : "text-white/60 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white disabled:opacity-30 disabled:hover:bg-white/5 transition-all outline-none focus:ring-2 focus:ring-accent/50"
                  aria-label="Next Page"
                >
                  <HiChevronRight className="text-xl" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
            <div className="text-6xl mb-4 text-white/20">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No properties found</h3>
            <p className="text-white/60">We couldn&apos;t find anything matching your search criteria.</p>
            <button 
              onClick={() => { setSearchTerm(""); setActiveFilter("All"); setCurrentPage(1); }}
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
