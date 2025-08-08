"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from "framer-motion";
import { Filter, Search, X } from "lucide-react";
import { useState } from "react";

interface FilterOptions {
  roles: string[];
  statuses: string[];
  departments: string[];
  subjects: string[];
  grades: string[];
}

interface UserFiltersProps {
  onFiltersChange: (filters: any) => void;
  filterOptions: FilterOptions;
  activeFilters: any;
}

export function UserFilters({
  onFiltersChange,
  filterOptions,
  activeFilters,
}: UserFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(activeFilters);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      roles: [],
      statuses: [],
      departments: [],
      subjects: [],
      grades: [],
      dateRange: null,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.search) count++;
    if (localFilters.roles?.length > 0) count++;
    if (localFilters.statuses?.length > 0) count++;
    if (localFilters.departments?.length > 0) count++;
    if (localFilters.subjects?.length > 0) count++;
    if (localFilters.grades?.length > 0) count++;
    if (localFilters.dateRange) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="flex items-center gap-4">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={localFilters.search || ""}
          onChange={(e) => {
            handleFilterChange("search", e.target.value);
            onFiltersChange({ ...localFilters, search: e.target.value });
          }}
          className="pl-10"
        />
      </div>

      {/* Advanced Filters */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="end">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                Advanced Filters
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Role Filter */}
              <div>
                <Label className="text-sm font-medium">Roles</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {filterOptions.roles.map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role-${role}`}
                        checked={localFilters.roles?.includes(role) || false}
                        onCheckedChange={(checked) => {
                          const currentRoles = localFilters.roles || [];
                          const newRoles = checked
                            ? [...currentRoles, role]
                            : currentRoles.filter((r) => r !== role);
                          handleFilterChange("roles", newRoles);
                        }}
                      />
                      <Label
                        htmlFor={`role-${role}`}
                        className="text-sm capitalize"
                      >
                        {role}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {filterOptions.statuses.map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={
                          localFilters.statuses?.includes(status) || false
                        }
                        onCheckedChange={(checked) => {
                          const currentStatuses = localFilters.statuses || [];
                          const newStatuses = checked
                            ? [...currentStatuses, status]
                            : currentStatuses.filter((s) => s !== status);
                          handleFilterChange("statuses", newStatuses);
                        }}
                      />
                      <Label
                        htmlFor={`status-${status}`}
                        className="text-sm capitalize"
                      >
                        {status}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Department Filter (for admins/teachers) */}
              {filterOptions.departments.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Departments</Label>
                  <div className="space-y-2 mt-2">
                    {filterOptions.departments.map((department) => (
                      <div
                        key={department}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`dept-${department}`}
                          checked={
                            localFilters.departments?.includes(department) ||
                            false
                          }
                          onCheckedChange={(checked) => {
                            const currentDepts = localFilters.departments || [];
                            const newDepts = checked
                              ? [...currentDepts, department]
                              : currentDepts.filter((d) => d !== department);
                            handleFilterChange("departments", newDepts);
                          }}
                        />
                        <Label
                          htmlFor={`dept-${department}`}
                          className="text-sm"
                        >
                          {department}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subject Filter (for teachers) */}
              {filterOptions.subjects.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Subjects</Label>
                  <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
                    {filterOptions.subjects.map((subject) => (
                      <div
                        key={subject}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`subject-${subject}`}
                          checked={
                            localFilters.subjects?.includes(subject) || false
                          }
                          onCheckedChange={(checked) => {
                            const currentSubjects = localFilters.subjects || [];
                            const newSubjects = checked
                              ? [...currentSubjects, subject]
                              : currentSubjects.filter((s) => s !== subject);
                            handleFilterChange("subjects", newSubjects);
                          }}
                        />
                        <Label
                          htmlFor={`subject-${subject}`}
                          className="text-sm"
                        >
                          {subject}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grade Filter (for students) */}
              {filterOptions.grades.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Grades</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {filterOptions.grades.map((grade) => (
                      <div key={grade} className="flex items-center space-x-2">
                        <Checkbox
                          id={`grade-${grade}`}
                          checked={
                            localFilters.grades?.includes(grade) || false
                          }
                          onCheckedChange={(checked) => {
                            const currentGrades = localFilters.grades || [];
                            const newGrades = checked
                              ? [...currentGrades, grade]
                              : currentGrades.filter((g) => g !== grade);
                            handleFilterChange("grades", newGrades);
                          }}
                        />
                        <Label htmlFor={`grade-${grade}`} className="text-sm">
                          {grade}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
                <Button size="sm" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <span className="text-sm text-muted-foreground">Active filters:</span>
          <div className="flex gap-1">
            {localFilters.roles?.map((role: string) => (
              <Badge key={role} variant="secondary" className="text-xs">
                {role}
                <button
                  onClick={() => {
                    const newRoles = localFilters.roles.filter(
                      (r: string) => r !== role,
                    );
                    handleFilterChange("roles", newRoles);
                    onFiltersChange({ ...localFilters, roles: newRoles });
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
            {localFilters.statuses?.map((status: string) => (
              <Badge key={status} variant="secondary" className="text-xs">
                {status}
                <button
                  onClick={() => {
                    const newStatuses = localFilters.statuses.filter(
                      (s: string) => s !== status,
                    );
                    handleFilterChange("statuses", newStatuses);
                    onFiltersChange({ ...localFilters, statuses: newStatuses });
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
