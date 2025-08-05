"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RiUserLine, RiCalendarLine, RiTimeLine } from "@remixicon/react";
import type { AttendanceRecord } from "./types";

interface UpdateAttendanceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    record: AttendanceRecord;
    onSubmit: (record: AttendanceRecord) => void;
}

const statusOptions = [
    { value: "present", label: "Present", color: "bg-green-100 text-green-800" },
    { value: "absent", label: "Absent", color: "bg-red-100 text-red-800" },
    { value: "late", label: "Late", color: "bg-orange-100 text-orange-800" },
    { value: "excused", label: "Excused", color: "bg-blue-100 text-blue-800" },
];

export function UpdateAttendanceDialog({ open, onOpenChange, record, onSubmit }: UpdateAttendanceDialogProps) {
    const [formData, setFormData] = useState({
        status: "present" as "present" | "absent" | "late" | "excused",
        timeIn: "",
        timeOut: "",
        notes: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form data when record changes
    useEffect(() => {
        if (record) {
            setFormData({
                status: record.status,
                timeIn: record.timeIn || "",
                timeOut: record.timeOut || "",
                notes: record.notes || "",
            });
        }
    }, [record]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);

        try {
            const updatedRecord: AttendanceRecord = {
                ...record,
                status: formData.status,
                timeIn: formData.timeIn || undefined,
                timeOut: formData.timeOut || undefined,
                notes: formData.notes || undefined,
                updatedAt: new Date().toISOString(),
            };

            onSubmit(updatedRecord);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const selectedStatus = statusOptions.find(option => option.value === formData.status);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Update Attendance</DialogTitle>
                    <DialogDescription>
                        Update the attendance record for this student.
                    </DialogDescription>
                </DialogHeader>

                {/* Student Information */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                        <RiUserLine className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{record.studentName}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <RiCalendarLine className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            {new Date(record.date).toLocaleDateString()} • {record.className}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Current Status:</span>
                        <Badge variant="outline" className={selectedStatus?.color}>
                            {selectedStatus?.label}
                        </Badge>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="status">Attendance Status *</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => handleInputChange("status", value)}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${option.color}`} />
                                            {option.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {(formData.status === "present" || formData.status === "late") && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="timeIn">Time In</Label>
                                <Input
                                    id="timeIn"
                                    type="time"
                                    value={formData.timeIn}
                                    onChange={(e) => handleInputChange("timeIn", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="timeOut">Time Out</Label>
                                <Input
                                    id="timeOut"
                                    type="time"
                                    value={formData.timeOut}
                                    onChange={(e) => handleInputChange("timeOut", e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => handleInputChange("notes", e.target.value)}
                            placeholder={
                                formData.status === "absent" ? "Reason for absence..." :
                                formData.status === "late" ? "Reason for being late..." :
                                formData.status === "excused" ? "Excuse details..." :
                                "Additional notes..."
                            }
                            rows={3}
                        />
                    </div>

                    {/* Status-specific guidance */}
                    <div className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                            <RiTimeLine className="h-4 w-4 mt-0.5" />
                            <div>
                                {formData.status === "present" && (
                                    <p>Student was present for the entire session. Please record accurate time in/out if available.</p>
                                )}
                                {formData.status === "absent" && (
                                    <p>Student was absent from the session. Consider adding a note about the reason if known.</p>
                                )}
                                {formData.status === "late" && (
                                    <p>Student arrived late. Please record the actual arrival time and any relevant notes.</p>
                                )}
                                {formData.status === "excused" && (
                                    <p>Student had an excused absence. Please provide details about the excuse (medical, family, etc.).</p>
                                )}
                            </div>
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
                            {isSubmitting ? "Updating..." : "Update Attendance"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}