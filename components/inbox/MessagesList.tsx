import { motion } from "framer-motion";
import { MoreHorizontal, Paperclip } from "lucide-react";

const MessagesList = () => {
  const messageData: any[] = [];

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
