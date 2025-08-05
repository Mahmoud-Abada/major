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
import { useState } from "react";
import type { AttendanceEvent } from "./types";

interface CreateEventDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (event: Omit<AttendanceEvent, "id">) => void;
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
    { id: "class_12", name: "4ème AM" }
];

const algerianSubjects = [
    { id: "math", name: "Mathematics" },
    { id: "physics", name: "Physics" },
    { id: "chemistry", name: "Chemistry" },
    { id: "biology", name: "Biology" },
    { id: "arabic", name: "Arabic" },
    { id: "french", name: "French" },
    { id: "english", name: "English" },
    { id: "history", name: "History" },
    { id: "geography", name: "Geography" },
    { id: "islamic", name: "Islamic Studies" },
    { id: "philosophy", name: "Philosophy" }
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

export function CreateEventDialog({ open, onOpenChange, onSubmit }: CreateEventDialogProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: undefined as Date | undefined,
        startTime: "",
        endTime: "",
        classId: "",
        subjectId: "",
        teacherId: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.date || !formData.startTime ||
            !formData.endTime || !formData.classId || !formData.teacherId) {
            return;
        }

        setIsSubmitting(true);

        try {
            const selectedClass = algerianClasses.find(c => c.id === formData.classId);
            const selectedSubject = algerianSubjects.find(s => s.id === formData.subjectId);
            const selectedTeacher = algerianTeachers.find(t => t.id === formData.teacherId);

            if (!selectedClass || !selectedTeacher) {
                return;
            }

            const totalStudents = Math.floor(Math.random() * 15) + 20; // 20-35 students

            const event: Omit<AttendanceEvent, "id"> = {
                title: formData.title,
                description: formData.description || undefined,
                date: formData.date.toISOString().split('T')[0],
                startTime: formData.startTime,
                endTime: formData.endTime,
                classId: formData.classId,
                className: selectedClass.name,
                subjectId: formData.subjectId || undefined,
                subjectName: selectedSubject?.name,
                teacherId: formData.teacherId,
                teacherName: selectedTeacher.name,
                totalStudents,
                presentCount: 0,
                absentCount: 0,
                lateCount: 0,
                excusedCount: 0,
                attendanceRate: 0,
                status: "scheduled",
                createdBy: selectedTeacher.name,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            onSubmit(event);

            // Reset form
            setFormData({
                title: "",
                description: "",
                date: undefined,
                startTime: "",
                endTime: "",
                classId: "",
                subjectId: "",
                teacherId: "",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: string, value: string | Date | undefined) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Attendance Event</DialogTitle>
                    <DialogDescription>
                        Create a new attendance tracking event for a class session.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Event Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            placeholder="e.g., Mathematics - Morning Session"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Optional description of the session..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="classId">Class *</Label>
                            <Select
                                value={formData.classId}
                                onValueChange={(value) => handleInputChange("classId", value)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select class" />
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
                            <Label htmlFor="subjectId">Subject</Label>
                            <Select
                                value={formData.subjectId}
                                onValueChange={(value) => handleInputChange("subjectId", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {algerianSubjects.map((subject) => (
                                        <SelectItem key={subject.id} value={subject.id}>
                                            {subject.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="teacherId">Teacher *</Label>
                        <Select
                            value={formData.teacherId}
                            onValueChange={(value) => handleInputChange("teacherId", value)}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select teacher" />
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

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Date *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !formData.date && "text-muted-foreground"
                                        )}
                                    >
                                        <RiCalendarLine className="mr-2 h-4 w-4" />
                                        {formData.date ? format(formData.date, "PPP") : "Pick a date"}
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
                            <Label htmlFor="startTime">Start Time *</Label>
                            <Input
                                id="startTime"
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => handleInputChange("startTime", e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="endTime">End Time *</Label>
                            <Input
                                id="endTime"
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => handleInputChange("endTime", e.target.value)}
                                required
                            />
                        </div>
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
                            {isSubmitting ? "Creating..." : "Create Event"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}