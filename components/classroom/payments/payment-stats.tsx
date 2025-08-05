"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    RiAlarmWarningLine,
    RiBankLine,
    RiBarChartLine,
    RiCheckLine,
    RiGroupLine,
    RiMoneyDollarCircleLine,
    RiReceiptLine,
    RiRidingLine,
    RiTimeLine
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import type { ClassPaymentOverview, Payment, PaymentPlan, StudentPaymentSummary } from "./types";

interface PaymentStatsProps {
    payments: Payment[];
    studentSummaries: StudentPaymentSummary[];
    classOverviews: ClassPaymentOverview[];
    paymentPlans: PaymentPlan[];
}

export function PaymentStats({
    payments,
    studentSummaries,
    classOverviews,
    paymentPlans
}: PaymentStatsProps) {
    const t = useTranslations('payments');

    const formatCurrency = (amount: number, currency: string = "DZD") => {
        return new Intl.NumberFormat('fr-DZ', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Calculate statistics
    const totalPayments = payments.length;
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const paidAmount = payments.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
    const pendingAmount = payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);
    const overdueAmount = payments.filter(p => p.status === "overdue").reduce((sum, p) => sum + (p.remainingAmount || p.amount), 0);

    const collectionRate = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;

    // Today's statistics
    const today = new Date().toISOString().split('T')[0];
    const todayPayments = payments.filter(p => p.paidDate === today);
    const todayAmount = todayPayments.reduce((sum, p) => sum + (p.paidAmount || 0), 0);

    // This month's statistics
    const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const monthlyPayments = payments.filter(p => p.paidDate?.startsWith(thisMonth));
    const monthlyAmount = monthlyPayments.reduce((sum, p) => sum + (p.paidAmount || 0), 0);

    // Status distribution
    const statusDistribution = {
        paid: payments.filter(p => p.status === "paid").length,
        pending: payments.filter(p => p.status === "pending").length,
        overdue: payments.filter(p => p.status === "overdue").length,
        partial: payments.filter(p => p.status === "partial").length,
        cancelled: payments.filter(p => p.status === "cancelled").length,
        refunded: payments.filter(p => p.status === "refunded").length
    };

    // Payment method distribution
    const methodDistribution = payments.reduce((acc, payment) => {
        if (payment.paymentMethod) {
            acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    // Type distribution
    const typeDistribution = payments.reduce((acc, payment) => {
        acc[payment.type] = (acc[payment.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Top paying classes
    const topClasses = classOverviews
        .sort((a, b) => b.collectionRate - a.collectionRate)
        .slice(0, 5);

    // Students with overdue payments
    const studentsWithOverdue = studentSummaries.filter(s => s.totalOverdue > 0).length;

    // Average payment delay
    const paidPayments = payments.filter(p => p.paidDate && p.status === "paid");
    const averageDelay = paidPayments.length > 0 ?
        paidPayments.reduce((sum, p) => {
            const dueDate = new Date(p.dueDate);
            const paidDate = new Date(p.paidDate!);
            const delay = Math.max(0, (paidDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
            return sum + delay;
        }, 0) / paidPayments.length : 0;

    return (
        <div className="space-y-3 md:space-y-4 p-2 md:p-0">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <Card className="shadow-sm">
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg shrink-0">
                                <RiMoneyDollarCircleLine className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-muted-foreground truncate">
                                    {t('totalPayments') || 'Total Payments'}
                                </p>
                                <p className="text-lg md:text-2xl font-bold">{totalPayments}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="p-1.5 md:p-2 bg-green-100 rounded-lg shrink-0">
                                <RiReceiptLine className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-muted-foreground truncate">
                                    {t('collected') || 'Collected'}
                                </p>
                                <p className="text-sm md:text-lg font-bold">{formatCurrency(paidAmount)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Today's Overview */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="text-sm md:text-base flex items-center gap-2">
                        <RiTimeLine className="h-4 w-4" />
                        {t('todayCollections') || "Today's Collections"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                    <div className="text-center">
                        <p className="text-lg md:text-2xl font-bold text-green-600">{formatCurrency(todayAmount)}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">
                            {todayPayments.length} {t('payments') || 'payments'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="p-2 md:p-3 bg-blue-50 rounded-lg text-center">
                            <p className="text-sm md:text-lg font-bold text-blue-600">{formatCurrency(monthlyAmount)}</p>
                            <p className="text-xs text-muted-foreground">{t('thisMonth') || 'This Month'}</p>
                        </div>
                        <div className="p-2 md:p-3 bg-orange-50 rounded-lg text-center">
                            <p className="text-sm md:text-lg font-bold text-orange-600">{formatCurrency(overdueAmount)}</p>
                            <p className="text-xs text-muted-foreground">{t('overdue')}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Collection Performance */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="text-sm md:text-base flex items-center gap-2">
                        <RiBarChartLine className="h-4 w-4" />
                        {t('collectionPerformance') || 'Collection Performance'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                    <div>
                        <div className="flex justify-between text-xs md:text-sm mb-2">
                            <span>{t('collectionRate') || 'Collection Rate'}</span>
                            <span className="font-medium">{collectionRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={collectionRate} className="h-1.5 md:h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4 text-center">
                        <div>
                            <p className="text-sm md:text-lg font-bold">{formatCurrency(totalAmount)}</p>
                            <p className="text-xs text-muted-foreground">{t('totalDue') || 'Total Due'}</p>
                        </div>
                        <div>
                            <p className="text-sm md:text-lg font-bold">
                                {averageDelay.toFixed(1)} {t('days') || 'days'}
                            </p>
                            <p className="text-xs text-muted-foreground">{t('avgDelay') || 'Avg Delay'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="text-sm md:text-base flex items-center gap-2">
                        <RiGroupLine className="h-4 w-4" />
                        {t('paymentStatus') || 'Payment Status'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 md:space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <RiCheckLine className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                                <span className="text-xs md:text-sm">{t('paid')}</span>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-xs">
                                {statusDistribution.paid}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <RiTimeLine className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                                <span className="text-xs md:text-sm">{t('pending') || 'Pending'}</span>
                            </div>
                            <Badge variant="outline" className="bg-blue-50 text-xs">
                                {statusDistribution.pending}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <RiAlarmWarningLine className="h-3 w-3 md:h-4 md:w-4 text-red-600" />
                                <span className="text-xs md:text-sm">{t('overdue')}</span>
                            </div>
                            <Badge variant="outline" className="bg-red-50 text-xs">
                                {statusDistribution.overdue}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <RiBarChartLine className="h-3 w-3 md:h-4 md:w-4 text-orange-600" />
                                <span className="text-xs md:text-sm">{t('partial') || 'Partial'}</span>
                            </div>
                            <Badge variant="outline" className="bg-orange-50 text-xs">
                                {statusDistribution.partial}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="text-sm md:text-base flex items-center gap-2">
                        <RiBankLine className="h-4 w-4" />
                        {t('paymentMethods') || 'Payment Methods'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {Object.entries(methodDistribution)
                            .sort(([, a], [, b]) => b - a)
                            .map(([method, count]) => (
                                <div key={method} className="flex items-center justify-between">
                                    <span className="text-xs md:text-sm capitalize flex-1 mr-2 truncate">
                                        {method.replace('_', ' ')}
                                    </span>
                                    <Badge variant="outline" className="text-xs shrink-0">
                                        {count}
                                    </Badge>
                                </div>
                            ))}

                        {Object.keys(methodDistribution).length === 0 && (
                            <p className="text-xs md:text-sm text-muted-foreground text-center py-4">
                                {t('noPaymentMethods') || 'No payment methods recorded'}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Payment Types */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="text-sm md:text-base flex items-center gap-2">
                        <RiReceiptLine className="h-4 w-4" />
                        {t('paymentTypes') || 'Payment Types'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {Object.entries(typeDistribution)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 6)
                            .map(([type, count]) => (
                                <div key={type} className="flex items-center justify-between">
                                    <span className="text-xs md:text-sm capitalize flex-1 mr-2 truncate">
                                        {type.replace('_', ' ')}
                                    </span>
                                    <Badge
                                        variant={type === "tuition" ? "default" : "secondary"}
                                        className="text-xs shrink-0"
                                    >
                                        {count}
                                    </Badge>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>

            {/* Top Performing Classes */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="text-sm md:text-base flex items-center gap-2">
                        <RiRidingLine className="h-4 w-4" />
                        {t('topClasses') || 'Top Classes'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 md:space-y-3">
                        {topClasses.map((classOverview, index) => (
                            <div key={classOverview.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold shrink-0">
                                        {index + 1}
                                    </div>
                                    <span className="text-xs md:text-sm truncate">{classOverview.className}</span>
                                </div>
                                <Badge
                                    variant={classOverview.collectionRate >= 90 ? "default" : "secondary"}
                                    className="text-xs shrink-0 ml-2"
                                >
                                    {classOverview.collectionRate.toFixed(1)}%
                                </Badge>
                            </div>
                        ))}

                        {topClasses.length === 0 && (
                            <p className="text-xs md:text-sm text-muted-foreground text-center py-4">
                                {t('noClassData') || 'No class data available'}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Alerts & Issues */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="text-sm md:text-base flex items-center gap-2">
                        <RiAlarmWarningLine className="h-4 w-4" />
                        {t('alerts') || 'Alerts'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm flex-1 mr-2">
                            {t('studentsWithOverdue') || 'Students with Overdue'}
                        </span>
                        <Badge
                            variant={studentsWithOverdue > 0 ? "destructive" : "default"}
                            className="text-xs shrink-0"
                        >
                            {studentsWithOverdue}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm flex-1 mr-2">
                            {t('paymentPlans') || 'Payment Plans'}
                        </span>
                        <Badge variant="outline" className="text-xs shrink-0">
                            {paymentPlans.length}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm flex-1 mr-2">
                            {t('pendingAmount') || 'Pending Amount'}
                        </span>
                        <Badge variant="secondary" className="text-xs shrink-0">
                            {formatCurrency(pendingAmount)}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2 md:pb-3">
                    <CardTitle className="text-sm md:text-base">
                        {t('quickStats') || 'Quick Stats'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-3 md:gap-4 text-center">
                        <div>
                            <p className="text-base md:text-lg font-bold">{studentSummaries.length}</p>
                            <p className="text-xs text-muted-foreground">{t('students') || 'Students'}</p>
                        </div>
                        <div>
                            <p className="text-base md:text-lg font-bold">{classOverviews.length}</p>
                            <p className="text-xs text-muted-foreground">{t('classes') || 'Classes'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}