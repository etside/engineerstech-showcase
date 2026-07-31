export interface GovtService {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: "nationality" | "business" | "personal" | "birth-certificate";
  categoryLabel: string;
  description: string;
  fullDescription: string;
  requirements: string[];
  process: string[];
  fees: string;
  timeline: string;
  office: string;
  onlineUrl?: string;
  icon: string;
  isFeatured: boolean;
  tags: string[];
}

export const govtServiceCategories = [
  { slug: "nationality", label: "Nationality & Citizenship", description: "National ID, passport, citizenship certificates and related services for Bangladeshi citizens." },
  { slug: "business", label: "Business Registration", description: "Company registration, trade license, TIN, BIN, VAT and all business compliance services." },
  { slug: "personal", label: "Personal Certificates", description: "Birth, death, marriage, divorce certificates and personal document services." },
  { slug: "birth-certificate", label: "Birth Certificate Registration", description: "Online birth registration, correction, copy requests and related services." },
] as const;

export const govtServices: GovtService[] = [
  // ─── NATIONALITY & CITIZENSHIP ───────────────────────────
  {
    id: "nid-001",
    slug: "national-id-card-nid",
    name: "National ID Card (NID) Registration",
    shortName: "NID Card",
    category: "nationality",
    categoryLabel: "Nationality & Citizenship",
    description: "Apply for or renew your Bangladeshi National Identity Card (NID) through the Election Commission.",
    fullDescription: `The National Identity Card (NID) is the primary identity document for Bangladeshi citizens issued by the Election Commission of Bangladesh. Every citizen aged 18 or older is required to possess a National ID Card. The NID is essential for voting, opening bank accounts, obtaining a passport, filing tax returns, and accessing government services.

The NID contains your biometric data, photograph, name, date of birth, father's name, mother's name, and a unique 10-digit national ID number. The card is mandatory for all legal and financial transactions in Bangladesh.

You can apply for a new NID card at your local Union Council or through the Election Commission's online portal. Biometric data including fingerprints and photographs are captured during the application process.`,
    requirements: [
      "Completed application form (online or at Union Council)",
      "Birth certificate or school certificate as age proof",
      "Photographs (passport size)",
      "Father's and mother's NID copies",
      "Present and permanent address proof",
      "Biometric data (fingerprints and photograph at office)",
    ],
    process: [
      "Fill out the NID application form online or at local Union Council",
      "Submit required documents to the Union Council or Upazila Nirbahi Officer",
      "Biometric data capture (fingerprints, photograph) at the registration center",
      "Verification by local government officials",
      "NID card printed and delivered to your address or collected from office",
    ],
    fees: "Free (Government service)",
    timeline: "30–60 working days",
    office: "Election Commission of Bangladesh / Union Council",
    onlineUrl: "https://www.nidw.gov.bd",
    icon: "id-card",
    isFeatured: true,
    tags: ["nid", "national id", "identity card", "election commission", "voter id"],
  },
  {
    id: "passport-001",
    slug: "passport-application-renewal",
    name: "Passport Application & Renewal",
    shortName: "Passport",
    category: "nationality",
    categoryLabel: "Nationality & Citizenship",
    description: "Apply for a new passport or renew your existing Bangladeshi passport online or at the passport office.",
    fullDescription: `The Bangladeshi passport is an official travel document issued by the Department of Immigration & Passports, Ministry of Home Affairs. It is required for international travel and serves as a primary identity document abroad.

Bangladesh offers three types of passports:
- Ordinary Passport (Green) — for general citizens
- Official Passport (Grey) — for government officials
- Diplomatic Passport (Blue) — for diplomats and senior officials

You can apply for a new passport, renew an expired passport, or request a replacement for a lost/damaged passport. The application process can be initiated online through the Department of Immigration & Passports website.`,
    requirements: [
      "Online application form (filled at passport.gov.bd)",
      "National ID Card (NID) original and photocopy",
      "Birth certificate (attested copy)",
      "Previous passport (for renewal)",
      "Photographs (passport size, as per specification)",
      "Police verification (for new passport)",
      "Fee payment receipt",
    ],
    process: [
      "Apply online at passport.gov.bd and select your nearest passport office",
      "Pay the applicable fee at designated banks",
      "Attend your appointment at the passport office with all documents",
      "Biometric data capture (fingerprints, photograph)",
      "Police verification (if required)",
      "Passport printed and dispatched or collected from office",
    ],
    fees: "Ordinary: ৳3,000–৳6,000 (depending on pages and speed) | Express: ৳8,000–৳15,000",
    timeline: "7–30 working days (depending on type)",
    office: "Department of Immigration & Passports",
    onlineUrl: "https://www.passport.gov.bd",
    icon: "book-open",
    isFeatured: true,
    tags: ["passport", "travel", "immigration", "renewal", "international travel"],
  },
  {
    id: "dual-citizenship-001",
    slug: "dual-citizenship-registration",
    name: "Dual Citizenship Registration",
    shortName: "Dual Citizenship",
    category: "nationality",
    categoryLabel: "Nationality & Citizenship",
    description: "Register for dual citizenship under the Bangladesh Citizenship Act for overseas Bangladeshis.",
    fullDescription: `The Dual Citizenship Act 2008 allows Bangladeshi citizens who have acquired or are eligible to acquire citizenship of another country to retain their Bangladeshi citizenship. This is particularly important for the millions of Bangladeshis living abroad.

Under this Act, citizens who have acquired citizenship of countries that permit dual nationality (such as the UK, Canada, Australia, etc.) can apply to retain their Bangladeshi citizenship. The process involves applying to the Ministry of Home Affairs through the nearest Bangladesh Embassy or Consulate.

Dual citizens can enjoy all rights of Bangladeshi citizenship including voting, owning property, and accessing government services.`,
    requirements: [
      "Application form for dual citizenship",
      "Bangladeshi passport or NID copy",
      "Foreign citizenship certificate or passport",
      "Photographs (passport size)",
      "Fee payment receipt",
      "Proof of renunciation (for countries requiring it)",
    ],
    process: [
      "Obtain application form from nearest Bangladesh Embassy/Consulate",
      "Submit completed form with all required documents",
      "Pay the applicable fee",
      "Embassy/Consulate forwards application to Ministry of Home Affairs",
      "Approval and issuance of dual citizenship certificate",
    ],
    fees: "৳5,000 (application fee)",
    timeline: "3–6 months",
    office: "Ministry of Home Affairs / Bangladesh Embassy",
    icon: "globe",
    isFeatured: false,
    tags: ["dual citizenship", "overseas bangladeshi", "nrb", "citizenship retention"],
  },
  {
    id: "citizenship-cert-001",
    slug: "citizenship-certificate",
    name: "Citizenship Certificate",
    shortName: "Citizenship Certificate",
    category: "nationality",
    categoryLabel: "Nationality & Citizenship",
    description: "Obtain an official citizenship certificate from the Government of Bangladesh.",
    fullDescription: `A Citizenship Certificate is an official document issued by the Government of Bangladesh certifying that a person is a citizen of Bangladesh. This certificate is required for various legal purposes including property ownership, government employment, and legal proceedings.

The certificate is issued by the Deputy Commissioner's office or the Ministry of Home Affairs. It is particularly useful for individuals who need to prove their citizenship status for official purposes, or for those whose citizenship is in question.

This certificate is different from the National ID Card and serves as supplementary proof of citizenship.`,
    requirements: [
      "Application form (prescribed format)",
      "National ID Card copy",
      "Birth certificate",
      "Father's citizenship proof",
      "Mother's citizenship proof",
      "Photographs",
      "Affidavit or declaration",
    ],
    process: [
      "Submit application to the Deputy Commissioner's office",
      "Provide all required documents and proof of lineage",
      "Verification by local government officials",
      "Processing and approval by the Deputy Commissioner",
      "Collection of citizenship certificate",
    ],
    fees: "৳200–৳500",
    timeline: "15–30 working days",
    office: "Deputy Commissioner's Office",
    icon: "shield-check",
    isFeatured: false,
    tags: ["citizenship", "certificate", "nationality proof", "legal document"],
  },
  {
    id: "nadra-001",
    slug: "nadra-birth-registration",
    name: "NADRA Birth Registration (Smart Card)",
    shortName: "NADRA Birth Card",
    category: "nationality",
    categoryLabel: "Nationality & Citizenship",
    description: "Apply for the NADRA smart card birth registration — a digital, tamper-proof identity document.",
    fullDescription: `NADRA (National Database and Registration Authority) in collaboration with the Bangladesh government has introduced smart card-based birth registration. This is a modern, digital identity document that contains biometric data and is tamper-proof.

The NADRA smart card birth registration combines your birth certificate with advanced security features including a microchip, biometric data, and QR code verification. It serves as both a birth certificate and a digital identity document.

This smart card is recognized internationally and can be used for passport applications, visa processing, and other official purposes.`,
    requirements: [
      "Completed application form",
      "Parents' NID cards",
      "Hospital birth record or midwife certificate",
      "Photographs of the applicant (for adults) or parents (for minors)",
      "Fee payment receipt",
    ],
    process: [
      "Apply online or at nearest NADRA/BDRIS center",
      "Submit required documents",
      "Biometric data capture (for adults)",
      "Verification and processing",
      "Smart card printed and delivered",
    ],
    fees: "৳100–৳500 (depending on urgency)",
    timeline: "7–30 working days",
    office: "NADRA / Birth & Death Registration System",
    onlineUrl: "https://bdris.gov.bd",
    icon: "credit-card",
    isFeatured: false,
    tags: ["nadra", "smart card", "digital birth certificate", "biometric"],
  },

  // ─── BUSINESS REGISTRATION ───────────────────────────────
  {
    id: "rjsc-001",
    slug: "company-registration-rjsc",
    name: "Company Registration (RJSC)",
    shortName: "Company Registration",
    category: "business",
    categoryLabel: "Business Registration",
    description: "Register a new company with the Registrar of Joint Stock Companies & Firms (RJSC) of Bangladesh.",
    fullDescription: `The Registrar of Joint Stock Companies & Firms (RJSC) is the government body responsible for company registration in Bangladesh. Under the Companies Act 1994, any person or group of persons can form a company either as a Private Limited Company or Public Limited Company.

Key types of companies:
- Private Limited Company: Minimum 2 shareholders, maximum 50, limited liability
- Public Limited Company: Minimum 7 shareholders, no maximum, can raise public funds
- Single Person Company: Introduced in 2022 amendments, for solo entrepreneurs

The registration process involves name clearance, memorandum and articles of association preparation, and filing with RJSC.`,
    requirements: [
      "Company name clearance from RJSC",
      "Memorandum of Association (MOA)",
      "Articles of Association (AOA)",
      "Form-1 (Declaration by directors)",
      "Form-18 (Particulars of directors and secretary)",
      "Form-32 (Particulars of directors)",
      "Share capital details",
      "Registered office address proof",
      "NID copies of all directors",
      "Fee payment receipts",
    ],
    process: [
      "Apply for company name clearance online at RJSC portal",
      "Prepare Memorandum of Association (MOA) and Articles of Association (AOA)",
      "Open a company bank account and deposit share capital",
      "File all documents with RJSC",
      "Pay registration fees and stamp duties",
      "Receive Certificate of Incorporation",
      "Obtain Trade License from local municipality",
    ],
    fees: "৳5,000–৳25,000 (depending on authorized capital)",
    timeline: "7–15 working days",
    office: "Registrar of Joint Stock Companies & Firms (RJSC)",
    onlineUrl: "https://www.rjsc.gov.bd",
    icon: "building-2",
    isFeatured: true,
    tags: ["rjsc", "company registration", "private limited", "public limited", "incorporation"],
  },
  {
    id: "trade-license-001",
    slug: "trade-license",
    name: "Trade License",
    shortName: "Trade License",
    category: "business",
    categoryLabel: "Business Registration",
    description: "Obtain a trade license from your local municipality or city corporation to operate a business legally.",
    fullDescription: `A Trade License is a mandatory license required to operate any business or commercial activity in Bangladesh. It is issued by the local municipality or city corporation under the Municipal Act 2009.

Every business entity — whether a sole proprietorship, partnership, or company — must obtain a trade license before commencing commercial operations. The license is renewed annually and must be displayed at the business premises.

Trade licenses are categorized based on the nature of business activities:
- Commercial: Trading, retail, wholesale
- Industrial: Manufacturing, production
- Professional: Consultancy, services
- Mixed: Combination of activities`,
    requirements: [
      "Application form from local municipality",
      "NID of business owner/partners/directors",
      "Property ownership documents or rental agreement",
      "Building plan approval (for industrial)",
      "Fire safety certificate (if applicable)",
      "Environmental clearance (if applicable)",
      "Fee payment receipt",
    ],
    process: [
      "Obtain application form from local municipality/city corporation",
      "Fill out the form with business details",
      "Submit required documents",
      "Pay the applicable fees",
      "Inspection by municipal officers (if required)",
      "Trade license issued and delivered",
    ],
    fees: "৳500–৳10,000 (varies by area and business type)",
    timeline: "7–30 working days",
    office: "Municipality / City Corporation",
    icon: "briefcase",
    isFeatured: true,
    tags: ["trade license", "business license", "municipality", "commercial license"],
  },
  {
    id: "tin-001",
    slug: "tin-certificate",
    name: "TIN Certificate (Taxpayer Identification Number)",
    shortName: "TIN Certificate",
    category: "business",
    categoryLabel: "Business Registration",
    description: "Obtain your Taxpayer Identification Number (TIN) from the National Board of Revenue (NBR).",
    fullDescription: `The Taxpayer Identification Number (TIN) is a unique 12-digit identification number issued by the National Board of Revenue (NBR) to all taxpayers in Bangladesh. It is mandatory for filing income tax returns, conducting business transactions, and dealing with government agencies.

Every individual and business entity that earns taxable income must obtain a TIN. The TIN is required for:
- Filing income tax returns
- Opening business bank accounts
- Import/export activities
- Government tenders and contracts
- Property registration
- Obtaining various licenses and registrations

You can apply for a TIN online through the NBR's e-BIN system.`,
    requirements: [
      "Online application form (at nbr.gov.bd)",
      "National ID Card copy",
      "Passport copy (if available)",
      "Bank account details",
      "Business registration documents (for business TIN)",
      "Photographs",
    ],
    process: [
      "Apply online at NBR's e-BIN portal",
      "Fill in personal/business details",
      "Upload required documents",
      "System generates TIN number instantly",
      "Download or print TIN certificate",
    ],
    fees: "Free",
    timeline: "Instant (online)",
    office: "National Board of Revenue (NBR)",
    onlineUrl: "https://www.nbr.gov.bd",
    icon: "hash",
    isFeatured: true,
    tags: ["tin", "tax", "nbr", "taxpayer", "income tax"],
  },
  {
    id: "bin-001",
    slug: "bin-certificate",
    name: "BIN Certificate (Business Identification Number)",
    shortName: "BIN Certificate",
    category: "business",
    categoryLabel: "Business Registration",
    description: "Obtain a Business Identification Number (BIN) from the National Board of Revenue for VAT registration.",
    fullDescription: `The Business Identification Number (BIN) is a 12-digit unique identification number issued by the National Board of Revenue (NBR) for VAT-registered businesses. It is required for businesses whose annual turnover exceeds the VAT registration threshold.

BIN is mandatory for:
- Businesses with annual turnover above ৳50 lakh
- Importers and exporters
- Businesses supplying goods or services to government agencies
- Companies registered with RJSC

The BIN is used for all VAT-related transactions and filings with the NBR.`,
    requirements: [
      "Online application form",
      "TIN Certificate",
      "Trade License",
      "Company registration certificate (for companies)",
      "Bank account details",
      "NID of owner/directors",
      "Business address proof",
    ],
    process: [
      "Apply online through the NBR VAT online system",
      "Submit required documents",
      "Verification by VAT authorities",
      "BIN number assigned",
      "BIN certificate issued",
    ],
    fees: "Free",
    timeline: "7–15 working days",
    office: "National Board of Revenue (NBR)",
    onlineUrl: "https://www.nbr.gov.bd",
    icon: "file-text",
    isFeatured: false,
    tags: ["bin", "vat registration", "nbr", "business identification"],
  },
  {
    id: "vat-001",
    slug: "vat-registration",
    name: "VAT Registration & Returns",
    shortName: "VAT Registration",
    category: "business",
    categoryLabel: "Business Registration",
    description: "Register for Value Added Tax (VAT) and learn about VAT return filing requirements in Bangladesh.",
    fullDescription: `Value Added Tax (VAT) is the primary indirect tax in Bangladesh, levied under the VAT and Supplementary Duty Act 2012. Businesses meeting certain criteria are required to register for VAT and file periodic returns.

VAT is applicable at various rates:
- Standard rate: 15% (most goods and services)
- Reduced rates: 5%, 7.5% (essential items)
- Zero-rated: 0% (export goods)

Businesses must register for VAT if their annual turnover exceeds ৳50 lakh. VAT returns must be filed monthly through the NBR's online system.`,
    requirements: [
      "VAT registration form (online)",
      "TIN Certificate",
      "BIN Certificate",
      "Trade License",
      "Business bank account details",
      "NID of owner/partners/directors",
      "Business premises details",
    ],
    process: [
      "Register online through NBR VAT portal",
      "Obtain BIN after registration",
      "File monthly VAT returns online",
      "Pay VAT through designated banks or online",
      "Maintain proper accounts and records",
    ],
    fees: "Registration: Free | Late filing penalty: ৳500/day",
    timeline: "7–15 working days for registration",
    office: "National Board of Revenue (NBR)",
    onlineUrl: "https://www.nbr.gov.bd",
    icon: "receipt",
    isFeatured: false,
    tags: ["vat", "value added tax", "indirect tax", "nbr", "tax return"],
  },
  {
    id: "import-export-001",
    slug: "import-export-registration",
    name: "Import/Export Registration (IRC/ERC)",
    shortName: "Import/Export License",
    category: "business",
    categoryLabel: "Business Registration",
    description: "Obtain Import Registration Certificate (IRC) or Export Registration Certificate (ERC) for international trade.",
    fullDescription: `Import Registration Certificate (IRC) and Export Registration Certificate (ERC) are mandatory for businesses engaged in international trade in Bangladesh. These certificates are issued by the Office of the Chief Controller of Imports & Exports (CCI&E).

IRC is required for importing goods into Bangladesh, while ERC is required for exporting goods from Bangladesh. Both certificates must be renewed annually.

Bangladesh has specific regulations for import and export activities, including:
- Duty structures and tariff rates
- Prohibited and restricted items
- Letter of Credit (LC) requirements
- Customs clearance procedures`,
    requirements: [
      "Application form (CCI&E)",
      "Trade License",
      "TIN and BIN certificates",
      "Company registration (RJSC for companies)",
      "Bank solvency certificate",
      "NID of applicant/directors",
      "Membership from Chamber of Commerce",
      "Fire safety certificate",
    ],
    process: [
      "Apply to the Office of CCI&E",
      "Submit all required documents",
      "Pay applicable fees",
      "Verification by CCI&E",
      "IRC or ERC certificate issued",
      "Open LC with authorized dealer bank",
    ],
    fees: "৳2,000–৳10,000 (depending on type)",
    timeline: "15–30 working days",
    office: "Office of the Chief Controller of Imports & Exports (CCI&E)",
    icon: "ship",
    isFeatured: false,
    tags: ["import", "export", "irc", "erc", "international trade", "customs"],
  },
  {
    id: "factory-license-001",
    slug: "factory-license",
    name: "Factory License",
    shortName: "Factory License",
    category: "business",
    categoryLabel: "Business Registration",
    description: "Obtain a factory license from the Department of Inspection for Factories & Establishments (DIFE).",
    fullDescription: `A Factory License is mandatory for all manufacturing and production facilities in Bangladesh, issued by the Department of Inspection for Factories & Establishments (DIFE) under the Bangladesh Labour Act 2006.

Every factory must be registered and licensed before commencing operations. The license ensures compliance with safety, health, and labor standards. Key requirements include:
- Building safety compliance
- Fire safety measures
- Adequate ventilation and lighting
- Sanitary facilities
- Worker safety equipment
- Emergency exits and evacuation plans

Regular inspections are conducted by DIFE to ensure ongoing compliance.`,
    requirements: [
      "Application form (DIFE)",
      "Trade License",
      "Building plan approval",
      "Fire safety certificate",
      "Environmental clearance",
      "Layout plan of factory",
      "NID of owner/directors",
      "List of machinery and equipment",
    ],
    process: [
      "Apply to DIFE with all required documents",
      "DIFE conducts factory inspection",
      "Compliance with safety standards verified",
      "Factory license issued upon approval",
      "Annual renewal required",
    ],
    fees: "৳2,000–৳20,000 (based on factory size and workers)",
    timeline: "30–60 working days",
    office: "Department of Inspection for Factories & Establishments (DIFE)",
    icon: "factory",
    isFeatured: false,
    tags: ["factory", "manufacturing", "labour law", "safety", "dife"],
  },
  {
    id: "partnership-001",
    slug: "partnership-registration",
    name: "Partnership Firm Registration",
    shortName: "Partnership Registration",
    category: "business",
    categoryLabel: "Business Registration",
    description: "Register your partnership firm with the Registrar of Firms under the Partnership Act, 1932.",
    fullDescription: `Partnership firm registration in Bangladesh is governed by the Partnership Act, 1932. A partnership is a business relationship between two or more persons who agree to share profits and losses of a business.

While partnership registration is not legally mandatory, it is highly recommended as it provides legal recognition and enables partners to enforce their rights in court.

Key aspects of partnership firms:
- Minimum 2 partners, maximum 50
- Governed by Partnership Deed
- Partners have unlimited liability (unless Limited Liability Partnership)
- Profits and losses shared as per agreement`,
    requirements: [
      "Partnership Deed (notarized)",
      "Form A (Application for registration)",
      "NID copies of all partners",
      "Photographs of all partners",
      "Business address proof",
      "Fee payment receipt",
    ],
    process: [
      "Draft Partnership Deed with a lawyer",
      "Notarize the Partnership Deed",
      "Submit Form A and documents to Registrar of Firms",
      "Pay registration fees",
      "Registration certificate issued",
    ],
    fees: "৳500–৳2,000",
    timeline: "7–15 working days",
    office: "Registrar of Firms",
    icon: "users",
    isFeatured: false,
    tags: ["partnership", "firm registration", "business partnership", "partnership deed"],
  },

  // ─── PERSONAL CERTIFICATES ───────────────────────────────
  {
    id: "death-cert-001",
    slug: "death-certificate",
    name: "Death Certificate",
    shortName: "Death Certificate",
    category: "personal",
    categoryLabel: "Personal Certificates",
    description: "Obtain an official death certificate from the local government authority.",
    fullDescription: `A Death Certificate is an official document certifying the death of a person, issued by the local government authority in Bangladesh. It is required for various legal purposes including:
- Settlement of the deceased's estate
- Insurance claims
- Cancellation of various registrations
- Transfer of property
- Pension and benefit claims
- Legal proceedings

The death must be registered within 21 days of occurrence. After this period, registration requires a court order.`,
    requirements: [
      "Application form (prescribed format)",
      "NID of the deceased",
      "Medical certificate of death (from hospital/doctor)",
      "Informant's NID (person reporting the death)",
      "Photographs of deceased (if available)",
      "Fee payment receipt",
    ],
    process: [
      "Report death to local Union Council or Pourashava within 21 days",
      "Submit application with required documents",
      "Verification by local government official",
      "Death certificate issued",
    ],
    fees: "৳50–৳200",
    timeline: "7–15 working days",
    office: "Union Council / Pourashava / City Corporation",
    icon: "file-x",
    isFeatured: false,
    tags: ["death certificate", "death registration", "legal document"],
  },
  {
    id: "marriage-cert-001",
    slug: "marriage-certificate",
    name: "Marriage Certificate",
    shortName: "Marriage Certificate",
    category: "personal",
    categoryLabel: "Personal Certificates",
    description: "Obtain an official marriage certificate from the local government or Registrar of Marriages.",
    fullDescription: `A Marriage Certificate is an official document certifying the legal marriage of two individuals in Bangladesh. It is issued by the local government authority or the Registrar of Marriages under the Muslim Marriage & Divorce Act 1974 or the Special Marriage Act 1872.

Marriage registration is legally required in Bangladesh and the certificate is essential for:
- Visa applications
- Spouse visa and immigration
- Property rights
- Inheritance claims
- Legal name change
- Bank account operations
- Insurance benefits

Both civil and religious marriages can be registered.`,
    requirements: [
      "Marriage registration form",
      "NID copies of both spouses",
      "Photographs of both spouses",
      "Marriage Nikah Namah (for Muslim marriages)",
      "Witness statements (minimum 2 witnesses)",
      "Age proof (birth certificate or school certificate)",
      "Fee payment receipt",
    ],
    process: [
      "Visit the local Registrar of Marriages or Union Council",
      "Submit application with all required documents",
      "Both spouses must be present with witnesses",
      "Verification of documents and identities",
      "Marriage certificate issued",
    ],
    fees: "৳100–৳500",
    timeline: "7–15 working days",
    office: "Registrar of Marriages / Union Council",
    icon: "heart",
    isFeatured: true,
    tags: ["marriage certificate", "marriage registration", "nikah", "spouse"],
  },
  {
    id: "divorce-cert-001",
    slug: "divorce-certificate",
    name: "Divorce Certificate (Talaq)",
    shortName: "Divorce Certificate",
    category: "personal",
    categoryLabel: "Personal Certificates",
    description: "Obtain official divorce certification and registration under the Muslim Family Laws Ordinance.",
    fullDescription: `Divorce in Bangladesh for Muslims is governed by the Muslim Family Laws Ordinance, 1961. A divorce must be registered with the local Arbitration Council to be legally valid.

The divorce certificate is required for:
- Legal proof of divorce
- Remarriage
- Property settlement
- Custody of children
- Passport and travel documents
- Immigration purposes

A husband can pronounce talaq (divorce) but it must be registered with the local Union Council. The wife can also seek divorce through khula (return of dower) or mubaraat (mutual consent).`,
    requirements: [
      "Divorce registration form",
      "NID copies of both spouses",
      "Marriage certificate (original)",
      "Divorce deed (Talaq nama)",
      "Witness statements",
      "Fee payment receipt",
    ],
    process: [
      "Husband submits divorce deed to Union Council",
      "Union Council notifies the wife",
      "90-day reconciliation period",
      "If reconciliation fails, divorce is registered",
      "Divorce certificate issued",
    ],
    fees: "৳100–৳500",
    timeline: "90 days (mandatory waiting period) + 7–15 working days",
    office: "Union Council / Arbitration Council",
    icon: "file-minus",
    isFeatured: false,
    tags: ["divorce", "talaq", "khula", "family law", "marriage dissolution"],
  },
  {
    id: "name-change-001",
    slug: "name-change-certificate",
    name: "Name Change Certificate",
    shortName: "Name Change",
    category: "personal",
    categoryLabel: "Personal Certificates",
    description: "Legally change your name through a gazette notification and obtain official name change certificate.",
    fullDescription: `Name change in Bangladesh is a legal process that requires a formal application and publication in the Government Gazette. It is governed by general legal principles and may require a court order.

Common reasons for name change:
- Marriage or divorce
- Personal preference
- Religious conversion
- Correction of errors in official documents
- Gender transition

The name change must be published in the Bangladesh Gazette to be legally effective. After publication, you can update all your official documents.`,
    requirements: [
      "Affidavit for name change (notarized)",
      "Application for gazette notification",
      "NID and passport copies",
      "Newspaper publication (optional but recommended)",
      "Photographs",
      "Court order (if required)",
      "Fee payment receipt",
    ],
    process: [
      "Prepare and notarize an affidavit for name change",
      "Apply to the Ministry of Public Administration",
      "Publish in the Bangladesh Gazette",
      "Update NID, passport, and other documents",
      "Obtain name change certificate",
    ],
    fees: "৳500–৳2,000",
    timeline: "30–60 working days",
    office: "Ministry of Public Administration / Government Gazette",
    icon: "pen-line",
    isFeatured: false,
    tags: ["name change", "gazette notification", "legal name", "name correction"],
  },
  {
    id: "address-change-001",
    slug: "address-change",
    name: "Address Change (NID Update)",
    shortName: "Address Change",
    category: "personal",
    categoryLabel: "Personal Certificates",
    description: "Update your address on your National ID Card (NID) through the Election Commission.",
    fullDescription: `When you relocate to a new address in Bangladesh, you are required to update your address on your National ID Card (NID). This ensures that your official records are accurate and up-to-date.

Address update is important for:
- Voting rights in the new constituency
- Legal document accuracy
- Bank and financial transactions
- Government service eligibility

The process involves applying to the Election Commission with proof of your new address.`,
    requirements: [
      "NID address update application form",
      "Current NID card",
      "New address proof (utility bill, rent agreement, or land documents)",
      "Photographs",
      "Fee payment receipt",
    ],
    process: [
      "Apply online or at local Election Commission office",
      "Submit required documents",
      "Verification of new address",
      "NID updated with new address",
      "Updated NID card issued",
    ],
    fees: "৳50–৳200",
    timeline: "15–30 working days",
    office: "Election Commission of Bangladesh",
    onlineUrl: "https://www.nidw.gov.bd",
    icon: "map-pin",
    isFeatured: false,
    tags: ["address change", "nid update", "election commission", "address update"],
  },

  // ─── BIRTH CERTIFICATE REGISTRATION ──────────────────────
  {
    id: "birth-reg-001",
    slug: "online-birth-registration",
    name: "Online Birth Registration",
    shortName: "Birth Registration",
    category: "birth-certificate",
    categoryLabel: "Birth Certificate Registration",
    description: "Register a newborn's birth online through the Birth & Death Registration Information System (BDRIS).",
    fullDescription: `Birth registration is the legal recording of a child's birth with the government. In Bangladesh, the Birth & Death Registration Information System (BDRIS) allows parents to register births online.

Birth registration is mandatory under the Birth and Death Registration Act 2004. Every birth must be registered within 45 days of occurrence.

A birth certificate is essential for:
- School admission
- Passport application
- National ID Card
- Inheritance and property rights
- Access to government services
- International travel

Parents can register their child's birth through the BDRIS online portal or at the local Union Council.`,
    requirements: [
      "Hospital birth record or midwife certificate",
      "Parents' NID cards",
      "Parents' marriage certificate",
      "Photograph of the child (if available)",
      "Fee payment receipt",
    ],
    process: [
      "Apply online at bdris.gov.bd or at local Union Council",
      "Fill in the birth registration form with child's details",
      "Upload/submit required documents",
      "Verification by Union Council",
      "Birth certificate issued",
    ],
    fees: "Free (within 45 days) | ৳50–৳200 (after 45 days)",
    timeline: "7–30 working days",
    office: "Birth & Death Registration System (BDRIS) / Union Council",
    onlineUrl: "https://bdris.gov.bd",
    icon: "baby",
    isFeatured: true,
    tags: ["birth registration", "birth certificate", "bdris", "newborn", "child registration"],
  },
  {
    id: "birth-reg-delayed-001",
    slug: "delayed-birth-registration",
    name: "Delayed Birth Registration",
    shortName: "Delayed Birth Registration",
    category: "birth-certificate",
    categoryLabel: "Birth Certificate Registration",
    description: "Register a birth that was not registered within the mandatory 45-day period.",
    fullDescription: `When a birth is not registered within the mandatory 45-day period under the Birth and Death Registration Act 2004, a delayed registration process must be followed. This involves additional verification and may require a court order.

Delayed birth registration is common for individuals born before the digital registration system was implemented, or for cases where parents were unable to register on time.

The process requires additional documentation and verification compared to timely registration.`,
    requirements: [
      "Application form for delayed birth registration",
      "Affidavit stating reasons for delay",
      "Parents' NID cards (or death certificates if deceased)",
      "School certificate or other age proof",
      "Witness statements (2 or more)",
      "Court order (for very delayed cases)",
      "Fee payment receipt",
    ],
    process: [
      "Apply at local Union Council or BDRIS portal",
      "Submit affidavit explaining the delay",
      "Provide all supporting documents",
      "Verification by local government officials",
      "Court order may be required",
      "Birth certificate issued upon approval",
    ],
    fees: "৳100–৳500",
    timeline: "30–90 working days",
    office: "BDRIS / Union Council / Court",
    onlineUrl: "https://bdris.gov.bd",
    icon: "clock",
    isFeatured: false,
    tags: ["delayed birth registration", "late registration", "birth certificate", "court order"],
  },
  {
    id: "birth-cert-correction-001",
    slug: "birth-certificate-correction",
    name: "Birth Certificate Correction",
    shortName: "Birth Certificate Correction",
    category: "birth-certificate",
    categoryLabel: "Birth Certificate Registration",
    description: "Correct errors in your birth certificate such as name, date of birth, or parent names.",
    fullDescription: `Errors in birth certificates — such as misspelled names, incorrect dates of birth, or wrong parent names — can cause significant problems for legal and official purposes. The Birth & Death Registration Information System (BDRIS) allows corrections to be made to existing birth certificates.

Common corrections include:
- Name spelling corrections
- Date of birth correction
- Parent name corrections
- Gender correction
- Address correction

The correction process requires supporting documents to prove the correct information.`,
    requirements: [
      "Application form for correction",
      "Original birth certificate",
      "Supporting documents (NID, school certificate, etc.)",
      "Affidavit for correction",
      "Parents' NID copies",
      "Fee payment receipt",
    ],
    process: [
      "Apply online at bdris.gov.bd or at local Union Council",
      "Submit correction application with supporting documents",
      "Verification of corrected information",
      "Corrected birth certificate issued",
    ],
    fees: "৳50–৳200",
    timeline: "15–30 working days",
    office: "BDRIS / Union Council",
    onlineUrl: "https://bdris.gov.bd",
    icon: "edit-3",
    isFeatured: false,
    tags: ["birth certificate correction", "name correction", "date of birth correction", "bdris"],
  },
  {
    id: "birth-cert-copy-001",
    slug: "birth-certificate-copy",
    name: "Birth Certificate Copy (Duplicate)",
    shortName: "Birth Certificate Copy",
    category: "birth-certificate",
    categoryLabel: "Birth Certificate Registration",
    description: "Obtain a duplicate copy of your birth certificate if the original is lost or damaged.",
    fullDescription: `If your original birth certificate is lost, damaged, or destroyed, you can apply for a duplicate copy through the Birth & Death Registration Information System (BDRIS) or your local Union Council.

A duplicate birth certificate has the same legal validity as the original and can be used for all official purposes.

The duplicate certificate will have the same information as the original, with a note indicating it is a duplicate copy.`,
    requirements: [
      "Application form for duplicate certificate",
      "NID card copy",
      "Affidavit (if original was lost)",
      "Police report (if original was lost/stolen)",
      "Photographs",
      "Fee payment receipt",
    ],
    process: [
      "Apply online at bdris.gov.bd or at local Union Council",
      "Submit application with required documents",
      "Verification of identity and records",
      "Duplicate birth certificate issued",
    ],
    fees: "৳50–৳200",
    timeline: "7–15 working days",
    office: "BDRIS / Union Council",
    onlineUrl: "https://bdris.gov.bd",
    icon: "copy",
    isFeatured: false,
    tags: ["birth certificate copy", "duplicate certificate", "lost certificate", "bdris"],
  },
  {
    id: "birth-cert-verification-001",
    slug: "birth-certificate-verification",
    name: "Birth Certificate Online Verification",
    shortName: "Certificate Verification",
    category: "birth-certificate",
    categoryLabel: "Birth Certificate Registration",
    description: "Verify the authenticity of a birth certificate online through the BDRIS verification system.",
    fullDescription: `The Birth & Death Registration Information System (BDRIS) provides an online verification tool to check the authenticity of birth certificates. This is useful for:
- Employers verifying employee documents
- Educational institutions verifying student documents
- Government agencies processing applications
- International organizations verifying documents
- Individuals confirming their own certificate status

Verification is done using the birth registration number and can be completed in seconds.`,
    requirements: [
      "Birth registration number",
      "Name of certificate holder",
      "Date of birth",
    ],
    process: [
      "Visit the BDRIS verification portal",
      "Enter the birth registration number",
      "Enter the name and date of birth",
      "System displays verification status",
      "Download or print verification result",
    ],
    fees: "Free",
    timeline: "Instant",
    office: "BDRIS",
    onlineUrl: "https://bdris.gov.bd",
    icon: "check-circle",
    isFeatured: false,
    tags: ["birth certificate verification", "certificate check", "bdris", "authenticity"],
  },
  {
    id: "birth-reg-abroad-001",
    slug: "birth-registration-abroad",
    name: "Birth Registration Abroad (Embassy)",
    shortName: "Birth Registration Abroad",
    category: "birth-certificate",
    categoryLabel: "Birth Certificate Registration",
    description: "Register the birth of a Bangladeshi citizen's child born in a foreign country through the nearest embassy.",
    fullDescription: `When a child is born abroad to Bangladeshi citizen parents, the birth can be registered at the nearest Bangladesh Embassy or Consulate. This ensures the child has a Bangladeshi birth certificate and can exercise their rights as a Bangladeshi citizen.

Registration at embassy is important for:
- Obtaining Bangladeshi citizenship for the child
- Passport application
- Future travel to Bangladesh
- Inheritance and property rights

The process involves submitting documents to the embassy, which then forwards them to BDRIS in Bangladesh.`,
    requirements: [
      "Application form (from embassy)",
      "Parents' Bangladeshi passports",
      "Parents' NID cards",
      "Foreign birth certificate of the child",
      "Parents' marriage certificate",
      "Photographs of the child",
      "Fee payment receipt",
    ],
    process: [
      "Contact nearest Bangladesh Embassy/Consulate",
      "Submit application with all required documents",
      "Embassy verifies and forwards to BDRIS",
      "Registration processed in Bangladesh",
      "Birth certificate issued and collected from embassy",
    ],
    fees: "৳500–৳2,000 (embassy fees vary)",
    timeline: "2–4 months",
    office: "Bangladesh Embassy / Consulate",
    icon: "globe",
    isFeatured: false,
    tags: ["birth registration abroad", "embassy registration", "overseas birth", "bangladeshi abroad"],
  },
];

export function findGovtService(slug: string) {
  return govtServices.find((s) => s.slug === slug);
}

export function getGovtServicesByCategory(category: string) {
  return govtServices.filter((s) => s.category === category);
}
