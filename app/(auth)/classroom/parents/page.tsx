"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  addParent,
  deleteParent,
  selectFilteredParents,
  selectParentsLoading,
  updateParent,
} from "@/store/slices/classroom/parentsSlice";
import { Parent, ParentFormData } from "@/types/classroom";
import { Edit, Eye, Trash2, UserPlus } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Custom columns for parents with enhanced actions
const getParentColumns = (
  onEdit: (parent: Parent) => void,
  onDelete: (id: string) => void,
  onView: (id: string) => void
) => [
    {
      id: "select",
      header: "Select",
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "ID",
      accessorKey: "parentId",
    },
    {
      header: "Status",
      accessorKey: "status",
    },
    {
      header: "Relationship",
      accessorKey: "relationship",
      cell: ({ row }: { row: { original: Parent } }) => (
        <span>
          {row.original.relationship === "Father" ? "والد" :
            row.original.relationship === "Mother" ? "والدة" :
              row.original.relationship === "Guardian" ? "وصي" : "آخر"}
        </span>
      ),
    },
    {
      header: "Children",
      accessorKey: "studentIds",
      cell: ({ row }: { row: { original: Parent } }) => (
        <span>{row.original.studentIds.length} طفل</span>
      ),
    },
    {
      header: "Wilaya",
      accessorKey: "wilaya",
    },
    {
      header: "Occupation",
      accessorKey: "occupation",
    },
    {
      header: "Pending Amount",
      accessorKey: "pendingAmount",
      cell: ({ row }: { row: { original: Parent } }) => (
        <span className={row.original.pendingAmount > 0 ? "text-red-600" : "text-green-600"}>
          {row.original.pendingAmount.toLocaleString()} دج
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: Parent } }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onView(row.original.id);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row.original);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row.original.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

