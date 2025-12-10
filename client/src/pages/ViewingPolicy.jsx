import SEOHead from "@/components/SEOHead";
import { Eye, Calendar, Clock, MapPin, Phone } from "lucide-react";

export default function ViewingPolicy() {
  return (
    <>
      <SEOHead
        title="Viewing Policy - GMB Luxury Properties | Property Viewing Guidelines"
        description="Learn about GMB Real Estate Ghana's property viewing policy. Understand scheduling procedures, viewing guidelines, and what to expect during property viewings in Ghana."
        keywords="property viewing policy Ghana, house viewing guidelines, property tour policy, real estate viewing rules, property inspection policy"
      />
      <div className="min-h-screen bg-[#121420] text-white px-[5%] py-10 lg:py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="text-yellow-400" size={32} />
              <h1 className="text-4xl lg:text-5xl font-bold">Viewing Policy</h1>
            </div>
            <p className="text-lg text-white/70">
              Guidelines for scheduling and conducting property viewings
            </p>
          </div>

          {/* Introduction */}
          <section className="space-y-4">
            <p className="text-lg text-white/80 leading-relaxed">
              At GMB Real Estate Ghana, we facilitate property viewings to help you find your ideal home. This Viewing Policy outlines the procedures, guidelines, and expectations for scheduling and attending property viewings.
            </p>
          </section>

          {/* Scheduling Viewings */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="text-yellow-400" size={24} />
              <h2 className="text-2xl lg:text-3xl font-bold">Scheduling Property Viewings</h2>
            </div>
            <div className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-yellow-400">Advance Booking Required</h3>
                <p className="text-white/80">
                  All property viewings must be scheduled in advance through our booking system or by contacting us directly. Walk-in viewings are generally not available unless previously arranged.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-yellow-400">Booking Methods</h3>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li>Online booking through our website</li>
                  <li>Phone booking: +233 55 394 4428</li>
                  <li>Email request: info@gmblux.com</li>
                  <li>WhatsApp: +233 55 394 4428</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-yellow-400">Required Information</h3>
                <p className="text-white/80">
                  When booking a viewing, please provide:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4 mt-2">
                  <li>Your full name and contact information</li>
                  <li>Property ID or address of interest</li>
                  <li>Preferred viewing date and time</li>
                  <li>Number of attendees</li>
                  <li>Any special requirements or questions</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Viewing Guidelines */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="text-yellow-400" size={24} />
              <h2 className="text-2xl lg:text-3xl font-bold">Viewing Guidelines</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">Before Your Viewing</h3>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li>Confirm your viewing appointment 24 hours in advance</li>
                  <li>Arrive on time or notify us if you're running late</li>
                  <li>Bring valid identification if required</li>
                  <li>Prepare questions about the property</li>
                  <li>Review property details and location beforehand</li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">During Your Viewing</h3>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li>Respect the property and property owner's privacy</li>
                  <li>Follow any instructions provided by our agents or property owners</li>
                  <li>Do not take photographs without permission</li>
                  <li>Ask questions and take notes</li>
                  <li>Be mindful of time limits if specified</li>
                  <li>Keep the number of attendees to a reasonable limit</li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">After Your Viewing</h3>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li>Provide feedback on the property if requested</li>
                  <li>Inform us of your interest level within 48 hours</li>
                  <li>Contact us with any follow-up questions</li>
                  <li>Schedule additional viewings if needed</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Viewing Duration */}
          <section className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">Viewing Duration</h2>
            <p className="text-white/80 leading-relaxed">
              Standard property viewings typically last 30-45 minutes, allowing sufficient time to explore the property and ask questions. Extended viewings may be arranged for larger properties or special circumstances. Please respect the allocated time to ensure we can accommodate all scheduled viewings.
            </p>
          </section>

          {/* Accompanied Viewings */}
          <section className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">Accompanied Viewings</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              Most viewings are conducted with a GMB Real Estate representative or property owner present. This ensures:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
              <li>Your safety and security during the viewing</li>
              <li>Access to all areas of the property</li>
              <li>Immediate answers to your questions</li>
              <li>Proper property presentation</li>
              <li>Compliance with property owner requirements</li>
            </ul>
          </section>

          {/* Cancellation and Rescheduling */}
          <section className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">Cancellation and Rescheduling</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              If you need to cancel or reschedule a viewing:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
              <li><strong>24+ Hours Notice:</strong> Free cancellation or rescheduling</li>
              <li><strong>Less Than 24 Hours:</strong> Please contact us immediately; we'll do our best to accommodate changes</li>
              <li><strong>No-Show:</strong> May affect future booking availability</li>
            </ul>
            <p className="text-white/80 leading-relaxed mt-4">
              For detailed cancellation terms, please refer to our <a href="/cancellation-policy" className="text-yellow-400 hover:underline">Cancellation Policy</a>.
            </p>
          </section>

          {/* Safety and Security */}
          <section className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">Safety and Security</h2>
            <p className="text-white/80 leading-relaxed">
              Your safety is our priority. All viewings are conducted with proper security measures. We verify property ownership and ensure safe viewing environments. If you have any safety concerns during a viewing, please contact us immediately.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-white/5 rounded-lg p-6 border border-white/10 mt-8">
            <h2 className="text-2xl font-bold mb-4">Schedule a Viewing</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              Ready to view a property? Contact us to schedule your viewing:
            </p>
            <div className="space-y-2 text-white/80">
              <div className="flex items-center gap-2">
                <Phone className="text-yellow-400" size={20} />
                <a href="tel:+233553944428" className="text-yellow-400 hover:underline">+233 55 394 4428</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-yellow-400" size={20} />
                <a href="/listings" className="text-yellow-400 hover:underline">Browse Available Properties</a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
