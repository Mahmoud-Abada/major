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
import { useState } from "react";
import type { ScheduleEntry } from "./types";

interface CreateScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (entry: Omit<ScheduleEntry, "id">) => void;
}

const algerianClasses = [
  { id: "class_1", name: "1ère AS Sciences" },
  { id: "class_2", name: "1ère AS Lettres" },
  { id: "class_3", name: "2ème AS Sciences" },
  { id: "class_4", name: "2ème AS Lettres" },
  { id: "class_5", name: "3ème AS Sciences" },
  { id: "class_6", name: "3ème AS Lettres" },
  { id: "class_7", name: "Terminal Sciences" },
  { id: "class_8", name: "Terminal Lettres" },
  { id: "class_9", name: "1ère AM" },
  { id: "class_10", name: "2ème AM" },
  { id: "class_11", name: "3ème AM" },
  { id: "class_12", name: "4ème AM" },
];

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
  "Physical Education",
];

const algerianTeachers = [
  { id: "teacher_1", name: "Prof. Benali Ahmed" },
  { id: "teacher_2", name: "Prof. Khelifi Fatima" },
  { id: "teacher_3", name: "Prof. Meziane Omar" },
  { id: "teacher_4", name: "Prof. Boumediene Aicha" },
  { id: "teacher_5", name: "Prof. Hamidi Youcef" },
  { id: "teacher_6", name: "Prof. Cherif Samira" },
  { id: "teacher_7", name: "Prof. Belkacem Omar" },
  { id: "teacher_8", name: "Prof. Boukhalfa Karim" },
];

const schoolRooms = [
  { id: "room_1", name: "Salle 101" },
  { id: "room_2", name: "Salle 102" },
  { id: "room_3", name: "Salle 103" },
  { id: "room_4", name: "Labo Physique" },
  { id: "room_5", name: "Labo Chimie" },
  { id: "room_6", name: "Labo Informatique" },
  { id: "room_7", name: "Amphithéâtre" },
  { id: "room_8", name: "Bibliothèque" },
  { id: "room_9", name: "Gymnase" },
];

const sessionTypes = [
  { value: "lecture", label: "Cours" },
  { value: "lab", label: "Travaux Pratiques" },
  { value: "tutorial", label: "Travaux Dirigés" },
  { value: "exam", label: "Examen" },
  { value: "meeting", label: "Réunion" },
  { value: "event", label: "Événement" },
];

const colors = [
  { value: "#3B82F6", label: "Bleu" },
  { value: "#EF4444", label: "Rouge" },
  { value: "#10B981", label: "Vert" },
  { value: "#F59E0B", label: "Orange" },
  { value: "#8B5CF6", label: "Violet" },
  { value: "#EC4899", label: "Rose" },
];

export function CreateScheduleDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateScheduleDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    classId: "",
    teacherId: "",
    roomId: "",
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
    color: "#3B82F6",
    isRecurring: false,
    recurrencePattern: "" as "daily" | "weekly" | "monthly" | "",
    recurrenceEndDate: undefined as Date | undefined,
    attendanceRequired: true,
    maxStudents: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.subject ||
      !formData.classId ||
      !formData.teacherId ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.type
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedClass = algerianClasses.find(
        (c) => c.id === formData.classId,
      );
      const selectedTeacher = algerianTeachers.find(
        (t) => t.id === formData.teacherId,
      );
      const selectedRoom = schoolRooms.find((r) => r.id === formData.roomId);

      if (!selectedClass || !selectedTeacher) {
        return;
      }

      // Determine day of week
      const dayOfWeek = formData.date
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase() as any;

      const entry: Omit<ScheduleEntry, "id"> = {
        title: formData.title,
        description: formData.description || undefined,
        subject: formData.subject,
        classId: formData.classId,
        className: selectedClass.name,
        teacherId: formData.teacherId,
        teacherName: selectedTeacher.name,
        roomId: formData.roomId || undefined,
        roomName: selectedRoom?.name,
        date: formData.date.toISOString().split("T")[0],
        startTime: formData.startTime,
        endTime: formData.endTime,
        dayOfWeek,
        type: formData.type,
        status: "scheduled",
        isRecurring: formData.isRecurring,
        recurrencePattern: formData.isRecurring
          ? formData.recurrencePattern
          : undefined,
        recurrenceEndDate:
          formData.isRecurring && formData.recurrenceEndDate
            ? formData.recurrenceEndDate.toISOString().split("T")[0]
            : undefined,
        color: formData.color,
        notes: formData.notes || undefined,
        attendanceRequired: formData.attendanceRequired,
        maxStudents: formData.maxStudents
          ? parseInt(formData.maxStudents)
          : undefined,
        currentStudents: Math.floor(Math.random() * 10) + 20,
        createdBy: selectedTeacher.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onSubmit(entry);

      // Reset form
      setFormData({
        title: "",
        description: "",
        subject: "",
        classId: "",
        teacherId: "",
        roomId: "",
        date: undefined,
        startTime: "",
        endTime: "",
        type: "",
        color: "#3B82F6",
        isRecurring: false,
        recurrencePattern: "",
        recurrenceEndDate: undefined,
        attendanceRequired: true,
        maxStudents: "",
        notes: "",
      });
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter une Session</DialogTitle>
          <DialogDescription>
            Créer une nouvelle session dans l'emploi du temps.
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
              <Label htmlFor="subject">Matière *</Label>
              <Select
                value={formData.subject}
                onValueChange={(value) => handleInputChange("subject", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une matière" />
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="classId">Classe *</Label>
              <Select
                value={formData.classId}
                onValueChange={(value) => handleInputChange("classId", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  {algerianClasses.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacherId">Enseignant *</Label>
              <Select
                value={formData.teacherId}
                onValueChange={(value) => handleInputChange("teacherId", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un enseignant" />
                </SelectTrigger>
                <SelectContent>
                  {algerianTeachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="roomId">Salle</Label>
            <Select
              value={formData.roomId}
              onValueChange={(value) => handleInputChange("roomId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une salle" />
              </SelectTrigger>
              <SelectContent>
                {schoolRooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          <div className="flex items-center space-x-2">
            <Switch
              id="isRecurring"
              checked={formData.isRecurring}
              onCheckedChange={(checked) =>
                handleInputChange("isRecurring", checked)
              }
            />
            <Label htmlFor="isRecurring">Session récurrente</Label>
          </div>

          {formData.isRecurring && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recurrencePattern">Récurrence</Label>
                <Select
                  value={formData.recurrencePattern}
                  onValueChange={(value) =>
                    handleInputChange("recurrencePattern", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir la récurrence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Quotidienne</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    <SelectItem value="monthly">Mensuelle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date de fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.recurrenceEndDate && "text-muted-foreground",
                      )}
                    >
                      <RiCalendarLine className="mr-2 h-4 w-4" />
                      {formData.recurrenceEndDate
                        ? format(formData.recurrenceEndDate, "PPP")
                        : "Date de fin"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.recurrenceEndDate}
                      onSelect={(date) =>
                        handleInputChange("recurrenceEndDate", date)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

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
              {isSubmitting ? "Création..." : "Créer la Session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
