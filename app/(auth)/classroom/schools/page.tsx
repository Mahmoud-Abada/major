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
import { Building } from "lucide-react";
import { useEffect, useState } from "react";

// Mock data for schools
const mockSchools = [
  {
    id: "school-001",
    image: "/images/major-academy-logo.png",
    name: "Major Academy",
    status: "Active",
    location: "Springfield, IL",
    verified: true,
    referral: {
      name: "John Smith",
      image: "/avatars/john-smith.jpg",
    },
    value: 95,
    joinDate: "1995-08-15",
    schoolId: "SCH2024001",
    email: "info@majoracademy.edu",
    phone: "+1-555-789-0123",
    website: "https://www.majoracademy.edu",
    address: "789 Education Blvd, Springfield, IL 62704",
    establishedYear: 1995,
    studentCount: 1250,
    teacherCount: 85,
    classCount: 45,
    type: "Private",
  },
  {
    id: "school-002",
    image: "/images/springfield-high-logo.png",
    name: "Springfield High School",
    status: "Active",
    location: "Springfield, IL",
    verified: true,
    referral: {
      name: "Sarah Johnson",
      image: "/avatars/sarah-johnson.jpg",
    },
    value: 92,
    joinDate: "1980-08-20",
    schoolId: "SCH2024002",
    email: "info@springfieldhigh.edu",
    phone: "+1-555-234-5678",
    website: "https://www.springfieldhigh.edu",
    address: "123 School St, Springfield, IL 62701",
    establishedYear: 1980,
    studentCount: 950,
    teacherCount: 65,
    classCount: 35,
    type: "Public",
  },
  {
    id: "school-003",
    image: "/images/lincoln-elementary-logo.png",
    name: "Lincoln Elementary School",
    status: "Active",
    location: "Springfield, IL",
    verified: true,
    referral: {
      name: "Michael Brown",
      image: "/avatars/michael-brown.jpg",
    },
    value: 90,
    joinDate: "1990-08-15",
    schoolId: "SCH2024003",
    email: "info@lincolnelementary.edu",
    phone: "+1-555-345-6789",
    website: "https://www.lincolnelementary.edu",
    address: "456 Lincoln Ave, Springfield, IL 62702",
    establishedYear: 1990,
    studentCount: 450,
    teacherCount: 30,
    classCount: 18,
    type: "Public",
  },
  {
    id: "school-004",
    image: "/images/washington-middle-logo.png",
    name: "Washington Middle School",
    status: "Active",
    location: "Springfield, IL",
    verified: true,
    referral: {
      name: "Emily Davis",
      image: "/avatars/emily-davis.jpg",
    },
    value: 88,
    joinDate: "1985-08-20",
    schoolId: "SCH2024004",
    email: "info@washingtonmiddle.edu",
    phone: "+1-555-456-7890",
    website: "https://www.washingtonmiddle.edu",
    address: "789 Washington St, Springfield, IL 62703",
    establishedYear: 1985,
    studentCount: 600,
    teacherCount: 40,
    classCount: 24,
    type: "Public",
  },
  {
    id: "school-005",
    image: "/images/montessori-academy-logo.png",
    name: "Montessori Academy",
    status: "Inactive",
    location: "Springfield, IL",
    verified: false,
    referral: {
      name: "David Johnson",
      image: "/avatars/david-johnson.jpg",
    },
    value: 75,
    joinDate: "2000-08-15",
    schoolId: "SCH2024005",
    email: "info@montessoriacademy.edu",
    phone: "+1-555-567-8901",
    website: "https://www.montessoriacademy.edu",
    address: "101 Montessori Way, Springfield, IL 62704",
    establishedYear: 2000,
    studentCount: 200,
    teacherCount: 15,
    classCount: 10,
    type: "Private",
  },
  {
    id: "school-006",
    image: "/images/st-marys-logo.png",
    name: "St. Mary's Catholic School",
    status: "Active",
    location: "Springfield, IL",
    verified: true,
    referral: {
      name: "John Smith",
      image: "/avatars/john-smith.jpg",
    },
    value: 92,
    joinDate: "1975-08-15",
    schoolId: "SCH2024006",
    email: "info@stmarys.edu",
    phone: "+1-555-678-9012",
    website: "https://www.stmarys.edu",
    address: "202 Church St, Springfield, IL 62705",
    establishedYear: 1975,
    studentCount: 350,
    teacherCount: 25,
    classCount: 15,
    type: "Religious",
  },
  {
    id: "school-007",
    image: "/images/tech-prep-logo.png",
    name: "Tech Prep Academy",
    status: "Active",
    location: "Springfield, IL",
    verified: true,
    referral: {
      name: "Sarah Johnson",
      image: "/avatars/sarah-johnson.jpg",
    },
    value: 85,
    joinDate: "2010-08-20",
    schoolId: "SCH2024007",
    email: "info@techprep.edu",
    phone: "+1-555-789-0123",
    website: "https://www.techprep.edu",
    address: "303 Technology Blvd, Springfield, IL 62706",
    establishedYear: 2010,
    studentCount: 300,
    teacherCount: 20,
    classCount: 12,
    type: "Charter",
  },
  {
    id: "school-008",
    image: "/images/arts-academy-logo.png",
    name: "Springfield Arts Academy",
    status: "Active",
    location: "Springfield, IL",
    verified: true,
    referral: {
      name: "Michael Brown",
      image: "/avatars/michael-brown.jpg",
    },
    value: 90,
    joinDate: "2005-08-15",
    schoolId: "SCH2024008",
    email: "info@artsacademy.edu",
    phone: "+1-555-890-1234",
    website: "https://www.artsacademy.edu",
    address: "404 Arts Way, Springfield, IL 62707",
    establishedYear: 2005,
    studentCount: 250,
    teacherCount: 18,
    classCount: 10,
    type: "Charter",
  },
  {
    id: "school-009",
    image: "/images/international-school-logo.png",
    name: "Springfield International School",
    status: "Inactive",
    location: "Springfield, IL",
    verified: false,
    referral: {
      name: "Emily Davis",
      image: "/avatars/emily-davis.jpg",
    },
    value: 70,
    joinDate: "2015-08-20",
    schoolId: "SCH2024009",
    email: "info@internationalschool.edu",
    phone: "+1-555-901-2345",
    website: "https://www.internationalschool.edu",
    address: "505 Global Ave, Springfield, IL 62708",
    establishedYear: 2015,
    studentCount: 180,
    teacherCount: 14,
    classCount: 9,
    type: "Private",
  },
  {
    id: "school-010",
    image: "/images/stem-academy-logo.png",
    name: "STEM Academy",
    status: "Active",
    location: "Springfield, IL",
    verified: true,
    referral: {
      name: "David Johnson",
      image: "/avatars/david-johnson.jpg",
    },
    value: 93,
    joinDate: "2012-08-15",
    schoolId: "SCH2024010",
    email: "info@stemacademy.edu",
    phone: "+1-555-012-3456",
    website: "https://www.stemacademy.edu",
    address: "606 Science Dr, Springfield, IL 62709",
    establishedYear: 2012,
    studentCount: 320,
    teacherCount: 22,
    classCount: 14,
    type: "Charter",
  },
];

