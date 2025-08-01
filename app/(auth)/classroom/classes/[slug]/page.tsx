"use client";

import { EntityProfile } from "@/components/profile/EntityProfile";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileTab } from "@/components/profile/ProfileTabs";
import { ClassInfo } from "@/components/profile/class/ClassInfo";
import { ClassPerformance } from "@/components/profile/class/ClassPerformance";
import { ClassResources } from "@/components/profile/class/ClassResources";
import { ClassSchedule } from "@/components/profile/class/ClassSchedule";
import { ClassStudents } from "@/components/profile/class/ClassStudents";
import { SubjectsList } from "@/components/profile/class/SubjectsList";
import { BarChart2, BookOpen, Calendar, FileText, Users } from "lucide-react";
import { useEffect, useState } from "react";

// Mock data for class profile
const mockClass = {
  id: "class-001",
  name: "10A",
  grade: "10",
  academicYear: "2024-2025",
  status: "Active",
  classId: "CLS2024001",
  classTeacher: {
    name: "Michael Brown",
    id: "teacher-001",
  },
  room: "Room 101",
  studentCount: 25,
  department: "Mathematics",
  subjects: [
    {
      id: "subject-001",
      name: "Mathematics",
      code: "MATH101",
      teacher: "Michael Brown",
      teacherId: "teacher-001",
      schedule: "Mon, Wed, Fri 9:00 - 10:00",
    },
    {
      id: "subject-002",
      name: "English",
      code: "ENG101",
      teacher: "Emily Davis",
      teacherId: "teacher-002",
      schedule: "Tue, Thu 10:00 - 11:00",
    },
    {
      id: "subject-003",
      name: "Science",
      code: "SCI101",
      teacher: "David Johnson",
      teacherId: "teacher-003",
      schedule: "Mon, Wed 11:00 - 12:00",
    },
    {
      id: "subject-004",
      name: "History",
      code: "HIS101",
      teacher: "Sarah Thompson",
      teacherId: "teacher-004",
      schedule: "Tue, Thu 1:00 - 2:00",
    },
  ],
  students: [
    {
      id: "student-001",
      name: "Alex Wilson",
      avatar: "/avatars/alex-wilson.jpg",
      rollNumber: "S2024001",
      attendance: 95,
      performance: 92,
      status: "Active",
      averageGrade: 92,
      assignments: {
        completed: 18,
        total: 20,
      },
      subjects: [
        { name: "Mathematics", grade: 95 },
        { name: "English", grade: 88 },
        { name: "Science", grade: 94 },
        { name: "History", grade: 91 },
      ],
    },
    {
      id: "student-002",
      name: "Olivia Martinez",
      avatar: "/avatars/olivia-martinez.jpg",
      rollNumber: "S2024002",
      attendance: 98,
      performance: 96,
      status: "Active",
      averageGrade: 96,
      assignments: {
        completed: 20,
        total: 20,
      },
      subjects: [
        { name: "Mathematics", grade: 98 },
        { name: "English", grade: 95 },
        { name: "Science", grade: 97 },
        { name: "History", grade: 94 },
      ],
    },
    {
      id: "student-003",
      name: "Ethan Johnson",
      avatar: "/avatars/ethan-johnson.jpg",
      rollNumber: "S2024003",
      attendance: 85,
      performance: 78,
      status: "Active",
      averageGrade: 78,
      assignments: {
        completed: 15,
        total: 20,
      },
      subjects: [
        { name: "Mathematics", grade: 75 },
        { name: "English", grade: 80 },
        { name: "Science", grade: 82 },
        { name: "History", grade: 75 },
      ],
    },
    {
      id: "student-004",
      name: "Sophia Brown",
      avatar: "/avatars/sophia-brown.jpg",
      rollNumber: "S2024004",
      attendance: 92,
      performance: 88,
      status: "Active",
      averageGrade: 88,
      assignments: {
        completed: 19,
        total: 20,
      },
      subjects: [
        { name: "Mathematics", grade: 85 },
        { name: "English", grade: 92 },
        { name: "Science", grade: 88 },
        { name: "History", grade: 87 },
      ],
    },
    {
      id: "student-005",
      name: "Noah Davis",
      avatar: "/avatars/noah-davis.jpg",
      rollNumber: "S2024005",
      attendance: 78,
      performance: 72,
      status: "Warning",
      averageGrade: 72,
      assignments: {
        completed: 14,
        total: 20,
      },
      subjects: [
        { name: "Mathematics", grade: 68 },
        { name: "English", grade: 75 },
        { name: "Science", grade: 70 },
        { name: "History", grade: 75 },
      ],
    },
  ],
  schedule: {
    periods: [
      {
        id: "period-001",
        name: "Period 1",
        startTime: "08:00",
        endTime: "08:50",
        subject: "Mathematics",
        subjectId: "subject-001",
        teacher: "Michael Brown",
        teacherId: "teacher-001",
        room: "Room 101",
        dayOfWeek: "monday",
      },
      {
        id: "period-002",
        name: "Period 2",
        startTime: "09:00",
        endTime: "09:50",
        subject: "Science",
        subjectId: "subject-003",
        teacher: "David Johnson",
        teacherId: "teacher-003",
        room: "Lab 1",
        dayOfWeek: "monday",
      },
      {
        id: "period-003",
        name: "Period 3",
        startTime: "10:00",
        endTime: "10:50",
        subject: "English",
        subjectId: "subject-002",
        teacher: "Emily Davis",
        teacherId: "teacher-002",
        room: "Room 203",
        dayOfWeek: "tuesday",
      },
      {
        id: "period-004",
        name: "Period 4",
        startTime: "11:00",
        endTime: "11:50",
        subject: "History",
        subjectId: "subject-004",
        teacher: "Sarah Thompson",
        teacherId: "teacher-004",
        room: "Room 205",
        dayOfWeek: "tuesday",
      },
      {
        id: "period-005",
        name: "Period 1",
        startTime: "08:00",
        endTime: "08:50",
        subject: "Mathematics",
        subjectId: "subject-001",
        teacher: "Michael Brown",
        teacherId: "teacher-001",
        room: "Room 101",
        dayOfWeek: "wednesday",
      },
      {
        id: "period-006",
        name: "Period 2",
        startTime: "09:00",
        endTime: "09:50",
        subject: "Science",
        subjectId: "subject-003",
        teacher: "David Johnson",
        teacherId: "teacher-003",
        room: "Lab 1",
        dayOfWeek: "wednesday",
      },
      {
        id: "period-007",
        name: "Period 3",
        startTime: "10:00",
        endTime: "10:50",
        subject: "English",
        subjectId: "subject-002",
        teacher: "Emily Davis",
        teacherId: "teacher-002",
        room: "Room 203",
        dayOfWeek: "thursday",
      },
      {
        id: "period-008",
        name: "Period 4",
        startTime: "11:00",
        endTime: "11:50",
        subject: "History",
        subjectId: "subject-004",
        teacher: "Sarah Thompson",
        teacherId: "teacher-004",
        room: "Room 205",
        dayOfWeek: "thursday",
      },
      {
        id: "period-009",
        name: "Period 1",
        startTime: "08:00",
        endTime: "08:50",
        subject: "Mathematics",
        subjectId: "subject-001",
        teacher: "Michael Brown",
        teacherId: "teacher-001",
        room: "Room 101",
        dayOfWeek: "friday",
      },
    ],
    effectiveFrom: "2024-09-01",
    effectiveTo: "2025-06-15",
    daysOfWeek: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  },
  subjectPerformance: [
    {
      name: "Mathematics",
      id: "subject-001",
      averageGrade: 85,
      highestGrade: 98,
      lowestGrade: 68,
      passRate: 95,
      teacherName: "Michael Brown",
      teacherId: "teacher-001",
    },
    {
      name: "English",
      id: "subject-002",
      averageGrade: 86,
      highestGrade: 95,
      lowestGrade: 75,
      passRate: 100,
      teacherName: "Emily Davis",
      teacherId: "teacher-002",
    },
    {
      name: "Science",
      id: "subject-003",
      averageGrade: 86,
      highestGrade: 97,
      lowestGrade: 70,
      passRate: 95,
      teacherName: "David Johnson",
      teacherId: "teacher-003",
    },
    {
      name: "History",
      id: "subject-004",
      averageGrade: 84,
      highestGrade: 94,
      lowestGrade: 75,
      passRate: 100,
      teacherName: "Sarah Thompson",
      teacherId: "teacher-004",
    },
  ],
  resources: [
    {
      id: "resource-001",
      title: "Mathematics Textbook",
      description: "Official textbook for 10th grade mathematics.",
      type: "Document",
      url: "/resources/math-textbook.pdf",
      fileSize: 15000000,
      fileType: "application/pdf",
      uploadedBy: {
        name: "Michael Brown",
        id: "teacher-001",
        role: "teacher",
      },
      uploadedAt: "2024-08-15",
      subject: {
        name: "Mathematics",
        id: "subject-001",
      },
      tags: ["textbook", "mathematics", "grade 10"],
    },
    {
      id: "resource-002",
      title: "English Literature Anthology",
      description: "Collection of literary works for 10th grade English.",
      type: "Document",
      url: "/resources/english-anthology.pdf",
      fileSize: 12000000,
      fileType: "application/pdf",
      uploadedBy: {
        name: "Emily Davis",
        id: "teacher-002",
        role: "teacher",
      },
      uploadedAt: "2024-08-20",
      subject: {
        name: "English",
        id: "subject-002",
      },
      tags: ["literature", "english", "anthology"],
    },
    {
      id: "resource-003",
      title: "Science Lab Safety Video",
      description: "Video explaining safety procedures for science labs.",
      type: "Video",
      url: "/resources/lab-safety.mp4",
      fileSize: 85000000,
      fileType: "video/mp4",
      uploadedBy: {
        name: "David Johnson",
        id: "teacher-003",
        role: "teacher",
      },
      uploadedAt: "2024-08-25",
      subject: {
        name: "Science",
        id: "subject-003",
      },
      tags: ["science", "lab safety", "video"],
    },
    {
      id: "resource-004",
      title: "History Timeline Presentation",
      description: "Interactive timeline of major historical events.",
      type: "Presentation",
      url: "/resources/history-timeline.pptx",
      fileSize: 8500000,
      fileType:
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      uploadedBy: {
        name: "Sarah Thompson",
        id: "teacher-004",
        role: "teacher",
      },
      uploadedAt: "2024-09-01",
      subject: {
        name: "History",
        id: "subject-004",
      },
      tags: ["history", "timeline", "presentation"],
    },
    {
      id: "resource-005",
      title: "Class Schedule",
      description: "Weekly schedule for Class 10A.",
      type: "Document",
      url: "/resources/class-schedule.pdf",
      fileSize: 500000,
      fileType: "application/pdf",
      uploadedBy: {
        name: "Michael Brown",
        id: "teacher-001",
        role: "teacher",
      },
      uploadedAt: "2024-09-05",
      tags: ["schedule", "class information"],
    },
  ],
};

