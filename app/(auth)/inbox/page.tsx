"use client";
import MessagingInterface from "@/components/inbox/MessagingInterface";

export default function InboxPage() {
  return (
    <div className="flex min-h-screen flex-row items-start justify-start ">
      <MessagingInterface />
    </div>
  );
}
