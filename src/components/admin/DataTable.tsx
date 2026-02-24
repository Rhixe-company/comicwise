"use client";

import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Column<T = Record<string, unknown>> {
  accessorKey: keyof T & string;
  header: string;
}

interface DataTableProps<T extends Record<string, unknown> = Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  onDelete?(id: number | string): void;
  onEdit?(id: number | string): void;
}

export function DataTable<T extends Record<string, unknown> & { id: number | string }>({
  columns,
  data,
  onDelete,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          className="max-w-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          value={searchTerm}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey}>{column.header}</TableHead>
              ))}
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length ? (
              filteredData.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey}>
                      {String(row[column.accessorKey] ?? "")}
                    </TableCell>
                  ))}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="size-8 p-0" variant="ghost">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href={`/admin/comics/${row.id}/edit`}>
                          <DropdownMenuItem>
                            <Pencil className="mr-2 size-4" />
                            Edit
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onDelete?.(row.id)}
                        >
                          <Trash className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className={`
                  h-24 text-center
                `}
                  colSpan={columns.length + 1}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
