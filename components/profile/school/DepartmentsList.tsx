import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { ProfileTable, TableColumn } from "../ProfileTable";

interface DepartmentsListProps {
  departments: any[];
  onViewDepartment?: (departmentId: string) => void;
}

export function DepartmentsList({
  departments,
  onViewDepartment,
}: DepartmentsListProps) {
  const columns: TableColumn[] = [
    { header: "Department Name", accessorKey: "name" },
    { header: "Head", accessorKey: "head" },
    {
      header: "Teachers",
      accessorKey: "teacherCount",
      cell: (value) => value || "0",
    },
    {
      header: "Students",
      accessorKey: "studentCount",
      cell: (value) => value || "0",
    },
  ];

  return (
    <ProfileTable
      columns={columns}
      data={departments}
      actions={(row) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onViewDepartment && onViewDepartment(row.id)}
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      )}
    />
  );
}