// Custom columns for schools
const getSchoolColumns = () => [
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
    accessorKey: "schoolId",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "Type",
    accessorKey: "type",
  },
  {
    header: "Students",
    accessorKey: "studentCount",
  },
  {
    header: "Teachers",
    accessorKey: "teacherCount",
  },
  {
    header: "Classes",
    accessorKey: "classCount",
  },
  {
    header: "Established",
    accessorKey: "establishedYear",
  },
  {
    id: "actions",
    header: "Actions",
  },
];

export default function SchoolsPage() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchSchools = async () => {
      try {
        // In a real app, you would fetch data from an API
        // const response = await fetch('/api/schools');
        // const data = await response.json();
        // setSchools(data);

        // For now, we'll just use the mock data
        setSchools(mockSchools);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching schools data:", error);
        setLoading(false);
      }
    };

    fetchSchools();
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
        <h1 className="text-2xl font-bold">Schools</h1>
        <Button>
          <Building className="mr-2 h-4 w-4" />
          Add School
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Schools</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="public">Public</TabsTrigger>
          <TabsTrigger value="private">Private</TabsTrigger>
          <TabsTrigger value="charter">Charter</TabsTrigger>
          <TabsTrigger value="religious">Religious</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Schools</CardTitle>
              <CardDescription>
                Manage all schools in the system. Click on a school to view its
                profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading schools...</p>
                </div>
              ) : (
                <DataView
                  initialData={schools}
                  columns={getSchoolColumns()}
                  onRowClick={(school) => {
                    window.location.href = `/classroom/schools/${school.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Schools</CardTitle>
              <CardDescription>
                View and manage currently active schools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading schools...</p>
                </div>
              ) : (
                <DataView
                  initialData={schools.filter(
                    (school) => school.status === "Active",
                  )}
                  columns={getSchoolColumns()}
                  onRowClick={(school) => {
                    window.location.href = `/classroom/schools/${school.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Schools</CardTitle>
              <CardDescription>
                View and manage inactive schools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading schools...</p>
                </div>
              ) : (
                <DataView
                  initialData={schools.filter(
                    (school) => school.status === "Inactive",
                  )}
                  columns={getSchoolColumns()}
                  onRowClick={(school) => {
                    window.location.href = `/classroom/schools/${school.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="public" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Public Schools</CardTitle>
              <CardDescription>View and manage public schools.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading schools...</p>
                </div>
              ) : (
                <DataView
                  initialData={schools.filter(
                    (school) => school.type === "Public",
                  )}
                  columns={getSchoolColumns()}
                  onRowClick={(school) => {
                    window.location.href = `/classroom/schools/${school.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="private" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Private Schools</CardTitle>
              <CardDescription>
                View and manage private schools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading schools...</p>
                </div>
              ) : (
                <DataView
                  initialData={schools.filter(
                    (school) => school.type === "Private",
                  )}
                  columns={getSchoolColumns()}
                  onRowClick={(school) => {
                    window.location.href = `/classroom/schools/${school.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charter" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Charter Schools</CardTitle>
              <CardDescription>
                View and manage charter schools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading schools...</p>
                </div>
              ) : (
                <DataView
                  initialData={schools.filter(
                    (school) => school.type === "Charter",
                  )}
                  columns={getSchoolColumns()}
                  onRowClick={(school) => {
                    window.location.href = `/classroom/schools/${school.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="religious" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Religious Schools</CardTitle>
              <CardDescription>
                View and manage religious schools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading schools...</p>
                </div>
              ) : (
                <DataView
                  initialData={schools.filter(
                    (school) => school.type === "Religious",
                  )}
                  columns={getSchoolColumns()}
                  onRowClick={(school) => {
                    window.location.href = `/classroom/schools/${school.id}`;
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
