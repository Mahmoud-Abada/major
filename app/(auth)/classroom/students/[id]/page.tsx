"use client";

import StudentForm from "@/components/classroom/forms/StudentForm";
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
import { Progress } from "@/components/ui/progress";
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
  selectStudentById,
  updateStudent,
} from "@/store/slices/classroom/studentsSlice";
import { StudentFormData } from "@/types/classroom";
import { format } from "date-fns";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CreditCard,
  Edit,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  TrendingUp,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const studentId = params.id as string;

  const student = useSelector((state: any) =>
    selectStudentById(state, studentId),
  );
  const [showEditForm, setShowEditForm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  if (!student) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>الطالب غير موجود</p>
      </div>
    );
  }

  const handleEditStudent = () => {
    setShowEditForm(true);
  };

  const handleSubmitForm = (data: StudentFormData) => {
    dispatch(updateStudent({ id: student.id, data }));
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
      case "Suspended":
        return "bg-red-100 text-red-800";
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
            <h1 className="text-2xl font-bold">{student.name}</h1>
            <p className="text-muted-foreground">
              رقم الطالب: {student.studentId}
            </p>
          </div>
        </div>
        <Button onClick={handleEditStudent}>
          <Edit className="h-4 w-4 mr-2" />
          تعديل البيانات
        </Button>
      </div>

      {/* Student Overview Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={student.image} alt={student.name} />
              <AvatarFallback className="text-lg">
                {student.name.split(" ")[0]?.charAt(0)}
                {student.name.split(" ")[1]?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(student.status)}>
                    {student.status === "Active"
                      ? "نشط"
                      : student.status === "Inactive"
                        ? "غير نشط"
                        : "موقوف"}
                  </Badge>
                  {student.verified && (
                    <Badge variant="outline" className="text-green-600">
                      موثق
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{student.phone}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  <span>
                    {student.grade} - {student.class}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {student.wilaya}, {student.commune}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    انضم في{" "}
                    {format(new Date(student.enrollmentDate), "dd/MM/yyyy")}
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
          <TabsTrigger value="academic">الأكاديمي</TabsTrigger>
          <TabsTrigger value="payments">المدفوعات</TabsTrigger>
          <TabsTrigger value="personal">البيانات الشخصية</TabsTrigger>
          <TabsTrigger value="emergency">جهة الاتصال</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Academic Performance */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  الأداء الأكاديمي
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>المعدل العام</span>
                      <span className="font-medium">{student.gpa}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>نسبة الحضور</span>
                      <span className="font-medium">{student.attendance}</span>
                    </div>
                    <Progress
                      value={parseInt(
                        student.attendance?.replace("%", "") || "0",
                      )}
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Status */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  الحالة المالية
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>إجمالي الرسوم</span>
                    <span className="font-medium">
                      {student.totalFees.toLocaleString()} دج
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>المدفوع</span>
                    <span className="font-medium text-green-600">
                      {student.paidAmount.toLocaleString()} دج
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>المتبقي</span>
                    <span className="font-medium text-red-600">
                      {student.pendingAmount.toLocaleString()} دج
                    </span>
                  </div>
                  <Progress
                    value={(student.paidAmount / student.totalFees) * 100}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Classes */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  الفصول المسجل بها
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {student.classIds.length}
                  </div>
                  <p className="text-xs text-muted-foreground">فصل دراسي نشط</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Academic Tab */}
        <TabsContent value="academic" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>المعلومات الأكاديمية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      المستوى الدراسي
                    </label>
                    <p className="text-sm">{student.grade}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      الفصل
                    </label>
                    <p className="text-sm">{student.class}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      السنة الدراسية
                    </label>
                    <p className="text-sm">{student.academicYear}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      تاريخ التسجيل
                    </label>
                    <p className="text-sm">
                      {format(new Date(student.enrollmentDate), "dd/MM/yyyy")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      المعدل العام
                    </label>
                    <p className="text-sm">{student.gpa}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      نسبة الحضور
                    </label>
                    <p className="text-sm">{student.attendance}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الأساتذة والفصول</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      عدد الفصول
                    </label>
                    <p className="text-sm">{student.classIds.length} فصل</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      عدد الأساتذة
                    </label>
                    <p className="text-sm">{student.teacherIds.length} أستاذ</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>سجل المدفوعات</CardTitle>
              <CardDescription>
                جميع المدفوعات والرسوم المتعلقة بالطالب
              </CardDescription>
            </CardHeader>
            <CardContent>
              {student.payments.length > 0 ? (
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
                    {student.payments.map((payment) => (
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
                    {format(new Date(student.dateOfBirth), "dd/MM/yyyy")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    الولاية
                  </label>
                  <p className="text-sm">{student.wilaya}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    البلدية
                  </label>
                  <p className="text-sm">{student.commune}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    العنوان
                  </label>
                  <p className="text-sm">{student.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Contact Tab */}
        <TabsContent value="emergency" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>جهة الاتصال في حالات الطوارئ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    الاسم
                  </label>
                  <p className="text-sm">{student.emergencyContact.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    رقم الهاتف
                  </label>
                  <p className="text-sm">{student.emergencyContact.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    صلة القرابة
                  </label>
                  <p className="text-sm">
                    {student.emergencyContact.relationship}
                  </p>
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
            <DialogTitle>تعديل بيانات الطالب</DialogTitle>
          </DialogHeader>
          <StudentForm
            student={student}
            onSubmit={handleSubmitForm}
            onCancel={handleCancelForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
