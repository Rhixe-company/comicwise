import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { atom, useAtom } from "jotai";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react";
import { createContext, memo, useCallback, useContext } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TableBody as TableBodyRaw,
  TableCell as TableCellRaw,
  TableHeader as TableHeaderRaw,
  TableHead as TableHeadRaw,
  Table as TableRaw,
  TableRow as TableRowRaw,
} from "@/components/ui/table";

import { cn } from "utils";

import type {
  Cell,
  Column,
  ColumnDef,
  Header,
  HeaderGroup,
  Row,
  SortingState,
  Table,
} from "@tanstack/react-table";
import type { HTMLAttributes, ReactNode } from "react";

export type { ColumnDef } from "@tanstack/react-table";

const sortingAtom = atom<SortingState>([]);

export const TableContext = createContext<{
  columns: ColumnDef<unknown, unknown>[];
  data: unknown[];
  table: null | Table<unknown>;
}>({
  data: [],
  columns: [],
  table: null,
});

export interface TableProviderProps<TData, TValue> {
  children: ReactNode;
  className?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function TableProvider<TData, TValue>({
  columns,
  data,
  children,
  className,
}: TableProviderProps<TData, TValue>) {
  const [sorting, setSorting] = useAtom(sortingAtom);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: (updater) => {
      const newSorting = typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);
    },
    state: {
      sorting,
    },
  });

  return (
    <TableContext.Provider
      value={{
        data,
        columns: columns as never,
        table: table as never,
      }}
    >
      <TableRaw className={className}>{children}</TableRaw>
    </TableContext.Provider>
  );
}

export interface TableHeadProps {
  className?: string;
  header: Header<unknown, unknown>;
}

export const TableHead = memo(({ header, className }: TableHeadProps) => (
  <TableHeadRaw className={className} key={header.id}>
    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
  </TableHeadRaw>
));

TableHead.displayName = "TableHead";

export interface TableHeaderGroupProps {
  children(props: { header: Header<unknown, unknown> }): ReactNode;
  headerGroup: HeaderGroup<unknown>;
}

export const TableHeaderGroup = ({ headerGroup, children }: TableHeaderGroupProps) => (
  <TableRowRaw key={headerGroup.id}>
    {headerGroup.headers.map((header) => children({ header }))}
  </TableRowRaw>
);

export interface TableHeaderProps {
  children(props: { headerGroup: HeaderGroup<unknown> }): ReactNode;
  className?: string;
}

export const TableHeader = ({ className, children }: TableHeaderProps) => {
  const { table } = useContext(TableContext);

  return (
    <TableHeaderRaw className={className}>
      {table?.getHeaderGroups().map((headerGroup) => children({ headerGroup }))}
    </TableHeaderRaw>
  );
};

export interface TableColumnHeaderProps<TData, TValue> extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function TableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: TableColumnHeaderProps<TData, TValue>) {
  // Extract inline event handlers to prevent unnecessary re-renders
  const handleSortAsc = useCallback(() => {
    column.toggleSorting(false);
  }, [column]);

  const handleSortDesc = useCallback(() => {
    column.toggleSorting(true);
  }, [column]);

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={`
              data-[state=open]:bg-accent -ml-3
              h-8
            `}
            size="sm"
            variant="ghost"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDownIcon className="ml-2 size-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 size-4" />
            ) : (
              <ChevronsUpDownIcon className="ml-2 size-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={handleSortAsc}>
            <ArrowUpIcon className="text-muted-foreground/70 mr-2 size-3.5" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSortDesc}>
            <ArrowDownIcon className="text-muted-foreground/70 mr-2 size-3.5" />
            Desc
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export interface TableCellProps {
  cell: Cell<unknown, unknown>;
  className?: string;
}

export const TableCell = ({ cell, className }: TableCellProps) => (
  <TableCellRaw className={className}>
    {flexRender(cell.column.columnDef.cell, cell.getContext())}
  </TableCellRaw>
);

export interface TableRowProps {
  children(props: { cell: Cell<unknown, unknown> }): ReactNode;
  className?: string;
  row: Row<unknown>;
}

export const TableRow = ({ row, children, className }: TableRowProps) => (
  <TableRowRaw className={className} data-state={row.getIsSelected() && "selected"} key={row.id}>
    {row.getVisibleCells().map((cell) => children({ cell }))}
  </TableRowRaw>
);

export interface TableBodyProps {
  children(props: { row: Row<unknown> }): ReactNode;
  className?: string;
}

export const TableBody = ({ children, className }: TableBodyProps) => {
  const { columns, table } = useContext(TableContext);
  const rows = table?.getRowModel().rows;

  return (
    <TableBodyRaw className={className}>
      {rows?.length ? (
        rows.map((row) => children({ row }))
      ) : (
        <TableRowRaw>
          <TableCellRaw className="h-24 text-center" colSpan={columns.length}>
            No results.
          </TableCellRaw>
        </TableRowRaw>
      )}
    </TableBodyRaw>
  );
};
