/**
 * Groups List Page
 * Main page for viewing and managing all groups with proper API integration
 */

"use client";

import { GroupCard } from "@/components/classroom/GroupCard";
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
import { useDeleteGroupMutation, useGetGroupsQuery, useUpdateGroupMutation } from "@/store/api/groupApi";
import { Group } from "@/store/types/api";
import {
  Archive,
  Grid3X3,
  List,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

interface GroupFilters {
  status?: "active" | "archived";
  field?: string;
  level?: string;
  isSemestral?: boolean;
}

interface GroupsPageState {
  selectedGroups: Set<string>;
  view: "grid" | "list";
  filters: GroupFilters;
  searchQuery: string;
  groups: Group[];
  loading: boolean;
  error: string | null;
}

export default function GroupsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [updateGroupMutation] = useUpdateGroupMutation();
  const [deleteGroupMutation] = useDeleteGroupMutation();

  const [state, setState] = useState<GroupsPageState>({
    selectedGroups: new Set(),
    view: "grid",
    filters: {
      status: "active",
    },
    searchQuery: "",
    groups: [],
    loading: false,
    error: null,
  });

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

  // Fetch groups using RTK Query
  const {
    data: groupsResponse,
    isLoading,
    error: apiError,
    refetch
  } = useGetGroupsQuery({
    status: state.filters.status
  });

  // Update local state when API data changes
  useEffect(() => {
    if (groupsResponse?.data) {
      setState((prev) => ({
        ...prev,
        groups: groupsResponse.data,
        loading: false,
        error: null
      }));
    }
  }, [groupsResponse]);

  // Update loading and error states
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      loading: isLoading,
      error: apiError ? 'Failed to load groups' : null
    }));
  }, [isLoading, apiError]);

  // Handle search input with debouncing
  const handleSearchChange = useCallback((value: string) => {
    setState((prev) => ({ ...prev, searchQuery: value }));
  }, []);

  // Handle filter changes
  const handleFilterChange = (key: keyof GroupFilters, value: any) => {
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

  // Handle group selection
  const handleGroupSelect = (groupId: string, selected: boolean) => {
    setState((prev) => {
      const newSelected = new Set(prev.selectedGroups);
      if (selected) {
        newSelected.add(groupId);
      } else {
        newSelected.delete(groupId);
      }
      return { ...prev, selectedGroups: newSelected };
    });
  };

  // Handle select all
  const handleSelectAll = (selected: boolean) => {
    setState((prev) => ({
      ...prev,
      selectedGroups: selected
        ? new Set(filteredGroups.map((g) => g.id))
        : new Set(),
    }));
  };

  // Handle bulk actions
  const handleBulkAction = async (action: "archive" | "delete") => {
    if (state.selectedGroups.size === 0) return;

    const actionText = action === "archive" ? "archive" : "delete";
    const confirmMessage = `Are you sure you want to ${actionText} ${state.selectedGroups.size} group${state.selectedGroups.size > 1 ? 's' : ''}? ${action === "delete" ? "This action cannot be undone." : ""}`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const promises = Array.from(state.selectedGroups).map((id) => {
        if (action === "archive") {
          return updateGroupMutation({ groupId: id, groupData: { isArchived: true } });
        } else {
          return deleteGroupMutation(id);
        }
      });

      await Promise.all(promises);

      // Success notifications will be handled by the service
      setState((prev) => ({ ...prev, selectedGroups: new Set() }));
    } catch (error: any) {
      // Error notifications will be handled by the error handling utility
      console.error(`Failed to ${action} groups:`, error);
    }
  };

  // Handle group actions
  const handleGroupView = (id: string) => {
    router.push(`/classroom/groups/${id}`);
  };

  const handleGroupEdit = (id: string) => {
    router.push(`/classroom/groups/${id}/edit`);
  };

  const handleGroupDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteGroupMutation(id).unwrap();

      // Remove from local state
      setState((prev) => ({
        ...prev,
        groups: prev.groups.filter((g) => g.id !== id),
      }));

      // Refetch to ensure consistency
      refetch();
    } catch (error: any) {
      console.error("Failed to delete group:", error);
    }
  };

  const handleGroupArchive = async (id: string) => {
    if (!confirm("Are you sure you want to archive this group?")) {
      return;
    }

    try {
      await updateGroupMutation({ groupId: id, groupData: { isArchived: true } }).unwrap();

      // Update local state
      setState((prev) => ({
        ...prev,
        groups: prev.groups.map((g) =>
          g.id === id ? { ...g, isArchived: true } : g
        ),
      }));

      // Refetch to ensure consistency
      refetch();
    } catch (error: any) {
      console.error("Failed to archive group:", error);
    }
  };

  const handleGroupUnarchive = async (id: string) => {
    try {
      await updateGroupMutation({ groupId: id, groupData: { isArchived: false } }).unwrap();

      // Update local state
      setState((prev) => ({
        ...prev,
        groups: prev.groups.map((g) =>
          g.id === id ? { ...g, isArchived: false } : g
        ),
      }));

      // Refetch to ensure consistency
      refetch();
    } catch (error: any) {
      console.error("Failed to unarchive group:", error);
    }
  };

  // Filter groups based on search and filters
  const filteredGroups = useMemo(() => {
    return state.groups.filter((group) => {
      // Status filter
      if (state.filters.status === "active" && group.isArchived)
        return false;
      if (state.filters.status === "archived" && !group.isArchived)
        return false;

      // Field filter
      if (state.filters.field && group.field !== state.filters.field)
        return false;

      // Level filter
      if (state.filters.level && group.level !== state.filters.level)
        return false;

      // Semestral filter
      if (state.filters.isSemestral !== undefined && group.isSemestral !== state.filters.isSemestral)
        return false;

      // Search filter
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        return (
          group.title.toLowerCase().includes(query) ||
          group.field.toLowerCase().includes(query) ||
          group.level.toLowerCase().includes(query) ||
          group.schoolName?.toLowerCase().includes(query) ||
          group.description?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [state.groups, state.filters, state.searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    const activeGroups = state.groups.filter((g) => !g.isArchived);
    const archivedGroups = state.groups.filter((g) => g.isArchived);
    const totalMembers = state.groups.reduce(
      (sum, g) => sum + (g.memberCount || 0),
      0,
    );
    const semestralGroups = state.groups.filter((g) => g.isSemestral);

    return {
      total: state.groups.length,
      active: activeGroups.length,
      archived: archivedGroups.length,
      totalMembers,
      semestral: semestralGroups.length,
    };
  }, [state.groups]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Groups</h1>
          <p className="text-muted-foreground">
            Manage your study groups and collaborate with students
          </p>
        </div>
        <Button onClick={() => router.push("/classroom/groups/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
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
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalMembers}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Semestral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.semestral}
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
              placeholder="Search groups..."
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

          <Select
            value={
              state.filters.isSemestral === undefined
                ? "all"
                : state.filters.isSemestral
                  ? "semestral"
                  : "regular"
            }
            onValueChange={(value) =>
              handleFilterChange(
                "isSemestral",
                value === "all" ? undefined : value === "semestral"
              )
            }
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="semestral">Semestral</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {/* Bulk Actions */}
          {state.selectedGroups.size > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  Actions ({state.selectedGroups.size})
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
            disabled={state.loading}
          >
            <RefreshCw
              className={`h-4 w-4 ${state.loading ? "animate-spin" : ""}`}
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
          {filteredGroups.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <Checkbox
                checked={
                  state.selectedGroups.size === filteredGroups.length
                }
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                Select all ({filteredGroups.length})
              </span>
            </div>
          )}

          {/* Groups Grid/List */}
          {state.loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading groups...</p>
            </div>
          ) : filteredGroups.length > 0 ? (
            <div
              className={`grid gap-4 ${state.view === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
                }`}
            >
              {filteredGroups.map((group) => (
                <div key={group.id} className="relative">
                  <Checkbox
                    className="absolute top-2 left-2 z-10"
                    checked={state.selectedGroups.has(group.id)}
                    onCheckedChange={(checked) =>
                      handleGroupSelect(group.id, checked as boolean)
                    }
                  />
                  <GroupCard
                    group={group}
                    onView={handleGroupView}
                    onEdit={handleGroupEdit}
                    onDelete={handleGroupDelete}
                    onArchive={handleGroupArchive}
                    onUnarchive={handleGroupUnarchive}
                    viewMode={state.view}
                    className="ml-8"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <div className="text-muted-foreground mb-4">
                {state.searchQuery
                  ? "No groups found matching your search"
                  : "No active groups"}
              </div>
              <Button
                onClick={() => router.push("/classroom/groups/create")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Group
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived" className="mt-6">
          {/* Similar content for archived groups */}
          {filteredGroups.length > 0 ? (
            <div
              className={`grid gap-4 ${state.view === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
                }`}
            >
              {filteredGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onView={handleGroupView}
                  onEdit={handleGroupEdit}
                  onDelete={handleGroupDelete}
                  onUnarchive={handleGroupUnarchive}
                  viewMode={state.view}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Archive className="h-12 w-12 mx-auto mb-4" />
              No archived groups
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Error State */}
      {state.error && (
        <div className="text-center py-8">
          <div className="text-destructive mb-2">{state.error}</div>
          <Button
            variant="outline"
            onClick={() => {
              // Retry loading groups
              setState((prev) => ({ ...prev, error: null }));
            }}
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}