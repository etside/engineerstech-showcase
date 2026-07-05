import { useEffect } from "react";
import { setPageMeta } from "@/lib/seo";

export default function Privacy() {
  useEffect(() => {
    setPageMeta(
      "Privacy Policy — engineersTech",
      "Read the engineersTech Privacy Policy. Learn how we collect, use, and protect your personal information.",
      "https://engineerstechbd.com/privacy",
    );
  }, []);

  return (
    <section className="container-tight py-16 max-w-3xl">
      <h1 className="display-2 mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: January 1, 2026</p>

      <div className="prose prose-invert max-w-none space-y-10 text-muted-foreground leading-relaxed">

        {/* 1. Information We Collect */}
        <div>
          <h2 className="text-foreground font-display text-2xl font-semibold mb-3">1. Information We Collect</h2>
          <p>We collect information in three ways: information you provide directly, information collected automatically when you use the Service, and information from third parties.</p>

          <h3 className="text-foreground font-semibold text-lg mt-5 mb-2">Information you provide</h3>
          <ul className="list-disc list-inside space-y-1.5">
            <li><strong className="text-foreground">Account data:</strong> name, email address, and password when you register.</li>
            <li><strong className="text-foreground">Business listing data:</strong> company name, description, services, location, contact details, logo, and any other content you publish in your listing.</li>
            <li><strong className="text-foreground">Payment data:</strong> billing address and payment method details processed by our payment processors (SSLCommerz / Stripe). We do not store full card numbers.</li>
            <li><strong className="text-foreground">Communications:</strong> messages you send via our contact form, support tickets, or email correspondence.</li>
            <li><strong className="text-foreground">Reviews:</strong> text, ratings, and any media you submit when writing a review.</li>
          </ul>

          <h3 className="text-foreground font-semibold text-lg mt-5 mb-2">Information collected automatically</h3>
          <ul className="list-disc list-inside space-y-1.5">
            <li><strong className="text-foreground">Usage data:</strong> pages visited, features used, search queries, click patterns, and session duration.</li>
            <li><strong className="text-foreground">Device and network data:</strong> IP address, browser type and version, operating system, referring URLs, and approximate geographic location derived from IP.</li>
            <li><strong className="text-foreground">Cookies and similar technologies:</strong> see Section 4 for details.</li>
          </ul>

          <h3 className="text-foreground font-semibold text-lg mt-5 mb-2">Information from third parties</h3>
          <ul className="list-disc list-inside space-y-1.5">
            <li>If you sign in via Google OAuth, we receive your name, email address, and profile picture from Google, subject to Google's privacy policy.</li>
            <li>We may receive fraud-prevention signals from our payment processors.</li>
          </ul>
        </div>

        {/* 2. How We Use Information */}
        <div>
          <h2 className="text-foreground font-display text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p>We use the information we collect for the following purposes:</p>
          <ul className="list-disc list-inside mt-3 space-y-1.5">
            <li><strong className="text-foreground">Provide the Service:</strong> create and manage your account, display your listing, process payments, and deliver support.</li>
            <li><strong className="text-foreground">AI discovery features:</strong> generate GEO Scores, AI summaries, and structured-data embeddings to surface your listing in search and LLM recommendations.</li>
            <li><strong className="text-foreground">Communications:</strong> send transactional emails (receipts, password resets, listing status updates) and, with your consent, marketing and product update emails.</li>
            <li><strong className="text-foreground">Safety and fraud prevention:</strong> detect and investigate abuse, fraudulent reviews, unauthorized access, and other security incidents.</li>
            <li><strong className="text-foreground">Analytics and improvement:</strong> understand how users interact with the Service so we can improve features, performance, and content.</li>
            <li><strong className="text-foreground">Legal compliance:</strong> comply with applicable laws, regulations, and lawful requests from public authorities.</li>
          </ul>
          <p className="mt-3">
            We will not sell your personal information to third parties. We will not use your personal information to train external AI models without your explicit consent.
          </p>
        </div>

        {/* 3. Sharing */}
        <div>
          <h2 className="text-foreground font-display text-2xl font-semibold mb-3">3. Sharing Your Information</h2>
          <p>We share your information only in the following circumstances:</p>
          <ul className="list-disc list-inside mt-3 space-y-1.5">
            <li><strong className="text-foreground">Public listing data:</strong> information you publish in your business listing (name, description, services, location, contact details, reviews) is publicly visible and indexed by search engines and LLMs.</li>
            <li><strong className="text-foreground">Service providers:</strong> we share data with trusted vendors who help us operate the Service, including cloud hosting (Supabase / AWS), payment processors (SSLCommerz, Stripe), email delivery (Resend), and analytics tools. These providers are contractually bound to use your data only as instructed by us.</li>
            <li><strong className="text-foreground">Legal requirements:</strong> we may disclose your information if required by law, court order, or governmental authority, or if we believe disclosure is necessary to protect the rights, property, or safety of engineersTech, our users, or the public.</li>
            <li><strong className="text-foreground">Business transfers:</strong> in the event of a merger, acquisition, or sale of assets, your information may be transferred to the successor entity, subject to equivalent privacy protections.</li>
            <li><strong className="text-foreground">With your consent:</strong> we may share your information for any other purpose with your explicit consent.</li>
          </ul>
        </div>

        {/* 4. Cookies */}
        <div>
          <h2 className="text-foreground font-display text-2xl font-semibold mb-3">4. Cookies &amp; Tracking Technologies</h2>
          <p>We use cookies and similar technologies to operate and improve the Service. Specifically:</p>
          <ul className="list-disc list-inside mt-3 space-y-1.5">
            <li><strong className="text-foreground">Strictly necessary cookies:</strong> required for authentication, session management, and core functionality. Cannot be disabled without breaking the Service.</li>
            <li><strong className="text-foreground">Analytics cookies:</strong> help us understand usage patterns and measure platform performance (e.g., page views, feature adoption). We use anonymized or aggregated data where possible.</li>
            <li><strong className="text-foreground">Preference cookies:</strong> remember your settings, such as theme and language preferences.</li>
          </ul>
          <p className="mt-3">
            You can control cookies through your browser settings. Disabling non-essential cookies will not prevent you from using the core Service. Where required by law, we will ask for your consent before placing non-essential cookies.
          </p>
        </div>

        {/* 5. Data Retention */}
        <div>
          <h2 className="text-foreground font-display text-2xl font-semibold mb-3">5. Data Retention</h2>
          <p>We retain your personal information for as long as your account is active or as needed to provide the Service. Specifically:</p>
          <ul className="list-disc list-inside mt-3 space-y-1.5">
            <li><strong className="text-foreground">Account data:</strong> retained while your account is open and for 90 days after deletion, after which it is permanently purged.</li>
            <li><strong className="text-foreground">Billing records:</strong> retained for 7 years to comply with financial and tax regulations.</li>
            <li><strong className="text-foreground">Listing content:</strong> removed within 30 days after account deletion, unless required to be retained by law or to resolve a dispute.</li>
            <li><strong className="text-foreground">Server logs:</strong> retained for up to 12 months for security monitoring, then deleted.</li>
          </ul>
        </div>

        {/* 6. Your Rights (GDPR/CCPA) */}
        <div>
          <h2 className="text-foreground font-display text-2xl font-semibold mb-3">6. Your Rights (GDPR &amp; CCPA)</h2>
          <p>
            Depending on your location, you may have the following rights regarding your personal information.
            To exercise any of these rights, contact us at{" "}
            <a href="mailto:privacy@engineerstechbd.com" className="text-primary-light hover:underline">privacy@engineerstechbd.com</a>.
          </p>

          <h3 className="text-foreground font-semibold text-lg mt-5 mb-2">For users in the European Economic Area (GDPR)</h3>
          <ul className="list-disc list-inside space-y-1.5">
            <li><strong className="text-foreground">Access:</strong> request a copy of the personal data we hold about you.</li>
            <li><strong className="text-foreground">Rectification:</strong> request correction of inaccurate or incomplete data.</li>
            <li><strong className="text-foreground">Erasure ("right to be forgotten"):</strong> request deletion of your personal data, subject to legal retention requirements.</li>
            <li><strong className="text-foreground">Restriction:</strong> request that we limit how we process your data in certain circumstances.</li>
            <li><strong className="text-foreground">Portability:</strong> receive your data in a structured, machine-readable format.</li>
            <li><strong className="text-foreground">Objection:</strong> object to processing based on legitimate interests or for direct marketing.</li>
            <li><strong className="text-foreground">Withdraw consent:</strong> where processing is based on consent, you may withdraw it at any time.</li>
          </ul>
          <p className="mt-3">
            You also have the right to lodge a complaint with your local data protection authority.
          </p>

          <h3 className="text-foreground font-semibold text-lg mt-5 mb-2">For California residents (CCPA / CPRA)</h3>
          <ul className="list-disc list-inside space-y-1.5">
            <li><strong className="text-foreground">Know:</strong> request disclosure of the categories and specific pieces of personal information we have collected about you.</li>
            <li><strong className="text-foreground">Delete:</strong> request deletion of personal information we have collected, subject to certain exceptions.</li>
            <li><strong className="text-foreground">Correct:</strong> request correction of inaccurate personal information.</li>
            <li><strong className="text-foreground">Opt out of sale/sharing:</strong> we do not sell or share personal information for cross-context behavioral advertising. No action is required.</li>
            <li><strong className="text-foreground">Non-discrimination:</strong> we will not discriminate against you for exercising your privacy rights.</li>
          </ul>
        </div>

        {/* 7. Security */}
        <div>
          <h2 className="text-foreground font-display text-2xl font-semibold mb-3">7. Security</h2>
          <p>
            We implement industry-standard technical and organizational measures to protect your personal
            information from unauthorized access, disclosure, alteration, or destruction. These measures include:
          </p>
          <ul className="list-disc list-inside mt-3 space-y-1.5">
            <li>Encryption of data in transit using TLS 1.2 or higher.</li>
            <li>Encryption of sensitive data at rest using AES-256.</li>
            <li>Role-based access controls ensuring only authorized personnel can access personal data.</li>
            <li>Regular security audits and vulnerability assessments.</li>
            <li>Incident response procedures with mandatory breach notification within 72 hours where required by law.</li>
          </ul>
          <p className="mt-3">
            No security system is impenetrable. We cannot guarantee the absolute security of your information.
            If you believe your account has been compromised, contact us immediately at{" "}
            <a href="mailto:security@engineerstechbd.com" className="text-primary-light hover:underline">security@engineerstechbd.com</a>.
          </p>
        </div>

        {/* 8. Children */}
        <div>
          <h2 className="text-foreground font-display text-2xl font-semibold mb-3">8. Children's Privacy</h2>
          <p>
            The Service is not directed to individuals under the age of 16 (or 13 in the United States). We do
            not knowingly collect personal information from children. If we become aware that we have collected
            personal information from a child under the applicable minimum age, we will take steps to delete that
            information promptly. If you believe a child has provided us with their personal information, please
            contact us at{" "}
            <a href="mailto:privacy@engineerstechbd.com" className="text-primary-light hover:underline">privacy@engineerstechbd.com</a>.
          </p>
        </div>

        {/* 9. Changes */}
        <div>
          <h2 className="text-foreground font-display text-2xl font-semibold mb-3">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices, technologies,
            legal requirements, or other factors. When we make material changes, we will update the "Last updated"
            date at the top of this page and provide additional notice as required by applicable law (e.g., via
            email or an in-app banner). We encourage you to review this policy periodically.
          </p>
        </div>

        {/* 10. Contact */}
        <div>
          <h2 className="text-foreground font-display text-2xl font-semibold mb-3">10. Contact Us</h2>
          <p>
            If you have questions, concerns, or requests regarding this Privacy Policy or our data practices,
            please contact our Privacy team:
          </p>
          <address className="not-italic mt-3 space-y-1">
            <div className="font-semibold text-foreground">engineersTech — Privacy Team</div>
            <div>Email: <a href="mailto:privacy@engineerstechbd.com" className="text-primary-light hover:underline">privacy@engineerstechbd.com</a></div>
            <div>Contact form: <a href="/contact" className="text-primary-light hover:underline">engineerstechbd.com/contact</a></div>
          </address>
          <p className="mt-3">
            We will respond to verifiable requests within 30 days. For EEA users, if you are not satisfied
            with our response, you have the right to lodge a complaint with your national data protection authority.
          </p>
        </div>

      </div>
    </section>
  );
}
