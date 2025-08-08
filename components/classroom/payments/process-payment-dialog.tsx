"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RiBankLine, RiMoneyDollarCircleLine } from "@remixicon/react";
import { useState } from "react";
import type { Payment } from "./types";

interface ProcessPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment;
  onSubmit: (paymentId: string, processData: any) => void;
}

const paymentMethods = [
  { value: "cash", label: "Espèces" },
  { value: "bank_transfer", label: "Virement bancaire" },
  { value: "check", label: "Chèque" },
  { value: "card", label: "Carte bancaire" },
  { value: "mobile_payment", label: "Paiement mobile" },
];

export function ProcessPaymentDialog({
  open,
  onOpenChange,
  payment,
  onSubmit,
}: ProcessPaymentDialogProps) {
  const [formData, setFormData] = useState({
    paidAmount: (payment.remainingAmount || payment.amount).toString(),
    paymentMethod: "" as Payment["paymentMethod"] | "",
    transactionId: "",
    receiptNumber: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-DZ", {
      style: "currency",
      currency: "DZD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.paidAmount || !formData.paymentMethod) {
      return;
    }

    const paidAmount = parseFloat(formData.paidAmount);
    const remainingAmount = payment.remainingAmount || payment.amount;

    if (paidAmount <= 0 || paidAmount > remainingAmount) {
      return;
    }

    setIsSubmitting(true);

    try {
      const processData = {
        paidAmount,
        paymentMethod: formData.paymentMethod,
        transactionId: formData.transactionId || undefined,
        receiptNumber:
          formData.receiptNumber ||
          `REC${new Date().getFullYear()}${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
        notes: formData.notes || undefined,
        processedBy: "Comptable Principal",
      };

      onSubmit(payment.id, processData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-generate transaction ID for certain payment methods
    if (
      field === "paymentMethod" &&
      (value === "bank_transfer" || value === "card")
    ) {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
      }));
    }
  };

  const remainingAmount = payment.remainingAmount || payment.amount;
  const paidAmount = parseFloat(formData.paidAmount) || 0;
  const isPartialPayment = paidAmount < remainingAmount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RiMoneyDollarCircleLine className="h-5 w-5" />
            Traiter le Paiement
          </DialogTitle>
          <DialogDescription>
            Enregistrer le paiement reçu de l'étudiant.
          </DialogDescription>
        </DialogHeader>

        {/* Payment Information */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Étudiant:</span>
            <span className="text-sm">{payment.studentName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Description:</span>
            <span className="text-sm">{payment.description}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Montant dû:</span>
            <span className="text-sm font-mono font-medium">
              {formatCurrency(remainingAmount)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Statut actuel:</span>
            <Badge
              variant={
                payment.status === "pending"
                  ? "secondary"
                  : payment.status === "partial"
                    ? "outline"
                    : "destructive"
              }
            >
              {payment.status}
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paidAmount">Montant payé (DZD) *</Label>
            <Input
              id="paidAmount"
              type="number"
              min="0"
              max={remainingAmount}
              step="100"
              value={formData.paidAmount}
              onChange={(e) => handleInputChange("paidAmount", e.target.value)}
              required
            />
            {isPartialPayment && paidAmount > 0 && (
              <p className="text-sm text-orange-600">
                Paiement partiel - Reste:{" "}
                {formatCurrency(remainingAmount - paidAmount)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Méthode de paiement *</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) =>
                handleInputChange("paymentMethod", value)
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner la méthode" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    <div className="flex items-center gap-2">
                      <RiBankLine size={16} />
                      {method.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(formData.paymentMethod === "bank_transfer" ||
            formData.paymentMethod === "card") && (
            <div className="space-y-2">
              <Label htmlFor="transactionId">ID de transaction</Label>
              <Input
                id="transactionId"
                value={formData.transactionId}
                onChange={(e) =>
                  handleInputChange("transactionId", e.target.value)
                }
                placeholder="TXN123456789"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="receiptNumber">Numéro de reçu</Label>
            <Input
              id="receiptNumber"
              value={formData.receiptNumber}
              onChange={(e) =>
                handleInputChange("receiptNumber", e.target.value)
              }
              placeholder="REC20240001"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Notes sur le paiement..."
              rows={3}
            />
          </div>

          {/* Payment Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Résumé du paiement:</span>
            </div>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Montant payé:</span>
                <span className="font-mono">{formatCurrency(paidAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Reste à payer:</span>
                <span className="font-mono">
                  {formatCurrency(Math.max(0, remainingAmount - paidAmount))}
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Nouveau statut:</span>
                <Badge variant={isPartialPayment ? "outline" : "default"}>
                  {isPartialPayment ? "Partiel" : "Payé"}
                </Badge>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Traitement..." : "Traiter le Paiement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
