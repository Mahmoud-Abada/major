import { motion } from "framer-motion";
import {
  Download,
  Edit2,
  FileText,
  Mic,
  MoreHorizontal,
  Paperclip,
  Send,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

const Discussion = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "أ. محمد بن عبد الرحمن الجزائري",
      role: "Teacher",
      avatar: "👨‍🏫",
      content:
        "أهلاً وسهلاً بكم في مناقشة درس الرياضيات! اليوم سنتناول موضوع الجبر المتقدم والمعادلات التربيعية. أرجو منكم طرح أسئلتكم بحرية أثناء الشرح.",
      timestamp: "2024-12-15T14:00:00Z",
      reactions: { thumbsUp: 18, heart: 5, star: 8 },
      replies: [],
      attachments: [
        { name: "الجبر-المتقدم-شرائح.pdf", size: "3.2 MB", type: "pdf" },
        { name: "تمارين-محلولة.pdf", size: "1.8 MB", type: "pdf" },
      ],
      isPinned: true,
      isEdited: false,
      readBy: ["student1", "student2", "student3", "student4", "student5"],
      mentions: [],
      priority: "high",
    },
    {
      id: 2,
      sender: "أحمد بن علي الوهراني",
      role: "Student",
      avatar: "👨‍🎓",
      content:
        "شكراً أستاذ على الشرح الواضح! لدي سؤال حول حل المعادلات التربيعية بالطريقة التحليلية. هل يمكن توضيح الفرق بين استخدام القانون العام والتحليل إلى عوامل؟",
      timestamp: "2024-12-15T14:05:00Z",
      reactions: { thumbsUp: 12, heart: 3 },
      replies: [
        {
          id: 21,
          sender: "أ. محمد بن عبد الرحمن الجزائري",
          role: "Teacher",
          avatar: "👨‍🏫",
          content:
            "سؤال ممتاز يا أحمد! التحليل إلى عوامل أسرع عندما تكون المعادلة قابلة للتحليل بسهولة، أما القانون العام فيستخدم في جميع الحالات حتى لو كانت الجذور غير نسبية. سأرسل لكم أمثلة إضافية.",
          timestamp: "2024-12-15T14:07:00Z",
          reactions: { thumbsUp: 20, star: 6 },
          mentions: ["أحمد بن علي الوهراني"],
        },
      ],
      attachments: [],
      isPinned: false,
      isEdited: false,
      readBy: ["teacher1", "student2", "student3"],
      mentions: [],
      priority: "normal",
    },
    {
      id: 3,
      sender: "فاطمة الزهراء بن صالح",
      role: "Student",
      avatar: "👩‍🎓",
      content:
        "أستاذ، أواجه صعوبة في فهم الأعداد المركبة. هل يمكن أن تشرح لنا كيفية تمثيلها هندسياً؟ @أ. محمد بن عبد الرحمن الجزائري",
      timestamp: "2024-12-15T14:12:00Z",
      reactions: { thumbsUp: 8, heart: 2 },
      replies: [
        {
          id: 31,
          sender: "أ. محمد بن عبد الرحمن الجزائري",
          role: "Teacher",
          avatar: "👨‍🏫",
          content:
            "بالطبع يا فاطمة! الأعداد المركبة تُمثل في المستوى المركب حيث المحور الأفقي للجزء الحقيقي والمحور العمودي للجزء التخيلي. سأحضر رسوماً توضيحية في الحصة القادمة.",
          timestamp: "2024-12-15T14:15:00Z",
          reactions: { thumbsUp: 16, star: 4 },
          mentions: ["فاطمة الزهراء بن صالح"],
        },
      ],
      attachments: [],
      isPinned: false,
      isEdited: false,
      readBy: ["teacher1", "student1"],
      mentions: ["أ. محمد بن عبد الرحمن الجزائري"],
      priority: "normal",
    },
    {
      id: 4,
      sender: "د. عبد الكريم مدير المعهد",
      role: "Manager",
      avatar: "👨‍💼",
      content:
        "تم رفع المواد التكميلية لامتحان البكالوريا التجريبي. يرجى مراجعتها قبل الامتحان المقرر يوم الخميس القادم. بالتوفيق للجميع!",
      timestamp: "2024-12-15T14:20:00Z",
      reactions: { thumbsUp: 25, star: 12, heart: 8 },
      replies: [],
      attachments: [
        { name: "امتحان-تجريبي-رياضيات.pdf", size: "4.1 MB", type: "pdf" },
        { name: "دليل-المراجعة.pdf", size: "2.3 MB", type: "pdf" },
        { name: "نماذج-محلولة.zip", size: "6.8 MB", type: "zip" },
      ],
      isPinned: false,
      isEdited: false,
      readBy: [
        "student1",
        "student2",
        "student3",
        "student4",
        "student5",
        "teacher1",
      ],
      mentions: [],
      priority: "high",
    },
    {
      id: 5,
      sender: "يوسف بن محمد القسنطيني",
      role: "Student",
      avatar: "👨‍🎓",
      content:
        "أستاذ، هل يمكن تنظيم حصة مراجعة إضافية قبل الامتحان؟ أعتقد أن الكثير منا يحتاج لمزيد من التوضيح في موضوع الهندسة التحليلية.",
      timestamp: "2024-12-15T14:25:00Z",
      reactions: { thumbsUp: 15, heart: 4 },
      replies: [
        {
          id: 51,
          sender: "أ. محمد بن عبد الرحمن الجزائري",
          role: "Teacher",
          avatar: "👨‍🏫",
          content:
            "فكرة ممتازة يا يوسف! سأنظم حصة مراجعة يوم الثلاثاء من الساعة 4 إلى 6 مساءً. سنركز على الهندسة التحليلية والمعادلات البارامترية.",
          timestamp: "2024-12-15T14:27:00Z",
          reactions: { thumbsUp: 22, star: 7 },
          mentions: ["يوسف بن محمد القسنطيني"],
        },
        {
          id: 52,
          sender: "أمينة بنت عبد الله",
          role: "Student",
          avatar: "👩‍🎓",
          content:
            "شكراً أستاذ! هذا سيساعدنا كثيراً. هل يمكن أيضاً مراجعة موضوع المتتاليات؟",
          timestamp: "2024-12-15T14:30:00Z",
          reactions: { thumbsUp: 10, heart: 2 },
          mentions: [],
        },
      ],
      attachments: [],
      isPinned: false,
      isEdited: false,
      readBy: ["teacher1", "student2", "student3"],
      mentions: [],
      priority: "normal",
    },
    {
      id: 6,
      sender: "خالد بن عيسى الباتني",
      role: "Student",
      avatar: "👨‍🎓",
      content:
        "أستاذ، أرفقت حلول التمارين المطلوبة. أرجو مراجعتها وإعطائي ملاحظاتك.",
      timestamp: "2024-12-15T14:35:00Z",
      reactions: { thumbsUp: 6, star: 2 },
      replies: [],
      attachments: [
        { name: "حلول-التمارين-خالد.pdf", size: "1.5 MB", type: "pdf" },
      ],
      isPinned: false,
      isEdited: false,
      readBy: ["teacher1"],
      mentions: [],
      priority: "normal",
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
      reactions: { thumbsUp: 0, heart: 0, star: 0 },
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
          <h1 className="text-lg font-semibold">
            مناقشة درس الرياضيات - الجبر المتقدم
          </h1>
          <span className="px-2 py-1 bg-green-500 text-xs rounded-full">
            متصل
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
