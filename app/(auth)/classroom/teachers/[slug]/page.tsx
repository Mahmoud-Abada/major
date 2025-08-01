"use client";

import { EntityProfile } from "@/components/profile/EntityProfile";
import { ProfileContactInfo } from "@/components/profile/ProfileContactInfo";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileTab } from "@/components/profile/ProfileTabs";
import { ClassesTaught } from "@/components/profile/teacher/ClassesTaught";
import { Qualifications } from "@/components/profile/teacher/Qualifications";
import { TeacherDocuments } from "@/components/profile/teacher/TeacherDocuments";
import { TeacherPerformance } from "@/components/profile/teacher/TeacherPerformance";
import { TeacherSchedule } from "@/components/profile/teacher/TeacherSchedule";
import { TeacherStudents } from "@/components/profile/teacher/TeacherStudents";
import { Award, BookOpen, Calendar, FileText, User, Users } from "lucide-react";
import { useEffect, useState } from "react";

// Mock data for teacher profile
const mockTeacher = {
  id: "teacher-001",
  firstName: "Michael",
  lastName: "Brown",
  name: "Michael Brown",
  email: "michael.brown@majorschool.edu",
  phone: "+1-555-234-5678",
  avatar: "/avatars/michael-brown.jpg",
  status: "Active",
  teacherId: "T2024001",
  address: "456 Teacher Avenue, Springfield, IL",
  bio: "Experienced mathematics teacher with 10 years of teaching experience.",
  qualifications: [
    "M.Ed. Mathematics",
    "B.Sc. Computer Science",
    "Teaching Certification",
  ],
  specializations: [
    "Advanced Calculus",
    "Computer Programming",
    "STEM Education",
  ],
  employmentDate: "2020-08-15",
  yearsOfExperience: 10,
  subjects: ["Mathematics", "Computer Science", "Physics"],
  classes: [
    {
      id: "class-001",
      name: "10A",
      grade: "10",
      room: "Room 101",
      schedule: "Mon, Wed, Fri 8:00 - 8:50",
      studentCount: 25,
    },
    {
      id: "class-002",
      name: "11B",
      grade: "11",
      room: "Room 203",
      schedule: "Tue, Thu 9:00 - 10:50",
      studentCount: 22,
    },
    {
      id: "class-003",
      name: "12C",
      grade: "12",
      room: "Computer Lab",
      schedule: "Mon, Wed 13:00 - 14:50",
      studentCount: 18,
    },
  ],
  studentCount: 65,
  schedule: {
    periods: [
      {
        id: "period-001",
        name: "Period 1",
        startTime: "08:00",
        endTime: "08:50",
        subject: "Mathematics",
        subjectId: "subject-001",
        class: "10A",
        classId: "class-001",
        room: "Room 101",
        dayOfWeek: "monday",
      },
      {
        id: "period-002",
        name: "Period 3",
        startTime: "10:00",
        endTime: "10:50",
        subject: "Mathematics",
        subjectId: "subject-001",
        class: "11B",
        classId: "class-002",
        room: "Room 203",
        dayOfWeek: "monday",
      },
      {
        id: "period-003",
        name: "Period 5",
        startTime: "13:00",
        endTime: "14:50",
        subject: "Computer Science",
        subjectId: "subject-002",
        class: "12C",
        classId: "class-003",
        room: "Computer Lab",
        dayOfWeek: "monday",
      },
      {
        id: "period-004",
        name: "Period 2",
        startTime: "09:00",
        endTime: "10:50",
        subject: "Mathematics",
        subjectId: "subject-001",
        class: "11B",
        classId: "class-002",
        room: "Room 203",
        dayOfWeek: "tuesday",
      },
      {
        id: "period-005",
        name: "Period 4",
        startTime: "11:00",
        endTime: "11:50",
        subject: "Physics",
        subjectId: "subject-003",
        class: "10A",
        classId: "class-001",
        room: "Science Lab",
        dayOfWeek: "wednesday",
      },
    ],
    effectiveFrom: "2024-09-01",
    effectiveTo: "2024-12-20",
    daysOfWeek: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  },
  students: [
    {
      id: "student-001",
      name: "Alex Wilson",
      avatar: "/avatars/alex-wilson.jpg",
      grade: "10",
      class: "10A",
      classId: "class-001",
      status: "Active",
      attendance: 92,
      performance: 88,
    },
    {
      id: "student-002",
      name: "Olivia Martinez",
      avatar: "/avatars/olivia-martinez.jpg",
      grade: "11",
      class: "11B",
      classId: "class-002",
      status: "Active",
      attendance: 95,
      performance: 94,
    },
    {
      id: "student-003",
      name: "Ethan Johnson",
      avatar: "/avatars/ethan-johnson.jpg",
      grade: "10",
      class: "10A",
      classId: "class-001",
      status: "Inactive",
      attendance: 65,
      performance: 72,
    },
    {
      id: "student-004",
      name: "Sophia Lee",
      avatar: "/avatars/sophia-lee.jpg",
      grade: "12",
      class: "12C",
      classId: "class-003",
      status: "Active",
      attendance: 98,
      performance: 96,
    },
  ],
  performanceMetrics: [
    {
      id: "metric-001",
      name: "Student Pass Rate",
      value: 92,
      target: 90,
      period: "2024-2025",
      trend: {
        value: 3,
        isPositive: true,
      },
    },
    {
      id: "metric-002",
      name: "Student Satisfaction",
      value: 4.7,
      target: 4.5,
      period: "2024-2025",
      trend: {
        value: 5,
        isPositive: true,
      },
    },
    {
      id: "metric-003",
      name: "Attendance Rate",
      value: 95,
      target: 98,
      period: "2024-2025",
      trend: {
        value: 2,
        isPositive: false,
      },
    },
    {
      id: "metric-004",
      name: "Lesson Plan Completion",
      value: 100,
      target: 100,
      period: "2024-2025",
    },
    {
      id: "metric-005",
      name: "Student Pass Rate",
      value: 89,
      target: 90,
      period: "2023-2024",
    },
    {
      id: "metric-006",
      name: "Student Satisfaction",
      value: 4.5,
      target: 4.5,
      period: "2023-2024",
    },
  ],
  classPerformance: [
    {
      id: "perf-001",
      className: "10A",
      classId: "class-001",
      averageGrade: 85,
      passRate: 92,
      studentCount: 25,
      period: "2024-2025",
    },
    {
      id: "perf-002",
      className: "11B",
      classId: "class-002",
      averageGrade: 88,
      passRate: 95,
      studentCount: 22,
      period: "2024-2025",
    },
    {
      id: "perf-003",
      className: "12C",
      classId: "class-003",
      averageGrade: 92,
      passRate: 100,
      studentCount: 18,
      period: "2024-2025",
    },
  ],
  evaluations: [
    {
      period: "Spring 2024",
      score: 4.8,
      feedback:
        "Mr. Brown is an exceptional mathematics teacher who consistently goes above and beyond to ensure his students understand complex concepts. His innovative teaching methods and dedication to student success are commendable.",
      evaluator: "Sarah Johnson, Vice Principal",
    },
    {
      period: "Fall 2023",
      score: 4.7,
      feedback:
        "Michael demonstrates excellent classroom management skills and a deep understanding of his subject matter. Students consistently perform well in his classes and appreciate his clear explanations and patience.",
      evaluator: "John Smith, Principal",
    },
  ],
  documents: [
    {
      id: "doc-001",
      name: "Teaching Certification",
      type: "Certificate",
      category: "Qualifications",
      uploadDate: "2020-08-01",
      size: 1200000,
      status: "Verified",
      url: "/documents/teaching-certification.pdf",
      shared: false,
    },
    {
      id: "doc-002",
      name: "Mathematics Curriculum",
      type: "Document",
      category: "Teaching Materials",
      uploadDate: "2024-08-15",
      size: 3500000,
      status: "Active",
      url: "/documents/math-curriculum.pdf",
      shared: true,
    },
    {
      id: "doc-003",
      name: "Computer Science Syllabus",
      type: "Document",
      category: "Teaching Materials",
      uploadDate: "2024-08-20",
      size: 2800000,
      status: "Active",
      url: "/documents/cs-syllabus.pdf",
      shared: true,
    },
    {
      id: "doc-004",
      name: "Professional Development Certificate",
      type: "Certificate",
      category: "Qualifications",
      uploadDate: "2023-06-15",
      size: 950000,
      status: "Verified",
      url: "/documents/pd-certificate.pdf",
      shared: false,
    },
  ],
};

