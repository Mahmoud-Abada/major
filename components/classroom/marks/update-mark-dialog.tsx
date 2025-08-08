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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { RiCalendarLine } from "@remixicon/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import type { Mark } from "./types";

interface UpdateMarkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mark: Mark;
  onSubmit: (mark: Mark) => void;
}

const algerianSubjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Arabic",
  "French",
  "English",
  "History",
  "Geography",
  "Islamic Studies",
  "Philosophy",
];

const algerianClasses = [
  "1ère AS Lettres",
  "1ère AS Sciences",
  "2ème AS Lettres",
  "2ème AS Sciences",
  "3ème AS Lettres",
  "3ème AS Sciences",
  "Terminal Lettres",
  "Terminal Sciences",
  "1ère AM",
  "2ème AM",
  "3ème AM",
  "4ème AM",
];

const markTypes = [
  { value: "exam", label: "Exam" },
  { value: "quiz", label: "Quiz" },
  { value: "assignment", label: "Assignment" },
  { value: "test", label: "Test" },
];

export function UpdateMarkDialog({
  open,
  onOpenChange,
  mark,
  onSubmit,
}: UpdateMarkDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    class: "",
    type: "" as "exam" | "quiz" | "assignment" | "test" | "",
    totalMarks: "",
    date: undefined as Date | undefined,
    description: "",
    duration: "",
    instructions: "",
    status: "draft" as "published" | "draft",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when mark changes
  useEffect(() => {
    if (mark) {
      setFormData({
        title: mark.title,
        subject: mark.subject,
        class: mark.class,
        type: mark.type,
        totalMarks: mark.totalMarks.toString(),
        date: new Date(mark.date),
        description: mark.description || "",
        duration: mark.duration?.toString() || "",
        instructions: mark.instructions || "",
        status: mark.status,
      });
    }
  }, [mark]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.subject ||
      !formData.class ||
      !formData.type ||
      !formData.totalMarks ||
      !formData.date
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedMark: Mark = {
        ...mark,
        title: formData.title,
        subject: formData.subject,
        class: formData.class,
        type: formData.type,
        totalMarks: parseInt(formData.totalMarks),
        date: formData.date.toISOString().split("T")[0],
        status: formData.status,
        description: formData.description || undefined,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
        instructions: formData.instructions || undefined,
        updatedAt: new Date().toISOString(),
      };

      onSubmit(updatedMark);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: string,
    value: string | Date | undefined | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Mark</DialogTitle>
          <DialogDescription>
            Update the assessment details and settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Contrôle Continu Mathématiques"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select
                value={formData.subject}
                onValueChange={(value) => handleInputChange("subject", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {algerianSubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class">Class *</Label>
              <Select
                value={formData.class}
                onValueChange={(value) => handleInputChange("class", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {algerianClasses.map((className) => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  handleInputChange("type", value as any)
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {markTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalMarks">Total Marks *</Label>
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                max="300"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                placeholder="120"
              />
            </div>

            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground",
                    )}
                  >
                    <RiCalendarLine className="mr-2 h-4 w-4" />
                    {formData.date
                      ? format(formData.date, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => handleInputChange("date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Brief description of the assessment..."
              rows={3}
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
              placeholder="Special instructions for students..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="status"
              checked={formData.status === "published"}
              onCheckedChange={(checked) =>
                handleInputChange("status", checked ? "published" : "draft")
              }
            />
            <Label htmlFor="status">
              Publish mark (students will be able to see it)
            </Label>
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
              {isSubmitting ? "Updating..." : "Update Mark"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
