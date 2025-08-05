"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Clock, DollarSign, MapPin, Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define the schema based on backend ClassroomType
const classroomSchema = z.object({
    title: z.string().min(1, "العنوان مطلوب"),
    description: z.string().optional(),
    field: z.string().min(1, "المجال مطلوب"),
    level: z.string().min(1, "المستوى مطلوب"),
    color: z.string().min(1, "اللون مطلوب"),
    maxStudents: z.number().min(1, "الحد الأقصى للطلاب يجب أن يكون على الأقل 1").optional(),
    price: z.number().min(0, "السعر يجب أن يكون موجباً"),
    mode: z.enum(["monthly", "sessional", "semestrial"]),
    perEach: z.number().optional(),
    frontPicture: z.string().url().optional().or(z.literal("")),
    backPicture: z.string().url().optional().or(z.literal("")),
    majors: z.array(z.string()).default([]),
});

type ClassroomFormData = z.infer<typeof classroomSchema>;

const FIELDS = [
    "الرياضيات", "الفيزياء", "الكيمياء", "العلوم الطبيعية", "اللغة الفرنسية",
    "اللغة العربية", "اللغة الإنجليزية", "التاريخ", "الجغرافيا", "الفلسفة",
    "الإعلام الآلي", "اللغات", "الأدب"
];

const LEVELS = [
    "الابتدائي", "المتوسط", "الثانوي", "الجامعي"
];

const DAYS = [
    { value: "الاثنين", label: "الاثنين" },
    { value: "الثلاثاء", label: "الثلاثاء" },
    { value: "الأربعاء", label: "الأربعاء" },
    { value: "الخميس", label: "الخميس" },
    { value: "الجمعة", label: "الجمعة" },
    { value: "السبت", label: "السبت" },
    { value: "الأحد", label: "الأحد" }
];

const COLORS = [
    "#3498db", "#2ecc71", "#e74c3c", "#f39c12", "#9b59b6",
    "#1abc9c", "#34495e", "#e67e22", "#95a5a6", "#8e44ad"
];

const WILAYAS = [
    "الجزائر", "وهران", "قسنطينة", "باتنة", "سطيف", "عنابة", "تلمسان", "غرداية",
    "البليدة", "الشلف", "تيزي وزو", "بجاية", "ورقلة", "أدرار", "الأغواط"
];

interface ClassroomCreateFormProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
    loading?: boolean;
}

