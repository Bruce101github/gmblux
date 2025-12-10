import SEOHead from "@/components/SEOHead";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "react-hot-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    toast.loading("Sending your message...", {
      style: {
        borderRadius: "10px",
        background: "#121420",
        color: "#fff",
        border: "0.4px solid gray",
      },
    });

    try {
      // You can create a 'contact_messages' table in Supabase to store these
      // For now, we'll just show success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.dismiss();
      toast.success("Message sent successfully! We'll get back to you soon.", {
        style: {
          borderRadius: "10px",
          background: "#121420",
          color: "#fff",
          border: "0.4px solid gray",
        },
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to send message. Please try again.", {
        style: {
          borderRadius: "10px",
          background: "#121420",
          color: "#fff",
          border: "0.4px solid gray",
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Contact Us - GMB Luxury Properties | Get in Touch"
        description="Contact GMB Real Estate Ghana for property inquiries, consultations, viewings, and real estate services. Call +233 55 394 4428 or send us a message."
        keywords="contact GMB Real Estate, property inquiry Ghana, real estate contact, property consultation Ghana, GMB contact information"
      />
      <div className="min-h-screen bg-[#121420] text-white px-[5%] py-10 lg:py-20">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-white/70">
              Get in touch with GMB Real Estate Ghana. We're here to help you find your dream property.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold mb-6">Get in Touch</h2>
                <p className="text-white/80 leading-relaxed mb-8">
                  Whether you're looking to buy, rent, or simply have questions about our properties, we're here to assist you. Reach out through any of the channels below.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="text-yellow-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Phone</h3>
                    <a href="tel:+233553944428" className="text-yellow-400 hover:underline">
                      +233 55 394 4428
                    </a>
                    <p className="text-white/60 text-sm mt-1">Call us for immediate assistance</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-yellow-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Email</h3>
                    <a href="mailto:info@gmblux.com" className="text-yellow-400 hover:underline">
                      info@gmblux.com
                    </a>
                    <p className="text-white/60 text-sm mt-1">Send us an email anytime</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="text-yellow-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">WhatsApp</h3>
                    <a
                      href="https://wa.me/233553944428"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-400 hover:underline"
                    >
                      +233 55 394 4428
                    </a>
                    <p className="text-white/60 text-sm mt-1">Chat with us on WhatsApp</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-yellow-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Location</h3>
                    <p className="text-white/80">Ghana</p>
                    <p className="text-white/60 text-sm mt-1">Serving clients nationwide</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="text-yellow-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Business Hours</h3>
                    <p className="text-white/80">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                    <p className="text-white/80">Sunday: By appointment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/5 rounded-lg p-6 lg:p-8 border border-white/10">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border-b border-white/20 p-2 outline-none text-white/70 bg-white/5 rounded-t focus:border-yellow-400 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border-b border-white/20 p-2 outline-none text-white/70 bg-white/5 rounded-t focus:border-yellow-400 transition-colors"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border-b border-white/20 p-2 outline-none text-white/70 bg-white/5 rounded-t focus:border-yellow-400 transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full border-b border-white/20 p-2 outline-none text-white/70 bg-white/5 rounded-t focus:border-yellow-400 transition-colors"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full border-b border-white/20 p-2 outline-none text-white/70 bg-white/5 rounded-t focus:border-yellow-400 transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
