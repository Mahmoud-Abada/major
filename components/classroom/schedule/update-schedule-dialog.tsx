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
import type { ScheduleEntry } from "./types";

interface UpdateScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: ScheduleEntry;
  onSubmit: (entry: ScheduleEntry) => void;
}

const sessionTypes = [
  { value: "lecture", label: "Cours" },
  { value: "lab", label: "Travaux Pratiques" },
  { value: "tutorial", label: "Travaux Dirigés" },
  { value: "exam", label: "Examen" },
  { value: "meeting", label: "Réunion" },
  { value: "event", label: "Événement" },
];

const statuses = [
  { value: "scheduled", label: "Programmé" },
  { value: "ongoing", label: "En cours" },
  { value: "completed", label: "Terminé" },
  { value: "cancelled", label: "Annulé" },
  { value: "postponed", label: "Reporté" },
];

const colors = [
  { value: "#3B82F6", label: "Bleu" },
  { value: "#EF4444", label: "Rouge" },
  { value: "#10B981", label: "Vert" },
  { value: "#F59E0B", label: "Orange" },
  { value: "#8B5CF6", label: "Violet" },
  { value: "#EC4899", label: "Rose" },
];

export function UpdateScheduleDialog({
  open,
  onOpenChange,
  entry,
  onSubmit,
}: UpdateScheduleDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: undefined as Date | undefined,
    startTime: "",
    endTime: "",
    type: "" as
      | "lecture"
      | "lab"
      | "tutorial"
      | "exam"
      | "meeting"
      | "event"
      | "",
    status: "" as
      | "scheduled"
      | "ongoing"
      | "completed"
      | "cancelled"
      | "postponed"
      | "",
    color: "#3B82F6",
    attendanceRequired: true,
    maxStudents: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when entry changes
  useEffect(() => {
    if (entry) {
      setFormData({
        title: entry.title,
        description: entry.description || "",
        date: new Date(entry.date),
        startTime: entry.startTime,
        endTime: entry.endTime,
        type: entry.type,
        status: entry.status,
        color: entry.color || "#3B82F6",
        attendanceRequired: entry.attendanceRequired,
        maxStudents: entry.maxStudents?.toString() || "",
        notes: entry.notes || "",
      });
    }
  }, [entry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.type ||
      !formData.status
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Determine day of week
      const dayOfWeek = formData.date
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase() as any;

      const updatedEntry: ScheduleEntry = {
        ...entry,
        title: formData.title,
        description: formData.description || undefined,
        date: formData.date.toISOString().split("T")[0],
        startTime: formData.startTime,
        endTime: formData.endTime,
        dayOfWeek,
        type: formData.type,
        status: formData.status,
        color: formData.color,
        notes: formData.notes || undefined,
        attendanceRequired: formData.attendanceRequired,
        maxStudents: formData.maxStudents
          ? parseInt(formData.maxStudents)
          : undefined,
        updatedAt: new Date().toISOString(),
      };

      onSubmit(updatedEntry);
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
          <DialogTitle>Modifier la Session</DialogTitle>
          <DialogDescription>
            Modifier les détails de la session programmée.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., Cours de Mathématiques"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Description de la session..."
              rows={2}
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
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  {sessionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le statut" />
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

          <div className="grid grid-cols-3 gap-4">
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
                      : "Choisir une date"}
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

            <div className="space-y-2">
              <Label htmlFor="startTime">Heure de début *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange("startTime", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Heure de fin *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange("endTime", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">Couleur</Label>
              <Select
                value={formData.color}
                onValueChange={(value) => handleInputChange("color", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une couleur" />
                </SelectTrigger>
                <SelectContent>
                  {colors.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: color.value }}
                        />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxStudents">Nombre max d'étudiants</Label>
              <Input
                id="maxStudents"
                type="number"
                min="1"
                max="100"
                value={formData.maxStudents}
                onChange={(e) =>
                  handleInputChange("maxStudents", e.target.value)
                }
                placeholder="35"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="attendanceRequired"
              checked={formData.attendanceRequired}
              onCheckedChange={(checked) =>
                handleInputChange("attendanceRequired", checked)
              }
            />
            <Label htmlFor="attendanceRequired">Présence obligatoire</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Notes additionnelles..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Modification..." : "Modifier la Session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
