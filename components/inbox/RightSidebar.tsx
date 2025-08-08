import {
  Archive,
  Download,
  FileText,
  Flag,
  MoreHorizontal,
  Shield,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const RightSidebar = () => {
  const [messages] = useState([
    {
      id: 1,
      sender: "Prof. Sarah Lee",
      role: "Teacher",
      avatar: "👩‍🏫",
      content:
        "Welcome to the Data Structures discussion! Today we'll be covering binary trees and their applications. Please feel free to ask questions as we go along.",
      timestamp: "2024-01-15T10:00:00Z",
      reactions: { thumbsUp: 12, heart: 3, star: 5 },
      replies: [],
      attachments: [
        { name: "binary-trees-slides.pdf", size: "2.4 MB", type: "pdf" },
      ],
      isPinned: true,
      isEdited: false,
      readBy: ["student1", "student2", "student3"],
      mentions: [],
      priority: "high",
    },
    {
      id: 2,
      sender: "Emma Davis",
      role: "Student",
      avatar: "👩‍🎓",
      content:
        "Thank you for the introduction! I have a question about the time complexity of tree traversal algorithms. Could you explain the difference between DFS and BFS in terms of space complexity?",
      timestamp: "2024-01-15T10:05:00Z",
      reactions: { thumbsUp: 8, heart: 2 },
      replies: [
        {
          id: 21,
          sender: "Prof. Sarah Lee",
          role: "Teacher",
          avatar: "👩‍🏫",
          content:
            "Great question, Emma! DFS typically uses O(h) space where h is the height of the tree due to the recursion stack, while BFS uses O(w) space where w is the maximum width of the tree for the queue.",
          timestamp: "2024-01-15T10:07:00Z",
          reactions: { thumbsUp: 15, star: 4 },
          mentions: ["Emma Davis"],
        },
      ],
      attachments: [],
      isPinned: false,
      isEdited: false,
      readBy: ["prof1", "student2"],
      mentions: [],
      priority: "normal",
    },
    {
      id: 3,
      sender: "Mike Chen",
      role: "Student",
      avatar: "👨‍🎓",
      content:
        "I'm still confused about the implementation. Could someone share a code example? @Prof. Sarah Lee",
      timestamp: "2024-01-15T10:10:00Z",
      reactions: { thumbsUp: 5 },
      replies: [],
      attachments: [],
      isPinned: false,
      isEdited: true,
      readBy: ["prof1"],
      mentions: ["Prof. Sarah Lee"],
      priority: "normal",
    },
    {
      id: 4,
      sender: "Dr. Robert Johnson",
      role: "Manager",
      avatar: "👨‍💼",
      content:
        "I've uploaded the supplementary materials for this week's assignment. Please review them before our next session.",
      timestamp: "2024-01-15T10:15:00Z",
      reactions: { thumbsUp: 20, star: 8 },
      replies: [],
      attachments: [
        { name: "assignment-materials.zip", size: "5.2 MB", type: "zip" },
        { name: "reference-guide.pdf", size: "1.8 MB", type: "pdf" },
      ],
      isPinned: false,
      isEdited: false,
      readBy: ["student1", "student2", "student3", "student4"],
      mentions: [],
      priority: "high",
    },
  ]);

  const [isRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const [onlineUsers] = useState([
    { name: "Prof. Sarah Lee", avatar: "👩‍🏫", status: "online" },
    { name: "Emma Davis", avatar: "👩‍🎓", status: "online" },
    { name: "Mike Chen", avatar: "👨‍🎓", status: "away" },
    { name: "Dr. Robert Johnson", avatar: "👨‍💼", status: "busy" },
  ]);
  const [notificationSettings, setNotificationSettings] = useState({
    sound: true,
    desktop: true,
    mentions: true,
  });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    (messagesEndRef.current as HTMLDivElement)?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "busy":
        return "bg-red-500";
      default:
        return "bg-neutral-500";
    }
  };

  return (
    <div className="w-80 bg-neutral-800 border-l border-neutral-700 flex flex-col">
      <div className="p-4 border-b border-neutral-700">
        <h2 className="font-semibold mb-4">
          Participants ({onlineUsers.length})
        </h2>
        <div className="space-y-2">
          {onlineUsers.map((user) => (
            <div
              key={user.name}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-700"
            >
              <div className="relative">
                <div className="w-8 h-8 bg-neutral-600 rounded-full flex items-center justify-center">
                  <span className="text-sm">{user.avatar}</span>
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-neutral-800 ${getStatusColor(user.status)}`}
                ></div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-neutral-400 capitalize">
                  {user.status}
                </div>
              </div>
              <button className="p-1 hover:bg-neutral-600 rounded">
                <MoreHorizontal size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Discussion Settings */}
      <div className="p-4 border-b border-neutral-700">
        <h3 className="font-semibold mb-3">Discussion Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Notifications</span>
            <button
              onClick={() =>
                setNotificationSettings((prev) => ({
                  ...prev,
                  desktop: !prev.desktop,
                }))
              }
              className={`w-10 h-6 rounded-full ${notificationSettings.desktop ? "bg-purple-500" : "bg-neutral-600"} relative`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${notificationSettings.desktop ? "translate-x-5" : "translate-x-1"}`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Sound</span>
            <button
              onClick={() =>
                setNotificationSettings((prev) => ({
                  ...prev,
                  sound: !prev.sound,
                }))
              }
              className={`w-10 h-6 rounded-full ${notificationSettings.sound ? "bg-purple-500" : "bg-neutral-600"} relative`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${notificationSettings.sound ? "translate-x-5" : "translate-x-1"}`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Mentions Only</span>
            <button
              onClick={() =>
                setNotificationSettings((prev) => ({
                  ...prev,
                  mentions: !prev.mentions,
                }))
              }
              className={`w-10 h-6 rounded-full ${notificationSettings.mentions ? "bg-purple-500" : "bg-neutral-600"} relative`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${notificationSettings.mentions ? "translate-x-5" : "translate-x-1"}`}
              ></div>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-neutral-700">
        <h3 className="font-semibold mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-700 text-left">
            <Archive size={16} />
            <span className="text-sm">Archive Discussion</span>
          </button>

          <button className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-700 text-left">
            <Download size={16} />
            <span className="text-sm">Export Messages</span>
          </button>

          <button className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-700 text-left">
            <Shield size={16} />
            <span className="text-sm">Moderation</span>
          </button>

          <button className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-700 text-left">
            <Flag size={16} />
            <span className="text-sm">Report Issue</span>
          </button>
        </div>
      </div>

      {/* File Gallery */}
      <div className="flex-1 p-4 overflow-y-auto">
        <h3 className="font-semibold mb-3">Shared Files</h3>
        <div className="space-y-2">
          {messages
            .filter((msg) => msg.attachments.length > 0)
            .map((msg) => (
              <div key={msg.id} className="space-y-1">
                {msg.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-2 bg-neutral-700 rounded-lg"
                  >
                    <FileText size={14} className="text-blue-400" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">
                        {file.name}
                      </div>
                      <div className="text-xs text-neutral-400">
                        {file.size} • {msg.sender}
                      </div>
                    </div>
                    <button className="p-1 hover:bg-neutral-600 rounded">
                      <Download size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
