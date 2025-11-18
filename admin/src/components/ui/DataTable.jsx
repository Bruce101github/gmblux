"use client";

import { useEffect, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";

export function DataTable({ columns, data, meta }) {
  // Memoize the table options to ensure proper updates
  const tableOptions = useMemo(() => ({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta,
    // Use the row's id field as the unique identifier
    getRowId: (row) => row.id?.toString() || Math.random().toString(),
    // Force re-render when data changes
    enableRowSelection: false,
  }), [data, columns, meta]);

  const table = useReactTable(tableOptions);

  // Force re-render when data changes
  useEffect(() => {
    table.resetRowSelection();
  }, [data, table]);

  return (
    <div className="overflow-hidden text-white">
      <Table className="relative">
        <TableHeader className="bg-white/10 rounded-3xl text-white rounded-md ">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="rounded-md">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-white/60 font-medium"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="overflow-y">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
                className="border-b border-b-white/10"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
