import React from "react";
import { Table } from "@/components/ui/table";
import { DataTable } from "@/components/ui/DataTable";
import { ChartAreaInteractive } from "@/components/ui/ChartAreaInteractive";
import { columns } from "@/pages/bookings/columns";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MobileBookingTable from "@/components/ui/MobileBookingTable";
import {
  CalendarPlus,
  CircleFadingPlus,
  BadgeCent,
  UsersRound,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Calendar31 from "@/components/calendar-31.jsx";

export default function Dashboard() {
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [tableInfo, setTableInfo] = useState([]);
  const [newRequest, setNewRequest] = useState("");
  const [totalRequest, setTotalRequest] = useState("");
  const [upcomingTour, setUpcomingTour] = useState("");
  const [canceled, setCanceled] = useState("");
  const [trends, setTrends] = useState({
    newRequest: 0,
    totalRequest: 0,
    upcomingTour: 0,
    canceled: 0,
  });

  useEffect(() => {
    async function fetchBookings() {
      const { data, error } = await supabase
        .from("booking")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        // Silently handle error - bookings will remain empty
        setBookings([]);
      } else {
        setBookings(data || []);
      }
    }

    async function fetchProperties() {
      const { data: properties, error } = await supabase
        .from("properties")
        .select("*");

      if (error) {
        // Silently handle error - properties will remain empty
        setProperties([]);
      } else {
        setProperties(properties || []);
      }
    }
    fetchBookings();
    fetchProperties();
  }, [location.pathname]);

  useEffect(() => {
    const merged = [];

    bookings.forEach((booking) => {
      const match = properties.find(
        (property) => booking.property_id === property.id,
      );
      // Include booking even if property doesn't match
      if (match) {
        merged.push({ ...booking, ...match });
      } else {
        // Still show booking even without property match
        merged.push(booking);
      }
    });

    setTableInfo(merged);
  }, [bookings, properties]);

  const matches = bookings.filter((booking) => booking.status === "pending");
  const tours = bookings.filter(
    (booking) =>
      booking.request_type === "Tour" && booking.status === "scheduled",
  );
  const canceledBookings = bookings.filter(
    (booking) => booking.status === "canceled",
  );

  useEffect(() => {
    setNewRequest(matches.length);
    setTotalRequest(bookings.length);
    setUpcomingTour(tours.length);
    setCanceled(canceledBookings.length);
  }, [bookings]);

  // Calculate trends
  useEffect(() => {
    async function calculateTrends() {
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

      // New requests trend (last month)
      const { count: newRequestsLastMonth } = await supabase
        .from("booking")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")
        .gte("created_at", lastMonth.toISOString())
        .lt("created_at", new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1).toISOString());

      const { count: newRequestsThisMonth } = await supabase
        .from("booking")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")
        .gte("created_at", new Date(now.getFullYear(), now.getMonth(), 1).toISOString());

      const newRequestTrend = newRequestsLastMonth > 0
        ? (((newRequestsThisMonth || 0) - newRequestsLastMonth) / newRequestsLastMonth * 100).toFixed(0)
        : 0;

      // Total requests trend (last month)
      const { count: totalLastMonth } = await supabase
        .from("booking")
        .select("*", { count: "exact", head: true })
        .gte("created_at", lastMonth.toISOString())
        .lt("created_at", new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1).toISOString());

      const { count: totalThisMonth } = await supabase
        .from("booking")
        .select("*", { count: "exact", head: true })
        .gte("created_at", new Date(now.getFullYear(), now.getMonth(), 1).toISOString());

      const totalRequestTrend = totalLastMonth > 0
        ? (((totalThisMonth || 0) - totalLastMonth) / totalLastMonth * 100).toFixed(0)
        : 0;

      // Upcoming tours trend (last month)
      const { count: toursLastMonth } = await supabase
        .from("booking")
        .select("*", { count: "exact", head: true })
        .eq("request_type", "Tour")
        .eq("status", "scheduled")
        .gte("created_at", lastMonth.toISOString())
        .lt("created_at", new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1).toISOString());

      const { count: toursThisMonth } = await supabase
        .from("booking")
        .select("*", { count: "exact", head: true })
        .eq("request_type", "Tour")
        .eq("status", "scheduled")
        .gte("created_at", new Date(now.getFullYear(), now.getMonth(), 1).toISOString());

      const upcomingTourTrend = toursLastMonth > 0
        ? (((toursThisMonth || 0) - toursLastMonth) / toursLastMonth * 100).toFixed(0)
        : 0;

      // Canceled trend (last year)
      const { count: canceledLastYear } = await supabase
        .from("booking")
        .select("*", { count: "exact", head: true })
        .eq("status", "canceled")
        .gte("created_at", lastYear.toISOString())
        .lt("created_at", new Date(lastYear.getFullYear() + 1, lastYear.getMonth(), 1).toISOString());

      const { count: canceledThisYear } = await supabase
        .from("booking")
        .select("*", { count: "exact", head: true })
        .eq("status", "canceled")
        .gte("created_at", new Date(now.getFullYear(), 0, 1).toISOString());

      const canceledTrend = canceledLastYear > 0
        ? (((canceledThisYear || 0) - canceledLastYear) / canceledLastYear * 100).toFixed(0)
        : 0;

      setTrends({
        newRequest: parseFloat(newRequestTrend),
        totalRequest: parseFloat(totalRequestTrend),
        upcomingTour: parseFloat(upcomingTourTrend),
        canceled: parseFloat(canceledTrend),
      });
    }
    calculateTrends();
  }, [bookings.length]);

  return (
    <>
      <h1 className="text-lg font-medium lg:text-xl mx-[5%]  lg:font-bold mt-[-48px] lg:mt-4 mb-2 text-white">
        Dashboard
      </h1>
      <div className="grid lg:grid-cols-4 lg:gap-4 gap-2 lg:gap-4 grid-cols-2 lg:mr-10 px-[5%] lg:px-0 justify-start items-start">
        <Card className="p-0 gap-1 bg-[#121420] border-white/10">
          <Card className="h-auto gap-1 p-4">
            <div className="h-[32px] w-[32px] bg-yellow-300/30 rounded-sm p-[4px]">
              <CircleFadingPlus color="yellow" size={24} />
            </div>
            <h2 className="text-white/60 font-bold text-md">New Request</h2>
            <p className="text-2xl font-bold text-white">{newRequest}</p>
          </Card>
          <div className="h-[30px] flex px-2 lg:px-5 gap-2 items-center text-white/60 text-xs lg:text-sm justify-between">
            <div className="flex gap-1.5">
              {" "}
              {trends.newRequest >= 0 ? (
                <div className="flex gap-1 bg-[#93FF96]/10 px-1.5 rounded-3xl ">
                  <TrendingUp color="#93FF96" size={18} />{" "}
                  <p className="text-[#93FF96]  text-xs lg:text-sm">{Math.abs(trends.newRequest)}%</p>
                </div>
              ) : (
                <div className="flex gap-1 bg-red-400/10 px-1.5 rounded-3xl ">
                  <TrendingDown color="red" size={18} />{" "}
                  <p className="text-red-500  text-xs lg:text-sm">{Math.abs(trends.newRequest)}%</p>
                </div>
              )}
              <p className="text-white/60 text-xs lg:text-sm">last month</p>
            </div>
            <span className="flex items-center gap-1.5">
              <p className="hidden lg:block">show more</p>
              <ArrowRight size={16} />
            </span>
          </div>
        </Card>
        <Card className="p-0 gap-1 bg-[#121420] border-white/10">
          <Card className="h-auto gap-1 p-4">
            <div className="h-[32px] w-[32px] bg-yellow-300/30 rounded-sm p-[4px]">
              <CalendarPlus color="yellow" size={24} />
            </div>
            <h2 className="text-white/60 font-bold text-md">Total Request</h2>
            <p className="text-2xl font-bold text-white">{totalRequest}</p>
          </Card>
          <div className="h-[30px] flex px-2 lg:px-5 gap-2 items-center text-white/60 text-xs lg:text-sm justify-between">
            <div className="flex gap-1.5">
              {" "}
              {trends.totalRequest >= 0 ? (
                <div className="flex gap-1 bg-[#93FF96]/10 px-1.5 rounded-3xl ">
                  <TrendingUp color="#93FF96" size={18} />{" "}
                  <p className="text-[#93FF96]  text-xs lg:text-sm">{Math.abs(trends.totalRequest)}%</p>
                </div>
              ) : (
                <div className="flex gap-1 bg-red-400/10 px-1.5 rounded-3xl ">
                  <TrendingDown color="red" size={18} />{" "}
                  <p className="text-red-500  text-xs lg:text-sm">{Math.abs(trends.totalRequest)}%</p>
                </div>
              )}
              <p className="text-white/60 text-xs lg:text-sm">last month</p>
            </div>
            <span className="flex items-center gap-1.5">
              <p className="hidden lg:block">show more</p>
              <ArrowRight size={16} />
            </span>
          </div>
        </Card>
        <Card className="p-0 gap-1 bg-[#121420] border-white/10">
          <Card className="h-auto gap-1 p-4">
            <div className="h-[32px] w-[32px] bg-yellow-300/30 rounded-sm p-[4px]">
              <BadgeCent color="yellow" size={24} />
            </div>
            <h2 className="text-white/60 font-bold text-md">Upcoming Tour</h2>
            <p className="text-2xl font-bold text-white">{upcomingTour}</p>
          </Card>
          <div className="h-[30px] flex px-2 lg:px-5 gap-2 items-center text-white/60 text-xs lg:text-sm justify-between">
            <div className="flex gap-1.5">
              {" "}
              {trends.upcomingTour >= 0 ? (
                <div className="flex gap-1 bg-[#93FF96]/10 px-1.5 rounded-3xl ">
                  <TrendingUp color="#93FF96" size={18} />{" "}
                  <p className="text-[#93FF96]  text-xs lg:text-sm">{Math.abs(trends.upcomingTour)}%</p>
                </div>
              ) : (
                <div className="flex gap-1 bg-red-400/10 px-1.5 rounded-3xl ">
                  <TrendingDown color="red" size={18} />{" "}
                  <p className="text-red-500  text-xs lg:text-sm">{Math.abs(trends.upcomingTour)}%</p>
                </div>
              )}
              <p className="text-white/60 text-xs lg:text-sm">last month</p>
            </div>
            <span className="flex items-center gap-1.5">
              <p className="hidden lg:block">show more</p>
              <ArrowRight size={16} />
            </span>
          </div>
        </Card>
        <Card className="p-0 gap-1 bg-[#121420] border-white/10">
          <Card className="h-auto gap-1 p-4">
            <div className="h-[32px] w-[32px] bg-yellow-300/30 rounded-sm p-[4px]">
              <UsersRound color="yellow" size={24} />
            </div>
            <h2 className="text-white/60 font-bold text-md">Canceled</h2>
            <p className="text-2xl font-bold text-white">{canceled}</p>
          </Card>
          <div className="h-[30px] flex px-2 lg:px-5 gap-2 items-center text-white/60 text-xs lg:text-sm justify-between">
            <div className="flex gap-1.5">
              {" "}
              {trends.canceled >= 0 ? (
                <div className="flex gap-1 bg-[#93FF96]/10 px-1.5 rounded-3xl ">
                  <TrendingUp color="#93FF96" size={18} />{" "}
                  <p className="text-[#93FF96]  text-xs lg:text-sm">{Math.abs(trends.canceled)}%</p>
                </div>
              ) : (
                <div className="flex gap-1 bg-red-400/10 px-1.5 rounded-3xl ">
                  <TrendingDown color="red" size={18} />{" "}
                  <p className="text-red-500  text-xs lg:text-sm">{Math.abs(trends.canceled)}%</p>
                </div>
              )}
              <p className="text-white/60 text-xs lg:text-sm">last year</p>
            </div>
            <span className="flex items-center gap-1.5">
              <p className="hidden lg:block">show more</p>
              <ArrowRight size={16} />
            </span>
          </div>
        </Card>
      </div>
      <div className="w-full py-4 lg:grid flex flex-col-reverse lg:grid-cols-[70%_34%] gap-2 lg:gap-x-4 px-[5%] lg:mr-[5%] lg:px-[0]">
        <div className="">
          <div className="w-full mb-4">
            <ChartAreaInteractive />
          </div>
          <Card className="p-4 bg-white/10">
            <p className="text-lg font-bold text-white mb-4">
              Booking {tableInfo.length > 0 && `(${tableInfo.length})`}
            </p>
            {tableInfo.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-white/60">No bookings found</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block">
                  <DataTable
                    columns={columns(() => {
                      fetchBookings();
                      fetchProperties();
                    })}
                    data={tableInfo}
                  />
                </div>
                {/* Mobile Table */}
                <div className="lg:hidden">
                  <MobileBookingTable table={tableInfo} />
                </div>
              </>
            )}
          </Card>
        </div>
        <Calendar31 className="" />
      </div>
    </>
  );
}
