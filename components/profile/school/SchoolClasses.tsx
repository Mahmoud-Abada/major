import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Plus, Search, Users } from "lucide-react";
import { ProfileTable, TableColumn } from "../ProfileTable";

interface Class {
  id: string;
  name: string;
  grade: string;
  classTeacher: {
    name: string;
    id: string;
  };
  studentCount: number;
  capacity: number;
  room?: string;
  department: string;
}

interface SchoolClassesProps {
  classes: Class[];
  grades: string[];
  departments: string[];
  onViewClass?: (classId: string) => void;
  onAddClass?: () => void;
  onFilterChange?: (grade: string) => void;
}

export function SchoolClasses({
  classes,
  grades,
  departments,
  onViewClass,
  onAddClass,
  onFilterChange,
}: SchoolClassesProps) {
  const columns: TableColumn[] = [
    { header: "Class Name", accessorKey: "name" },
    { header: "Grade", accessorKey: "grade" },
    {
      header: "Class Teacher",
      accessorKey: "classTeacher",
      cell: (value) => (
        <a href={`/classroom/teachers/${value.id}`} className="hover:underline">
          {value.name}
        </a>
      ),
    },
    {
      header: "Students",
      accessorKey: "studentCount",
      cell: (value, row) => (
        <div className="w-full">
          <div className="flex justify-between text-xs mb-1">
            <span>{value}</span>
            <span>{row.capacity}</span>
          </div>
          <Progress value={(value / row.capacity) * 100} className="h-2" />
        </div>
      ),
    },
    { header: "Room", accessorKey: "room" },
    { header: "Department", accessorKey: "department" },
  ];

  // Group classes by grade for summary
  const classesByGrade = classes.reduce(
    (acc, cls) => {
      acc[cls.grade] = (acc[cls.grade] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Calculate total students
  const totalStudents = classes.reduce((sum, cls) => sum + cls.studentCount, 0);

  // Calculate average class size
  const averageClassSize =
    classes.length > 0 ? Math.round(totalStudents / classes.length) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-semibold">School Classes</h3>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search classes..."
              className="pl-8 w-full sm:w-[200px]"
            />
          </div>

          <div className="flex items-center gap-2">
            {onFilterChange && (
              <div className="flex items-center gap-2">
                <Select onValueChange={onFilterChange}>
                  <SelectTrigger className="w-[150px]">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="All Grades" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {onAddClass && (
              <Button onClick={onAddClass}>
                <Plus className="h-4 w-4 mr-2" />
                Add Class
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm font-medium text-muted-foreground">
                Total Classes
              </div>
            </div>
            <div className="text-2xl font-bold mt-1">{classes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm font-medium text-muted-foreground">
                Total Students
              </div>
            </div>
            <div className="text-2xl font-bold mt-1">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm font-medium text-muted-foreground">
                Average Class Size
              </div>
            </div>
            <div className="text-2xl font-bold mt-1">{averageClassSize}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm font-medium text-muted-foreground">
                Grades
              </div>
            </div>
            <div className="text-2xl font-bold mt-1">
              {Object.keys(classesByGrade).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {Object.entries(classesByGrade).map(([grade, count]) => (
          <div key={grade} className="bg-card border rounded-lg p-3">
            <div className="text-sm font-medium">{grade}</div>
            <div className="text-xl font-bold mt-1">{count}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round((count / classes.length) * 100)}% of classes
            </div>
          </div>
        ))}
      </div>

      <ProfileTable
        columns={columns}
        data={classes}
        onRowClick={onViewClass ? (row) => onViewClass(row.id) : undefined}
        emptyState={
          <div className="text-center py-8">
            <p className="text-muted-foreground">No classes found</p>
            {onAddClass && (
              <Button className="mt-4" size="sm" onClick={onAddClass}>
                <Plus className="h-4 w-4 mr-2" />
                Add Class
              </Button>
            )}
          </div>
        }
      />
    </div>
  );
}
