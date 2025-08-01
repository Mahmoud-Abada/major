/**
 * Post API Endpoints
 * RTK Query endpoints for posts management
 */
import type {
  ApiResponse,
  CreatePostParams,
  GetPostsParams,
  InteractWithPostParams,
  Post,
  SubmitHomeworkParams,
  SubmitPollParams,
  SubmitQuizParams,
  UpdatePostParams,
} from "@/store/types/api";
import { baseApi } from "./baseApi";

export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create post
    createPost: builder.mutation<ApiResponse<Post>, CreatePostParams>({
      query: (params) => ({
        url: "/post/create-post",
        method: "POST",
        body: params.post,
      }),
      invalidatesTags: (result, error, { post }) => [
        { type: "Post", id: "LIST" },
        ...(post.classroom
          ? [{ type: "Classroom" as const, id: post.classroom }]
          : []),
        ...(post.group ? [{ type: "Group" as const, id: post.group }] : []),
      ],
    }),

    // Update post
    updatePost: builder.mutation<ApiResponse<Post>, UpdatePostParams>({
      query: (params) => ({
        url: "/post/update-post",
        method: "POST",
        body: params,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
        { type: "Post", id: "LIST" },
      ],
    }),

    // Delete post
    deletePost: builder.mutation<ApiResponse<void>, string>({
      query: (postId) => ({
        url: "/post/delete-post",
        method: "DELETE",
        body: { postId },
      }),
      invalidatesTags: (result, error, postId) => [
        { type: "Post", id: postId },
        { type: "Post", id: "LIST" },
      ],
    }),

    // Get posts
    getPosts: builder.query<ApiResponse<Post[]>, GetPostsParams>({
      query: (params) => ({
        url: "/post/get-posts",
        method: "POST",
        body: params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Post" as const, id })),
              { type: "Post", id: "LIST" },
            ]
          : [{ type: "Post", id: "LIST" }],
    }),

    // Get single post
    getPost: builder.query<ApiResponse<Post>, string>({
      query: (postId) => ({
        url: "/post/get-post",
        method: "POST",
        body: { postId },
      }),
      providesTags: (result, error, postId) => [{ type: "Post", id: postId }],
    }),

    // Get student posts
    getStudentPosts: builder.query<ApiResponse<Post[]>, string>({
      query: (studentId) => ({
        url: "/post/get-posts-student",
        method: "POST",
        body: { studentId },
      }),
      providesTags: (result, error, studentId) => [
        { type: "Post", id: `STUDENT_${studentId}` },
        { type: "Student", id: studentId },
      ],
    }),

    // Get group posts
    getGroupPosts: builder.query<ApiResponse<Post[]>, string>({
      query: (groupId) => ({
        url: "/post/get-group-posts",
        method: "POST",
        body: { groupId },
      }),
      providesTags: (result, error, groupId) => [
        { type: "Post", id: `GROUP_${groupId}` },
        { type: "Group", id: groupId },
      ],
    }),

    // Submit homework
    submitHomework: builder.mutation<ApiResponse<void>, SubmitHomeworkParams>({
      query: (params) => ({
        url: "/post/submit-homework",
        method: "POST",
        body: params,
      }),
      invalidatesTags: (result, error, { postId, studentId }) => [
        { type: "Post", id: postId },
        { type: "Student", id: studentId },
      ],
    }),

    // Submit quiz
    submitQuiz: builder.mutation<ApiResponse<void>, SubmitQuizParams>({
      query: (params) => ({
        url: "/post/submit-quiz",
        method: "POST",
        body: params,
      }),
      invalidatesTags: (result, error, { postId, studentId }) => [
        { type: "Post", id: postId },
        { type: "Student", id: studentId },
      ],
    }),

    // Submit poll
    submitPoll: builder.mutation<ApiResponse<void>, SubmitPollParams>({
      query: (params) => ({
        url: "/post/submit-poll",
        method: "POST",
        body: params,
      }),
      invalidatesTags: (result, error, { postId, studentId }) => [
        { type: "Post", id: postId },
        { type: "Student", id: studentId },
      ],
    }),

    // Interact with post (like, dislike)
    interactWithPost: builder.mutation<
      ApiResponse<void>,
      InteractWithPostParams
    >({
      query: (params) => ({
        url: "/post/interact-post",
        method: "POST",
        body: params,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
      ],
    }),

    // Get homeworks and quizzes
    getHomeworksAndQuizzes: builder.query<
      ApiResponse<Post[]>,
      {
        classroomId?: string;
        groupId?: string;
        studentId?: string;
      }
    >({
      query: (params) => ({
        url: "/post/get-homeworks-quizs",
        method: "POST",
        body: params,
      }),
      providesTags: [{ type: "Post", id: "HOMEWORK_QUIZ" }],
    }),

    // Get post comments
    getPostComments: builder.query<ApiResponse<any[]>, string>({
      query: (postId) => ({
        url: "/post/get-comments",
        method: "POST",
        body: { postId },
      }),
      providesTags: (result, error, postId) => [
        { type: "Post", id: `${postId}_COMMENTS` },
      ],
    }),

    // Update comment
    updateComment: builder.mutation<
      ApiResponse<void>,
      {
        commentId: string;
        content: string;
      }
    >({
      query: (params) => ({
        url: "/post/update-comment",
        method: "POST",
        body: params,
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),

    // Delete comment
    deleteComment: builder.mutation<ApiResponse<void>, string>({
      query: (commentId) => ({
        url: "/post/delete-comment",
        method: "DELETE",
        body: { commentId },
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),

    // Get post interactions
    getPostInteractions: builder.query<ApiResponse<any[]>, string>({
      query: (postId) => ({
        url: "/post/get-interactions",
        method: "POST",
        body: { postId },
      }),
      providesTags: (result, error, postId) => [
        { type: "Post", id: `${postId}_INTERACTIONS` },
      ],
    }),

    // Interact with comment
    interactWithComment: builder.mutation<
      ApiResponse<void>,
      {
        commentId: string;
        userId: string;
        interaction: "like" | "dislike";
      }
    >({
      query: (params) => ({
        url: "/post/interact-comment",
        method: "POST",
        body: params,
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),

    // Control post (publish/unpublish)
    controlPost: builder.mutation<
      ApiResponse<void>,
      {
        postId: string;
        action: "publish" | "unpublish" | "archive";
      }
    >({
      query: (params) => ({
        url: "/post/control-post",
        method: "POST",
        body: params,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
        { type: "Post", id: "LIST" },
      ],
    }),

    // Accept post (for moderation)
    acceptPost: builder.mutation<ApiResponse<void>, string>({
      query: (postId) => ({
        url: "/post/accept-post",
        method: "POST",
        body: { postId },
      }),
      invalidatesTags: (result, error, postId) => [
        { type: "Post", id: postId },
        { type: "Post", id: "LIST" },
      ],
    }),

    // Respond to homework
    respondToHomework: builder.mutation<
      ApiResponse<void>,
      {
        postId: string;
        studentId: string;
        response: any;
      }
    >({
      query: (params) => ({
        url: "/post/respond-homework",
        method: "POST",
        body: params,
      }),
      invalidatesTags: (result, error, { postId, studentId }) => [
        { type: "Post", id: postId },
        { type: "Student", id: studentId },
      ],
    }),

    // Get homework student options
    getHomeworkStudentOptions: builder.query<
      ApiResponse<any[]>,
      {
        postId: string;
        studentId: string;
      }
    >({
      query: (params) => ({
        url: "/post/get-homeworks-student-options",
        method: "POST",
        body: params,
      }),
      providesTags: (result, error, { postId, studentId }) => [
        { type: "Post", id: `${postId}_STUDENT_${studentId}` },
      ],
    }),

    // Get homework students
    getHomeworkStudents: builder.query<ApiResponse<any[]>, string>({
      query: (postId) => ({
        url: "/post/get-homeworks-students",
        method: "POST",
        body: { postId },
      }),
      providesTags: (result, error, postId) => [
        { type: "Post", id: `${postId}_STUDENTS` },
      ],
    }),
  }),
});

// Export hooks
export const {
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetPostsQuery,
  useGetPostQuery,
  useGetStudentPostsQuery,
  useGetGroupPostsQuery,
  useSubmitHomeworkMutation,
  useSubmitQuizMutation,
  useSubmitPollMutation,
  useInteractWithPostMutation,
  useGetHomeworksAndQuizzesQuery,
  useGetPostCommentsQuery,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetPostInteractionsQuery,
  useInteractWithCommentMutation,
  useControlPostMutation,
  useAcceptPostMutation,
  useRespondToHomeworkMutation,
  useGetHomeworkStudentOptionsQuery,
  useGetHomeworkStudentsQuery,
} = postApi;
