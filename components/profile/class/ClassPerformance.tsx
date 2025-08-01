import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, BookOpen, TrendingUp, Users } from "lucide-react";
import { ProfileTable, TableColumn } from "../ProfileTable";

interface StudentPerformance {
  id: string;
  name: string;
  avatar?: string;
  averageGrade: number;
  attendance: number;
  assignments: {
    completed: number;
    total: number;
  };
  subjects: {
    name: string;
    grade: number;
  }[];
}

interface SubjectPerformance {
  name: string;
  id: string;
  averageGrade: number;
  highestGrade: number;
  lowestGrade: number;
  passRate: number;
  teacherName: string;
  teacherId: string;
}

interface ClassPerformanceProps {
  students: StudentPerformance[];
  subjects: SubjectPerformance[];
  classAverage: number;
  attendanceRate: number;
  passRate: number;
  onViewStudent?: (studentId: string) => void;
  onViewSubject?: (subjectId: string) => void;
}

export function ClassPerformance({
  students,
  subjects,
  classAverage,
  attendanceRate,
  passRate,
  onViewStudent,
  onViewSubject,
}: ClassPerformanceProps) {
  const studentColumns: TableColumn[] = [
    {
      header: "Student",
      accessorKey: "name",
      cell: (value, row) => (
        <div className="flex items-center space-x-3">
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
    {
      header: "Average Grade",
      accessorKey: "averageGrade",
      cell: (value) => {
        const getGradeColor = (grade: number) => {
          if (grade >= 90) return "text-green-600 font-semibold";
          if (grade >= 80) return "text-blue-600 font-semibold";
          if (grade >= 70) return "text-yellow-600 font-semibold";
          return "text-red-600 font-semibold";
        };

        return <span className={getGradeColor(value)}>{value}%</span>;
      },
    },
    {
      header: "Attendance",
      accessorKey: "attendance",
      cell: (value) => (
        <div className="w-full">
          <Progress value={value} className="h-2" />
          <div className="text-xs text-right mt-1">{value}%</div>
        </div>
      ),
    },
    {
      header: "Assignments",
      accessorKey: "assignments",
      cell: (value) => (
        <div className="w-full">
          <div className="flex justify-between text-xs mb-1">
            <span>Completed</span>
            <span>
              {value.completed}/{value.total}
            </span>
          </div>
          <Progress
            value={(value.completed / value.total) * 100}
            className="h-2"
          />
        </div>
      ),
    },
  ];

  const subjectColumns: TableColumn[] = [
    {
      header: "Subject",
      accessorKey: "name",
    },
    {
      header: "Teacher",
      accessorKey: "teacherName",
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
      header: "Average Grade",
      accessorKey: "averageGrade",
      cell: (value) => {
        const getGradeColor = (grade: number) => {
          if (grade >= 90) return "text-green-600 font-semibold";
          if (grade >= 80) return "text-blue-600 font-semibold";
          if (grade >= 70) return "text-yellow-600 font-semibold";
          return "text-red-600 font-semibold";
        };

        return <span className={getGradeColor(value)}>{value}%</span>;
      },
    },
    {
      header: "Highest Grade",
      accessorKey: "highestGrade",
      cell: (value) => (
        <span className="text-green-600 font-semibold">{value}%</span>
      ),
    },
    {
      header: "Lowest Grade",
      accessorKey: "lowestGrade",
      cell: (value) => (
        <span className="text-red-600 font-semibold">{value}%</span>
      ),
    },
    {
      header: "Pass Rate",
      accessorKey: "passRate",
      cell: (value) => (
        <div className="w-full">
          <Progress value={value} className="h-2" />
          <div className="text-xs text-right mt-1">{value}%</div>
        </div>
      ),
    },
  ];

  // Sort students by average grade (descending)
  const sortedStudents = [...students].sort(
    (a, b) => b.averageGrade - a.averageGrade,
  );

  // Get top 5 students
  const topStudents = sortedStudents.slice(0, 5);

  // Sort subjects by average grade (descending)
  const sortedSubjects = [...subjects].sort(
    (a, b) => b.averageGrade - a.averageGrade,
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Class Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">{classAverage}%</div>
              <BarChart2 className="h-5 w-5 ml-2 text-primary" />
            </div>
            <Progress value={classAverage} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">{attendanceRate}%</div>
              <Users className="h-5 w-5 ml-2 text-blue-500" />
            </div>
            <Progress value={attendanceRate} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">{passRate}%</div>
              <TrendingUp className="h-5 w-5 ml-2 text-green-500" />
            </div>
            <Progress value={passRate} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students">
        <TabsList className="w-full">
          <TabsTrigger value="students" className="flex-1">
            <Users className="h-4 w-4 mr-2" />
            Students Performance
          </TabsTrigger>
          <TabsTrigger value="subjects" className="flex-1">
            <BookOpen className="h-4 w-4 mr-2" />
            Subjects Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Student Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileTable
                columns={studentColumns}
                data={students}
                onRowClick={
                  onViewStudent ? (row) => onViewStudent(row.id) : undefined
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Subject Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileTable
                columns={subjectColumns}
                data={subjects}
                onRowClick={
                  onViewSubject ? (row) => onViewSubject(row.id) : undefined
                }
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topStudents.map((student, index) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex items-center space-x-2">
                      {student.avatar && (
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </div>
                  <div className="text-green-600 font-semibold">
                    {student.averageGrade}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Subject Performance Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedSubjects.map((subject) => (
                <div key={subject.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{subject.name}</span>
                    <span
                      className={
                        subject.averageGrade >= 90
                          ? "text-green-600 font-semibold"
                          : subject.averageGrade >= 80
                            ? "text-blue-600 font-semibold"
                            : subject.averageGrade >= 70
                              ? "text-yellow-600 font-semibold"
                              : "text-red-600 font-semibold"
                      }
                    >
                      {subject.averageGrade}%
                    </span>
                  </div>
                  <Progress value={subject.averageGrade} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
