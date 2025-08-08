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
import { useState } from "react";
import type { Payment } from "./types";

interface CreatePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payment: Omit<Payment, "id">) => void;
}

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
  { id: "class_12", name: "4ème AM" },
];

const algerianStudents = [
  { id: "student_1", name: "Ahmed Benali", classId: "class_1" },
  { id: "student_2", name: "Fatima Benaissa", classId: "class_2" },
  { id: "student_3", name: "Mohamed Khelifi", classId: "class_3" },
  { id: "student_4", name: "Aicha Boumediene", classId: "class_4" },
  { id: "student_5", name: "Youcef Hamidi", classId: "class_5" },
];

const paymentTypes = [
  { value: "tuition", label: "Frais de scolarité", baseAmount: 15000 },
  { value: "registration", label: "Frais d'inscription", baseAmount: 5000 },
  { value: "books", label: "Manuels scolaires", baseAmount: 8000 },
  { value: "transport", label: "Transport scolaire", baseAmount: 3000 },
  { value: "meals", label: "Restauration", baseAmount: 4000 },
  { value: "activities", label: "Activités parascolaires", baseAmount: 2000 },
  { value: "exam_fees", label: "Frais d'examens", baseAmount: 1500 },
  { value: "other", label: "Autres frais", baseAmount: 1000 },
];

const categories = [
  { value: "monthly", label: "Mensuel" },
  { value: "quarterly", label: "Trimestriel" },
  { value: "semester", label: "Semestriel" },
  { value: "annual", label: "Annuel" },
  { value: "one_time", label: "Ponctuel" },
];

export function CreatePaymentDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreatePaymentDialogProps) {
  const [formData, setFormData] = useState({
    studentId: "",
    amount: "",
    type: "" as Payment["type"] | "",
    category: "" as Payment["category"] | "",
    dueDate: undefined as Date | undefined,
    description: "",
    academicYear: "2024-2025",
    semester: "Premier semestre",
    installmentNumber: "",
    totalInstallments: "",
    discount: "",
    discountReason: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.studentId ||
      !formData.amount ||
      !formData.type ||
      !formData.category ||
      !formData.dueDate ||
      !formData.description
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedStudent = algerianStudents.find(
        (s) => s.id === formData.studentId,
      );
      const selectedClass = algerianClasses.find(
        (c) => c.id === selectedStudent?.classId,
      );

      if (!selectedStudent || !selectedClass) {
        return;
      }

      const payment: Omit<Payment, "id"> = {
        studentId: formData.studentId,
        studentName: selectedStudent.name,
        classId: selectedClass.id,
        className: selectedClass.name,
        parentId: `parent_${formData.studentId}`,
        parentName: `Parent de ${selectedStudent.name}`,
        amount: parseFloat(formData.amount),
        currency: "DZD",
        type: formData.type,
        category: formData.category,
        status: "pending",
        dueDate: formData.dueDate.toISOString().split("T")[0],
        remainingAmount: parseFloat(formData.amount),
        description: formData.description,
        academicYear: formData.academicYear,
        semester: formData.semester,
        installmentNumber: formData.installmentNumber
          ? parseInt(formData.installmentNumber)
          : undefined,
        totalInstallments: formData.totalInstallments
          ? parseInt(formData.totalInstallments)
          : undefined,
        discount: formData.discount ? parseFloat(formData.discount) : undefined,
        discountReason: formData.discountReason || undefined,
        notes: formData.notes || undefined,
        createdBy: "Admin Système",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onSubmit(payment);

      // Reset form
      setFormData({
        studentId: "",
        amount: "",
        type: "",
        category: "",
        dueDate: undefined,
        description: "",
        academicYear: "2024-2025",
        semester: "Premier semestre",
        installmentNumber: "",
        totalInstallments: "",
        discount: "",
        discountReason: "",
        notes: "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: string,
    value: string | Date | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-fill amount based on payment type
    if (field === "type" && typeof value === "string") {
      const paymentType = paymentTypes.find((pt) => pt.value === value);
      if (paymentType) {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
          amount: paymentType.baseAmount.toString(),
          description: paymentType.label,
        }));
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un Paiement</DialogTitle>
          <DialogDescription>
            Créer un nouveau paiement pour un étudiant.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentId">Étudiant *</Label>
            <Select
              value={formData.studentId}
              onValueChange={(value) => handleInputChange("studentId", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un étudiant" />
              </SelectTrigger>
              <SelectContent>
                {algerianStudents.map((student) => {
                  const studentClass = algerianClasses.find(
                    (c) => c.id === student.classId,
                  );
                  return (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} - {studentClass?.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

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
                placeholder="15000"
                required
              />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Description du paiement"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="academicYear">Année académique</Label>
              <Input
                id="academicYear"
                value={formData.academicYear}
                onChange={(e) =>
                  handleInputChange("academicYear", e.target.value)
                }
                placeholder="2024-2025"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semestre</Label>
              <Select
                value={formData.semester}
                onValueChange={(value) => handleInputChange("semester", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le semestre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Premier semestre">
                    Premier semestre
                  </SelectItem>
                  <SelectItem value="Deuxième semestre">
                    Deuxième semestre
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.category !== "one_time" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="installmentNumber">Numéro d'échéance</Label>
                <Input
                  id="installmentNumber"
                  type="number"
                  min="1"
                  value={formData.installmentNumber}
                  onChange={(e) =>
                    handleInputChange("installmentNumber", e.target.value)
                  }
                  placeholder="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalInstallments">Total d'échéances</Label>
                <Input
                  id="totalInstallments"
                  type="number"
                  min="1"
                  value={formData.totalInstallments}
                  onChange={(e) =>
                    handleInputChange("totalInstallments", e.target.value)
                  }
                  placeholder="10"
                />
              </div>
            </div>
          )}

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
              {isSubmitting ? "Création..." : "Créer le Paiement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
