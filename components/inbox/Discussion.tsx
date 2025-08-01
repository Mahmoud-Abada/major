import { motion } from "framer-motion";
import {
  Download,
  Edit2,
  FileText,
  Image,
  Mic,
  MicOff,
  MoreHorizontal,
  Paperclip,
  Send,
  Smile,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

const Discussion = () => {
  const [messages, setMessages] = useState([
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
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Teacher":
        return "bg-purple-500";
      case "Manager":
        return "bg-orange-500";
      case "Student":
        return "bg-blue-500";
      default:
        return "bg-neutral-500";
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      sender: "You",
      role: "Student",
      avatar: "👤",
      content: newMessage,
      timestamp: new Date().toISOString(),
      reactions: {},
      replies: [],
      attachments: [],
      isPinned: false,
      isEdited: false,
      readBy: [],
      mentions: [],
      priority: "normal",
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleDeleteMessage = (messageId: number) => {
    setMessages(messages.filter((msg) => msg.id !== messageId));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    console.log("Files selected:", files);
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-16 border-b border-neutral-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Data Structures Discussion</h1>
          <span className="px-2 py-1 bg-green-500 text-xs rounded-full">
            online
          </span>
        </div>
        <MoreHorizontal
          size={20}
          className="text-neutral-400 hover:text-white cursor-pointer"
        />
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1  overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-10 h-10 bg-neutral-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg">{message.avatar}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{message.sender}</span>
                <span
                  className={`px-2 py-1 text-xs rounded ${getRoleColor(message.role)}`}
                >
                  {message.role}
                </span>
                <span className="text-sm text-neutral-400">
                  {formatTime(message.timestamp)}
                </span>
              </div>

              <div className="text-neutral-200 mb-2">{message.content}</div>

              {message.attachments.length > 0 && (
                <div className="mb-2 space-y-2">
                  {message.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-neutral-700 p-2 rounded-lg"
                    >
                      <FileText size={16} className="text-blue-400" />
                      <span className="text-sm truncate">
                        {attachment.name}
                      </span>
                      <span className="text-xs text-neutral-400 ml-auto">
                        {attachment.size}
                      </span>
                      <button className="p-1 hover:bg-neutral-600 rounded">
                        <Download size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 text-neutral-400 text-xs">
                <button className="flex items-center gap-1 hover:text-white">
                  <Edit2 size={14} />
                  <span>Edit</span>
                </button>
                <button
                  className="flex items-center gap-1 hover:text-red-400"
                  onClick={() => handleDeleteMessage(message.id)}
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-neutral-800">
        <div className="relative">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
            className="w-full p-3 bg-neutral-800 rounded-lg border border-neutral-700 outline-none resize-none text-white placeholder-neutral-400 min-h-[60px] max-h-[120px]"
            rows={1}
          />

          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-neutral-400 hover:text-white"
            >
              <Paperclip size={18} />
            </button>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`${isRecording ? "text-red-500" : "text-neutral-400 hover:text-white"}`}
            >
              <Mic size={18} />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-neutral-700 disabled:cursor-not-allowed p-2 rounded-lg"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {isRecording && (
          <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>Recording {formatRecordingTime(recordingTime)}</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
      />
    </div>
  );
};

export default Discussion;
