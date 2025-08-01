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
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";

// Mock data for classes
const mockClasses = [
  {
    id: "class-001",
    image: "/images/class-10a.png",
    name: "10A",
    status: "Active",
    location: "Room 101",
    verified: true,
    referral: {
      name: "John Smith",
      image: "/avatars/john-smith.jpg",
    },
    value: 95,
    joinDate: "2024-08-15",
    classId: "C2024001",
    grade: "10",
    academicYear: "2024-2025",
    classTeacher: {
      name: "Michael Brown",
      id: "teacher-001",
    },
    studentCount: 30,
    subjects: [
      "Mathematics",
      "English",
      "Science",
      "History",
      "Physical Education",
    ],
    schedule: "Monday to Friday, 8:00 AM - 3:00 PM",
    room: "Room 101",
  },
  {
    id: "class-002",
    image: "/images/class-11b.png",
    name: "11B",
    status: "Active",
    location: "Room 203",
    verified: true,
    referral: {
      name: "Sarah Johnson",
      image: "/avatars/sarah-johnson.jpg",
    },
    value: 92,
    joinDate: "2024-08-15",
    classId: "C2024002",
    grade: "11",
    academicYear: "2024-2025",
    classTeacher: {
      name: "Emily Davis",
      id: "teacher-002",
    },
    studentCount: 28,
    subjects: [
      "Mathematics",
      "English",
      "Science",
      "History",
      "Physical Education",
    ],
    schedule: "Monday to Friday, 8:00 AM - 3:00 PM",
    room: "Room 203",
  },
  {
    id: "class-003",
    image: "/images/class-9c.png",
    name: "9C",
    status: "Active",
    location: "Room 105",
    verified: true,
    referral: {
      name: "Michael Brown",
      image: "/avatars/michael-brown.jpg",
    },
    value: 90,
    joinDate: "2024-08-15",
    classId: "C2024003",
    grade: "9",
    academicYear: "2024-2025",
    classTeacher: {
      name: "David Johnson",
      id: "teacher-003",
    },
    studentCount: 32,
    subjects: [
      "Mathematics",
      "English",
      "Science",
      "History",
      "Physical Education",
    ],
    schedule: "Monday to Friday, 8:00 AM - 3:00 PM",
    room: "Room 105",
  },
  {
    id: "class-004",
    image: "/images/class-12a.png",
    name: "12A",
    status: "Active",
    location: "Room 301",
    verified: true,
    referral: {
      name: "Emily Davis",
      image: "/avatars/emily-davis.jpg",
    },
    value: 88,
    joinDate: "2024-08-15",
    classId: "C2024004",
    grade: "12",
    academicYear: "2024-2025",
    classTeacher: {
      name: "Sophia Wilson",
      id: "teacher-004",
    },
    studentCount: 25,
    subjects: [
      "Mathematics",
      "English",
      "Science",
      "History",
      "Physical Education",
    ],
    schedule: "Monday to Friday, 8:00 AM - 3:00 PM",
    room: "Room 301",
  },
  {
    id: "class-005",
    image: "/images/class-10b.png",
    name: "10B",
    status: "Inactive",
    location: "Room 102",
    verified: false,
    referral: {
      name: "David Johnson",
      image: "/avatars/david-johnson.jpg",
    },
    value: 75,
    joinDate: "2024-08-15",
    classId: "C2024005",
    grade: "10",
    academicYear: "2024-2025",
    classTeacher: {
      name: "James Thompson",
      id: "teacher-005",
    },
    studentCount: 0,
    subjects: [
      "Mathematics",
      "English",
      "Science",
      "History",
      "Physical Education",
    ],
    schedule: "Monday to Friday, 8:00 AM - 3:00 PM",
    room: "Room 102",
  },
  {
    id: "class-006",
    image: "/images/class-11a.png",
    name: "11A",
    status: "Active",
    location: "Room 202",
    verified: true,
    referral: {
      name: "John Smith",
      image: "/avatars/john-smith.jpg",
    },
    value: 92,
    joinDate: "2024-08-15",
    classId: "C2024006",
    grade: "11",
    academicYear: "2024-2025",
    classTeacher: {
      name: "Olivia Martinez",
      id: "teacher-006",
    },
    studentCount: 27,
    subjects: ["Mathematics", "English", "Science", "History", "Art"],
    schedule: "Monday to Friday, 8:00 AM - 3:00 PM",
    room: "Room 202",
  },
  {
    id: "class-007",
    image: "/images/class-9a.png",
    name: "9A",
    status: "Active",
    location: "Room 103",
    verified: true,
    referral: {
      name: "Sarah Johnson",
      image: "/avatars/sarah-johnson.jpg",
    },
    value: 90,
    joinDate: "2024-08-15",
    classId: "C2024007",
    grade: "9",
    academicYear: "2024-2025",
    classTeacher: {
      name: "William Garcia",
      id: "teacher-007",
    },
    studentCount: 30,
    subjects: ["Mathematics", "English", "Science", "History", "Music"],
    schedule: "Monday to Friday, 8:00 AM - 3:00 PM",
    room: "Room 103",
  },
  {
    id: "class-008",
    image: "/images/class-9b.png",
    name: "9B",
    status: "Active",
    location: "Room 104",
    verified: true,
    referral: {
      name: "Michael Brown",
      image: "/avatars/michael-brown.jpg",
    },
    value: 94,
    joinDate: "2024-08-15",
    classId: "C2024008",
    grade: "9",
    academicYear: "2024-2025",
    classTeacher: {
      name: "Ava Rodriguez",
      id: "teacher-008",
    },
    studentCount: 31,
    subjects: ["Mathematics", "English", "Science", "History", "Spanish"],
    schedule: "Monday to Friday, 8:00 AM - 3:00 PM",
    room: "Room 104",
  },
  {
    id: "class-009",
    image: "/images/class-12b.png",
    name: "12B",
    status: "Inactive",
    location: "Room 302",
    verified: false,
    referral: {
      name: "Emily Davis",
      image: "/avatars/emily-davis.jpg",
    },
    value: 80,
    joinDate: "2024-08-15",
    classId: "C2024009",
    grade: "12",
    academicYear: "2024-2025",
    classTeacher: {
      name: "Noah Lee",
      id: "teacher-009",
    },
    studentCount: 0,
    subjects: [
      "Mathematics",
      "English",
      "Science",
      "History",
      "Computer Science",
    ],
    schedule: "Monday to Friday, 8:00 AM - 3:00 PM",
    room: "Room 302",
  },
  {
    id: "class-010",
    image: "/images/class-10c.png",
    name: "10C",
    status: "Active",
    location: "Room 103",
    verified: true,
    referral: {
      name: "David Johnson",
      image: "/avatars/david-johnson.jpg",
    },
    value: 93,
    joinDate: "2024-08-15",
    classId: "C2024010",
    grade: "10",
    academicYear: "2024-2025",
    classTeacher: {
      name: "Emma Taylor",
      id: "teacher-010",
    },
    studentCount: 29,
    subjects: [
      "Mathematics",
      "English",
      "Science",
      "History",
      "Physical Education",
    ],
    schedule: "Monday to Friday, 8:00 AM - 3:00 PM",
    room: "Room 103",
  },
];

