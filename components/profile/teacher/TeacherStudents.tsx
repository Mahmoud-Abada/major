import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, User } from "lucide-react";
import { ProfileTable, TableColumn } from "../ProfileTable";
import { StatusBadge } from "../StatusBadge";

interface Student {
  id: string;
  name: string;
  avatar?: string;
  grade: string;
  class: string;
  classId?: string;
  status: string;
  attendance?: number;
  performance?: number;
}

interface TeacherStudentsProps {
  students: Student[];
  classes: {
    id: string;
    name: string;
    studentCount: number;
  }[];
  onViewStudent?: (studentId: string) => void;
}

export function TeacherStudents({
  students,
  classes,
  onViewStudent,
}: TeacherStudentsProps) {
  const columns: TableColumn[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (value, row) => (
        <div className="flex items-center space-x-2">
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
    {
      header: "Class",
      accessorKey: "class",
      cell: (value, row) =>
        row.classId ? (
          <a
            href={`/classroom/classes/${row.classId}`}
            className="hover:underline"
          >
            {value}
          </a>
        ) : (
          value
        ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (value) => <StatusBadge status={value} />,
    },
    {
      header: "Attendance",
      accessorKey: "attendance",
      cell: (value) =>
        value !== undefined ? (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                value >= 90
                  ? "bg-green-600"
                  : value >= 75
                    ? "bg-blue-600"
                    : value >= 60
                      ? "bg-yellow-600"
                      : "bg-red-600"
              }`}
              style={{ width: `${value}%` }}
            ></div>
          </div>
        ) : (
          "-"
        ),
    },
    {
      header: "Performance",
      accessorKey: "performance",
      cell: (value) =>
        value !== undefined ? (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                value >= 90
                  ? "bg-green-600"
                  : value >= 75
                    ? "bg-blue-600"
                    : value >= 60
                      ? "bg-yellow-600"
                      : "bg-red-600"
              }`}
              style={{ width: `${value}%` }}
            ></div>
          </div>
        ) : (
          "-"
        ),
    },
  ];

  // Group students by class
  const studentsByClass = classes.reduce(
    (acc, cls) => {
      acc[cls.id] = students.filter((student) => {
        const classMatch = student.classId === cls.id;
        return classMatch;
      });
      return acc;
    },
    {} as Record<string, Student[]>,
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {classes.map((cls) => (
          <Card key={cls.id}>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">
                {cls.name}
              </div>
              <div className="text-2xl font-bold mt-1">{cls.studentCount}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all">
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">
            All Students
          </TabsTrigger>
          {classes.map((cls) => (
            <TabsTrigger key={cls.id} value={cls.id} className="flex-1">
              {cls.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <ProfileTable
            columns={columns}
            data={students}
            onRowClick={(row) => onViewStudent && onViewStudent(row.id)}
            actions={(row) => (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onViewStudent && onViewStudent(row.id)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            )}
            emptyState={
              <div className="text-center py-8">
                <User className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No students found</p>
              </div>
            }
          />
        </TabsContent>

        {classes.map((cls) => (
          <TabsContent key={cls.id} value={cls.id}>
            <ProfileTable
              columns={columns}
              data={studentsByClass[cls.id] || []}
              onRowClick={(row) => onViewStudent && onViewStudent(row.id)}
              actions={(row) => (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onViewStudent && onViewStudent(row.id)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              )}
              emptyState={
                <div className="text-center py-8">
                  <User className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">
                    No students in this class
                  </p>
                </div>
              }
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
