"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
    RiAlarmWarningLine,
    RiBankLine,
    RiBarChartLine,
    RiCheckLine,
    RiInformationLine,
    RiReceiptLine,
    RiTimeLine,
    RiUserLine
} from "@remixicon/react";
import type { ClassPaymentOverview, Payment, StudentPaymentSummary } from "./types";

interface PaymentDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: Payment | StudentPaymentSummary | ClassPaymentOverview | null;
}

export function PaymentDetailsDialog({ open, onOpenChange, data }: PaymentDetailsDialogProps) {
    if (!data) return null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-DZ', {
            style: 'currency',
            currency: 'DZD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Determine the type of data
    const isPayment = 'amount' in data && 'dueDate' in data;
    const isStudentSummary = 'totalDue' in data && 'paymentHistory' in data;
    const isClassOverview = 'totalStudents' in data && 'paymentDistribution' in data;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {isPayment && <RiReceiptLine className="h-5 w-5" />}
                        {isStudentSummary && <RiUserLine className="h-5 w-5" />}
                        {isClassOverview && <RiBarChartLine className="h-5 w-5" />}
                        {isPayment && `Paiement - ${(data as Payment).studentName}`}
                        {isStudentSummary && `Résumé - ${(data as StudentPaymentSummary).studentName}`}
                        {isClassOverview && `Classe - ${(data as ClassPaymentOverview).className}`}
                    </DialogTitle>
                    <DialogDescription>
                        {isPayment && "Détails du paiement"}
                        {isStudentSummary && "Résumé des paiements de l'étudiant"}
                        {isClassOverview && "Vue d'ensemble des paiements de la classe"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Payment Details */}
                    {isPayment && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <RiInformationLine className="h-4 w-4" />
                                        Informations du Paiement
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Étudiant</p>
                                            <p className="text-sm font-medium mt-1">{(data as Payment).studentName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Classe</p>
                                            <p className="text-sm font-medium mt-1">{(data as Payment).className}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Type</p>
                                            <Badge variant="outline" className="mt-1">
                                                {(data as Payment).description}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Catégorie</p>
                                            <Badge variant="secondary" className="mt-1 capitalize">
                                                {(data as Payment).category}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Montant</p>
                                            <p className="text-lg font-bold mt-1">
                                                {formatCurrency((data as Payment).amount)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Payé</p>
                                            <p className="text-lg font-bold text-green-600 mt-1">
                                                {formatCurrency((data as Payment).paidAmount || 0)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Reste</p>
                                            <p className="text-lg font-bold text-orange-600 mt-1">
                                                {formatCurrency((data as Payment).remainingAmount || (data as Payment).amount)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Date d'échéance</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <RiTimeLine className="h-4 w-4 text-muted-foreground" />
                                                <p className="text-sm font-medium">
                                                    {new Date((data as Payment).dueDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Statut</p>
                                            <Badge
                                                variant={
                                                    (data as Payment).status === "paid" ? "default" :
                                                        (data as Payment).status === "partial" ? "secondary" :
                                                            (data as Payment).status === "overdue" ? "destructive" :
                                                                (data as Payment).status === "cancelled" ? "outline" : "secondary"
                                                }
                                                className="mt-1"
                                            >
                                                <div className="flex items-center gap-1">
                                                    {(data as Payment).status === "paid" && <RiCheckLine size={14} />}
                                                    {(data as Payment).status === "overdue" && <RiAlarmWarningLine size={14} />}
                                                    {(data as Payment).status}
                                                </div>
                                            </Badge>
                                        </div>
                                    </div>

                                    {(data as Payment).paymentMethod && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Méthode</p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <RiBankLine className="h-4 w-4 text-muted-foreground" />
                                                    <p className="text-sm font-medium capitalize">
                                                        {(data as Payment).paymentMethod?.replace('_', ' ')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Date de paiement</p>
                                                <p className="text-sm font-medium mt-1">
                                                    {(data as Payment).paidDate ?
                                                        new Date((data as Payment).paidDate!).toLocaleDateString() :
                                                        "Non payé"
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {((data as Payment).discount || (data as Payment).lateFee) && (
                                        <div className="grid grid-cols-2 gap-4">
                                            {(data as Payment).discount && (
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Remise</p>
                                                    <p className="text-sm font-medium text-green-600 mt-1">
                                                        -{formatCurrency((data as Payment).discount!)}
                                                    </p>
                                                    {(data as Payment).discountReason && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {(data as Payment).discountReason}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                            {(data as Payment).lateFee && (
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Frais de retard</p>
                                                    <p className="text-sm font-medium text-red-600 mt-1">
                                                        +{formatCurrency((data as Payment).lateFee!)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {(data as Payment).notes && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Notes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            {(data as Payment).notes}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}

                    {/* Student Summary Details */}
                    {isStudentSummary && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <RiInformationLine className="h-4 w-4" />
                                        Résumé Étudiant
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Étudiant</p>
                                            <p className="text-sm font-medium mt-1">{(data as StudentPaymentSummary).studentName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Classe</p>
                                            <p className="text-sm font-medium mt-1">{(data as StudentPaymentSummary).className}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-4 text-center">
                                        <div className="p-3 bg-muted/50 rounded-lg">
                                            <p className="text-lg font-bold">{formatCurrency((data as StudentPaymentSummary).totalDue)}</p>
                                            <p className="text-xs text-muted-foreground">Total Dû</p>
                                        </div>
                                        <div className="p-3 bg-green-50 rounded-lg">
                                            <p className="text-lg font-bold text-green-600">
                                                {formatCurrency((data as StudentPaymentSummary).totalPaid)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Payé</p>
                                        </div>
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <p className="text-lg font-bold text-blue-600">
                                                {formatCurrency((data as StudentPaymentSummary).totalPending)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">En Attente</p>
                                        </div>
                                        <div className="p-3 bg-red-50 rounded-lg">
                                            <p className="text-lg font-bold text-red-600">
                                                {formatCurrency((data as StudentPaymentSummary).totalOverdue)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">En Retard</p>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Taux de Recouvrement</span>
                                            <span className="font-medium">
                                                {(data as StudentPaymentSummary).collectionRate.toFixed(1)}%
                                            </span>
                                        </div>
                                        <Progress value={(data as StudentPaymentSummary).collectionRate} className="h-2" />
                                    </div>
                                </CardContent>
                            </Card>

                            {(data as StudentPaymentSummary).upcomingPayments.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Paiements à Venir</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {(data as StudentPaymentSummary).upcomingPayments.slice(0, 3).map((payment) => (
                                                <div key={payment.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                                    <div>
                                                        <p className="text-sm font-medium">{payment.description}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Échéance: {new Date(payment.dueDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <Badge variant="outline">
                                                        {formatCurrency(payment.amount)}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}

                    {/* Class Overview Details */}
                    {isClassOverview && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <RiBarChartLine className="h-4 w-4" />
                                        Vue d'Ensemble de la Classe
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Classe</p>
                                            <p className="text-sm font-medium mt-1">{(data as ClassPaymentOverview).className}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Nombre d'étudiants</p>
                                            <p className="text-lg font-bold mt-1">{(data as ClassPaymentOverview).totalStudents}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-4 text-center">
                                        <div className="p-3 bg-muted/50 rounded-lg">
                                            <p className="text-lg font-bold">{formatCurrency((data as ClassPaymentOverview).totalDue)}</p>
                                            <p className="text-xs text-muted-foreground">Total Dû</p>
                                        </div>
                                        <div className="p-3 bg-green-50 rounded-lg">
                                            <p className="text-lg font-bold text-green-600">
                                                {formatCurrency((data as ClassPaymentOverview).totalPaid)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Collecté</p>
                                        </div>
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <p className="text-lg font-bold text-blue-600">
                                                {formatCurrency((data as ClassPaymentOverview).totalPending)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">En Attente</p>
                                        </div>
                                        <div className="p-3 bg-red-50 rounded-lg">
                                            <p className="text-lg font-bold text-red-600">
                                                {formatCurrency((data as ClassPaymentOverview).totalOverdue)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">En Retard</p>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Taux de Recouvrement</span>
                                            <span className="font-medium">
                                                {(data as ClassPaymentOverview).collectionRate.toFixed(1)}%
                                            </span>
                                        </div>
                                        <Progress value={(data as ClassPaymentOverview).collectionRate} className="h-2" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div>
                                            <p className="text-lg font-bold">{(data as ClassPaymentOverview).studentsWithOverdue}</p>
                                            <p className="text-xs text-muted-foreground">Étudiants en Retard</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold">{(data as ClassPaymentOverview).averagePaymentDelay.toFixed(1)} jours</p>
                                            <p className="text-xs text-muted-foreground">Retard Moyen</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}