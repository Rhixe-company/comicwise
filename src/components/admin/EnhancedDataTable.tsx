"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Download, Filter, X } from "lucide-react";
import Papa from "papaparse";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

interface EnhancedDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  enableRowSelection?: boolean;
  exportFilename?: string;
  onBulkDelete?(selectedIds: number[]): Promise<void>;
  searchPlaceholder?: string;
}

export function EnhancedDataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Search...",
  onBulkDelete,
  enableRowSelection = false,
  exportFilename = "export",
}: EnhancedDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const selectedRowCount = Object.keys(rowSelection).length;

  async function handleBulkDelete() {
    if (!onBulkDelete) {
      return;
    }

    const selectedIds = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => (row.original as { id: number }).id);

    if (
      !confirm(
        `Are you sure you want to delete ${selectedIds.length} item(s)? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await onBulkDelete(selectedIds);
      toast.success(`Successfully deleted ${selectedIds.length} item(s)`);
      setRowSelection({});
    } catch {
      toast.error("Failed to delete items");
    } finally {
      setIsDeleting(false);
    }
  }

  function exportToCSV() {
    const exportData = table.getFilteredRowModel().rows.map((row) => {
      const rowData: Record<string, unknown> = {};
      for (const col of columns) {
        const column = col as { accessorKey?: string; header?: string };
        if (column.accessorKey && column.header) {
          rowData[column.header] = (row.original as Record<string, unknown>)[column.accessorKey];
        }
      }
      return rowData;
    });

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${exportFilename}-${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Data exported successfully");
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          <Input
            className="h-9 max-w-sm"
            onChange={(event) =>
              table
                .getColumn((columns[1] as { id?: string })?.id || "search")
                ?.setFilterValue(event.target.value)
            }
            placeholder={searchPlaceholder}
            value={
              (table
                .getColumn((columns[1] as { id?: string })?.id || "search")
                ?.getFilterValue() as string) ?? ""
            }
          />
          {columnFilters.length > 0 && (
            <Button
              className={`
                h-9 px-2
                lg:px-3
              `}
              onClick={() => setColumnFilters([])}
              variant="ghost"
            >
              Reset
              <X className="ml-2 size-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={exportToCSV} size="sm" variant="outline">
            <Download className="mr-2 size-4" />
            Export CSV
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <Filter className="mr-2 size-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      checked={column.getIsVisible()}
                      className="capitalize"
                      key={column.id}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Selection Info */}
      {enableRowSelection && selectedRowCount > 0 && (
        <div
          className={`
            bg-muted flex items-center justify-between rounded-md px-4 py-2
          `}
        >
          <span className="text-sm">
            {selectedRowCount} of {table.getFilteredRowModel().rows.length} row(s) selected
          </span>
          {onBulkDelete && (
            <Button
              disabled={isDeleting}
              onClick={handleBulkDelete}
              size="sm"
              variant="destructive"
            >
              {isDeleting ? "Deleting..." : "Delete Selected"}
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow data-state={row.getIsSelected() && "selected"} key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={columns.length}>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Info */}
      <div
        className={`
          text-muted-foreground flex items-center justify-between text-sm
        `}
      >
        <div>
          Showing {table.getFilteredRowModel().rows.length} of {data.length} result(s)
        </div>
        {enableRowSelection && (
          <div>
            {selectedRowCount} of {table.getFilteredRowModel().rows.length} row(s) selected
          </div>
        )}
      </div>
    </div>
  );
}

// Helper to create selection column
export function createSelectionColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}
