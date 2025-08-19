"use client";

import { ClassroomCard } from "@/components/classroom/ClassroomCard";
import DragDropAddStudentsToClassroomDialog from "@/components/dialogs/DragDropAddStudentsToClassroomDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Grid3X3, List, Plus, RefreshCw, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function ClassesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("all");
  // Link Entity Dialog state
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkEntityInfo, setLinkEntityInfo] = useState<{
    id: string;
    type: 'classroom';
    title: string;
    subtitle?: string;
    details?: any;
  } | null>(null);
  const [linkType, setLinkType] = useState<'groups' | 'students'>('groups');

  // Legacy dialog state (to be removed)
  const [showAddStudentsDialog, setShowAddStudentsDialog] = useState(false);
  const [selectedClassroomForStudents, setSelectedClassroomForStudents] = useState<{ id: string, title: string } | null>(null);

  // API state
  const [allClassrooms, setAllClassrooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prevent duplicate API calls
  const hasFetched = useRef(false);
  const isCurrentlyFetching = useRef(false);

  // Fetch classrooms once on mount
  const fetchClassrooms = async (force: boolean = false) => {
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
        pagination: { numItems: 100, cursor: null },
        groupPagination: { numItems: 1, cursor: null },
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
      const classroomsData = data.payload?.classrooms || [];

      setAllClassrooms(classroomsData);
      setError(null);
      hasFetched.current = true;

      // Only show toast on manual refresh
      if (force) {
        toast.success(`Refreshed ${classroomsData.length} classrooms`);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(errorMessage);
      setAllClassrooms([]);
      toast.error("Failed to load classrooms");
    } finally {
      setLoading(false);
      isCurrentlyFetching.current = false;
    }
  };

  // Load classrooms once on mount
  useEffect(() => {
    fetchClassrooms();
  }, []); // Empty dependency array to prevent re-runs

  const refetch = () => {
    hasFetched.current = false; // Reset the flag
    fetchClassrooms(true);
  };



  // Classroom actions
  const handleViewClassroom = (id: string) => {
    window.location.href = `/classroom/classes/${id}`;
  };

  const handleEditClassroom = (id: string) => {
    window.location.href = `/classroom/classes/${id}/edit`;
  };

  const handleDeleteClassroom = async (id: string) => {
    if (!confirm("Are you sure you want to delete this classroom?")) return;

    console.log("Delete classroom:", id);
    toast.info("Delete functionality will be implemented later");
  };

  const handleArchiveClassroom = async (id: string) => {
    console.log("Archive classroom:", id);
    toast.info("Archive functionality will be implemented later");
  };

  // Filter classrooms based on active tab and search
  const filteredClassrooms = allClassrooms.filter((classroom) => {
    // Tab filtering
    let matchesTab = true;
    switch (activeTab) {
      case "all":
        matchesTab = true;
        break;
      case "active":
        matchesTab = !classroom.isArchived;
        break;
      case "archived":
        matchesTab = classroom.isArchived;
        break;
      case "sciences":
        matchesTab = [
          "Mathematics",
          "Physics",
          "Chemistry",
          "Biology",
          "Computer Science",
        ].includes(classroom.field);
        break;
      case "languages":
        matchesTab = [
          "Arabic",
          "French",
          "English",
          "Languages",
          "Literature",
        ].includes(classroom.field);
        break;
      case "high-school":
        matchesTab = classroom.level === "High School";
        break;
      case "university":
        matchesTab = classroom.level === "University";
        break;
    }

    // Search filtering
    const matchesSearch = searchQuery === "" ||
      classroom.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classroom.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classroom.level.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const getTabCount = (tab: string) => {
    switch (tab) {
      case "all":
        return allClassrooms.length;
      case "active":
        return allClassrooms.filter((c) => !c.isArchived).length;
      case "archived":
        return allClassrooms.filter((c) => c.isArchived).length;
      case "sciences":
        return allClassrooms.filter((c) =>
          [
            "Mathematics",
            "Physics",
            "Chemistry",
            "Biology",
            "Computer Science",
          ].includes(c.field),
        ).length;
      case "languages":
        return allClassrooms.filter((c) =>
          ["Arabic", "French", "English", "Languages", "Literature"].includes(
            c.field,
          ),
        ).length;
      case "high-school":
        return allClassrooms.filter((c) => c.level === "High School").length;
      case "university":
        return allClassrooms.filter((c) => c.level === "University").length;
      default:
        return 0;
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Classes</h1>
          <p className="text-muted-foreground">
            Manage your classroom sessions
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
            onClick={() => (window.location.href = "/classroom/classrooms/create")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </Button>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search classrooms..."
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

            {/* Classrooms Grid/List */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              <AnimatePresence>
                {filteredClassrooms.map((classroom) => (
                  <motion.div
                    key={classroom._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ClassroomCard
                      classroom={classroom}
                      viewMode={viewMode}
                      onLinkToGroups={(classroomId) => {
                        setSelectedClassroomsForLinking([classroomId]);
                        setShowLinkDialog(true);
                      }}
                      onAddStudents={(classroomId, classroomTitle) => {
                        setSelectedClassroomForStudents({ id: classroomId, title: classroomTitle });
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
            {!loading && filteredClassrooms.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No classrooms found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? "Try adjusting your search criteria"
                      : `No ${tab === "all" ? "" : tab + " "}classrooms available`}
                  </p>
                  {!searchQuery && tab === "all" && (
                    <Button
                      onClick={() =>
                        (window.location.href = "/classroom/classrooms/create")
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Classroom
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Enhanced Link Groups to Classrooms Dialog */}
      <EnhancedLinkGroupsToClassroomsDialog
        open={showLinkDialog}
        onOpenChange={setShowLinkDialog}
        preSelectedClassrooms={selectedClassroomsForLinking}
        onSuccess={() => {
          refetch();
          setSelectedClassroomsForLinking([]);
        }}
      />

      {/* Enhanced Drag & Drop Add Students to Classroom Dialog */}
      <DragDropAddStudentsToClassroomDialog
        open={showAddStudentsDialog}
        onOpenChange={setShowAddStudentsDialog}
        classroomId={selectedClassroomForStudents?.id}
        classroomTitle={selectedClassroomForStudents?.title}
        onSuccess={() => {
          refetch();
          setSelectedClassroomForStudents(null);
        }}
      />
    </div>
  );
}