export default function ClassProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const [classData, setClassData] = useState(mockClass);
  const [loading, setLoading] = useState(true);

  // In a real application, you would fetch the class data based on the slug
  useEffect(() => {
    // Simulate API call
    const fetchClass = async () => {
      try {
        // In a real app, you would fetch data from an API
        // const response = await fetch(`/api/classes/${params.slug}`);
        // const data = await response.json();
        // setClassData(data);

        // For now, we'll just use the mock data
        setClassData(mockClass);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching class data:", error);
        setLoading(false);
      }
    };

    fetchClass();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // Calculate statistics for students
  const maleCount = Math.floor(classData.studentCount * 0.55); // Just for mock data
  const femaleCount = classData.studentCount - maleCount;
  const averageAttendance =
    classData.students.reduce((sum, student) => sum + student.attendance, 0) /
    classData.students.length;
  const averagePerformance =
    classData.students.reduce((sum, student) => sum + student.performance, 0) /
    classData.students.length;

  // Calculate class average
  const classAverage =
    classData.subjectPerformance.reduce(
      (sum, subject) => sum + subject.averageGrade,
      0,
    ) / classData.subjectPerformance.length;

  // Calculate pass rate
  const passRate =
    classData.subjectPerformance.reduce(
      (sum, subject) => sum + subject.passRate,
      0,
    ) / classData.subjectPerformance.length;

  const tabs: ProfileTab[] = [
    {
      id: "overview",
      label: "Overview",
      icon: <BookOpen className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          <ProfileStats
            stats={[
              {
                label: "Students",
                value: classData.studentCount,
                icon: <Users className="h-4 w-4" />,
              },
              {
                label: "Subjects",
                value: classData.subjects.length,
                icon: <BookOpen className="h-4 w-4" />,
              },
              {
                label: "Attendance",
                value: `${Math.round(averageAttendance)}%`,
                icon: <Calendar className="h-4 w-4" />,
              },
              {
                label: "Performance",
                value: `${Math.round(averagePerformance)}%`,
                icon: <BarChart2 className="h-4 w-4" />,
              },
            ]}
          />

          <ClassInfo
            name={classData.name}
            grade={classData.grade}
            academicYear={classData.academicYear}
            classTeacher={classData.classTeacher}
            room={classData.room}
            studentCount={classData.studentCount}
          />
        </div>
      ),
    },
    {
      id: "students",
      label: "Students",
      icon: <Users className="h-4 w-4" />,
      content: (
        <ClassStudents
          students={classData.students}
          totalStudents={classData.studentCount}
          maleCount={maleCount}
          femaleCount={femaleCount}
          averageAttendance={Math.round(averageAttendance)}
          averagePerformance={Math.round(averagePerformance)}
          onViewStudent={(studentId) => console.log("View student:", studentId)}
          onAddStudent={() => console.log("Add student")}
        />
      ),
    },
    {
      id: "subjects",
      label: "Subjects",
      icon: <BookOpen className="h-4 w-4" />,
      content: (
        <SubjectsList
          subjects={classData.subjects}
          onViewSubject={(subjectId) => console.log("View subject:", subjectId)}
        />
      ),
    },
    {
      id: "schedule",
      label: "Schedule",
      icon: <Calendar className="h-4 w-4" />,
      content: <ClassSchedule schedule={classData.schedule} />,
    },
    {
      id: "performance",
      label: "Performance",
      icon: <BarChart2 className="h-4 w-4" />,
      content: (
        <ClassPerformance
          students={classData.students}
          subjects={classData.subjectPerformance}
          classAverage={Math.round(classAverage)}
          attendanceRate={Math.round(averageAttendance)}
          passRate={Math.round(passRate)}
          onViewStudent={(studentId) => console.log("View student:", studentId)}
          onViewSubject={(subjectId) => console.log("View subject:", subjectId)}
        />
      ),
    },
    {
      id: "resources",
      label: "Resources",
      icon: <FileText className="h-4 w-4" />,
      content: (
        <ClassResources
          resources={classData.resources}
          resourceTypes={Array.from(
            new Set(classData.resources.map((resource) => resource.type)),
          )}
          subjects={classData.subjects.map((subject) => ({
            id: subject.id,
            name: subject.name,
          }))}
          onViewResource={(resourceId) =>
            console.log("View resource:", resourceId)
          }
          onDownloadResource={(url) => console.log("Download resource:", url)}
          onUploadResource={() => console.log("Upload resource")}
          onFilterChange={(type) => console.log("Filter by type:", type)}
          onSubjectFilterChange={(subjectId) =>
            console.log("Filter by subject:", subjectId)
          }
        />
      ),
    },
  ];

  return (
    <EntityProfile
      name={classData.name}
      status={classData.status}
      id={classData.classId}
      backLink="/classroom/classes"
      backLabel="All Classes"
      tabs={tabs}
      defaultTab="overview"
      onEdit={() => console.log("Edit class")}
      onDelete={() => console.log("Delete class")}
      onShare={() => console.log("Share class profile")}
    />
  );
}
