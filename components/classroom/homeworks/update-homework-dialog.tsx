"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { RiCalendarLine } from "@remixicon/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import type { Homework } from "./types";

interface UpdateHomeworkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  homework: Homework;
  onSubmit: (homework: Homework) => void;
}

const homeworkTypes = [
  { value: "assignment", label: "Assignment" },
  { value: "project", label: "Project" },
  { value: "reading", label: "Reading" },
  { value: "exercise", label: "Exercise" },
  { value: "research", label: "Research" },
];

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const difficulties = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const statuses = [
  { value: "draft", label: "Draft" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "overdue", label: "Overdue" },
];

export function UpdateHomeworkDialog({
  open,
  onOpenChange,
  homework,
  onSubmit,
}: UpdateHomeworkDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: undefined as Date | undefined,
    dueTime: "",
    type: "" as
      | "assignment"
      | "project"
      | "reading"
      | "exercise"
      | "research"
      | "",
    priority: "" as "low" | "medium" | "high" | "urgent" | "",
    status: "" as
      | "draft"
      | "assigned"
      | "in_progress"
      | "completed"
      | "overdue"
      | "",
    totalMarks: "",
    instructions: "",
    estimatedDuration: "",
    difficulty: "" as "easy" | "medium" | "hard" | "",
    tags: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when homework changes
  useEffect(() => {
    if (homework) {
      setFormData({
        title: homework.title,
        description: homework.description,
        dueDate: new Date(homework.dueDate),
        dueTime: homework.dueTime || "",
        type: homework.type,
        priority: homework.priority,
        status: homework.status,
        totalMarks: homework.totalMarks?.toString() || "",
        instructions: homework.instructions || "",
        estimatedDuration: homework.estimatedDuration?.toString() || "",
        difficulty: homework.difficulty,
        tags: homework.tags?.join(", ") || "",
      });
    }
  }, [homework]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.dueDate ||
      !formData.type ||
      !formData.priority ||
      !formData.difficulty ||
      !formData.status
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedHomework: Homework = {
        ...homework,
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate.toISOString().split("T")[0],
        dueTime: formData.dueTime || undefined,
        type: formData.type,
        priority: formData.priority,
        status: formData.status,
        totalMarks: formData.totalMarks
          ? parseInt(formData.totalMarks)
          : undefined,
        instructions: formData.instructions || undefined,
        estimatedDuration: formData.estimatedDuration
          ? parseInt(formData.estimatedDuration)
          : undefined,
        difficulty: formData.difficulty,
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : undefined,
        updatedAt: new Date().toISOString(),
      };

      onSubmit(updatedHomework);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: string,
    value: string | Date | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Homework</DialogTitle>
          <DialogDescription>
            Update the homework assignment details and settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., Exercices sur les fonctions logarithmiques"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Detailed description of the homework assignment..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {homeworkTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange("priority", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty *</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) =>
                  handleInputChange("difficulty", value)
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty.value} value={difficulty.value}>
                      {difficulty.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dueDate && "text-muted-foreground",
                    )}
                  >
                    <RiCalendarLine className="mr-2 h-4 w-4" />
                    {formData.dueDate
                      ? format(formData.dueDate, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => handleInputChange("dueDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueTime">Due Time</Label>
              <Input
                id="dueTime"
                type="time"
                value={formData.dueTime}
                onChange={(e) => handleInputChange("dueTime", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalMarks">Total Marks</Label>
              <Input
                id="totalMarks"
                type="number"
                min="1"
                max="100"
                value={formData.totalMarks}
                onChange={(e) =>
                  handleInputChange("totalMarks", e.target.value)
                }
                placeholder="20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedDuration">
              Estimated Duration (minutes)
            </Label>
            <Input
              id="estimatedDuration"
              type="number"
              min="15"
              max="600"
              value={formData.estimatedDuration}
              onChange={(e) =>
                handleInputChange("estimatedDuration", e.target.value)
              }
              placeholder="120"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) =>
                handleInputChange("instructions", e.target.value)
              }
              placeholder="Detailed instructions for students..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleInputChange("tags", e.target.value)}
              placeholder="e.g., functions, calculus, advanced"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Homework"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
