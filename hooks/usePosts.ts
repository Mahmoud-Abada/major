/**
 * Posts API Hooks
 * React hooks for posts API operations with loading states and error handling
 */

import { ApiResponse, classroomApi, Post } from "@/services/classroom-api";
import { useCallback, useEffect, useState } from "react";
import { useApi, useMutation } from "./useApi";

// Post CRUD hooks
export function useCreatePost() {
  return useMutation((post: Omit<Post, "id" | "createdAt" | "updatedAt">) =>
    classroomApi.createPost(post),
  );
}

export function useUpdatePost() {
  return useMutation((params: { postId: string; postData: Partial<Post> }) =>
    classroomApi.updatePost(params),
  );
}

export function useDeletePost() {
  return useMutation((postId: string) => classroomApi.deletePost(postId));
}

// Get posts hooks
export function usePosts(
  params: {
    classroomId?: string;
    groupId?: string;
    type?: string;
  },
  immediate = true,
) {
  return useApi(() => classroomApi.getPosts(params), { immediate });
}

export function useStudentPosts(studentId: string, immediate = true) {
  return useApi(() => classroomApi.getStudentPosts(studentId), { immediate });
}

export function useGroupPosts(groupId: string, immediate = true) {
  return useApi(() => classroomApi.getGroupPosts(groupId), { immediate });
}

export function useHomeworksAndQuizzes(
  params: {
    classroomId?: string;
    groupId?: string;
    studentId?: string;
  },
  immediate = true,
) {
  return useApi(() => classroomApi.getHomeworksAndQuizzes(params), {
    immediate,
  });
}

// Post interactions hooks
export function useInteractWithPost() {
  return useMutation(
    (params: {
      postId: string;
      userId: string;
      interaction: "like" | "dislike";
    }) => classroomApi.interactWithPost(params),
  );
}

export function useSubmitHomework() {
  return useMutation(
    (params: { postId: string; studentId: string; submission: any }) =>
      classroomApi.submitHomework(params),
  );
}

export function useSubmitQuiz() {
  return useMutation(
    (params: { postId: string; studentId: string; answers: any[] }) =>
      classroomApi.submitQuiz(params),
  );
}

export function useSubmitPoll() {
  return useMutation(
    (params: { postId: string; studentId: string; choice: string }) =>
      classroomApi.submitPoll(params),
  );
}

// Custom hook for posts management with filtering
export function usePostsManager(
  initialParams: {
    classroomId?: string;
    groupId?: string;
    type?: string;
    studentId?: string;
  } = {},
) {
  const [params, setParams] = useState(initialParams);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    if (!params.classroomId && !params.groupId && !params.studentId) return;

    setLoading(true);
    setError(null);

    try {
      let response: ApiResponse<Post[]>;

      if (params.studentId) {
        response = await classroomApi.getStudentPosts(params.studentId);
      } else if (params.groupId) {
        response = await classroomApi.getGroupPosts(params.groupId);
      } else if (params.classroomId) {
        response = await classroomApi.getPosts({
          classroomId: params.classroomId,
          type: params.type,
        });
      } else {
        throw new Error(
          "Either classroomId, groupId, or studentId is required",
        );
      }

      setPosts(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, [params]);

  const updateParams = useCallback((newParams: Partial<typeof params>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  }, []);

  const refresh = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    refresh,
    updateParams,
    params,
  };
}

