import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Mail, Send, Megaphone, Users, TrendingUp } from "lucide-react";
import { TOAST_STYLE } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Marketing() {
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [sending, setSending] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [openRate, setOpenRate] = useState(0);

  useEffect(() => {
    async function fetchSubscriberStats() {
      const { count } = await supabase
        .from("email_list")
        .select("*", { count: "exact", head: true });
      setSubscriberCount(count || 0);
      // TODO: Calculate actual open rate from email campaign data
      setOpenRate(0);
    }
    fetchSubscriberStats();
  }, []);

  const handleSendNewsletter = async () => {
    if (!emailSubject || !emailContent) {
      toast.error("Please fill in all fields", { style: TOAST_STYLE });
      return;
    }

    setSending(true);
    // TODO: Implement newsletter sending logic
    setTimeout(() => {
      toast.success("Newsletter sent successfully!", { style: TOAST_STYLE });
      setEmailSubject("");
      setEmailContent("");
      setSending(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between px-[5%] md:px-0 lg:px-0 mt-[-48px] lg:mt-4 mb-5">
        <h2 className="text-white text-lg font-medium lg:text-xl lg:font-bold">
          Marketing
        </h2>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="bg-white/10 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Megaphone className="text-yellow-400" size={20} />
              <h3 className="text-white text-lg font-bold">Email Campaign</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-white/60 text-sm mb-2 block">Subject</label>
                <Input
                  placeholder="Newsletter subject..."
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="bg-[#121420] border-white/10 text-white"
                />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Content</label>
                <textarea
                  placeholder="Email content..."
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  rows={10}
                  className="w-full bg-[#121420] border border-white/10 rounded-md p-3 text-white placeholder:text-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                />
              </div>
              <Button
                onClick={handleSendNewsletter}
                disabled={sending}
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold w-full"
              >
                {sending ? "Sending..." : (
                  <>
                    <Send size={16} />
                    Send Newsletter
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <Card className="bg-white/10 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="text-yellow-400" size={20} />
              <h3 className="text-white font-bold">Subscribers</h3>
            </div>
            <p className="text-3xl font-bold text-white">{subscriberCount.toLocaleString()}</p>
            <p className="text-white/60 text-sm mt-2">Total email subscribers</p>
          </Card>
          <Card className="bg-white/10 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-yellow-400" size={20} />
              <h3 className="text-white font-bold">Open Rate</h3>
            </div>
            <p className="text-3xl font-bold text-white">{openRate}%</p>
            <p className="text-white/60 text-sm mt-2">Average open rate</p>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

