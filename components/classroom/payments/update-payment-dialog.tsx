"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { RiCalendarLine } from "@remixicon/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import type { Payment } from "./types";

interface UpdatePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment;
  onSubmit: (payment: Payment) => void;
}

const paymentTypes = [
  { value: "tuition", label: "Frais de scolarité" },
  { value: "registration", label: "Frais d'inscription" },
  { value: "books", label: "Manuels scolaires" },
  { value: "transport", label: "Transport scolaire" },
  { value: "meals", label: "Restauration" },
  { value: "activities", label: "Activités parascolaires" },
  { value: "exam_fees", label: "Frais d'examens" },
  { value: "other", label: "Autres frais" },
];

const categories = [
  { value: "monthly", label: "Mensuel" },
  { value: "quarterly", label: "Trimestriel" },
  { value: "semester", label: "Semestriel" },
  { value: "annual", label: "Annuel" },
  { value: "one_time", label: "Ponctuel" },
];

const statuses = [
  { value: "pending", label: "En attente" },
  { value: "paid", label: "Payé" },
  { value: "overdue", label: "En retard" },
  { value: "partial", label: "Partiel" },
  { value: "cancelled", label: "Annulé" },
  { value: "refunded", label: "Remboursé" },
];

export function UpdatePaymentDialog({
  open,
  onOpenChange,
  payment,
  onSubmit,
}: UpdatePaymentDialogProps) {
  const [formData, setFormData] = useState({
    amount: "",
    type: "" as Payment["type"] | "",
    category: "" as Payment["category"] | "",
    status: "" as Payment["status"] | "",
    dueDate: undefined as Date | undefined,
    description: "",
    discount: "",
    discountReason: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when payment changes
  useEffect(() => {
    if (payment) {
      setFormData({
        amount: payment.amount.toString(),
        type: payment.type,
        category: payment.category,
        status: payment.status,
        dueDate: new Date(payment.dueDate),
        description: payment.description,
        discount: payment.discount?.toString() || "",
        discountReason: payment.discountReason || "",
        notes: payment.notes || "",
      });
    }
  }, [payment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.amount ||
      !formData.type ||
      !formData.category ||
      !formData.status ||
      !formData.dueDate ||
      !formData.description
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedPayment: Payment = {
        ...payment,
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        status: formData.status,
        dueDate: formData.dueDate.toISOString().split("T")[0],
        description: formData.description,
        discount: formData.discount ? parseFloat(formData.discount) : undefined,
        discountReason: formData.discountReason || undefined,
        notes: formData.notes || undefined,
        remainingAmount:
          formData.status === "paid"
            ? 0
            : formData.status === "partial"
              ? parseFloat(formData.amount) - (payment.paidAmount || 0)
              : parseFloat(formData.amount),
        updatedAt: new Date().toISOString(),
      };

      onSubmit(updatedPayment);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: string,
    value: string | Date | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le Paiement</DialogTitle>
          <DialogDescription>
            Modifier les détails du paiement pour {payment.studentName}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type de paiement *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  {paymentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant (DZD) *</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="100"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le statut" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Date d'échéance *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dueDate && "text-muted-foreground",
                  )}
                >
                  <RiCalendarLine className="mr-2 h-4 w-4" />
                  {formData.dueDate
                    ? format(formData.dueDate, "PPP")
                    : "Choisir une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.dueDate}
                  onSelect={(date) => handleInputChange("dueDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount">Remise (DZD)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                value={formData.discount}
                onChange={(e) => handleInputChange("discount", e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountReason">Raison de la remise</Label>
              <Input
                id="discountReason"
                value={formData.discountReason}
                onChange={(e) =>
                  handleInputChange("discountReason", e.target.value)
                }
                placeholder="Bourse d'excellence"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Notes additionnelles..."
              rows={3}
            />
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
              {isSubmitting ? "Modification..." : "Modifier le Paiement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
