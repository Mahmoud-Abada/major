import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProfileTable, TableColumn } from "../ProfileTable";
import { StatusBadge } from "../StatusBadge";

interface AttendanceRecordProps {
  attendance: any[];
  overallAttendance: number;
}

export function AttendanceRecord({
  attendance,
  overallAttendance,
}: AttendanceRecordProps) {
  const columns: TableColumn[] = [
    {
      header: "Date",
      accessorKey: "date",
      cell: (value) => new Date(value).toLocaleDateString(),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (value) => <StatusBadge status={value} />,
    },
    {
      header: "Attendance",
      accessorKey: "percentage",
      cell: (value) => `${value}%`,
    },
    {
      header: "Classes Attended",
      accessorKey: "attendedClasses",
      cell: (value, row) => `${value}/${row.totalClasses}`,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Overall Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{overallAttendance}%</div>
          <Progress value={overallAttendance} className="h-2 mt-2" />
        </CardContent>
      </Card>

      <ProfileTable columns={columns} data={attendance} />
    </div>
  );
}
