import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Funnel, ListFilter, Search, Mail, Phone } from "lucide-react";
import { TOAST_STYLE } from "@/lib/utils";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

const customerColumns = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Mail size={14} className="text-white/40" />
        <span>{row.getValue("email")}</span>
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Subscribed",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },
  },
];

export default function Customers() {
  const location = useLocation();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  async function fetchCustomers() {
    setLoading(true);
    let query = supabase.from("email_list").select("*").order("created_at", { ascending: false });

    if (searchTerm) {
      query = query.ilike("email", `%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      toast.error("Failed to fetch customers!", { style: TOAST_STYLE });
      setCustomers([]);
    } else {
      setCustomers(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchCustomers();
  }, [searchTerm, location.pathname]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between px-[5%] md:px-0 lg:px-0 mt-[-48px] lg:mt-4 mb-5">
        <h2 className="text-white text-lg font-medium lg:text-xl lg:font-bold">
          Customers
        </h2>
      </div>
      <Card className="hidden lg:block md:block bg-white/10 rounded-xl p-5 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-between text-white items-center mb-5"
        >
          <p className="text-base font-medium">{customers.length} Subscribers</p>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={16} />
              <Input
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#121420] border-white/10 text-white w-[250px]"
              />
            </div>
            <button className="px-3 py-2 bg-[#121420] rounded-sm text-xs flex items-center gap-1 hover:bg-[#1a1b2e] transition-all duration-200">
              <Funnel size={14} />
              Filter
            </button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {loading ? (
            <div className="py-8 text-center">
              <p className="text-white/60">Loading customers...</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-white/60">No customers found</p>
            </div>
          ) : (
            <DataTable columns={customerColumns} data={customers} />
          )}
        </motion.div>
      </Card>
    </motion.div>
  );
}

