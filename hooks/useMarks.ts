/**
 * Marks API Hooks
 * React hooks for marks API operations with loading states and error handling
 */

import { ApiResponse, classroomApi, Mark } from '@/services/classroom-api';
import { useCallback, useEffect, useState } from 'react';
import { useApi, useMutation } from './useApi';

// Mark CRUD hooks
export function useCreateMark() {
    return useMutation(
        (mark: Omit<Mark, "id" | "createdAt" | "updatedAt">) =>
            classroomApi.createMark(mark)
    );
}

export function useUpdateMark() {
    return useMutation(
        (params: { markId: string; markData: Partial<Mark> }) =>
            classroomApi.updateMark(params)
    );
}

export function useDeleteMark() {
    return useMutation(
        (markId: string) => classroomApi.deleteMark(markId)
    );
}

// Student marks hooks
export function useStudentMarks(params: {
    studentId: string;
    classroomId?: string;
    groupId?: string;
}, immediate = true) {
    return useApi(
        () => classroomApi.getStudentMarks(params),
        { immediate }
    );
}

export function useUpdateStudentMark() {
    return useMutation(
        (params: { studentId: string; markId: string; markData: Partial<Mark> }) =>
            classroomApi.updateStudentMark(params)
    );
}

// Group marks hooks
export function useGroupMarks(groupId: string, immediate = true) {
    return useApi(
        () => classroomApi.getGroupMarks(groupId),
        { immediate }
    );
}

export function useUpdateGroupMark() {
    return useMutation(
        (params: { groupId: string; markId: string; markData: Partial<Mark> }) =>
            classroomApi.updateGroupMark(params)
    );
}

export function useUpdateGroupExemption() {
    return useMutation(
        (params: { groupId: string; studentId: string; isExempted: boolean }) =>
            classroomApi.updateGroupExemption(params)
    );
}

