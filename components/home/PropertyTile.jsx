import Image from "next/image";
import Link from "next/link";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { LuBedDouble, LuRuler, LuHouse } from "react-icons/lu";
import { tidy, sentence } from "@/lib/format";

const formatPrice = (p) => (p ?? "").replace(/₦\s+/g, "₦").trim();
const formatBeds = (b) => {
  const t = tidy(b);
  return /^\d+$/.test(t) ? `${t} ${t === "1" ? "bed" : "beds"}` : t;
};

export default function PropertyTile({ property, priority = false }) {
  const status = sentence(property.status);
  const meta = [
    property.beds && { icon: LuBedDouble, text: formatBeds(property.beds) },
    property.size && { icon: LuRuler, text: tidy(property.size) },
    property.type && { icon: LuHouse, text: tidy(property.type) },
  ].filter(Boolean);

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group block h-full border border-line bg-white p-2.5 transition-shadow duration-500 hover:shadow-[0_18px_40px_-20px_rgba(11,29,58,0.35)]"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-surface">
        {property.image && (
          <Image
            src={property.image}
            alt={tidy(property.title)}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
        )}
        {status && (
          <span className="absolute left-2.5 top-2.5 bg-canvas/95 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-primary">
            {status}
          </span>
        )}
      </div>

      <div className="px-1.5 pb-1.5 pt-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-[15px] font-medium leading-snug text-primary line-clamp-2">
            {tidy(property.title)}
          </h3>
          <p className="shrink-0 text-[15px] font-semibold text-primary">
            {formatPrice(property.price)}
          </p>
        </div>

        <p className="mt-1.5 flex items-center gap-1 text-xs text-ink-soft line-clamp-1">
          <HiOutlineLocationMarker className="shrink-0 text-sm" />
          {tidy(property.location)}
        </p>

        {meta.length > 0 && (
          <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-3 text-[11px] text-ink-soft">
            {meta.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-1.5">
                <Icon className="text-sm text-primary/50" />
                {text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