export default function ParentsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const parents = useSelector(selectFilteredParents);
  const loading = useSelector(selectParentsLoading);

  const [showForm, setShowForm] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Import the DataView component dynamically to avoid SSR issues with window
  const DataView = dynamic(
    () => import("@/components/classroom/contacts-table"),
    {
      ssr: false,
      loading: () => <p>Loading table...</p>,
    }
  );

  const handleAddParent = () => {
    setEditingParent(null);
    setShowForm(true);
  };

  const handleEditParent = (parent: Parent) => {
    setEditingParent(parent);
    setShowForm(true);
  };

  const handleDeleteParent = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الولي؟")) {
      dispatch(deleteParent(id));
    }
  };

  const handleViewParent = (id: string) => {
    router.push(`/classroom/parents/${id}`);
  };

  const handleSubmitForm = (data: ParentFormData) => {
    if (editingParent) {
      dispatch(updateParent({ id: editingParent.id, data }));
    } else {
      dispatch(addParent(data));
    }
    setShowForm(false);
    setEditingParent(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingParent(null);
  };

  const getFilteredParents = (filterType: string) => {
    switch (filterType) {
      case "active":
        return parents.filter((parent) => parent.status === "Active");
      case "inactive":
        return parents.filter((parent) => parent.status === "Inactive");
      case "fathers":
        return parents.filter((parent) => parent.relationship === "Father");
      case "mothers":
        return parents.filter((parent) => parent.relationship === "Mother");
      case "guardians":
        return parents.filter((parent) => parent.relationship === "Guardian");
      case "pending-payments":
        return parents.filter((parent) => parent.pendingAmount > 0);
      case "multiple-children":
        return parents.filter((parent) => parent.studentIds.length > 1);
      case "algiers":
        return parents.filter((parent) => parent.wilaya === "الجزائر");
      default:
        return parents;
    }
  };

  const columns = getParentColumns(handleEditParent, handleDeleteParent, handleViewParent);

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة أولياء الأمور</h1>
        <Button onClick={handleAddParent}>
          <UserPlus className="mr-2 h-4 w-4" />
          إضافة ولي أمر
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">جميع الأولياء</TabsTrigger>
          <TabsTrigger value="active">نشط</TabsTrigger>
          <TabsTrigger value="inactive">غير نشط</TabsTrigger>
          <TabsTrigger value="fathers">الآباء</TabsTrigger>
          <TabsTrigger value="mothers">الأمهات</TabsTrigger>
          <TabsTrigger value="guardians">الأوصياء</TabsTrigger>
          <TabsTrigger value="pending-payments">مدفوعات معلقة</TabsTrigger>
          <TabsTrigger value="multiple-children">أطفال متعددون</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>جميع أولياء الأمور</CardTitle>
              <CardDescription>
                إدارة جميع أولياء الأمور في النظام. انقر على ولي أمر لعرض ملفه الشخصي.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>جاري تحميل أولياء الأمور...</p>
                </div>
              ) : (
                <DataView
                  initialData={getFilteredParents("all")}
                  columns={columns}
                  onRowClick={(parent) => handleViewParent(parent.id)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>أولياء الأمور النشطون</CardTitle>
              <CardDescription>
                عرض وإدارة أولياء الأمور النشطين حالياً.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>جاري تحميل أولياء الأمور...</p>
                </div>
              ) : (
                <DataView
                  initialData={getFilteredParents("active")}
                  columns={columns}
                  onRowClick={(parent) => handleViewParent(parent.id)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>أولياء الأمور غير النشطين</CardTitle>
              <CardDescription>
                عرض وإدارة أولياء الأمور غير النشطين.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>جاري تحميل أولياء الأمور...</p>
                </div>
              ) : (
                <DataView
                  initialData={getFilteredParents("inactive")}
                  columns={columns}
                  onRowClick={(parent) => handleViewParent(parent.id)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fathers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>الآباء</CardTitle>
              <CardDescription>
                عرض وإدارة الآباء المسجلين في النظام.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>جاري تحميل الآباء...</p>
                </div>
              ) : (
                <DataView
                  initialData={getFilteredParents("fathers")}
                  columns={columns}
                  onRowClick={(parent) => handleViewParent(parent.id)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mothers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>الأمهات</CardTitle>
              <CardDescription>
                عرض وإدارة الأمهات المسجلات في النظام.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>جاري تحميل الأمهات...</p>
                </div>
              ) : (
                <DataView
                  initialData={getFilteredParents("mothers")}
                  columns={columns}
                  onRowClick={(parent) => handleViewParent(parent.id)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guardians" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>الأوصياء</CardTitle>
              <CardDescription>
                عرض وإدارة الأوصياء المسجلين في النظام.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>جاري تحميل الأوصياء...</p>
                </div>
              ) : (
                <DataView
                  initialData={getFilteredParents("guardians")}
                  columns={columns}
                  onRowClick={(parent) => handleViewParent(parent.id)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending-payments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>مدفوعات معلقة</CardTitle>
              <CardDescription>
                عرض أولياء الأمور الذين لديهم مدفوعات معلقة.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>جاري تحميل البيانات...</p>
                </div>
              ) : (
                <DataView
                  initialData={getFilteredParents("pending-payments")}
                  columns={columns}
                  onRowClick={(parent) => handleViewParent(parent.id)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="multiple-children" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>أولياء أمور لأطفال متعددين</CardTitle>
              <CardDescription>
                عرض أولياء الأمور الذين لديهم أكثر من طفل واحد.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>جاري تحميل البيانات...</p>
                </div>
              ) : (
                <DataView
                  initialData={getFilteredParents("multiple-children")}
                  columns={columns}
                  onRowClick={(parent) => handleViewParent(parent.id)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Parent Form Dialog - We'll create this component next */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingParent ? "تعديل بيانات ولي الأمر" : "إضافة ولي أمر جديد"}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>Parent form will be implemented next...</p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={handleCancelForm}>
                إلغاء
              </Button>
              <Button onClick={() => handleSubmitForm({} as ParentFormData)}>
                حفظ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}