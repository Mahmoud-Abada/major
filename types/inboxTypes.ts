// types/inboxTypes.ts

export type MessageType = {
  _id: string;
  owner: string;
  attachment?: Array<string>;
  content: string;
  isDeleted?: boolean;
  relationship: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AttachmentType = {
  _id: string;
  url: string;
  title: string;
  type: "document" | "video" | "audio" | "image" | "link" | "location" | "gif";
  isDeleted?: boolean;
};

export type ContactType = {
  _id: string;
  participants: string[];
  lastMessage?: MessageType;
  unreadCount?: number;
  updatedAt: string;
};

export type LastSeen = {
  user: string;
  time: number;
  relationship: string;
};

export type PaginationOpts = {
  numItems: number;
  cursor: string | null;
};

export type PaginatedResponse<T> = {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type InboxState = {
  messages: Record<string, MessageType[]>; // Key is relationship ID
  contacts: ContactType[];
  attachments: Record<string, AttachmentType>;
  loading: boolean;
  error: string | null;
  pagination: {
    contacts: {
      cursor: string | null;
      hasMore: boolean;
    };
    messages: {
      cursor: string | null;
      hasMore: boolean;
    };
  };
  lastSeen: Record<string, LastSeen>; // Key is relationship ID
};
