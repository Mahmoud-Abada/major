"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  selectTeacherById,
  updateTeacher,
} from "@/store/slices/classroom/teachersSlice";
import { TeacherFormData } from "@/types/classroom";
import { format } from "date-fns";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  CreditCard,
  Edit,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function TeacherDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const teacherId = params.id as string;

  const teacher = useSelector((state: any) =>
    selectTeacherById(state, teacherId),
  );
  const [showEditForm, setShowEditForm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  if (!teacher) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>الأستاذ غير موجود</p>
      </div>
    );
  }

  const handleEditTeacher = () => {
    setShowEditForm(true);
  };

  const handleSubmitForm = (data: TeacherFormData) => {
    dispatch(updateTeacher({ id: teacher.id, data }));
    setShowEditForm(false);
  };

  const handleCancelForm = () => {
    setShowEditForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "On Leave":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            العودة
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{teacher.name}</h1>
            <p className="text-muted-foreground">
              رقم الأستاذ: {teacher.teacherId}
            </p>
          </div>
        </div>
        <Button onClick={handleEditTeacher}>
          <Edit className="h-4 w-4 mr-2" />
          تعديل البيانات
        </Button>
      </div>

      {/* Teacher Overview Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={teacher.image} alt={teacher.name} />
              <AvatarFallback className="text-lg">
                {teacher.name.split(" ")[0]?.charAt(0)}
                {teacher.name.split(" ")[1]?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(teacher.status)}>
                    {teacher.status === "Active"
                      ? "نشط"
                      : teacher.status === "Inactive"
                        ? "غير نشط"
                        : "في إجازة"}
                  </Badge>
                  {teacher.verified && (
                    <Badge variant="outline" className="text-green-600">
                      موثق
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{teacher.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{teacher.phone}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>{teacher.experience} سنة خبرة</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {teacher.wilaya}, {teacher.commune}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    انضم في {format(new Date(teacher.joinDate), "dd/MM/yyyy")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="professional">المهني</TabsTrigger>
          <TabsTrigger value="classes">الفصول</TabsTrigger>
          <TabsTrigger value="payments">المدفوعات</TabsTrigger>
          <TabsTrigger value="personal">البيانات الشخصية</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Experience */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  الخبرة المهنية
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold">
                    {teacher.experience} سنة
                  </div>
                  <p className="text-xs text-muted-foreground">
                    منذ {format(new Date(teacher.joinDate), "yyyy")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Salary */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  الراتب الشهري
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold">
                    {teacher.salary.toLocaleString()} دج
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {teacher.paymentSchedule === "Monthly"
                      ? "شهرياً"
                      : teacher.paymentSchedule === "Weekly"
                        ? "أسبوعياً"
                        : "لكل جلسة"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Classes */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  الفصول المُدرَّسة
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold">
                    {teacher.classIds.length}
                  </div>
                  <p className="text-xs text-muted-foreground">فصل نشط</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Professional Tab */}
        <TabsContent value="professional" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>التخصصات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {teacher.specialization.map((spec, index) => (
                    <Badge key={index} variant="secondary">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>المؤهلات العلمية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teacher.qualifications.map((qual, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <GraduationCap className="h-4 w-4 mt-1 text-muted-foreground" />
                      <span className="text-sm">{qual}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>معلومات مهنية إضافية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    سنوات الخبرة
                  </label>
                  <p className="text-sm">{teacher.experience} سنة</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    تاريخ الانضمام
                  </label>
                  <p className="text-sm">
                    {format(new Date(teacher.joinDate), "dd/MM/yyyy")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    عدد المواد
                  </label>
                  <p className="text-sm">{teacher.subjectIds.length} مادة</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    عدد الطلاب
                  </label>
                  <p className="text-sm">{teacher.studentIds.length} طالب</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Classes Tab */}
        <TabsContent value="classes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>الفصول المُدرَّسة</CardTitle>
              <CardDescription>جميع الفصول التي يدرسها الأستاذ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {teacher.classIds.length > 0
                      ? `يدرس ${teacher.classIds.length} فصل`
                      : "لا يدرس أي فصل حالياً"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>سجل المدفوعات</CardTitle>
              <CardDescription>
                جميع المدفوعات والرواتب المتعلقة بالأستاذ
              </CardDescription>
            </CardHeader>
            <CardContent>
              {teacher.payments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم الدفعة</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>تاريخ الاستحقاق</TableHead>
                      <TableHead>تاريخ الدفع</TableHead>
                      <TableHead>الوصف</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacher.payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {payment.paymentId}
                        </TableCell>
                        <TableCell>
                          {payment.amount.toLocaleString()} {payment.currency}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getPaymentStatusColor(payment.status)}
                          >
                            {payment.status === "Paid"
                              ? "مدفوع"
                              : payment.status === "Pending"
                                ? "معلق"
                                : "متأخر"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(payment.dueDate), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>
                          {payment.paymentDate
                            ? format(
                                new Date(payment.paymentDate),
                                "dd/MM/yyyy",
                              )
                            : "-"}
                        </TableCell>
                        <TableCell>{payment.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">لا توجد مدفوعات مسجلة</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>البيانات الشخصية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    تاريخ الميلاد
                  </label>
                  <p className="text-sm">
                    {format(new Date(teacher.dateOfBirth), "dd/MM/yyyy")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    الولاية
                  </label>
                  <p className="text-sm">{teacher.wilaya}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    البلدية
                  </label>
                  <p className="text-sm">{teacher.commune}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    العنوان
                  </label>
                  <p className="text-sm">{teacher.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Form Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل بيانات الأستاذ</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>Teacher form will be implemented...</p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={handleCancelForm}>
                إلغاء
              </Button>
              <Button onClick={() => handleSubmitForm({} as TeacherFormData)}>
                حفظ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
