import SEOHead from "@/components/SEOHead";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What services does GMB Real Estate Ghana provide?",
    answer: "GMB Real Estate Ghana offers comprehensive real estate services including property consultation, brokerage services, property listings for sale and rent, property viewings, booking assistance, and personalized property matching based on your needs and preferences."
  },
  {
    question: "How do I search for properties?",
    answer: "You can search for properties on our website using various filters including location, property type, price range, number of bedrooms and bathrooms, and listing type (sale or rent). You can also contact us directly for personalized property recommendations."
  },
  {
    question: "Do I need to pay a fee to view properties?",
    answer: "No, property viewings are free of charge. We only charge brokerage fees when you successfully book or purchase a property through our services. All fees are transparent and discussed upfront."
  },
  {
    question: "What documents do I need to book a property?",
    answer: "Required documents typically include: valid identification (National ID, Passport, or Driver's License), proof of income or financial capability, references (for rentals), and any other documents specified by the property owner. Exact requirements may vary by property."
  },
  {
    question: "How long does the booking process take?",
    answer: "The booking process typically takes 3-7 business days, depending on document verification, property owner response times, and the complexity of your requirements. We'll keep you informed throughout the process."
  },
  {
    question: "Can I cancel a booking?",
    answer: "Yes, bookings can be cancelled subject to our Cancellation Policy. Refund terms depend on timing and property type. Cancellations made 30+ days in advance typically receive full refunds, while shorter notice may result in partial refunds. Please see our Cancellation Policy for detailed terms."
  },
  {
    question: "What areas do you serve?",
    answer: "We serve clients throughout Ghana, with a focus on major cities including Accra, Kumasi, and other prime locations. Our property portfolio includes suburban, urban, and prime city properties to suit various preferences and budgets."
  },
  {
    question: "Do you help with property purchases and rentals?",
    answer: "Yes, we assist with both property purchases and rentals. Our services include consultation to understand your needs, property matching, viewing arrangements, documentation assistance, and transaction facilitation for both buying and renting properties."
  },
  {
    question: "What makes GMB Real Estate different?",
    answer: "We're more than just a brokerage – we consult and discern your ideal needs and preferences. We're intentional and transparent, carefully selecting properties for exceptional quality. Your peace of mind is paramount to us, and we serve every budget from affordable to luxury properties."
  },
  {
    question: "How do I contact GMB Real Estate?",
    answer: "You can reach us by phone at +233 55 394 4428, email at info@gmblux.com, WhatsApp at +233 55 394 4428, or through our website contact forms. We're available to assist with property inquiries, viewings, and consultations."
  },
  {
    question: "Are your properties verified?",
    answer: "Yes, all properties in our portfolio are carefully selected and verified for quality, legal status, and accurate information. We conduct due diligence to ensure properties meet our quality standards before listing."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept various payment methods including bank transfers, mobile money, and other secure payment options. Payment terms and methods will be clearly outlined in your booking agreement."
  }
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left py-4 hover:text-yellow-400 transition-colors"
      >
        <span className="text-lg font-semibold pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp className="text-yellow-400 flex-shrink-0" size={24} />
        ) : (
          <ChevronDown className="text-white/60 flex-shrink-0" size={24} />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 text-white/80 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <>
      <SEOHead
        title="Frequently Asked Questions - GMB Luxury Properties | FAQ"
        description="Find answers to common questions about GMB Real Estate Ghana's services, property booking process, fees, viewings, and real estate services in Ghana."
        keywords="real estate FAQ Ghana, property questions, house booking FAQ, property rental questions, real estate Ghana FAQ, property buying questions"
      />
      <div className="min-h-screen bg-[#121420] text-white px-[5%] pt-24 pb-10 lg:pt-28 lg:pb-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="text-yellow-400" size={32} />
              <h1 className="text-4xl lg:text-5xl font-bold">Frequently Asked Questions</h1>
            </div>
            <p className="text-lg text-white/70">
              Find answers to common questions about our services
            </p>
          </div>

          {/* FAQ List */}
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>

          {/* Still Have Questions */}
          <section className="bg-white/5 rounded-lg p-8 border border-white/10 mt-12 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-white/80 leading-relaxed mb-6">
              Can't find the answer you're looking for? Our team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+233553944428"
                className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors"
              >
                Call Us: +233 55 394 4428
              </a>
              <a
                href="mailto:info@gmblux.com"
                className="border border-yellow-400 text-yellow-400 px-6 py-3 rounded-full font-semibold hover:bg-yellow-400/10 transition-colors"
              >
                Email Us
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
