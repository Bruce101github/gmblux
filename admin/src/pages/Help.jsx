import { Card } from "@/components/ui/card";
import { BadgeQuestionMark, Book, MessageCircle, Video, FileText } from "lucide-react";
import { motion } from "framer-motion";

const helpSections = [
  {
    title: "Getting Started",
    icon: Book,
    items: [
      "How to add a new property",
      "Managing bookings and requests",
      "Understanding the dashboard",
    ],
  },
  {
    title: "Property Management",
    icon: FileText,
    items: [
      "Editing property details",
      "Uploading property images",
      "Setting property features",
    ],
  },
  {
    title: "Customer Support",
    icon: MessageCircle,
    items: [
      "Responding to booking requests",
      "Managing customer inquiries",
      "Email notifications setup",
    ],
  },
  {
    title: "Video Tutorials",
    icon: Video,
    items: [
      "Admin panel walkthrough",
      "Property management guide",
      "Reports and analytics",
    ],
  },
];

export default function Help() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between px-[5%] md:px-0 lg:px-0 mt-[-48px] lg:mt-4 mb-5">
        <h2 className="text-white text-lg font-medium lg:text-xl lg:font-bold">
          Help & Documentation
        </h2>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        {helpSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/10 rounded-xl p-5 hover:bg-white/15 transition-all duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-400/10 rounded-lg">
                  <section.icon className="text-yellow-400" size={24} />
                </div>
                <h3 className="text-white font-bold text-lg">{section.title}</h3>
              </div>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + itemIndex * 0.05 }}
                    className="text-white/60 text-sm flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </Card>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-4"
      >
        <Card className="bg-white/10 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <BadgeQuestionMark className="text-yellow-400" size={24} />
            <h3 className="text-white font-bold text-lg">Need More Help?</h3>
          </div>
          <p className="text-white/60 mb-4">
            Can't find what you're looking for? Contact our support team for assistance.
          </p>
          <div className="flex gap-2">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-4 py-2 rounded-sm transition-all duration-200">
              Contact Support
            </button>
            <button className="bg-[#121420] hover:bg-[#1a1b2e] text-white font-bold px-4 py-2 rounded-sm transition-all duration-200">
              View Documentation
            </button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

