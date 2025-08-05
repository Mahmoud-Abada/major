"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    RiAddLine,
    RiAlarmWarningLine,
    RiBankLine,
    RiCheckLine,
    RiCloseLine,
    RiDeleteBinLine,
    RiEditLine,
    RiEyeLine,
    RiFileExcel2Line,
    RiMailLine,
    RiMoneyDollarCircleLine,
    RiPrinterLine,
    RiReceiptLine,
    RiTimeLine
} from "@remixicon/react";
import { useState } from "react";
import { CreatePaymentDialog } from "./create-payment-dialog";
import {
    mockClassPaymentOverview,
    mockPaymentPlans,
    mockPayments,
    mockStudentPaymentSummary
} from "./mock-data";
import { PaymentDetailsDialog } from "./payment-details-dialog";
import { PaymentStats } from "./payment-stats";
import { ProcessPaymentDialog } from "./process-payment-dialog";
import type {
    ClassPaymentOverview,
    Payment,
    PaymentPlan,
    StudentPaymentSummary
} from "./types";
import { UpdatePaymentDialog } from "./update-payment-dialog";

export default function PaymentsContent() {
    const [payments, setPayments] = useState<Payment[]>(mockPayments);
    const [studentSummaries, setStudentSummaries] = useState<StudentPaymentSummary[]>(mockStudentPaymentSummary);
    const [classOverviews, setClassOverviews] = useState<ClassPaymentOverview[]>(mockClassPaymentOverview);
    const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>(mockPaymentPlans);

    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<StudentPaymentSummary | null>(null);
    const [selectedClass, setSelectedClass] = useState<ClassPaymentOverview | null>(null);

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("payments");

    const handleCreatePayment = (newPayment: Omit<Payment, "id">) => {
        const payment: Payment = {
            ...newPayment,
            id: `payment_${Date.now()}`,
        };
        setPayments([payment, ...payments]);
        setIsCreateDialogOpen(false);
    };

    const handleUpdatePayment = (updatedPayment: Payment) => {
        setPayments(payments.map(p => p.id === updatedPayment.id ? updatedPayment : p));
        setIsUpdateDialogOpen(false);
        setSelectedPayment(null);
    };

    const handleProcessPayment = (paymentId: string, processData: any) => {
        const updatedPayments = payments.map(p => {
            if (p.id === paymentId) {
                return {
                    ...p,
                    status: processData.paidAmount >= p.amount ? "paid" as const : "partial" as const,
                    paidAmount: processData.paidAmount,
                    remainingAmount: p.amount - processData.paidAmount,
                    paymentMethod: processData.paymentMethod,
                    transactionId: processData.transactionId,
                    receiptNumber: processData.receiptNumber,
                    paidDate: new Date().toISOString().split('T')[0],
                    processedBy: processData.processedBy,
                    processedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
            }
            return p;
        });
        setPayments(updatedPayments);
        setIsProcessDialogOpen(false);
        setSelectedPayment(null);
    };
    const handleDeletePayment = (paymentId: string) => {
        setPayments(payments.filter(p => p.id !== paymentId));
    };

    const handleViewDetails = (item: Payment | StudentPaymentSummary | ClassPaymentOverview) => {
        if ('amount' in item && 'dueDate' in item) {
            setSelectedPayment(item as Payment);
        } else if ('totalDue' in item && 'paymentHistory' in item) {
            setSelectedStudent(item as StudentPaymentSummary);
        } else {
            setSelectedClass(item as ClassPaymentOverview);
        }
        setIsDetailsDialogOpen(true);
    };

    const handleEditPayment = (payment: Payment) => {
        setSelectedPayment(payment);
        setIsUpdateDialogOpen(true);
    };

    const handleProcessPaymentClick = (payment: Payment) => {
        setSelectedPayment(payment);
        setIsProcessDialogOpen(true);
    };

    const formatCurrency = (amount: number, currency: string = "DZD") => {
        return new Intl.NumberFormat('fr-DZ', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Column definitions for payments table
    const paymentsColumns = [
        {
            accessorKey: "studentName",
            header: "Student",
            cell: ({ row }: { row: { original: Payment } }) => (
                <div>
                    <div className="font-medium">{row.original.studentName}</div>
                    <div className="text-sm text-muted-foreground">{row.original.className}</div>
                </div>
            ),
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }: { row: { original: Payment } }) => (
                <Badge variant="outline" className="capitalize">
                    {row.original.description}
                </Badge>
            ),
        },
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({ row }: { row: { original: Payment } }) => (
                <div className="font-mono font-medium">
                    {formatCurrency(row.original.amount, row.original.currency)}
                </div>
            ),
        },
        {
            accessorKey: "dueDate",
            header: "Due Date",
            cell: ({ row }: { row: { original: Payment } }) => {
                const dueDate = new Date(row.original.dueDate);
                const now = new Date();
                const isOverdue = dueDate < now && row.original.status !== "paid";
                const isDueSoon = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= 3;

                return (
                    <div className="flex items-center gap-2">
                        <RiTimeLine size={16} className="text-muted-foreground" />
                        <span className={`text-sm ${isOverdue ? "text-red-600 font-medium" :
                            isDueSoon ? "text-orange-600 font-medium" : ""
                            }`}>
                            {dueDate.toLocaleDateString()}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }: { row: { original: Payment } }) => (
                <Badge variant={
                    row.original.status === "paid" ? "default" :
                        row.original.status === "partial" ? "secondary" :
                            row.original.status === "overdue" ? "destructive" :
                                row.original.status === "cancelled" ? "outline" :
                                    row.original.status === "refunded" ? "outline" : "secondary"
                }>
                    <div className="flex items-center gap-1">
                        {row.original.status === "paid" && <RiCheckLine size={14} />}
                        {row.original.status === "overdue" && <RiAlarmWarningLine size={14} />}
                        {row.original.status === "cancelled" && <RiCloseLine size={14} />}
                        {row.original.status === "pending" && <RiTimeLine size={14} />}
                        {row.original.status}
                    </div>
                </Badge>
            ),
        },
        {
            accessorKey: "paymentMethod",
            header: "Method",
            cell: ({ row }: { row: { original: Payment } }) => (
                row.original.paymentMethod ? (
                    <div className="flex items-center gap-2">
                        <RiBankLine size={16} className="text-muted-foreground" />
                        <span className="text-sm capitalize">
                            {row.original.paymentMethod.replace('_', ' ')}
                        </span>
                    </div>
                ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                )
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: { original: Payment } }) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(row.original)}
                    >
                        <RiEyeLine size={16} />
                    </Button>
                    {(row.original.status === "pending" || row.original.status === "partial") && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleProcessPaymentClick(row.original)}
                            className="text-green-600 hover:text-green-700"
                        >
                            <RiMoneyDollarCircleLine size={16} />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPayment(row.original)}
                    >
                        <RiEditLine size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePayment(row.original.id)}
                    >
                        <RiDeleteBinLine size={16} />
                    </Button>
                </div>
            ),
            enableSorting: false,
        },
    ];
    // Column definitions for student summaries table
    const studentColumns = [
        {
            accessorKey: "studentName",
            header: "Student",
            cell: ({ row }: { row: { original: StudentPaymentSummary } }) => (
                <div>
                    <div className="font-medium">{row.original.studentName}</div>
                    <div className="text-sm text-muted-foreground">{row.original.className}</div>
                </div>
            ),
        },
        {
            accessorKey: "totalDue",
            header: "Total Due",
            cell: ({ row }: { row: { original: StudentPaymentSummary } }) => (
                <div className="font-mono font-medium">
                    {formatCurrency(row.original.totalDue)}
                </div>
            ),
        },
        {
            accessorKey: "totalPaid",
            header: "Paid",
            cell: ({ row }: { row: { original: StudentPaymentSummary } }) => (
                <div className="flex items-center gap-2">
                    <span className="font-mono text-green-600">
                        {formatCurrency(row.original.totalPaid)}
                    </span>
                    <RiCheckLine size={16} className="text-green-600" />
                </div>
            ),
        },
        {
            accessorKey: "totalOverdue",
            header: "Overdue",
            cell: ({ row }: { row: { original: StudentPaymentSummary } }) => (
                <div className="flex items-center gap-2">
                    <span className="font-mono text-red-600">
                        {formatCurrency(row.original.totalOverdue)}
                    </span>
                    {row.original.totalOverdue > 0 && <RiAlarmWarningLine size={16} className="text-red-600" />}
                </div>
            ),
        },
        {
            accessorKey: "collectionRate",
            header: "Collection Rate",
            cell: ({ row }: { row: { original: StudentPaymentSummary } }) => (
                <Badge variant={row.original.collectionRate >= 80 ? "default" : "destructive"}>
                    {row.original.collectionRate.toFixed(1)}%
                </Badge>
            ),
        },
        {
            accessorKey: "lastPaymentDate",
            header: "Last Payment",
            cell: ({ row }: { row: { original: StudentPaymentSummary } }) => (
                <span className="text-sm">
                    {row.original.lastPaymentDate ?
                        new Date(row.original.lastPaymentDate).toLocaleDateString() :
                        "No payments"
                    }
                </span>
            ),
        },
        {
            accessorKey: "nextPaymentDue",
            header: "Next Due",
            cell: ({ row }: { row: { original: StudentPaymentSummary } }) => (
                <span className="text-sm">
                    {row.original.nextPaymentDue ?
                        new Date(row.original.nextPaymentDue).toLocaleDateString() :
                        "No upcoming"
                    }
                </span>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: { original: StudentPaymentSummary } }) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(row.original)}
                    >
                        <RiEyeLine size={16} />
                    </Button>
                    {row.original.overduePayments.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-orange-600 hover:text-orange-700"
                        >
                            <RiMailLine size={16} />
                        </Button>
                    )}
                </div>
            ),
            enableSorting: false,
        },
    ];

    // Column definitions for class overviews table
    const classColumns = [
        {
            accessorKey: "className",
            header: "Class",
            cell: ({ row }: { row: { original: ClassPaymentOverview } }) => (
                <div className="font-medium">{row.original.className}</div>
            ),
        },
        {
            accessorKey: "totalStudents",
            header: "Students",
            cell: ({ row }: { row: { original: ClassPaymentOverview } }) => (
                <span className="font-mono">{row.original.totalStudents}</span>
            ),
        },
        {
            accessorKey: "totalDue",
            header: "Total Due",
            cell: ({ row }: { row: { original: ClassPaymentOverview } }) => (
                <div className="font-mono font-medium">
                    {formatCurrency(row.original.totalDue)}
                </div>
            ),
        },
        {
            accessorKey: "totalPaid",
            header: "Paid",
            cell: ({ row }: { row: { original: ClassPaymentOverview } }) => (
                <div className="flex items-center gap-2">
                    <span className="font-mono text-green-600">
                        {formatCurrency(row.original.totalPaid)}
                    </span>
                    <RiCheckLine size={16} className="text-green-600" />
                </div>
            ),
        },
        {
            accessorKey: "totalOverdue",
            header: "Overdue",
            cell: ({ row }: { row: { original: ClassPaymentOverview } }) => (
                <div className="flex items-center gap-2">
                    <span className="font-mono text-red-600">
                        {formatCurrency(row.original.totalOverdue)}
                    </span>
                    {row.original.totalOverdue > 0 && <RiAlarmWarningLine size={16} className="text-red-600" />}
                </div>
            ),
        },
        {
            accessorKey: "collectionRate",
            header: "Collection Rate",
            cell: ({ row }: { row: { original: ClassPaymentOverview } }) => (
                <Badge variant={row.original.collectionRate >= 80 ? "default" : "destructive"}>
                    {row.original.collectionRate.toFixed(1)}%
                </Badge>
            ),
        },
        {
            accessorKey: "studentsWithOverdue",
            header: "Overdue Students",
            cell: ({ row }: { row: { original: ClassPaymentOverview } }) => (
                <div className="flex items-center gap-2">
                    <span className="font-mono">{row.original.studentsWithOverdue}</span>
                    {row.original.studentsWithOverdue > 0 && (
                        <Badge variant="destructive" className="text-xs">
                            {((row.original.studentsWithOverdue / row.original.totalStudents) * 100).toFixed(0)}%
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: { original: ClassPaymentOverview } }) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(row.original)}
                    >
                        <RiEyeLine size={16} />
                    </Button>
                </div>
            ),
            enableSorting: false,
        },
    ];
    return (
        <div className="flex flex-1 gap-4 p-2">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-80 shrink-0">
                <div className="sticky top-4 space-y-4">
                    <PaymentStats
                        payments={payments}
                        studentSummaries={studentSummaries}
                        classOverviews={classOverviews}
                        paymentPlans={paymentPlans}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
                {/* Mobile Stats - Collapsible */}
                <div className="lg:hidden mb-4">
                    <details className="group">
                        <summary className="flex items-center justify-between p-3 bg-card border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                            <span className="font-medium">Statistics</span>
                            <svg
                                className="w-5 h-5 transition-transform group-open:rotate-180"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </summary>
                        <div className="mt-2">
                            <PaymentStats
                                payments={payments}
                                studentSummaries={studentSummaries}
                                classOverviews={classOverviews}
                                paymentPlans={paymentPlans}
                            />
                        </div>
                    </details>
                </div>

                {/* Header Actions */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Payment Management</h1>
                        <p className="text-muted-foreground">Manage student payments, fees, and financial records</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <RiFileExcel2Line size={16} />
                            Export
                        </Button>
                        <Button variant="outline" size="sm">
                            <RiPrinterLine size={16} />
                            Print
                        </Button>
                        <Button variant="outline" size="sm">
                            <RiReceiptLine size={16} />
                            Receipts
                        </Button>
                        <Button onClick={() => setIsCreateDialogOpen(true)}>
                            <RiAddLine size={16} />
                            Add Payment
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="payments">All Payments</TabsTrigger>
                        <TabsTrigger value="students">Students</TabsTrigger>
                        <TabsTrigger value="classes">Classes</TabsTrigger>
                        <TabsTrigger value="plans">Payment Plans</TabsTrigger>
                    </TabsList>

                    <TabsContent value="payments" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Records</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    data={payments}
                                    columns={paymentsColumns}
                                    searchKey="studentName"
                                    searchPlaceholder="Search payments..."
                                    onDataChange={setPayments}
                                    filters={[
                                        {
                                            key: "type",
                                            label: "Type",
                                            options: [
                                                { label: "Tuition", value: "tuition" },
                                                { label: "Registration", value: "registration" },
                                                { label: "Books", value: "books" },
                                                { label: "Transport", value: "transport" },
                                                { label: "Meals", value: "meals" },
                                                { label: "Activities", value: "activities" },
                                                { label: "Exam Fees", value: "exam_fees" },
                                                { label: "Other", value: "other" },
                                            ]
                                        },
                                        {
                                            key: "status",
                                            label: "Status",
                                            options: [
                                                { label: "Pending", value: "pending" },
                                                { label: "Paid", value: "paid" },
                                                { label: "Overdue", value: "overdue" },
                                                { label: "Partial", value: "partial" },
                                                { label: "Cancelled", value: "cancelled" },
                                                { label: "Refunded", value: "refunded" },
                                            ]
                                        },
                                        {
                                            key: "category",
                                            label: "Category",
                                            options: [
                                                { label: "Monthly", value: "monthly" },
                                                { label: "Quarterly", value: "quarterly" },
                                                { label: "Semester", value: "semester" },
                                                { label: "Annual", value: "annual" },
                                                { label: "One Time", value: "one_time" },
                                            ]
                                        },
                                        {
                                            key: "paymentMethod",
                                            label: "Method",
                                            options: [
                                                { label: "Cash", value: "cash" },
                                                { label: "Bank Transfer", value: "bank_transfer" },
                                                { label: "Check", value: "check" },
                                                { label: "Card", value: "card" },
                                                { label: "Mobile Payment", value: "mobile_payment" },
                                            ]
                                        }
                                    ]}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="students" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Student Payment Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    data={studentSummaries}
                                    columns={studentColumns}
                                    searchKey="studentName"
                                    searchPlaceholder="Search students..."
                                    filters={[
                                        {
                                            key: "className",
                                            label: "Class",
                                            options: [
                                                { label: "1ère AS Sciences", value: "1ère AS Sciences" },
                                                { label: "1ère AS Lettres", value: "1ère AS Lettres" },
                                                { label: "2ème AS Sciences", value: "2ème AS Sciences" },
                                                { label: "2ème AS Lettres", value: "2ème AS Lettres" },
                                                { label: "3ème AS Sciences", value: "3ème AS Sciences" },
                                                { label: "3ème AS Lettres", value: "3ème AS Lettres" },
                                                { label: "Terminal Sciences", value: "Terminal Sciences" },
                                                { label: "Terminal Lettres", value: "Terminal Lettres" },
                                            ]
                                        }
                                    ]}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="classes" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Class Payment Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    data={classOverviews}
                                    columns={classColumns}
                                    searchKey="className"
                                    searchPlaceholder="Search classes..."
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="plans" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Plans</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    Payment plans management coming soon...
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Dialogs */}
            <CreatePaymentDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onSubmit={handleCreatePayment}
            />

            {selectedPayment && (
                <>
                    <UpdatePaymentDialog
                        open={isUpdateDialogOpen}
                        onOpenChange={setIsUpdateDialogOpen}
                        payment={selectedPayment}
                        onSubmit={handleUpdatePayment}
                    />

                    <ProcessPaymentDialog
                        open={isProcessDialogOpen}
                        onOpenChange={setIsProcessDialogOpen}
                        payment={selectedPayment}
                        onSubmit={handleProcessPayment}
                    />
                </>
            )}

            <PaymentDetailsDialog
                open={isDetailsDialogOpen}
                onOpenChange={setIsDetailsDialogOpen}
                data={selectedPayment || selectedStudent || selectedClass}
            />
        </div>
    );
}