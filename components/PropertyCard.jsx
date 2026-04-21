import Image from "next/image";
import Link from "next/link";
import { HiOutlineLocationMarker } from "react-icons/hi";

export default function PropertyCard({ property }) {
  return (
    <Link 
      href={`/properties/${property.slug}`}
      className="group block w-full bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:bg-white/10 transition-all duration-300 border border-white/10"
    >
      {/* Image Container */}
      <div className="relative w-full h-64 overflow-hidden">
        <Image
          src={property.image}
          alt={`${property.title} — ${property.type} in ${property.location}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold tracking-wider text-primary uppercase shadow-sm">
          {property.status}
        </div>

        {/* Type Badge */}
        <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm">
          {property.type}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6">
        <div className="flex items-center text-white/50 text-sm font-medium mb-3">
          <HiOutlineLocationMarker className="mr-1 text-accent text-lg" />
          {property.location}
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-accent transition-colors">
          {property.title}
        </h3>
        
        <p className="text-white/60 text-sm mb-4 line-clamp-2 leading-relaxed">
          {property.description}
        </p>
        
        <div className="w-full h-px bg-white/10 mb-4" />
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-0.5">Price</p>
            <p className="text-lg font-bold text-accent">{property.price}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-accent/10 group-hover:bg-accent flex items-center justify-center transition-colors">
            <span className="text-accent group-hover:text-white transition-colors">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
