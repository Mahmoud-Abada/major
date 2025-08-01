import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { ProfileTable, TableColumn } from "../ProfileTable";
import { StatusBadge } from "../StatusBadge";

interface ChildrenListProps {
  children: any[];
  onViewChild?: (childId: string) => void;
}

export function ChildrenList({ children, onViewChild }: ChildrenListProps) {
  const columns: TableColumn[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (value, row) => (
        <div className="flex items-center gap-2">
          {row.avatar && (
            <img
              src={row.avatar}
              alt={value}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <span>{value}</span>
        </div>
      ),
    },
    { header: "Grade", accessorKey: "grade" },
    { header: "Class", accessorKey: "class" },
    {
      header: "Status",
      accessorKey: "status",
      cell: (value) => <StatusBadge status={value} />,
    },
  ];

  return (
    <ProfileTable
      columns={columns}
      data={children}
      actions={(row) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onViewChild && onViewChild(row.id)}
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      )}
    />
  );
}
