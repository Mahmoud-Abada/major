export interface Post {
  id: string;
  title: string;
  content: string;
  type:
    | "announcement"
    | "homework"
    | "quiz"
    | "poll"
    | "discussion"
    | "resource";
  authorId: string;
  authorName: string;
  authorRole: "teacher" | "student" | "admin";
  authorAvatar?: string;
  classId: string;
  className: string;
  subject: string;
  status: "draft" | "published" | "archived" | "pending_approval";
  visibility: "public" | "class_only" | "private";
  priority: "low" | "normal" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  dueDate?: string;
  attachments?: PostAttachment[];
  tags: string[];
  interactions: PostInteractions;
  comments: Comment[];
  isEdited: boolean;
  editHistory?: EditHistory[];
  settings: PostSettings;
}

export interface PostAttachment {
  id: string;
  name: string;
  type: "image" | "document" | "video" | "audio" | "link";
  url: string;
  size?: number;
  mimeType?: string;
  thumbnailUrl?: string;
}

export interface PostInteractions {
  likes: number;
  dislikes: number;
  shares: number;
  views: number;
  bookmarks: number;
  userInteraction?: {
    liked: boolean;
    disliked: boolean;
    bookmarked: boolean;
    shared: boolean;
  };
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: "teacher" | "student" | "admin";
  authorAvatar?: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  parentId?: string; // For nested comments
  replies?: Comment[];
  interactions: {
    likes: number;
    dislikes: number;
    userInteraction?: {
      liked: boolean;
      disliked: boolean;
    };
  };
  attachments?: PostAttachment[];
}

export interface EditHistory {
  id: string;
  editedAt: string;
  editedBy: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  reason?: string;
}

export interface PostSettings {
  allowComments: boolean;
  allowInteractions: boolean;
  requireApproval: boolean;
  notifyOnComment: boolean;
  notifyOnInteraction: boolean;
  autoArchiveDate?: string;
}

export interface Poll {
  id: string;
  postId: string;
  question: string;
  options: PollOption[];
  allowMultiple: boolean;
  showResults: "always" | "after_vote" | "after_end";
  endDate?: string;
  totalVotes: number;
  userVote?: string[];
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

export interface Homework {
  id: string;
  postId: string;
  title: string;
  description: string;
  instructions: string;
  dueDate: string;
  maxPoints: number;
  submissionType: "text" | "file" | "both";
  allowLateSubmission: boolean;
  latePenalty?: number;
  submissions: HomeworkSubmission[];
  rubric?: HomeworkRubric[];
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  studentName: string;
  content?: string;
  attachments?: PostAttachment[];
  submittedAt: string;
  status: "submitted" | "late" | "graded" | "returned";
  grade?: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: string;
}

export interface HomeworkRubric {
  id: string;
  criteria: string;
  maxPoints: number;
  description: string;
}

export interface Quiz {
  id: string;
  postId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  attempts: number;
  showCorrectAnswers: "never" | "after_submit" | "after_due";
  randomizeQuestions: boolean;
  dueDate?: string;
  submissions: QuizSubmission[];
}

export interface QuizQuestion {
  id: string;
  type: "multiple_choice" | "true_false" | "short_answer" | "essay";
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  explanation?: string;
}

export interface QuizSubmission {
  id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  answers: QuizAnswer[];
  submittedAt: string;
  score: number;
  maxScore: number;
  timeSpent: number; // in minutes
  attempt: number;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  points: number;
}

export interface PostStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  pendingPosts: number;
  archivedPosts: number;
  totalInteractions: number;
  totalComments: number;
  totalViews: number;
  averageEngagement: number;
  topPerformingPosts: Post[];
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type:
    | "post_created"
    | "comment_added"
    | "interaction"
    | "homework_submitted"
    | "quiz_completed";
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
  postId?: string;
  postTitle?: string;
}

export interface ClassPostOverview {
  classId: string;
  className: string;
  totalPosts: number;
  activeDiscussions: number;
  pendingHomeworks: number;
  upcomingQuizzes: number;
  averageEngagement: number;
  lastActivity: string;
  topContributors: {
    userId: string;
    userName: string;
    postsCount: number;
    commentsCount: number;
  }[];
}

export interface StudentPostSummary {
  studentId: string;
  studentName: string;
  className: string;
  postsCreated: number;
  commentsPosted: number;
  homeworksSubmitted: number;
  quizzesCompleted: number;
  averageGrade: number;
  engagementScore: number;
  lastActivity: string;
  upcomingDeadlines: {
    id: string;
    title: string;
    type: "homework" | "quiz";
    dueDate: string;
  }[];
}

export type PostFilter = {
  type?: Post["type"];
  status?: Post["status"];
  priority?: Post["priority"];
  classId?: string;
  authorRole?: Post["authorRole"];
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
  hasAttachments?: boolean;
  hasComments?: boolean;
};
