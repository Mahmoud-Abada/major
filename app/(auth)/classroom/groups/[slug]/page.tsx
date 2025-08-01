"use client";

import { EntityProfile } from "@/components/profile/EntityProfile";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileTab } from "@/components/profile/ProfileTabs";
import { GroupActivities } from "@/components/profile/group/GroupActivities";
import { GroupInfo } from "@/components/profile/group/GroupInfo";
import { GroupMembers } from "@/components/profile/group/GroupMembers";
import { GroupResources } from "@/components/profile/group/GroupResources";
import { GroupSchedule } from "@/components/profile/group/GroupSchedule";
import { Activity, Calendar, FileText, Info, Users } from "lucide-react";
import { useEffect, useState } from "react";

// Mock data for group profile
const mockGroup = {
  id: "group-001",
  name: "Science Club",
  type: "Academic Club",
  description:
    "A club for students interested in science and scientific exploration. We conduct experiments, participate in science fairs, and organize field trips to science museums and research facilities.",
  createdAt: "2024-01-15",
  status: "Active",
  groupId: "GRP2024001",
  memberCount: 25,
  coordinator: {
    name: "David Johnson",
    id: "teacher-003",
    role: "Teacher",
  },
  contactEmail: "scienceclub@majorschool.edu",
  contactPhone: "+1-555-123-4567",
  meetingLocation: "Science Lab 2",
  meetingSchedule: "Every Tuesday, 3:30 PM - 5:00 PM",
  members: [
    {
      id: "teacher-003",
      name: "David Johnson",
      avatar: "/avatars/david-johnson.jpg",
      role: "Coordinator",
      type: "teacher",
      joinDate: "2024-01-15",
      status: "Active",
      attendance: 100,
      participation: 100,
    },
    {
      id: "student-001",
      name: "Alex Wilson",
      avatar: "/avatars/alex-wilson.jpg",
      role: "President",
      type: "student",
      joinDate: "2024-01-20",
      status: "Active",
      attendance: 95,
      participation: 98,
    },
    {
      id: "student-002",
      name: "Olivia Martinez",
      avatar: "/avatars/olivia-martinez.jpg",
      role: "Vice President",
      type: "student",
      joinDate: "2024-01-20",
      status: "Active",
      attendance: 92,
      participation: 95,
    },
    {
      id: "student-003",
      name: "Ethan Johnson",
      avatar: "/avatars/ethan-johnson.jpg",
      role: "Secretary",
      type: "student",
      joinDate: "2024-01-25",
      status: "Active",
      attendance: 88,
      participation: 85,
    },
    {
      id: "student-004",
      name: "Sophia Brown",
      avatar: "/avatars/sophia-brown.jpg",
      role: "Treasurer",
      type: "student",
      joinDate: "2024-01-25",
      status: "Active",
      attendance: 90,
      participation: 92,
    },
    {
      id: "student-005",
      name: "Noah Davis",
      avatar: "/avatars/noah-davis.jpg",
      role: "Member",
      type: "student",
      joinDate: "2024-02-01",
      status: "Active",
      attendance: 85,
      participation: 80,
    },
    {
      id: "student-006",
      name: "Emma Wilson",
      avatar: "/avatars/emma-wilson.jpg",
      role: "Member",
      type: "student",
      joinDate: "2024-02-01",
      status: "Active",
      attendance: 95,
      participation: 90,
    },
    {
      id: "student-007",
      name: "Liam Thompson",
      avatar: "/avatars/liam-thompson.jpg",
      role: "Member",
      type: "student",
      joinDate: "2024-02-05",
      status: "Active",
      attendance: 80,
      participation: 75,
    },
    {
      id: "student-008",
      name: "Ava Garcia",
      avatar: "/avatars/ava-garcia.jpg",
      role: "Member",
      type: "student",
      joinDate: "2024-02-05",
      status: "Active",
      attendance: 92,
      participation: 88,
    },
    {
      id: "student-009",
      name: "William Brown",
      avatar: "/avatars/william-brown.jpg",
      role: "Member",
      type: "student",
      joinDate: "2024-02-10",
      status: "Warning",
      attendance: 70,
      participation: 65,
    },
  ],
  activities: [
    {
      id: "activity-001",
      title: "Science Fair Preparation",
      description: "Preparing projects for the annual science fair.",
      startDate: "2025-09-15T15:30:00",
      endDate: "2025-09-15T17:00:00",
      location: "Science Lab 2",
      status: "Upcoming",
      organizer: {
        name: "David Johnson",
        id: "teacher-003",
        role: "teacher",
      },
      participants: [
        {
          name: "Alex Wilson",
          id: "student-001",
          role: "President",
          status: "Confirmed",
        },
        {
          name: "Olivia Martinez",
          id: "student-002",
          role: "Vice President",
          status: "Confirmed",
        },
        {
          name: "Ethan Johnson",
          id: "student-003",
          role: "Secretary",
          status: "Confirmed",
        },
        {
          name: "Sophia Brown",
          id: "student-004",
          role: "Treasurer",
          status: "Confirmed",
        },
        {
          name: "Noah Davis",
          id: "student-005",
          role: "Member",
          status: "Pending",
        },
      ],
      type: "Meeting",
    },
    {
      id: "activity-002",
      title: "Field Trip to Science Museum",
      description: "Visit to the city science museum to explore new exhibits.",
      startDate: "2025-10-05T09:00:00",
      endDate: "2025-10-05T15:00:00",
      location: "City Science Museum",
      status: "Upcoming",
      organizer: {
        name: "David Johnson",
        id: "teacher-003",
        role: "teacher",
      },
      participants: [
        {
          name: "Alex Wilson",
          id: "student-001",
          role: "President",
          status: "Confirmed",
        },
        {
          name: "Olivia Martinez",
          id: "student-002",
          role: "Vice President",
          status: "Confirmed",
        },
        {
          name: "Ethan Johnson",
          id: "student-003",
          role: "Secretary",
          status: "Confirmed",
        },
        {
          name: "Sophia Brown",
          id: "student-004",
          role: "Treasurer",
          status: "Confirmed",
        },
        {
          name: "Noah Davis",
          id: "student-005",
          role: "Member",
          status: "Confirmed",
        },
        {
          name: "Emma Wilson",
          id: "student-006",
          role: "Member",
          status: "Confirmed",
        },
        {
          name: "Liam Thompson",
          id: "student-007",
          role: "Member",
          status: "Pending",
        },
        {
          name: "Ava Garcia",
          id: "student-008",
          role: "Member",
          status: "Confirmed",
        },
      ],
      type: "Field Trip",
    },
    {
      id: "activity-003",
      title: "Guest Speaker: Dr. Emily Chen",
      description:
        "Lecture by Dr. Emily Chen, a renowned physicist from the local university.",
      startDate: "2025-10-20T15:30:00",
      endDate: "2025-10-20T17:00:00",
      location: "School Auditorium",
      status: "Upcoming",
      organizer: {
        name: "David Johnson",
        id: "teacher-003",
        role: "teacher",
      },
      participants: [
        {
          name: "Alex Wilson",
          id: "student-001",
          role: "President",
          status: "Confirmed",
        },
        {
          name: "Olivia Martinez",
          id: "student-002",
          role: "Vice President",
          status: "Confirmed",
        },
        {
          name: "Ethan Johnson",
          id: "student-003",
          role: "Secretary",
          status: "Confirmed",
        },
        {
          name: "Sophia Brown",
          id: "student-004",
          role: "Treasurer",
          status: "Confirmed",
        },
        {
          name: "Noah Davis",
          id: "student-005",
          role: "Member",
          status: "Pending",
        },
        {
          name: "Emma Wilson",
          id: "student-006",
          role: "Member",
          status: "Confirmed",
        },
        {
          name: "Liam Thompson",
          id: "student-007",
          role: "Member",
          status: "Pending",
        },
        {
          name: "Ava Garcia",
          id: "student-008",
          role: "Member",
          status: "Confirmed",
        },
        {
          name: "William Brown",
          id: "student-009",
          role: "Member",
          status: "Declined",
        },
      ],
      type: "Lecture",
    },
  ],
  schedule: [
    {
      id: "event-001",
      title: "Weekly Club Meeting",
      description: "Regular weekly meeting of the Science Club.",
      startDate: "2025-09-10T15:30:00",
      endDate: "2025-09-10T17:00:00",
      location: "Science Lab 2",
      type: "Meeting",
      status: "Scheduled",
      organizer: {
        name: "David Johnson",
        id: "teacher-003",
        role: "teacher",
      },
      isRecurring: true,
      recurrencePattern: "Every Tuesday",
    },
    {
      id: "event-002",
      title: "Science Fair Preparation",
      description: "Preparing projects for the annual science fair.",
      startDate: "2025-09-15T15:30:00",
      endDate: "2025-09-15T17:00:00",
      location: "Science Lab 2",
      type: "Workshop",
      status: "Scheduled",
      organizer: {
        name: "David Johnson",
        id: "teacher-003",
        role: "teacher",
      },
      isRecurring: false,
    },
    {
      id: "event-003",
      title: "Field Trip to Science Museum",
      description: "Visit to the city science museum to explore new exhibits.",
      startDate: "2025-10-05T09:00:00",
      endDate: "2025-10-05T15:00:00",
      location: "City Science Museum",
      type: "Field Trip",
      status: "Scheduled",
      organizer: {
        name: "David Johnson",
        id: "teacher-003",
        role: "teacher",
      },
      isRecurring: false,
    },
    {
      id: "event-004",
      title: "Guest Speaker: Dr. Emily Chen",
      description:
        "Lecture by Dr. Emily Chen, a renowned physicist from the local university.",
      startDate: "2025-10-20T15:30:00",
      endDate: "2025-10-20T17:00:00",
      location: "School Auditorium",
      type: "Lecture",
      status: "Scheduled",
      organizer: {
        name: "David Johnson",
        id: "teacher-003",
        role: "teacher",
      },
      isRecurring: false,
    },
    {
      id: "event-005",
      title: "Science Club Executive Meeting",
      description:
        "Meeting for club officers to discuss club business and planning.",
      startDate: "2025-09-12T15:30:00",
      endDate: "2025-09-12T16:30:00",
      location: "Science Lab 2",
      type: "Meeting",
      status: "Scheduled",
      organizer: {
        name: "David Johnson",
        id: "teacher-003",
        role: "teacher",
      },
      isRecurring: true,
      recurrencePattern: "Every Friday",
    },
  ],
  resources: [
    {
      id: "resource-001",
      title: "Science Club Handbook",
      description: "Official handbook for Science Club members.",
      type: "Document",
      url: "/resources/science-club-handbook.pdf",
      fileSize: 2500000,
      fileType: "application/pdf",
      uploadedBy: {
        name: "David Johnson",
        id: "teacher-003",
        role: "teacher",
      },
      uploadedAt: "2024-08-15",
      tags: ["handbook", "rules", "guidelines"],
      isShared: true,
    },
    {
      id: "resource-002",
      title: "Science Fair Project Ideas",
      description:
        "List of potential science fair project ideas with resources.",
      type: "Document",
      url: "/resources/science-fair-ideas.pdf",
      fileSize: 1800000,
      fileType: "application/pdf",
      uploadedBy: {
        name: "David Johnson",
        id: "teacher-003",
        role: "teacher",
      },
      uploadedAt: "2024-08-20",
      tags: ["science fair", "projects", "ideas"],
      isShared: true,
    },
    {
      id: "resource-003",
      title: "Lab Safety Guidelines",
      description: "Safety procedures for science laboratory activities.",
      type: "Document",
      url: "/resources/lab-safety.pdf",
      fileSize: 1500000,
      fileType: "application/pdf",
      uploadedBy: {
        name: "David Johnson",
        id: "teacher-003",
        role: "teacher",
      },
      uploadedAt: "2024-08-25",
      tags: ["safety", "lab", "guidelines"],
      isShared: true,
    },
    {
      id: "resource-004",
      title: "Science Museum Field Trip Photos",
      description: "Photos from last year's field trip to the science museum.",
      type: "Image",
      url: "/resources/museum-photos.zip",
      fileSize: 25000000,
      fileType: "application/zip",
      uploadedBy: {
        name: "Alex Wilson",
        id: "student-001",
        role: "student",
      },
      uploadedAt: "2024-09-01",
      tags: ["photos", "field trip", "museum"],
      isShared: true,
    },
    {
      id: "resource-005",
      title: "Guest Speaker Presentation",
      description:
        "Slides from Dr. Emily Chen's presentation on quantum physics.",
      type: "Presentation",
      url: "/resources/quantum-physics-presentation.pptx",
      fileSize: 8500000,
      fileType:
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      uploadedBy: {
        name: "David Johnson",
        id: "teacher-003",
        role: "teacher",
      },
      uploadedAt: "2024-09-05",
      tags: ["presentation", "quantum physics", "guest speaker"],
      isShared: false,
    },
    {
      id: "resource-006",
      title: "Science Club Budget",
      description: "Budget for the current academic year.",
      type: "Document",
      url: "/resources/science-club-budget.xlsx",
      fileSize: 500000,
      fileType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      uploadedBy: {
        name: "Sophia Brown",
        id: "student-004",
        role: "student",
      },
      uploadedAt: "2024-09-10",
      tags: ["budget", "finance", "planning"],
      isShared: false,
    },
  ],
};

