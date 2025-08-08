"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { selectAllParents } from "@/store/slices/classroom/parentsSlice";
import { selectAllStudents } from "@/store/slices/classroom/studentsSlice";
import { selectAllTeachers } from "@/store/slices/classroom/teachersSlice";
import { CreditCard, GraduationCap, Heart, Users } from "lucide-react";
import { useSelector } from "react-redux";

export default function QuickStats() {
  const students = useSelector(selectAllStudents);
  const teachers = useSelector(selectAllTeachers);
  const parents = useSelector(selectAllParents);

  const activeStudents = students.filter((s) => s.status === "Active").length;
  const activeTeachers = teachers.filter((t) => t.status === "Active").length;
  const activeParents = parents.filter((p) => p.status === "Active").length;

  const totalPendingAmount = students.reduce(
    (sum, student) => sum + student.pendingAmount,
    0,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">الطلاب النشطون</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeStudents}</div>
          <p className="text-xs text-muted-foreground">
            من أصل {students.length} طالب
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            الأساتذة النشطون
          </CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeTeachers}</div>
          <p className="text-xs text-muted-foreground">
            من أصل {teachers.length} أستاذ
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">أولياء الأمور</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeParents}</div>
          <p className="text-xs text-muted-foreground">ولي أمر نشط</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            المدفوعات المعلقة
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalPendingAmount.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">دينار جزائري</p>
        </CardContent>
      </Card>
    </div>
  );
}
