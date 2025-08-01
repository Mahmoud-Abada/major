"use client";

import { EntityProfile } from "@/components/profile/EntityProfile";
import { ProfileContactInfo } from "@/components/profile/ProfileContactInfo";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileTab } from "@/components/profile/ProfileTabs";
import { AcademicRecord } from "@/components/profile/student/AcademicRecord";
import { AttendanceRecord } from "@/components/profile/student/AttendanceRecord";
import { StudentDocuments } from "@/components/profile/student/StudentDocuments";
import { StudentGroups } from "@/components/profile/student/StudentGroups";
import { StudentPayments } from "@/components/profile/student/StudentPayments";
import { StudentSchedule } from "@/components/profile/student/StudentSchedule";
import {
  BookOpen,
  Calendar,
  CreditCard,
  FileText,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

// Mock data for student profile
const mockStudent = {
  id: "student-001",
  studentId: "S2024001",
  firstName: "Alex",
  lastName: "Wilson",
  name: "Alex Wilson",
  email: "alex.wilson@majorschool.edu",
  phone: "+1-555-123-4567",
  avatar: "/avatars/alex-wilson.jpg",
  status: "Active",
  dateOfBirth: "2008-05-12",
  gender: "Male",
  nationality: "American",
  bloodGroup: "O+",
  address: "123 Student Lane, Springfield, IL",
  parentName: "Robert Wilson",
  parentEmail: "robert.wilson@example.com",
  parentPhone: "+1-555-456-7890",
  grade: "10",
  class: {
    id: "class-001",
    name: "10A",
  },
  overallGPA: 3.7,
  attendance: 92,
  totalCredits: 120,
  completedCredits: 45,
  marks: [
    {
      subject: "Mathematics",
      letterGrade: "A",
      gpa: 4.0,
      total: 95,
      semester: "Fall 2024",
    },
    {
      subject: "English",
      letterGrade: "A-",
      gpa: 3.7,
      total: 92,
      semester: "Fall 2024",
    },
    {
      subject: "Science",
      letterGrade: "B+",
      gpa: 3.3,
      total: 88,
      semester: "Fall 2024",
    },
    {
      subject: "History",
      letterGrade: "B",
      gpa: 3.0,
      total: 85,
      semester: "Fall 2024",
    },
    {
      subject: "Art",
      letterGrade: "A",
      gpa: 4.0,
      total: 96,
      semester: "Fall 2024",
    },
  ],
  attendanceRecords: [
    {
      date: "2024-09-01",
      status: "Present",
      percentage: 100,
      attendedClasses: 6,
      totalClasses: 6,
    },
    {
      date: "2024-09-02",
      status: "Present",
      percentage: 100,
      attendedClasses: 6,
      totalClasses: 6,
    },
    {
      date: "2024-09-03",
      status: "Absent",
      percentage: 0,
      attendedClasses: 0,
      totalClasses: 6,
    },
    {
      date: "2024-09-04",
      status: "Present",
      percentage: 100,
      attendedClasses: 6,
      totalClasses: 6,
    },
    {
      date: "2024-09-05",
      status: "Late",
      percentage: 83,
      attendedClasses: 5,
      totalClasses: 6,
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
        subject: "English",
        teacher: "Emily Davis",
        teacherId: "teacher-002",
        room: "Room 203",
        dayOfWeek: "monday",
      },
      {
        id: "period-003",
        name: "Period 3",
        startTime: "10:00",
        endTime: "10:50",
        subject: "Science",
        teacher: "David Johnson",
        teacherId: "teacher-003",
        room: "Lab 1",
        dayOfWeek: "monday",
      },
      {
        id: "period-004",
        name: "Period 1",
        startTime: "08:00",
        endTime: "08:50",
        subject: "History",
        teacher: "Sarah Thompson",
        teacherId: "teacher-004",
        room: "Room 105",
        dayOfWeek: "tuesday",
      },
      {
        id: "period-005",
        name: "Period 2",
        startTime: "09:00",
        endTime: "09:50",
        subject: "Art",
        teacher: "Jessica Miller",
        teacherId: "teacher-005",
        room: "Art Studio",
        dayOfWeek: "tuesday",
      },
    ],
    effectiveFrom: "2024-09-01",
    effectiveTo: "2024-12-20",
    daysOfWeek: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  },
  payments: [
    {
      id: "payment-001",
      description: "Tuition Fee - Fall 2024",
      amount: 5000,
      dueDate: "2024-08-15",
      paidDate: "2024-08-10",
      status: "Paid",
      receiptUrl: "/receipts/receipt-001.pdf",
    },
    {
      id: "payment-002",
      description: "Lab Fee - Science",
      amount: 250,
      dueDate: "2024-09-01",
      status: "Pending",
    },
    {
      id: "payment-003",
      description: "Field Trip - Museum",
      amount: 75,
      dueDate: "2024-08-20",
      status: "Overdue",
    },
  ],
  groups: [
    {
      id: "group-001",
      name: "Science Club",
      type: "academic",
      memberCount: 15,
      joinDate: "2023-10-05",
      role: "Member",
      leader: {
        id: "teacher-003",
        name: "David Johnson",
      },
    },
    {
      id: "group-002",
      name: "Basketball Team",
      type: "sports",
      memberCount: 12,
      joinDate: "2023-09-15",
      role: "Captain",
    },
    {
      id: "group-003",
      name: "Debate Society",
      type: "academic",
      memberCount: 20,
      joinDate: "2024-01-10",
      leader: {
        id: "teacher-002",
        name: "Emily Davis",
      },
    },
  ],
  documents: [
    {
      id: "doc-001",
      name: "Birth Certificate",
      type: "Official Document",
      uploadDate: "2022-08-01",
      size: 1500000,
      status: "Verified",
      url: "/documents/birth-certificate.pdf",
    },
    {
      id: "doc-002",
      name: "Medical Records",
      type: "Health",
      uploadDate: "2023-07-15",
      size: 2500000,
      status: "Verified",
      url: "/documents/medical-records.pdf",
    },
    {
      id: "doc-003",
      name: "Previous School Transcript",
      type: "Academic",
      uploadDate: "2022-08-05",
      size: 1200000,
      status: "Verified",
      url: "/documents/transcript.pdf",
    },
  ],
};

