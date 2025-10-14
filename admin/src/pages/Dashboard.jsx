import React from "react";
import { Table } from "@/components/ui/table";
import { DataTable } from "@/components/ui/DataTable";
import { ChartBarMultiple } from "@/components/ui/ChartBarMultiple";
import { columns } from "@/pages/bookings/columns";
import Calendar14 from "../components/calendar-14.jsx";
import { sampleBookings } from "@/pages/bookings/sampleData"; // your booking data
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import {
  CalendarPlus,
  CircleFadingPlus,
  BadgeCent,
  UsersRound,
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

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    async function fetchBookings() {
      const { data, error } = await supabase.from("properties").select("*");

      if (error) {
        console.error("Error fetching bookings:", error);
      } else {
        setBookings(data);
        console.log(data);
      }
    }
    fetchBookings();
  }, []);
  return (
    <Card className="w-full min-h-[200vh] bg-white p-8 bg-fixed">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-4 gap-x-5">
        <Card className="p-0 gap-1 bg-[#F4F4F8]">
          <Card className="h-auto gap-1 p-4">
            <div className="h-[32px] w-[32px] bg-yellow-400 rounded-sm p-[4px]">
              <CircleFadingPlus color="white" size={24} />
            </div>
            <h2 className="text-gray-500 font-bold text-lg">
              Upcoming Bookings
            </h2>
            <p className="text-2xl font-md">{bookings.length}</p>
          </Card>
          <div className="h-[40px]"></div>
        </Card>
        <Card className="p-0 gap-1  bg-[#F4F4F8]">
          <Card className="h-auto gap-1 p-4">
            <div className="h-[32px] w-[32px] bg-yellow-400 rounded-sm p-[4px]">
              <CalendarPlus color="white" size={24} />
            </div>
            <h2 className="text-gray-500 font-bold text-sm">Total Bookings</h2>
            <p className="text-2xl font-md">{bookings.length}</p>
          </Card>
          <div className="h-[40px]"></div>
        </Card>
        <Card className="p-0 gap-1  bg-[#F4F4F8]">
          <Card className="h-auto gap-1 p-4">
            <div className="h-[32px] w-[32px] bg-yellow-400 rounded-sm p-[4px]">
              <BadgeCent color="white" size={24} />
            </div>
            <h2 className="text-gray-500 font-bold text-sm">Total Revenue</h2>
            <p className="text-2xl font-md">GH₵120,000</p>
          </Card>
          <div className="h-[40px]"></div>
        </Card>
        <Card className="p-0 gap-1  bg-[#F4F4F8]">
          <Card className="h-auto gap-1 p-4">
            <div className="h-[32px] w-[32px] bg-yellow-400 rounded-sm p-[4px]">
              <UsersRound color="white" size={24} />
            </div>
            <h2 className="text-gray-500 font-bold text-sm">Total Customers</h2>
            <p className="text-2xl font-md">{bookings.length}</p>
          </Card>
          <div className="h-[40px]"></div>
        </Card>
      </div>
      <Card className="px-4 py-4">
        <div className="flex gap-x-4 grid-cols-3">
          <Calendar14 />
        </div>
        <span>
          {" "}
          <p className="text-lg font-bold">Booking</p>
        </span>

        <DataTable columns={columns} data={bookings} />
      </Card>
    </Card>
  );
}
