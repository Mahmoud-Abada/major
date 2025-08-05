"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClassFormData, classFormSchema, daysOfWeek, gradeOptions, paymentModeOptions, subjectOptions } from "@/lib/validations/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import BaseForm from "./BaseForm";
import { SelectField, TextField, TextareaField } from "./FormField";
import { useTranslations } from "next-intl";

interface ClassCreateFormProps {
    onSubmit: (data: ClassFormData) => void;
    onCancel: () => void;
    loading?: boolean;
}

export default function ClassCreateForm({
    onSubmit,
    onCancel,
    loading = false,
}: ClassCreateFormProps) {
    const t = useTranslations();
    const [newSchedule, setNewSchedule] = useState({
        day: "",
        startTime: "",
        endTime: "",
    });

    const form = useForm<ClassFormData>({
        resolver: zodResolver(classFormSchema),
        defaultValues: {
            classId: "",
            name: "",
            description: "",
            status: "Active",
            grade: "",
            subject: "",
            academicYear: "2024-2025",
            schedule: [],
            room: "",
            teacherId: "",
            studentIds: [],
            maxStudents: 30,
            currentStudents: 0,
            fee: 0,
            paymentMode: "Monthly",
        },
    });

    const statusOptions = [
        { value: "Active", label: "نشط" },
        { value: "Inactive", label: "غير نشط" },
        { value: "Completed", label: "مكتمل" },
    ];

    const addSchedule = () => {
        if (newSchedule.day && newSchedule.startTime && newSchedule.endTime) {
            const current = form.getValues("schedule");
            const scheduleExists = current.some(s => s.day === newSchedule.day);

            if (!scheduleExists) {
                form.setValue("schedule", [...current, { ...newSchedule }]);
                setNewSchedule({ day: "", startTime: "", endTime: "" });
            }
        }
    };

    const removeSchedule = (index: number) => {
        const current = form.getValues("schedule");
        form.setValue("schedule", current.filter((_, i) => i !== index));
    };

    return (
        <BaseForm
            title="إضافة فصل دراسي جديد"
            description="أدخل بيانات الفصل الدراسي الجديد في النظام"
            form={form}
            onSubmit={onSubmit}
            onCancel={onCancel}
            loading={loading}
        >
            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">البيانات الأساسية</TabsTrigger>
                    <TabsTrigger value="academic">البيانات الأكاديمية</TabsTrigger>
                    <TabsTrigger value="schedule">الجدولة</TabsTrigger>
                    <TabsTrigger value="financial">البيانات المالية</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                            control={form.control}
                            name="classId"
                            label="رقم الفصل"
                            placeholder="C2025001"
                            required
                        />
                        <TextField
                            control={form.control}
                            name="name"
                            label="اسم الفصل"
                            placeholder="رياضيات الثالثة ثانوي"
                            required
                        />
                        <SelectField
                            control={form.control}
                            name="status"
                            label="الحالة"
                            options={statusOptions}
                            required
                        />
                        <TextField
                            control={form.control}
                            name="room"
                            label="القاعة"
                            placeholder="A101"
                            required
                        />
                        <TextareaField
                            control={form.control}
                            name="description"
                            label="الوصف"
                            placeholder="وصف مختصر للفصل الدراسي..."
                            className="md:col-span-2"
                        />
                    </div>
                </TabsContent>

                <TabsContent value="academic" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField
                            control={form.control}
                            name="grade"
                            label="المستوى الدراسي"
                            options={gradeOptions}
                            required
                        />
                        <SelectField
                            control={form.control}
                            name="subject"
                            label="المادة"
                            options={subjectOptions}
                            required
                        />
                        <TextField
                            control={form.control}
                            name="academicYear"
                            label="السنة الدراسية"
                            placeholder="2024-2025"
                            required
                        />
                        <TextField
                            control={form.control}
                            name="teacherId"
                            label="رقم المعلم"
                            placeholder="T2025001"
                            required
                        />
                        <TextField
                            control={form.control}
                            name="maxStudents"
                            label="الحد الأقصى للطلاب"
                            type="number"
                            placeholder="30"
                            required
                        />
                    </div>
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <SelectField
                                control={form.control}
                                name="day"
                                label="اليوم"
                                options={daysOfWeek}
                                placeholder="اختر اليوم"
                            />
                            <div className="space-y-2">
                                <label className="text-sm font-medium">وقت البداية</label>
                                <Input
                                    type="time"
                                    value={newSchedule.startTime}
                                    onChange={(e) => setNewSchedule(prev => ({ ...prev, startTime: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">وقت النهاية</label>
                                <Input
                                    type="time"
                                    value={newSchedule.endTime}
                                    onChange={(e) => setNewSchedule(prev => ({ ...prev, endTime: e.target.value }))}
                                />
                            </div>
                            <div className="flex items-end">
                                <Button type="button" onClick={addSchedule} className="w-full">
                                    <Plus className="h-4 w-4 mr-2" />
                                    إضافة
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">الجدول الأسبوعي</label>
                            <div className="space-y-2">
                                {form.watch("schedule").map((schedule, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                                        <div className="flex items-center gap-4">
                                            <Badge variant="outline">
                                                {daysOfWeek.find(d => d.value === schedule.day)?.label}
                                            </Badge>
                                            <span className="text-sm">
                                                {schedule.startTime} - {schedule.endTime}
                                            </span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSchedule(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {form.watch("schedule").length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        لم يتم إضافة أي جدول زمني بعد
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="financial" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                            control={form.control}
                            name="fee"
                            label="الرسوم (دج)"
                            type="number"
                            placeholder="5000"
                            required
                        />
                        <SelectField
                            control={form.control}
                            name="paymentMode"
                            label="نمط الدفع"
                            options={paymentModeOptions}
                            required
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </BaseForm>
    );
}