export default function GroupProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const [group, setGroup] = useState(mockGroup);
  const [loading, setLoading] = useState(true);

  // In a real application, you would fetch the group data based on the slug
  useEffect(() => {
    // Simulate API call
    const fetchGroup = async () => {
      try {
        // In a real app, you would fetch data from an API
        // const response = await fetch(`/api/groups/${params.slug}`);
        // const data = await response.json();
        // setGroup(data);

        // For now, we'll just use the mock data
        setGroup(mockGroup);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching group data:", error);
        setLoading(false);
      }
    };

    fetchGroup();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // Calculate statistics
  const studentCount = group.members.filter(
    (member) => member.type === "student",
  ).length;
  const teacherCount = group.members.filter(
    (member) => member.type === "teacher",
  ).length;
  const activityCount = group.activities.length;
  const resourceCount = group.resources.length;

  const tabs: ProfileTab[] = [
    {
      id: "overview",
      label: "Overview",
      icon: <Info className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          <ProfileStats
            stats={[
              {
                label: "Members",
                value: group.memberCount,
                icon: <Users className="h-4 w-4" />,
              },
              {
                label: "Activities",
                value: activityCount,
                icon: <Activity className="h-4 w-4" />,
              },
              {
                label: "Resources",
                value: resourceCount,
                icon: <FileText className="h-4 w-4" />,
              },
              {
                label: "Events",
                value: group.schedule.length,
                icon: <Calendar className="h-4 w-4" />,
              },
            ]}
          />

          <GroupInfo
            name={group.name}
            type={group.type}
            description={group.description}
            createdAt={group.createdAt}
            memberCount={group.memberCount}
            status={group.status}
            coordinator={group.coordinator}
            contactEmail={group.contactEmail}
            contactPhone={group.contactPhone}
            meetingLocation={group.meetingLocation}
            meetingSchedule={group.meetingSchedule}
          />
        </div>
      ),
    },
    {
      id: "members",
      label: "Members",
      icon: <Users className="h-4 w-4" />,
      content: (
        <GroupMembers
          members={group.members}
          totalMembers={group.memberCount}
          studentCount={studentCount}
          teacherCount={teacherCount}
          onViewMember={(memberId, memberType) =>
            console.log("View member:", memberId, memberType)
          }
          onAddMember={() => console.log("Add member")}
        />
      ),
    },
    {
      id: "activities",
      label: "Activities",
      icon: <Activity className="h-4 w-4" />,
      content: (
        <GroupActivities
          activities={group.activities}
          activityTypes={Array.from(
            new Set(group.activities.map((activity) => activity.type)),
          )}
          onViewActivity={(activityId) =>
            console.log("View activity:", activityId)
          }
          onAddActivity={() => console.log("Add activity")}
        />
      ),
    },
    {
      id: "schedule",
      label: "Schedule",
      icon: <Calendar className="h-4 w-4" />,
      content: (
        <GroupSchedule
          events={group.schedule}
          eventTypes={Array.from(
            new Set(group.schedule.map((event) => event.type)),
          )}
          onViewEvent={(eventId) => console.log("View event:", eventId)}
          onAddEvent={() => console.log("Add event")}
          onDateSelect={(date) => console.log("Date selected:", date)}
        />
      ),
    },
    {
      id: "resources",
      label: "Resources",
      icon: <FileText className="h-4 w-4" />,
      content: (
        <GroupResources
          resources={group.resources}
          resourceTypes={Array.from(
            new Set(group.resources.map((resource) => resource.type)),
          )}
          onViewResource={(resourceId) =>
            console.log("View resource:", resourceId)
          }
          onDownloadResource={(url) => console.log("Download resource:", url)}
          onUploadResource={() => console.log("Upload resource")}
          onFilterChange={(type) => console.log("Filter by type:", type)}
        />
      ),
    },
  ];

  return (
    <EntityProfile
      name={group.name}
      status={group.status}
      id={group.groupId}
      backLink="/classroom/groups"
      backLabel="All Groups"
      tabs={tabs}
      defaultTab="overview"
      onEdit={() => console.log("Edit group")}
      onDelete={() => console.log("Delete group")}
      onShare={() => console.log("Share group profile")}
    />
  );
}
