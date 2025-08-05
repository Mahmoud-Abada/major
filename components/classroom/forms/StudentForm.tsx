"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Student, StudentFormData } from "@/types/classroom";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const studentSchema = z.object({
    studentId: z.string().min(1, "Student ID is required"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    status: z.enum(["Active", "Inactive", "Suspended"]),
    verified: z.boolean(),
    grade: z.string().min(1, "Grade is required"),
    class: z.string().min(1, "Class is required"),
    academicYear: z.string().min(1, "Academic year is required"),
    enrollmentDate: z.date(),
    dateOfBirth: z.date(),
    address: z.string().min(5, "Address must be at least 5 characters"),
    wilaya: z.string().min(1, "Wilaya is required"),
    commune: z.string().min(1, "Commune is required"),
    emergencyContact: z.object({
        name: z.string().min(2, "Emergency contact name is required"),
        phone: z.string().min(10, "Emergency contact phone is required"),
        relationship: z.string().min(1, "Relationship is required"),
    }),
    gpa: z.string().optional(),
    attendance: z.string().optional(),
    parentId: z.string().optional(),
    classIds: z.array(z.string()).default([]),
    teacherIds: z.array(z.string()).default([]),
    totalFees: z.number().min(0).default(0),
    paidAmount: z.number().min(0).default(0),
    pendingAmount: z.number().min(0).default(0),
    payments: z.array(z.any()).default([]),
});

interface StudentFormProps {
    student?: Student;
    onSubmit: (data: StudentFormData) => void;
    onCancel: () => void;
    loading?: boolean;
}

const algerianWilayas = [
    "الجزائر", "وهران", "قسنطينة", "باتنة", "سطيف", "عنابة", "تلمسان", "غرداية",
    "البليدة", "الشلف", "تيزي وزو", "بجاية", "ورقلة", "أدرار", "الأغواط"
];

export default function StudentForm({ student, onSubmit, onCancel, loading }: StudentFormProps) {
    const [activeTab, setActiveTab] = useState("basic");

    const form = useForm<z.infer<typeof studentSchema>>({
        resolver: zodResolver(studentSchema),
        defaultValues: student ? {
            studentId: student.studentId,
            name: student.name,
            email: student.email,
            phone: student.phone,
            status: student.status,
            verified: student.verified,
            grade: student.grade,
            class: student.class,
            academicYear: student.academicYear,
            enrollmentDate: student.enrollmentDate,
            dateOfBirth: student.dateOfBirth,
            address: student.address,
            wilaya: student.wilaya,
            commune: student.commune,
            emergencyContact: student.emergencyContact,
            gpa: student.gpa,
            attendance: student.attendance,
            parentId: student.parentId,
            classIds: student.classIds,
            teacherIds: student.teacherIds,
            totalFees: student.totalFees,
            paidAmount: student.paidAmount,
            pendingAmount: student.pendingAmount,
            payments: student.payments,
        } : {
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
            payments: [],
        },
    });

    const handleSubmit = (data: z.infer<typeof studentSchema>) => {
        onSubmit(data as StudentFormData);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>
                        {student ? "تعديل بيانات الطالب" : "إضافة طالب جديد"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="basic">البيانات الأساسية</TabsTrigger>
                                    <TabsTrigger value="academic">البيانات الأكاديمية</TabsTrigger>
                                    <TabsTrigger value="personal">البيانات الشخصية</TabsTrigger>
                                    <TabsTrigger value="emergency">جهة الاتصال</TabsTrigger>
                                </TabsList>

                                <TabsContent value="basic" className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="studentId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>رقم الطالب</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="S2025001" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>الاسم الكامل</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="أحمد بن علي الوهراني" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>البريد الإلكتروني</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder="ahmed@example.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>رقم الهاتف</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="+213-555-123-456" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="status"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>الحالة</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="اختر الحالة" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Active">نشط</SelectItem>
                                                            <SelectItem value="Inactive">غير نشط</SelectItem>
                                                            <SelectItem value="Suspended">موقوف</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="academic" className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="grade"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>المستوى الدراسي</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="اختر المستوى" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="الأولى ثانوي">الأولى ثانوي</SelectItem>
                                                            <SelectItem value="الثانية ثانوي">الثانية ثانوي</SelectItem>
                                                            <SelectItem value="الثالثة ثانوي">الثالثة ثانوي</SelectItem>
                                                            <SelectItem value="الجامعي">الجامعي</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="class"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>الفصل</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="3ع ت أ" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="academicYear"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>السنة الدراسية</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="2024-2025" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="enrollmentDate"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>تاريخ التسجيل</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={cn(
                                                                        "w-full pl-3 text-left font-normal",
                                                                        !field.value && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    {field.value ? (
                                                                        format(field.value, "PPP")
                                                                    ) : (
                                                                        <span>اختر التاريخ</span>
                                                                    )}
                                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                disabled={(date) =>
                                                                    date > new Date() || date < new Date("1900-01-01")
                                                                }
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="gpa"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>المعدل العام</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="16.2/20" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="attendance"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>نسبة الحضور</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="92%" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="personal" className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="dateOfBirth"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>تاريخ الميلاد</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={cn(
                                                                        "w-full pl-3 text-left font-normal",
                                                                        !field.value && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    {field.value ? (
                                                                        format(field.value, "PPP")
                                                                    ) : (
                                                                        <span>اختر التاريخ</span>
                                                                    )}
                                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                disabled={(date) =>
                                                                    date > new Date() || date < new Date("1900-01-01")
                                                                }
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="wilaya"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>الولاية</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="اختر الولاية" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {algerianWilayas.map((wilaya) => (
                                                                <SelectItem key={wilaya} value={wilaya}>
                                                                    {wilaya}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="commune"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>البلدية</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="بن عكنون" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="address"
                                            render={({ field }) => (
                                                <FormItem className="md:col-span-2">
                                                    <FormLabel>العنوان</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="حي بن عكنون، شارع ديدوش مراد، الجزائر العاصمة"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="emergency" className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="emergencyContact.name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>اسم جهة الاتصال</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="علي بن محمد الوهراني" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="emergencyContact.phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>رقم هاتف جهة الاتصال</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="+213-555-123-400" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="emergencyContact.relationship"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>صلة القرابة</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="اختر صلة القرابة" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="والد">والد</SelectItem>
                                                            <SelectItem value="والدة">والدة</SelectItem>
                                                            <SelectItem value="وصي">وصي</SelectItem>
                                                            <SelectItem value="أخ">أخ</SelectItem>
                                                            <SelectItem value="أخت">أخت</SelectItem>
                                                            <SelectItem value="آخر">آخر</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={onCancel}>
                                    إلغاء
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "جاري الحفظ..." : student ? "تحديث" : "إضافة"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}