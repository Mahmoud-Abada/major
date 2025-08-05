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
import { selectParentById, updateParent } from "@/store/slices/classroom/parentsSlice";
import { ParentFormData } from "@/types/classroom";
import { format } from "date-fns";
import {
    ArrowLeft,
    Briefcase,
    CreditCard,
    Edit,
    Heart,
    Mail,
    MapPin,
    Phone,
    User,
    Users
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ParentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const parentId = params.id as string;

    const parent = useSelector((state: any) => selectParentById(state, parentId));
    const [showEditForm, setShowEditForm] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    if (!parent) {
        return (
            <div className="flex items-center justify-center h-64">
                <p>ولي الأمر غير موجود</p>
            </div>
        );
    }

    const handleEditParent = () => {
        setShowEditForm(true);
    };

    const handleSubmitForm = (data: ParentFormData) => {
        dispatch(updateParent({ id: parent.id, data }));
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
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getRelationshipColor = (relationship: string) => {
        switch (relationship) {
            case "Father":
                return "bg-blue-100 text-blue-800";
            case "Mother":
                return "bg-pink-100 text-pink-800";
            case "Guardian":
                return "bg-purple-100 text-purple-800";
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

    const getRelationshipText = (relationship: string) => {
        switch (relationship) {
            case "Father":
                return "والد";
            case "Mother":
                return "والدة";
            case "Guardian":
                return "وصي";
            default:
                return "آخر";
        }
    };

    return (
        <div className="flex flex-col space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        العودة
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{parent.name}</h1>
                        <p className="text-muted-foreground">رقم ولي الأمر: {parent.parentId}</p>
                    </div>
                </div>
                <Button onClick={handleEditParent}>
                    <Edit className="h-4 w-4 mr-2" />
                    تعديل البيانات
                </Button>
            </div>

            {/* Parent Overview Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-start space-x-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={parent.image} alt={parent.name} />
                            <AvatarFallback className="text-lg">
                                {parent.name.split(" ")[0]?.charAt(0)}
                                {parent.name.split(" ")[1]?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center space-x-2">
                                    <Badge className={getStatusColor(parent.status)}>
                                        {parent.status === "Active" ? "نشط" : "غير نشط"}
                                    </Badge>
                                    <Badge className={getRelationshipColor(parent.relationship)}>
                                        {getRelationshipText(parent.relationship)}
                                    </Badge>
                                    {parent.verified && (
                                        <Badge variant="outline" className="text-green-600">
                                            موثق
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    <span>{parent.email}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                    <span>{parent.phone}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <Briefcase className="h-4 w-4" />
                                    <span>{parent.occupation}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>{parent.wilaya}, {parent.commune}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span>{parent.studentIds.length} أطفال</span>
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
                    <TabsTrigger value="children">الأطفال</TabsTrigger>
                    <TabsTrigger value="payments">المدفوعات</TabsTrigger>
                    <TabsTrigger value="personal">البيانات الشخصية</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Children Count */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">عدد الأطفال</CardTitle>
                                <Heart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="text-2xl font-bold">{parent.studentIds.length}</div>
                                    <p className="text-xs text-muted-foreground">
                                        طفل مسجل
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Financial Status */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">الحالة المالية</CardTitle>
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span>إجمالي الرسوم</span>
                                        <span className="font-medium">{parent.totalFees.toLocaleString()} دج</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>المدفوع</span>
                                        <span className="font-medium text-green-600">{parent.paidAmount.toLocaleString()} دج</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>المتبقي</span>
                                        <span className="font-medium text-red-600">{parent.pendingAmount.toLocaleString()} دج</span>
                                    </div>
                                    <Progress
                                        value={(parent.paidAmount / parent.totalFees) * 100}
                                        className="h-2"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Relationship */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">صلة القرابة</CardTitle>
                                <User className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="text-2xl font-bold">{getRelationshipText(parent.relationship)}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {parent.occupation}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Children Tab */}
                <TabsContent value="children" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>الأطفال المسجلون</CardTitle>
                            <CardDescription>
                                جميع الأطفال المرتبطين بولي الأمر
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">
                                        {parent.studentIds.length > 0
                                            ? `لديه ${parent.studentIds.length} أطفال مسجلين`
                                            : "لا يوجد أطفال مسجلون"
                                        }
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
                                جميع المدفوعات والرسوم المتعلقة بولي الأمر
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {parent.payments.length > 0 ? (
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
                                        {parent.payments.map((payment) => (
                                            <TableRow key={payment.id}>
                                                <TableCell className="font-medium">{payment.paymentId}</TableCell>
                                                <TableCell>{payment.amount.toLocaleString()} {payment.currency}</TableCell>
                                                <TableCell>
                                                    <Badge className={getPaymentStatusColor(payment.status)}>
                                                        {payment.status === "Paid" ? "مدفوع" :
                                                            payment.status === "Pending" ? "معلق" : "متأخر"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{format(new Date(payment.dueDate), "dd/MM/yyyy")}</TableCell>
                                                <TableCell>
                                                    {payment.paymentDate ? format(new Date(payment.paymentDate), "dd/MM/yyyy") : "-"}
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
                                    <label className="text-sm font-medium text-muted-foreground">تاريخ الميلاد</label>
                                    <p className="text-sm">{format(new Date(parent.dateOfBirth), "dd/MM/yyyy")}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">المهنة</label>
                                    <p className="text-sm">{parent.occupation}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">الولاية</label>
                                    <p className="text-sm">{parent.wilaya}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">البلدية</label>
                                    <p className="text-sm">{parent.commune}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-muted-foreground">العنوان</label>
                                    <p className="text-sm">{parent.address}</p>
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
                        <DialogTitle>تعديل بيانات ولي الأمر</DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                        <p>Parent form will be implemented...</p>
                        <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" onClick={handleCancelForm}>
                                إلغاء
                            </Button>
                            <Button onClick={() => handleSubmitForm({} as ParentFormData)}>
                                حفظ
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}