"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserCard } from "@/components/users/user-card";
import { motion } from "framer-motion";
import { Download, Heart, Plus, Search, Upload, Users } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
// Empty parents array - will be populated from API
const mockParents: any[] = [];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ParentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRelationship, setSelectedRelationship] =
    useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [selectedParents, setSelectedParents] = useState<string[]>([]);

  // Filter and sort parents
  const filteredParents = useMemo(() => {
    let filtered = mockParents;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (parent) =>
          parent.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          parent.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          parent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (parent.occupation &&
            parent.occupation
              .toLowerCase()
              .includes(searchQuery.toLowerCase())),
      );
    }

    // Filter by relationship
    if (selectedRelationship !== "all") {
      filtered = filtered.filter(
        (parent) => parent.relationship === selectedRelationship,
      );
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((parent) => parent.status === selectedStatus);
    }

    // Sort parents
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`,
          );
        case "children":
          return b.children.length - a.children.length;
        case "relationship":
          return a.relationship.localeCompare(b.relationship);
        case "created":
          return b.createdAt.getTime() - a.createdAt.getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedRelationship, selectedStatus, sortBy]);

  // Get parent statistics
  const parentStats = useMemo(() => {
    const stats = {
      total: mockParents.length,
      active: mockParents.filter((p) => p.status === "active").length,
      fathers: mockParents.filter((p) => p.relationship === "father").length,
      mothers: mockParents.filter((p) => p.relationship === "mother").length,
      guardians: mockParents.filter((p) => p.relationship === "guardian")
        .length,
      totalChildren: mockParents.reduce((sum, p) => sum + p.children.length, 0),
    };
    return stats;
  }, []);

  const handleSelectParent = (parentId: string) => {
    setSelectedParents((prev) =>
      prev.includes(parentId)
        ? prev.filter((id) => id !== parentId)
        : [...prev, parentId],
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for parents:`, selectedParents);
    setSelectedParents([]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="h-8 w-8" />
            Parent Management
          </h1>
          <p className="text-muted-foreground">
            Manage all parents and guardians in the system
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Parents
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link href="/classroom/users/create">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Parent
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{parentStats.total}</div>
              <p className="text-xs text-muted-foreground">Total Parents</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {parentStats.active}
              </div>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {parentStats.fathers}
              </div>
              <p className="text-xs text-muted-foreground">Fathers</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-pink-600">
                {parentStats.mothers}
              </div>
              <p className="text-xs text-muted-foreground">Mothers</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {parentStats.guardians}
              </div>
              <p className="text-xs text-muted-foreground">Guardians</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {parentStats.totalChildren}
              </div>
              <p className="text-xs text-muted-foreground">Total Children</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 items-center"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search parents by name, email, or occupation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={selectedRelationship}
          onValueChange={setSelectedRelationship}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Relationship" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="father">Father</SelectItem>
            <SelectItem value="mother">Mother</SelectItem>
            <SelectItem value="guardian">Guardian</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="children">Children Count</SelectItem>
            <SelectItem value="relationship">Relationship</SelectItem>
            <SelectItem value="created">Created Date</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Bulk Actions */}
      {selectedParents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 bg-muted rounded-lg"
        >
          <span className="text-sm font-medium">
            {selectedParents.length} parent(s) selected
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("notify")}
            >
              Send Notification
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("meeting")}
            >
              Schedule Meeting
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("export")}
            >
              Export Selected
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedParents([])}
            >
              Clear
            </Button>
          </div>
        </motion.div>
      )}

      {/* Parents Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredParents.map((parent) => (
          <motion.div key={parent.id} variants={itemVariants}>
            <UserCard
              user={parent}
              isSelected={selectedParents.includes(parent.id)}
              onSelect={() => handleSelectParent(parent.id)}
              onView={(id) => (window.location.href = `/users/${id}`)}
              onEdit={(id) => (window.location.href = `/users/${id}/edit`)}
              onDelete={(id) => console.log("Delete parent:", id)}
              showParentInfo={true}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredParents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No parents found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or filters.
          </p>
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            Clear Filters
          </Button>
        </motion.div>
      )}

      {/* Results Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-sm text-muted-foreground"
      >
        Showing {filteredParents.length} of {mockParents.length} parents
      </motion.div>
    </div>
  );
}
