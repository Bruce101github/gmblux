import SEOHead from "@/components/SEOHead";
import { FileText, Scale, AlertCircle } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <>
      <SEOHead
        title="Terms and Conditions - GMB Luxury Properties | Legal Terms of Service"
        description="Read GMB Real Estate Ghana's terms and conditions. Understand the legal terms governing your use of our real estate services, property listings, and website in Ghana."
        keywords="terms and conditions Ghana, real estate terms, property brokerage terms, GMB terms of service, legal terms Ghana, property service agreement"
      />
      <div className="min-h-screen bg-[#121420] text-white px-[5%] py-10 lg:py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="text-yellow-400" size={32} />
              <h1 className="text-4xl lg:text-5xl font-bold">Terms and Conditions</h1>
            </div>
            <p className="text-lg text-white/70">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Introduction */}
          <section className="space-y-4">
            <p className="text-lg text-white/80 leading-relaxed">
              Welcome to GMB Real Estate Ghana ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your access to and use of our website, services, and property listings. By accessing or using our services, you agree to be bound by these Terms.
            </p>
            <p className="text-lg text-white/80 leading-relaxed">
              If you do not agree with any part of these Terms, you must not use our services. We reserve the right to modify these Terms at any time, and your continued use constitutes acceptance of any changes.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
              <FileText className="text-yellow-400" size={24} />
              Acceptance of Terms
            </h2>
            <p className="text-white/80 leading-relaxed">
              By accessing our website, using our services, or contacting us regarding properties, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. These Terms apply to all users, including property seekers, property owners, and visitors to our website.
            </p>
          </section>

          {/* Services Description */}
          <section className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">Our Services</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              GMB Real Estate Ghana provides the following services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
              <li>Real estate consultation and brokerage services</li>
              <li>Property listings for sale and rent</li>
              <li>Property viewing arrangements</li>
              <li>Booking and reservation services</li>
              <li>Property information and market insights</li>
              <li>Client consultation to identify ideal property needs</li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">User Responsibilities</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              When using our services, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Use our services only for lawful purposes</li>
              <li>Respect property owners' rights and property conditions</li>
              <li>Not engage in fraudulent, deceptive, or illegal activities</li>
              <li>Not interfere with or disrupt our services or website</li>
              <li>Not use automated systems to access our website without permission</li>
              <li>Maintain the confidentiality of any account credentials</li>
            </ul>
          </section>

          {/* Property Information */}
          <section className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
              <AlertCircle className="text-yellow-400" size={24} />
              Property Information and Accuracy
            </h2>
            <p className="text-white/80 leading-relaxed">
              While we strive to provide accurate property information, we do not guarantee the completeness, accuracy, or reliability of any property details, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80 ml-4 mt-4">
              <li>Property prices, sizes, and specifications</li>
              <li>Property availability and status</li>
              <li>Property condition and features</li>
              <li>Location details and neighborhood information</li>
              <li>Legal status and documentation</li>
            </ul>
            <p className="text-white/80 leading-relaxed mt-4">
              All property information is provided "as is" and should be verified independently. We recommend conducting your own due diligence, including property inspections, legal verification, and professional assessments before making any property decisions.
            </p>
          </section>

          {/* Bookings and Reservations */}
          <section className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">Bookings and Reservations</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              When you make a booking or reservation through our services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
              <li>Bookings are subject to property availability and owner approval</li>
              <li>We act as intermediaries between you and property owners</li>
              <li>All bookings are subject to our Cancellation Policy</li>
              <li>Deposits and payments are subject to the terms agreed with property owners</li>
              <li>We reserve the right to cancel bookings if property becomes unavailable</li>
              <li>Booking confirmations are subject to verification and approval</li>
            </ul>
          </section>

          {/* Fees and Payments */}
          <section className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">Fees and Payments</h2>
            <p className="text-white/80 leading-relaxed">
              Our brokerage fees, commission structures, and payment terms will be clearly communicated before any transaction. All fees are subject to negotiation and agreement between parties. Property prices, rental rates, and deposits are set by property owners and may be subject to change without notice.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">Intellectual Property</h2>
            <p className="text-white/80 leading-relaxed">
              All content on our website, including property images, descriptions, logos, and text, is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or use our content without prior written permission.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">Limitation of Liability</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              To the maximum extent permitted by law:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
              <li>We provide our services "as is" without warranties of any kind</li>
              <li>We are not liable for any indirect, incidental, or consequential damages</li>
              <li>Our liability is limited to the amount of fees paid for our services</li>
              <li>We are not responsible for property defects, legal issues, or disputes between parties</li>
              <li>We act as intermediaries and are not party to property transactions</li>
            </ul>
          </section>

          {/* Indemnification */}
          <section className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">Indemnification</h2>
            <p className="text-white/80 leading-relaxed">
              You agree to indemnify and hold harmless GMB Real Estate Ghana, its employees, agents, and partners from any claims, damages, losses, or expenses arising from your use of our services, violation of these Terms, or infringement of any rights of another party.
            </p>
          </section>

          {/* Termination */}
          <section className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">Termination</h2>
            <p className="text-white/80 leading-relaxed">
              We reserve the right to terminate or suspend your access to our services at any time, without prior notice, for any violation of these Terms or for any other reason we deem necessary. You may discontinue use of our services at any time.
            </p>
          </section>

          {/* Governing Law */}
          <section className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">Governing Law</h2>
            <p className="text-white/80 leading-relaxed">
              These Terms are governed by and construed in accordance with the laws of Ghana. Any disputes arising from these Terms or our services shall be subject to the exclusive jurisdiction of the courts of Ghana.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-white/5 rounded-lg p-6 border border-white/10 mt-8">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              If you have questions about these Terms and Conditions, please contact us:
            </p>
            <div className="space-y-2 text-white/80">
              <p><strong>GMB Real Estate Ghana</strong></p>
              <p>Phone: <a href="tel:+233553944428" className="text-yellow-400 hover:underline">+233 55 394 4428</a></p>
              <p>Email: <a href="mailto:info@gmblux.com" className="text-yellow-400 hover:underline">info@gmblux.com</a></p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
