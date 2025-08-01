// Mock posts data
export interface Post {
  id: string;
  author: string;
  authorName: string;
  authorAvatar?: string;
  classroom?: string;
  group?: string;
  type: "announcement" | "homework" | "quiz" | "poll" | "material";
  title: string;
  content: string;
  attachments?: string[];
  dueDate?: number;
  isPublished: boolean;
  allowComments: boolean;
  createdAt: number;
  updatedAt: number;
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
}

export const mockPosts: Post[] = [
  {
    id: "post-001",
    author: "teacher-001",
    authorName: "Karim Mansouri",
    authorAvatar: "/avatars/karim-mansouri.jpg",
    classroom: "classroom-001",
    type: "homework",
    title: "Polynomial Functions Assignment",
    content:
      "Complete exercises 1-15 from Chapter 8. Focus on factoring techniques and graphing polynomial functions. Show all work and include graphs where requested.",
    attachments: [
      "/files/polynomial-exercises.pdf",
      "/files/graphing-template.pdf",
    ],
    dueDate: new Date("2024-12-25").getTime(),
    isPublished: true,
    allowComments: true,
    createdAt: new Date("2024-11-18").getTime(),
    updatedAt: new Date("2024-11-18").getTime(),
    likesCount: 3,
    commentsCount: 7,
    isLiked: false,
  },
  {
    id: "post-002",
    author: "teacher-001",
    authorName: "Karim Mansouri",
    authorAvatar: "/avatars/karim-mansouri.jpg",
    classroom: "classroom-002",
    type: "announcement",
    title: "Lab Session Rescheduled",
    content:
      "Due to equipment maintenance, this week's lab session has been moved from Tuesday to Thursday at the same time (2:00 PM - 5:00 PM). Please bring your lab notebooks and safety goggles.",
    attachments: [],
    isPublished: true,
    allowComments: true,
    createdAt: new Date("2024-11-17").getTime(),
    updatedAt: new Date("2024-11-17").getTime(),
    likesCount: 12,
    commentsCount: 4,
    isLiked: true,
  },
  {
    id: "post-003",
    author: "teacher-002",
    authorName: "Amina Benaissa",
    authorAvatar: "/avatars/amina-benaissa.jpg",
    classroom: "classroom-003",
    type: "quiz",
    title: "Classical Poetry Quiz",
    content:
      "Quick quiz on classical Arabic poetry covering Al-Mutanabbi and Abu Nuwas. Duration: 30 minutes.",
    attachments: [],
    dueDate: new Date("2024-12-22").getTime(),
    isPublished: true,
    allowComments: false,
    createdAt: new Date("2024-11-19").getTime(),
    updatedAt: new Date("2024-11-19").getTime(),
    likesCount: 8,
    commentsCount: 0,
    isLiked: false,
  },
  {
    id: "post-004",
    author: "teacher-003",
    authorName: "Yacine Cherif",
    authorAvatar: "/avatars/yacine-cherif.jpg",
    classroom: "classroom-004",
    type: "material",
    title: "Web Development Resources",
    content:
      "I've uploaded additional resources for React development. These include code examples and best practices for component design.",
    attachments: [
      "/files/react-examples.zip",
      "/files/best-practices.pdf",
    ],
    isPublished: true,
    allowComments: true,
    createdAt: new Date("2024-11-16").getTime(),
    updatedAt: new Date("2024-11-16").getTime(),
    likesCount: 15,
    commentsCount: 9,
    isLiked: true,
  },
  {
    id: "post-005",
    author: "teacher-001",
    authorName: "Karim Mansouri",
    authorAvatar: "/avatars/karim-mansouri.jpg",
    classroom: "classroom-001",
    type: "poll",
    title: "Preferred Study Session Time",
    content:
      "Help me choose the best time for our additional study sessions. Please vote for your preferred time slot.",
    attachments: [],
    isPublished: true,
    allowComments: true,
    createdAt: new Date("2024-11-15").getTime(),
    updatedAt: new Date("2024-11-15").getTime(),
    likesCount: 6,
    commentsCount: 12,
    isLiked: false,
  },
];

// Helper functions
export const getPostById = (id: string): Post | undefined => {
  return mockPosts.find((post) => post.id === id);
};

export const getPostsByClassroom = (classroomId: string): Post[] => {
  return mockPosts.filter((post) => post.classroom === classroomId);
};

export const getPostsByAuthor = (authorId: string): Post[] => {
  return mockPosts.filter((post) => post.author === authorId);
};

export const getPostsByType = (type: Post["type"]): Post[] => {
  return mockPosts.filter((post) => post.type === type);
};

export const getPublishedPosts = (): Post[] => {
  return mockPosts.filter((post) => post.isPublished);
};