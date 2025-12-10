import SEOHead from "@/components/SEOHead";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <>
      <SEOHead
        title="Privacy Policy - GMB Luxury Properties | Data Protection & Privacy"
        description="Read GMB Real Estate Ghana's privacy policy. Learn how we collect, use, and protect your personal information when you use our real estate services in Ghana."
        keywords="privacy policy Ghana, data protection Ghana, real estate privacy, GMB privacy policy, personal information protection, GDPR compliance Ghana"
      />
      <div className="min-h-screen bg-[#121420] text-white px-[5%] pt-24 pb-10 lg:pt-28 lg:pb-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-yellow-400" size={32} />
              <h1 className="text-4xl lg:text-5xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-lg text-white/70">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Introduction */}
          <section className="space-y-4">
            <p className="text-lg text-white/80 leading-relaxed">
              At GMB Real Estate Ghana ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us.
            </p>
            <p className="text-lg text-white/80 leading-relaxed">
              By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-yellow-400" size={24} />
              <h2 className="text-2xl lg:text-3xl font-bold">Information We Collect</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-yellow-400">Personal Information</h3>
                <p className="text-white/80 leading-relaxed">
                  When you use our services, we may collect personal information including but not limited to:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-2 text-white/80 ml-4">
                  <li>Name and contact information (email address, phone number, mailing address)</li>
                  <li>Property preferences and requirements</li>
                  <li>Financial information (for property purchase/rental applications)</li>
                  <li>Identification documents (when required for property transactions)</li>
                  <li>Communication preferences</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-yellow-400">Automatically Collected Information</h3>
                <p className="text-white/80 leading-relaxed">
                  We automatically collect certain information when you visit our website:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-2 text-white/80 ml-4">
                  <li>IP address and browser type</li>
                  <li>Device information and operating system</li>
                  <li>Pages visited and time spent on our website</li>
                  <li>Referring website addresses</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="text-yellow-400" size={24} />
              <h2 className="text-2xl lg:text-3xl font-bold">How We Use Your Information</h2>
            </div>
            
            <p className="text-white/80 leading-relaxed mb-4">
              We use the information we collect for the following purposes:
            </p>
            
            <ul className="list-disc list-inside space-y-3 text-white/80 ml-4">
              <li><strong>Property Services:</strong> To provide real estate consultation, property listings, and brokerage services</li>
              <li><strong>Communication:</strong> To respond to your inquiries, send property updates, and provide customer support</li>
              <li><strong>Transaction Processing:</strong> To process property bookings, rental applications, and purchase inquiries</li>
              <li><strong>Marketing:</strong> To send you property listings, market updates, and promotional materials (with your consent)</li>
              <li><strong>Website Improvement:</strong> To analyze website usage, improve user experience, and optimize our services</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes</li>
              <li><strong>Security:</strong> To protect against fraud, unauthorized access, and other security threats</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="text-yellow-400" size={24} />
              <h2 className="text-2xl lg:text-3xl font-bold">Information Sharing and Disclosure</h2>
            </div>
            
            <p className="text-white/80 leading-relaxed mb-4">
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            
            <ul className="list-disc list-inside space-y-3 text-white/80 ml-4">
              <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating our website and conducting our business</li>
              <li><strong>Property Owners:</strong> With property owners or landlords when you express interest in their properties</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">Data Security</h2>
            <p className="text-white/80 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Your Rights */}
          <section className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">Your Rights</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
              <li>Access and receive a copy of your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to processing of your personal information</li>
              <li>Withdraw consent for marketing communications at any time</li>
              <li>Request restriction of processing your information</li>
            </ul>
            <p className="text-white/80 leading-relaxed mt-4">
              To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>
          </section>

          {/* Cookies */}
          <section className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">Cookies and Tracking Technologies</h2>
            <p className="text-white/80 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand user preferences. You can control cookie preferences through your browser settings. However, disabling cookies may limit certain website functionalities.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">Third-Party Links</h2>
            <p className="text-white/80 leading-relaxed">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">Children's Privacy</h2>
            <p className="text-white/80 leading-relaxed">
              Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">Changes to This Privacy Policy</h2>
            <p className="text-white/80 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-white/5 rounded-lg p-6 border border-white/10 mt-8">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2 text-white/80">
              <p><strong>GMB Real Estate Ghana</strong></p>
              <p>Phone: <a href="tel:+233553944428" className="text-yellow-400 hover:underline">+233 55 394 4428</a></p>
              <p>Email: <a href="mailto:info@gmblux.com" className="text-yellow-400 hover:underline">info@gmblux.com</a></p>
              <p>Website: <a href="https://gmblux.com" className="text-yellow-400 hover:underline">www.gmblux.com</a></p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
