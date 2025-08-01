"use client";

import InboxSidebar from "../common/SecondarySidebar";
import Discussion from "./Discussion";
import InboxTopbar from "./InboxTopbar";
import MessagesList from "./MessagesList";

const MessagingInterface = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden text-white">
      <InboxSidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <InboxTopbar />

        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/3 border-r border-neutral-800 overflow-y-auto">
            <MessagesList />
          </div>

          <div className="flex-1 min-w-0 overflow-hidden">
            <Discussion />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingInterface;
