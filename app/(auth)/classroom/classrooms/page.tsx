/**
 * Classrooms List Page
 * Main page for viewing and managing all classrooms
 */

"use client";

import { ClassroomCard, ClassroomCardSkeleton } from "@/components/classroom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDeleteClassroomMutation,
  useGetClassroomsQuery,
  useUpdateClassroomMutation,
} from "@/store/api/classroomApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/slices/authSlice";
import { addNotification } from "@/store/slices/uiSlice";
import {
  Archive,
  Grid3X3,
  List,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

interface ClassroomFilters {
  status?: "active" | "archived";
  field?: string;
  level?: string;
}

interface ClassroomsPageState {
  selectedClassrooms: Set<string>;
  view: "grid" | "list";
  filters: ClassroomFilters;
  searchQuery: string;
}

export default function ClassroomsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const [state, setState] = useState<ClassroomsPageState>({
    selectedClassrooms: new Set(),
    view: "grid",
    filters: {
      status: "active",
    },
    searchQuery: "",
  });

  // Prepare query parameters for RTK Query
  const queryParams = useMemo(
    () => ({
      status: state.filters.status,
      pagination: {
        numItems: 50, // Get more items at once
      },
      fetchBy: {
        userType: user?.role || "teacher",
        userId: user?.id || "current",
      },
    }),
    [state.filters.status, user],
  );

  // Use RTK Query to fetch classrooms
  const {
    data: classroomsResponse,
    isLoading,
    error,
    refetch,
  } = useGetClassroomsQuery(queryParams);

  // Mutations
  const [deleteClassroom] = useDeleteClassroomMutation();
  const [updateClassroom] = useUpdateClassroomMutation();

  // Initialize state from URL params
  useEffect(() => {
    const status =
      (searchParams.get("status") as "active" | "archived") || "active";
    const view = (searchParams.get("view") as "grid" | "list") || "grid";
    const search = searchParams.get("search") || "";

    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, status },
      view,
      searchQuery: search,
    }));
  }, [searchParams]);

  // Get classrooms from response
  const classrooms = classroomsResponse?.data || [];

  // Handle search input with debouncing
  const handleSearchChange = useCallback((value: string) => {
    setState((prev) => ({ ...prev, searchQuery: value }));
  }, []);

  // Handle filter changes
  const handleFilterChange = (key: keyof ClassroomFilters, value: any) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, [key]: value },
    }));

    // Update URL
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  // Handle view change
  const handleViewChange = (view: "grid" | "list") => {
    setState((prev) => ({ ...prev, view }));

    const params = new URLSearchParams(searchParams);
    params.set("view", view);
    router.push(`?${params.toString()}`);
  };

  // Handle classroom selection
  const handleClassroomSelect = (classroomId: string, selected: boolean) => {
    setState((prev) => {
      const newSelected = new Set(prev.selectedClassrooms);
      if (selected) {
        newSelected.add(classroomId);
      } else {
        newSelected.delete(classroomId);
      }
      return { ...prev, selectedClassrooms: newSelected };
    });
  };

  // Handle select all
  const handleSelectAll = (selected: boolean) => {
    setState((prev) => ({
      ...prev,
      selectedClassrooms: selected
        ? new Set(filteredClassrooms.map((c) => c.id))
        : new Set(),
    }));
  };

  // Handle bulk actions
  const handleBulkAction = async (action: "archive" | "delete") => {
    if (state.selectedClassrooms.size === 0) return;

    try {
      const promises = Array.from(state.selectedClassrooms).map((id) => {
        if (action === "archive") {
          return updateClassroom({
            classroomId: id,
            classroomData: { isArchived: true },
          });
        } else {
          return deleteClassroom(id);
        }
      });

      await Promise.all(promises);

      dispatch(
        addNotification({
          type: "success",
          title: "Success",
          message: `${action === "archive" ? "Archived" : "Deleted"} ${state.selectedClassrooms.size} classroom(s)`,
        }),
      );

      setState((prev) => ({ ...prev, selectedClassrooms: new Set() }));
    } catch (error) {
      dispatch(
        addNotification({
          type: "error",
          title: "Error",
          message: `Failed to ${action} classrooms`,
        }),
      );
    }
  };

  // Handle classroom actions
  const handleClassroomView = (id: string) => {
    router.push(`/classroom/classrooms/${id}`);
  };

  const handleClassroomEdit = (id: string) => {
    router.push(`/classroom/classrooms/${id}/edit`);
  };

  const handleClassroomDelete = async (id: string) => {
    try {
      await deleteClassroom(id).unwrap();
      dispatch(
        addNotification({
          type: "success",
          title: "Success",
          message: "Classroom deleted successfully",
        }),
      );
    } catch (error) {
      dispatch(
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to delete classroom",
        }),
      );
    }
  };

  const handleClassroomArchive = async (id: string) => {
    try {
      await updateClassroom({
        classroomId: id,
        classroomData: { isArchived: true },
      }).unwrap();
      dispatch(
        addNotification({
          type: "success",
          title: "Success",
          message: "Classroom archived successfully",
        }),
      );
    } catch (error) {
      dispatch(
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to archive classroom",
        }),
      );
    }
  };

  const handleClassroomUnarchive = async (id: string) => {
    try {
      await updateClassroom({
        classroomId: id,
        classroomData: { isArchived: false },
      }).unwrap();
      dispatch(
        addNotification({
          type: "success",
          title: "Success",
          message: "Classroom unarchived successfully",
        }),
      );
    } catch (error) {
      dispatch(
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to unarchive classroom",
        }),
      );
    }
  };

  // Filter classrooms based on search and filters
  const filteredClassrooms = useMemo(() => {
    return classrooms.filter((classroom) => {
      // Status filter
      if (state.filters.status === "active" && classroom.isArchived)
        return false;
      if (state.filters.status === "archived" && !classroom.isArchived)
        return false;

      // Field filter
      if (state.filters.field && classroom.field !== state.filters.field)
        return false;

      // Level filter
      if (state.filters.level && classroom.level !== state.filters.level)
        return false;

      // Search filter
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        return (
          classroom.title.toLowerCase().includes(query) ||
          classroom.field.toLowerCase().includes(query) ||
          classroom.level.toLowerCase().includes(query) ||
          classroom.teacherName?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [classrooms, state.filters, state.searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    const activeClassrooms = classrooms.filter((c) => !c.isArchived);
    const archivedClassrooms = classrooms.filter((c) => c.isArchived);
    const totalStudents = classrooms.reduce(
      (sum, c) => sum + (c.currentStudents || 0),
      0,
    );

    return {
      total: classrooms.length,
      active: activeClassrooms.length,
      archived: archivedClassrooms.length,
      totalStudents,
    };
  }, [classrooms]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Classrooms</h1>
          <p className="text-muted-foreground">
            Manage your classrooms and track student progress
          </p>
        </div>
        <Button onClick={() => router.push("/classroom/classrooms/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Classroom
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Classrooms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Archived</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {stats.archived}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalStudents}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search classrooms..."
              value={state.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>

          {/* Filters */}
          <Select
            value={state.filters.field || "all"}
            onValueChange={(value) =>
              handleFilterChange("field", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fields</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
              <SelectItem value="Biology">Biology</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Languages">Languages</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={state.filters.level || "all"}
            onValueChange={(value) =>
              handleFilterChange("level", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Elementary">Elementary</SelectItem>
              <SelectItem value="Middle School">Middle School</SelectItem>
              <SelectItem value="High School">High School</SelectItem>
              <SelectItem value="University">University</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {/* Bulk Actions */}
          {state.selectedClassrooms.size > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  Actions ({state.selectedClassrooms.size})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleBulkAction("archive")}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive Selected
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleBulkAction("delete")}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* View Toggle */}
          <div className="flex items-center border rounded-md">
            <Button
              variant={state.view === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleViewChange("grid")}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={state.view === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleViewChange("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Refresh */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Status Tabs */}
      <Tabs
        value={state.filters.status || "active"}
        onValueChange={(value) =>
          handleFilterChange("status", value as "active" | "archived")
        }
      >
        <TabsList>
          <TabsTrigger value="active">
            Active
            <Badge variant="secondary" className="ml-2">
              {stats.active}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="archived">
            Archived
            <Badge variant="secondary" className="ml-2">
              {stats.archived}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {/* Select All */}
          {filteredClassrooms.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <Checkbox
                checked={
                  state.selectedClassrooms.size === filteredClassrooms.length
                }
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                Select all ({filteredClassrooms.length})
              </span>
            </div>
          )}

          {/* Classrooms Grid/List */}
          {isLoading ? (
            <div
              className={`grid gap-4 ${
                state.view === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <ClassroomCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredClassrooms.length > 0 ? (
            <div
              className={`grid gap-4 ${
                state.view === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filteredClassrooms.map((classroom) => (
                <div key={classroom.id} className="relative">
                  <Checkbox
                    className="absolute top-2 left-2 z-10"
                    checked={state.selectedClassrooms.has(classroom.id)}
                    onCheckedChange={(checked) =>
                      handleClassroomSelect(classroom.id, checked as boolean)
                    }
                  />
                  <ClassroomCard
                    classroom={classroom}
                    onView={handleClassroomView}
                    onEdit={handleClassroomEdit}
                    onDelete={handleClassroomDelete}
                    onArchive={handleClassroomArchive}
                    onUnarchive={handleClassroomUnarchive}
                    className="ml-8"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                {state.searchQuery
                  ? "No classrooms found matching your search"
                  : "No active classrooms"}
              </div>
              <Button
                onClick={() => router.push("/classroom/classrooms/create")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Classroom
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived" className="mt-6">
          {/* Similar content for archived classrooms */}
          {filteredClassrooms.length > 0 ? (
            <div
              className={`grid gap-4 ${
                state.view === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filteredClassrooms.map((classroom) => (
                <ClassroomCard
                  key={classroom.id}
                  classroom={classroom}
                  onView={handleClassroomView}
                  onEdit={handleClassroomEdit}
                  onDelete={handleClassroomDelete}
                  onUnarchive={handleClassroomUnarchive}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No archived classrooms
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <div className="text-destructive mb-2">
            {error && "data" in error
              ? error.data?.message || "Failed to load classrooms"
              : "Network error"}
          </div>
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
