import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProfileTable, TableColumn } from "../ProfileTable";

interface AcademicRecordProps {
  grades: any[];
  overallGPA: number;
  totalCredits: number;
  completedCredits: number;
}

export function AcademicRecord({
  grades,
  overallGPA,
  totalCredits,
  completedCredits,
}: AcademicRecordProps) {
  const columns: TableColumn[] = [
    { header: "Subject", accessorKey: "subject" },
    {
      header: "Grade",
      accessorKey: "letterGrade",
      cell: (value) => {
        const getGradeColor = (grade: string) => {
          if (grade.startsWith("A")) return "text-green-600 font-semibold";
          if (grade.startsWith("B")) return "text-blue-600 font-semibold";
          if (grade.startsWith("C")) return "text-yellow-600 font-semibold";
          return "text-red-600 font-semibold";
        };

        return <span className={getGradeColor(value)}>{value}</span>;
      },
    },
    { header: "GPA", accessorKey: "gpa" },
    {
      header: "Total",
      accessorKey: "total",
      cell: (value) => {
        const getScoreColor = (score: number) => {
          if (score >= 90) return "text-green-600 font-semibold";
          if (score >= 80) return "text-blue-600 font-semibold";
          if (score >= 70) return "text-yellow-600 font-semibold";
          return "text-red-600 font-semibold";
        };

        return <span className={getScoreColor(value)}>{value}</span>;
      },
    },
    { header: "Semester", accessorKey: "semester" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overall GPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overallGPA.toFixed(1)}</div>
            <Progress value={(overallGPA / 4) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Credits Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {completedCredits}/{totalCredits}
            </div>
            <Progress
              value={(completedCredits / totalCredits) * 100}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round((completedCredits / totalCredits) * 100)}%
            </div>
            <Progress
              value={(completedCredits / totalCredits) * 100}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
      </div>

      <ProfileTable columns={columns} data={grades} />
    </div>
  );
}
