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
  addTeacher,
  deleteTeacher,
  selectFilteredTeachers,
  selectTeachersLoading,
  updateTeacher,
} from "@/store/slices/classroom/teachersSlice";
import { Teacher, TeacherFormData } from "@/types/classroom";
import { Edit, Eye, Trash2, UserPlus } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Custom columns for teachers with enhanced actions
const getTeacherColumns = (
  onEdit: (teacher: Teacher) => void,
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
      accessorKey: "teacherId",
    },
    {
      header: "Status",
      accessorKey: "status",
    },
    {
      header: "Specialization",
      accessorKey: "specialization",
      cell: ({ row }: { row: { original: Teacher } }) => (
        <span>{row.original.specialization.slice(0, 2).join(", ")}</span>
      ),
    },
    {
      header: "Experience",
      accessorKey: "experience",
      cell: ({ row }: { row: { original: Teacher } }) => (
        <span>{row.original.experience} سنة</span>
      ),
    },
    {
      header: "Classes",
      accessorKey: "classIds",
      cell: ({ row }: { row: { original: Teacher } }) => (
        <span>{row.original.classIds.length}</span>
      ),
    },
    {
      header: "Salary",
      accessorKey: "salary",
      cell: ({ row }: { row: { original: Teacher } }) => (
        <span>{row.original.salary.toLocaleString()} دج</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: Teacher } }) => (
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

export default function TeachersPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const teachers = useSelector(selectFilteredTeachers);
  const loading = useSelector(selectTeachersLoading);

  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Import the DataView component dynamically to avoid SSR issues with window
  const DataView = dynamic(
    () => import("@/components/classroom/contacts-table"),
    {
      ssr: false,
      loading: () => <p>Loading table...</p>,
    }
  );

  const handleAddTeacher = () => {
    setEditingTeacher(null);
    setShowForm(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setShowForm(true);
  };

  const handleDeleteTeacher = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الأستاذ؟")) {
      dispatch(deleteTeacher(id));
    }
  };

  const handleViewTeacher = (id: string) => {
    router.push(`/classroom/teachers/${id}`);
  };

  const handleSubmitForm = (data: TeacherFormData) => {
    if (editingTeacher) {
      dispatch(updateTeacher({ id: editingTeacher.id, data }));
    } else {
      dispatch(addTeacher(data));
    }
    setShowForm(false);
    setEditingTeacher(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTeacher(null);
  };

  const getFilteredTeachers = (filterType: string) => {
    switch (filterType) {
      case "active":
        return teachers.filter((teacher) => teacher.status === "Active");
      case "inactive":
        return teachers.filter((teacher) => teacher.status === "Inactive");
      case "on-leave":
        return teachers.filter((teacher) => teacher.status === "On Leave");
      case "math":
        return teachers.filter((teacher) =>
          teacher.specialization.some(spec => spec.includes("الرياضيات"))
        );
      case "sciences":
        return teachers.filter((teacher) =>
          teacher.specialization.some(spec =>
            spec.includes("الفيزياء") || spec.includes("الكيمياء") || spec.includes("علوم")
          )
        );
      case "languages":
        return teachers.filter((teacher) =>
          teacher.specialization.some(spec =>
            spec.includes("العربية") || spec.includes("الفرنسية") || spec.includes("الإنجليزية")
          )
        );
      case "experienced":
        return teachers.filter((teacher) => teacher.experience >= 10);
      default:
        return teachers;
    }
  };

  const columns = getTeacherColumns(handleEditTeacher, handleDeleteTeacher, handleViewTeacher);

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة الأساتذة</h1>
        <Button onClick={handleAddTeacher}>
          <UserPlus className="mr-2 h-4 w-4" />
          إضافة أستاذ
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">جميع الأساتذة</TabsTrigger>
          <TabsTrigger value="active">نشط</TabsTrigger>
          <TabsTrigger value="inactive">غير نشط</TabsTrigger>
          <TabsTrigger value="on-leave">في إجازة</TabsTrigger>
          <TabsTrigger value="math">الرياضيات</TabsTrigger>
          <TabsTrigger value="sciences">العلوم</TabsTrigger>
          <TabsTrigger value="languages">اللغات</TabsTrigger>
          <TabsTrigger value="experienced">ذوو الخبرة</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>جميع الأساتذة</CardTitle>
              <CardDescription>
                إدارة جميع الأساتذة في النظام. انقر على أستاذ لعرض ملفه الشخصي.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>جاري تحميل الأساتذة...</p>
                </div>
              ) : (
                <DataView
                  initialData={getFilteredTeachers("all")}
                  columns={columns}
                  onRowClick={(teacher) => handleViewTeacher(teacher.id)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>الأساتذة النشطون</CardTitle>
              <CardDescription>
                عرض وإدارة الأساتذة النشطين حالياً.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>جاري تحميل الأساتذة...</p>
                </div>
              ) : (
                <DataView
                  initialData={getFilteredTeachers("active")}
                  columns={columns}
                  onRowClick={(teacher) => handleViewTeacher(teacher.id)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>الأساتذة غير النشطين</CardTitle>
              <CardDescription>
                عرض وإدارة الأساتذة غير النشطين.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>جاري تحميل الأساتذة...</p>
                </div>
              ) : (
                <DataView
                  initialData={getFilteredTeachers("inactive")}
                  columns={columns}
                  onRowClick={(teacher) => handleViewTeacher(teacher.id)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="on-leave" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>الأساتذة في إجازة</CardTitle>
              <CardDescription>
                عرض وإدارة الأساتذة الذين في إجازة.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>جاري تحميل الأساتذة...</p>
                </div>
              ) : (
                <DataView
                  initialData={getFilteredTeachers("on-leave")}
                  columns={columns}
                  onRowClick={(teacher) => handleViewTeacher(teacher.id)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="math" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>أساتذة الرياضيات</CardTitle>
              <CardDescription>
                عرض وإدارة أساتذة الرياضيات.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>جاري تحميل الأساتذة...</p>
                </div>
              ) : (
                <DataView
                  initialData={getFilteredTeachers("math")}
                  columns={columns}
                  onRowClick={(teacher) => handleViewTeacher(teacher.id)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sciences" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>أساتذة العلوم</CardTitle>
              <CardDescription>
                عرض وإدارة أساتذة الفيزياء والكيمياء وعلوم الطبيعة والحياة.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>جاري تحميل الأساتذة...</p>
                </div>
              ) : (
                <DataView
                  initialData={getFilteredTeachers("sciences")}
                  columns={columns}
                  onRowClick={(teacher) => handleViewTeacher(teacher.id)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="languages" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>أساتذة اللغات</CardTitle>
              <CardDescription>
                عرض وإدارة أساتذة اللغة العربية والفرنسية والإنجليزية.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>جاري تحميل الأساتذة...</p>
                </div>
              ) : (
                <DataView
                  initialData={getFilteredTeachers("languages")}
                  columns={columns}
                  onRowClick={(teacher) => handleViewTeacher(teacher.id)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experienced" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>الأساتذة ذوو الخبرة</CardTitle>
              <CardDescription>
                عرض وإدارة الأساتذة الذين لديهم خبرة 10 سنوات أو أكثر.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>جاري تحميل الأساتذة...</p>
                </div>
              ) : (
                <DataView
                  initialData={getFilteredTeachers("experienced")}
                  columns={columns}
                  onRowClick={(teacher) => handleViewTeacher(teacher.id)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Teacher Form Dialog - We'll create this component next */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTeacher ? "تعديل بيانات الأستاذ" : "إضافة أستاذ جديد"}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>Teacher form will be implemented next...</p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={handleCancelForm}>
                إلغاء
              </Button>
              <Button onClick={() => handleSubmitForm({} as TeacherFormData)}>
                حفظ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}