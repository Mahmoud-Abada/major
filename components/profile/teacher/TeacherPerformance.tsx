import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, BarChart2, TrendingUp, Users } from "lucide-react";
import { ProfileTable, TableColumn } from "../ProfileTable";

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  period: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface StudentPerformance {
  id: string;
  className: string;
  classId?: string;
  averageGrade: number;
  passRate: number;
  studentCount: number;
  period: string;
}

interface TeacherPerformanceProps {
  metrics: PerformanceMetric[];
  classPerformance: StudentPerformance[];
  evaluations?: {
    period: string;
    score: number;
    feedback: string;
    evaluator: string;
  }[];
}

export function TeacherPerformance({
  metrics,
  classPerformance,
  evaluations = [],
}: TeacherPerformanceProps) {
  const periods = [...new Set(metrics.map((metric) => metric.period))];

  const metricColumns: TableColumn[] = [
    { header: "Metric", accessorKey: "name" },
    {
      header: "Value",
      accessorKey: "value",
      cell: (value, row) => (
        <div className="flex items-center space-x-2">
          <span className="font-medium">{value}</span>
          {row.trend && (
            <span
              className={
                row.trend.isPositive ? "text-green-600" : "text-red-600"
              }
            >
              {row.trend.isPositive ? "↑" : "↓"} {row.trend.value}%
            </span>
          )}
        </div>
      ),
    },
    { header: "Target", accessorKey: "target" },
    {
      header: "Progress",
      accessorKey: "value",
      cell: (value, row) => (
        <div className="w-full">
          <Progress value={(value / row.target) * 100} className="h-2" />
          <div className="text-xs text-muted-foreground mt-1">
            {Math.round((value / row.target) * 100)}%
          </div>
        </div>
      ),
    },
  ];

  const classColumns: TableColumn[] = [
    {
      header: "Class",
      accessorKey: "className",
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
      header: "Pass Rate",
      accessorKey: "passRate",
      cell: (value) => `${value}%`,
    },
    { header: "Students", accessorKey: "studentCount" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">
                {evaluations.length > 0
                  ? (
                      evaluations.reduce(
                        (sum, evaluation) => sum + evaluation.score,
                        0,
                      ) / evaluations.length
                    ).toFixed(1)
                  : "N/A"}
              </div>
              <Award className="h-5 w-5 ml-2 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Class Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {classPerformance.length > 0
                ? `${Math.round(classPerformance.reduce((sum, cls) => sum + cls.passRate, 0) / classPerformance.length)}%`
                : "N/A"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Students Taught</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">
                {classPerformance.reduce(
                  (sum, cls) => sum + cls.studentCount,
                  0,
                )}
              </div>
              <Users className="h-5 w-5 ml-2 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">
                {metrics.filter((m) => m.trend && m.trend.isPositive).length >
                metrics.filter((m) => m.trend && !m.trend.isPositive).length
                  ? "Positive"
                  : "Neutral"}
              </div>
              <TrendingUp className="h-5 w-5 ml-2 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={periods[0] || "current"}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Performance Metrics</h3>
          <TabsList>
            {periods.map((period) => (
              <TabsTrigger key={period} value={period}>
                {period}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {periods.map((period) => (
          <TabsContent key={period} value={period}>
            <Card>
              <CardContent className="pt-6">
                <ProfileTable
                  columns={metricColumns}
                  data={metrics.filter((metric) => metric.period === period)}
                  emptyState={
                    <div className="text-center py-8">
                      <BarChart2 className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">
                        No performance metrics available for this period
                      </p>
                    </div>
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div>
        <h3 className="text-lg font-semibold mb-4">Class Performance</h3>
        <Card>
          <CardContent className="pt-6">
            <ProfileTable
              columns={classColumns}
              data={classPerformance}
              emptyState={
                <div className="text-center py-8">
                  <Users className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">
                    No class performance data available
                  </p>
                </div>
              }
            />
          </CardContent>
        </Card>
      </div>

      {evaluations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Evaluations</h3>
          <div className="space-y-4">
            {evaluations.map((evaluation, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {evaluation.period}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Evaluated by: {evaluation.evaluator}
                      </p>
                    </div>
                    <div className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded-md">
                      <Award className="h-4 w-4 mr-1" />
                      <span className="font-medium">
                        {evaluation.score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-4">{evaluation.feedback}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
