import type {
    ClassPaymentOverview,
    Payment,
    PaymentInstallment,
    PaymentPlan,
    PaymentReminder,
    StudentPaymentSummary
} from "./types";

// Algerian student names
const algerianStudentNames = [
    "Ahmed Benali", "Fatima Benaissa", "Mohamed Khelifi", "Aicha Boumediene",
    "Youcef Hamidi", "Khadija Meziane", "Omar Belkacem", "Samira Cherif",
    "Karim Boukhalfa", "Nadia Benabdallah", "Rachid Mammeri", "Leila Boudjelal",
    "Sofiane Zidane", "Amina Benslimane", "Tarek Boudiaf", "Yasmine Hadj",
    "Bilal Mebarki", "Soraya Benali", "Amine Bensalem", "Houria Benabbes",
    "Farid Bouazza", "Malika Benkhaled", "Samir Benacer", "Djamila Benaouda",
    "Walid Benabdellah", "Zineb Benmohamed", "Hicham Benali", "Nawal Bensaid",
    "Riad Boukerche", "Siham Benabdallah", "Mourad Benali", "Widad Benaissa",
    "Adel Khelifi", "Sabrina Boumediene", "Nabil Hamidi", "Karima Meziane",
    "Djamel Belkacem", "Souad Cherif", "Farouk Boukhalfa", "Lamia Benabdallah",
    "Nassim Boudaoud", "Lynda Benabderrahmane", "Kamel Bensaadi", "Meriem Boudiaf",
    "Salim Benali", "Asma Khelifi", "Redouane Meziane", "Hanane Belkacem"
];

// Algerian parent names
const algerianParentNames = [
    "M. Benali Abderrahmane", "Mme. Benaissa Zohra", "M. Khelifi Mustapha", "Mme. Boumediene Khadija",
    "M. Hamidi Abdelkader", "Mme. Meziane Fatima", "M. Belkacem Salah", "Mme. Cherif Aicha",
    "M. Boukhalfa Omar", "Mme. Benabdallah Malika", "M. Mammeri Rachid", "Mme. Boudjelal Yamina",
    "M. Zidane Mohamed", "Mme. Benslimane Naima", "M. Boudiaf Youcef", "Mme. Hadj Soraya",
    "M. Mebarki Karim", "Mme. Benali Djamila", "M. Bensalem Ahmed", "Mme. Benabbes Leila"
];

// Algerian classes
const algerianClasses = [
    { id: "class_1", name: "1ère AS Sciences" },
    { id: "class_2", name: "1ère AS Lettres" },
    { id: "class_3", name: "2ème AS Sciences" },
    { id: "class_4", name: "2ème AS Lettres" },
    { id: "class_5", name: "3ème AS Sciences" },
    { id: "class_6", name: "3ème AS Lettres" },
    { id: "class_7", name: "Terminal Sciences" },
    { id: "class_8", name: "Terminal Lettres" },
    { id: "class_9", name: "1ère AM" },
    { id: "class_10", name: "2ème AM" },
    { id: "class_11", name: "3ème AM" },
    { id: "class_12", name: "4ème AM" }
];

// Payment types with Algerian context
const paymentTypes = [
    { type: "tuition", description: "Frais de scolarité", baseAmount: 15000 },
    { type: "registration", description: "Frais d'inscription", baseAmount: 5000 },
    { type: "books", description: "Manuels scolaires", baseAmount: 8000 },
    { type: "transport", description: "Transport scolaire", baseAmount: 3000 },
    { type: "meals", description: "Restauration", baseAmount: 4000 },
    { type: "activities", description: "Activités parascolaires", baseAmount: 2000 },
    { type: "exam_fees", description: "Frais d'examens", baseAmount: 1500 },
    { type: "other", description: "Autres frais", baseAmount: 1000 }
] as const;

const paymentMethods = ["cash", "bank_transfer", "check", "card", "mobile_payment"] as const;
const categories = ["monthly", "quarterly", "semester", "annual", "one_time"] as const;

// Generate mock payments
export const mockPayments: Payment[] = [];