export default function ClassroomCreateForm({
    onSubmit,
    onCancel,
    loading = false,
}: ClassroomCreateFormProps) {
    const [schedule, setSchedule] = useState<Array<{ day: string; startTime: string; endTime: string }>>([]);
    const [location, setLocation] = useState<{
        fullLocation?: string;
        coordinates: { lat: number; long: number };
        wilaya: string;
        commune: string;
    } | null>(null);
    const [semesters, setSemesters] = useState<Array<{
        semester: string;
        price: number;
        startDate: number;
        endDate: number;
    }>>([]);

    const form = useForm<ClassroomFormData>({
        resolver: zodResolver(classroomSchema),
        defaultValues: {
            title: "",
            description: "",
            field: "",
            level: "",
            color: COLORS[0],
            price: 0,
            mode: "monthly",
            frontPicture: "",
            backPicture: "",
            majors: [],
        }
    });

    const watchedMode = form.watch("mode");

    const addScheduleItem = () => {
        setSchedule([...schedule, { day: "", startTime: "", endTime: "" }]);
    };

    const removeScheduleItem = (index: number) => {
        setSchedule(schedule.filter((_, i) => i !== index));
    };

    const updateScheduleItem = (index: number, field: string, value: string) => {
        const updated = [...schedule];
        updated[index] = { ...updated[index], [field]: value };
        setSchedule(updated);
    };

    const addSemester = () => {
        setSemesters([...semesters, {
            semester: "",
            price: 0,
            startDate: Date.now(),
            endDate: Date.now() + (90 * 24 * 60 * 60 * 1000) // 3 months later
        }]);
    };

    const removeSemester = (index: number) => {
        setSemesters(semesters.filter((_, i) => i !== index));
    };

    const updateSemester = (index: number, field: string, value: any) => {
        const updated = [...semesters];
        updated[index] = { ...updated[index], [field]: value };
        setSemesters(updated);
    };

    const handleSubmit = async (data: ClassroomFormData) => {
        if (!location) {
            alert("يرجى اختيار الموقع");
            return;
        }

        if (schedule.length === 0) {
            alert("يرجى إضافة جدول زمني واحد على الأقل");
            return;
        }

        if (data.mode === "semestrial" && semesters.length === 0) {
            alert("يرجى إضافة فصل دراسي واحد على الأقل للنمط الفصلي");
            return;
        }

        const classroomData = {
            ...data,
            location,
            schedule,
            isArchived: false,
            ...(data.mode === "semestrial" && { perSemester: semesters }),
            ...(data.frontPicture === "" && { frontPicture: undefined }),
            ...(data.backPicture === "" && { backPicture: undefined })
        };

        onSubmit({ classroomsData: classroomData });
    };

    return (
        <div className="container mx-auto py-6 max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" onClick={onCancel}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    رجوع
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">إنشاء فصل دراسي</h1>
                    <p className="text-muted-foreground">إعداد فصل دراسي جديد مع الجدول والتسعير</p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>المعلومات الأساسية</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>العنوان *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="مثال: الرياضيات - أساسيات الجبر" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="field"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>المجال *</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="اختر المجال" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {FIELDS.map(fieldOption => (
                                                        <SelectItem key={fieldOption} value={fieldOption}>
                                                            {fieldOption}
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
                                    name="level"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>المستوى *</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="اختر المستوى" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {LEVELS.map(level => (
                                                        <SelectItem key={level} value={level}>
                                                            {level}
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
                                    name="maxStudents"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>الحد الأقصى للطلاب</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="30"
                                                    {...field}
                                                    onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>الوصف</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="وصف محتوى وأهداف الفصل الدراسي..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="frontPicture"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>رابط الصورة الأمامية</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://example.com/image.jpg" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="backPicture"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>رابط الصورة الخلفية</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://example.com/image.jpg" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>لون الموضوع</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-2 flex-wrap">
                                                {COLORS.map(color => (
                                                    <button
                                                        key={color}
                                                        type="button"
                                                        className={`w-8 h-8 rounded-full border-2 ${field.value === color ? 'border-foreground' : 'border-muted'
                                                            }`}
                                                        style={{ backgroundColor: color }}
                                                        onClick={() => field.onChange(color)}
                                                    />
                                                ))}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Location */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                الموقع
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">الولاية *</label>
                                        <Select onValueChange={(value) => setLocation(prev => ({ 
                                            ...prev!, 
                                            wilaya: value,
                                            coordinates: prev?.coordinates || { lat: 36.7538, long: 3.0588 }
                                        }))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="اختر الولاية" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {WILAYAS.map(wilaya => (
                                                    <SelectItem key={wilaya} value={wilaya}>
                                                        {wilaya}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">البلدية *</label>
                                        <Input
                                            placeholder="أدخل البلدية"
                                            onChange={(e) => setLocation(prev => ({ 
                                                ...prev!, 
                                                commune: e.target.value,
                                                coordinates: prev?.coordinates || { lat: 36.7538, long: 3.0588 }
                                            }))}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">العنوان الكامل</label>
                                    <Input
                                        placeholder="العنوان التفصيلي"
                                        onChange={(e) => setLocation(prev => ({
                                            ...prev!,
                                            fullLocation: e.target.value,
                                            coordinates: prev?.coordinates || { lat: 36.7538, long: 3.0588 },
                                            wilaya: prev?.wilaya || "",
                                            commune: prev?.commune || ""
                                        }))}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Schedule */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    الجدول الزمني
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={addScheduleItem}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    إضافة حصة
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {schedule.map((item, index) => (
                                <div key={index} className="flex gap-4 items-end p-4 border rounded-lg">
                                    <div className="flex-1">
                                        <label className="text-sm font-medium">اليوم</label>
                                        <Select
                                            value={item.day}
                                            onValueChange={(value) => updateScheduleItem(index, 'day', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="اختر اليوم" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DAYS.map(day => (
                                                    <SelectItem key={day.value} value={day.value}>
                                                        {day.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex-1">
                                        <label className="text-sm font-medium">وقت البداية</label>
                                        <Input
                                            type="time"
                                            value={item.startTime}
                                            onChange={(e) => updateScheduleItem(index, 'startTime', e.target.value)}
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <label className="text-sm font-medium">وقت النهاية</label>
                                        <Input
                                            type="time"
                                            value={item.endTime}
                                            onChange={(e) => updateScheduleItem(index, 'endTime', e.target.value)}
                                        />
                                    </div>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeScheduleItem(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}

                            {schedule.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    لم يتم إضافة أي جدول زمني. انقر على "إضافة حصة" للبدء.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                التسعير
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="mode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>نمط الدفع</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="monthly">شهري</SelectItem>
                                                <SelectItem value="sessional">لكل حصة</SelectItem>
                                                <SelectItem value="semestrial">فصلي</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {watchedMode !== "semestrial" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>السعر (دج)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="4000"
                                                        {...field}
                                                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="perEach"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {watchedMode === "monthly" ? "المدة (أيام)" : "عدد الحصص"}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder={watchedMode === "monthly" ? "30" : "10"}
                                                        {...field}
                                                        onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                            {watchedMode === "semestrial" && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-medium">الفصول الدراسية</h4>
                                        <Button type="button" variant="outline" size="sm" onClick={addSemester}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            إضافة فصل
                                        </Button>
                                    </div>

                                    {semesters.map((semester, index) => (
                                        <div key={index} className="p-4 border rounded-lg space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h5 className="font-medium">الفصل {index + 1}</h5>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeSemester(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium">اسم الفصل</label>
                                                    <Input
                                                        placeholder="الفصل الأول 2025"
                                                        value={semester.semester}
                                                        onChange={(e) => updateSemester(index, 'semester', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">السعر (دج)</label>
                                                    <Input
                                                        type="number"
                                                        placeholder="8000"
                                                        value={semester.price}
                                                        onChange={(e) => updateSemester(index, 'price', parseFloat(e.target.value) || 0)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">تاريخ البداية</label>
                                                    <Input
                                                        type="date"
                                                        value={new Date(semester.startDate).toISOString().split('T')[0]}
                                                        onChange={(e) => updateSemester(index, 'startDate', new Date(e.target.value).getTime())}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {semesters.length === 0 && (
                                        <div className="text-center py-8 text-muted-foreground">
                                            لم يتم إضافة أي فصل دراسي. انقر على "إضافة فصل" للبدء.
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            إلغاء
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "جاري الإنشاء..." : "إنشاء الفصل"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}