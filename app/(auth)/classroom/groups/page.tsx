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
import { Users } from "lucide-react";
import { useEffect, useState } from "react";

// Empty groups array - will be populated from API
const mockGroups: any[] = [];
image: "/images/science-club.png",
  name: "Science Club",
    status: "Active",
      location: "Science Lab 2",
        verified: true,
          referral: {
  name: "John Smith",
    image: "/avatars/john-smith.jpg",
    },
value: 95,
  joinDate: "2024-01-15",
    groupId: "GRP2024001",
      type: "Academic Club",
        description:
"A club for students interested in science and scientific exploration.",
  coordinator: {
  name: "David Johnson",
    id: "teacher-003",
      role: "Teacher",
    },
memberCount: 25,
  meetingSchedule: "Every Tuesday, 3:30 PM - 5:00 PM",
    activityCount: 3,
  },
{
  id: "group-002",
    image: "/images/debate-team.png",
      name: "Debate Team",
        status: "Active",
          location: "Room 201",
            verified: true,
              referral: {
    name: "Sarah Johnson",
      image: "/avatars/sarah-johnson.jpg",
    },
  value: 92,
    joinDate: "2024-01-20",
      groupId: "GRP2024002",
        type: "Academic Team",
          description:
  "A team that participates in debate competitions and tournaments.",
    coordinator: {
    name: "Emily Davis",
      id: "teacher-002",
        role: "Teacher",
    },
  memberCount: 15,
    meetingSchedule: "Every Wednesday, 3:30 PM - 5:00 PM",
      activityCount: 4,
  },
{
  id: "group-003",
    image: "/images/basketball-team.png",
      name: "Basketball Team",
        status: "Active",
          location: "Gymnasium",
            verified: true,
              referral: {
    name: "Michael Brown",
      image: "/avatars/michael-brown.jpg",
    },
  value: 90,
    joinDate: "2024-01-25",
      groupId: "GRP2024003",
        type: "Sports Team",
          description:
  "The school's basketball team that competes in regional tournaments.",
    coordinator: {
    name: "James Thompson",
      id: "teacher-005",
        role: "Teacher",
    },
  memberCount: 12,
    meetingSchedule: "Monday, Wednesday, Friday, 4:00 PM - 6:00 PM",
      activityCount: 5,
  },
{
  id: "group-004",
    image: "/images/art-club.png",
      name: "Art Club",
        status: "Active",
          location: "Art Studio",
            verified: true,
              referral: {
    name: "Emily Davis",
      image: "/avatars/emily-davis.jpg",
    },
  value: 88,
    joinDate: "2024-02-01",
      groupId: "GRP2024004",
        type: "Creative Club",
          description:
  "A club for students interested in various forms of visual arts.",
    coordinator: {
    name: "Olivia Martinez",
      id: "teacher-006",
        role: "Teacher",
    },
  memberCount: 20,
    meetingSchedule: "Every Thursday, 3:30 PM - 5:00 PM",
      activityCount: 3,
  },
{
  id: "group-005",
    image: "/images/chess-club.png",
      name: "Chess Club",
        status: "Inactive",
          location: "Library",
            verified: false,
              referral: {
    name: "David Johnson",
      image: "/avatars/david-johnson.jpg",
    },
  value: 75,
    joinDate: "2024-02-05",
      groupId: "GRP2024005",
        type: "Academic Club",
          description: "A club for chess enthusiasts to play and learn strategies.",
            coordinator: {
    name: "Noah Lee",
      id: "teacher-009",
        role: "Teacher",
    },
  memberCount: 0,
    meetingSchedule: "Every Friday, 3:30 PM - 5:00 PM",
      activityCount: 0,
  },
{
  id: "group-006",
    image: "/images/choir.png",
      name: "School Choir",
        status: "Active",
          location: "Music Room",
            verified: true,
              referral: {
    name: "John Smith",
      image: "/avatars/john-smith.jpg",
    },
  value: 92,
    joinDate: "2024-02-10",
      groupId: "GRP2024006",
        type: "Music Group",
          description:
  "The school choir that performs at school events and competitions.",
    coordinator: {
    name: "William Garcia",
      id: "teacher-007",
        role: "Teacher",
    },
  memberCount: 30,
    meetingSchedule: "Tuesday and Thursday, 3:30 PM - 5:00 PM",
      activityCount: 4,
  },
{
  id: "group-007",
    image: "/images/robotics-club.png",
      name: "Robotics Club",
        status: "Active",
          location: "Computer Lab",
            verified: true,
              referral: {
    name: "Sarah Johnson",
      image: "/avatars/sarah-johnson.jpg",
    },
  value: 90,
    joinDate: "2024-02-15",
      groupId: "GRP2024007",
        type: "STEM Club",
          description:
  "A club focused on building and programming robots for competitions.",
    coordinator: {
    name: "Noah Lee",
      id: "teacher-009",
        role: "Teacher",
    },
  memberCount: 18,
    meetingSchedule: "Every Monday, 3:30 PM - 5:30 PM",
      activityCount: 3,
  },
{
  id: "group-008",
    image: "/images/environmental-club.png",
      name: "Environmental Club",
        status: "Active",
          location: "Room 105",
            verified: true,
              referral: {
    name: "Michael Brown",
      image: "/avatars/michael-brown.jpg",
    },
  value: 94,
    joinDate: "2024-02-20",
      groupId: "GRP2024008",
        type: "Service Club",
          description:
  "A club dedicated to environmental awareness and conservation projects.",
    coordinator: {
    name: "Sophia Wilson",
      id: "teacher-004",
        role: "Teacher",
    },
  memberCount: 22,
    meetingSchedule: "Every Wednesday, 3:30 PM - 4:30 PM",
      activityCount: 5,
  },
{
  id: "group-009",
    image: "/images/drama-club.png",
      name: "Drama Club",
        status: "Inactive",
          location: "Auditorium",
            verified: false,
              referral: {
    name: "Emily Davis",
      image: "/avatars/emily-davis.jpg",
    },
  value: 80,
    joinDate: "2024-02-25",
      groupId: "GRP2024009",
        type: "Creative Club",
          description:
  "A club for students interested in theater and performing arts.",
    coordinator: {
    name: "Emma Taylor",
      id: "teacher-010",
        role: "Teacher",
    },
  memberCount: 0,
    meetingSchedule: "Every Tuesday and Thursday, 4:00 PM - 6:00 PM",
      activityCount: 0,
  },
{
  id: "group-010",
    image: "/images/student-council.png",
      name: "Student Council",
        status: "Active",
          location: "Conference Room",
            verified: true,
              referral: {
    name: "David Johnson",
      image: "/avatars/david-johnson.jpg",
    },
  value: 93,
    joinDate: "2024-03-01",
      groupId: "GRP2024010",
        type: "Leadership Group",
          description:
  "The student government body that represents the student body.",
    coordinator: {
    name: "Michael Brown",
      id: "teacher-001",
        role: "Teacher",
    },
  memberCount: 10,
    meetingSchedule: "Every Monday, 3:30 PM - 4:30 PM",
      activityCount: 6,
  },
];

