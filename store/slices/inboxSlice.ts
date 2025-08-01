import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import {
  MessageType,
  ContactType,
  AttachmentType,
  LastSeen,
  PaginationOpts,
  PaginatedResponse,
  InboxState,
} from "@/types/inboxTypes";

const initialState: InboxState = {
  messages: {},
  contacts: [],
  attachments: {},
  loading: false,
  error: null,
  pagination: {
    contacts: {
      cursor: null,
      hasMore: true,
    },
    messages: {
      cursor: null,
      hasMore: true,
    },
  },
  lastSeen: {},
};

// Async Thunks for API calls
export const sendMessage = createAsyncThunk(
  "inbox/sendMessage",
  async (
    messageData: {
      owner: string;
      attachment?: Array<string>;
      content: string;
      relationship: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch("http://localhost:5000/inbox/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ messageData }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send message");
      }

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const editMessage = createAsyncThunk(
  "inbox/editMessage",
  async (
    { messageId, content }: { messageId: string; content: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch("http://localhost:5000/inbox/edit-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ messageId, messageData: { content } }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to edit message");
      }

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteMessage = createAsyncThunk(
  "inbox/deleteMessage",
  async (messageId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://localhost:5000/inbox/delete-message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ messageId }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete message");
      }

      return { messageId };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const getMessages = createAsyncThunk(
  "inbox/getMessages",
  async (
    {
      contactId,
      paginationOpts,
    }: { contactId: string; paginationOpts?: PaginationOpts },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch("http://localhost:5000/inbox/get-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          contactId,
          paginationOpts: paginationOpts || { numItems: 20, cursor: null },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch messages");
      }

      return { contactId, data: await response.json() };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const getContacts = createAsyncThunk(
  "inbox/getContacts",
  async (paginationOpts: PaginationOpts, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/inbox/get-contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ paginationOpts }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch contacts");
      }

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const inboxSlice = createSlice({
  name: "inbox",
  initialState,
  reducers: {
    // Synchronous actions
    addMessage: (
      state,
      action: PayloadAction<{ relationshipId: string; message: MessageType }>,
    ) => {
      const { relationshipId, message } = action.payload;

      if (!state.messages[relationshipId]) {
        state.messages[relationshipId] = [];
      }

      // Check if message already exists
      const existingIndex = state.messages[relationshipId].findIndex(
        (m) => m._id === message._id,
      );
      if (existingIndex === -1) {
        state.messages[relationshipId].unshift(message);
      } else {
        state.messages[relationshipId][existingIndex] = message;
      }

      // Update last message in contacts
      const contactIndex = state.contacts.findIndex(
        (c) => c._id === relationshipId,
      );
      if (contactIndex !== -1) {
        state.contacts[contactIndex].lastMessage = message;
        state.contacts[contactIndex].updatedAt = new Date().toISOString();
      }
    },

    updateLastSeen: (state, action: PayloadAction<LastSeen>) => {
      const { relationship, user, time } = action.payload;
      state.lastSeen[relationship] = { relationship, user, time };
    },

    incrementUnreadCount: (state, action: PayloadAction<string>) => {
      const relationshipId = action.payload;
      const contactIndex = state.contacts.findIndex(
        (c) => c._id === relationshipId,
      );
      if (contactIndex !== -1) {
        state.contacts[contactIndex].unreadCount =
          (state.contacts[contactIndex].unreadCount || 0) + 1;
      }
    },

    resetUnreadCount: (state, action: PayloadAction<string>) => {
      const relationshipId = action.payload;
      const contactIndex = state.contacts.findIndex(
        (c) => c._id === relationshipId,
      );
      if (contactIndex !== -1) {
        state.contacts[contactIndex].unreadCount = 0;
      }
    },

    clearInbox: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        const { relationship, ...message } = action.payload;
        inboxSlice.caseReducers.addMessage(state, {
          type: "inbox/addMessage",
          payload: { relationshipId: relationship, message: action.payload },
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Edit Message
      .addCase(editMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editMessage.fulfilled, (state, action) => {
        state.loading = false;
        const { _id, content, relationship } = action.payload;

        if (state.messages[relationship]) {
          const messageIndex = state.messages[relationship].findIndex(
            (m) => m._id === _id,
          );
          if (messageIndex !== -1) {
            state.messages[relationship][messageIndex].content = content;
            state.messages[relationship][messageIndex].updatedAt =
              new Date().toISOString();
          }
        }
      })
      .addCase(editMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Message
      .addCase(deleteMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.loading = false;
        const { messageId } = action.payload;

        // Find and mark message as deleted in all relationships
        for (const relationshipId in state.messages) {
          const messageIndex = state.messages[relationshipId].findIndex(
            (m) => m._id === messageId,
          );
          if (messageIndex !== -1) {
            state.messages[relationshipId][messageIndex].isDeleted = true;
            state.messages[relationshipId][messageIndex].content =
              "Message deleted";
          }
        }
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Messages
      .addCase(getMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false;
        const { contactId, data } = action.payload;
        const {
          data: messages,
          nextCursor,
          hasMore,
        } = data as PaginatedResponse<MessageType>;

        if (!state.messages[contactId]) {
          state.messages[contactId] = [];
        }

        // Merge new messages with existing ones, avoiding duplicates
        const existingIds = new Set(
          state.messages[contactId].map((m) => m._id),
        );
        const newMessages = messages.filter(
          (message) => !existingIds.has(message._id),
        );

        state.messages[contactId] = [
          ...newMessages,
          ...state.messages[contactId],
        ];
        state.pagination.messages = { cursor: nextCursor, hasMore };
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Contacts
      .addCase(getContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContacts.fulfilled, (state, action) => {
        state.loading = false;
        const {
          data: contacts,
          nextCursor,
          hasMore,
        } = action.payload as PaginatedResponse<ContactType>;

        if (nextCursor) {
          // Append new contacts for pagination
          state.contacts = [...state.contacts, ...contacts];
        } else {
          // Replace contacts for initial load
          state.contacts = contacts;
        }

        state.pagination.contacts = { cursor: nextCursor, hasMore };
      })
      .addCase(getContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  addMessage,
  updateLastSeen,
  incrementUnreadCount,
  resetUnreadCount,
  clearInbox,
} = inboxSlice.actions;

// Selectors
export const selectContacts = (state: RootState) => state.inbox.contacts;
export const selectMessages = (relationshipId: string) => (state: RootState) =>
  state.inbox.messages[relationshipId] || [];
export const selectLastSeen = (relationshipId: string) => (state: RootState) =>
  state.inbox.lastSeen[relationshipId];
export const selectUnreadCount =
  (relationshipId: string) => (state: RootState) =>
    state.inbox.contacts.find((c) => c._id === relationshipId)?.unreadCount ||
    0;
export const selectInboxLoading = (state: RootState) => state.inbox.loading;
export const selectInboxError = (state: RootState) => state.inbox.error;
export const selectPagination =
  (type: "contacts" | "messages") => (state: RootState) =>
    state.inbox.pagination[type];

export default inboxSlice.reducer;
