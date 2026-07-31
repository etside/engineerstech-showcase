export interface AirTicketService {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: "booking" | "support" | "corporate" | "travel-extras";
  categoryLabel: string;
  description: string;
  fullDescription: string;
  features: string[];
  airlines: string[];
  priceRange: string;
  processingTime: string;
  icon: string;
  isFeatured: boolean;
  tags: string[];
}

export const airTicketCategories = [
  { slug: "booking", label: "Flight Booking", description: "Domestic and international flight booking, group reservations, multi-city itineraries, and last-minute deals." },
  { slug: "support", label: "Ticket Support", description: "Rescheduling, cancellation, refund processing, baggage claims, and flight change assistance." },
  { slug: "corporate", label: "Corporate Travel", description: "Corporate travel management, business class bookings, travel policies, and expense reporting." },
  { slug: "travel-extras", label: "Travel Extras", description: "Visa assistance, travel insurance, airport transfers, lounge access, and hotel bookings." },
] as const;

export const airTicketServices: AirTicketService[] = [
  // ─── FLIGHT BOOKING ──────────────────────────────────────
  {
    id: "domestic-001",
    slug: "domestic-flight-booking",
    name: "Domestic Flight Booking",
    shortName: "Domestic Flights",
    category: "booking",
    categoryLabel: "Flight Booking",
    description: "Book domestic flights across Bangladesh — Dhaka, Chittagong, Sylhet, Cox's Bazar, Jessore and more.",
    fullDescription: `We provide hassle-free domestic flight booking across Bangladesh. Whether you're traveling for business or leisure, we compare fares across all major domestic airlines to get you the best deal.

Bangladesh's domestic aviation network connects major cities including Dhaka (DAC), Chittagong (CGP), Sylhet (ZYL), Cox's Bazar (CXB), Jessore (JSR), Barisal (BZL), Rajshahi (RJH), and Saidpur (SPD).

We work with all major domestic carriers:
- Biman Bangladesh Airlines
- US-Bangla Airlines
- Novoair
- Air Astra
- Bangladesh Biman

Our team handles everything from searching for the best fares to issuing your e-ticket, so you can focus on your journey.`,
    features: [
      "Fare comparison across all domestic airlines",
      "Instant e-ticket delivery via email/SMS",
      "Seat selection assistance",
      "Meal preference booking",
      "Special assistance arrangement",
      "Group booking for 10+ passengers",
      "Frequent flyer miles support",
    ],
    airlines: ["Biman Bangladesh", "US-Bangla Airlines", "Novoair", "Air Astra"],
    priceRange: "৳3,500 – ৳15,000",
    processingTime: "Instant confirmation",
    icon: "plane",
    isFeatured: true,
    tags: ["domestic flight", "bangladesh flight", "dhaka chittagong", "internal flight", "biman"],
  },
  {
    id: "international-001",
    slug: "international-flight-booking",
    name: "International Flight Booking",
    shortName: "International Flights",
    category: "booking",
    categoryLabel: "Flight Booking",
    description: "Book international flights from Bangladesh to any destination worldwide at competitive prices.",
    fullDescription: `We offer international flight booking from Bangladesh to destinations across the globe. Whether you're traveling to the Middle East, Southeast Asia, Europe, North America, or anywhere else, we find the best routes and fares.

Popular routes from Bangladesh:
- Dhaka to Dubai (DXB) — Direct & connecting
- Dhaka to Doha (DOH) — Direct
- Dhaka to Kuala Lumpur (KUL) — Direct
- Dhaka to Bangkok (BKK) — Direct
- Dhaka to London (LHR) — Direct & connecting
- Dhaka to Toronto (YYZ) — Connecting
- Dhaka to New York (JFK) — Connecting
- Dhaka to Singapore (SIN) — Direct & connecting

We partner with over 100 international airlines including Emirates, Qatar Airways, Singapore Airlines, Thai Airways, British Airways, Malaysia Airlines, and more.`,
    features: [
      "100+ international airline options",
      "Multi-city and round-trip bookings",
      "Stopover and transit visa guidance",
      "Layover hotel arrangements",
      "Group and family discounts",
      "Fare alerts for price drops",
      "24/7 booking support",
    ],
    airlines: ["Emirates", "Qatar Airways", "Singapore Airlines", "Thai Airways", "British Airways", "Malaysia Airlines", "Turkish Airlines", "Etihad"],
    priceRange: "৳25,000 – ৳2,50,000+",
    processingTime: "Instant confirmation",
    icon: "globe",
    isFeatured: true,
    tags: ["international flight", "overseas flight", "emirates", "qatar airways", "flight booking"],
  },
  {
    id: "group-001",
    slug: "group-flight-booking",
    name: "Group Flight Booking",
    shortName: "Group Booking",
    category: "booking",
    categoryLabel: "Flight Booking",
    description: "Book flights for groups of 10+ passengers with special discounts and flexible policies.",
    fullDescription: `Planning group travel? Whether it's a corporate retreat, family reunion, wedding party, sports team, or pilgrimage group, we offer special group booking rates with flexible policies.

Group bookings (10+ passengers) come with benefits that individual bookings don't offer:
- Discounted group fares
- Flexible name changes after booking
- Group check-in assistance
- Dedicated group coordinator
- Payment plans and installments
- Free baggage allowance negotiation

We handle group bookings for:
- Corporate team travel
- Wedding and family events
- Religious pilgrimage (Hajj, Umrah)
- Sports teams and delegations
- Educational tours and student groups
- Government and NGO delegations`,
    features: [
      "Discounted rates for 10+ passengers",
      "Flexible payment terms",
      "Dedicated group travel coordinator",
      "Name change flexibility after booking",
      "Group check-in at airport",
      "Coordinated seating arrangements",
    ],
    airlines: ["All major airlines"],
    priceRange: "Custom quote based on group size",
    processingTime: "24–48 hours for quote",
    icon: "users",
    isFeatured: false,
    tags: ["group booking", "group travel", "team booking", "bulk tickets", "hajj umrah"],
  },
  {
    id: "multicity-001",
    slug: "multi-city-flight-booking",
    name: "Multi-City & Connecting Flights",
    shortName: "Multi-City",
    category: "booking",
    categoryLabel: "Flight Booking",
    description: "Book multi-city itineraries with connecting flights and stopovers across multiple destinations.",
    fullDescription: `Need to visit multiple cities in one trip? Our multi-city booking service lets you plan complex itineraries with connecting flights, stopovers, and layovers — all in a single booking.

Multi-city bookings are perfect for:
- Business travelers visiting multiple offices
- Tourists exploring multiple countries
- Students traveling between home and university
- Layover stays and stopover packages

We optimize your routing to minimize travel time and cost while maximizing convenience. Our agents have access to special interline fares and routing options not available on standard booking platforms.`,
    features: [
      "Up to 6 cities in one itinerary",
      "Optimized routing for time and cost",
      "Stopover packages at hub cities",
      "Single booking reference for entire trip",
      "Baggage transfer between airlines",
      "Flexible date changes",
    ],
    airlines: ["Emirates", "Qatar Airways", "Turkish Airlines", "Singapore Airlines", "Etihad"],
    priceRange: "Varies by route and airlines",
    processingTime: "Quote within 24 hours",
    icon: "route",
    isFeatured: false,
    tags: ["multi-city", "connecting flight", "stopover", "layover", "complex itinerary"],
  },
  {
    id: "lastminute-001",
    slug: "last-minute-flight-deals",
    name: "Last-Minute Flight Deals",
    shortName: "Last-Minute Deals",
    category: "booking",
    categoryLabel: "Flight Booking",
    description: "Find discounted last-minute flights when you need to travel urgently.",
    fullDescription: `Need to fly at the last minute? We specialize in finding the best last-minute flight deals from Bangladesh. Whether it's an emergency trip, a spontaneous getaway, or a last-minute business meeting, we work with airlines to secure seats on soonest departing flights.

Last-minute bookings often come with significant discounts as airlines look to fill empty seats. Our agents monitor fare drops and unsold inventory to find you the best possible price.

We cover:
- Same-day and next-day departures
- Standby and waitlist management
- Emergency travel arrangements
- Compassion fares for family emergencies
- Business urgent travel`,
    features: [
      "Same-day and next-day departures",
      "Emergency travel arrangements",
      "Standby and waitlist management",
      "Discounted unsold seat inventory",
      "Compassion fares for emergencies",
      "24/7 emergency booking hotline",
    ],
    airlines: ["All available airlines"],
    priceRange: "Up to 40% off regular fares",
    processingTime: "Booking confirmed within 1 hour",
    icon: "zap",
    isFeatured: false,
    tags: ["last minute flight", "emergency travel", "urgent booking", "same day flight", "cheap last minute"],
  },

  // ─── TICKET SUPPORT ──────────────────────────────────────
  {
    id: "reschedule-001",
    slug: "flight-rescheduling",
    name: "Flight Rescheduling & Changes",
    shortName: "Rescheduling",
    category: "support",
    categoryLabel: "Ticket Support",
    description: "Reschedule your flight or make changes to your booking with airline-specific guidance.",
    fullDescription: `Plans change, and we make rescheduling your flight as smooth as possible. Our team handles flight date changes, time changes, route modifications, and passenger name corrections across all airlines.

Each airline has different change policies and fees. We review your specific ticket conditions, calculate the change fees, and process the rescheduling on your behalf.

Common changes we handle:
- Date and time changes
- Route/city changes
- Passenger name corrections
- Cabin class upgrades
- Return date extensions
- Partial trip cancellations`,
    features: [
      "Airline-specific change policy review",
      "Fee calculation and comparison",
      "Date, time, and route changes",
      "Name correction assistance",
      "Cabin class upgrade facilitation",
      "Same-day flight change support",
    ],
    airlines: ["All airlines"],
    priceRange: "Airline change fee + ৳500 service fee",
    processingTime: "2–24 hours depending on airline",
    icon: "calendar",
    isFeatured: true,
    tags: ["flight reschedule", "change flight", "date change", "booking modification", "ticket change"],
  },
  {
    id: "cancel-001",
    slug: "flight-cancellation-refund",
    name: "Flight Cancellation & Refund",
    shortName: "Cancellation & Refund",
    category: "support",
    categoryLabel: "Ticket Support",
    description: "Cancel your flight booking and process refund claims with expert guidance.",
    fullDescription: `We assist with flight cancellations and refund processing across all airlines. Whether you need to cancel due to personal reasons, airline schedule changes, or force majeure events, we guide you through the process.

Refund eligibility depends on:
- Ticket type (refundable vs non-refundable)
- Time of cancellation (before vs after departure)
- Fare rules of the specific booking
- Airline cancellation policy
- Travel insurance coverage

We help maximize your refund by:
- Reviewing fare rules and policies
- Identifying refundable components
- Filing refund claims on your behalf
- Following up with airlines
- Escalating denied refund claims`,
    features: [
      "Fare rule and policy analysis",
      "Refund eligibility assessment",
      "Refund claim filing and tracking",
      "Denied claim escalation support",
      "Travel insurance claim assistance",
      "Credit shell and voucher management",
    ],
    airlines: ["All airlines"],
    priceRange: "Airline refund policy + ৳500 service fee",
    processingTime: "7–30 working days for refund processing",
    icon: "x-circle",
    isFeatured: true,
    tags: ["flight cancellation", "refund", "cancel ticket", "money back", "refund claim"],
  },
  {
    id: "baggage-001",
    slug: "baggage-claim-assistance",
    name: "Baggage Claim Assistance",
    shortName: "Baggage Claim",
    category: "support",
    categoryLabel: "Ticket Support",
    description: "Get help with lost, delayed, or damaged baggage claims and compensation.",
    fullDescription: `Dealing with lost, delayed, or damaged baggage can be frustrating. Our baggage claim assistance team helps you navigate the airline's claim process and fight for fair compensation.

We handle:
- Lost baggage claims (PIR filing and tracking)
- Delayed baggage delivery follow-up
- Damaged baggage compensation claims
- Excess baggage refund claims
- Missing items from checked luggage
- Interline baggage issues (connecting flights)

Our team knows airline policies and international regulations (Montreal Convention, Warsaw Convention) to ensure you receive proper compensation.`,
    features: [
      "PIR (Property Irregularity Report) filing",
      "Lost baggage tracking and follow-up",
      "Damaged baggage compensation claims",
      "Montreal Convention compliance",
      "Excess baggage refund assistance",
      "Interline baggage issue resolution",
    ],
    airlines: ["All airlines"],
    priceRange: "৳1,000 – ৳3,000 service fee",
    processingTime: "7–45 days depending on airline",
    icon: "package",
    isFeatured: false,
    tags: ["baggage claim", "lost luggage", "damaged baggage", "delayed bag", "compensation"],
  },
  {
    id: "visa-support-001",
    slug: "visa-support-for-travelers",
    name: "Visa Support for Travelers",
    shortName: "Visa Support",
    category: "support",
    categoryLabel: "Ticket Support",
    description: "Get visa application guidance, document preparation, and embassy appointment assistance.",
    fullDescription: `Traveling abroad? We provide comprehensive visa support services to help you get your visa approved smoothly. Our visa experts cover tourist visas, business visas, transit visas, and more for destinations worldwide.

Our visa support includes:
- Visa requirement assessment
- Document checklist and preparation
- Application form filling assistance
- Appointment scheduling at embassies/consulates
- Cover letter and itinerary preparation
- Mock interview preparation
- Visa tracking and follow-up

Popular visa destinations we support:
- USA, Canada, UK, Schengen countries
- UAE, Saudi Arabia, Qatar, Oman
- Malaysia, Thailand, Singapore
- Australia, New Zealand
- Japan, South Korea`,
    features: [
      "Visa requirement assessment by destination",
      "Document checklist and review",
      "Application form filling assistance",
      "Embassy appointment scheduling",
      "Cover letter and travel itinerary",
      "Interview preparation guidance",
    ],
    airlines: ["N/A — visa service"],
    priceRange: "৳2,000 – ৳15,000 (varies by country)",
    processingTime: "5–30 working days depending on embassy",
    icon: "stamp",
    isFeatured: true,
    tags: ["visa", "visa application", "tourist visa", "business visa", "schengen visa", "usa visa"],
  },

  // ─── CORPORATE TRAVEL ────────────────────────────────────
  {
    id: "corporate-001",
    slug: "corporate-travel-management",
    name: "Corporate Travel Management",
    shortName: "Corporate Travel",
    category: "corporate",
    categoryLabel: "Corporate Travel",
    description: "End-to-end corporate travel management with negotiated fares, travel policies, and reporting.",
    fullDescription: `Our Corporate Travel Management service provides businesses with a complete travel solution. We negotiate discounted rates with airlines, set up travel policies, handle bookings, and provide detailed expense reporting.

Benefits for your company:
- Negotiated corporate fares (up to 25% savings)
- Centralized travel booking portal
- Travel policy compliance tracking
- Monthly expense reports and analytics
- 24/7 emergency travel support
- Duty of care and traveler tracking
- Invoice consolidation and billing

We work with companies of all sizes — from startups to multinational corporations — to optimize their travel spend while ensuring traveler comfort and safety.`,
    features: [
      "Negotiated corporate airline rates",
      "Centralized booking portal",
      "Travel policy setup and enforcement",
      "Monthly expense analytics",
      "24/7 emergency travel line",
      "Traveler tracking and duty of care",
    ],
    airlines: ["All airlines — corporate rates"],
    priceRange: "Custom corporate plan",
    processingTime: "Setup: 1–2 weeks | Booking: Instant",
    icon: "briefcase",
    isFeatured: true,
    tags: ["corporate travel", "business travel", "company travel", "travel management", "corporate booking"],
  },
  {
    id: "business-class-001",
    slug: "business-class-booking",
    name: "Business & First Class Booking",
    shortName: "Business/First Class",
    category: "corporate",
    categoryLabel: "Corporate Travel",
    description: "Book premium business and first class cabins with lounge access and luxury amenities.",
    fullDescription: `Elevate your travel experience with our business and first class booking service. We secure premium cabin seats on major airlines with exclusive benefits including lounge access, priority boarding, extra baggage, and luxury in-flight services.

Premium cabin benefits:
- Lie-flat seats and private suites
- Airport lounge access worldwide
- Priority check-in and boarding
- Gourmet dining and premium beverages
- Extra baggage allowance (2x–3x)
- Chauffeur and transfer services
- Priority baggage handling

We have access to special corporate and consolidator fares that offer significant discounts on premium cabin tickets compared to direct airline booking.`,
    features: [
      "Discounted business/first class fares",
      "Lounge access worldwide",
      "Priority check-in and boarding",
      "Chauffeur service coordination",
      "Suite and seat selection assistance",
      "Miles and loyalty program support",
    ],
    airlines: ["Emirates", "Qatar Airways", "Singapore Airlines", "Etihad", "Turkish Airlines", "British Airways"],
    priceRange: "৳80,000 – ৳5,00,000+",
    processingTime: "Quote within 24 hours",
    icon: "crown",
    isFeatured: false,
    tags: ["business class", "first class", "premium cabin", "luxury travel", "lie-flat seat"],
  },

  // ─── TRAVEL EXTRAS ───────────────────────────────────────
  {
    id: "travel-insurance-001",
    slug: "travel-insurance",
    name: "Travel Insurance",
    shortName: "Travel Insurance",
    category: "travel-extras",
    categoryLabel: "Travel Extras",
    description: "Get comprehensive travel insurance covering medical emergencies, trip cancellation, and baggage loss.",
    fullDescription: `Travel with peace of mind with our comprehensive travel insurance plans. We partner with leading insurance providers to offer coverage for medical emergencies, trip cancellations, baggage loss, and more.

Coverage includes:
- Medical emergency and hospitalization
- Trip cancellation and interruption
- Lost/delayed baggage coverage
- Personal accident coverage
- Flight delay compensation
- Emergency evacuation
- Passport and document loss
- Third-party liability

We offer plans for:
- Single trip travelers
- Frequent/business travelers
- Students studying abroad
- Group and family travel
- Senior citizens
- Adventure sports travelers`,
    features: [
      "Medical coverage up to $500,000",
      "Trip cancellation protection",
      "24/7 emergency assistance hotline",
      "Cashless hospitalization network",
      "Adventure sports coverage",
      "Pre-existing condition coverage (select plans)",
    ],
    airlines: ["N/A — insurance service"],
    priceRange: "৳500 – ৳5,000 per trip",
    processingTime: "Instant policy issuance",
    icon: "shield",
    isFeatured: false,
    tags: ["travel insurance", "flight insurance", "medical coverage", "trip protection", "baggage insurance"],
  },
  {
    id: "airport-transfer-001",
    slug: "airport-transfer-service",
    name: "Airport Transfer Service",
    shortName: "Airport Transfer",
    category: "travel-extras",
    categoryLabel: "Travel Extras",
    description: "Book reliable airport pickup and drop-off services at your departure and arrival airports.",
    fullDescription: `Start and end your journey stress-free with our airport transfer service. We arrange reliable, comfortable transportation between your home/hotel and the airport at competitive rates.

Available at:
- Hazrat Shahjalal International Airport (DAC), Dhaka
- Shah Amanat International Airport (CGP), Chittagong
- Osmani International Airport (ZYL), Sylhet
- Cox's Bazar Airport (CXB)
- Jessore Airport (JSR)
- International airports at your destination

Vehicle options:
- Economy sedan
- Premium sedan
- SUV
- Mini-van (group transfers)
- Luxury vehicle`,
    features: [
      "Meet and greet at airport",
      "Flight tracking for delayed arrivals",
      "Free waiting time (up to 60 minutes)",
      "Child seat available on request",
      "Fixed pricing — no surge charges",
      "Professional licensed drivers",
    ],
    airlines: ["N/A — transfer service"],
    priceRange: "৳800 – ৳5,000 (varies by distance)",
    processingTime: "Instant confirmation",
    icon: "car",
    isFeatured: false,
    tags: ["airport transfer", "airport pickup", "airport drop", "airport taxi", "airport shuttle"],
  },
  {
    id: "lounge-001",
    slug: "airport-lounge-access",
    name: "Airport Lounge Access",
    shortName: "Lounge Access",
    category: "travel-extras",
    categoryLabel: "Travel Extras",
    description: "Access premium airport lounges with complimentary food, drinks, Wi-Fi, and comfortable seating.",
    fullDescription: `Enjoy the comfort of premium airport lounges regardless of your airline or cabin class. We provide access to airport lounges worldwide with complimentary food, beverages, Wi-Fi, showers, and comfortable seating.

Available at 1,500+ airports worldwide including:
- Dhaka (DAC) — multiple lounges
- Dubai (DXB) — Emirates and Marhaba lounges
- Doha (DOH) — Qatar Al Mourjan lounge
- Singapore (SIN) — SilverKris and Plaza Premium
- Bangkok (BKK) — Miracle and Royal Silk
- London (LHR) — Plaza Premium and No1

Benefits:
- Complimentary food and beverages
- High-speed Wi-Fi
- Shower facilities
- Workstations and charging points
- Quiet zones for rest
- Flight information displays`,
    features: [
      "Access to 1,500+ airport lounges",
      "Complimentary food and drinks",
      "High-speed Wi-Fi",
      "Shower and rest facilities",
      "Workstations available",
      "Pay-per-visit or membership plans",
    ],
    airlines: ["N/A — lounge service"],
    priceRange: "৳2,000 – ৳8,000 per visit",
    processingTime: "Instant booking",
    icon: "sofa",
    isFeatured: false,
    tags: ["airport lounge", "lounge access", "business lounge", "vip lounge", "airport comfort"],
  },
  {
    id: "hotel-001",
    slug: "hotel-booking",
    name: "Hotel Booking Worldwide",
    shortName: "Hotel Booking",
    category: "travel-extras",
    categoryLabel: "Travel Extras",
    description: "Book hotels worldwide at negotiated rates — from budget to luxury, with best price guarantee.",
    fullDescription: `Complete your travel arrangements with our hotel booking service. We partner with over 500,000 hotels worldwide to offer you the best rates, from budget-friendly options to 5-star luxury properties.

Benefits of booking with us:
- Negotiated rates (up to 40% off rack rates)
- Best price guarantee
- Free cancellation on most bookings
- Room upgrade when available
- Loyalty points accrual
- 24/7 booking support
- Local knowledge and recommendations

We cover all types of accommodation:
- Budget hotels and hostels
- Business hotels
- Boutique and design hotels
- Luxury resorts and villas
- Serviced apartments
- Vacation rentals`,
    features: [
      "500,000+ hotels worldwide",
      "Best price guarantee",
      "Free cancellation on most bookings",
      "Room upgrade when available",
      "Early check-in / late check-out",
      "Special requests handling",
    ],
    airlines: ["N/A — hotel service"],
    priceRange: "৳1,500 – ৳50,000+ per night",
    processingTime: "Instant confirmation",
    icon: "bed",
    isFeatured: true,
    tags: ["hotel booking", "hotel reservation", "accommodation", "resort", "vacation rental"],
  },
  {
    id: "student-001",
    slug: "student-travel-discounts",
    name: "Student Travel Discounts",
    shortName: "Student Discounts",
    category: "travel-extras",
    categoryLabel: "Travel Extras",
    description: "Special discounted fares for students traveling to study abroad or returning home.",
    fullDescription: `We offer exclusive travel discounts for students studying abroad. Our student fare program provides significant savings on both domestic and international flights, plus additional baggage allowance for academic materials.

Student fare benefits:
- Up to 20% off regular fares
- Extra baggage (up to 40kg checked)
- Flexible rebooking policies
- Academic document carriage
- Group discounts for university batches
- Summer and semester break specials

Eligibility:
- Valid student ID from recognized institution
- Admission letter from overseas university
- Age 16–30 years
- Valid for economy class bookings

We work with airlines that offer dedicated student fare classes and packages.`,
    features: [
      "Up to 20% off regular fares",
      "Extra 40kg checked baggage",
      "Flexible rebooking policies",
      "Academic document handling",
      "Group discounts for batches",
      "Semester break specials",
    ],
    airlines: ["Biman Bangladesh", "Emirates", "Qatar Airways", "Turkish Airlines"],
    priceRange: "Up to 20% off regular fares",
    processingTime: "Instant with valid student ID",
    icon: "graduation-cap",
    isFeatured: false,
    tags: ["student discount", "student fare", "study abroad", "student travel", "university"],
  },
];

export function findAirTicketService(slug: string) {
  return airTicketServices.find((s) => s.slug === slug);
}

export function getAirTicketServicesByCategory(category: string) {
  return airTicketServices.filter((s) => s.category === category);
}
