import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { ProfileTable, TableColumn } from "../ProfileTable";

interface SubjectsListProps {
  subjects: any[];
  onViewSubject?: (subjectId: string) => void;
}

export function SubjectsList({ subjects, onViewSubject }: SubjectsListProps) {
  const columns: TableColumn[] = [
    { header: "Subject Name", accessorKey: "name" },
    { header: "Code", accessorKey: "code" },
    {
      header: "Teacher",
      accessorKey: "teacher",
      cell: (value, row) => (
        <a
          href={`/classroom/teachers/${row.teacherId}`}
          className="hover:underline"
        >
          {value}
        </a>
      ),
    },
    {
      header: "Schedule",
      accessorKey: "schedule",
    },
  ];

  return (
    <ProfileTable
      columns={columns}
      data={subjects}
      actions={(row) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onViewSubject && onViewSubject(row.id)}
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      )}
    />
  );
}