// Custom hook for marks management with filtering
export function useMarksManager(initialParams: {
    studentId?: string;
    classroomId?: string;
    groupId?: string;
    markType?: string;
} = {}) {
    const [params, setParams] = useState(initialParams);
    const [marks, setMarks] = useState<Mark[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMarks = useCallback(async () => {
        if (!params.studentId && !params.groupId) return;

        setLoading(true);
        setError(null);

        try {
            let response: ApiResponse<Mark[]>;

            if (params.groupId) {
                response = await classroomApi.getGroupMarks(params.groupId);
            } else if (params.studentId) {
                response = await classroomApi.getStudentMarks({
                    studentId: params.studentId,
                    classroomId: params.classroomId,
                    groupId: params.groupId
                });
            } else {
                throw new Error('Either studentId or groupId is required');
            }

            let filteredMarks = response.data;

            // Apply filters
            if (params.markType) {
                filteredMarks = filteredMarks.filter(mark => mark.markType === params.markType);
            }

            setMarks(filteredMarks);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch marks');
        } finally {
            setLoading(false);
        }
    }, [params]);

    const updateParams = useCallback((newParams: Partial<typeof params>) => {
        setParams(prev => ({ ...prev, ...newParams }));
    }, []);

    const refresh = useCallback(() => {
        fetchMarks();
    }, [fetchMarks]);

    useEffect(() => {
        fetchMarks();
    }, [fetchMarks]);

    return {
        marks,
        loading,
        error,
        refresh,
        updateParams,
        params
    };
}

// Custom hook for mark operations
export function useMarkOperations() {
    const createMutation = useCreateMark();
    const updateMutation = useUpdateMark();
    const deleteMutation = useDeleteMark();
    const updateStudentMutation = useUpdateStudentMark();
    const updateGroupMutation = useUpdateGroupMark();
    const updateExemptionMutation = useUpdateGroupExemption();

    const createMark = useCallback(async (markData: Omit<Mark, "id" | "createdAt" | "updatedAt">) => {
        return createMutation.mutate(markData);
    }, [createMutation]);

    const updateMark = useCallback(async (markId: string, markData: Partial<Mark>) => {
        return updateMutation.mutate({ markId, markData });
    }, [updateMutation]);

    const deleteMark = useCallback(async (markId: string) => {
        return deleteMutation.mutate(markId);
    }, [deleteMutation]);

    const updateStudentMark = useCallback(async (
        studentId: string,
        markId: string,
        markData: Partial<Mark>
    ) => {
        return updateStudentMutation.mutate({ studentId, markId, markData });
    }, [updateStudentMutation]);

    const updateGroupMark = useCallback(async (
        groupId: string,
        markId: string,
        markData: Partial<Mark>
    ) => {
        return updateGroupMutation.mutate({ groupId, markId, markData });
    }, [updateGroupMutation]);

    const updateExemption = useCallback(async (
        groupId: string,
        studentId: string,
        isExempted: boolean
    ) => {
        return updateExemptionMutation.mutate({ groupId, studentId, isExempted });
    }, [updateExemptionMutation]);

    return {
        createMark,
        updateMark,
        deleteMark,
        updateStudentMark,
        updateGroupMark,
        updateExemption,
        loading: createMutation.loading || updateMutation.loading || deleteMutation.loading ||
            updateStudentMutation.loading || updateGroupMutation.loading || updateExemptionMutation.loading,
        error: createMutation.error || updateMutation.error || deleteMutation.error ||
            updateStudentMutation.error || updateGroupMutation.error || updateExemptionMutation.error
    };
}

// Custom hook for mark statistics
export function useMarkStatistics(marks: Mark[]) {
    const [stats, setStats] = useState({
        totalMarks: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        passingRate: 0,
        byType: {} as Record<string, { count: number; average: number }>,
        bySubject: {} as Record<string, { count: number; average: number }>,
        recentTrend: 'stable' as 'up' | 'down' | 'stable'
    });

    useEffect(() => {
        if (marks.length === 0) {
            setStats({
                totalMarks: 0,
                averageScore: 0,
                highestScore: 0,
                lowestScore: 0,
                passingRate: 0,
                byType: {},
                bySubject: {},
                recentTrend: 'stable'
            });
            return;
        }

        const totalMarks = marks.length;
        const scores = marks.map(mark => (mark.value / mark.maxValue) * 100);
        const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const highestScore = Math.max(...scores);
        const lowestScore = Math.min(...scores);
        const passingRate = (scores.filter(score => score >= 50).length / scores.length) * 100;

        // Group by type
        const byType: Record<string, { count: number; average: number }> = {};
        marks.forEach(mark => {
            const score = (mark.value / mark.maxValue) * 100;
            if (!byType[mark.markType]) {
                byType[mark.markType] = { count: 0, average: 0 };
            }
            byType[mark.markType].count++;
            byType[mark.markType].average += score;
        });

        Object.keys(byType).forEach(type => {
            byType[type].average = byType[type].average / byType[type].count;
        });

        // Group by subject
        const bySubject: Record<string, { count: number; average: number }> = {};
        marks.forEach(mark => {
            const score = (mark.value / mark.maxValue) * 100;
            if (!bySubject[mark.subject]) {
                bySubject[mark.subject] = { count: 0, average: 0 };
            }
            bySubject[mark.subject].count++;
            bySubject[mark.subject].average += score;
        });

        Object.keys(bySubject).forEach(subject => {
            bySubject[subject].average = bySubject[subject].average / bySubject[subject].count;
        });

        // Calculate trend (simplified - based on recent vs older marks)
        const sortedMarks = [...marks].sort((a, b) => (b.date || 0) - (a.date || 0));
        const recentMarks = sortedMarks.slice(0, Math.ceil(sortedMarks.length / 3));
        const olderMarks = sortedMarks.slice(Math.ceil(sortedMarks.length / 3));

        let recentTrend: 'up' | 'down' | 'stable' = 'stable';
        if (recentMarks.length > 0 && olderMarks.length > 0) {
            const recentAvg = recentMarks.reduce((sum, mark) =>
                sum + (mark.value / mark.maxValue) * 100, 0) / recentMarks.length;
            const olderAvg = olderMarks.reduce((sum, mark) =>
                sum + (mark.value / mark.maxValue) * 100, 0) / olderMarks.length;

            if (recentAvg > olderAvg + 2) recentTrend = 'up';
            else if (recentAvg < olderAvg - 2) recentTrend = 'down';
        }

        setStats({
            totalMarks,
            averageScore,
            highestScore,
            lowestScore,
            passingRate,
            byType,
            bySubject,
            recentTrend
        });
    }, [marks]);

    return stats;
}