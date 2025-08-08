"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  StudentFormData,
  algerianWilayas,
  gradeOptions,
  relationshipOptions,
  statusOptions,
  studentFormSchema,
} from "@/lib/validations/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import BaseForm from "./BaseForm";
import { DateField, SelectField, TextField, TextareaField } from "./FormField";

interface StudentCreateFormProps {
  onSubmit: (data: StudentFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function StudentCreateForm({
  onSubmit,
  onCancel,
  loading = false,
}: StudentCreateFormProps) {
  const t = useTranslations();

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      studentId: "",
      name: "",
      email: "",
      phone: "",
      status: "Active",
      verified: false,
      grade: "",
      class: "",
      academicYear: "2024-2025",
      enrollmentDate: new Date(),
      dateOfBirth: new Date(),
      address: "",
      wilaya: "",
      commune: "",
      emergencyContact: {
        name: "",
        phone: "",
        relationship: "",
      },
      gpa: "",
      attendance: "",
      parentId: "",
      classIds: [],
      teacherIds: [],
      totalFees: 0,
      paidAmount: 0,
      pendingAmount: 0,
    },
  });

  const wilayas = algerianWilayas.map((w) => ({ value: w, label: w }));

  return (
    <BaseForm
      title="إضافة طالب جديد"
      description="أدخل بيانات الطالب الجديد في النظام"
      form={form}
      onSubmit={onSubmit}
      onCancel={onCancel}
      loading={loading}
    >
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">البيانات الأساسية</TabsTrigger>
          <TabsTrigger value="academic">البيانات الأكاديمية</TabsTrigger>
          <TabsTrigger value="personal">البيانات الشخصية</TabsTrigger>
          <TabsTrigger value="emergency">جهة الاتصال</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              control={form.control}
              name="studentId"
              label="رقم الطالب"
              placeholder="S2025001"
              required
            />
            <TextField
              control={form.control}
              name="name"
              label="الاسم الكامل"
              placeholder="أحمد بن علي الوهراني"
              required
            />
            <TextField
              control={form.control}
              name="email"
              label="البريد الإلكتروني"
              type="email"
              placeholder="ahmed@example.com"
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

        <TabsContent value="academic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              control={form.control}
              name="grade"
              label="المستوى الدراسي"
              options={gradeOptions}
              required
            />
            <TextField
              control={form.control}
              name="class"
              label="الفصل"
              placeholder="3ع ت أ"
              required
            />
            <TextField
              control={form.control}
              name="academicYear"
              label="السنة الدراسية"
              placeholder="2024-2025"
              required
            />
            <DateField
              control={form.control}
              name="enrollmentDate"
              label="تاريخ التسجيل"
              required
            />
            <TextField
              control={form.control}
              name="gpa"
              label="المعدل العام"
              placeholder="16.2/20"
            />
            <TextField
              control={form.control}
              name="attendance"
              label="نسبة الحضور"
              placeholder="92%"
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

        <TabsContent value="emergency" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              control={form.control}
              name="emergencyContact.name"
              label="اسم جهة الاتصال"
              placeholder="علي بن محمد الوهراني"
              required
            />
            <TextField
              control={form.control}
              name="emergencyContact.phone"
              label="رقم هاتف جهة الاتصال"
              type="tel"
              placeholder="+213-555-123-400"
              required
            />
            <SelectField
              control={form.control}
              name="emergencyContact.relationship"
              label="صلة القرابة"
              options={relationshipOptions}
              required
            />
          </div>
        </TabsContent>
      </Tabs>
    </BaseForm>
  );
}
