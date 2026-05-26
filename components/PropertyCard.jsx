import Image from "next/image";
import Link from "next/link";
import { HiOutlineLocationMarker } from "react-icons/hi";

export default function PropertyCard({ property }) {
  return (
    <Link 
      href={`/properties/${property.slug}`}
      className="group flex flex-col h-full w-full bg-[#0a192f]/40 backdrop-blur-md rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(200,160,50,0.15)] transition-all duration-500 border border-white/10 hover:border-accent/40 hover:-translate-y-2 relative"
    >
      {/* Image Container with Blur effect to support Fliers without cropping */}
      <div className="relative w-full h-72 overflow-hidden bg-black/50 shrink-0">
        {/* Blurred background image to fill empty spaces nicely */}
        <Image 
          src={property.image}
          alt=""
          fill
          className="object-cover opacity-50 blur-[20px] scale-110"
          sizes="10vw"
        />
        {/* Foreground actual image - object-contain so it's not cropped! */}
        <Image
          src={property.image}
          alt={`${property.title} in ${property.location}`}
          fill
          className="object-contain z-10 transition-transform duration-700 group-hover:scale-105 p-3"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Status Badge - floating over image */}
        <div className="absolute z-20 bottom-4 right-4 bg-black/70 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider text-white uppercase shadow-lg flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
          {property.status || "Available"}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 md:p-8 flex flex-col flex-1">
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="bg-accent/15 border border-accent/30 text-accent px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
            {property.type}
          </span>
          <span className="bg-white/5 border border-white/10 text-white/70 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
            {property.property_type || "Property"}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-accent transition-colors leading-snug line-clamp-2">
          {property.title}
        </h3>
        
        {/* Location */}
        <div className="flex items-start text-white/50 text-sm font-medium mb-4">
          <HiOutlineLocationMarker className="mr-1.5 mt-0.5 text-accent text-lg shrink-0" />
          <span className="leading-tight">{property.location}</span>
        </div>
        
        {/* Description */}
        <p className="text-white/60 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
          {property.description}
        </p>
        
        <div className="w-full h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent mb-6 mt-auto" />
        
        {/* Footer: Price & Arrow */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-white/40 font-semibold uppercase tracking-widest mb-1">Asking Price</p>
            <p className="text-xl lg:text-2xl font-extrabold text-accent">{property.price}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-accent border border-white/10 group-hover:border-accent flex items-center justify-center transition-all duration-300 shadow-lg group-hover:shadow-accent/20 shrink-0">
            <span className="text-accent group-hover:text-white transition-colors text-lg transform group-hover:translate-x-1 duration-300">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
