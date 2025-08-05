"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeacherFormData, algerianWilayas, paymentScheduleOptions, teacherFormSchema } from "@/lib/validations/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import BaseForm from "./BaseForm";
import { DateField, SelectField, TextField, TextareaField } from "./FormField";

interface TeacherCreateFormProps {
    onSubmit: (data: TeacherFormData) => void;
    onCancel: () => void;
    loading?: boolean;
}

export default function TeacherCreateForm({
    onSubmit,
    onCancel,
    loading = false,
}: TeacherCreateFormProps) {
    const t = useTranslations();
    const [newSpecialization, setNewSpecialization] = useState("");
    const [newQualification, setNewQualification] = useState("");

    const form = useForm<TeacherFormData>({
        resolver: zodResolver(teacherFormSchema),
        defaultValues: {
            teacherId: "",
            name: "",
            email: "",
            phone: "",
            status: "Active",
            verified: false,
            specialization: [],
            qualifications: [],
            experience: 0,
            joinDate: new Date(),
            dateOfBirth: new Date(),
            address: "",
            wilaya: "",
            commune: "",
            classIds: [],
            subjectIds: [],
            studentIds: [],
            salary: 0,
            paymentSchedule: "Monthly",
        },
    });

    const wilayas = algerianWilayas.map(w => ({ value: w, label: w }));
    const statusOptions = [
        { value: "Active", label: "نشط" },
        { value: "Inactive", label: "غير نشط" },
        { value: "On Leave", label: "في إجازة" },
    ];

    const addSpecialization = () => {
        if (newSpecialization.trim()) {
            const current = form.getValues("specialization");
            if (!current.includes(newSpecialization.trim())) {
                form.setValue("specialization", [...current, newSpecialization.trim()]);
            }
            setNewSpecialization("");
        }
    };

    const removeSpecialization = (spec: string) => {
        const current = form.getValues("specialization");
        form.setValue("specialization", current.filter(s => s !== spec));
    };

    const addQualification = () => {
        if (newQualification.trim()) {
            const current = form.getValues("qualifications");
            if (!current.includes(newQualification.trim())) {
                form.setValue("qualifications", [...current, newQualification.trim()]);
            }
            setNewQualification("");
        }
    };

    const removeQualification = (qual: string) => {
        const current = form.getValues("qualifications");
        form.setValue("qualifications", current.filter(q => q !== qual));
    };

    return (
        <BaseForm
            title="إضافة معلم جديد"
            description="أدخل بيانات المعلم الجديد في النظام"
            form={form}
            onSubmit={onSubmit}
            onCancel={onCancel}
            loading={loading}
        >
            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">البيانات الأساسية</TabsTrigger>
                    <TabsTrigger value="professional">البيانات المهنية</TabsTrigger>
                    <TabsTrigger value="personal">البيانات الشخصية</TabsTrigger>
                    <TabsTrigger value="financial">البيانات المالية</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                            control={form.control}
                            name="teacherId"
                            label="رقم المعلم"
                            placeholder="T2025001"
                            required
                        />
                        <TextField
                            control={form.control}
                            name="name"
                            label="الاسم الكامل"
                            placeholder="محمد بن أحمد الجزائري"
                            required
                        />
                        <TextField
                            control={form.control}
                            name="email"
                            label="البريد الإلكتروني"
                            type="email"
                            placeholder="mohammed@example.com"
                            required
                        />
                        <TextField
                            control={form.control}
                            name="phone"
                            label="رقم الهاتف"
                            type="tel"
                            placeholder="+213-555-123-456"
                            required
                        />
                        <SelectField
                            control={form.control}
                            name="status"
                            label="الحالة"
                            options={statusOptions}
                            required
                        />
                    </div>
                </TabsContent>

                <TabsContent value="professional" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">التخصصات *</label>
                            <div className="flex gap-2">
                                <Input
                                    value={newSpecialization}
                                    onChange={(e) => setNewSpecialization(e.target.value)}
                                    placeholder="أضف تخصص"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                                />
                                <Button type="button" onClick={addSpecialization} size="sm">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {form.watch("specialization").map((spec) => (
                                    <Badge key={spec} variant="secondary" className="gap-1">
                                        {spec}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => removeSpecialization(spec)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">المؤهلات *</label>
                            <div className="flex gap-2">
                                <Input
                                    value={newQualification}
                                    onChange={(e) => setNewQualification(e.target.value)}
                                    placeholder="أضف مؤهل"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addQualification())}
                                />
                                <Button type="button" onClick={addQualification} size="sm">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {form.watch("qualifications").map((qual) => (
                                    <Badge key={qual} variant="secondary" className="gap-1">
                                        {qual}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => removeQualification(qual)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <TextField
                            control={form.control}
                            name="experience"
                            label="سنوات الخبرة"
                            type="number"
                            placeholder="5"
                            required
                        />
                        <DateField
                            control={form.control}
                            name="joinDate"
                            label="تاريخ الانضمام"
                            required
                        />
                    </div>
                </TabsContent>

                <TabsContent value="personal" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DateField
                            control={form.control}
                            name="dateOfBirth"
                            label="تاريخ الميلاد"
                            disableFuture
                            required
                        />
                        <SelectField
                            control={form.control}
                            name="wilaya"
                            label="الولاية"
                            options={wilayas}
                            required
                        />
                        <TextField
                            control={form.control}
                            name="commune"
                            label="البلدية"
                            placeholder="بن عكنون"
                            required
                        />
                        <TextareaField
                            control={form.control}
                            name="address"
                            label="العنوان"
                            placeholder="حي بن عكنون، شارع ديدوش مراد، الجزائر العاصمة"
                            className="md:col-span-2"
                            required
                        />
                    </div>
                </TabsContent>

                <TabsContent value="financial" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                            control={form.control}
                            name="salary"
                            label="الراتب (دج)"
                            type="number"
                            placeholder="50000"
                            required
                        />
                        <SelectField
                            control={form.control}
                            name="paymentSchedule"
                            label="جدولة الدفع"
                            options={paymentScheduleOptions}
                            required
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </BaseForm>
    );
}