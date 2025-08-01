import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  MessageSquare,
  PenSquare,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { ProfileTable, TableColumn } from "../ProfileTable";
import { StatusBadge } from "../StatusBadge";

interface Message {
  id: string;
  subject: string;
  sender: {
    name: string;
    role: string;
    id: string;
  };
  recipients: {
    name: string;
    role: string;
    id: string;
  }[];
  content: string;
  sentAt: string;
  isRead: boolean;
  isStarred: boolean;
  hasAttachments: boolean;
}

interface ParentMessagesProps {
  messages: Message[];
  onViewMessage?: (messageId: string) => void;
  onComposeMessage?: () => void;
  onDeleteMessage?: (messageId: string) => void;
  onStarMessage?: (messageId: string, isStarred: boolean) => void;
}

export function ParentMessages({
  messages,
  onViewMessage,
  onComposeMessage,
  onDeleteMessage,
  onStarMessage,
}: ParentMessagesProps) {
  // Group messages by inbox/sent/starred
  const inboxMessages = messages.filter((msg) =>
    msg.recipients.some((r) => r.role === "parent"),
  );

  const sentMessages = messages.filter((msg) => msg.sender.role === "parent");

  const starredMessages = messages.filter((msg) => msg.isStarred);

  const columns: TableColumn[] = [
    {
      header: "Subject",
      accessorKey: "subject",
      cell: (value, row) => (
        <div className="flex items-center space-x-2">
          {!row.isRead && <div className="w-2 h-2 rounded-full bg-primary" />}
          <span className={row.isRead ? "font-normal" : "font-semibold"}>
            {value}
          </span>
          {row.hasAttachments && (
            <span className="text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-paperclip"
              >
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </span>
          )}
        </div>
      ),
    },
    {
      header: "From/To",
      accessorKey: "sender",
      cell: (value, row) => {
        // For inbox messages, show sender
        if (row.recipients.some((r) => r.role === "parent")) {
          return (
            <a
              href={`/classroom/${value.role}s/${value.id}`}
              className="hover:underline"
            >
              {value.name}
            </a>
          );
        }
        // For sent messages, show first recipient
        return (
          <a
            href={`/classroom/${row.recipients[0].role}s/${row.recipients[0].id}`}
            className="hover:underline"
          >
            {row.recipients[0].name}
          </a>
        );
      },
    },
    {
      header: "Date",
      accessorKey: "sentAt",
      cell: (value) => {
        const date = new Date(value);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();

        if (isToday) {
          return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        }

        return date.toLocaleDateString();
      },
    },
    {
      header: "Status",
      accessorKey: "isRead",
      cell: (value) => <StatusBadge status={value ? "Read" : "Unread"} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-semibold">Messages</h3>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              className="pl-8 w-full sm:w-[200px]"
            />
          </div>
          {onComposeMessage && (
            <Button onClick={onComposeMessage}>
              <PenSquare className="h-4 w-4 mr-2" />
              Compose
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm font-medium text-muted-foreground">
                Inbox
              </div>
            </div>
            <div className="text-2xl font-bold mt-1">
              {inboxMessages.length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {inboxMessages.filter((m) => !m.isRead).length} unread
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm font-medium text-muted-foreground">
                Sent
              </div>
            </div>
            <div className="text-2xl font-bold mt-1">{sentMessages.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm font-medium text-muted-foreground">
                Starred
              </div>
            </div>
            <div className="text-2xl font-bold mt-1">
              {starredMessages.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inbox">
        <TabsList className="w-full">
          <TabsTrigger value="inbox" className="flex-1">
            Inbox
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex-1">
            Sent
          </TabsTrigger>
          <TabsTrigger value="starred" className="flex-1">
            Starred
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox">
          <ProfileTable
            columns={columns}
            data={inboxMessages}
            onRowClick={
              onViewMessage ? (row) => onViewMessage(row.id) : undefined
            }
            actions={(row) => (
              <div className="flex space-x-2">
                {onStarMessage && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStarMessage(row.id, !row.isStarred);
                    }}
                  >
                    <Star
                      className={`h-4 w-4 ${row.isStarred ? "fill-yellow-400 text-yellow-400" : ""}`}
                    />
                  </Button>
                )}
                {onDeleteMessage && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteMessage(row.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            )}
            emptyState={
              <div className="text-center py-8">
                <Mail className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  No messages in your inbox
                </p>
              </div>
            }
          />
        </TabsContent>

        <TabsContent value="sent">
          <ProfileTable
            columns={columns}
            data={sentMessages}
            onRowClick={
              onViewMessage ? (row) => onViewMessage(row.id) : undefined
            }
            actions={(row) => (
              <div className="flex space-x-2">
                {onStarMessage && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStarMessage(row.id, !row.isStarred);
                    }}
                  >
                    <Star
                      className={`h-4 w-4 ${row.isStarred ? "fill-yellow-400 text-yellow-400" : ""}`}
                    />
                  </Button>
                )}
                {onDeleteMessage && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteMessage(row.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            )}
            emptyState={
              <div className="text-center py-8">
                <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No sent messages</p>
              </div>
            }
          />
        </TabsContent>

        <TabsContent value="starred">
          <ProfileTable
            columns={columns}
            data={starredMessages}
            onRowClick={
              onViewMessage ? (row) => onViewMessage(row.id) : undefined
            }
            actions={(row) => (
              <div className="flex space-x-2">
                {onStarMessage && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStarMessage(row.id, !row.isStarred);
                    }}
                  >
                    <Star
                      className={`h-4 w-4 ${row.isStarred ? "fill-yellow-400 text-yellow-400" : ""}`}
                    />
                  </Button>
                )}
                {onDeleteMessage && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteMessage(row.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            )}
            emptyState={
              <div className="text-center py-8">
                <Star className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  No starred messages
                </p>
              </div>
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
