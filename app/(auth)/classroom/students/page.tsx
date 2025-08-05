"use client";

import StudentForm from "@/components/classroom/forms/StudentForm";
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
  addStudent,
  deleteStudent,
  selectFilteredStudents,
  selectStudentsLoading,
  updateStudent
} from "@/store/slices/classroom/studentsSlice";
import { Student, StudentFormData } from "@/types/classroom";
import { Edit, Eye, Trash2, UserPlus } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Custom columns for students with enhanced actions
const getStudentColumns = (
  onEdit: (student: Student) => void,
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
      accessorKey: "studentId",
    },
    {
      header: "Status",
      accessorKey: "status",
    },
    {
      header: "Grade",
      accessorKey: "grade",
    },
    {
      header: "Class",
      accessorKey: "class",
    },
    {
      header: "Attendance",
      accessorKey: "attendance",
    },
    {
      header: "GPA",
      accessorKey: "gpa",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: Student } }) => (
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

export default function StudentsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const students = useSelector(selectFilteredStudents);
  const loading = useSelector(selectStudentsLoading);

  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Import the DataView component dynamically to avoid SSR issues with window
  const DataView = dynamic(
    () => import("@/components/classroom/contacts-table"),
    {
      ssr: false,
      loading: () => <p>Loading table...</p>,
    }
  );

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الطالب؟")) {
      dispatch(deleteStudent(id));
    }
  };

  const handleViewStudent = (id: string) => {
    router.push(`/classroom/students/${id}`);
  };

  const handleSubmitForm = (data: StudentFormData) => {
    if (editingStudent) {
      dispatch(updateStudent({ id: editingStudent.id, data }));
    } else {
      dispatch(addStudent(data));
    }
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  const getFilteredStudents = (filterType: string) => {
    switch (filterType) {
      case "active":
        return students.filter((student) => student.status === "Active");
      case "inactive":
        return students.filter((student) => student.status === "Inactive");
      case "secondary":
        return students.filter((student) => student.grade === "الثالثة ثانوي");
      case "university":
        return students.filter((student) => student.grade === "الجامعي");
      case "sciences":
        return students.filter((student) =>
          student.class?.includes("علوم") || student.class?.includes("ع ت")
        );
      case "literature":
        return students.filter((student) =>
          student.class?.includes("آداب") || student.class?.includes("آف")
        );
      default:
        return students;
    }
  };

  const columns = getStudentColumns(handleEditStudent, handleDeleteStudent, handleViewStudent);

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة الطلاب</h1>
        <Button onClick={handleAddStudent}>
          <UserPlus className="mr-2 h-4 w-4" />
          إضافة طالب
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">جميع الطلاب</TabsTrigger>
          <TabsTrigger value="active">نشط</TabsTrigger>
          <TabsTrigger value="inactive">غير نشط</TabsTrigger>
          <TabsTrigger value="secondary">الثالثة ثانوي</TabsTrigger>
          <TabsTrigger value="university">الجامعي</TabsTrigger>
          <TabsTrigger value="sciences">علوم تجريبية</TabsTrigger>
          <TabsTrigger value="literature">آداب وفلسفة</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>جميع الطلاب</CardTitle>
              <CardDescription>
                إدارة جميع الطلاب في النظام. انقر على طالب لعرض ملفه الشخصي.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>جاري تحميل الطلاب...</p>
                </div>
              ) : (
                <DataView
                  initialData={getFilteredStudents("all")}
                  columns={columns}
                  onRowClick={(student) => handleViewStudent(student.id)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>الطلاب النشطون</CardTitle>
              <CardDescription>
                عرض وإدارة الطلاب النشطين حالياً.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>جاري تحميل الطلاب...</p>
                </div>
              ) : (
                <DataView
                  initialData={getFilteredStudents("active")}
                  columns={columns}
                  onRowClick={(student) => handleViewStudent(student.id)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>الطلاب غير النشطين</CardTitle>
              <CardDescription>
                عرض وإدارة الطلاب غير النشطين.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>جاري تحميل الطلاب...</p>
                </div>
              ) : (
                <DataView
                  initialData={getFilteredStudents("inactive")}
                  columns={columns}
                  onRowClick={(student) => handleViewStudent(student.id)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="secondary" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>طلاب الثالثة ثانوي</CardTitle>
              <CardDescription>
                عرض وإدارة طلاب السنة الثالثة ثانوي.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>جاري تحميل الطلاب...</p>
                </div>
              ) : (
                <DataView
                  initialData={getFilteredStudents("secondary")}
                  columns={columns}
                  onRowClick={(student) => handleViewStudent(student.id)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="university" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>الطلاب الجامعيون</CardTitle>
              <CardDescription>
                عرض وإدارة الطلاب الجامعيين.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>جاري تحميل الطلاب...</p>
                </div>
              ) : (
                <DataView
                  initialData={getFilteredStudents("university")}
                  columns={columns}
                  onRowClick={(student) => handleViewStudent(student.id)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sciences" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>طلاب العلوم التجريبية</CardTitle>
              <CardDescription>
                عرض وإدارة طلاب شعبة العلوم التجريبية.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>جاري تحميل الطلاب...</p>
                </div>
              ) : (
                <DataView
                  initialData={getFilteredStudents("sciences")}
                  columns={columns}
                  onRowClick={(student) => handleViewStudent(student.id)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="literature" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>طلاب الآداب والفلسفة</CardTitle>
              <CardDescription>
                عرض وإدارة طلاب شعبة الآداب والفلسفة.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>جاري تحميل الطلاب...</p>
                </div>
              ) : (
                <DataView
                  initialData={getFilteredStudents("literature")}
                  columns={columns}
                  onRowClick={(student) => handleViewStudent(student.id)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Student Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingStudent ? "تعديل بيانات الطالب" : "إضافة طالب جديد"}
            </DialogTitle>
          </DialogHeader>
          <StudentForm
            student={editingStudent}
            onSubmit={handleSubmitForm}
            onCancel={handleCancelForm}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
