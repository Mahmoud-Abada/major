import { Search } from "lucide-react";

const InboxTopbar = () => {
  return (
    <div className="h-16 border-b border-neutral-800 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        <button className="px-4 py-2 bg-neutral-800 rounded-lg text-sm">
          Unread
        </button>
        <button className="px-4 py-2 hover:bg-neutral-900 text-neutral-400 hover:text-white rounded-lg text-sm">
          Starred
        </button>
        <button className="px-4 py-2 hover:bg-neutral-900 text-neutral-400 hover:text-white rounded-lg text-sm">
          Files
        </button>
      </div>

      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2 bg-neutral-800 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
    </div>
  );
};

export default InboxTopbar;