// Custom columns for classes
const getClassColumns = () => [
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
    accessorKey: "classId",
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
    header: "Class Teacher",
    accessorKey: "classTeacher",
    cell: (value) => value.name,
  },
  {
    header: "Students",
    accessorKey: "studentCount",
  },
  {
    header: "Room",
    accessorKey: "room",
  },
  {
    id: "actions",
    header: "Actions",
  },
];

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchClasses = async () => {
      try {
        // In a real app, you would fetch data from an API
        // const response = await fetch('/api/classes');
        // const data = await response.json();
        // setClasses(data);

        // For now, we'll just use the mock data
        setClasses(mockClasses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching classes data:", error);
        setLoading(false);
      }
    };

    fetchClasses();
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
        <h1 className="text-2xl font-bold">Classes</h1>
        <Button>
          <BookOpen className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Classes</TabsTrigger>
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
              <CardTitle>All Classes</CardTitle>
              <CardDescription>
                Manage all classes in the system. Click on a class to view its
                profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading classes...</p>
                </div>
              ) : (
                <DataView
                  initialData={classes}
                  columns={getClassColumns()}
                  onRowClick={(classItem) => {
                    window.location.href = `/classroom/classes/${classItem.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Classes</CardTitle>
              <CardDescription>
                View and manage currently active classes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading classes...</p>
                </div>
              ) : (
                <DataView
                  initialData={classes.filter(
                    (classItem) => classItem.status === "Active",
                  )}
                  columns={getClassColumns()}
                  onRowClick={(classItem) => {
                    window.location.href = `/classroom/classes/${classItem.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Classes</CardTitle>
              <CardDescription>
                View and manage inactive classes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading classes...</p>
                </div>
              ) : (
                <DataView
                  initialData={classes.filter(
                    (classItem) => classItem.status === "Inactive",
                  )}
                  columns={getClassColumns()}
                  onRowClick={(classItem) => {
                    window.location.href = `/classroom/classes/${classItem.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grade9" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Grade 9 Classes</CardTitle>
              <CardDescription>
                View and manage Grade 9 classes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading classes...</p>
                </div>
              ) : (
                <DataView
                  initialData={classes.filter(
                    (classItem) => classItem.grade === "9",
                  )}
                  columns={getClassColumns()}
                  onRowClick={(classItem) => {
                    window.location.href = `/classroom/classes/${classItem.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grade10" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Grade 10 Classes</CardTitle>
              <CardDescription>
                View and manage Grade 10 classes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading classes...</p>
                </div>
              ) : (
                <DataView
                  initialData={classes.filter(
                    (classItem) => classItem.grade === "10",
                  )}
                  columns={getClassColumns()}
                  onRowClick={(classItem) => {
                    window.location.href = `/classroom/classes/${classItem.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grade11" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Grade 11 Classes</CardTitle>
              <CardDescription>
                View and manage Grade 11 classes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading classes...</p>
                </div>
              ) : (
                <DataView
                  initialData={classes.filter(
                    (classItem) => classItem.grade === "11",
                  )}
                  columns={getClassColumns()}
                  onRowClick={(classItem) => {
                    window.location.href = `/classroom/classes/${classItem.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grade12" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Grade 12 Classes</CardTitle>
              <CardDescription>
                View and manage Grade 12 classes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading classes...</p>
                </div>
              ) : (
                <DataView
                  initialData={classes.filter(
                    (classItem) => classItem.grade === "12",
                  )}
                  columns={getClassColumns()}
                  onRowClick={(classItem) => {
                    window.location.href = `/classroom/classes/${classItem.id}`;
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