// Generate payments for the last 6 months and next 3 months
for (let monthOffset = -6; monthOffset <= 3; monthOffset++) {
    const baseDate = new Date();
    baseDate.setMonth(baseDate.getMonth() + monthOffset);

    // Generate 40-60 payments per month
    const paymentsPerMonth = Math.floor(Math.random() * 21) + 40;

    for (let i = 0; i < paymentsPerMonth; i++) {
        const studentName = algerianStudentNames[Math.floor(Math.random() * algerianStudentNames.length)];
        const parentName = algerianParentNames[Math.floor(Math.random() * algerianParentNames.length)];
        const classInfo = algerianClasses[Math.floor(Math.random() * algerianClasses.length)];
        const paymentTypeInfo = paymentTypes[Math.floor(Math.random() * paymentTypes.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];

        // Calculate amount based on class level and type
        const classMultiplier = classInfo.name.includes("Terminal") ? 1.3 :
            classInfo.name.includes("3ème AS") ? 1.2 :
                classInfo.name.includes("2ème AS") ? 1.1 :
                    classInfo.name.includes("1ère AS") ? 1.0 :
                        0.8; // AM classes are cheaper

        const baseAmount = paymentTypeInfo.baseAmount * classMultiplier;
        const amount = Math.floor(baseAmount + (Math.random() - 0.5) * baseAmount * 0.2); // ±10% variation

        // Generate due date
        const dueDate = new Date(baseDate);
        dueDate.setDate(Math.floor(Math.random() * 28) + 1);

        // Determine status based on due date and current date
        const now = new Date();
        let status: Payment["status"];
        let paidDate: string | undefined;
        let paidAmount: number | undefined;
        let paymentMethod: Payment["paymentMethod"] | undefined;
        let transactionId: string | undefined;
        let receiptNumber: string | undefined;

        if (dueDate < now) {
            // Past due date
            const paymentProbability = Math.random();
            if (paymentProbability > 0.85) {
                status = "overdue";
            } else if (paymentProbability > 0.1) {
                status = "paid";
                paidDate = new Date(dueDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                paidAmount = Math.random() > 0.1 ? amount : Math.floor(amount * (0.5 + Math.random() * 0.4)); // 10% partial payments
                paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
                transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
                receiptNumber = `REC${new Date().getFullYear()}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

                if (paidAmount < amount) {
                    status = "partial";
                }
            } else {
                status = Math.random() > 0.5 ? "cancelled" : "refunded";
            }
        } else {
            // Future due date
            status = "pending";
        }

        // Calculate remaining amount
        const remainingAmount = status === "paid" ? 0 :
            status === "partial" ? amount - (paidAmount || 0) :
                amount;

        // Generate late fee for overdue payments
        const lateFee = status === "overdue" ? Math.floor(amount * 0.05) : undefined; // 5% late fee

        // Generate discount (10% chance)
        const discount = Math.random() > 0.9 ? Math.floor(amount * (0.05 + Math.random() * 0.15)) : undefined; // 5-20% discount
        const discountReason = discount ?
            ["Bourse d'excellence", "Famille nombreuse", "Situation sociale", "Paiement anticipé"][Math.floor(Math.random() * 4)] :
            undefined;

        // Installment info for recurring payments
        const installmentNumber = category !== "one_time" ? Math.floor(Math.random() * 10) + 1 : undefined;
        const totalInstallments = category === "monthly" ? 10 :
            category === "quarterly" ? 4 :
                category === "semester" ? 2 :
                    category === "annual" ? 1 : undefined;

        mockPayments.push({
            id: `payment_${monthOffset}_${i}`,
            studentId: `student_${i % 50}`,
            studentName,
            classId: classInfo.id,
            className: classInfo.name,
            parentId: `parent_${i % 20}`,
            parentName,
            amount,
            currency: "DZD",
            type: paymentTypeInfo.type,
            category,
            status,
            dueDate: dueDate.toISOString().split('T')[0],
            paidDate,
            paidAmount,
            remainingAmount,
            paymentMethod,
            transactionId,
            receiptNumber,
            description: paymentTypeInfo.description,
            notes: status === "overdue" ? "Paiement en retard" :
                status === "partial" ? "Paiement partiel effectué" :
                    discount ? "Remise appliquée" : undefined,
            academicYear: "2024-2025",
            semester: monthOffset <= -3 ? "Premier semestre" : "Deuxième semestre",
            installmentNumber,
            totalInstallments,
            lateFee,
            discount,
            discountReason,
            createdBy: "Admin Système",
            createdAt: new Date(dueDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
            processedBy: status === "paid" || status === "partial" ? "Comptable Principal" : undefined,
            processedAt: paidDate
        });
    }
}

// Generate payment plans
export const mockPaymentPlans: PaymentPlan[] = [];

// Create payment plans for some students
const studentsWithPlans = Array.from(new Set(mockPayments.map(p => p.studentId))).slice(0, 20);

studentsWithPlans.forEach((studentId, index) => {
    const studentPayments = mockPayments.filter(p => p.studentId === studentId);
    if (studentPayments.length === 0) return;

    const student = studentPayments[0];
    const totalAmount = Math.floor(50000 + Math.random() * 30000); // 50k-80k DZD per year
    const planType = ["monthly", "quarterly", "semester"][Math.floor(Math.random() * 3)] as any;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);

    const installmentCount = planType === "monthly" ? 10 :
        planType === "quarterly" ? 4 : 2;

    const installments: PaymentInstallment[] = [];
    const installmentAmount = Math.floor(totalAmount / installmentCount);

    for (let i = 0; i < installmentCount; i++) {
        const installmentDueDate = new Date(startDate);
        if (planType === "monthly") {
            installmentDueDate.setMonth(startDate.getMonth() + i);
        } else if (planType === "quarterly") {
            installmentDueDate.setMonth(startDate.getMonth() + i * 3);
        } else {
            installmentDueDate.setMonth(startDate.getMonth() + i * 6);
        }

        const now = new Date();
        const status = installmentDueDate < now ?
            (Math.random() > 0.2 ? "paid" : "overdue") : "pending";

        installments.push({
            id: `installment_${index}_${i}`,
            planId: `plan_${index}`,
            installmentNumber: i + 1,
            amount: installmentAmount,
            dueDate: installmentDueDate.toISOString().split('T')[0],
            status,
            paymentId: status === "paid" ? `payment_plan_${index}_${i}` : undefined,
            paidDate: status === "paid" ? installmentDueDate.toISOString().split('T')[0] : undefined,
            paidAmount: status === "paid" ? installmentAmount : undefined,
            lateFee: status === "overdue" ? Math.floor(installmentAmount * 0.05) : undefined
        });
    }

    const completedInstallments = installments.filter(i => i.status === "paid").length;
    const planStatus = completedInstallments === installmentCount ? "completed" :
        installments.some(i => i.status === "overdue") ? "active" : "active";

    mockPaymentPlans.push({
        id: `plan_${index}`,
        studentId,
        studentName: student.studentName,
        classId: student.classId,
        className: student.className,
        totalAmount,
        currency: "DZD",
        planType,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        installments,
        status: planStatus,
        createdBy: "Admin Système",
        createdAt: startDate.toISOString(),
        updatedAt: new Date().toISOString()
    });
});

// Generate student payment summaries
export const mockStudentPaymentSummary: StudentPaymentSummary[] = [];

const uniqueStudents = new Map<string, {
    id: string;
    name: string;
    classId: string;
    className: string;
    parentId?: string;
    parentName?: string;
}>();

mockPayments.forEach(payment => {
    if (!uniqueStudents.has(payment.studentId)) {
        uniqueStudents.set(payment.studentId, {
            id: payment.studentId,
            name: payment.studentName,
            classId: payment.classId,
            className: payment.className,
            parentId: payment.parentId,
            parentName: payment.parentName
        });
    }
});

uniqueStudents.forEach(student => {
    const studentPayments = mockPayments.filter(p => p.studentId === student.id);
    const studentPlan = mockPaymentPlans.find(p => p.studentId === student.id);

    if (studentPayments.length > 0) {
        const totalDue = studentPayments.reduce((sum, p) => sum + p.amount, 0);
        const totalPaid = studentPayments.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
        const totalPending = studentPayments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);
        const totalOverdue = studentPayments.filter(p => p.status === "overdue").reduce((sum, p) => sum + p.remainingAmount!, 0);

        const paidPayments = studentPayments.filter(p => p.paidDate);
        const averagePaymentDelay = paidPayments.length > 0 ?
            paidPayments.reduce((sum, p) => {
                const dueDate = new Date(p.dueDate);
                const paidDate = new Date(p.paidDate!);
                const delay = Math.max(0, (paidDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
                return sum + delay;
            }, 0) / paidPayments.length : 0;

        const collectionRate = totalDue > 0 ? (totalPaid / totalDue) * 100 : 0;
        const totalLateFees = studentPayments.reduce((sum, p) => sum + (p.lateFee || 0), 0);
        const totalDiscounts = studentPayments.reduce((sum, p) => sum + (p.discount || 0), 0);

        const paymentHistory = studentPayments
            .filter(p => p.status === "paid" || p.status === "partial")
            .sort((a, b) => new Date(b.paidDate!).getTime() - new Date(a.paidDate!).getTime())
            .slice(0, 10);

        const now = new Date();
        const upcomingPayments = studentPayments
            .filter(p => p.status === "pending" && new Date(p.dueDate) > now)
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .slice(0, 5);

        const overduePayments = studentPayments
            .filter(p => p.status === "overdue")
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

        const lastPaymentDate = paymentHistory.length > 0 ? paymentHistory[0].paidDate : undefined;
        const nextPaymentDue = upcomingPayments.length > 0 ? upcomingPayments[0].dueDate : undefined;

        mockStudentPaymentSummary.push({
            id: `student_summary_${student.id}`,
            studentId: student.id,
            studentName: student.name,
            classId: student.classId,
            className: student.className,
            parentId: student.parentId,
            parentName: student.parentName,
            totalDue,
            totalPaid,
            totalPending,
            totalOverdue,
            paymentHistory,
            upcomingPayments,
            overduePayments,
            paymentPlan: studentPlan,
            lastPaymentDate,
            nextPaymentDue,
            collectionRate,
            averagePaymentDelay,
            totalLateFees,
            totalDiscounts
        });
    }
});

// Generate class payment overviews
export const mockClassPaymentOverview: ClassPaymentOverview[] = [];

algerianClasses.forEach(classInfo => {
    const classPayments = mockPayments.filter(p => p.classId === classInfo.id);

    if (classPayments.length > 0) {
        const uniqueStudentsInClass = new Set(classPayments.map(p => p.studentId));
        const totalStudents = uniqueStudentsInClass.size;

        const totalDue = classPayments.reduce((sum, p) => sum + p.amount, 0);
        const totalPaid = classPayments.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
        const totalPending = classPayments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);
        const totalOverdue = classPayments.filter(p => p.status === "overdue").reduce((sum, p) => sum + p.remainingAmount!, 0);

        const collectionRate = totalDue > 0 ? (totalPaid / totalDue) * 100 : 0;

        const paidPayments = classPayments.filter(p => p.paidDate);
        const averagePaymentDelay = paidPayments.length > 0 ?
            paidPayments.reduce((sum, p) => {
                const dueDate = new Date(p.dueDate);
                const paidDate = new Date(p.paidDate!);
                const delay = Math.max(0, (paidDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
                return sum + delay;
            }, 0) / paidPayments.length : 0;

        const studentsWithOverdue = new Set(
            classPayments.filter(p => p.status === "overdue").map(p => p.studentId)
        ).size;

        const recentPayments = classPayments
            .filter(p => p.status === "paid" || p.status === "partial")
            .sort((a, b) => new Date(b.paidDate!).getTime() - new Date(a.paidDate!).getTime())
            .slice(0, 5);

        const paymentDistribution = {
            paid: classPayments.filter(p => p.status === "paid").length,
            pending: classPayments.filter(p => p.status === "pending").length,
            overdue: classPayments.filter(p => p.status === "overdue").length,
            cancelled: classPayments.filter(p => p.status === "cancelled").length
        };

        mockClassPaymentOverview.push({
            id: `class_overview_${classInfo.id}`,
            classId: classInfo.id,
            className: classInfo.name,
            totalStudents,
            totalDue,
            totalPaid,
            totalPending,
            totalOverdue,
            collectionRate,
            averagePaymentDelay,
            studentsWithOverdue,
            recentPayments,
            paymentDistribution
        });
    }
});

// Generate payment reminders
export const mockPaymentReminders: PaymentReminder[] = [];

const overduePayments = mockPayments.filter(p => p.status === "overdue");

overduePayments.forEach((payment, index) => {
    const dueDate = new Date(payment.dueDate);
    const now = new Date();
    const daysPastDue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

    // Generate 1-3 reminders per overdue payment
    const reminderCount = Math.min(3, Math.floor(daysPastDue / 7) + 1);

    for (let i = 0; i < reminderCount; i++) {
        const reminderDate = new Date(dueDate);
        reminderDate.setDate(dueDate.getDate() + (i + 1) * 7); // Weekly reminders

        const reminderTypes = ["email", "sms", "phone", "letter"] as const;
        const reminderType = reminderTypes[Math.floor(Math.random() * reminderTypes.length)];

        const status = reminderDate < now ?
            (Math.random() > 0.1 ? "sent" : "failed") : "pending";

        const messages = {
            email: `Rappel: Paiement en retard de ${payment.amount} DZD pour ${payment.description}`,
            sms: `Rappel paiement: ${payment.amount} DZD dû depuis ${daysPastDue} jours`,
            phone: `Appel de rappel pour paiement en retard`,
            letter: `Lettre de rappel officielle pour paiement en retard`
        };

        mockPaymentReminders.push({
            id: `reminder_${payment.id}_${i}`,
            paymentId: payment.id,
            studentId: payment.studentId,
            studentName: payment.studentName,
            parentId: payment.parentId,
            parentName: payment.parentName,
            amount: payment.remainingAmount || payment.amount,
            dueDate: payment.dueDate,
            daysPastDue,
            reminderType,
            status,
            sentAt: status === "sent" ? reminderDate.toISOString() : undefined,
            sentBy: status === "sent" ? "Système automatique" : undefined,
            message: messages[reminderType],
            nextReminderDate: status === "sent" && i < 2 ?
                new Date(reminderDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
                undefined
        });
    }
});

// Sort arrays for better display
mockPayments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
mockStudentPaymentSummary.sort((a, b) => b.collectionRate - a.collectionRate);
mockClassPaymentOverview.sort((a, b) => b.collectionRate - a.collectionRate);
mockPaymentReminders.sort((a, b) => b.daysPastDue - a.daysPastDue);