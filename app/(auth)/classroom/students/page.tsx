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

// Mock data for students
const mockStudents = [
  {
    id: "student-001",
    image: "/avatars/alex-wilson.jpg",
    name: "Alex Wilson",
    status: "Active",
    location: "Grade 10A",
    verified: true,
    referral: {
      name: "John Smith",
      image: "/avatars/john-smith.jpg",
    },
    value: 95,
    joinDate: "2022-09-01",
    studentId: "S2024001",
    email: "alex.wilson@majorschool.edu",
    phone: "+1-555-123-4567",
    grade: "10",
    class: "10A",
    attendance: "95%",
    gpa: "3.8",
  },
  {
    id: "student-002",
    image: "/avatars/olivia-martinez.jpg",
    name: "Olivia Martinez",
    status: "Active",
    location: "Grade 11B",
    verified: true,
    referral: {
      name: "Sarah Johnson",
      image: "/avatars/sarah-johnson.jpg",
    },
    value: 92,
    joinDate: "2021-09-01",
    studentId: "S2024002",
    email: "olivia.martinez@majorschool.edu",
    phone: "+1-555-234-5678",
    grade: "11",
    class: "11B",
    attendance: "92%",
    gpa: "3.9",
  },
  {
    id: "student-003",
    image: "/avatars/ethan-johnson.jpg",
    name: "Ethan Johnson",
    status: "Active",
    location: "Grade 10A",
    verified: true,
    referral: {
      name: "Michael Brown",
      image: "/avatars/michael-brown.jpg",
    },
    value: 88,
    joinDate: "2022-09-01",
    studentId: "S2024003",
    email: "ethan.johnson@majorschool.edu",
    phone: "+1-555-345-6789",
    grade: "10",
    class: "10A",
    attendance: "88%",
    gpa: "3.5",
  },
  {
    id: "student-004",
    image: "/avatars/sophia-brown.jpg",
    name: "Sophia Brown",
    status: "Active",
    location: "Grade 9C",
    verified: true,
    referral: {
      name: "Emily Davis",
      image: "/avatars/emily-davis.jpg",
    },
    value: 90,
    joinDate: "2023-09-01",
    studentId: "S2024004",
    email: "sophia.brown@majorschool.edu",
    phone: "+1-555-456-7890",
    grade: "9",
    class: "9C",
    attendance: "90%",
    gpa: "3.7",
  },
  {
    id: "student-005",
    image: "/avatars/noah-davis.jpg",
    name: "Noah Davis",
    status: "Inactive",
    location: "Grade 11B",
    verified: false,
    referral: {
      name: "David Johnson",
      image: "/avatars/david-johnson.jpg",
    },
    value: 75,
    joinDate: "2021-09-01",
    studentId: "S2024005",
    email: "noah.davis@majorschool.edu",
    phone: "+1-555-567-8901",
    grade: "11",
    class: "11B",
    attendance: "75%",
    gpa: "3.0",
  },
  {
    id: "student-006",
    image: "/avatars/emma-wilson.jpg",
    name: "Emma Wilson",
    status: "Active",
    location: "Grade 12A",
    verified: true,
    referral: {
      name: "John Smith",
      image: "/avatars/john-smith.jpg",
    },
    value: 95,
    joinDate: "2020-09-01",
    studentId: "S2024006",
    email: "emma.wilson@majorschool.edu",
    phone: "+1-555-678-9012",
    grade: "12",
    class: "12A",
    attendance: "95%",
    gpa: "4.0",
  },
  {
    id: "student-007",
    image: "/avatars/liam-thompson.jpg",
    name: "Liam Thompson",
    status: "Active",
    location: "Grade 9C",
    verified: true,
    referral: {
      name: "Sarah Johnson",
      image: "/avatars/sarah-johnson.jpg",
    },
    value: 85,
    joinDate: "2023-09-01",
    studentId: "S2024007",
    email: "liam.thompson@majorschool.edu",
    phone: "+1-555-789-0123",
    grade: "9",
    class: "9C",
    attendance: "85%",
    gpa: "3.4",
  },
  {
    id: "student-008",
    image: "/avatars/ava-garcia.jpg",
    name: "Ava Garcia",
    status: "Active",
    location: "Grade 10A",
    verified: true,
    referral: {
      name: "Michael Brown",
      image: "/avatars/michael-brown.jpg",
    },
    value: 92,
    joinDate: "2022-09-01",
    studentId: "S2024008",
    email: "ava.garcia@majorschool.edu",
    phone: "+1-555-890-1234",
    grade: "10",
    class: "10A",
    attendance: "92%",
    gpa: "3.8",
  },
  {
    id: "student-009",
    image: "/avatars/william-brown.jpg",
    name: "William Brown",
    status: "Inactive",
    location: "Grade 11B",
    verified: false,
    referral: {
      name: "Emily Davis",
      image: "/avatars/emily-davis.jpg",
    },
    value: 70,
    joinDate: "2021-09-01",
    studentId: "S2024009",
    email: "william.brown@majorschool.edu",
    phone: "+1-555-901-2345",
    grade: "11",
    class: "11B",
    attendance: "70%",
    gpa: "2.8",
  },
  {
    id: "student-010",
    image: "/avatars/mia-johnson.jpg",
    name: "Mia Johnson",
    status: "Active",
    location: "Grade 12A",
    verified: true,
    referral: {
      name: "David Johnson",
      image: "/avatars/david-johnson.jpg",
    },
    value: 93,
    joinDate: "2020-09-01",
    studentId: "S2024010",
    email: "mia.johnson@majorschool.edu",
    phone: "+1-555-012-3456",
    grade: "12",
    class: "12A",
    attendance: "93%",
    gpa: "3.9",
  },
];

