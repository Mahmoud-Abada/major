/**
 * StudentSelector Component
 * Enhanced component for selecting and managing students in classrooms
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import {
    ChevronDown,
    Mail,
    Plus,
    Search,
    UserPlus,
    Users,
    X
} from "lucide-react";
import { useState } from "react";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  grade: string;
  status: "active" | "inactive" | "pending";
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
}

interface StudentSelectorProps {
  selectedStudents: Student[];
  availableStudents: Student[];
  onStudentsChange: (students: Student[]) => void;
  maxStudents?: number;
  className?: string;
  disabled?: boolean;
}

export function StudentSelector({
  selectedStudents,
  availableStudents,
  onStudentsChange,
  maxStudents,
  className,
  disabled = false,
}: StudentSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const filteredStudents = availableStudents.filter(
    (student) =>
      !selectedStudents.find((s) => s.id === student.id) &&
      (student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectStudent = (student: Student) => {
    if (maxStudents && selectedStudents.length >= maxStudents) {
      return;
    }
    onStudentsChange([...selectedStudents, student]);
  };

  const handleRemoveStudent = (studentId: string) => {
    onStudentsChange(selectedStudents.filter((s) => s.id !== studentId));
  };

  const handleBulkSelect = (students: Student[]) => {
    const newStudents = students.filter(
      (student) => !selectedStudents.find((s) => s.id === student.id)
    );
    const totalStudents = selectedStudents.length + newStudents.length;
    
    if (maxStudents && totalStudents > maxStudents) {
      const availableSlots = maxStudents - selectedStudents.length;
      onStudentsChange([...selectedStudents, ...newStudents.slice(0, availableSlots)]);
    } else {
      onStudentsChange([...selectedStudents, ...newStudents]);
    }
  };

  const getStudentInitials = (student: Student) => {
    return `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className={className}>
      {/* Selected Students Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Selected Students
              {maxStudents && (
                <Badge variant="outline">
                  {selectedStudents.length}/{maxStudents}
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={disabled || (maxStudents && selectedStudents.length >= maxStudents)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Students
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <Command>
                    <CommandInput
                      placeholder="Search students..."
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                    <CommandList>
                      <CommandEmpty>No students found.</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="h-64">
                          {filteredStudents.map((student) => (
                            <CommandItem
                              key={student.id}
                              onSelect={() => {
                                handleSelectStudent(student);
                                setSearchQuery("");
                              }}
                              className="flex items-center gap-3 p-3"
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={student.avatar} />
                                <AvatarFallback className="text-xs">
                                  {getStudentInitials(student)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">
                                  {student.firstName} {student.lastName}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {student.email}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={`text-xs ${getStatusColor(student.status)}`}
                              >
                                {student.status}
                              </Badge>
                            </CommandItem>
                          ))}
                        </ScrollArea>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Bulk Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Multiple Students</DialogTitle>
                    <DialogDescription>
                      Select multiple students to add to the classroom at once.
                    </DialogDescription>
                  </DialogHeader>
                  <BulkStudentSelector
                    availableStudents={filteredStudents}
                    onSelect={handleBulkSelect}
                    maxSelections={maxStudents ? maxStudents - selectedStudents.length : undefined}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2">No students selected</p>
              <p className="text-sm">Click "Add Students" to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {selectedStudents.map((student) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>
                          {getStudentInitials(student)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {student.firstName} {student.lastName}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            Grade {student.grade}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getStatusColor(student.status)}`}
                          >
                            {student.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{student.email}</span>
                          </div>
                          {student.parentName && (
                            <div className="flex items-center gap-1">
                              <span>Parent: {student.parentName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveStudent(student.id)}
                      disabled={disabled}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Bulk Student Selector Component
interface BulkStudentSelectorProps {
  availableStudents: Student[];
  onSelect: (students: Student[]) => void;
  maxSelections?: number;
}

function BulkStudentSelector({
  availableStudents,
  onSelect,
  maxSelections,
}: BulkStudentSelectorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = availableStudents.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStudent = (studentId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      } else {
        if (maxSelections && prev.length >= maxSelections) {
          return prev;
        }
        return [...prev, studentId];
      }
    });
  };

  const handleSelectAll = () => {
    const allIds = filteredStudents.map((s) => s.id);
    const limitedIds = maxSelections ? allIds.slice(0, maxSelections) : allIds;
    setSelectedIds(limitedIds);
  };

  const handleClearAll = () => {
    setSelectedIds([]);
  };

  const handleConfirm = () => {
    const selectedStudents = availableStudents.filter((s) =>
      selectedIds.includes(s.id)
    );
    onSelect(selectedStudents);
    setSelectedIds([]);
  };

  const getStudentInitials = (student: Student) => {
    return `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm" onClick={handleSelectAll}>
          Select All
        </Button>
        <Button variant="outline" size="sm" onClick={handleClearAll}>
          Clear All
        </Button>
      </div>

      {maxSelections && (
        <div className="text-sm text-muted-foreground">
          Selected: {selectedIds.length}/{maxSelections}
        </div>
      )}

      <ScrollArea className="h-64 border rounded-md">
        <div className="p-2 space-y-2">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50"
            >
              <Checkbox
                checked={selectedIds.includes(student.id)}
                onCheckedChange={() => handleToggleStudent(student.id)}
                disabled={
                  maxSelections &&
                  selectedIds.length >= maxSelections &&
                  !selectedIds.includes(student.id)
                }
              />
              <Avatar className="h-8 w-8">
                <AvatarImage src={student.avatar} />
                <AvatarFallback className="text-xs">
                  {getStudentInitials(student)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">
                  {student.firstName} {student.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {student.email} • Grade {student.grade}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <DialogFooter>
        <Button variant="outline" onClick={() => setSelectedIds([])}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} disabled={selectedIds.length === 0}>
          Add {selectedIds.length} Student{selectedIds.length !== 1 ? "s" : ""}
        </Button>
      </DialogFooter>
    </div>
  );
}