export interface TechProduct {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: "laptops" | "gaming" | "components" | "peripherals" | "wearables" | "accessories";
  categoryLabel: string;
  description: string;
  fullDescription: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  brand: string;
  specs: string[];
  availability: "preorder" | "in-stock" | "coming-soon";
  estimatedAvailability?: string;
  icon: string;
  isFeatured: boolean;
  tags: string[];
  shopUrl?: string;
}

export const techProductCategories = [
  { slug: "laptops", label: "Laptops & Notebooks", description: "Latest laptops from Apple, Dell, HP, Lenovo, and ASUS for work, study, and creativity." },
  { slug: "gaming", label: "Gaming Gear", description: "Gaming laptops, consoles, peripherals, and accessories for serious gamers." },
  { slug: "components", label: "PC Components", description: "RAM, SSDs, GPUs, CPUs, motherboards, and power supplies for custom builds." },
  { slug: "peripherals", label: "Peripherals", description: "Keyboards, mice, monitors, headsets, webcams, and other desktop accessories." },
  { slug: "wearables", label: "Wearables & Smart", description: "Smartwatches, fitness bands, earbuds, and portable speakers." },
  { slug: "accessories", label: "Accessories", description: "Laptop bags, stands, chargers, hubs, and everyday tech accessories." },
] as const;

