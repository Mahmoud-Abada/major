"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

// Mock data for teachers
const mockTeachers = [
  {
    id: "teacher-001",
    image: "/avatars/michael-brown.jpg",
    name: "Michael Brown",
    status: "Active",
    location: "Mathematics Department",
    verified: true,
    referral: {
      name: "John Smith",
      image: "/avatars/john-smith.jpg",
    },
    value: 95,
    joinDate: "2020-08-15",
    teacherId: "T2024001",
    email: "michael.brown@majorschool.edu",
    phone: "+1-555-234-5678",
    department: "Mathematics",
    subjects: ["Algebra", "Calculus", "Statistics"],
    classes: ["10A", "11B", "12A"],
    qualifications: ["M.Ed. Mathematics", "B.Sc. Computer Science"],
    yearsOfExperience: 10,
  },
  {
    id: "teacher-002",
    image: "/avatars/emily-davis.jpg",
    name: "Emily Davis",
    status: "Active",
    location: "English Department",
    verified: true,
    referral: {
      name: "Sarah Johnson",
      image: "/avatars/sarah-johnson.jpg",
    },
    value: 92,
    joinDate: "2021-01-10",
    teacherId: "T2024002",
    email: "emily.davis@majorschool.edu",
    phone: "+1-555-345-6789",
    department: "English",
    subjects: ["Literature", "Creative Writing", "Grammar"],
    classes: ["9C", "10A", "11B"],
    qualifications: ["Ph.D. Literature", "M.A. English"],
    yearsOfExperience: 8,
  },
  {
    id: "teacher-003",
    image: "/avatars/david-johnson.jpg",
    name: "David Johnson",
    status: "Active",
    location: "Science Department",
    verified: true,
    referral: {
      name: "Michael Brown",
      image: "/avatars/michael-brown.jpg",
    },
    value: 90,
    joinDate: "2019-08-20",
    teacherId: "T2024003",
    email: "david.johnson@majorschool.edu",
    phone: "+1-555-456-7890",
    department: "Science",
    subjects: ["Physics", "Chemistry", "Biology"],
    classes: ["10A", "11B", "12A"],
    qualifications: ["Ph.D. Physics", "B.Sc. Chemistry"],
    yearsOfExperience: 12,
  },
  {
    id: "teacher-004",
    image: "/avatars/sophia-wilson.jpg",
    name: "Sophia Wilson",
    status: "Active",
    location: "History Department",
    verified: true,
    referral: {
      name: "Emily Davis",
      image: "/avatars/emily-davis.jpg",
    },
    value: 88,
    joinDate: "2022-01-15",
    teacherId: "T2024004",
    email: "sophia.wilson@majorschool.edu",
    phone: "+1-555-567-8901",
    department: "History",
    subjects: ["World History", "American History", "European History"],
    classes: ["9C", "10A", "11B"],
    qualifications: ["M.A. History", "B.A. Political Science"],
    yearsOfExperience: 5,
  },
  {
    id: "teacher-005",
    image: "/avatars/james-thompson.jpg",
    name: "James Thompson",
    status: "Inactive",
    location: "Physical Education Department",
    verified: false,
    referral: {
      name: "David Johnson",
      image: "/avatars/david-johnson.jpg",
    },
    value: 75,
    joinDate: "2020-08-15",
    teacherId: "T2024005",
    email: "james.thompson@majorschool.edu",
    phone: "+1-555-678-9012",
    department: "Physical Education",
    subjects: ["Physical Education", "Health", "Sports"],
    classes: ["9C", "10A", "11B", "12A"],
    qualifications: ["B.S. Physical Education", "Sports Coaching Certificate"],
    yearsOfExperience: 7,
  },
  {
    id: "teacher-006",
    image: "/avatars/olivia-martinez.jpg",
    name: "Olivia Martinez",
    status: "Active",
    location: "Art Department",
    verified: true,
    referral: {
      name: "John Smith",
      image: "/avatars/john-smith.jpg",
    },
    value: 92,
    joinDate: "2021-08-10",
    teacherId: "T2024006",
    email: "olivia.martinez@majorschool.edu",
    phone: "+1-555-789-0123",
    department: "Art",
    subjects: ["Drawing", "Painting", "Art History"],
    classes: ["9C", "10A", "11B", "12A"],
    qualifications: ["M.F.A. Fine Arts", "B.A. Art Education"],
    yearsOfExperience: 6,
  },
  {
    id: "teacher-007",
    image: "/avatars/william-garcia.jpg",
    name: "William Garcia",
    status: "Active",
    location: "Music Department",
    verified: true,
    referral: {
      name: "Sarah Johnson",
      image: "/avatars/sarah-johnson.jpg",
    },
    value: 90,
    joinDate: "2020-08-15",
    teacherId: "T2024007",
    email: "william.garcia@majorschool.edu",
    phone: "+1-555-890-1234",
    department: "Music",
    subjects: ["Music Theory", "Band", "Choir"],
    classes: ["9C", "10A", "11B", "12A"],
    qualifications: ["M.M. Music Education", "B.M. Performance"],
    yearsOfExperience: 9,
  },
  {
    id: "teacher-008",
    image: "/avatars/ava-rodriguez.jpg",
    name: "Ava Rodriguez",
    status: "Active",
    location: "Foreign Languages Department",
    verified: true,
    referral: {
      name: "Michael Brown",
      image: "/avatars/michael-brown.jpg",
    },
    value: 94,
    joinDate: "2019-08-20",
    teacherId: "T2024008",
    email: "ava.rodriguez@majorschool.edu",
    phone: "+1-555-901-2345",
    department: "Foreign Languages",
    subjects: ["Spanish", "French", "ESL"],
    classes: ["9C", "10A", "11B", "12A"],
    qualifications: ["M.A. Spanish Literature", "B.A. Linguistics"],
    yearsOfExperience: 11,
  },
  {
    id: "teacher-009",
    image: "/avatars/noah-lee.jpg",
    name: "Noah Lee",
    status: "Inactive",
    location: "Computer Science Department",
    verified: false,
    referral: {
      name: "Emily Davis",
      image: "/avatars/emily-davis.jpg",
    },
    value: 80,
    joinDate: "2022-01-15",
    teacherId: "T2024009",
    email: "noah.lee@majorschool.edu",
    phone: "+1-555-012-3456",
    department: "Computer Science",
    subjects: ["Programming", "Web Development", "Computer Literacy"],
    classes: ["10A", "11B", "12A"],
    qualifications: ["M.S. Computer Science", "B.S. Information Technology"],
    yearsOfExperience: 4,
  },
  {
    id: "teacher-010",
    image: "/avatars/emma-taylor.jpg",
    name: "Emma Taylor",
    status: "Active",
    location: "Mathematics Department",
    verified: true,
    referral: {
      name: "David Johnson",
      image: "/avatars/david-johnson.jpg",
    },
    value: 93,
    joinDate: "2020-08-15",
    teacherId: "T2024010",
    email: "emma.taylor@majorschool.edu",
    phone: "+1-555-123-4567",
    department: "Mathematics",
    subjects: ["Geometry", "Trigonometry", "Pre-Calculus"],
    classes: ["9C", "10A", "11B"],
    qualifications: ["M.S. Mathematics", "B.S. Education"],
    yearsOfExperience: 8,
  },
];