export default function TeacherProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const [teacher, setTeacher] = useState(mockTeacher);
  const [loading, setLoading] = useState(true);

  // In a real application, you would fetch the teacher data based on the slug
  useEffect(() => {
    // Simulate API call
    const fetchTeacher = async () => {
      try {
        // In a real app, you would fetch data from an API
        // const response = await fetch(`/api/teachers/${params.slug}`);
        // const data = await response.json();
        // setTeacher(data);

        // For now, we'll just use the mock data
        setTeacher(mockTeacher);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const tabs: ProfileTab[] = [
    {
      id: "overview",
      label: "Overview",
      icon: <User className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          <ProfileStats
            stats={[
              {
                label: "Classes",
                value: teacher.classes.length,
                icon: <BookOpen className="h-4 w-4" />,
              },
              {
                label: "Students",
                value: teacher.studentCount,
                icon: <Users className="h-4 w-4" />,
              },
              {
                label: "Experience",
                value: `${teacher.yearsOfExperience} years`,
                icon: <Calendar className="h-4 w-4" />,
              },
              {
                label: "Subjects",
                value: teacher.subjects.length,
                icon: <BookOpen className="h-4 w-4" />,
              },
            ]}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileInfoCard title="Contact Information">
              <ProfileContactInfo
                email={teacher.email}
                phone={teacher.phone}
                address={teacher.address}
              />
            </ProfileInfoCard>

            <Qualifications
              qualifications={teacher.qualifications}
              specializations={teacher.specializations}
              bio={teacher.bio}
            />
          </div>
        </div>
      ),
    },
    {
      id: "classes",
      label: "Classes",
      icon: <BookOpen className="h-4 w-4" />,
      content: (
        <ClassesTaught
          classes={teacher.classes}
          onViewClass={(classId) => console.log("View class:", classId)}
        />
      ),
    },
    {
      id: "schedule",
      label: "Schedule",
      icon: <Calendar className="h-4 w-4" />,
      content: <TeacherSchedule schedule={teacher.schedule} />,
    },
    {
      id: "students",
      label: "Students",
      icon: <Users className="h-4 w-4" />,
      content: (
        <TeacherStudents
          students={teacher.students}
          classes={teacher.classes.map((cls) => ({
            id: cls.id,
            name: cls.name,
            studentCount: cls.studentCount,
          }))}
          onViewStudent={(studentId) => console.log("View student:", studentId)}
        />
      ),
    },
    {
      id: "performance",
      label: "Performance",
      icon: <Award className="h-4 w-4" />,
      content: (
        <TeacherPerformance
          metrics={teacher.performanceMetrics}
          classPerformance={teacher.classPerformance}
          evaluations={teacher.evaluations}
        />
      ),
    },
    {
      id: "documents",
      label: "Documents",
      icon: <FileText className="h-4 w-4" />,
      content: (
        <TeacherDocuments
          documents={teacher.documents}
          onViewDocument={(documentId) =>
            console.log("View document:", documentId)
          }
          onDownloadDocument={(url) => console.log("Download document:", url)}
          onUploadDocument={() => console.log("Upload document")}
          onShareDocument={(documentId) =>
            console.log("Share document:", documentId)
          }
        />
      ),
    },
  ];

  return (
    <EntityProfile
      name={`${teacher.firstName} ${teacher.lastName}`}
      avatar={teacher.avatar}
      status={teacher.status}
      id={teacher.teacherId}
      backLink="/classroom/teachers"
      backLabel="All Teachers"
      tabs={tabs}
      defaultTab="overview"
      onEdit={() => console.log("Edit teacher")}
      onDelete={() => console.log("Delete teacher")}
      onShare={() => console.log("Share teacher profile")}
    />
  );
}
