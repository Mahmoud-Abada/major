import { motion } from "framer-motion";
import { MoreHorizontal, Paperclip } from "lucide-react";

const MessagesList = () => {
  const messageData = [
    {
      id: 1,
      sender: "Prof. Sarah Lee",
      role: "Teacher",
      time: "2 hours ago",
      subject: "Assignment #2 - Data Structures",
      preview:
        "Please review the updated requirements for Assignment #2. The deadline has been extended to next Friday...",
      attachments: 1,
      tag: "Gestion 1",
      avatar: "👩‍🏫",
    },
    {
      id: 2,
      sender: "Dr. Robert Johnson",
      role: "School",
      time: "Yesterday",
      subject: "Course Schedule Update",
      preview:
        "The schedule for next week's lectures has been updated. Please check the new timing for Tuesday's session...",
      attachments: 3,
      isBroadcast: true,
      avatar: "👨‍💼",
    },
    {
      id: 3,
      sender: "Emma Davis",
      role: "Student",
      time: "2 days ago",
      subject: "Project Collaboration Request",
      preview:
        "Would you like to collaborate on the final project? I think our skills complement each other well...",
      replies: 2,
      tag: "Langues 2",
      avatar: "👩‍🎓",
    },
    {
      id: 4,
      sender: "Mike Chen",
      role: "Teacher",
      time: "4 hours ago",
      subject: "Quiz Questions - Chapter 5",
      preview:
        "Hi, I have some questions about the quiz format for Chapter 5. Could you clarify the number of questions...",
      isBroadcast: true,
      avatar: "👨‍🏫",
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Teacher":
        return "bg-purple-500";
      case "School":
        return "bg-orange-500";
      case "Student":
        return "bg-blue-500";
      default:
        return "bg-neutral-500";
    }
  };

  return (
    <div className="w-full overflow-y-auto">
      {messageData.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hover:bg-neutral-900 cursor-pointer p-3 rounded-md my-1 mx-1 flex items-start gap-3"
        >
          <div className="w-10 h-10 bg-neutral-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-lg">{message.avatar}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1 gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-medium text-white truncate">
                  {message.sender}
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded ${getRoleColor(message.role)} text-white`}
                >
                  {message.role}
                </span>
                <span className="text-sm text-neutral-400 whitespace-nowrap">
                  {message.time}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {message.attachments && (
                  <div className="flex items-center gap-1 text-neutral-400">
                    <Paperclip size={14} />
                    <span className="text-xs">{message.attachments}</span>
                  </div>
                )}
                <MoreHorizontal
                  size={16}
                  className="text-neutral-400 hover:text-white cursor-pointer"
                />
              </div>
            </div>

            <p className="text-neutral-400 text-sm line-clamp-2">
              {message.preview}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MessagesList;
