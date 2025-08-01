"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
    RiArrowDownSLine,
    RiArrowUpSLine,
    RiCloseCircleLine,
    RiDeleteBinLine,
    RiErrorWarningLine,
    RiFilter3Line,
    RiSearch2Line
} from "@remixicon/react";
import {
    ColumnDef,
    ColumnFiltersState,
    FilterFn,
    PaginationState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import {
    ReactNode,
    useId,
    useMemo,
    useRef,
    useState
} from "react";

// Generic data table interfaces
export interface DataTableColumn<T> extends ColumnDef<T> {
  accessorKey: string;
  header: string;
  cell?: (props: { row: { original: T }; getValue: () => any }) => ReactNode;
  size?: number;
  enableSorting?: boolean;
  enableHiding?: boolean;
  filterFn?: FilterFn<T>;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  onDataChange?: (data: T[]) => void;
  searchKey?: string;
  searchPlaceholder?: string;
  enableSelection?: boolean;
  enableFiltering?: boolean;
  enableColumnVisibility?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  viewModes?: ("table" | "grid")[];
  renderGridItem?: (item: T, isSelected: boolean, onSelect: () => void) => ReactNode;
  onRowClick?: (item: T) => void;
  bulkActions?: Array<{
    label: string;
    icon?: ReactNode;
    action: (selectedItems: T[]) => void;
    variant?: "default" | "destructive";
  }>;
  filters?: Array<{
    key: string;
    label: string;
    options: Array<{ label: string; value: string }>;
  }>;
  className?: string;
  emptyState?: ReactNode;
  loading?: boolean;
}

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onDataChange,
  searchKey = "name",
  searchPlaceholder = "Search...",
  enableSelection = true,
  enableFiltering = true,
  enableColumnVisibility = true,
  enablePagination = true,
  pageSize = 10,
  viewModes = ["table", "grid"],
  renderGridItem,
  onRowClick,
  bulkActions = [],
  filters = [],
  className,
  emptyState,
  loading = false,
}: DataTableProps<T>) {
  const id = useId();
  const [viewMode, setViewMode] = useState<"table" | "grid">(viewModes[0] || "table");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Add selection column if enabled
  const tableColumns = useMemo(() => {
    const cols: ColumnDef<T>[] = [];

    if (enableSelection) {
      cols.push({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        size: 28,
        enableSorting: false,
        enableHiding: false,
      });
    }

    cols.push(...columns);
    return cols;
  }, [columns, enableSelection]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination: enablePagination ? pagination : { pageIndex: 0, pageSize: data.length },
      columnFilters,
      columnVisibility,
    },
  });

  const handleBulkAction = (action: (selectedItems: T[]) => void) => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedItems = selectedRows.map((row) => row.original);
    action(selectedItems);
    table.resetRowSelection();
  };

  const handleDeleteSelected = () => {
    if (onDataChange) {
      const selectedRows = table.getSelectedRowModel().rows;
      const updatedData = data.filter(
        (item) => !selectedRows.some((row) => row.original.id === item.id)
      );
      onDataChange(updatedData);
      table.resetRowSelection();
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left side - Search and Filters */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Input
              id={`${id}-search`}
              ref={inputRef}
              className={cn(
                "peer min-w-60 ps-9 bg-background bg-gradient-to-br from-accent/60 to-accent",
                Boolean(table.getColumn(searchKey)?.getFilterValue()) && "pe-9"
              )}
              value={(table.getColumn(searchKey)?.getFilterValue() ?? "") as string}
              onChange={(e) =>
                table.getColumn(searchKey)?.setFilterValue(e.target.value)
              }
              placeholder={searchPlaceholder}
              type="text"
              aria-label={searchPlaceholder}
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/60 peer-disabled:opacity-50">
              <RiSearch2Line size={20} aria-hidden="true" />
            </div>
            {Boolean(table.getColumn(searchKey)?.getFilterValue()) && (
              <button
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/60 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline-2 focus-visible:outline-ring/70"
                aria-label="Clear search"
                onClick={() => {
                  table.getColumn(searchKey)?.setFilterValue("");
                  inputRef.current?.focus();
                }}
              >
                <RiCloseCircleLine size={16} aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Custom Filters */}
          {enableFiltering && filters.map((filter) => (
            <FilterPopover
              key={filter.key}
              filter={filter}
              table={table}
              id={id}
            />
          ))}
        </div>

        {/* Right side - Actions and View Controls */}
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          {viewModes.length > 1 && (
            <div className="flex items-center gap-1 rounded-md border p-1">
              {viewModes.map((mode) => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode(mode)}
                  className="h-7 px-2 text-xs"
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Button>
              ))}
            </div>
          )}

          {/* Bulk Actions */}
          {enableSelection && table.getSelectedRowModel().rows.length > 0 && (
            <div className="flex items-center gap-2">
              {bulkActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant === "destructive" ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => handleBulkAction(action.action)}
                  className="gap-2"
                >
                  {action.icon}
                  {action.label}
                  <span className="inline-flex h-5 items-center rounded border border-border bg-background px-1 text-[0.625rem] font-medium text-muted-foreground/70">
                    {table.getSelectedRowModel().rows.length}
                  </span>
                </Button>
              ))}

              {/* Default Delete Action */}
              {onDataChange && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <RiDeleteBinLine size={16} aria-hidden="true" />
                      Delete
                      <span className="inline-flex h-5 items-center rounded border border-border bg-background px-1 text-[0.625rem] font-medium text-muted-foreground/70">
                        {table.getSelectedRowModel().rows.length}
                      </span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border">
                        <RiErrorWarningLine className="opacity-80" size={16} />
                      </div>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete{" "}
                          {table.getSelectedRowModel().rows.length} selected{" "}
                          {table.getSelectedRowModel().rows.length === 1 ? "item" : "items"}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteSelected}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          )}

          {/* Column Visibility */}
          {enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table.getAllLeafColumns().map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Data Display */}
      <AnimatePresence mode="wait">
        {viewMode === "table" ? (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TableView
              table={table}
              loading={loading}
              emptyState={emptyState}
              onRowClick={onRowClick}
            />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <GridView
              table={table}
              loading={loading}
              emptyState={emptyState}
              renderGridItem={renderGridItem}
              onRowClick={onRowClick}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {enablePagination && table.getRowModel().rows.length > 0 && (
        <div className="flex items-center justify-between gap-3">
          <p className="flex-1 whitespace-nowrap text-sm text-muted-foreground">
            Page{" "}
            <span className="text-foreground">
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
            of <span className="text-foreground">{table.getPageCount()}</span>
          </p>
          <Pagination className="w-auto">
            <PaginationContent className="gap-3">
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

// Table View Component
function TableView<T>({
  table,
  loading,
  emptyState,
  onRowClick,
}: {
  table: any;
  loading: boolean;
  emptyState?: ReactNode;
  onRowClick?: (item: T) => void;
}) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup: any) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header: any) => (
                <TableHead
                  key={header.id}
                  style={{ width: header.getSize() ? `${header.getSize()}px` : undefined }}
                  className="bg-muted/50"
                >
                  {header.isPlaceholder ? null : header.column.getCanSort() ? (
                    <div
                      className="flex cursor-pointer select-none items-center gap-2"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <RiArrowUpSLine size={16} />,
                        desc: <RiArrowDownSLine size={16} />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  ) : (
                    flexRender(header.column.columnDef.header, header.getContext())
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="ml-2">Loading...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            <motion.tbody
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              {table.getRowModel().rows.map((row: any) => (
                <motion.tr
                  key={row.id}
                  variants={itemVariants}
                  className={cn(
                    "border-b transition-colors hover:bg-muted/50",
                    onRowClick && "cursor-pointer",
                    row.getIsSelected() && "bg-muted"
                  )}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </motion.tr>
              ))}
            </motion.tbody>
          ) : (
            <TableRow>
              <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                {emptyState || "No results found."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Grid View Component
function GridView<T>({
  table,
  loading,
  emptyState,
  renderGridItem,
  onRowClick,
}: {
  table: any;
  loading: boolean;
  emptyState?: ReactNode;
  renderGridItem?: (item: T, isSelected: boolean, onSelect: () => void) => ReactNode;
  onRowClick?: (item: T) => void;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!table.getRowModel().rows?.length) {
    return (
      <div className="border rounded-lg p-8 text-center">
        {emptyState || "No results found."}
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      variants={listVariants}
      initial="hidden"
      animate="show"
    >
      {table.getRowModel().rows.map((row: any) => (
        <motion.div
          key={row.id}
          variants={itemVariants}
          className={cn(
            "border rounded-lg p-4 transition-colors hover:bg-muted/50",
            onRowClick && "cursor-pointer",
            row.getIsSelected() && "bg-muted"
          )}
          onClick={() => onRowClick?.(row.original)}
        >
          {renderGridItem ? (
            renderGridItem(
              row.original,
              row.getIsSelected(),
              () => row.toggleSelected()
            )
          ) : (
            <div>
              <div className="font-medium mb-2">
                {row.original.name || row.original.title || "Item"}
              </div>
              <div className="text-sm text-muted-foreground">
                ID: {row.original.id}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Filter Popover Component
function FilterPopover<T>({
  filter,
  table,
  id,
}: {
  filter: { key: string; label: string; options: Array<{ label: string; value: string }> };
  table: any;
  id: string;
}) {
  const column = table.getColumn(filter.key);
  const filterValue = (column?.getFilterValue() as string[]) ?? [];

  const handleFilterChange = (checked: boolean, value: string) => {
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    column?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <RiFilter3Line size={16} />
          {filter.label}
          {filterValue.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {filterValue.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto min-w-36 p-3" align="end">
        <div className="space-y-3">
          <div className="text-xs font-medium uppercase text-muted-foreground/60">
            {filter.label}
          </div>
          <div className="space-y-2">
            {filter.options.map((option, i) => (
              <div key={option.value} className="flex items-center gap-2">
                <Checkbox
                  id={`${id}-${filter.key}-${i}`}
                  checked={filterValue.includes(option.value)}
                  onCheckedChange={(checked: boolean) =>
                    handleFilterChange(checked, option.value)
                  }
                />
                <Label
                  htmlFor={`${id}-${filter.key}-${i}`}
                  className="text-sm font-normal"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}