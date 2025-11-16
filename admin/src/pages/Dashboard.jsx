import React from "react";
import { Table } from "@/components/ui/table";
import { DataTable } from "@/components/ui/DataTable";
import { ChartAreaInteractive } from "@/components/ui/ChartAreaInteractive";
import { columns } from "@/pages/bookings/columns";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
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
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [tableInfo, setTableInfo] = useState([]);
  const [newRequest, setNewRequest] = useState("");
  const [totalRequest, setTotalRequest] = useState("");
  const [upcomingTour, setUpcomingTour] = useState("");
  const [canceled, setCanceled] = useState("");

  useEffect(() => {
    async function fetchBookings() {
      const { data, error } = await supabase
        .from("booking")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching bookings:", error);
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
        console.error("Error fetching properties:", error);
        setProperties([]);
      } else {
        setProperties(properties || []);
      }
    }
    fetchBookings();
    fetchProperties();
  }, []);

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
              <div className="flex gap-1 bg-[#93FF96]/10 px-1.5 rounded-3xl ">
                <TrendingUp color="#93FF96" size={18} />{" "}
                <p className="text-[#93FF96]  text-xs lg:text-sm">17%</p>
              </div>
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
              <div className="flex gap-1 bg-[#93FF96]/10 px-1.5 rounded-3xl ">
                <TrendingUp color="#93FF96" size={18} />{" "}
                <p className="text-[#93FF96]  text-xs lg:text-sm">9%</p>
              </div>
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
              <div className="flex gap-1 bg-red-400/10 px-1.5 rounded-3xl ">
                <TrendingDown color="red" size={18} />{" "}
                <p className="text-red-500  text-xs lg:text-sm">10%</p>
              </div>
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
              <div className="flex gap-1 bg-[#93FF96]/10 px-1.5 rounded-3xl ">
                <TrendingUp color="#93FF96" size={18} />{" "}
                <p className="text-[#93FF96]  text-xs lg:text-sm">10%</p>
              </div>
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
                  <DataTable columns={columns} data={tableInfo} />
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
