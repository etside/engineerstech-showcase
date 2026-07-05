// Major corporate logos styled as flat white text
const BRANDS = [
  { name: "Dell" },
  { name: "Shopify" },
  { name: "Capital One" },
  { name: "LinkedIn" },
  { name: "Zoom" },
  { name: "eBay" },
  { name: "BJIT Group" },
  { name: "Brain Station 23" },
  { name: "TigerIT" },
  { name: "Cefalo" },
  { name: "Therap" },
  { name: "Augmedix" },
];

export default function TrustMarquee() {
  const items = [...BRANDS, ...BRANDS];

  return (
    <div className="overflow-hidden py-2">
      <div className="flex gap-8 marquee-track w-max">
        {items.map((b, i) => (
          <div
            key={i}
            className="flex items-center shrink-0 cursor-default group"
          >
            <span className="text-sm font-bold text-white/40 group-hover:text-white/70 tracking-wider uppercase transition-colors duration-300 whitespace-nowrap">
              {b.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
