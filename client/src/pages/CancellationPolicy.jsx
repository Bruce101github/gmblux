import SEOHead from "@/components/SEOHead";
import { XCircle, Clock, AlertTriangle } from "lucide-react";

export default function CancellationPolicy() {
  return (
    <>
      <SEOHead
        title="Cancellation Policy - GMB Luxury Properties | Booking Cancellation Terms"
        description="Understand GMB Real Estate Ghana's cancellation policy for property bookings, tours, and reservations. Learn about refund terms and cancellation procedures."
        keywords="cancellation policy Ghana, property booking cancellation, real estate cancellation, refund policy Ghana, booking cancellation terms"
      />
      <div className="min-h-screen bg-[#121420] text-white px-[5%] pt-24 pb-10 lg:pt-28 lg:pb-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="text-yellow-400" size={32} />
              <h1 className="text-4xl lg:text-5xl font-bold">Cancellation Policy</h1>
            </div>
            <p className="text-lg text-white/70">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Introduction */}
          <section className="space-y-4">
            <p className="text-lg text-white/80 leading-relaxed">
              At GMB Real Estate Ghana, we understand that circumstances may change, and you may need to cancel a property booking, viewing, or reservation. This Cancellation Policy outlines the terms and conditions for cancellations and any applicable refunds.
            </p>
          </section>

          {/* General Policy */}
          <section className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">General Cancellation Policy</h2>
            <p className="text-white/80 leading-relaxed">
              All cancellation requests must be submitted in writing via email or through our official communication channels. Cancellation terms may vary depending on the type of service and the specific agreement with property owners.
            </p>
          </section>

          {/* Property Viewings */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="text-yellow-400" size={24} />
              <h2 className="text-2xl lg:text-3xl font-bold">Property Viewings</h2>
            </div>
            <div className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-yellow-400">24+ Hours Notice</h3>
                <p className="text-white/80">
                  Cancellations made 24 hours or more before the scheduled viewing are free of charge. No penalties apply.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-yellow-400">Less Than 24 Hours Notice</h3>
                <p className="text-white/80">
                  Cancellations made less than 24 hours before the scheduled viewing may be subject to a rescheduling fee. We appreciate advance notice to accommodate other clients.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-yellow-400">No-Show</h3>
                <p className="text-white/80">
                  Failure to attend a scheduled viewing without prior notice may result in restrictions on future booking availability.
                </p>
              </div>
            </div>
          </section>

          {/* Property Bookings */}
          <section className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">Property Bookings and Reservations</h2>
            <div className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-yellow-400">Rental Bookings</h3>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li><strong>30+ Days Before Move-In:</strong> Full refund of deposit (subject to property owner agreement)</li>
                  <li><strong>14-30 Days Before Move-In:</strong> 50% refund of deposit (subject to property owner agreement)</li>
                  <li><strong>Less Than 14 Days:</strong> Refund subject to property owner's discretion and property re-rental status</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-yellow-400">Purchase Reservations</h3>
                <p className="text-white/80">
                  Cancellation terms for property purchases are subject to the specific purchase agreement and may involve earnest money deposits. Terms will be clearly outlined in your purchase agreement.
                </p>
              </div>
            </div>
          </section>

          {/* Refund Process */}
          <section className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">Refund Process</h2>
            <div className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-4">
              <p className="text-white/80 leading-relaxed">
                Refunds, when applicable, will be processed as follows:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                <li>Refunds are processed within 7-14 business days of cancellation approval</li>
                <li>Refunds are issued to the original payment method when possible</li>
                <li>Processing fees may apply and are non-refundable</li>
                <li>Refund amounts are subject to property owner approval and terms</li>
                <li>We act as intermediaries; final refund decisions rest with property owners</li>
              </ul>
            </div>
          </section>

          {/* Special Circumstances */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-yellow-400" size={24} />
              <h2 className="text-2xl lg:text-3xl font-bold">Special Circumstances</h2>
            </div>
            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-6">
              <p className="text-white/80 leading-relaxed mb-4">
                We understand that exceptional circumstances may arise. In cases of:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                <li>Medical emergencies</li>
                <li>Family emergencies</li>
                <li>Natural disasters</li>
                <li>Property unavailability due to owner circumstances</li>
                <li>Significant property misrepresentation</li>
              </ul>
              <p className="text-white/80 leading-relaxed mt-4">
                We will work with you and property owners to find a fair resolution. Please contact us immediately to discuss your situation.
              </p>
            </div>
          </section>

          {/* Property Owner Cancellations */}
          <section className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">Property Owner Cancellations</h2>
            <p className="text-white/80 leading-relaxed">
              If a property owner cancels your booking or reservation, you are entitled to a full refund of any deposits or payments made. We will assist you in finding alternative properties and will not charge additional fees for re-booking services in such circumstances.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-white/5 rounded-lg p-6 border border-white/10 mt-8">
            <h2 className="text-2xl font-bold mb-4">Need to Cancel?</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              To cancel a booking or request a refund, please contact us:
            </p>
            <div className="space-y-2 text-white/80">
              <p><strong>GMB Real Estate Ghana</strong></p>
              <p>Phone: <a href="tel:+233553944428" className="text-yellow-400 hover:underline">+233 55 394 4428</a></p>
              <p>Email: <a href="mailto:info@gmblux.com" className="text-yellow-400 hover:underline">info@gmblux.com</a></p>
              <p className="text-sm text-white/60 mt-4">
                Please include your booking reference number and reason for cancellation in your communication.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
