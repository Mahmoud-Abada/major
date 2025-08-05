"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupFormData, daysOfWeek, frequencyOptions, groupFormSchema, groupTypeOptions } from "@/lib/validations/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import BaseForm from "./BaseForm";
import { SelectField, TextField, TextareaField } from "./FormField";

interface GroupCreateFormProps {
    onSubmit: (data: GroupFormData) => void;
    onCancel: () => void;
    loading?: boolean;
}

export default function GroupCreateForm({
    onSubmit,
    onCancel,
    loading = false,
}: GroupCreateFormProps) {
    const t = useTranslations();

    const form = useForm<GroupFormData>({
        resolver: zodResolver(groupFormSchema),
        defaultValues: {
            groupId: "",
            name: "",
            description: "",
            type: "Study Group",
            status: "Active",
            maxMembers: 10,
            currentMembers: 0,
            createdBy: "",
            memberIds: [],
            classIds: [],
            meetingSchedule: {
                frequency: "Weekly",
                day: "",
                time: "",
                location: "",
            },
        },
    });

    const statusOptions = [
        { value: "Active", label: "نشط" },
        { value: "Inactive", label: "غير نشط" },
        { value: "Completed", label: "مكتمل" },
    ];

    return (
        <BaseForm
            title="إضافة مجموعة جديدة"
            description="أدخل بيانات المجموعة الجديدة في النظام"
            form={form}
            onSubmit={onSubmit}
            onCancel={onCancel}
            loading={loading}
        >
            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">البيانات الأساسية</TabsTrigger>
                    <TabsTrigger value="settings">الإعدادات</TabsTrigger>
                    <TabsTrigger value="schedule">جدولة الاجتماعات</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                            control={form.control}
                            name="groupId"
                            label="رقم المجموعة"
                            placeholder="G2025001"
                            required
                        />
                        <TextField
                            control={form.control}
                            name="name"
                            label="اسم المجموعة"
                            placeholder="مجموعة دراسة الرياضيات"
                            required
                        />
                        <SelectField
                            control={form.control}
                            name="type"
                            label="نوع المجموعة"
                            options={groupTypeOptions}
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
                            name="createdBy"
                            label="منشئ المجموعة"
                            placeholder="رقم المستخدم"
                            required
                        />
                        <TextareaField
                            control={form.control}
                            name="description"
                            label="الوصف"
                            placeholder="وصف مختصر للمجموعة وأهدافها..."
                            className="md:col-span-2"
                        />
                    </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                            control={form.control}
                            name="maxMembers"
                            label="الحد الأقصى للأعضاء"
                            type="number"
                            placeholder="10"
                            required
                        />
                        <div className="space-y-2">
                            <label className="text-sm font-medium">ملاحظات إضافية</label>
                            <TextareaField
                                control={form.control}
                                name="description"
                                label=""
                                placeholder="أي قواعد أو متطلبات خاصة بالمجموعة..."
                                rows={3}
                            />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField
                            control={form.control}
                            name="meetingSchedule.frequency"
                            label="تكرار الاجتماعات"
                            options={frequencyOptions}
                        />
                        <SelectField
                            control={form.control}
                            name="meetingSchedule.day"
                            label="يوم الاجتماع"
                            options={daysOfWeek}
                        />
                        <div className="space-y-2">
                            <label className="text-sm font-medium">وقت الاجتماع</label>
                            <input
                                type="time"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...form.register("meetingSchedule.time")}
                            />
                        </div>
                        <TextField
                            control={form.control}
                            name="meetingSchedule.location"
                            label="مكان الاجتماع"
                            placeholder="قاعة A101 أو عبر الإنترنت"
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </BaseForm>
    );
}