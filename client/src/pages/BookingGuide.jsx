import SEOHead from "@/components/SEOHead";
import { BookOpen, CheckCircle, FileCheck, Phone, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export default function BookingGuide() {
  return (
    <>
      <SEOHead
        title="Booking Guide - GMB Luxury Properties | How to Book Properties in Ghana"
        description="Complete guide to booking properties with GMB Real Estate Ghana. Learn the step-by-step process for renting or buying properties, required documents, and booking procedures."
        keywords="property booking guide Ghana, how to book property Ghana, real estate booking process, property rental guide, house booking steps Ghana"
      />
      <div className="min-h-screen bg-[#121420] text-white px-[5%] pt-24 pb-10 lg:pt-28 lg:pb-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="text-yellow-400" size={32} />
              <h1 className="text-4xl lg:text-5xl font-bold">Booking Guide</h1>
            </div>
            <p className="text-lg text-white/70">
              Your step-by-step guide to booking properties with GMB Real Estate Ghana
            </p>
          </div>

          {/* Introduction */}
          <section className="space-y-4">
            <p className="text-lg text-white/80 leading-relaxed">
              Booking a property through GMB Real Estate Ghana is a straightforward process designed to be transparent and stress-free. This guide will walk you through everything you need to know to successfully book your dream property.
            </p>
          </section>

          {/* Step-by-Step Process */}
          <section className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">Booking Process</h2>
            
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center text-lg">
                    1
                  </div>
                  <h3 className="text-2xl font-semibold">Browse Properties</h3>
                </div>
                <p className="text-white/80 leading-relaxed">
                  Explore our curated selection of properties on our website. Use filters to narrow down options by location, price range, property type, bedrooms, and other preferences. Each listing includes detailed information, high-quality images, and property specifications.
                </p>
                <Link to="/listings" className="text-yellow-400 hover:underline mt-3 inline-block">
                  Browse Properties →
                </Link>
              </div>

              {/* Step 2 */}
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center text-lg">
                    2
                  </div>
                  <h3 className="text-2xl font-semibold">Schedule a Viewing</h3>
                </div>
                <p className="text-white/80 leading-relaxed">
                  Once you find a property of interest, schedule a viewing to see it in person. You can request a viewing through our booking form, by phone, or via WhatsApp. We recommend viewing properties before making a booking decision.
                </p>
                <p className="text-white/80 leading-relaxed mt-3">
                  <strong>Viewing Options:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-white/80 ml-4 mt-2">
                  <li>Property tour</li>
                  <li>Virtual consultation</li>
                  <li>Detailed property walkthrough</li>
                </ul>
              </div>

              {/* Step 3 */}
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center text-lg">
                    3
                  </div>
                  <h3 className="text-2xl font-semibold">Submit Booking Request</h3>
                </div>
                <p className="text-white/80 leading-relaxed">
                  After viewing and deciding on a property, submit a booking request through our online form. Provide accurate information including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4 mt-3">
                  <li>Your full name and contact details</li>
                  <li>Property ID or address</li>
                  <li>Desired move-in date (for rentals) or purchase timeline</li>
                  <li>Any special requirements or questions</li>
                  <li>Your message to the property owner</li>
                </ul>
              </div>

              {/* Step 4 */}
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center text-lg">
                    4
                  </div>
                  <h3 className="text-2xl font-semibold">Consultation & Verification</h3>
                </div>
                <p className="text-white/80 leading-relaxed">
                  Our team will contact you to discuss your requirements, verify your information, and answer any questions. We'll also confirm property availability and discuss terms, pricing, and next steps.
                </p>
              </div>

              {/* Step 5 */}
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center text-lg">
                    5
                  </div>
                  <h3 className="text-2xl font-semibold">Documentation & Agreement</h3>
                </div>
                <p className="text-white/80 leading-relaxed mb-3">
                  Once terms are agreed upon, you'll need to provide:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li>Valid identification (National ID, Passport, or Driver's License)</li>
                  <li>Proof of income or financial capability</li>
                  <li>References (for rentals)</li>
                  <li>Any other documents required by the property owner</li>
                </ul>
                <p className="text-white/80 leading-relaxed mt-3">
                  We'll prepare the necessary agreements and contracts for review.
                </p>
              </div>

              {/* Step 6 */}
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center text-lg">
                    6
                  </div>
                  <h3 className="text-2xl font-semibold">Payment & Deposit</h3>
                </div>
                <p className="text-white/80 leading-relaxed">
                  Secure your booking with the required deposit or down payment. Payment terms will be clearly outlined in your agreement. We accept various payment methods and will provide secure payment instructions.
                </p>
              </div>

              {/* Step 7 */}
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center text-lg">
                    7
                  </div>
                  <h3 className="text-2xl font-semibold">Confirmation & Move-In</h3>
                </div>
                <p className="text-white/80 leading-relaxed">
                  Once payment is confirmed and all documentation is complete, you'll receive booking confirmation. We'll coordinate move-in arrangements, key handover, and provide you with all necessary property information.
                </p>
              </div>
            </div>
          </section>

          {/* Important Information */}
          <section className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold flex items-center gap-3">
              <CheckCircle className="text-yellow-400" size={28} />
              Important Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">Booking Timeline</h3>
                <p className="text-white/80">
                  The booking process typically takes 3-7 business days, depending on document verification and property owner response times. We'll keep you informed throughout the process.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">Deposit Requirements</h3>
                <p className="text-white/80">
                  Deposit amounts vary by property and are typically 1-3 months' rent for rentals or 10-20% for purchases. Exact amounts will be specified in your agreement.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">Cancellation Policy</h3>
                <p className="text-white/80">
                  Cancellation terms depend on timing and property type. Please review our <Link to="/cancellation-policy" className="text-yellow-400 hover:underline">Cancellation Policy</Link> for details.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">Our Role</h3>
                <p className="text-white/80">
                  We act as intermediaries between you and property owners, facilitating the booking process and ensuring transparency throughout.
                </p>
              </div>
            </div>
          </section>

          {/* Tips for Success */}
          <section className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold">Tips for a Successful Booking</h2>
            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-6 space-y-3">
              <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                <li>View properties in person before committing</li>
                <li>Have your documents ready before starting the booking process</li>
                <li>Ask questions and clarify all terms before signing</li>
                <li>Read all agreements carefully</li>
                <li>Keep communication open with our team</li>
                <li>Be responsive to requests for information or documentation</li>
                <li>Plan your move-in timeline realistically</li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-white/5 rounded-lg p-6 border border-white/10 mt-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Phone className="text-yellow-400" size={24} />
              Need Help with Booking?
            </h2>
            <p className="text-white/80 leading-relaxed mb-4">
              Our team is here to guide you through every step of the booking process. Contact us for assistance:
            </p>
            <div className="space-y-2 text-white/80">
              <p><strong>GMB Real Estate Ghana</strong></p>
              <p>Phone: <a href="tel:+233553944428" className="text-yellow-400 hover:underline">+233 55 394 4428</a></p>
              <p>Email: <a href="mailto:info@gmblux.com" className="text-yellow-400 hover:underline">info@gmblux.com</a></p>
              <p className="mt-4">
                <Link to="/listings" className="text-yellow-400 hover:underline font-semibold">
                  Start Browsing Properties →
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
