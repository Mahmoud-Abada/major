"use client";

import { ClassroomCard } from "@/components/classroom/ClassroomCard";
import LinkGroupsToClassroomsDialog from "@/components/dialogs/LinkGroupsToClassroomsDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthContext } from "@/contexts/AuthContext";
import { useDeleteClassroomMutation, useGetClassroomsQuery, useUpdateClassroomMutation } from "@/store/api/classroomApi";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Grid3X3, List, Plus, RefreshCw, Search, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ClassesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [selectedClassroomsForLinking, setSelectedClassroomsForLinking] = useState<string[]>([]);
  const { user } = useAuthContext();

  // Fetch classrooms using RTK Query
  const {
    data: classroomsResponse,
    isLoading,
    error: apiError,
    refetch
  } = useGetClassroomsQuery({
    status: activeTab === "archived" ? "archived" : "notArchived",
    pagination: { numItems: 50, cursor: null },
    groupPagination: { numItems: 50, cursor: null },
    fetchBy: { userType: user?.userType || "teacher", userId: user?.id },
  });

  const [deleteClassroomMutation] = useDeleteClassroomMutation();
  const [updateClassroomMutation] = useUpdateClassroomMutation();

  // Extract classrooms from response
  const classrooms = classroomsResponse?.data || [];
  const loading = isLoading;
  const error = apiError ? 'Failed to load classrooms' : null;

  // Filter classrooms based on search and active tab
  const filteredClassrooms = classrooms.filter((classroom) => {
    const matchesSearch =
      classroom.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classroom.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classroom.level.toLowerCase().includes(searchQuery.toLowerCase());

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

    return matchesSearch && matchesTab;
  });

  // Classroom actions
  const handleViewClassroom = (id: string) => {
    window.location.href = `/classroom/classes/${id}`;
  };

  const handleEditClassroom = (id: string) => {
    window.location.href = `/classroom/classes/${id}/edit`;
  };

  const handleDeleteClassroom = async (id: string) => {
    if (!confirm("Are you sure you want to delete this classroom?")) return;

    try {
      await deleteClassroomMutation(id).unwrap();
      toast.success("Classroom deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete classroom");
    }
  };

  const handleArchiveClassroom = async (id: string) => {
    try {
      const classroom = classrooms.find((c) => c.id === id);
      const isArchived = !classroom?.isArchived;

      await updateClassroomMutation({
        classroomId: id,
        classroomData: { isArchived }
      }).unwrap();

      toast.success(
        isArchived ? "Classroom archived successfully" : "Classroom unarchived successfully"
      );
      refetch();
    } catch (error) {
      toast.error("Failed to update classroom");
    }
  };

  const getTabCount = (tab: string) => {
    switch (tab) {
      case "all":
        return classrooms.length;
      case "active":
        return classrooms.filter((c) => !c.isArchived).length;
      case "archived":
        return classrooms.filter((c) => c.isArchived).length;
      case "sciences":
        return classrooms.filter((c) =>
          [
            "Mathematics",
            "Physics",
            "Chemistry",
            "Biology",
            "Computer Science",
          ].includes(c.field),
        ).length;
      case "languages":
        return classrooms.filter((c) =>
          ["Arabic", "French", "English", "Languages", "Literature"].includes(
            c.field,
          ),
        ).length;
      case "high-school":
        return classrooms.filter((c) => c.level === "High School").length;
      case "university":
        return classrooms.filter((c) => c.level === "University").length;
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
            onClick={() => refetch()}
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
              setSelectedClassroomsForLinking([]);
              setShowLinkDialog(true);
            }}
          >
            <Users className="h-4 w-4 mr-2" />
            Link to Groups
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
                  <Button variant="outline" onClick={() => refetch()} className="mt-2">
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
                    key={classroom.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ClassroomCard
                      classroom={classroom}
                      viewMode={viewMode}
                      onView={handleViewClassroom}
                      onEdit={handleEditClassroom}
                      onDelete={handleDeleteClassroom}
                      onArchive={handleArchiveClassroom}
                      onUnarchive={handleArchiveClassroom}
                      onLinkToGroups={(classroomId) => {
                        setSelectedClassroomsForLinking([classroomId]);
                        setShowLinkDialog(true);
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

      {/* Link Groups to Classrooms Dialog */}
      <LinkGroupsToClassroomsDialog
        open={showLinkDialog}
        onOpenChange={setShowLinkDialog}
        preSelectedClassrooms={selectedClassroomsForLinking}
        onSuccess={() => {
          refetch();
          setSelectedClassroomsForLinking([]);
        }}
      />
    </div>
  );
}
