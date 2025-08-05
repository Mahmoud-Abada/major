"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingDown,
  TrendingUp
} from "lucide-react";
// User type - will be replaced with actual API types
interface User {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

interface ChartData {
  id: string;
  title: string;
  type: "bar" | "line" | "pie" | "progress";
  data: any[];
  color: string;
  trend?: {
    value: number;
    direction: "up" | "down";
    period: string;
  };
  description?: string;
}

interface ChartsProps {
  user: User;
  className?: string;
}

const getChartsForRole = (user: User): ChartData[] => {
  switch (user.role) {
    case "admin":
      return [
        {
          id: "user-growth",
          title: "User Growth",
          type: "line",
          data: [
            { month: "Jan", users: 850 },
            { month: "Feb", users: 920 },
            { month: "Mar", users: 1050 },
            { month: "Apr", users: 1180 },
            { month: "May", users: 1247 }
          ],
          color: "text-blue-600",
          trend: { value: 12.5, direction: "up", period: "this month" },
          description: "Total platform users over time"
        },
        {
          id: "revenue-breakdown",
          title: "Revenue by Category",
          type: "pie",
          data: [
            { category: "Mathematics", value: 35, amount: "85,750 DA" },
            { category: "Sciences", value: 28, amount: "68,600 DA" },
            { category: "Languages", value: 22, amount: "53,900 DA" },
            { category: "Computer Science", value: 15, amount: "36,750 DA" }
          ],
          color: "text-green-600",
          description: "Monthly revenue distribution"
        }
      ];

    case "teacher":
      return [
        {
          id: "class-performance",
          title: "Class Performance",
          type: "bar",
          data: [
            { class: "Math A", average: 85 },
            { class: "Math B", average: 78 },
            { class: "Physics", average: 82 },
            { class: "Algebra", average: 88 }
          ],
          color: "text-green-600",
          trend: { value: 3.2, direction: "up", period: "this semester" },
          description: "Average grades by class"
        },
        {
          id: "attendance-trends",
          title: "Attendance Trends",
          type: "line",
          data: [
            { week: "Week 1", rate: 92 },
            { week: "Week 2", rate: 88 },
            { week: "Week 3", rate: 90 },
            { week: "Week 4", rate: 87 }
          ],
          color: "text-purple-600",
          description: "Weekly attendance rates"
        }
      ];

    case "student":
      return [
        {
          id: "grade-progress",
          title: "Grade Progress",
          type: "line",
          data: [
            { subject: "Math", current: 85, target: 90 },
            { subject: "Physics", current: 78, target: 85 },
            { subject: "Chemistry", current: 82, target: 88 },
            { subject: "Literature", current: 88, target: 90 }
          ],
          color: "text-green-600",
          trend: { value: 2.3, direction: "up", period: "this semester" },
          description: "Current vs target grades"
        },
        {
          id: "study-time",
          title: "Study Time Distribution",
          type: "pie",
          data: [
            { subject: "Mathematics", hours: 12, percentage: 35 },
            { subject: "Physics", hours: 8, percentage: 24 },
            { subject: "Chemistry", hours: 7, percentage: 21 },
            { subject: "Literature", hours: 7, percentage: 20 }
          ],
          color: "text-blue-600",
          description: "Weekly study hours by subject"
        }
      ];

    case "parent":
      return [
        {
          id: "children-performance",
          title: "Children's Performance",
          type: "progress",
          data: [
            { name: "Rania", subject: "Overall", score: 88, trend: "up" },
            { name: "Rania", subject: "Mathematics", score: 85, trend: "up" },
            { name: "Rania", subject: "Physics", score: 82, trend: "stable" },
            { name: "Rania", subject: "Literature", score: 90, trend: "up" }
          ],
          color: "text-green-600",
          trend: { value: 3.2, direction: "up", period: "this month" },
          description: "Academic performance overview"
        }
      ];

    default:
      return [];
  }
};

// Simple Bar Chart Component
const BarChart = ({ data, color }: { data: any[], color: string }) => {
  const maxValue = Math.max(...data.map(item => item.average || item.score || 0));

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="flex items-center space-x-3"
        >
          <div className="w-20 text-xs text-muted-foreground truncate">
            {item.class || item.subject || item.name}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <div className="h-2 bg-muted rounded-full flex-1 mr-2 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${color.includes('green') ? 'bg-green-500' : color.includes('blue') ? 'bg-blue-500' : color.includes('purple') ? 'bg-purple-500' : 'bg-gray-500'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${((item.average || item.score || 0) / maxValue) * 100}%` }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs font-medium w-8 text-right">
                {item.average || item.score || 0}%
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Simple Line Chart Component (using progress bars as approximation)
const LineChart = ({ data, color }: { data: any[], color: string }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end h-32 px-2">
        {data.map((item, index) => {
          const value = item.users || item.rate || item.current || 0;
          const maxValue = Math.max(...data.map(d => d.users || d.rate || d.current || 0));
          const height = (value / maxValue) * 100;

          return (
            <motion.div
              key={index}
              className="flex flex-col items-center space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="flex flex-col items-center">
                <span className="text-xs font-medium mb-1">{value}</span>
                <motion.div
                  className={`w-8 rounded-t ${color.includes('green') ? 'bg-green-500' : color.includes('blue') ? 'bg-blue-500' : color.includes('purple') ? 'bg-purple-500' : 'bg-gray-500'}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {item.month || item.week || item.subject}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Simple Pie Chart Component (using progress rings)
const PieChart = ({ data, color }: { data: any[], color: string }) => {
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
            <span className="text-sm text-muted-foreground">
              {item.category || item.subject}
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">
              {item.value || item.percentage}%
            </div>
            {item.amount && (
              <div className="text-xs text-muted-foreground">
                {item.amount}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Progress Chart Component
const ProgressChart = ({ data, color }: { data: any[], color: string }) => {
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                {item.subject}
              </span>
              {item.trend && (
                <div className="flex items-center">
                  {item.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : item.trend === "down" ? (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  ) : (
                    <Activity className="h-3 w-3 text-gray-600" />
                  )}
                </div>
              )}
            </div>
            <span className="text-sm font-medium">{item.score}%</span>
          </div>
          <Progress
            value={item.score}
            className="h-2"
          />
        </motion.div>
      ))}
    </div>
  );
};

const chartVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.2,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

export function Charts({ user, className = "" }: ChartsProps) {
  const charts = getChartsForRole(user);

  if (charts.length === 0) {
    return null;
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {charts.map((chart, index) => (
        <motion.div
          key={chart.id}
          custom={index}
          variants={chartVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center">
                  {chart.type === "bar" && <BarChart3 className="h-5 w-5 mr-2" />}
                  {chart.type === "line" && <Activity className="h-5 w-5 mr-2" />}
                  {chart.type === "pie" && <PieChartIcon className="h-5 w-5 mr-2" />}
                  {chart.type === "progress" && <TrendingUp className="h-5 w-5 mr-2" />}
                  {chart.title}
                </CardTitle>
                {chart.trend && (
                  <div className="flex items-center space-x-1 text-sm">
                    {chart.trend.direction === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={chart.trend.direction === "up" ? "text-green-600" : "text-red-600"}>
                      {chart.trend.value}%
                    </span>
                  </div>
                )}
              </div>
              {chart.description && (
                <p className="text-sm text-muted-foreground">
                  {chart.description}
                </p>
              )}
            </CardHeader>
            <CardContent>
              {chart.type === "bar" && <BarChart data={chart.data} color={chart.color} />}
              {chart.type === "line" && <LineChart data={chart.data} color={chart.color} />}
              {chart.type === "pie" && <PieChart data={chart.data} color={chart.color} />}
              {chart.type === "progress" && <ProgressChart data={chart.data} color={chart.color} />}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}