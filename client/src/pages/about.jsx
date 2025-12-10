import SEOHead from "@/components/SEOHead";
import { Home, Heart, Shield, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <>
      <SEOHead
        title="About GMB Real Estate Ghana - Your Trusted Property Brokerage | GMB Luxury Properties"
        description="GMB Real Estate Ghana is a premier property brokerage specializing in luxury and affordable real estate. We consult, discern, and find your ideal dream home with transparency and intentionality. Your peace of mind is paramount."
        keywords="GMB Real Estate Ghana, property brokerage Ghana, real estate consultation Ghana, luxury properties Ghana, affordable homes Ghana, property management Ghana, real estate Accra, dream home Ghana"
      />
      <div className="min-h-screen bg-[#121420] text-white px-[5%] pt-24 pb-10 lg:pt-28 lg:pb-20">
        {/* Hero Section */}
        <div className="mb-12 lg:mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            About GMB Real Estate Ghana
          </h1>
          <p className="text-xl lg:text-2xl text-white/70 max-w-3xl">
            More than just a real estate brokerage – we're your trusted partners in finding your dream home.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl space-y-12">
          {/* Our Mission */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="text-yellow-400" size={28} />
              <h2 className="text-3xl lg:text-4xl font-bold">Our Mission</h2>
            </div>
            <p className="text-lg text-white/80 leading-relaxed">
              At GMB Real Estate Ghana, we're more than just a real estate brokerage – we consult and discern our clients' ideal needs and preferences for their dream home. Our exclusive listings range from affordable to luxury, serving every client's budget.
            </p>
          </section>

          {/* Our Commitment */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-yellow-400" size={28} />
              <h2 className="text-3xl lg:text-4xl font-bold">Our Commitment</h2>
            </div>
            <p className="text-lg text-white/80 leading-relaxed">
              We are intentional and transparent with finding your ideal home because your peace of mind is paramount to us. Our properties are carefully selected for their exceptional quality and display, craftsmanship, and facade.
            </p>
          </section>

          {/* Our Properties */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Home className="text-yellow-400" size={28} />
              <h2 className="text-3xl lg:text-4xl font-bold">Our Properties</h2>
            </div>
            <p className="text-lg text-white/80 leading-relaxed">
              Whether you're looking from a suburb/urban or prime city location, we have a wide range of relatable options to pique your interest. From cozy apartments to luxurious mansions, from suburban homes to prime city properties – we curate listings that match your lifestyle and aspirations.
            </p>
          </section>

          {/* Why Choose Us */}
          <section className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">Why Choose GMB Real Estate Ghana?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">Expert Consultation</h3>
                <p className="text-white/70">
                  We don't just show you properties – we understand your needs, preferences, and budget to find the perfect match.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">Transparent Process</h3>
                <p className="text-white/70">
                  Complete transparency throughout your property search journey. No hidden fees, no surprises – just honest, straightforward service.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">Quality Selection</h3>
                <p className="text-white/70">
                  Every property in our portfolio is carefully vetted for quality, craftsmanship, and exceptional presentation.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">Diverse Portfolio</h3>
                <p className="text-white/70">
                  From affordable starter homes to luxury estates, we serve every budget and lifestyle preference.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-8 lg:p-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              We Are Your First and Trusted Option
            </h2>
            <p className="text-lg text-white/80 mb-6 max-w-2xl mx-auto">
              To broker your first dream home, look no further. Our team is dedicated to making your property dreams a reality with integrity, expertise, and personalized service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="tel:+233553944428"
                className="flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors"
              >
                <Phone size={20} />
                Call Us: +233 55 394 4428
              </a>
              <Link
                to="/listings"
                className="flex items-center gap-2 border border-yellow-400 text-yellow-400 px-6 py-3 rounded-full font-semibold hover:bg-yellow-400/10 transition-colors"
              >
                <MapPin size={20} />
                Browse Properties
              </Link>
            </div>
            <p className="text-yellow-400 font-semibold mt-6 text-lg">
              Call us, you'll love it!!
            </p>
          </section>

          {/* Contact Information */}
          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="text-yellow-400" size={20} />
                <a href="tel:+233553944428" className="text-white/80 hover:text-yellow-400 transition-colors">
                  +233 55 394 4428
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-yellow-400" size={20} />
                <a href="mailto:info@gmblux.com" className="text-white/80 hover:text-yellow-400 transition-colors">
                  info@gmblux.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-yellow-400" size={20} />
                <span className="text-white/80">Ghana</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
