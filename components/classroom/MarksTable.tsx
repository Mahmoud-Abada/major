/**
 * MarksTable Component
 * Specialized table for displaying student marks with sorting and filtering
 */
"use client";
import { ProfileTable, TableColumn } from "@/components/profile/ProfileTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Mark } from "@/store/types/api";
import {
  Download,
  Edit,
  Filter,
  Search,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

interface MarksTableProps {
  marks: Mark[];
  onEdit?: (markId: string) => void;
  onDelete?: (markId: string) => void;
  onExport?: () => void;
  showActions?: boolean;
  showStudentColumn?: boolean;
  showSubjectColumn?: boolean;
  className?: string;
}

export function MarksTable({
  marks,
  onEdit,
  onDelete,
  onExport,
  showActions = true,
  showStudentColumn = true,
  showSubjectColumn = true,
  className,
}: MarksTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Filter marks based on search and filter criteria
  const filteredMarks = marks.filter((mark) => {
    const matchesSearch =
      !searchQuery ||
      mark.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mark.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterType === "all" || mark.markType === filterType;

    return matchesSearch && matchesFilter;
  });

  // Sort marks
  const sortedMarks = [...filteredMarks].sort((a, b) => {
    let aValue: any = a[sortField as keyof Mark];
    let bValue: any = b[sortField as keyof Mark];

    // Handle special sorting cases
    if (sortField === "percentage") {
      aValue = (a.value / a.maxValue) * 100;
      bValue = (b.value / b.maxValue) * 100;
    }

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getScoreColor = (value: number, maxValue: number): string => {
    const percentage = (value / maxValue) * 100;
    if (percentage >= 90) return "text-green-600 font-semibold";
    if (percentage >= 80) return "text-blue-600 font-semibold";
    if (percentage >= 70) return "text-yellow-600 font-semibold";
    if (percentage >= 60) return "text-orange-600 font-semibold";
    return "text-red-600 font-semibold";
  };

  const getMarkTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "exam":
        return "destructive";
      case "quiz":
        return "default";
      case "homework":
        return "secondary";
      case "participation":
        return "outline";
      default:
        return "secondary";
    }
  };

  const columns: TableColumn[] = [
    ...(showStudentColumn
      ? [
          {
            header: "Student",
            accessorKey: "studentName" as keyof Mark,
            cell: (value: string) => (
              <div className="font-medium">{value || "Unknown Student"}</div>
            ),
          },
        ]
      : []),
    ...(showSubjectColumn
      ? [
          {
            header: "Subject",
            accessorKey: "subject" as keyof Mark,
            cell: (value: string) => <div className="font-medium">{value}</div>,
          },
        ]
      : []),
    {
      header: (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSort("markType")}
          className="h-auto p-0 font-semibold"
        >
          Type
          {sortField === "markType" &&
            (sortDirection === "asc" ? (
              <TrendingUp className="ml-1 h-3 w-3" />
            ) : (
              <TrendingDown className="ml-1 h-3 w-3" />
            ))}
        </Button>
      ),
      accessorKey: "markType" as keyof Mark,
      cell: (value: string) => (
        <Badge variant={getMarkTypeBadgeVariant(value)}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      header: (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSort("percentage")}
          className="h-auto p-0 font-semibold"
        >
          Score
          {sortField === "percentage" &&
            (sortDirection === "asc" ? (
              <TrendingUp className="ml-1 h-3 w-3" />
            ) : (
              <TrendingDown className="ml-1 h-3 w-3" />
            ))}
        </Button>
      ),
      accessorKey: "value" as keyof Mark,
      cell: (value: number, row: Mark) => {
        if (row.isExempted) {
          return <Badge variant="outline">Exempted</Badge>;
        }

        const percentage = (value / row.maxValue) * 100;
        return (
          <div className="space-y-1">
            <span className={getScoreColor(value, row.maxValue)}>
              {value}/{row.maxValue}
            </span>
            <div className="text-xs text-muted-foreground">
              {percentage.toFixed(1)}%
            </div>
          </div>
        );
      },
    },
    {
      header: (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSort("date")}
          className="h-auto p-0 font-semibold"
        >
          Date
          {sortField === "date" &&
            (sortDirection === "asc" ? (
              <TrendingUp className="ml-1 h-3 w-3" />
            ) : (
              <TrendingDown className="ml-1 h-3 w-3" />
            ))}
        </Button>
      ),
      accessorKey: "date" as keyof Mark,
      cell: (value: number) => (
        <div className="text-sm">{new Date(value).toLocaleDateString()}</div>
      ),
    },
    {
      header: "Description",
      accessorKey: "description" as keyof Mark,
      cell: (value?: string) => (
        <div className="text-sm text-muted-foreground max-w-xs truncate">
          {value || "-"}
        </div>
      ),
    },
  ];

  const calculateStats = () => {
    if (filteredMarks.length === 0) return null;

    const validMarks = filteredMarks.filter((mark) => !mark.isExempted);
    if (validMarks.length === 0) return null;

    const percentages = validMarks.map(
      (mark) => (mark.value / mark.maxValue) * 100,
    );
    const average =
      percentages.reduce((sum, p) => sum + p, 0) / percentages.length;
    const highest = Math.max(...percentages);
    const lowest = Math.min(...percentages);

    return { average, highest, lowest, total: validMarks.length };
  };

  const stats = calculateStats();

  return (
    <div className={cn("space-y-4", className)}>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students or subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="exam">Exams</SelectItem>
              <SelectItem value="quiz">Quizzes</SelectItem>
              <SelectItem value="homework">Homework</SelectItem>
              <SelectItem value="participation">Participation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {onExport && (
          <Button variant="outline" onClick={onExport} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        )}
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total Marks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.average.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Average</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.highest.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Highest</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {stats.lowest.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Lowest</div>
          </div>
        </div>
      )}

      {/* Table */}
      <ProfileTable
        columns={columns}
        data={sortedMarks}
        actions={
          showActions
            ? (row: Mark) => (
                <div className="flex gap-1">
                  {onEdit && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(row.id)}
                      title="Edit mark"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDelete(row.id)}
                      title="Delete mark"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )
            : undefined
        }
        emptyState={
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-2">No marks found</div>
            {searchQuery || filterType !== "all" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setFilterType("all");
                }}
              >
                Clear filters
              </Button>
            ) : (
              <div className="text-sm text-muted-foreground">
                Marks will appear here once they are added
              </div>
            )}
          </div>
        }
      />
    </div>
  );
}

