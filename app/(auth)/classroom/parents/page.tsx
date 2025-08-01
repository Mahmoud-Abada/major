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

// Mock data for parents
const mockParents = [
  {
    id: "parent-001",
    image: "/avatars/robert-wilson.jpg",
    name: "Robert Wilson",
    status: "Active",
    location: "Springfield, IL",
    verified: true,
    referral: {
      name: "John Smith",
      image: "/avatars/john-smith.jpg",
    },
    value: 90,
    joinDate: "2024-02-01",
    parentId: "P2024001",
    email: "robert.wilson@example.com",
    phone: "+1-555-456-7890",
    relationship: "Father",
    occupation: "Software Engineer",
    address: "123 Main St, Springfield, IL 62701",
    children: [
      {
        id: "student-001",
        name: "Alex Wilson",
        grade: "10",
        class: "10A",
      },
    ],
  },
  {
    id: "parent-002",
    image: "/avatars/maria-martinez.jpg",
    name: "Maria Martinez",
    status: "Active",
    location: "Springfield, IL",
    verified: true,
    referral: {
      name: "Sarah Johnson",
      image: "/avatars/sarah-johnson.jpg",
    },
    value: 85,
    joinDate: "2024-02-05",
    parentId: "P2024002",
    email: "maria.martinez@example.com",
    phone: "+1-555-567-8901",
    relationship: "Mother",
    occupation: "Doctor",
    address: "456 Oak Ave, Springfield, IL 62702",
    children: [
      {
        id: "student-002",
        name: "Olivia Martinez",
        grade: "11",
        class: "11B",
      },
    ],
  },
  {
    id: "parent-003",
    image: "/avatars/james-johnson.jpg",
    name: "James Johnson",
    status: "Active",
    location: "Springfield, IL",
    verified: true,
    referral: {
      name: "Michael Brown",
      image: "/avatars/michael-brown.jpg",
    },
    value: 88,
    joinDate: "2024-02-10",
    parentId: "P2024003",
    email: "james.johnson@example.com",
    phone: "+1-555-678-9012",
    relationship: "Father",
    occupation: "Accountant",
    address: "789 Elm St, Springfield, IL 62703",
    children: [
      {
        id: "student-003",
        name: "Ethan Johnson",
        grade: "10",
        class: "10A",
      },
    ],
  },
  {
    id: "parent-004",
    image: "/avatars/jennifer-brown.jpg",
    name: "Jennifer Brown",
    status: "Active",
    location: "Springfield, IL",
    verified: true,
    referral: {
      name: "Emily Davis",
      image: "/avatars/emily-davis.jpg",
    },
    value: 92,
    joinDate: "2024-02-15",
    parentId: "P2024004",
    email: "jennifer.brown@example.com",
    phone: "+1-555-789-0123",
    relationship: "Mother",
    occupation: "Lawyer",
    address: "101 Pine St, Springfield, IL 62704",
    children: [
      {
        id: "student-004",
        name: "Sophia Brown",
        grade: "9",
        class: "9C",
      },
      {
        id: "student-009",
        name: "William Brown",
        grade: "11",
        class: "11B",
      },
    ],
  },
  {
    id: "parent-005",
    image: "/avatars/david-davis.jpg",
    name: "David Davis",
    status: "Inactive",
    location: "Springfield, IL",
    verified: false,
    referral: {
      name: "David Johnson",
      image: "/avatars/david-johnson.jpg",
    },
    value: 70,
    joinDate: "2024-02-20",
    parentId: "P2024005",
    email: "david.davis@example.com",
    phone: "+1-555-890-1234",
    relationship: "Father",
    occupation: "Engineer",
    address: "202 Cedar St, Springfield, IL 62705",
    children: [
      {
        id: "student-005",
        name: "Noah Davis",
        grade: "11",
        class: "11B",
      },
    ],
  },
  {
    id: "parent-006",
    image: "/avatars/susan-wilson.jpg",
    name: "Susan Wilson",
    status: "Active",
    location: "Springfield, IL",
    verified: true,
    referral: {
      name: "John Smith",
      image: "/avatars/john-smith.jpg",
    },
    value: 95,
    joinDate: "2024-02-25",
    parentId: "P2024006",
    email: "susan.wilson@example.com",
    phone: "+1-555-901-2345",
    relationship: "Mother",
    occupation: "Teacher",
    address: "303 Maple St, Springfield, IL 62706",
    children: [
      {
        id: "student-006",
        name: "Emma Wilson",
        grade: "12",
        class: "12A",
      },
    ],
  },
  {
    id: "parent-007",
    image: "/avatars/michael-thompson.jpg",
    name: "Michael Thompson",
    status: "Active",
    location: "Springfield, IL",
    verified: true,
    referral: {
      name: "Sarah Johnson",
      image: "/avatars/sarah-johnson.jpg",
    },
    value: 87,
    joinDate: "2024-03-01",
    parentId: "P2024007",
    email: "michael.thompson@example.com",
    phone: "+1-555-012-3456",
    relationship: "Father",
    occupation: "Architect",
    address: "404 Birch St, Springfield, IL 62707",
    children: [
      {
        id: "student-007",
        name: "Liam Thompson",
        grade: "9",
        class: "9C",
      },
    ],
  },
  {
    id: "parent-008",
    image: "/avatars/linda-garcia.jpg",
    name: "Linda Garcia",
    status: "Active",
    location: "Springfield, IL",
    verified: true,
    referral: {
      name: "Michael Brown",
      image: "/avatars/michael-brown.jpg",
    },
    value: 93,
    joinDate: "2024-03-05",
    parentId: "P2024008",
    email: "linda.garcia@example.com",
    phone: "+1-555-123-4567",
    relationship: "Mother",
    occupation: "Nurse",
    address: "505 Walnut St, Springfield, IL 62708",
    children: [
      {
        id: "student-008",
        name: "Ava Garcia",
        grade: "10",
        class: "10A",
      },
    ],
  },
  {
    id: "parent-009",
    image: "/avatars/richard-johnson.jpg",
    name: "Richard Johnson",
    status: "Inactive",
    location: "Springfield, IL",
    verified: false,
    referral: {
      name: "Emily Davis",
      image: "/avatars/emily-davis.jpg",
    },
    value: 65,
    joinDate: "2024-03-10",
    parentId: "P2024009",
    email: "richard.johnson@example.com",
    phone: "+1-555-234-5678",
    relationship: "Father",
    occupation: "Sales Manager",
    address: "606 Ash St, Springfield, IL 62709",
    children: [
      {
        id: "student-010",
        name: "Mia Johnson",
        grade: "12",
        class: "12A",
      },
    ],
  },
  {
    id: "parent-010",
    image: "/avatars/patricia-rodriguez.jpg",
    name: "Patricia Rodriguez",
    status: "Active",
    location: "Springfield, IL",
    verified: true,
    referral: {
      name: "David Johnson",
      image: "/avatars/david-johnson.jpg",
    },
    value: 91,
    joinDate: "2024-03-15",
    parentId: "P2024010",
    email: "patricia.rodriguez@example.com",
    phone: "+1-555-345-6789",
    relationship: "Guardian",
    occupation: "Business Owner",
    address: "707 Oak St, Springfield, IL 62710",
    children: [
      {
        id: "student-011",
        name: "Lucas Rodriguez",
        grade: "9",
        class: "9C",
      },
      {
        id: "student-012",
        name: "Isabella Rodriguez",
        grade: "11",
        class: "11B",
      },
    ],
  },
];