// Custom columns for teachers
const getTeacherColumns = () => [
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
    header: "Department",
    accessorKey: "department",
  },
  {
    header: "Experience",
    accessorKey: "yearsOfExperience",
    cell: (value) => `${value} years`,
  },
  {
    header: "Classes",
    accessorKey: "classes",
    cell: (value) => value.join(", "),
  },
  {
    header: "Subjects",
    accessorKey: "subjects",
    cell: (value) => value.join(", "),
  },
  {
    id: "actions",
    header: "Actions",
  },
];

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchTeachers = async () => {
      try {
        // In a real app, you would fetch data from an API
        // const response = await fetch('/api/teachers');
        // const data = await response.json();
        // setTeachers(data);

        // For now, we'll just use the mock data
        setTeachers(mockTeachers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching teachers data:", error);
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Import the DataView component dynamically to avoid SSR issues with window
  const DataView = dynamic(
    () => import("@/components/classroom/contacts-table"),
    {
      ssr: false,
      loading: () => <p>Loading table...</p>,
    },
  );

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teachers</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Teacher
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Teachers</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="math">Mathematics</TabsTrigger>
          <TabsTrigger value="science">Science</TabsTrigger>
          <TabsTrigger value="english">English</TabsTrigger>
          <TabsTrigger value="other">Other Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Teachers</CardTitle>
              <CardDescription>
                Manage all teachers in the system. Click on a teacher to view
                their profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading teachers...</p>
                </div>
              ) : (
                <DataView
                  initialData={teachers}
                  columns={getTeacherColumns()}
                  onRowClick={(teacher) => {
                    window.location.href = `/classroom/teachers/${teacher.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Teachers</CardTitle>
              <CardDescription>
                View and manage currently active teachers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading teachers...</p>
                </div>
              ) : (
                <DataView
                  initialData={teachers.filter(
                    (teacher) => teacher.status === "Active",
                  )}
                  columns={getTeacherColumns()}
                  onRowClick={(teacher) => {
                    window.location.href = `/classroom/teachers/${teacher.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Teachers</CardTitle>
              <CardDescription>
                View and manage inactive teachers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading teachers...</p>
                </div>
              ) : (
                <DataView
                  initialData={teachers.filter(
                    (teacher) => teacher.status === "Inactive",
                  )}
                  columns={getTeacherColumns()}
                  onRowClick={(teacher) => {
                    window.location.href = `/classroom/teachers/${teacher.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="math" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Mathematics Department</CardTitle>
              <CardDescription>
                View and manage teachers in the Mathematics department.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading teachers...</p>
                </div>
              ) : (
                <DataView
                  initialData={teachers.filter(
                    (teacher) => teacher.department === "Mathematics",
                  )}
                  columns={getTeacherColumns()}
                  onRowClick={(teacher) => {
                    window.location.href = `/classroom/teachers/${teacher.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="science" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Science Department</CardTitle>
              <CardDescription>
                View and manage teachers in the Science department.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading teachers...</p>
                </div>
              ) : (
                <DataView
                  initialData={teachers.filter(
                    (teacher) => teacher.department === "Science",
                  )}
                  columns={getTeacherColumns()}
                  onRowClick={(teacher) => {
                    window.location.href = `/classroom/teachers/${teacher.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="english" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>English Department</CardTitle>
              <CardDescription>
                View and manage teachers in the English department.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading teachers...</p>
                </div>
              ) : (
                <DataView
                  initialData={teachers.filter(
                    (teacher) => teacher.department === "English",
                  )}
                  columns={getTeacherColumns()}
                  onRowClick={(teacher) => {
                    window.location.href = `/classroom/teachers/${teacher.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="other" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Other Departments</CardTitle>
              <CardDescription>
                View and manage teachers in other departments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading teachers...</p>
                </div>
              ) : (
                <DataView
                  initialData={teachers.filter(
                    (teacher) =>
                      !["Mathematics", "Science", "English"].includes(
                        teacher.department,
                      ),
                  )}
                  columns={getTeacherColumns()}
                  onRowClick={(teacher) => {
                    window.location.href = `/classroom/teachers/${teacher.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Import dynamic at the end to avoid hoisting issues
import dynamic from "next/dynamic";
