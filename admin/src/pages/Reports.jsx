import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartAreaInteractive } from "@/components/ui/ChartAreaInteractive";
import { ChartBarMultiple } from "@/components/ui/ChartBarMultiple";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Building2,
  Users,
} from "lucide-react";

export default function Reports() {
  const location = useLocation();
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalProperties: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const { count: bookingsCount } = await supabase
        .from("booking")
        .select("*", { count: "exact", head: true });

      const { count: propertiesCount } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true });

      setStats({
        totalBookings: bookingsCount || 0,
        totalProperties: propertiesCount || 0,
        totalRevenue: 0,
        monthlyGrowth: 12.5,
      });
    }
    fetchStats();
  }, [location.pathname]);

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Total Properties",
      value: stats.totalProperties,
      icon: Building2,
      trend: "+5%",
      trendUp: true,
    },
    {
      title: "Total Revenue",
      value: `GH₵${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Active Users",
      value: stats.totalBookings,
      icon: Users,
      trend: "+15%",
      trendUp: true,
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
          Reports & Analytics
        </h2>
      </div>
      <div className="grid lg:grid-cols-4 gap-4 mb-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/10 rounded-xl p-4 border-white/10">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="text-yellow-400" size={24} />
                {stat.trendUp ? (
                  <div className="flex items-center gap-1 text-green-400 text-xs">
                    <TrendingUp size={14} />
                    {stat.trend}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-400 text-xs">
                    <TrendingDown size={14} />
                    {stat.trend}
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-white/60 text-sm mt-1">{stat.title}</p>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ChartAreaInteractive />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/10 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white">Monthly Bookings</CardTitle>
              <CardDescription className="text-white/60">
                Booking trends over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartBarMultiple />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

