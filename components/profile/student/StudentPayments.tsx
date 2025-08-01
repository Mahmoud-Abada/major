import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, Eye, Receipt } from "lucide-react";
import { ProfileTable, TableColumn } from "../ProfileTable";
import { StatusBadge } from "../StatusBadge";

interface Payment {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: string;
  receiptUrl?: string;
}

interface StudentPaymentsProps {
  payments: Payment[];
  totalDue: number;
  totalPaid: number;
  currency?: string;
  onViewPayment?: (paymentId: string) => void;
  onDownloadReceipt?: (receiptUrl: string) => void;
  onMakePayment?: (paymentId: string) => void;
}

export function StudentPayments({
  payments,
  totalDue,
  totalPaid,
  currency = "USD",
  onViewPayment,
  onDownloadReceipt,
  onMakePayment,
}: StudentPaymentsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const columns: TableColumn[] = [
    { header: "Description", accessorKey: "description" },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (value) => formatCurrency(value),
    },
    {
      header: "Due Date",
      accessorKey: "dueDate",
      cell: (value) => new Date(value).toLocaleDateString(),
    },
    {
      header: "Paid Date",
      accessorKey: "paidDate",
      cell: (value) => (value ? new Date(value).toLocaleDateString() : "-"),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (value) => <StatusBadge status={value} />,
    },
  ];

  // Calculate payment statistics
  const paidPayments = payments.filter(
    (p) => p.status.toLowerCase() === "paid",
  );
  const pendingPayments = payments.filter(
    (p) => p.status.toLowerCase() === "pending",
  );
  const overduePayments = payments.filter(
    (p) => p.status.toLowerCase() === "overdue",
  );

  const paymentProgress = totalDue > 0 ? (totalPaid / totalDue) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalDue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(totalPaid)}
            </div>
            <Progress value={paymentProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingPayments.length}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {formatCurrency(
                pendingPayments.reduce((sum, p) => sum + p.amount, 0),
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">
              {overduePayments.length}
            </div>
            <div className="text-sm text-red-500 mt-1">
              {formatCurrency(
                overduePayments.reduce((sum, p) => sum + p.amount, 0),
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ProfileTable
        columns={columns}
        data={payments}
        actions={(row) => (
          <div className="flex space-x-2">
            {onViewPayment && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onViewPayment(row.id)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            )}
            {row.receiptUrl &&
              onDownloadReceipt &&
              row.status.toLowerCase() === "paid" && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDownloadReceipt(row.receiptUrl!)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Receipt
                </Button>
              )}
            {row.status.toLowerCase() !== "paid" && onMakePayment && (
              <Button
                size="sm"
                variant="default"
                onClick={() => onMakePayment(row.id)}
              >
                <Receipt className="h-4 w-4 mr-1" />
                Pay
              </Button>
            )}
          </div>
        )}
        emptyState={
          <div className="text-center py-8">
            <Receipt className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">
              No payment records found
            </p>
          </div>
        }
      />
    </div>
  );
}
