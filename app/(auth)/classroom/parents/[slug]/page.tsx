"use client";

import { EntityProfile } from "@/components/profile/EntityProfile";
import { ProfileContactInfo } from "@/components/profile/ProfileContactInfo";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileTab } from "@/components/profile/ProfileTabs";
import { ChildrenList } from "@/components/profile/parent/ChildrenList";
import { ParentMeetings } from "@/components/profile/parent/ParentMeetings";
import { ParentMessages } from "@/components/profile/parent/ParentMessages";
import { ParentPayments } from "@/components/profile/parent/ParentPayments";
import {
  Calendar,
  CreditCard,
  Mail,
  MessageSquare,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

// Mock data for parent profile
const mockParent = {
  id: "parent-001",
  firstName: "Robert",
  lastName: "Wilson",
  name: "Robert Wilson",
  email: "robert.wilson@example.com",
  phone: "+1-555-456-7890",
  avatar: "/avatars/robert-wilson.jpg",
  status: "Active",
  parentId: "P2024001",
  address: "123 Main Street, Springfield, IL",
  occupation: "Software Engineer",
  relationship: "Father",
  children: [
    {
      id: "student-001",
      name: "Alex Wilson",
      avatar: "/avatars/alex-wilson.jpg",
      grade: "10",
      class: "10A",
      status: "Active",
    },
    {
      id: "student-002",
      name: "Emma Wilson",
      avatar: "/avatars/emma-wilson.jpg",
      grade: "8",
      class: "8B",
      status: "Active",
    },
  ],
  meetings: [
    {
      id: "meeting-001",
      title: "Parent-Teacher Conference",
      date: "2024-10-15",
      time: "15:30 - 16:00",
      teacher: "Michael Brown",
      teacherId: "teacher-001",
      child: "Alex Wilson",
      childId: "student-001",
      status: "Scheduled",
      notes: "Discuss academic progress and behavior",
    },
    {
      id: "meeting-002",
      title: "Academic Counseling",
      date: "2024-09-20",
      time: "14:00 - 14:30",
      teacher: "Emily Davis",
      teacherId: "teacher-002",
      child: "Emma Wilson",
      childId: "student-002",
      status: "Completed",
      notes: "Discussed college preparation and course selection",
    },
    {
      id: "meeting-003",
      title: "Behavior Discussion",
      date: "2024-08-05",
      time: "16:00 - 16:30",
      teacher: "Michael Brown",
      teacherId: "teacher-001",
      child: "Alex Wilson",
      childId: "student-001",
      status: "Cancelled",
      notes: "Cancelled due to teacher illness",
    },
  ],
  payments: [
    {
      id: "payment-001",
      invoiceNumber: "INV-2024-001",
      amount: 1200,
      date: "2024-08-10",
      dueDate: "2024-08-15",
      status: "Paid",
      type: "Tuition Fee",
      description: "Fall Semester Tuition",
      childName: "Alex Wilson",
      childId: "student-001",
      receiptUrl: "/receipts/receipt-001.pdf",
    },
    {
      id: "payment-002",
      invoiceNumber: "INV-2024-002",
      amount: 1000,
      date: "2024-08-10",
      dueDate: "2024-08-15",
      status: "Paid",
      type: "Tuition Fee",
      description: "Fall Semester Tuition",
      childName: "Emma Wilson",
      childId: "student-002",
      receiptUrl: "/receipts/receipt-002.pdf",
    },
    {
      id: "payment-003",
      invoiceNumber: "INV-2024-003",
      amount: 250,
      date: "2024-09-01",
      dueDate: "2024-09-10",
      status: "Pending",
      type: "Lab Fee",
      description: "Science Lab Fee",
      childName: "Alex Wilson",
      childId: "student-001",
    },
    {
      id: "payment-004",
      invoiceNumber: "INV-2024-004",
      amount: 75,
      date: "2024-08-20",
      dueDate: "2024-08-25",
      status: "Overdue",
      type: "Field Trip",
      description: "Museum Field Trip",
      childName: "Emma Wilson",
      childId: "student-002",
    },
  ],
  messages: [
    {
      id: "message-001",
      subject: "Upcoming Field Trip",
      sender: {
        name: "Emily Davis",
        role: "teacher",
        id: "teacher-002",
      },
      recipients: [
        {
          name: "Robert Wilson",
          role: "parent",
          id: "parent-001",
        },
      ],
      content:
        "Dear Mr. Wilson, I wanted to inform you about the upcoming field trip to the science museum next month. Please ensure that Emma returns the permission slip by next week.",
      sentAt: "2024-09-10T10:15:00",
      isRead: true,
      isStarred: false,
      hasAttachments: true,
    },
    {
      id: "message-002",
      subject: "Re: Upcoming Field Trip",
      sender: {
        name: "Robert Wilson",
        role: "parent",
        id: "parent-001",
      },
      recipients: [
        {
          name: "Emily Davis",
          role: "teacher",
          id: "teacher-002",
        },
      ],
      content:
        "Thank you for the information. Emma will be attending the field trip, and I'll make sure to return the permission slip this week.",
      sentAt: "2024-09-10T15:45:00",
      isRead: true,
      isStarred: false,
      hasAttachments: false,
    },
    {
      id: "message-003",
      subject: "Academic Performance",
      sender: {
        name: "Michael Brown",
        role: "teacher",
        id: "teacher-001",
      },
      recipients: [
        {
          name: "Robert Wilson",
          role: "parent",
          id: "parent-001",
        },
      ],
      content:
        "Dear Mr. Wilson, I wanted to discuss Alex's recent performance in mathematics class. While he's doing well overall, I've noticed he's struggling with some advanced concepts. Could we schedule a meeting to discuss this?",
      sentAt: "2024-09-12T09:30:00",
      isRead: false,
      isStarred: true,
      hasAttachments: false,
    },
  ],
};

export default function ParentProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const [parent, setParent] = useState(mockParent);
  const [loading, setLoading] = useState(true);

  // In a real application, you would fetch the parent data based on the slug
  useEffect(() => {
    // Simulate API call
    const fetchParent = async () => {
      try {
        // In a real app, you would fetch data from an API
        // const response = await fetch(`/api/parents/${params.slug}`);
        // const data = await response.json();
        // setParent(data);

        // For now, we'll just use the mock data
        setParent(mockParent);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching parent data:", error);
        setLoading(false);
      }
    };

    fetchParent();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // Calculate statistics
  const upcomingMeetings = parent.meetings.filter(
    (meeting) =>
      new Date(meeting.date) >= new Date() && meeting.status !== "Cancelled",
  );

  const pastMeetings = parent.meetings.filter(
    (meeting) =>
      new Date(meeting.date) < new Date() || meeting.status === "Cancelled",
  );

  const totalPaid = parent.payments
    .filter((payment) => payment.status.toLowerCase() === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const totalDue = parent.payments
    .filter((payment) => payment.status.toLowerCase() !== "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const unreadMessages = parent.messages.filter(
    (message) =>
      !message.isRead && message.recipients.some((r) => r.role === "parent"),
  );

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
                label: "Children",
                value: parent.children.length,
                icon: <Users className="h-4 w-4" />,
              },
              {
                label: "Meetings",
                value: upcomingMeetings.length,
                icon: <Calendar className="h-4 w-4" />,
              },
              {
                label: "Payments Due",
                value: `$${totalDue.toFixed(2)}`,
                icon: <CreditCard className="h-4 w-4" />,
              },
              {
                label: "Unread Messages",
                value: unreadMessages.length,
                icon: <Mail className="h-4 w-4" />,
              },
            ]}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileInfoCard title="Personal Information">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Relationship</p>
                  <p>{parent.relationship}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Occupation</p>
                  <p>{parent.occupation}</p>
                </div>
              </div>
            </ProfileInfoCard>

            <ProfileInfoCard title="Contact Information">
              <ProfileContactInfo
                email={parent.email}
                phone={parent.phone}
                address={parent.address}
              />
            </ProfileInfoCard>
          </div>

          <ProfileInfoCard title="Children">
            <ChildrenList
              children={parent.children}
              onViewChild={(childId) => console.log("View child:", childId)}
            />
          </ProfileInfoCard>
        </div>
      ),
    },
    {
      id: "children",
      label: "Children",
      icon: <Users className="h-4 w-4" />,
      content: (
        <ChildrenList
          children={parent.children}
          onViewChild={(childId) => console.log("View child:", childId)}
        />
      ),
    },
    {
      id: "meetings",
      label: "Meetings",
      icon: <Calendar className="h-4 w-4" />,
      content: (
        <ParentMeetings
          meetings={parent.meetings}
          upcomingCount={upcomingMeetings.length}
          pastCount={pastMeetings.length}
          onViewMeeting={(meetingId) => console.log("View meeting:", meetingId)}
          onScheduleMeeting={() => console.log("Schedule meeting")}
        />
      ),
    },
    {
      id: "payments",
      label: "Payments",
      icon: <CreditCard className="h-4 w-4" />,
      content: (
        <ParentPayments
          payments={parent.payments}
          totalPaid={totalPaid}
          totalDue={totalDue}
          onViewPayment={(paymentId) => console.log("View payment:", paymentId)}
          onDownloadReceipt={(url) => console.log("Download receipt:", url)}
          onMakePayment={(paymentId) => console.log("Make payment:", paymentId)}
        />
      ),
    },
    {
      id: "messages",
      label: "Messages",
      icon: <MessageSquare className="h-4 w-4" />,
      content: (
        <ParentMessages
          messages={parent.messages}
          onViewMessage={(messageId) => console.log("View message:", messageId)}
          onComposeMessage={() => console.log("Compose message")}
          onDeleteMessage={(messageId) =>
            console.log("Delete message:", messageId)
          }
          onStarMessage={(messageId, isStarred) =>
            console.log("Star message:", messageId, isStarred)
          }
        />
      ),
    },
  ];

  return (
    <EntityProfile
      name={`${parent.firstName} ${parent.lastName}`}
      avatar={parent.avatar}
      status={parent.status}
      id={parent.parentId}
      backLink="/classroom/parents"
      backLabel="All Parents"
      tabs={tabs}
      defaultTab="overview"
      onEdit={() => console.log("Edit parent")}
      onDelete={() => console.log("Delete parent")}
      onShare={() => console.log("Share parent profile")}
    />
  );
}