// Custom columns for students
const getStudentColumns = () => [
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
  },
];

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchStudents = async () => {
      try {
        // In a real app, you would fetch data from an API
        // const response = await fetch('/api/students');
        // const data = await response.json();
        // setStudents(data);

        // For now, we'll just use the mock data
        setStudents(mockStudents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students data:", error);
        setLoading(false);
      }
    };

    fetchStudents();
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
        <h1 className="text-2xl font-bold">Students</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Students</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="grade9">Grade 9</TabsTrigger>
          <TabsTrigger value="grade10">Grade 10</TabsTrigger>
          <TabsTrigger value="grade11">Grade 11</TabsTrigger>
          <TabsTrigger value="grade12">Grade 12</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Students</CardTitle>
              <CardDescription>
                Manage all students in the system. Click on a student to view
                their profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading students...</p>
                </div>
              ) : (
                <DataView
                  initialData={students}
                  columns={getStudentColumns()}
                  onRowClick={(student) => {
                    window.location.href = `/classroom/students/${student.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Students</CardTitle>
              <CardDescription>
                View and manage currently active students.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading students...</p>
                </div>
              ) : (
                <DataView
                  initialData={students.filter(
                    (student) => student.status === "Active",
                  )}
                  columns={getStudentColumns()}
                  onRowClick={(student) => {
                    window.location.href = `/classroom/students/${student.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Students</CardTitle>
              <CardDescription>
                View and manage inactive students.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading students...</p>
                </div>
              ) : (
                <DataView
                  initialData={students.filter(
                    (student) => student.status === "Inactive",
                  )}
                  columns={getStudentColumns()}
                  onRowClick={(student) => {
                    window.location.href = `/classroom/students/${student.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grade9" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Grade 9 Students</CardTitle>
              <CardDescription>
                View and manage students in Grade 9.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading students...</p>
                </div>
              ) : (
                <DataView
                  initialData={students.filter(
                    (student) => student.grade === "9",
                  )}
                  columns={getStudentColumns()}
                  onRowClick={(student) => {
                    window.location.href = `/classroom/students/${student.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grade10" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Grade 10 Students</CardTitle>
              <CardDescription>
                View and manage students in Grade 10.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading students...</p>
                </div>
              ) : (
                <DataView
                  initialData={students.filter(
                    (student) => student.grade === "10",
                  )}
                  columns={getStudentColumns()}
                  onRowClick={(student) => {
                    window.location.href = `/classroom/students/${student.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grade11" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Grade 11 Students</CardTitle>
              <CardDescription>
                View and manage students in Grade 11.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading students...</p>
                </div>
              ) : (
                <DataView
                  initialData={students.filter(
                    (student) => student.grade === "11",
                  )}
                  columns={getStudentColumns()}
                  onRowClick={(student) => {
                    window.location.href = `/classroom/students/${student.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grade12" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Grade 12 Students</CardTitle>
              <CardDescription>
                View and manage students in Grade 12.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading students...</p>
                </div>
              ) : (
                <DataView
                  initialData={students.filter(
                    (student) => student.grade === "12",
                  )}
                  columns={getStudentColumns()}
                  onRowClick={(student) => {
                    window.location.href = `/classroom/students/${student.id}`;
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
