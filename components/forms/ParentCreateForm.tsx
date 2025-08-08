"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ParentFormData,
  algerianWilayas,
  parentFormSchema,
  relationshipOptions,
} from "@/lib/validations/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import BaseForm from "./BaseForm";
import { DateField, SelectField, TextField, TextareaField } from "./FormField";

interface ParentCreateFormProps {
  onSubmit: (data: ParentFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ParentCreateForm({
  onSubmit,
  onCancel,
  loading = false,
}: ParentCreateFormProps) {
  const t = useTranslations();

  const form = useForm<ParentFormData>({
    resolver: zodResolver(parentFormSchema),
    defaultValues: {
      parentId: "",
      name: "",
      email: "",
      phone: "",
      status: "Active",
      verified: false,
      dateOfBirth: new Date(),
      address: "",
      wilaya: "",
      commune: "",
      occupation: "",
      studentIds: [],
      relationship: "Father",
      totalFees: 0,
      paidAmount: 0,
      pendingAmount: 0,
    },
  });

  const wilayas = algerianWilayas.map((w) => ({ value: w, label: w }));
  const statusOptions = [
    { value: "Active", label: "نشط" },
    { value: "Inactive", label: "غير نشط" },
  ];

  return (
    <BaseForm
      title="إضافة ولي أمر جديد"
      description="أدخل بيانات ولي الأمر الجديد في النظام"
      form={form}
      onSubmit={onSubmit}
      onCancel={onCancel}
      loading={loading}
    >
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">البيانات الأساسية</TabsTrigger>
          <TabsTrigger value="personal">البيانات الشخصية</TabsTrigger>
          <TabsTrigger value="relationship">العلاقة العائلية</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              control={form.control}
              name="parentId"
              label="رقم ولي الأمر"
              placeholder="P2025001"
              required
            />
            <TextField
              control={form.control}
              name="name"
              label="الاسم الكامل"
              placeholder="علي بن محمد الوهراني"
              required
            />
            <TextField
              control={form.control}
              name="email"
              label="البريد الإلكتروني"
              type="email"
              placeholder="ali@example.com"
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
            <TextField
              control={form.control}
              name="occupation"
              label="المهنة"
              placeholder="مهندس"
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

        <TabsContent value="relationship" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              control={form.control}
              name="relationship"
              label="صلة القرابة"
              options={relationshipOptions}
              required
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">ملاحظات إضافية</label>
              <TextareaField
                control={form.control}
                name="address"
                label=""
                placeholder="أي معلومات إضافية حول العلاقة العائلية..."
                rows={3}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </BaseForm>
  );
}