// Custom columns for groups
const getGroupColumns = () => [
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
    accessorKey: "groupId",
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
    header: "Coordinator",
    accessorKey: "coordinator",
    cell: (value) => value.name,
  },
  {
    header: "Members",
    accessorKey: "memberCount",
  },
  {
    header: "Activities",
    accessorKey: "activityCount",
  },
  {
    id: "actions",
    header: "Actions",
  },
];

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchGroups = async () => {
      try {
        // In a real app, you would fetch data from an API
        // const response = await fetch('/api/groups');
        // const data = await response.json();
        // setGroups(data);

        // For now, we'll just use the mock data
        setGroups(mockGroups);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching groups data:", error);
        setLoading(false);
      }
    };

    fetchGroups();
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
        <h1 className="text-2xl font-bold">Groups</h1>
        <Button>
          <Users className="mr-2 h-4 w-4" />
          Add Group
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Groups</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="sports">Sports</TabsTrigger>
          <TabsTrigger value="creative">Creative</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Groups</CardTitle>
              <CardDescription>
                Manage all groups in the system. Click on a group to view its
                profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading groups...</p>
                </div>
              ) : (
                <DataView
                  initialData={groups}
                  columns={getGroupColumns()}
                  onRowClick={(group) => {
                    window.location.href = `/classroom/groups/${group.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Groups</CardTitle>
              <CardDescription>
                View and manage currently active groups.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading groups...</p>
                </div>
              ) : (
                <DataView
                  initialData={groups.filter(
                    (group) => group.status === "Active",
                  )}
                  columns={getGroupColumns()}
                  onRowClick={(group) => {
                    window.location.href = `/classroom/groups/${group.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Groups</CardTitle>
              <CardDescription>
                View and manage inactive groups.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading groups...</p>
                </div>
              ) : (
                <DataView
                  initialData={groups.filter(
                    (group) => group.status === "Inactive",
                  )}
                  columns={getGroupColumns()}
                  onRowClick={(group) => {
                    window.location.href = `/classroom/groups/${group.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Groups</CardTitle>
              <CardDescription>
                View and manage academic clubs and teams.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading groups...</p>
                </div>
              ) : (
                <DataView
                  initialData={groups.filter(
                    (group) =>
                      group.type.includes("Academic") ||
                      group.type.includes("STEM"),
                  )}
                  columns={getGroupColumns()}
                  onRowClick={(group) => {
                    window.location.href = `/classroom/groups/${group.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sports" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sports Groups</CardTitle>
              <CardDescription>
                View and manage sports teams and clubs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading groups...</p>
                </div>
              ) : (
                <DataView
                  initialData={groups.filter((group) =>
                    group.type.includes("Sports"),
                  )}
                  columns={getGroupColumns()}
                  onRowClick={(group) => {
                    window.location.href = `/classroom/groups/${group.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creative" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Creative Groups</CardTitle>
              <CardDescription>
                View and manage creative and arts-focused groups.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading groups...</p>
                </div>
              ) : (
                <DataView
                  initialData={groups.filter(
                    (group) =>
                      group.type.includes("Creative") ||
                      group.type.includes("Music"),
                  )}
                  columns={getGroupColumns()}
                  onRowClick={(group) => {
                    window.location.href = `/classroom/groups/${group.id}`;
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="other" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Other Groups</CardTitle>
              <CardDescription>
                View and manage other types of groups.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading groups...</p>
                </div>
              ) : (
                <DataView
                  initialData={groups.filter(
                    (group) =>
                      !group.type.includes("Academic") &&
                      !group.type.includes("STEM") &&
                      !group.type.includes("Sports") &&
                      !group.type.includes("Creative") &&
                      !group.type.includes("Music"),
                  )}
                  columns={getGroupColumns()}
                  onRowClick={(group) => {
                    window.location.href = `/classroom/groups/${group.id}`;
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
