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
import { mockAdmins } from "@/data/mock/users";
import { motion } from "framer-motion";
import { Download, Plus, Search, Shield, Upload, Users } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

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

export default function AdminsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);

  // Filter and sort admins
  const filteredAdmins = useMemo(() => {
    let filtered = mockAdmins;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (admin) =>
          admin.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          admin.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (admin.department && admin.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (admin.position && admin.position.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by department
    if (selectedDepartment !== "all") {
      filtered = filtered.filter((admin) => admin.department === selectedDepartment);
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((admin) => admin.status === selectedStatus);
    }

    // Sort admins
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`
          );
        case "department":
          return (a.department || "").localeCompare(b.department || "");
        case "position":
          return (a.position || "").localeCompare(b.position || "");
        case "permissions":
          return b.permissions.length - a.permissions.length;
        case "created":
          return b.createdAt.getTime() - a.createdAt.getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedDepartment, selectedStatus, sortBy]);

  // Get admin statistics
  const adminStats = useMemo(() => {
    const allDepartments = mockAdmins.map((a) => a.department).filter(Boolean);
    const departmentCounts = allDepartments.reduce((acc, dept) => {
      acc[dept!] = (acc[dept!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const stats = {
      total: mockAdmins.length,
      active: mockAdmins.filter((a) => a.status === "active").length,
      totalPermissions: mockAdmins.reduce((sum, a) => sum + a.permissions.length, 0),
      avgPermissions: Math.round(
        mockAdmins.reduce((sum, a) => sum + a.permissions.length, 0) / mockAdmins.length
      ),
      departmentCounts,
    };
    return stats;
  }, []);

  const handleSelectAdmin = (adminId: string) => {
    setSelectedAdmins((prev) =>
      prev.includes(adminId)
        ? prev.filter((id) => id !== adminId)
        : [...prev, adminId]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for admins:`, selectedAdmins);
    setSelectedAdmins([]);
  };

  const departments = Array.from(
    new Set(mockAdmins.map((a) => a.department).filter(Boolean))
  ).sort();

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
            <Shield className="h-8 w-8" />
            Admin Management
          </h1>
          <p className="text-muted-foreground">
            Manage all administrators in the system
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Admins
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link href="/users/create">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{adminStats.total}</div>
              <p className="text-xs text-muted-foreground">Total Admins</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {adminStats.active}
              </div>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {adminStats.totalPermissions}
              </div>
              <p className="text-xs text-muted-foreground">Total Permissions</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {adminStats.avgPermissions}
              </div>
              <p className="text-xs text-muted-foreground">Avg. Permissions</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Department Statistics */}
      {Object.keys(adminStats.departmentCounts).length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {Object.entries(adminStats.departmentCounts).map(([dept, count]) => (
            <motion.div key={dept} variants={itemVariants}>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">{count}</div>
                  <p className="text-xs text-muted-foreground">{dept}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

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
            placeholder="Search admins by name, email, department, or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((department) => (
              <SelectItem key={department} value={department}>
                {department}
              </SelectItem>
            ))}
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
            <SelectItem value="department">Department</SelectItem>
            <SelectItem value="position">Position</SelectItem>
            <SelectItem value="permissions">Permissions</SelectItem>
            <SelectItem value="created">Created Date</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Bulk Actions */}
      {selectedAdmins.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 bg-muted rounded-lg"
        >
          <span className="text-sm font-medium">
            {selectedAdmins.length} admin(s) selected
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("permissions")}
            >
              Manage Permissions
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("department")}
            >
              Change Department
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
              onClick={() => setSelectedAdmins([])}
            >
              Clear
            </Button>
          </div>
        </motion.div>
      )}

      {/* Admins Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredAdmins.map((admin) => (
          <motion.div key={admin.id} variants={itemVariants}>
            <UserCard
              user={admin}
              isSelected={selectedAdmins.includes(admin.id)}
              onSelect={() => handleSelectAdmin(admin.id)}
              onView={(id) => (window.location.href = `/users/${id}`)}
              onEdit={(id) => (window.location.href = `/users/${id}/edit`)}
              onDelete={(id) => console.log("Delete admin:", id)}
              showAdminInfo={true}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredAdmins.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No admins found</h3>
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
        Showing {filteredAdmins.length} of {mockAdmins.length} admins
      </motion.div>
    </div>
  );
}