// Custom columns for parents
const getParentColumns = () => [
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
    accessorKey: "parentId",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "Relationship",
    accessorKey: "relationship",
  },
  {
    header: "Children",
    accessorKey: "children",
    cell: (value) => value.map((child) => child.name).join(", "),
  },
  {
    header: "Location",
    accessorKey: "location",
  },
  {
    header: "Occupation",
    accessorKey: "occupation",
  },
  {
    id: "actions",
    header: "Actions",
  },
];

export default function ParentsPage() {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchParents = async () => {
      try {
        // In a real app, you would fetch data from an API
        // const response = await fetch('/api/parents');
        // const data = await response.json();
        // setParents(data);

        // For now, we'll just use the mock data
        setParents(mockParents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching parents data:", error);
        setLoading(false);
      }
    };

    fetchParents();
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
        <h1 className="text-2xl font-bold">Parents</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Parent
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Parents</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="father">Fathers</TabsTrigger>
          <TabsTrigger value="mother">Mothers</TabsTrigger>
          <TabsTrigger value="guardian">Guardians</TabsTrigger>
          <TabsTrigger value="multiple">Multiple Children</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Parents</CardTitle>
              <CardDescription>
                Manage all parents in the system. Click on a parent to view
                their profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading parents...</p>
                </div>
              ) : (
                <DataView
                  initialData={parents}
                  columns={getParentColumns()}
                  onRowClick={(parent) => {
                    window.location.href = `/classroom/parents/${parent.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Parents</CardTitle>
              <CardDescription>
                View and manage currently active parents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading parents...</p>
                </div>
              ) : (
                <DataView
                  initialData={parents.filter(
                    (parent) => parent.status === "Active",
                  )}
                  columns={getParentColumns()}
                  onRowClick={(parent) => {
                    window.location.href = `/classroom/parents/${parent.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Parents</CardTitle>
              <CardDescription>
                View and manage inactive parents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading parents...</p>
                </div>
              ) : (
                <DataView
                  initialData={parents.filter(
                    (parent) => parent.status === "Inactive",
                  )}
                  columns={getParentColumns()}
                  onRowClick={(parent) => {
                    window.location.href = `/classroom/parents/${parent.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="father" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Fathers</CardTitle>
              <CardDescription>
                View and manage parents with Father relationship.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading parents...</p>
                </div>
              ) : (
                <DataView
                  initialData={parents.filter(
                    (parent) => parent.relationship === "Father",
                  )}
                  columns={getParentColumns()}
                  onRowClick={(parent) => {
                    window.location.href = `/classroom/parents/${parent.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mother" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Mothers</CardTitle>
              <CardDescription>
                View and manage parents with Mother relationship.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading parents...</p>
                </div>
              ) : (
                <DataView
                  initialData={parents.filter(
                    (parent) => parent.relationship === "Mother",
                  )}
                  columns={getParentColumns()}
                  onRowClick={(parent) => {
                    window.location.href = `/classroom/parents/${parent.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guardian" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Guardians</CardTitle>
              <CardDescription>
                View and manage parents with Guardian relationship.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading parents...</p>
                </div>
              ) : (
                <DataView
                  initialData={parents.filter(
                    (parent) => parent.relationship === "Guardian",
                  )}
                  columns={getParentColumns()}
                  onRowClick={(parent) => {
                    window.location.href = `/classroom/parents/${parent.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="multiple" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Parents with Multiple Children</CardTitle>
              <CardDescription>
                View and manage parents with multiple children.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading parents...</p>
                </div>
              ) : (
                <DataView
                  initialData={parents.filter(
                    (parent) => parent.children.length > 1,
                  )}
                  columns={getParentColumns()}
                  onRowClick={(parent) => {
                    window.location.href = `/classroom/parents/${parent.id}`;
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
