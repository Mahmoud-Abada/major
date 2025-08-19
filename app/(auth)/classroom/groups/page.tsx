"use client";

import { GroupCard } from "@/components/classroom/GroupCard";
import DragDropAddStudentsToGroupDialog from "@/components/dialogs/DragDropAddStudentsToGroupDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import { Grid3X3, List, Plus, RefreshCw, Search, UserPlus, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [showAddStudentsDialog, setShowAddStudentsDialog] = useState(false);
  const [selectedGroupForStudents, setSelectedGroupForStudents] = useState<{ id: string, title: string } | null>(null);

  // API state
  const [allGroups, setAllGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prevent duplicate API calls
  const hasFetched = useRef(false);
  const isCurrentlyFetching = useRef(false);

  // Fetch groups once on mount
  const fetchGroups = async (force: boolean = false) => {
    // Prevent duplicate calls
    if (!force && (hasFetched.current || isCurrentlyFetching.current)) {
      return;
    }

    isCurrentlyFetching.current = true;
    setLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem("access_token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const requestBody = {
        status: "all",
        pagination: { numItems: 1, cursor: null },
        groupPagination: { numItems: 100, cursor: null },
      };

      const response = await fetch("http://127.0.0.1:3001/classroom/get-classrooms", {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const groupsData = data.payload?.groups || [];

      setAllGroups(groupsData);
      setError(null);
      hasFetched.current = true;

      // Only show toast on manual refresh
      if (force) {
        toast.success(`Refreshed ${groupsData.length} groups`);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(errorMessage);
      setAllGroups([]);
      toast.error("Failed to load groups");
    } finally {
      setLoading(false);
      isCurrentlyFetching.current = false;
    }
  };

  // Load groups once on mount
  useEffect(() => {
    fetchGroups();
  }, []); // Empty dependency array to prevent re-runs

  const refetch = () => {
    hasFetched.current = false; // Reset the flag
    fetchGroups(true);
  };

  // Group actions
  const handleViewGroup = (id: string) => {
    window.location.href = `/classroom/groups/${id}`;
  };

  const handleEditGroup = (id: string) => {
    window.location.href = `/classroom/groups/${id}/edit`;
  };

  const handleDeleteGroup = async (id: string) => {
    if (!confirm("Are you sure you want to delete this group?")) return;

    console.log("Delete group:", id);
    toast.info("Delete functionality will be implemented later");
  };

  const handleArchiveGroup = async (id: string) => {
    console.log("Archive group:", id);
    toast.info("Archive functionality will be implemented later");
  };

  // Filter groups based on active tab and search
  const filteredGroups = allGroups.filter((group) => {
    // Tab filtering
    let matchesTab = true;
    switch (activeTab) {
      case "all":
        matchesTab = true;
        break;
      case "active":
        matchesTab = !group.isArchived;
        break;
      case "archived":
        matchesTab = group.isArchived;
        break;
      case "sciences":
        matchesTab = [
          "Mathematics",
          "Physics",
          "Chemistry",
          "Biology",
          "Computer Science",
        ].includes(group.field || group.major);
        break;
      case "languages":
        matchesTab = [
          "Arabic",
          "French",
          "English",
          "Languages",
          "Literature",
        ].includes(group.field || group.major);
        break;
      case "high-school":
        matchesTab = group.level === "High School";
        break;
      case "university":
        matchesTab = group.level === "University";
        break;
    }

    // Search filtering
    const matchesSearch = searchQuery === "" ||
      group.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (group.field || group.major || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.level.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const getTabCount = (tab: string) => {
    switch (tab) {
      case "all":
        return allGroups.length;
      case "active":
        return allGroups.filter((g) => !g.isArchived).length;
      case "archived":
        return allGroups.filter((g) => g.isArchived).length;
      case "sciences":
        return allGroups.filter((g) =>
          [
            "Mathematics",
            "Physics",
            "Chemistry",
            "Biology",
            "Computer Science",
          ].includes(g.field || g.major),
        ).length;
      case "languages":
        return allGroups.filter((g) =>
          ["Arabic", "French", "English", "Languages", "Literature"].includes(
            g.field || g.major,
          ),
        ).length;
      case "high-school":
        return allGroups.filter((g) => g.level === "High School").length;
      case "university":
        return allGroups.filter((g) => g.level === "University").length;
      default:
        return 0;
    }
  };

  // Calculate stats
  const stats = {
    total: allGroups.length,
    active: allGroups.filter((g) => !g.isArchived).length,
    archived: allGroups.filter((g) => g.isArchived).length,
    totalMembers: allGroups.reduce((sum, g) => sum + (g.memberCount || 0), 0),
    semestral: allGroups.filter((g) => g.isSemestral).length,
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Groups</h1>
          <p className="text-muted-foreground">
            Manage your study groups and collaborate with students
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setSelectedGroupForStudents(null);
              setShowAddStudentsDialog(true);
            }}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Students
          </Button>

          <Button
            onClick={() => (window.location.href = "/classroom/groups/create")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>
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

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">All ({getTabCount("all")})</TabsTrigger>
          <TabsTrigger value="active">
            Active ({getTabCount("active")})
          </TabsTrigger>
          <TabsTrigger value="archived">
            Archived ({getTabCount("archived")})
          </TabsTrigger>
          <TabsTrigger value="sciences">
            Sciences ({getTabCount("sciences")})
          </TabsTrigger>
          <TabsTrigger value="languages">
            Languages ({getTabCount("languages")})
          </TabsTrigger>
          <TabsTrigger value="high-school">
            High School ({getTabCount("high-school")})
          </TabsTrigger>
          <TabsTrigger value="university">
            University ({getTabCount("university")})
          </TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        {[
          "all",
          "active",
          "archived",
          "sciences",
          "languages",
          "high-school",
          "university",
        ].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            {error && (
              <Card className="border-destructive mb-6">
                <CardContent className="pt-6">
                  <p className="text-destructive">{error}</p>
                  <Button variant="outline" onClick={refetch} className="mt-2">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Groups Grid/List */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              <AnimatePresence>
                {filteredGroups.map((group) => (
                  <motion.div
                    key={group._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <GroupCard
                      group={group}
                      viewMode={viewMode}
                      onAddStudents={(groupId, groupTitle) => {
                        setSelectedGroupForStudents({ id: groupId, title: groupTitle });
                        setShowAddStudentsDialog(true);
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading skeletons */}
              {loading && (
                <>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <Card className="overflow-hidden">
                        <div className="h-48 bg-muted" />
                        <CardHeader className="pb-2">
                          <div className="h-5 bg-muted rounded mb-2" />
                          <div className="h-4 bg-muted rounded w-2/3" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="h-4 bg-muted rounded" />
                          <div className="h-4 bg-muted rounded" />
                          <div className="h-4 bg-muted rounded w-3/4" />
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Empty State */}
            {!loading && filteredGroups.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Users className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No groups found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? "Try adjusting your search criteria"
                      : `No ${tab === "all" ? "" : tab + " "}groups available`}
                  </p>
                  {!searchQuery && tab === "all" && (
                    <Button
                      onClick={() =>
                        (window.location.href = "/classroom/groups/create")
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Group
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Enhanced Drag & Drop Add Students to Group Dialog */}
      <DragDropAddStudentsToGroupDialog
        open={showAddStudentsDialog}
        onOpenChange={setShowAddStudentsDialog}
        groupId={selectedGroupForStudents?.id}
        groupTitle={selectedGroupForStudents?.title}
        onSuccess={() => {
          refetch();
          setSelectedGroupForStudents(null);
        }}
      />
    </div>
  );
}