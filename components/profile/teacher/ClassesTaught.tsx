import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { ProfileTable, TableColumn } from "../ProfileTable";

interface ClassesTaughtProps {
  classes: any[];
  onViewClass?: (classId: string) => void;
}

export function ClassesTaught({ classes, onViewClass }: ClassesTaughtProps) {
  const columns: TableColumn[] = [
    { header: "Class Name", accessorKey: "name" },
    { header: "Grade", accessorKey: "grade" },
    { header: "Room", accessorKey: "room" },
    { header: "Schedule", accessorKey: "schedule" },
    {
      header: "Students",
      accessorKey: "studentCount",
      cell: (value) => value || "N/A",
    },
  ];

  return (
    <ProfileTable
      columns={columns}
      data={classes}
      actions={(row) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onViewClass && onViewClass(row.id)}
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      )}
    />
  );
}
