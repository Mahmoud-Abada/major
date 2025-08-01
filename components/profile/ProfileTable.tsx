import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReactNode } from "react";

export interface TableColumn {
  header: string;
  accessorKey: string;
  cell?: (value: any, row: any) => ReactNode;
}

interface ProfileTableProps {
  columns: TableColumn[];
  data: any[];
  onRowClick?: (row: any) => void;
  actions?: (row: any) => ReactNode;
  emptyState?: ReactNode;
  className?: string;
}

export function ProfileTable({
  columns,
  data,
  onRowClick,
  actions,
  emptyState,
  className,
}: ProfileTableProps) {
  if (data.length === 0 && emptyState) {
    return <div className="py-8 text-center">{emptyState}</div>;
  }

  return (
    <div className={`w-full overflow-auto ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.accessorKey}>{column.header}</TableHead>
            ))}
            {actions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className={onRowClick ? "cursor-pointer" : ""}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column) => (
                <TableCell key={`${rowIndex}-${column.accessorKey}`}>
                  {column.cell
                    ? column.cell(row[column.accessorKey], row)
                    : row[column.accessorKey]}
                </TableCell>
              ))}
              {actions && (
                <TableCell className="text-right">{actions(row)}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
