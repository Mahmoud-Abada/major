"use client";

import { EntityProfile } from "@/components/profile/EntityProfile";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileTab } from "@/components/profile/ProfileTabs";
import { DepartmentsList } from "@/components/profile/school/DepartmentsList";
import { SchoolCalendar } from "@/components/profile/school/SchoolCalendar";
import { SchoolClasses } from "@/components/profile/school/SchoolClasses";
import { SchoolInfo } from "@/components/profile/school/SchoolInfo";
import { SchoolResources } from "@/components/profile/school/SchoolResources";
import { SchoolStaff } from "@/components/profile/school/SchoolStaff";
import {
  Building,
  Calendar,
  FileText,
  GraduationCap,
  School,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

// Mock data for school profile
const mockSchool = {
  id: "school-001",
  name: "Major Academy",
  logo: "/images/major-academy-logo.png",
  status: "Active",
  schoolId: "SCH2024001",
  address: "789 Education Blvd, Springfield, IL, 62704",
  contactEmail: "info@majoracademy.edu",
  contactPhone: "+1-555-789-0123",
  website: "https://www.majoracademy.edu",
  establishedYear: 1995,
  studentCount: 1250,
  teacherCount: 85,
  classCount: 45,
  departmentCount: 6,
  departments: [
    {
      id: "dept-001",
      name: "Mathematics",
      head: "Michael Brown",
      teacherCount: 12,
      studentCount: 350,
    },
    {
      id: "dept-002",
      name: "Science",
      head: "David Johnson",
      teacherCount: 15,
      studentCount: 420,
    },
    {
      id: "dept-003",
      name: "English",
      head: "Emily Davis",
      teacherCount: 14,
      studentCount: 380,
    },
    {
      id: "dept-004",
      name: "Social Studies",
      head: "Sarah Thompson",
      teacherCount: 10,
      studentCount: 320,
    },
    {
      id: "dept-005",
      name: "Arts",
      head: "Jessica Miller",
      teacherCount: 8,
      studentCount: 240,
    },
    {
      id: "dept-006",
      name: "Physical Education",
      head: "Robert Wilson",
      teacherCount: 6,
      studentCount: 180,
    },
  ],
  staff: [
    {
      id: "admin-001",
      name: "John Smith",
      avatar: "/avatars/john-smith.jpg",
      position: "Principal",
      department: "Administration",
      email: "john.smith@majorschool.edu",
      phone: "+1-555-123-4567",
      status: "Active",
      joinDate: "2015-08-01",
    },
    {
      id: "admin-002",
      name: "Sarah Johnson",
      avatar: "/avatars/sarah-johnson.jpg",
      position: "Vice Principal",
      department: "Administration",
      email: "sarah.johnson@majorschool.edu",
      phone: "+1-555-987-6543",
      status: "Active",
      joinDate: "2017-07-15",
    },
    {
      id: "teacher-001",
      name: "Michael Brown",
      avatar: "/avatars/michael-brown.jpg",
      position: "Head of Mathematics",
      department: "Mathematics",
      email: "michael.brown@majorschool.edu",
      phone: "+1-555-234-5678",
      status: "Active",
      joinDate: "2018-08-15",
    },
    {
      id: "teacher-002",
      name: "Emily Davis",
      avatar: "/avatars/emily-davis.jpg",
      position: "Head of English",
      department: "English",
      email: "emily.davis@majorschool.edu",
      phone: "+1-555-345-6789",
      status: "Active",
      joinDate: "2019-08-10",
    },
    {
      id: "teacher-003",
      name: "David Johnson",
      avatar: "/avatars/david-johnson.jpg",
      position: "Head of Science",
      department: "Science",
      email: "david.johnson@majorschool.edu",
      phone: "+1-555-456-7890",
      status: "Active",
      joinDate: "2018-08-15",
    },
  ],
  classes: [
    {
      id: "class-001",
      name: "10A",
      grade: "10",
      classTeacher: {
        name: "Michael Brown",
        id: "teacher-001",
      },
      studentCount: 25,
      capacity: 30,
      room: "Room 101",
      department: "Mathematics",
    },
    {
      id: "class-002",
      name: "11B",
      grade: "11",
      classTeacher: {
        name: "Emily Davis",
        id: "teacher-002",
      },
      studentCount: 22,
      capacity: 30,
      room: "Room 203",
      department: "English",
    },
    {
      id: "class-003",
      name: "12C",
      grade: "12",
      classTeacher: {
        name: "David Johnson",
        id: "teacher-003",
      },
      studentCount: 18,
      capacity: 25,
      room: "Lab 1",
      department: "Science",
    },
  ],
  events: [
    {
      id: "event-001",
      title: "Parent-Teacher Conference",
      description: "Semester 1 parent-teacher conference for all grades.",
      startDate: "2025-10-15T14:00:00",
      endDate: "2025-10-15T20:00:00",
      location: "School Auditorium",
      category: "Meeting",
      isAllDay: false,
      organizer: {
        name: "John Smith",
        id: "admin-001",
        role: "admin",
      },
    },
    {
      id: "event-002",
      title: "Fall Break",
      description: "School closed for fall break.",
      startDate: "2025-10-20T00:00:00",
      endDate: "2025-10-24T23:59:59",
      category: "Holiday",
      isAllDay: true,
      organizer: {
        name: "John Smith",
        id: "admin-001",
        role: "admin",
      },
    },
    {
      id: "event-003",
      title: "Science Fair",
      description: "Annual science fair for all students.",
      startDate: "2025-11-05T09:00:00",
      endDate: "2025-11-05T15:00:00",
      location: "School Gymnasium",
      category: "Academic",
      isAllDay: false,
      organizer: {
        name: "David Johnson",
        id: "teacher-003",
        role: "teacher",
      },
    },
  ],
  resources: [
    {
      id: "resource-001",
      title: "School Handbook",
      description: "Official handbook for students and parents.",
      type: "Document",
      category: "Administrative",
      uploadDate: "2024-08-01",
      uploadedBy: {
        name: "John Smith",
        id: "admin-001",
        role: "admin",
      },
      size: 2500000,
      url: "/resources/school-handbook.pdf",
      accessLevel: "Public",
      downloadCount: 450,
    },
    {
      id: "resource-002",
      title: "Mathematics Curriculum",
      description: "Complete curriculum for mathematics department.",
      type: "Document",
      category: "Academic",
      uploadDate: "2024-08-15",
      uploadedBy: {
        name: "Michael Brown",
        id: "teacher-001",
        role: "teacher",
      },
      size: 3500000,
      url: "/resources/math-curriculum.pdf",
      accessLevel: "Staff",
      downloadCount: 85,
    },
    {
      id: "resource-003",
      title: "School Tour Video",
      description: "Virtual tour of the school campus.",
      type: "Video",
      category: "Marketing",
      uploadDate: "2024-07-10",
      uploadedBy: {
        name: "Sarah Johnson",
        id: "admin-002",
        role: "admin",
      },
      size: 150000000,
      url: "/resources/school-tour.mp4",
      accessLevel: "Public",
      downloadCount: 320,
    },
    {
      id: "resource-004",
      title: "Science Lab Safety Guidelines",
      description: "Safety procedures for science laboratories.",
      type: "Document",
      category: "Safety",
      uploadDate: "2024-08-20",
      uploadedBy: {
        name: "David Johnson",
        id: "teacher-003",
        role: "teacher",
      },
      size: 1800000,
      url: "/resources/lab-safety.pdf",
      accessLevel: "School",
      downloadCount: 210,
    },
  ],
};

export default function SchoolProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const [school, setSchool] = useState(mockSchool);
  const [loading, setLoading] = useState(true);

  // In a real application, you would fetch the school data based on the slug
  useEffect(() => {
    // Simulate API call
    const fetchSchool = async () => {
      try {
        // In a real app, you would fetch data from an API
        // const response = await fetch(`/api/schools/${params.slug}`);
        // const data = await response.json();
        // setSchool(data);

        // For now, we'll just use the mock data
        setSchool(mockSchool);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching school data:", error);
        setLoading(false);
      }
    };

    fetchSchool();
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
      icon: <School className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          <ProfileStats
            stats={[
              {
                label: "Students",
                value: school.studentCount,
                icon: <Users className="h-4 w-4" />,
              },
              {
                label: "Teachers",
                value: school.teacherCount,
                icon: <GraduationCap className="h-4 w-4" />,
              },
              {
                label: "Classes",
                value: school.classCount,
                icon: <Building className="h-4 w-4" />,
              },
              {
                label: "Departments",
                value: school.departmentCount,
                icon: <Building className="h-4 w-4" />,
              },
            ]}
          />

          <SchoolInfo
            name={school.name}
            address={school.address}
            contactEmail={school.contactEmail}
            contactPhone={school.contactPhone}
            website={school.website}
            establishedYear={school.establishedYear}
            logo={school.logo}
          />
        </div>
      ),
    },
    {
      id: "departments",
      label: "Departments",
      icon: <Building className="h-4 w-4" />,
      content: (
        <DepartmentsList
          departments={school.departments}
          onViewDepartment={(departmentId) =>
            console.log("View department:", departmentId)
          }
        />
      ),
    },
    {
      id: "staff",
      label: "Staff",
      icon: <Users className="h-4 w-4" />,
      content: (
        <SchoolStaff
          staff={school.staff}
          departments={school.departments.map((dept) => dept.name)}
          onViewStaffMember={(staffId) =>
            console.log("View staff member:", staffId)
          }
          onAddStaffMember={() => console.log("Add staff member")}
          onFilterChange={(department) =>
            console.log("Filter by department:", department)
          }
        />
      ),
    },
    {
      id: "classes",
      label: "Classes",
      icon: <Building className="h-4 w-4" />,
      content: (
        <SchoolClasses
          classes={school.classes}
          grades={Array.from(new Set(school.classes.map((cls) => cls.grade)))}
          departments={school.departments.map((dept) => dept.name)}
          onViewClass={(classId) => console.log("View class:", classId)}
          onAddClass={() => console.log("Add class")}
          onFilterChange={(grade) => console.log("Filter by grade:", grade)}
        />
      ),
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: <Calendar className="h-4 w-4" />,
      content: (
        <SchoolCalendar
          events={school.events}
          categories={Array.from(
            new Set(school.events.map((event) => event.category)),
          )}
          onViewEvent={(eventId) => console.log("View event:", eventId)}
          onAddEvent={() => console.log("Add event")}
          onDateSelect={(date) => console.log("Date selected:", date)}
          onCategoryFilter={(category) =>
            console.log("Filter by category:", category)
          }
        />
      ),
    },
    {
      id: "resources",
      label: "Resources",
      icon: <FileText className="h-4 w-4" />,
      content: (
        <SchoolResources
          resources={school.resources}
          categories={Array.from(
            new Set(school.resources.map((resource) => resource.category)),
          )}
          types={Array.from(
            new Set(school.resources.map((resource) => resource.type)),
          )}
          onViewResource={(resourceId) =>
            console.log("View resource:", resourceId)
          }
          onDownloadResource={(url) => console.log("Download resource:", url)}
          onUploadResource={() => console.log("Upload resource")}
          onFilterChange={(category) =>
            console.log("Filter by category:", category)
          }
        />
      ),
    },
  ];

  return (
    <EntityProfile
      name={school.name}
      avatar={school.logo}
      status={school.status}
      id={school.schoolId}
      backLink="/classroom/schools"
      backLabel="All Schools"
      tabs={tabs}
      defaultTab="overview"
      onEdit={() => console.log("Edit school")}
      onDelete={() => console.log("Delete school")}
      onShare={() => console.log("Share school profile")}
    />
  );
}
