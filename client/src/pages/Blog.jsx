import SEOHead from "@/components/SEOHead";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Blog() {
  // Placeholder for future blog posts
  const blogPosts = [];

  return (
    <>
      <SEOHead
        title="Blog - GMB Luxury Properties | Real Estate News & Insights"
        description="Read the latest real estate news, property market insights, and helpful guides from GMB Real Estate Ghana. Stay informed about the Ghana property market."
        keywords="real estate blog Ghana, property market news, Ghana property insights, real estate tips, property investment Ghana"
      />
      <div className="min-h-screen bg-[#121420] text-white px-[5%] pt-24 pb-10 lg:pt-28 lg:pb-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="text-yellow-400" size={32} />
              <h1 className="text-4xl lg:text-5xl font-bold">Blog</h1>
            </div>
            <p className="text-lg text-white/70">
              Real estate insights, market updates, and helpful guides
            </p>
          </div>

          {/* Coming Soon */}
          <div className="bg-white/5 rounded-lg p-12 lg:p-16 border border-white/10 text-center">
            <BookOpen className="text-yellow-400 mx-auto mb-6" size={64} />
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Coming Soon</h2>
            <p className="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto mb-8">
              We're working on bringing you valuable real estate insights, market updates, property investment tips, and helpful guides. Check back soon for our latest articles!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/listings"
                className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors inline-flex items-center justify-center gap-2"
              >
                Browse Properties
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/contact"
                className="border border-yellow-400 text-yellow-400 px-6 py-3 rounded-full font-semibold hover:bg-yellow-400/10 transition-colors inline-flex items-center justify-center gap-2"
              >
                Contact Us
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          {/* Future Blog Posts Placeholder */}
          {blogPosts.length === 0 && (
            <div className="mt-12 text-center text-white/60">
              <p>Subscribe to our newsletter to be notified when we publish new articles.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