export default function StudentProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const [student, setStudent] = useState(mockStudent);
  const [loading, setLoading] = useState(true);

  // In a real application, you would fetch the student data based on the slug
  useEffect(() => {
    // Simulate API call
    const fetchStudent = async () => {
      try {
        // In a real app, you would fetch data from an API
        // const response = await fetch(`/api/students/${params.slug}`);
        // const data = await response.json();
        // setStudent(data);

        // For now, we'll just use the mock data
        setStudent(mockStudent);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student data:", error);
        setLoading(false);
      }
    };

    fetchStudent();
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
                label: "Overall GPA",
                value: student.overallGPA.toFixed(1),
                icon: <BookOpen className="h-4 w-4" />,
              },
              {
                label: "Attendance",
                value: `${student.attendance}%`,
                icon: <Calendar className="h-4 w-4" />,
              },
              {
                label: "Credits",
                value: `${student.completedCredits}/${student.totalCredits}`,
                icon: <BookOpen className="h-4 w-4" />,
              },
              {
                label: "Groups",
                value: student.groups.length,
                icon: <Users className="h-4 w-4" />,
              },
            ]}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProfileInfoCard title="Personal Information">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Date of Birth
                    </p>
                    <p>{new Date(student.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p>{student.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nationality</p>
                    <p>{student.nationality}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Blood Group</p>
                    <p>{student.bloodGroup}</p>
                  </div>
                </div>
              </div>
            </ProfileInfoCard>

            <ProfileInfoCard title="Contact Information">
              <ProfileContactInfo
                email={student.email}
                phone={student.phone}
                address={student.address}
              />
            </ProfileInfoCard>

            <ProfileInfoCard title="Guardian Information">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Parent Name</p>
                  <p>{student.parentName}</p>
                </div>
                <ProfileContactInfo
                  email={student.parentEmail}
                  phone={student.parentPhone}
                />
              </div>
            </ProfileInfoCard>
          </div>
        </div>
      ),
    },
    {
      id: "academics",
      label: "Academics",
      icon: <BookOpen className="h-4 w-4" />,
      content: (
        <AcademicRecord
          grades={student.marks}
          overallGPA={student.overallGPA}
          totalCredits={student.totalCredits}
          completedCredits={student.completedCredits}
        />
      ),
    },
    {
      id: "attendance",
      label: "Attendance",
      icon: <Calendar className="h-4 w-4" />,
      content: (
        <AttendanceRecord
          attendance={student.attendanceRecords}
          overallAttendance={student.attendance}
        />
      ),
    },
    {
      id: "schedule",
      label: "Schedule",
      icon: <Calendar className="h-4 w-4" />,
      content: <StudentSchedule schedule={student.schedule} />,
    },
    {
      id: "payments",
      label: "Payments",
      icon: <CreditCard className="h-4 w-4" />,
      content: (
        <StudentPayments
          payments={student.payments}
          totalDue={student.payments.reduce((sum, p) => sum + p.amount, 0)}
          totalPaid={student.payments
            .filter((p) => p.status.toLowerCase() === "paid")
            .reduce((sum, p) => sum + p.amount, 0)}
          onViewPayment={(paymentId) => console.log("View payment:", paymentId)}
          onDownloadReceipt={(receiptUrl) =>
            console.log("Download receipt:", receiptUrl)
          }
          onMakePayment={(paymentId) => console.log("Make payment:", paymentId)}
        />
      ),
    },
    {
      id: "groups",
      label: "Groups",
      icon: <Users className="h-4 w-4" />,
      content: (
        <StudentGroups
          groups={student.groups}
          onViewGroup={(groupId) => console.log("View group:", groupId)}
        />
      ),
    },
    {
      id: "documents",
      label: "Documents",
      icon: <FileText className="h-4 w-4" />,
      content: (
        <StudentDocuments
          documents={student.documents}
          onViewDocument={(documentId) =>
            console.log("View document:", documentId)
          }
          onDownloadDocument={(url) => console.log("Download document:", url)}
          onUploadDocument={() => console.log("Upload document")}
        />
      ),
    },
  ];

  return (
    <EntityProfile
      name={`${student.firstName} ${student.lastName}`}
      avatar={student.avatar}
      status={student.status}
      id={student.studentId}
      backLink="/classroom/students"
      backLabel="All Students"
      tabs={tabs}
      defaultTab="overview"
      onEdit={() => console.log("Edit student")}
      onDelete={() => console.log("Delete student")}
      onShare={() => console.log("Share student profile")}
    />
  );
}
