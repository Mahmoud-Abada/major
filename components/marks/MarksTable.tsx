/**
 * MarksTable Component
 * Advanced table for displaying and managing marks with sorting, filtering, and bulk operations
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mark } from "@/services/classroom-api";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Download,
  Edit,
  Filter,
  MoreHorizontal,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

interface MarksTableProps {
  marks: Mark[];
  loading?: boolean;
  onEdit?: (mark: Mark) => void;
  onDelete?: (markId: string) => void;
  onBulkDelete?: (markIds: string[]) => void;
  onExport?: () => void;
  showBulkActions?: boolean;
  showStudentColumn?: boolean;
  showClassroomColumn?: boolean;
}

type SortField = "date" | "subject" | "markType" | "value" | "studentName";
type SortDirection = "asc" | "desc";

const MARK_TYPES = [
  { value: "homework", label: "Homework", color: "bg-blue-100 text-blue-800" },
  { value: "quiz", label: "Quiz", color: "bg-green-100 text-green-800" },
  { value: "exam", label: "Exam", color: "bg-red-100 text-red-800" },
  {
    value: "participation",
    label: "Participation",
    color: "bg-purple-100 text-purple-800",
  },
];

export function MarksTable({
  marks,
  loading = false,
  onEdit,
  onDelete,
  onBulkDelete,
  onExport,
  showBulkActions = true,
  showStudentColumn = true,
  showClassroomColumn = false,
}: MarksTableProps) {
  const [selectedMarks, setSelectedMarks] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [filterText, setFilterText] = useState("");
  const [filterType, setFilterType] = useState<string>("");

  // Memoized filtered and sorted marks
  const processedMarks = useMemo(() => {
    let filtered = marks;

    // Apply text filter
    if (filterText) {
      filtered = filtered.filter(
        (mark) =>
          mark.subject.toLowerCase().includes(filterText.toLowerCase()) ||
          mark.studentName?.toLowerCase().includes(filterText.toLowerCase()) ||
          mark.description?.toLowerCase().includes(filterText.toLowerCase()),
      );
    }

    // Apply type filter
    if (filterType) {
      filtered = filtered.filter((mark) => mark.markType === filterType);
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "date":
          aValue = a.date || 0;
          bValue = b.date || 0;
          break;
        case "subject":
          aValue = a.subject;
          bValue = b.subject;
          break;
        case "markType":
          aValue = a.markType;
          bValue = b.markType;
          break;
        case "value":
          aValue = (a.value / a.maxValue) * 100;
          bValue = (b.value / b.maxValue) * 100;
          break;
        case "studentName":
          aValue = a.studentName || "";
          bValue = b.studentName || "";
          break;
        default:
          return 0;
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
  }, [marks, filterText, filterType, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMarks(processedMarks.map((mark) => mark.id));
    } else {
      setSelectedMarks([]);
    }
  };

  const handleSelectMark = (markId: string, checked: boolean) => {
    if (checked) {
      setSelectedMarks((prev) => [...prev, markId]);
    } else {
      setSelectedMarks((prev) => prev.filter((id) => id !== markId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedMarks.length > 0 && onBulkDelete) {
      onBulkDelete(selectedMarks);
      setSelectedMarks([]);
    }
  };

  const getMarkTypeInfo = (type: string) => {
    return MARK_TYPES.find((t) => t.value === type) || MARK_TYPES[0];
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    if (score >= 40) return "outline";
    return "destructive";
  };

  const calculatePercentage = (value: number, maxValue: number) => {
    return Math.round((value / maxValue) * 100);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const clearFilters = () => {
    setFilterText("");
    setFilterType("");
  };

  return (
    <Card>
      {/* Table Header with Filters and Actions */}
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Marks ({processedMarks.length})</CardTitle>

          <div className="flex items-center gap-2">
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}

            {showBulkActions && selectedMarks.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedMarks.length})
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search marks..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Type{" "}
                {filterType &&
                  `(${MARK_TYPES.find((t) => t.value === filterType)?.label})`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterType("")}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {MARK_TYPES.map((type) => (
                <DropdownMenuItem
                  key={type.value}
                  onClick={() => setFilterType(type.value)}
                >
                  {type.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {(filterText || filterType) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {showBulkActions && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      selectedMarks.length === processedMarks.length &&
                      processedMarks.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}

              {showStudentColumn && (
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("studentName")}
                >
                  <div className="flex items-center gap-2">
                    Student
                    {getSortIcon("studentName")}
                  </div>
                </TableHead>
              )}

              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("subject")}
              >
                <div className="flex items-center gap-2">
                  Subject
                  {getSortIcon("subject")}
                </div>
              </TableHead>

              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("markType")}
              >
                <div className="flex items-center gap-2">
                  Type
                  {getSortIcon("markType")}
                </div>
              </TableHead>

              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("value")}
              >
                <div className="flex items-center gap-2">
                  Score
                  {getSortIcon("value")}
                </div>
              </TableHead>

              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center gap-2">
                  Date
                  {getSortIcon("date")}
                </div>
              </TableHead>

              <TableHead>Description</TableHead>

              {showClassroomColumn && <TableHead>Classroom</TableHead>}

              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <AnimatePresence>
              {processedMarks.map((mark) => {
                const percentage = calculatePercentage(
                  mark.value,
                  mark.maxValue,
                );
                const typeInfo = getMarkTypeInfo(mark.markType);
                const isSelected = selectedMarks.includes(mark.id);

                return (
                  <motion.tr
                    key={mark.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`group ${isSelected ? "bg-muted/50" : ""}`}
                  >
                    {showBulkActions && (
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleSelectMark(mark.id, checked as boolean)
                          }
                        />
                      </TableCell>
                    )}

                    {showStudentColumn && (
                      <TableCell className="font-medium">
                        {mark.studentName || "Unknown Student"}
                      </TableCell>
                    )}

                    <TableCell>{mark.subject}</TableCell>

                    <TableCell>
                      <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                    </TableCell>

                    <TableCell>
                      {mark.isExempted ? (
                        <Badge variant="outline">Exempted</Badge>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Badge variant={getScoreBadgeVariant(percentage)}>
                            {mark.value}/{mark.maxValue}
                          </Badge>
                          <span
                            className={`text-sm font-medium ${getScoreColor(percentage)}`}
                          >
                            ({percentage}%)
                          </span>
                        </div>
                      )}
                    </TableCell>

                    <TableCell>{formatDate(mark.date)}</TableCell>

                    <TableCell className="max-w-xs truncate">
                      {mark.description || "-"}
                    </TableCell>

                    {showClassroomColumn && (
                      <TableCell>
                        {mark.classroom || mark.group || "-"}
                      </TableCell>
                    )}

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(mark)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => onDelete(mark.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </TableBody>
        </Table>

        {loading && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading marks...</p>
          </div>
        )}

        {!loading && processedMarks.length === 0 && (
          <div className="p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Filter className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No marks found</h3>
            <p className="text-muted-foreground">
              {filterText || filterType
                ? "Try adjusting your search criteria"
                : "No marks available"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Skeleton loader for MarksTable
export function MarksTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-muted rounded w-32 animate-pulse" />
          <div className="h-8 bg-muted rounded w-24 animate-pulse" />
        </div>
        <div className="flex gap-4">
          <div className="h-10 bg-muted rounded flex-1 animate-pulse" />
          <div className="h-10 bg-muted rounded w-32 animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="h-4 bg-muted rounded animate-pulse" />
              </TableHead>
              <TableHead>
                <div className="h-4 bg-muted rounded animate-pulse" />
              </TableHead>
              <TableHead>
                <div className="h-4 bg-muted rounded animate-pulse" />
              </TableHead>
              <TableHead>
                <div className="h-4 bg-muted rounded animate-pulse" />
              </TableHead>
              <TableHead>
                <div className="h-4 bg-muted rounded animate-pulse" />
              </TableHead>
              <TableHead>
                <div className="h-4 bg-muted rounded animate-pulse" />
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-4 bg-muted rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-muted rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-6 bg-muted rounded w-16 animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-6 bg-muted rounded w-20 animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-muted rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-muted rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-8 bg-muted rounded w-8 animate-pulse" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
