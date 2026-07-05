import { useEffect } from "react";
import { setPageMeta } from "@/lib/seo";

export default function Terms() {
  useEffect(() => {
    setPageMeta(
      "Terms of Service — engineersTech",
      "Read the engineersTech Terms of Service. Learn about your rights and responsibilities when using our AI-powered business directory.",
      "https://engineerstechbd.com/terms",
    );
  }, []);

  return (
    <section className="container-tight py-16 max-w-3xl">
      <h1 className="display-2 mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: January 1, 2026</p>

      <div className="prose prose-invert max-w-none space-y-10 text-muted-foreground leading-relaxed">

        {/* 1. Acceptance */}
        <div>
          <h2 className="text-foreground font-display text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the engineersTech platform — including our website at{" "}
            <a href="https://engineerstechbd.com" className="text-primary-light hover:underline">engineerstechbd.com</a>,
            mobile applications, APIs, and any related services (collectively, the "Service") — you agree to be bound
            by these Terms of Service ("Terms") and our Privacy Policy. If you are accessing the Service on behalf of
            a company or other legal entity, you represent that you have authority to bind that entity to these Terms.
            If you do not agree to all of these Terms, do not use the Service.
          </p>
          <p className="mt-3">
            We may update these Terms from time to time. Continued use of the Service after changes are posted
            constitutes your acceptance of the revised Terms. We will notify registered users of material changes
            via email or an in-app notice at least 14 days before they take effect.
          </p>
        </div>

        {/* 2. Services */}
        <div>
          <h2 className="text-foreground font-display text-2xl font-semibold mb-3">2. Description of Services</h2>
          <p>
            engineersTech is an AI-powered business directory and discovery platform designed to help engineers,
            technology professionals, and procurement teams find, evaluate, and connect with verified agencies,
            software companies, and service providers. Our platform uses proprietary AI scoring ("GEO Score") to
            rank and surface listings across both traditional search engines and large language model (LLM) queries.
          </p>
          <p className="mt-3">
            The Service includes: business listing creation and management, user reviews and ratings, AI-generated
            summaries, structured data API endpoints, subscription billing, and related communications. We reserve
            the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice.
          </p>
        </div>

        {/* 3. User Accounts */}
        <div>
          <h2 className="text-foreground font-display text-2xl font-semibold mb-3">3. User Accounts</h2>
          <p>
            To access certain features of the Service — including submitting a listing, writing reviews, or
            accessing the dashboard — you must create an account. You agree to:
          </p>
          <ul className="list-disc list-inside mt-3 space-y-1.5">
            <li>Provide accurate, current, and complete information during registration.</li>
            <li>Maintain and promptly update your account information to keep it accurate.</li>
            <li>Keep your password confidential and not share your credentials with any third party.</li>
            <li>Notify us immediately at <a href="mailto:security@engineerstechbd.com" className="text-primary-light hover:underline">security@engineerstechbd.com</a> of any unauthorized use of your account.</li>
            <li>Accept responsibility for all activities that occur under your account.</li>
          </ul>
          <p className="mt-3">
            We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent
            activity, or remain inactive for more than 24 consecutive months without a paid subscription.
          </p>
        </div>

        {/* 4. Listings & Content */}
        <div>
          <h2 className="text-foreground font-display text-2xl font-semibold mb-3">4. Listings &amp; Content</h2>
          <p>
            You retain full ownership of the content you submit to the Service, including business descriptions,
            logos, service lists, contact information, and other materials ("Listing Content"). By submitting
            Listing Content, you grant engineersTech a worldwide, non-exclusive, royalty-free, sublicensable
            license to:
          </p>
          <ul className="list-disc list-inside mt-3 space-y-1.5">
            <li>Display your Listing Content on the engineersTech platform and related properties.</li>
            <li>Index and distribute your Listing Content via our public structured-data and JSON-LD endpoints for LLM and search-engine discovery.</li>
            <li>Create AI-generated summaries and embeddings derived from your Listing Content to power search and recommendation features.</li>
            <li>Reproduce, adapt, and distribute your Listing Content for the purpose of operating and promoting the Service.</li>
          </ul>
          <p className="mt-3">
            You represent and warrant that: (a) you have the right to submit the Listing Content; (b) the Listing
            Content is accurate and not misleading; (c) the Listing Content does not infringe any third-party
            intellectual property, privacy, or other rights; and (d) the business described in the listing is a
            legitimate operating entity.
          </p>
          <p className="mt-3">
            engineersTech reserves the right to review, edit, or remove any Listing Content that violates these
            Terms or that we determine, in our sole discretion, to be harmful to users or the platform.
          </p>
        </div>

        {/* 5. Reviews & Ratings */}
        <div>
          <h2 className="text-foreground font-display text-2xl font-semibold mb-3">5. Reviews &amp; Ratings</h2>
          <p>
            Our review and rating system is designed to give buyers genuine, trustworthy insight into listed
            businesses. By submitting a review, you agree that:
          </p>
          <ul className="list-disc list-inside mt-3 space-y-1.5">
            <li>Your review reflects your honest, first-hand experience with the business you are reviewing.</li>
            <li>You have no undisclosed financial or personal relationship with the business that would create a conflict of interest.</li>
            <li>You will not submit reviews in exchange for payment, discounts, or other incentives from the reviewed business.</li>
            <li>You will not submit multiple reviews for the same business from different accounts.</li>
          </ul>
          <p className="mt-3">
            engineersTech uses automated and manual processes to detect fraudulent reviews. Businesses found to
            be soliciting fake reviews may have their listings removed without refund. Users found submitting
            fraudulent reviews will have their accounts permanently suspended.
          </p>
          <p className="mt-3">
            Businesses may report reviews they believe violate these Terms by contacting{" "}
            <a href="mailto:trust@engineerstechbd.com" className="text-primary-light hover:underline">trust@engineerstechbd.com</a>.
            We will investigate reported reviews and remove those that clearly violate our policies.
          </p>
        </div>

        {/* 6. Paid Plans & Billing */}
        <div>
          <h2 className="text-foreground font-display text-2xl font-semibold mb-3">6. Paid Plans &amp; Billing</h2>
          <p>
            Certain features of the Service — including verified listing badges, featured placements, and advanced
            analytics — require a paid subscription. By purchasing a paid plan, you agree to the following:
          </p>
          <ul className="list-disc list-inside mt-3 space-y-1.5">
            <li><strong className="text-foreground">Automatic renewal:</strong> Subscriptions renew automatically at the end of each billing period unless cancelled before the renewal date.</li>
            <li><strong className="text-foreground">Cancellation:</strong> You may cancel your subscription at any time from your Dashboard. Cancellation takes effect at the end of your current billing period; no partial refunds are issued for unused time.</li>
            <li><strong className="text-foreground">Refunds:</strong> Payments are non-refundable except where required by applicable law or where explicitly stated in a written agreement with engineersTech.</li>
            <li><strong className="text-foreground">Price changes:</strong> We may change subscription prices with at least 30 days' notice. If you do not cancel before the new price takes effect, you agree to be charged the updated rate.</li>
            <li><strong className="text-foreground">Taxes:</strong> Prices displayed are exclusive of applicable taxes. You are responsible for all taxes associated with your subscription in your jurisdiction.</li>
          </ul>
          <p className="mt-3">
            Payments are processed via SSLCommerz (BDT) and Stripe (USD). engineersTech does not store full
            payment card details. All payment processing is governed by the applicable payment processor's terms.
          </p>
        </div>

        {/* 7. Intellectual Property */}
        <div>
          <h2 className="text-foreground font-display text-2xl font-semibold mb-3">7. Intellectual Property</h2>
          <p>
            The engineersTech name, logo, platform design, GEO Score algorithm, AI summary technology, and all
            other platform elements (excluding Listing Content submitted by users) are the exclusive intellectual
            property of engineersTech and its licensors, protected by copyright, trademark, and other applicable
            laws. You may not reproduce, distribute, modify, or create derivative works from any part of the
            Service without our prior written consent.
          </p>
          <p className="mt-3">
            You may display the "Listed on engineersTech" badge on your website or marketing materials, subject
            to our Brand Guidelines. This limited license may be revoked at any time.
          </p>
        </div>

        {/* 8. Privacy */}
        <div>
          <h2 className="text-foreground font-display text-2xl font-semibold mb-3">8. Privacy</h2>
          <p>
            Your use of the Service is also governed by our{" "}
            <a href="/privacy" className="text-primary-light hover:underline">Privacy Policy</a>, which is
            incorporated into these Terms by reference. Please review it carefully to understand how we collect,
            use, and protect your information.
          </p>
        </div>

        {/* 9. Prohibited Conduct */}
        <div>
          <h2 className="text-foreground font-display text-2xl font-semibold mb-3">9. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc list-inside mt-3 space-y-1.5">
            <li>Submit false, misleading, or deceptive listing information or reviews.</li>
            <li>Use the Service to transmit spam, phishing messages, or unsolicited commercial communications.</li>
            <li>Attempt to gain unauthorized access to any part of the Service or another user's account.</li>
            <li>Scrape, crawl, or systematically extract data from the Service without our express written permission (API users must comply with the API Terms).</li>
            <li>Use automated bots or scripts to manipulate ratings, review counts, or search rankings.</li>
            <li>Reverse-engineer, decompile, or disassemble any part of the Service.</li>
            <li>Impersonate any person or entity, or misrepresent your affiliation with a person or entity.</li>
            <li>Use the Service for any unlawful purpose or in violation of any applicable law or regulation.</li>
            <li>Post content that is defamatory, harassing, obscene, or that infringes any third-party right.</li>
            <li>Interfere with or disrupt the integrity or performance of the Service or its infrastructure.</li>
          </ul>
        </div>

        {/* 10. Disclaimers */}
        <div>
          <h2 className="text-foreground font-display text-2xl font-semibold mb-3">10. Disclaimers</h2>
          <p>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
            IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
            AND NON-INFRINGEMENT. engineersTech does not warrant that the Service will be uninterrupted, error-free,
            or free of viruses or other harmful components.
          </p>
          <p className="mt-3">
            engineersTech does not endorse, guarantee, or assume responsibility for any business, product, or
            service advertised or offered through the Service. We do not verify the accuracy of all Listing Content
            and make no representations regarding the quality, safety, or legality of listed businesses.
          </p>
          <p className="mt-3">
            AI-generated summaries and GEO Scores are provided for informational purposes only and should not be
            relied upon as professional recommendations. Results may be inaccurate or outdated.
          </p>
        </div>

        {/* 11. Limitation of Liability */}
        <div>
          <h2 className="text-foreground font-display text-2xl font-semibold mb-3">11. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL engineersTech, ITS OFFICERS,
            DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
            CONSEQUENTIAL, OR PUNITIVE DAMAGES — INCLUDING LOSS OF PROFITS, LOSS OF DATA, LOSS OF GOODWILL,
            SERVICE INTERRUPTION, OR COST OF SUBSTITUTE SERVICES — ARISING OUT OF OR IN CONNECTION WITH THESE
            TERMS OR THE SERVICE, WHETHER BASED ON CONTRACT, TORT, STRICT LIABILITY, OR ANY OTHER LEGAL THEORY,
            EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          </p>
          <p className="mt-3">
            OUR TOTAL CUMULATIVE LIABILITY TO YOU FOR ANY CLAIMS ARISING UNDER THESE TERMS SHALL NOT EXCEED THE
            GREATER OF (A) THE AMOUNT YOU PAID TO US IN THE 12 MONTHS PRECEDING THE CLAIM, OR (B) USD 100.
          </p>
        </div>

        {/* 12. Governing Law */}
        <div>
          <h2 className="text-foreground font-display text-2xl font-semibold mb-3">12. Governing Law &amp; Dispute Resolution</h2>
          <p>
            These Terms are governed by and construed in accordance with the laws of Bangladesh, without regard to
            its conflict-of-law principles. Any dispute arising out of or relating to these Terms or the Service
            shall first be attempted to be resolved through good-faith negotiation. If unresolved within 30 days,
            disputes shall be submitted to binding arbitration administered in Dhaka, Bangladesh, except that
            either party may seek injunctive or other equitable relief in any court of competent jurisdiction.
          </p>
          <p className="mt-3">
            If you are a consumer located in the European Union, you may also have recourse through the EU Online
            Dispute Resolution platform at{" "}
            <a href="https://ec.europa.eu/consumers/odr" className="text-primary-light hover:underline" target="_blank" rel="noreferrer">
              ec.europa.eu/consumers/odr
            </a>.
          </p>
        </div>

        {/* 13. Changes */}
        <div>
          <h2 className="text-foreground font-display text-2xl font-semibold mb-3">13. Changes to These Terms</h2>
          <p>
            We reserve the right to update these Terms at any time. When we make material changes, we will update
            the "Last updated" date at the top of this page and, where required by law, provide additional notice
            such as an email or in-app notification. Your continued use of the Service after the effective date
            of the revised Terms constitutes your acceptance of the changes.
          </p>
        </div>

        {/* 14. Contact */}
        <div>
          <h2 className="text-foreground font-display text-2xl font-semibold mb-3">14. Contact</h2>
          <p>
            If you have questions about these Terms, please contact us:
          </p>
          <address className="not-italic mt-3 space-y-1">
            <div className="font-semibold text-foreground">engineersTech</div>
            <div>Email: <a href="mailto:legal@engineerstechbd.com" className="text-primary-light hover:underline">legal@engineerstechbd.com</a></div>
            <div>Support: <a href="/contact" className="text-primary-light hover:underline">engineerstechbd.com/contact</a></div>
          </address>
        </div>

      </div>
    </section>
  );
}
