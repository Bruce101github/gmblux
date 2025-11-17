import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Database,
  FileSpreadsheet,
} from "lucide-react";
import { TOAST_STYLE } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Tools() {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleExportData = async (type) => {
    setExporting(true);
    try {
      const { data, error } = await supabase.from(type).select("*");
      if (error) throw error;

      const csv = convertToCSV(data);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}_export_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success(`${type} exported successfully!`, { style: TOAST_STYLE });
    } catch (error) {
      toast.error(`Failed to export ${type}`, { style: TOAST_STYLE });
    }
    setExporting(false);
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return "";
    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers.map((header) => JSON.stringify(row[header] || "")).join(",")
    );
    return [headers.join(","), ...rows].join("\n");
  };

  const tools = [
    {
      title: "Export Properties",
      description: "Download all properties as CSV",
      icon: Download,
      action: () => handleExportData("properties"),
      color: "bg-blue-500/10 text-blue-400",
    },
    {
      title: "Export Bookings",
      description: "Download all bookings as CSV",
      icon: Download,
      action: () => handleExportData("booking"),
      color: "bg-green-500/10 text-green-400",
    },
    {
      title: "Export Customers",
      description: "Download email list as CSV",
      icon: FileSpreadsheet,
      action: () => handleExportData("email_list"),
      color: "bg-purple-500/10 text-purple-400",
    },
    {
      title: "Refresh Cache",
      description: "Clear and refresh application cache",
      icon: RefreshCw,
      action: () => {
        toast.success("Cache refreshed!", { style: TOAST_STYLE });
      },
      color: "bg-yellow-500/10 text-yellow-400",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between px-[5%] md:px-0 lg:px-0 mt-[-48px] lg:mt-4 mb-5">
        <h2 className="text-white text-lg font-medium lg:text-xl lg:font-bold">
          Tools & Utilities
        </h2>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/10 rounded-xl p-5 hover:bg-white/15 transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${tool.color}`}>
                  <tool.icon size={24} />
                </div>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{tool.title}</h3>
              <p className="text-white/60 text-sm mb-4">{tool.description}</p>
              <Button
                onClick={tool.action}
                disabled={exporting || importing}
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold w-full"
              >
                {exporting || importing ? "Processing..." : "Execute"}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

