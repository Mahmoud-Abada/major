import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Download, Eye, FileText } from "lucide-react";
import { ProfileTable, TableColumn } from "../ProfileTable";
import { StatusBadge } from "../StatusBadge";

interface Payment {
  id: string;
  invoiceNumber: string;
  amount: number;
  date: string;
  dueDate: string;
  status: string;
  type: string;
  description: string;
  childName?: string;
  childId?: string;
  receiptUrl?: string;
}

interface ParentPaymentsProps {
  payments: Payment[];
  totalPaid: number;
  totalDue: number;
  onViewPayment?: (paymentId: string) => void;
  onDownloadReceipt?: (url: string) => void;
  onMakePayment?: (paymentId: string) => void;
}

export function ParentPayments({
  payments,
  totalPaid,
  totalDue,
  onViewPayment,
  onDownloadReceipt,
  onMakePayment,
}: ParentPaymentsProps) {
  const columns: TableColumn[] = [
    { header: "Invoice #", accessorKey: "invoiceNumber" },
    {
      header: "Description",
      accessorKey: "description",
      cell: (value, row) => (
        <div>
          <div>{value}</div>
          {row.childName && (
            <div className="text-xs text-muted-foreground">
              {row.childId ? (
                <a
                  href={`/classroom/students/${row.childId}`}
                  className="hover:underline"
                >
                  {row.childName}
                </a>
              ) : (
                row.childName
              )}
            </div>
          )}
        </div>
      ),
    },
    { header: "Type", accessorKey: "type" },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (value) => `$${value.toFixed(2)}`,
    },
    {
      header: "Date",
      accessorKey: "date",
      cell: (value) => new Date(value).toLocaleDateString(),
    },
    {
      header: "Due Date",
      accessorKey: "dueDate",
      cell: (value) => new Date(value).toLocaleDateString(),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (value) => <StatusBadge status={value} />,
    },
  ];

  // Filter payments by status
  const paidPayments = payments.filter(
    (payment) => payment.status.toLowerCase() === "paid",
  );
  const pendingPayments = payments.filter(
    (payment) => payment.status.toLowerCase() === "pending",
  );
  const overduePayments = payments.filter(
    (payment) => payment.status.toLowerCase() === "overdue",
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ${totalPaid.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">
              ${totalDue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              $
              {overduePayments
                .reduce((sum, payment) => sum + payment.amount, 0)
                .toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Payments</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
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
                {row.status.toLowerCase() === "paid" &&
                  row.receiptUrl &&
                  onDownloadReceipt && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDownloadReceipt(row.receiptUrl!)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Receipt
                    </Button>
                  )}
                {(row.status.toLowerCase() === "pending" ||
                  row.status.toLowerCase() === "overdue") &&
                  onMakePayment && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => onMakePayment(row.id)}
                    >
                      <CreditCard className="h-4 w-4 mr-1" />
                      Pay Now
                    </Button>
                  )}
              </div>
            )}
            emptyState={
              <div className="text-center py-8">
                <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  No payment records found
                </p>
              </div>
            }
          />
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <ProfileTable
            columns={columns}
            data={pendingPayments}
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
                {onMakePayment && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onMakePayment(row.id)}
                  >
                    <CreditCard className="h-4 w-4 mr-1" />
                    Pay Now
                  </Button>
                )}
              </div>
            )}
            emptyState={
              <div className="text-center py-8">
                <p className="text-muted-foreground">No pending payments</p>
              </div>
            }
          />
        </TabsContent>

        <TabsContent value="paid" className="mt-6">
          <ProfileTable
            columns={columns}
            data={paidPayments}
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
                {row.receiptUrl && onDownloadReceipt && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDownloadReceipt(row.receiptUrl!)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Receipt
                  </Button>
                )}
              </div>
            )}
            emptyState={
              <div className="text-center py-8">
                <p className="text-muted-foreground">No paid payments</p>
              </div>
            }
          />
        </TabsContent>

        <TabsContent value="overdue" className="mt-6">
          <ProfileTable
            columns={columns}
            data={overduePayments}
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
                {onMakePayment && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onMakePayment(row.id)}
                  >
                    <CreditCard className="h-4 w-4 mr-1" />
                    Pay Now
                  </Button>
                )}
              </div>
            )}
            emptyState={
              <div className="text-center py-8">
                <p className="text-muted-foreground">No overdue payments</p>
              </div>
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
