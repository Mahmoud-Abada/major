export interface Payment {
    id: string;
    studentId: string;
    studentName: string;
    classId: string;
    className: string;
    parentId?: string;
    parentName?: string;
    amount: number;
    currency: "DZD" | "EUR" | "USD";
    type: "tuition" | "registration" | "books" | "transport" | "meals" | "activities" | "exam_fees" | "other";
    category: "monthly" | "quarterly" | "semester" | "annual" | "one_time";
    status: "pending" | "paid" | "overdue" | "cancelled" | "refunded" | "partial";
    dueDate: string;
    paidDate?: string;
    paidAmount?: number;
    remainingAmount?: number;
    paymentMethod?: "cash" | "bank_transfer" | "check" | "card" | "mobile_payment";
    transactionId?: string;
    receiptNumber?: string;
    description: string;
    notes?: string;
    academicYear: string;
    semester: string;
    installmentNumber?: number;
    totalInstallments?: number;
    lateFee?: number;
    discount?: number;
    discountReason?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    processedBy?: string;
    processedAt?: string;
}

export interface PaymentPlan {
    id: string;
    studentId: string;
    studentName: string;
    classId: string;
    className: string;
    totalAmount: number;
    currency: "DZD" | "EUR" | "USD";
    planType: "monthly" | "quarterly" | "semester" | "custom";
    startDate: string;
    endDate: string;
    installments: PaymentInstallment[];
    status: "active" | "completed" | "cancelled" | "suspended";
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface PaymentInstallment {
    id: string;
    planId: string;
    installmentNumber: number;
    amount: number;
    dueDate: string;
    status: "pending" | "paid" | "overdue" | "cancelled";
    paymentId?: string;
    paidDate?: string;
    paidAmount?: number;
    lateFee?: number;
}

export interface PaymentReceipt {
    id: string;
    paymentId: string;
    receiptNumber: string;
    studentName: string;
    className: string;
    amount: number;
    currency: "DZD" | "EUR" | "USD";
    paymentDate: string;
    paymentMethod: string;
    description: string;
    academicYear: string;
    semester: string;
    issuedBy: string;
    issuedAt: string;
    template: "standard" | "detailed" | "official";
}

export interface PaymentReminder {
    id: string;
    paymentId: string;
    studentId: string;
    studentName: string;
    parentId?: string;
    parentName?: string;
    amount: number;
    dueDate: string;
    daysPastDue: number;
    reminderType: "email" | "sms" | "phone" | "letter";
    status: "pending" | "sent" | "delivered" | "failed";
    sentAt?: string;
    sentBy?: string;
    message: string;
    nextReminderDate?: string;
}

export interface PaymentStats {
    totalPayments: number;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    overdueAmount: number;
    refundedAmount: number;
    collectionRate: number;
    averagePaymentTime: number;
    monthlyRevenue: number;
    yearlyRevenue: number;
    paymentMethodDistribution: Record<string, number>;
    typeDistribution: Record<string, number>;
    statusDistribution: Record<string, number>;
    classDistribution: Record<string, { totalAmount: number; paidAmount: number; collectionRate: number }>;
    monthlyTrends: {
        month: string;
        totalAmount: number;
        paidAmount: number;
        collectionRate: number;
    }[];
    topPayingClasses: {
        className: string;
        totalAmount: number;
        collectionRate: number;
    }[];
    overdueAnalysis: {
        totalOverdue: number;
        averageDaysOverdue: number;
        overdueByClass: Record<string, number>;
    };
}

export interface StudentPaymentSummary {
    id: string;
    studentId: string;
    studentName: string;
    classId: string;
    className: string;
    parentId?: string;
    parentName?: string;
    totalDue: number;
    totalPaid: number;
    totalPending: number;
    totalOverdue: number;
    paymentHistory: Payment[];
    upcomingPayments: Payment[];
    overduePayments: Payment[];
    paymentPlan?: PaymentPlan;
    lastPaymentDate?: string;
    nextPaymentDue?: string;
    collectionRate: number;
    averagePaymentDelay: number;
    totalLateFees: number;
    totalDiscounts: number;
}

export interface ClassPaymentOverview {
    id: string;
    classId: string;
    className: string;
    totalStudents: number;
    totalDue: number;
    totalPaid: number;
    totalPending: number;
    totalOverdue: number;
    collectionRate: number;
    averagePaymentDelay: number;
    studentsWithOverdue: number;
    recentPayments: Payment[];
    paymentDistribution: {
        paid: number;
        pending: number;
        overdue: number;
        cancelled: number;
    };
}

export interface PaymentReport {
    id: string;
    title: string;
    type: "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "custom";
    dateFrom: string;
    dateTo: string;
    totalAmount: number;
    totalPayments: number;
    collectionRate: number;
    breakdown: {
        byType: Record<string, number>;
        byClass: Record<string, number>;
        byMethod: Record<string, number>;
        byStatus: Record<string, number>;
    };
    generatedBy: string;
    generatedAt: string;
}

export interface CreatePaymentRequest {
    studentId: string;
    amount: number;
    currency: "DZD" | "EUR" | "USD";
    type: "tuition" | "registration" | "books" | "transport" | "meals" | "activities" | "exam_fees" | "other";
    category: "monthly" | "quarterly" | "semester" | "annual" | "one_time";
    dueDate: string;
    description: string;
    academicYear: string;
    semester: string;
    installmentNumber?: number;
    totalInstallments?: number;
    discount?: number;
    discountReason?: string;
    notes?: string;
}

export interface UpdatePaymentRequest extends Partial<CreatePaymentRequest> {
    id: string;
    status?: "pending" | "paid" | "overdue" | "cancelled" | "refunded" | "partial";
    paidAmount?: number;
    paymentMethod?: "cash" | "bank_transfer" | "check" | "card" | "mobile_payment";
    transactionId?: string;
    receiptNumber?: string;
    processedBy?: string;
}

export interface ProcessPaymentRequest {
    paymentId: string;
    paidAmount: number;
    paymentMethod: "cash" | "bank_transfer" | "check" | "card" | "mobile_payment";
    transactionId?: string;
    receiptNumber?: string;
    notes?: string;
    processedBy: string;
}

export interface CreatePaymentPlanRequest {
    studentId: string;
    totalAmount: number;
    currency: "DZD" | "EUR" | "USD";
    planType: "monthly" | "quarterly" | "semester" | "custom";
    startDate: string;
    endDate: string;
    installmentCount: number;
    description: string;
}

export interface PaymentFilter {
    studentId?: string;
    classId?: string;
    parentId?: string;
    type?: "tuition" | "registration" | "books" | "transport" | "meals" | "activities" | "exam_fees" | "other";
    category?: "monthly" | "quarterly" | "semester" | "annual" | "one_time";
    status?: "pending" | "paid" | "overdue" | "cancelled" | "refunded" | "partial";
    paymentMethod?: "cash" | "bank_transfer" | "check" | "card" | "mobile_payment";
    dueDateFrom?: string;
    dueDateTo?: string;
    paidDateFrom?: string;
    paidDateTo?: string;
    amountFrom?: number;
    amountTo?: number;
    academicYear?: string;
    semester?: string;
}

export interface BulkPaymentOperation {
    operation: "mark_paid" | "send_reminder" | "apply_discount" | "cancel" | "generate_receipt";
    paymentIds: string[];
    data?: {
        paymentMethod?: string;
        transactionId?: string;
        discount?: number;
        discountReason?: string;
        notes?: string;
    };
}

export interface PaymentNotification {
    id: string;
    type: "payment_due" | "payment_overdue" | "payment_received" | "payment_failed" | "reminder_sent";
    recipientType: "student" | "parent" | "admin";
    recipientId: string;
    recipientName: string;
    paymentId: string;
    title: string;
    message: string;
    status: "pending" | "sent" | "delivered" | "failed";
    sentAt?: string;
    deliveredAt?: string;
    channel: "email" | "sms" | "push" | "in_app";
    metadata?: Record<string, any>;
}