export const techProducts: TechProduct[] = [
  // ─── LAPTOPS & NOTEBOOKS ────────────────────────────────
  {
    id: "macbook-air-m3",
    slug: "macbook-air-m3-2025",
    name: "Apple MacBook Air M3 (2025)",
    shortName: "MacBook Air M3",
    category: "laptops",
    categoryLabel: "Laptops & Notebooks",
    description: "The thinnest, lightest MacBook Air ever — powered by M3 chip with 18-hour battery life.",
    fullDescription: `The 2025 MacBook Air with M3 chip delivers incredible performance in an impossibly thin design. With a stunning Liquid Retina display, 18-hour battery life, and a fanless design, it's the perfect laptop for everyday use, school, and creative work.

Key highlights:
- Apple M3 chip with 8-core CPU and 10-core GPU
- 15.3-inch Liquid Retina display (2880×1864)
- 16GB unified memory, configurable up to 24GB
- 256GB SSD, configurable up to 2TB
- 1080p FaceTime HD camera
- MagSafe charging, two Thunderbolt ports
- Backlit Magic Keyboard with Touch ID
- Available in Midnight, Starlight, Space Gray, Silver`,
    price: "৳1,45,000",
    originalPrice: "৳1,59,000",
    discount: "9% off",
    brand: "Apple",
    specs: ["M3 Chip", "16GB RAM", "256GB SSD", "15.3\" Liquid Retina", "18hr Battery", "Fanless Design"],
    availability: "preorder",
    estimatedAvailability: "August 2025",
    icon: "laptop",
    isFeatured: true,
    tags: ["macbook", "apple", "laptop", "m3", "macbook air", "thin laptop", "student laptop"],
  },
  {
    id: "macbook-pro-m4",
    slug: "macbook-pro-m4-2025",
    name: "Apple MacBook Pro 14\" M4 Pro",
    shortName: "MacBook Pro M4",
    category: "laptops",
    categoryLabel: "Laptops & Notebooks",
    description: "Pro-level performance with M4 Pro chip — the ultimate laptop for professionals.",
    fullDescription: `The MacBook Pro 14-inch with M4 Pro chip is built for demanding professional workflows. Whether you're editing 4K video, compiling code, or running complex simulations, the M4 Pro delivers pro-level performance with exceptional battery life.

Key highlights:
- Apple M4 Pro chip with 12-core CPU and 16-core GPU
- 14.2-inch Liquid Retina XDR display (3024×1964)
- 24GB unified memory, configurable up to 48GB
- 512GB SSD, configurable up to 4TB
- Up to 17 hours of battery life
- Three Thunderbolt 5 ports, HDMI, SDXC card slot
- 120Hz ProMotion display with 1600 nits peak brightness`,
    price: "৳2,85,000",
    brand: "Apple",
    specs: ["M4 Pro Chip", "24GB RAM", "512GB SSD", "14.2\" XDR Display", "17hr Battery", "Thunderbolt 5"],
    availability: "preorder",
    estimatedAvailability: "August 2025",
    icon: "laptop",
    isFeatured: true,
    tags: ["macbook pro", "apple", "m4 pro", "professional laptop", "video editing", "developer laptop"],
  },
  {
    id: "dell-xps-15",
    slug: "dell-xps-15-2025",
    name: "Dell XPS 15 (2025)",
    shortName: "Dell XPS 15",
    category: "laptops",
    categoryLabel: "Laptops & Notebooks",
    description: "Premium ultrabook with InfinityEdge display and Intel Core Ultra 7 processor.",
    fullDescription: `The Dell XPS 15 continues to set the standard for premium Windows laptops. With its stunning InfinityEdge display, powerful Intel Core Ultra 7 processor, and premium build quality, it's the ideal choice for professionals and creatives.

Key highlights:
- Intel Core Ultra 7 155H processor
- 15.6-inch 3.5K OLED InfinityEdge display
- 16GB DDR5 RAM, upgradable to 64GB
- 512GB NVMe PCIe Gen 4 SSD
- Intel Arc Graphics
- CNC machined aluminum chassis
- Backlit keyboard with large precision touchpad
- Thunderbolt 4, USB-C, and microSD`,
    price: "৳1,65,000",
    originalPrice: "৳1,85,000",
    discount: "11% off",
    brand: "Dell",
    specs: ["Intel Core Ultra 7", "16GB DDR5", "512GB SSD", "3.5K OLED", "Aluminum Chassis", "Thunderbolt 4"],
    availability: "preorder",
    estimatedAvailability: "September 2025",
    icon: "laptop",
    isFeatured: false,
    tags: ["dell", "xps", "ultrabook", "oled laptop", "premium laptop", "windows laptop"],
  },
  {
    id: "hp-pavilion-15",
    slug: "hp-pavilion-15-2025",
    name: "HP Pavilion 15 (2025)",
    shortName: "HP Pavilion 15",
    category: "laptops",
    categoryLabel: "Laptops & Notebooks",
    description: "Reliable everyday laptop with AMD Ryzen 7, perfect for students and professionals.",
    fullDescription: `The HP Pavilion 15 offers excellent value with its AMD Ryzen 7 processor, Full HD display, and all-day battery life. It's the perfect laptop for students, home users, and professionals who need reliable performance without breaking the bank.

Key highlights:
- AMD Ryzen 7 8840U processor
- 15.6-inch Full HD IPS display (1920×1080)
- 16GB DDR5 RAM
- 512GB NVMe SSD
- AMD Radeon Graphics
- B&O dual speakers
- HP Fast Charge (0 to 50% in 45 minutes)
- Wi-Fi 6E and Bluetooth 5.3`,
    price: "৳72,000",
    originalPrice: "৳82,000",
    discount: "12% off",
    brand: "HP",
    specs: ["Ryzen 7 8840U", "16GB DDR5", "512GB SSD", "15.6\" FHD IPS", "B&O Audio", "Fast Charge"],
    availability: "in-stock",
    brand: "HP",
    icon: "laptop",
    isFeatured: false,
    tags: ["hp", "pavilion", "student laptop", "amd ryzen", "budget laptop", "everyday laptop"],
  },
  {
    id: "lenovo-ideapad-slim5",
    slug: "lenovo-ideapad-slim-5-2025",
    name: "Lenovo IdeaPad Slim 5 (2025)",
    shortName: "Lenovo IdeaPad Slim 5",
    category: "laptops",
    categoryLabel: "Laptops & Notebooks",
    description: "Slim and powerful with Intel Core Ultra 5, ideal for productivity and portability.",
    fullDescription: `The Lenovo IdeaPad Slim 5 combines portability with performance. Its slim profile, vibrant display, and Intel Core Ultra 5 processor make it a great choice for productivity on the go.

Key highlights:
- Intel Core Ultra 5 125U processor
- 14-inch 2.8K OLED display (2880×1800)
- 16GB LPDDR5x RAM
- 512GB NVMe SSD
- Intel Arc Graphics
- 1.46kg lightweight design
- Rapid Charge (0 to 70% in 1 hour)
- AI meeting features with smart noise cancellation`,
    price: "৳65,000",
    brand: "Lenovo",
    specs: ["Core Ultra 5", "16GB LPDDR5x", "512GB SSD", "2.8K OLED", "1.46kg", "Rapid Charge"],
    availability: "preorder",
    estimatedAvailability: "August 2025",
    icon: "laptop",
    isFeatured: false,
    tags: ["lenovo", "ideapad", "slim laptop", "oled", "ultrabook", "portable laptop"],
  },
  {
    id: "asus-vivobook-15",
    slug: "asus-vivobook-15-2025",
    name: "ASUS VivoBook 15 (2025)",
    shortName: "ASUS VivoBook 15",
    category: "laptops",
    categoryLabel: "Laptops & Notebooks",
    description: "Affordable powerhouse with AMD Ryzen 5 and NanoEdge display for daily tasks.",
    fullDescription: `The ASUS VivoBook 15 is designed for everyday computing with a sleek look, powerful performance, and a brilliant NanoEdge display. It's perfect for students and home users looking for a reliable, affordable laptop.

Key highlights:
- AMD Ryzen 5 7530U processor
- 15.6-inch Full HD NanoEdge display
- 8GB DDR4 RAM (expandable to 24GB)
- 512GB NVMe SSD
- AMD Radeon Graphics
- ErgoLift hinge for comfortable typing
- USB-C, USB-A, HDMI ports
- SonicMaster audio technology`,
    price: "৳58,000",
    originalPrice: "৳64,000",
    discount: "9% off",
    brand: "ASUS",
    specs: ["Ryzen 5 7530U", "8GB DDR4", "512GB SSD", "15.6\" FHD", "NanoEdge Display", "ErgoLift Hinge"],
    availability: "in-stock",
    icon: "laptop",
    isFeatured: false,
    tags: ["asus", "vivobook", "budget laptop", "amd ryzen", "student laptop", "everyday laptop"],
  },

  // ─── GAMING GEAR ────────────────────────────────────────
  {
    id: "asus-rog-strix-g16",
    slug: "asus-rog-strix-g16-2025",
    name: "ASUS ROG Strix G16 (2025)",
    shortName: "ROG Strix G16",
    category: "gaming",
    categoryLabel: "Gaming Gear",
    description: "High-performance gaming laptop with RTX 4070 and 165Hz display for competitive gaming.",
    fullDescription: `The ASUS ROG Strix G16 is a beast of a gaming laptop, packed with the latest NVIDIA RTX 4070 GPU and Intel Core i9 processor. Its 165Hz display and advanced cooling system make it perfect for competitive gaming and content creation.

Key highlights:
- Intel Core i9-14900HX processor
- NVIDIA GeForce RTX 4070 (8GB GDDR6)
- 16-inch QHD 165Hz IPS display
- 16GB DDR5 RAM (expandable to 32GB)
- 1TB NVMe PCIe Gen 4 SSD
- ROG Intelligent Cooling with liquid metal
- RGB keyboard with per-key lighting
- Wi-Fi 6E, Thunderbolt 4`,
    price: "৳1,85,000",
    originalPrice: "৳2,10,000",
    discount: "12% off",
    brand: "ASUS",
    specs: ["i9-14900HX", "RTX 4070", "16GB DDR5", "16\" QHD 165Hz", "1TB SSD", "Liquid Metal Cooling"],
    availability: "preorder",
    estimatedAvailability: "August 2025",
    icon: "gamepad-2",
    isFeatured: true,
    tags: ["gaming laptop", "asus rog", "rtx 4070", "gaming", "esports", "rog strix"],
  },
  {
    id: "msi-katana-15",
    slug: "msi-katana-15-2025",
    name: "MSI Katana 15 (2025)",
    shortName: "MSI Katana 15",
    category: "gaming",
    categoryLabel: "Gaming Gear",
    description: "Affordable gaming laptop with RTX 4060 and 144Hz display for mid-range gamers.",
    fullDescription: `The MSI Katana 15 offers excellent gaming performance at a more accessible price point. With an NVIDIA RTX 4060 GPU and a smooth 144Hz display, it's ideal for gamers who want great performance without the premium price tag.

Key highlights:
- Intel Core i7-14650HX processor
- NVIDIA GeForce RTX 4060 (8GB GDDR6)
- 15.6-inch FHD 144Hz IPS display
- 16GB DDR5 RAM
- 512GB NVMe SSD
- Cooler Boost 5 cooling system
- RGB backlit keyboard
- MSI Center for performance tuning`,
    price: "৳1,25,000",
    brand: "MSI",
    specs: ["i7-14650HX", "RTX 4060", "16GB DDR5", "15.6\" FHD 144Hz", "512GB SSD", "Cooler Boost 5"],
    availability: "preorder",
    estimatedAvailability: "September 2025",
    icon: "gamepad-2",
    isFeatured: false,
    tags: ["gaming laptop", "msi", "rtx 4060", "mid-range gaming", "katana", "144hz"],
  },
  {
    id: "acer-nitro-v15",
    slug: "acer-nitro-v15-2025",
    name: "Acer Nitro V 15 (2025)",
    shortName: "Acer Nitro V 15",
    category: "gaming",
    categoryLabel: "Gaming Gear",
    description: "Entry-level gaming laptop with RTX 4050 — great performance at an unbeatable price.",
    fullDescription: `The Acer Nitro V 15 is the gateway to PC gaming. With an NVIDIA RTX 4050 GPU and a 144Hz display, it delivers smooth gameplay at an affordable price. Perfect for students who game and gamers on a budget.

Key highlights:
- Intel Core i5-13420H processor
- NVIDIA GeForce RTX 4050 (6GB GDDR6)
- 15.6-inch FHD 144Hz IPS display
- 8GB DDR5 RAM (expandable to 32GB)
- 512GB NVMe SSD
- Dual-fan cooling system
- NitroSense for performance monitoring
- DTS:X Ultra audio`,
    price: "৳85,000",
    originalPrice: "৳95,000",
    discount: "11% off",
    brand: "Acer",
    specs: ["i5-13420H", "RTX 4050", "8GB DDR5", "15.6\" FHD 144Hz", "512GB SSD", "DTS:X Ultra"],
    availability: "in-stock",
    icon: "gamepad-2",
    isFeatured: false,
    tags: ["gaming laptop", "acer", "nitro", "rtx 4050", "budget gaming", "entry gaming"],
  },
  {
    id: "ps5-slim",
    slug: "playstation-5-slim",
    name: "Sony PlayStation 5 Slim",
    shortName: "PS5 Slim",
    category: "gaming",
    categoryLabel: "Gaming Gear",
    description: "The slimmer, lighter PS5 with 1TB SSD — play the latest AAA games in 4K.",
    fullDescription: `The PlayStation 5 Slim offers the same incredible gaming experience as the original PS5 in a smaller, lighter form factor. With 1TB of storage, 4K gaming, and ray tracing, it's the ultimate console for gamers.

Key highlights:
- Custom AMD Zen 2 CPU (8-core, 3.5GHz)
- Custom AMD RDNA 2 GPU (10.28 TFLOPS)
- 16GB GDDR6 RAM
- 1TB NVMe SSD storage
- 4K gaming at 120fps support
- Ray tracing for realistic lighting
- DualSense wireless controller with haptic feedback
- Ultra HD Blu-ray disc drive (disc edition)`,
    price: "৳55,000",
    brand: "Sony",
    specs: ["AMD Zen 2", "RDNA 2 GPU", "16GB GDDR6", "1TB SSD", "4K 120fps", "Ray Tracing", "DualSense"],
    availability: "preorder",
    estimatedAvailability: "August 2025",
    icon: "gamepad-2",
    isFeatured: true,
    tags: ["ps5", "playstation", "sony", "gaming console", "4k gaming", "console gaming"],
  },
  {
    id: "xbox-series-x",
    slug: "xbox-series-x-2025",
    name: "Microsoft Xbox Series X (2025)",
    shortName: "Xbox Series X",
    category: "gaming",
    categoryLabel: "Gaming Gear",
    description: "The most powerful Xbox ever — 4K gaming, Quick Resume, and Game Pass Ultimate.",
    fullDescription: `The Xbox Series X delivers the fastest, most powerful Xbox experience ever. With 12 teraflops of GPU power, Quick Resume, and access to hundreds of games through Game Pass, it's a gaming powerhouse.

Key highlights:
- Custom AMD Zen 2 CPU (8-core, 3.8GHz)
- Custom AMD RDNA 2 GPU (12 TFLOPS)
- 16GB GDDR6 RAM
- 1TB Custom NVMe SSD
- 4K gaming at 120fps
- Ray tracing support
- Quick Resume for instant game switching
- Xbox Game Pass Ultimate included (3 months)`,
    price: "৳52,000",
    brand: "Microsoft",
    specs: ["AMD Zen 2", "RDNA 2 GPU (12 TF)", "16GB GDDR6", "1TB SSD", "4K 120fps", "Game Pass"],
    availability: "in-stock",
    icon: "gamepad-2",
    isFeatured: false,
    tags: ["xbox", "microsoft", "gaming console", "4k gaming", "game pass", "console gaming"],
  },

  // ─── PC COMPONENTS ──────────────────────────────────────
  {
    id: "corsair-ddr5-32gb",
    slug: "corsair-vengeance-ddr5-32gb",
    name: "Corsair Vengeance DDR5 32GB (2×16GB) 6000MHz",
    shortName: "Corsair DDR5 32GB",
    category: "components",
    categoryLabel: "PC Components",
    description: "High-performance DDR5 RAM with Intel XMP 3.0 and AMD EXPO support for fast builds.",
    fullDescription: `Corsair Vengeance DDR5 memory delivers high-frequency performance with tight timings for Intel and AMD platforms. With Intel XMP 3.0 and AMD EXPO profiles, overclocking is as simple as enabling a BIOS setting.

Key highlights:
- 32GB (2×16GB) DDR5-6000MHz
- Corsair Vengeance heat spreader design
- Intel XMP 3.0 certified
- AMD EXPO compatible
- Tight CL30 timings
- On-die ECC for stability
- Low 1.35V operating voltage
- Limited lifetime warranty`,
    price: "৳12,500",
    originalPrice: "৳14,500",
    discount: "14% off",
    brand: "Corsair",
    specs: ["32GB (2×16GB)", "DDR5-6000MHz", "CL30 Timings", "XMP 3.0", "AMD EXPO", "1.35V"],
    availability: "in-stock",
    icon: "cpu",
    isFeatured: false,
    tags: ["ram", "ddr5", "corsair", "vengeance", "32gb", "gaming ram", "desktop memory"],
  },
  {
    id: "samsung-990-pro-2tb",
    slug: "samsung-990-pro-2tb-nvme",
    name: "Samsung 990 Pro 2TB NVMe SSD",
    shortName: "Samsung 990 Pro 2TB",
    category: "components",
    categoryLabel: "PC Components",
    description: "Blazing-fast PCIe Gen 4 NVMe SSD with 7,450MB/s read speed — the ultimate storage.",
    fullDescription: `The Samsung 990 Pro is the fastest PCIe 4.0 NVMe SSD available, delivering sequential read speeds up to 7,450MB/s. Perfect for gaming, content creation, and professional workflows that demand the fastest storage.

Key highlights:
- 2TB capacity
- Sequential read: 7,450 MB/s
- Sequential write: 6,900 MB/s
- PCIe Gen 4.0 x4 NVMe M.2 (2280)
- Samsung V-NAND V7 technology
- Samsung Magician software for monitoring
- AES 256-bit hardware encryption
- 5-year limited warranty`,
    price: "৳22,000",
    originalPrice: "৳26,000",
    discount: "15% off",
    brand: "Samsung",
    specs: ["2TB", "PCIe Gen 4", "7,450 MB/s Read", "6,900 MB/s Write", "M.2 2280", "AES 256-bit"],
    availability: "in-stock",
    icon: "hard-drive",
    isFeatured: true,
    tags: ["ssd", "nvme", "samsung", "990 pro", "2tb", "fast storage", "gen 4"],
  },
  {
    id: "rtx-4070-super",
    slug: "nvidia-rtx-4070-super",
    name: "NVIDIA GeForce RTX 4070 SUPER 12GB",
    shortName: "RTX 4070 Super",
    category: "components",
    categoryLabel: "PC Components",
    description: "Next-gen GPU with DLSS 3.5 and ray tracing — 4K gaming and AI workloads.",
    fullDescription: `The NVIDIA GeForce RTX 4070 SUPER brings incredible performance for 1440p and 4K gaming. With DLSS 3.5, ray tracing, and 12GB of GDDR6X memory, it handles the latest games and AI workloads with ease.

Key highlights:
- NVIDIA Ada Lovelace architecture
- 12GB GDDR6X memory
- 7,168 CUDA cores
- 2.5 GHz boost clock
- DLSS 3.5 with Frame Generation
- Real-time ray tracing (3rd gen cores)
- AV1 hardware encoding
- 220W TDP — efficient power consumption`,
    price: "৳78,000",
    brand: "NVIDIA",
    specs: ["12GB GDDR6X", "7,168 CUDA Cores", "2.5GHz Boost", "DLSS 3.5", "Ray Tracing", "220W TDP"],
    availability: "preorder",
    estimatedAvailability: "August 2025",
    icon: "monitor",
    isFeatured: true,
    tags: ["gpu", "nvidia", "rtx 4070", "super", "graphics card", "gaming gpu", "4k gaming"],
  },
  {
    id: "i7-14700k",
    slug: "intel-core-i7-14700k",
    name: "Intel Core i7-14700K Processor",
    shortName: "i7-14700K",
    category: "components",
    categoryLabel: "PC Components",
    description: "20-core powerhouse with 5.6GHz boost — great for gaming and multitasking.",
    fullDescription: `The Intel Core i7-14700K is a 20-core processor (8 P-cores + 12 E-cores) that delivers excellent gaming and productivity performance. With a 5.6GHz boost clock and unlocked multiplier, it's perfect for enthusiasts.

Key highlights:
- 20 cores (8P + 12E) / 28 threads
- Up to 5.6GHz P-core boost clock
- 33MB Intel Smart Cache
- Intel UHD Graphics 770
- Unlocked multiplier for overclocking
- Intel Thermal Velocity Boost
- DDR5 and DDR4 memory support
- LGA 1700 socket`,
    price: "৳42,000",
    brand: "Intel",
    specs: ["20 Cores/28 Threads", "5.6GHz Boost", "33MB Cache", "Unlocked", "LGA 1700", "DDR5 Support"],
    availability: "in-stock",
    icon: "cpu",
    isFeatured: false,
    tags: ["cpu", "intel", "i7", "14700k", "processor", "gaming cpu", "overclocking"],
  },
  {
    id: "kingston-fury-ddr5",
    slug: "kingston-fury-beast-ddr5-64gb",
    name: "Kingston FURY Beast DDR5 64GB (2×32GB) 5600MHz",
    shortName: "Kingston FURY 64GB",
    category: "components",
    categoryLabel: "PC Components",
    description: "Massive 64GB DDR5 kit for content creators, workstations, and extreme multitasking.",
    fullDescription: `Kingston FURY Beast DDR5 memory provides massive capacity and fast speeds for content creators, video editors, and power users who need serious memory bandwidth.

Key highlights:
- 64GB (2×32GB) DDR5-5600MHz
- CL36 timings
- Intel XMP 3.0 and AMD EXPO profiles
- Plug-and-play automatic overclocking
- On-die ECC for data integrity
- Low-profile heat spreader
- 1.25V operating voltage
- Lifetime warranty`,
    price: "৳28,000",
    brand: "Kingston",
    specs: ["64GB (2×32GB)", "DDR5-5600MHz", "CL36", "XMP 3.0", "AMD EXPO", "Lifetime Warranty"],
    availability: "preorder",
    estimatedAvailability: "September 2025",
    icon: "cpu",
    isFeatured: false,
    tags: ["ram", "ddr5", "kingston", "fury", "64gb", "workstation ram", "content creation"],
  },

  // ─── PERIPHERALS ────────────────────────────────────────
  {
    id: "logitech-mx-keys-s",
    slug: "logitech-mx-keys-s-keyboard",
    name: "Logitech MX Keys S Wireless Keyboard",
    shortName: "MX Keys S",
    category: "peripherals",
    categoryLabel: "Peripherals",
    description: "Smart backlighting, perfect stroke keys, and multi-device connectivity for pros.",
    fullDescription: `The Logitech MX Keys S is the advanced wireless keyboard designed for creative professionals. With smart backlighting, perfect stroke keys, and the ability to connect to up to 3 devices, it's the ultimate productivity keyboard.

Key highlights:
- Smart backlighting with hand proximity detection
- Perfect Stroke key system for tactile feedback
- Connect up to 3 devices via Bluetooth or Logi Bolt
- Easy-Switch between devices
- USB-C rechargeable (10 days with backlight on)
- Works with Windows, macOS, Linux, iPadOS
- Customizable F-keys with Logi Options+
- Carbon neutral certified`,
    price: "৳12,500",
    brand: "Logitech",
    specs: ["Wireless", "Smart Backlighting", "3-Device Switch", "USB-C Charging", "Multi-OS", "Carbon Neutral"],
    availability: "in-stock",
    icon: "keyboard",
    isFeatured: false,
    tags: ["keyboard", "logitech", "mx keys", "wireless keyboard", "productivity", "office keyboard"],
  },
  {
    id: "logitech-mx-master-3s",
    slug: "logitech-mx-master-3s-mouse",
    name: "Logitech MX Master 3S Wireless Mouse",
    shortName: "MX Master 3S",
    category: "peripherals",
    categoryLabel: "Peripherals",
    description: "Silent clicks, 8K DPI tracking, and electromagnetic scroll wheel — the pro's choice.",
    fullDescription: `The Logitech MX Master 3S is the flagship wireless mouse for professionals. With quiet clicks, 8000 DPI tracking on any surface, and the iconic MagSpeed electromagnetic scroll wheel, it redefines productivity.

Key highlights:
- 8000 DPI any-surface tracking
- Quiet clicks (90% noise reduction)
- MagSpeed electromagnetic scroll wheel (1000 lines/sec)
- Ergonomic design for right-hand use
- Connect to 3 devices via Bluetooth or Logi Bolt
- USB-C quick charging (3 hours from 1-minute charge)
- Flow cross-computer control
- Works with Windows, macOS, Linux, iPadOS`,
    price: "৳11,000",
    brand: "Logitech",
    specs: ["8000 DPI", "Quiet Clicks", "MagSpeed Scroll", "3-Device", "USB-C Charging", "Ergonomic"],
    availability: "in-stock",
    icon: "mouse",
    isFeatured: false,
    tags: ["mouse", "logitech", "mx master", "wireless mouse", "ergonomic", "productivity mouse"],
  },
  {
    id: "lg-27gp850",
    slug: "lg-27gp850-b-monitor",
    name: "LG UltraGear 27GP850-B 27\" QHD Gaming Monitor",
    shortName: "LG 27\" QHD 165Hz",
    category: "peripherals",
    categoryLabel: "Peripherals",
    description: "Nano IPS gaming monitor with 165Hz, 1ms response, and G-Sync/FreeSync support.",
    fullDescription: `The LG UltraGear 27GP850-B is a premium 27-inch QHD gaming monitor with Nano IPS technology. With 165Hz refresh rate, 1ms response time, and both G-Sync and FreeSync support, it delivers smooth, tear-free gaming.

Key highlights:
- 27-inch QHD (2560×1440) Nano IPS display
- 165Hz refresh rate (overclockable to 180Hz)
- 1ms GtG response time
- NVIDIA G-Sync Compatible
- AMD FreeSync Premium
- 98% DCI-P3 color gamut
- HDR 400 support
- HDMI 2.1, DisplayPort 1.4, USB-C`,
    price: "৳48,000",
    originalPrice: "৳55,000",
    discount: "13% off",
    brand: "LG",
    specs: ["27\" QHD", "165Hz", "1ms GtG", "Nano IPS", "G-Sync/FreeSync", "HDR 400", "98% DCI-P3"],
    availability: "preorder",
    estimatedAvailability: "August 2025",
    icon: "monitor",
    isFeatured: true,
    tags: ["monitor", "lg", "ultragear", "gaming monitor", "qhd", "165hz", "ips"],
  },
  {
    id: "hyperx-cloud-iii",
    slug: "hyperx-cloud-iii-gaming-headset",
    name: "HyperX Cloud III Wireless Gaming Headset",
    shortName: "HyperX Cloud III",
    category: "peripherals",
    categoryLabel: "Peripherals",
    description: "Premium wireless gaming headset with 53mm drivers, DTS:X, and 120-hour battery.",
    fullDescription: `The HyperX Cloud III Wireless delivers immersive gaming audio with 53mm drivers, DTS:X Spatial Audio, and an incredible 120-hour battery life. It's the ultimate wireless gaming headset.

Key highlights:
- 53mm dynamic drivers
- DTS:X Spatial Audio
- 120-hour battery life
- 2.4GHz wireless + Bluetooth 5.2
- Detachable clearcast microphone
- Memory foam ear cushions
- Lightweight aluminum frame (330g)
- Multi-platform compatibility (PC, PS5, Switch)`,
    price: "৳14,500",
    brand: "HyperX",
    specs: ["53mm Drivers", "DTS:X", "120hr Battery", "Wireless + BT 5.2", "330g", "Multi-Platform"],
    availability: "in-stock",
    icon: "headphones",
    isFeatured: false,
    tags: ["headset", "hyperx", "cloud iii", "wireless gaming", "gaming headset", "dts:x"],
  },
  {
    id: "elgato-ring-light",
    slug: "elgato-ring-light-mini",
    name: "Elgato Ring Light Mini",
    shortName: "Elgato Ring Light",
    category: "peripherals",
    categoryLabel: "Peripherals",
    description: "Professional ring light for streaming, video calls, and content creation with app control.",
    fullDescription: `The Elgato Ring Light Mini delivers studio-quality lighting in a compact form. With app control, adjustable color temperature, and brightness, it's perfect for streamers, content creators, and professionals.

Key highlights:
- 10-inch ring light
- Adjustable color temperature (2900K–7000K)
- 2500 lumens brightness
- Elgato Control Center app (iOS/Android)
- Desktop mount with ball head
- USB-C powered
- Perfect for video calls and streaming
- Wraps light evenly for flattering results`,
    price: "৳8,500",
    brand: "Elgato",
    specs: ["10\" Ring Light", "2900K–7000K", "2500 Lumens", "App Control", "USB-C", "Desktop Mount"],
    availability: "preorder",
    estimatedAvailability: "September 2025",
    icon: "lightbulb",
    isFeatured: false,
    tags: ["ring light", "elgato", "streaming", "content creation", "video light", "webcam light"],
  },

  // ─── WEARABLES & SMART ──────────────────────────────────
  {
    id: "apple-watch-ultra-3",
    slug: "apple-watch-ultra-3-2025",
    name: "Apple Watch Ultra 3 (2025)",
    shortName: "Apple Watch Ultra 3",
    category: "wearables",
    categoryLabel: "Wearables & Smart",
    description: "The most rugged Apple Watch ever — satellite SOS, 72hr battery, and depth gauge.",
    fullDescription: `The Apple Watch Ultra 3 is built for extreme adventures. With satellite connectivity for emergency SOS, a 72-hour battery life, and a depth gauge for diving, it's the ultimate companion for athletes and explorers.

Key highlights:
- 49mm titanium case
- Always-on Retina LTPO2 OLED (3000 nits)
- S9 chip with 4-core Neural Engine
- 72-hour battery life (low power mode)
- Satellite SOS and crash detection
- Depth gauge and water temperature sensor
- Dual-frequency GPS (L1 + L5)
- Action button for custom shortcuts`,
    price: "৳1,25,000",
    brand: "Apple",
    specs: ["49mm Titanium", "72hr Battery", "Satellite SOS", "Depth Gauge", "Dual-Freq GPS", "Action Button"],
    availability: "preorder",
    estimatedAvailability: "September 2025",
    icon: "watch",
    isFeatured: true,
    tags: ["apple watch", "ultra", "smartwatch", "fitness", "titanium", "adventure watch"],
  },
  {
    id: "samsung-galaxy-buds3-pro",
    slug: "samsung-galaxy-buds3-pro",
    name: "Samsung Galaxy Buds3 Pro",
    shortName: "Galaxy Buds3 Pro",
    category: "wearables",
    categoryLabel: "Wearables & Smart",
    description: "AI-powered ANC earbuds with 360 Audio and seamless Galaxy ecosystem integration.",
    fullDescription: `Samsung Galaxy Buds3 Pro deliver premium sound with AI-powered Active Noise Cancellation, 360 Audio, and seamless integration with Samsung Galaxy devices. With improved comfort and battery life, they're the best Galaxy earbuds yet.

Key highlights:
- AI-powered Active Noise Cancellation
- 360 Audio with head tracking
- Dual speakers (11mm woofer + 6.1mm tweeter)
- 360kbps hi-fi audio with Samsung Scalable Codec
- 6 hours playback (24 hours with case)
- IP57 water and dust resistance
- SmartThings Find for locating lost buds
- Wireless charging and USB-C`,
    price: "৳22,000",
    brand: "Samsung",
    specs: ["AI ANC", "360 Audio", "Dual Speakers", "6hr Battery", "IP57", "Wireless Charging"],
    availability: "preorder",
    estimatedAvailability: "August 2025",
    icon: "headphones",
    isFeatured: false,
    tags: ["earbuds", "samsung", "galaxy buds", "wireless earbuds", "anc", "pro earbuds"],
  },
  {
    id: "jbl-charge-5",
    slug: "jbl-charge-5-bluetooth-speaker",
    name: "JBL Charge 5 Portable Bluetooth Speaker",
    shortName: "JBL Charge 5",
    category: "wearables",
    categoryLabel: "Wearables & Smart",
    description: "IP67 waterproof speaker with 20-hour battery and powerbank function for outdoor adventures.",
    fullDescription: `The JBL Charge 5 delivers powerful JBL Original Pro Sound with an optimized long-excursion driver and dual bass radiators. With 20-hour battery life, IP67 waterproof rating, and powerbank functionality, it's the perfect outdoor companion.

Key highlights:
- JBL Original Pro Sound
- 20-hour battery life
- IP67 waterproof and dustproof
- Built-in powerbank (USB-C out)
- PartyBoost for linking multiple speakers
- Bluetooth 5.1
- JBL Portable app for EQ customization
- Available in 8 colors`,
    price: "৳16,000",
    brand: "JBL",
    specs: ["20hr Battery", "IP67 Waterproof", "Powerbank", "PartyBoost", "BT 5.1", "JBL Pro Sound"],
    availability: "in-stock",
    icon: "speaker",
    isFeatured: false,
    tags: ["speaker", "jbl", "charge 5", "bluetooth speaker", "waterproof speaker", "portable speaker"],
  },

  // ─── ACCESSORIES ────────────────────────────────────────
  {
    id: "rain-design-macstand",
    slug: "rain-design-mactop-stand",
    name: "Rain Design mStand Laptop Stand",
    shortName: "mStand Laptop Stand",
    category: "accessories",
    categoryLabel: "Accessories",
    description: "Premium aluminum laptop stand with ergonomic height for better posture and cooling.",
    fullDescription: `The Rain Design mStand is a premium aluminum laptop stand that elevates your laptop to eye level for better ergonomics. Its single-piece aluminum design provides excellent stability and aids in laptop cooling.

Key highlights:
- 100% aluminum construction
- Raises laptop to eye level (15cm / 6 inches)
- Cable management hole in back
- Compatible with all laptops up to 17 inches
- Sandblasted silver finish
- Non-slip silicone pads
- Improves laptop cooling airflow
- Weighs just 800g`,
    price: "৳5,500",
    brand: "Rain Design",
    specs: ["100% Aluminum", "15cm Height", "All Laptops", "Cable Management", "Silicone Pads", "800g"],
    availability: "in-stock",
    icon: "arrow-up",
    isFeatured: false,
    tags: ["laptop stand", "aluminum", "ergonomic", "macbook stand", "desk accessory", "cooling"],
  },
  {
    id: "anker-nano-charger",
    slug: "anker-nano-ii-65w-charger",
    name: "Anker Nano II 65W USB-C Fast Charger",
    shortName: "Anker Nano II 65W",
    category: "accessories",
    categoryLabel: "Accessories",
    description: "Compact GaN charger with 65W output — charge laptops, phones, and tablets simultaneously.",
    fullDescription: `The Anker Nano II 65W is a compact GaN (Gallium Nitride) charger that delivers 65W of power in a pocket-sized design. With GaN technology, it's 50% smaller than traditional chargers while delivering the same power.

Key highlights:
- 65W total output
- GaN II technology (50% smaller)
- 2× USB-C + 1× USB-A ports
- Charge 3 devices simultaneously
- Powers MacBook Air/Pro, iPad, iPhone, Galaxy
- Smart temperature monitoring
- Foldable plug prongs
- Universal voltage (100–240V)`,
    price: "৳4,500",
    originalPrice: "৳5,500",
    discount: "18% off",
    brand: "Anker",
    specs: ["65W Output", "GaN II", "3 Ports", "USB-C + USB-A", "Foldable Prongs", "Universal Voltage"],
    availability: "in-stock",
    icon: "plug-zap",
    isFeatured: false,
    tags: ["charger", "anker", "gan charger", "usb-c", "fast charger", "laptop charger", "travel charger"],
  },
  {
    id: "baseus-hub-7in1",
    slug: "baseus-7-in-1-usb-c-hub",
    name: "Baseus 7-in-1 USB-C Hub with 4K HDMI",
    shortName: "Baseus USB-C Hub",
    category: "accessories",
    categoryLabel: "Accessories",
    description: "Compact USB-C hub with 4K HDMI, USB 3.0, SD card reader, and 100W passthrough charging.",
    fullDescription: `The Baseus 7-in-1 USB-C Hub expands your laptop's connectivity with 4K HDMI output, three USB 3.0 ports, SD and microSD card readers, and 100W PD passthrough charging. It's the perfect companion for modern thin laptops.

Key highlights:
- 4K@30Hz HDMI output
- 3× USB 3.0 ports (5Gbps)
- SD + microSD card readers
- 100W USB-C PD passthrough charging
- USB-C data transfer (5Gbps)
- Compact aluminum design
- Plug and play — no drivers needed
- Compatible with MacBook, Dell, HP, Lenovo, iPad Pro`,
    price: "৳3,200",
    brand: "Baseus",
    specs: ["4K HDMI", "3× USB 3.0", "SD/microSD", "100W PD", "5Gbps Data", "Aluminum Design"],
    availability: "in-stock",
    icon: "cable",
    isFeatured: false,
    tags: ["usb-c hub", "baseus", "hdmi", "usb hub", "macbook accessory", "dongle"],
  },
  {
    id: "logitech-c920-webcam",
    slug: "logitech-c920-hd-pro-webcam",
    name: "Logitech C920 HD Pro Webcam",
    shortName: "Logitech C920 Webcam",
    category: "accessories",
    categoryLabel: "Accessories",
    description: "Full HD 1080p webcam with auto-light correction for video calls and streaming.",
    fullDescription: `The Logitech C920 HD Pro Webcam delivers crisp 1080p video at 30fps with automatic light correction and a wide field of view. It's the go-to webcam for video conferencing, streaming, and content creation.

Key highlights:
- 1080p Full HD video at 30fps
- 720p video at 60fps
- Stereo dual microphones
- Automatic light correction (RightLight 2)
- 78-degree field of view
- Universal clip fits laptops and monitors
- USB-A plug and play
- Works with Zoom, Teams, Skype, OBS, Discord`,
    price: "৳5,800",
    brand: "Logitech",
    specs: ["1080p@30fps", "720p@60fps", "Stereo Mic", "Auto Light Correction", "78° FOV", "USB-A"],
    availability: "in-stock",
    icon: "camera",
    isFeatured: false,
    tags: ["webcam", "logitech", "c920", "1080p webcam", "video call", "streaming webcam"],
  },
];

export function findTechProduct(slug: string) {
  return techProducts.find((p) => p.slug === slug);
}

export function getTechProductsByCategory(category: string) {
  return techProducts.filter((p) => p.category === category);
}