// Marks summary component
interface MarksSummaryProps {
  marks: Mark[];
  className?: string;
}

export function MarksSummary({ marks, className }: MarksSummaryProps) {
  const validMarks = marks.filter((mark) => !mark.isExempted);

  if (validMarks.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        No marks available for summary
      </div>
    );
  }

  const percentages = validMarks.map(
    (mark) => (mark.value / mark.maxValue) * 100,
  );
  const average =
    percentages.reduce((sum, p) => sum + p, 0) / percentages.length;

  const gradeDistribution = {
    "A (90-100%)": percentages.filter((p) => p >= 90).length,
    "B (80-89%)": percentages.filter((p) => p >= 80 && p < 90).length,
    "C (70-79%)": percentages.filter((p) => p >= 70 && p < 80).length,
    "D (60-69%)": percentages.filter((p) => p >= 60 && p < 70).length,
    "F (0-59%)": percentages.filter((p) => p < 60).length,
  };

  const typeDistribution = marks.reduce(
    (acc, mark) => {
      acc[mark.markType] = (acc[mark.markType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-primary/10 rounded-lg">
          <div className="text-2xl font-bold text-primary">
            {validMarks.length}
          </div>
          <div className="text-sm text-muted-foreground">Total Marks</div>
        </div>
        <div className="text-center p-4 bg-green-100 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {average.toFixed(1)}%
          </div>
          <div className="text-sm text-muted-foreground">Average</div>
        </div>
        <div className="text-center p-4 bg-blue-100 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {Math.max(...percentages).toFixed(1)}%
          </div>
          <div className="text-sm text-muted-foreground">Highest</div>
        </div>
        <div className="text-center p-4 bg-red-100 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {Math.min(...percentages).toFixed(1)}%
          </div>
          <div className="text-sm text-muted-foreground">Lowest</div>
        </div>
      </div>

      {/* Grade Distribution */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Grade Distribution</h3>
        <div className="space-y-2">
          {Object.entries(gradeDistribution).map(([grade, count]) => (
            <div
              key={grade}
              className="flex items-center justify-between p-2 bg-muted/50 rounded"
            >
              <span className="text-sm font-medium">{grade}</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(count / validMarks.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8 text-right">
                  {count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Type Distribution */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Mark Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(typeDistribution).map(([type, count]) => (
            <div key={type} className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-xl font-bold">{count}</div>
              <div className="text-xs text-muted-foreground capitalize">
                {type}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