// Custom hook for post operations
export function usePostOperations() {
  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();
  const deleteMutation = useDeletePost();
  const interactMutation = useInteractWithPost();
  const submitHomeworkMutation = useSubmitHomework();
  const submitQuizMutation = useSubmitQuiz();
  const submitPollMutation = useSubmitPoll();

  const createPost = useCallback(
    async (postData: Omit<Post, "id" | "createdAt" | "updatedAt">) => {
      return createMutation.mutate(postData);
    },
    [createMutation],
  );

  const updatePost = useCallback(
    async (postId: string, postData: Partial<Post>) => {
      return updateMutation.mutate({ postId, postData });
    },
    [updateMutation],
  );

  const deletePost = useCallback(
    async (postId: string) => {
      return deleteMutation.mutate(postId);
    },
    [deleteMutation],
  );

  const likePost = useCallback(
    async (postId: string, userId: string) => {
      return interactMutation.mutate({ postId, userId, interaction: "like" });
    },
    [interactMutation],
  );

  const dislikePost = useCallback(
    async (postId: string, userId: string) => {
      return interactMutation.mutate({
        postId,
        userId,
        interaction: "dislike",
      });
    },
    [interactMutation],
  );

  const submitHomework = useCallback(
    async (postId: string, studentId: string, submission: any) => {
      return submitHomeworkMutation.mutate({ postId, studentId, submission });
    },
    [submitHomeworkMutation],
  );

  const submitQuiz = useCallback(
    async (postId: string, studentId: string, answers: any[]) => {
      return submitQuizMutation.mutate({ postId, studentId, answers });
    },
    [submitQuizMutation],
  );

  const submitPoll = useCallback(
    async (postId: string, studentId: string, choice: string) => {
      return submitPollMutation.mutate({ postId, studentId, choice });
    },
    [submitPollMutation],
  );

  const publishPost = useCallback(
    async (postId: string) => {
      return updateMutation.mutate({ postId, postData: { isPublished: true } });
    },
    [updateMutation],
  );

  const unpublishPost = useCallback(
    async (postId: string) => {
      return updateMutation.mutate({
        postId,
        postData: { isPublished: false },
      });
    },
    [updateMutation],
  );

  return {
    createPost,
    updatePost,
    deletePost,
    likePost,
    dislikePost,
    submitHomework,
    submitQuiz,
    submitPoll,
    publishPost,
    unpublishPost,
    loading:
      createMutation.loading ||
      updateMutation.loading ||
      deleteMutation.loading ||
      interactMutation.loading ||
      submitHomeworkMutation.loading ||
      submitQuizMutation.loading ||
      submitPollMutation.loading,
    error:
      createMutation.error ||
      updateMutation.error ||
      deleteMutation.error ||
      interactMutation.error ||
      submitHomeworkMutation.error ||
      submitQuizMutation.error ||
      submitPollMutation.error,
  };
}

// Custom hook for post statistics
export function usePostStatistics(posts: Post[]) {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    byType: {} as Record<string, number>,
    byAuthor: {} as Record<string, number>,
    recentActivity: 0,
    engagementRate: 0,
  });

  useEffect(() => {
    if (posts.length === 0) {
      setStats({
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0,
        totalLikes: 0,
        totalComments: 0,
        byType: {},
        byAuthor: {},
        recentActivity: 0,
        engagementRate: 0,
      });
      return;
    }

    const totalPosts = posts.length;
    const publishedPosts = posts.filter((p) => p.isPublished).length;
    const draftPosts = posts.filter((p) => !p.isPublished).length;
    const totalLikes = posts.reduce(
      (sum, post) => sum + (post.likesCount || 0),
      0,
    );
    const totalComments = posts.reduce(
      (sum, post) => sum + (post.commentsCount || 0),
      0,
    );

    // Group by type
    const byType: Record<string, number> = {};
    posts.forEach((post) => {
      byType[post.type] = (byType[post.type] || 0) + 1;
    });

    // Group by author
    const byAuthor: Record<string, number> = {};
    posts.forEach((post) => {
      const author = post.authorName || post.author;
      byAuthor[author] = (byAuthor[author] || 0) + 1;
    });

    // Calculate recent activity (posts in last 7 days)
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentActivity = posts.filter(
      (post) => post.createdAt > weekAgo,
    ).length;

    // Calculate engagement rate
    const engagementRate =
      totalPosts > 0 ? (totalLikes + totalComments) / totalPosts : 0;

    setStats({
      totalPosts,
      publishedPosts,
      draftPosts,
      totalLikes,
      totalComments,
      byType,
      byAuthor,
      recentActivity,
      engagementRate,
    });
  }, [posts]);

  return stats;
}
