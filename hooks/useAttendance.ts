/**
 * Attendance API Hooks
 * React hooks for attendance API operations with loading states and error handling
 */

import { ApiResponse, Attendance, classroomApi } from '@/services/classroom-api';
import { useCallback, useEffect, useState } from 'react';
import { useApi, useMutation } from './useApi';

// Attendance CRUD hooks
export function useAddStudentAttendance() {
    return useMutation(
        (attendance: Omit<Attendance, "id" | "createdAt" | "updatedAt">) =>
            classroomApi.addStudentAttendance(attendance)
    );
}

export function useUpdateStudentAttendance() {
    return useMutation(
        (params: { attendanceId: string; attendanceData: Partial<Attendance> }) =>
            classroomApi.updateStudentAttendance(params)
    );
}

// Get attendance hooks
export function useStudentAttendance(params: {
    studentId: string;
    dateRange?: { start: number; end: number };
}, immediate = true) {
    return useApi(
        () => classroomApi.getStudentAttendance(params),
        { immediate }
    );
}

export function useEventAttendance(eventId: string, immediate = true) {
    return useApi(
        () => classroomApi.getEventAttendance(eventId),
        { immediate }
    );
}

export function useClassroomAttendance(params: {
    classroomId: string;
    date?: number;
}, immediate = true) {
    return useApi(
        () => classroomApi.getClassroomAttendance(params),
        { immediate }
    );
}

// Custom hook for attendance management with filtering
export function useAttendanceManager(initialParams: {
    studentId?: string;
    classroomId?: string;
    eventId?: string;
    dateRange?: { start: number; end: number };
} = {}) {
    const [params, setParams] = useState(initialParams);
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAttendance = useCallback(async () => {
        if (!params.studentId && !params.classroomId && !params.eventId) return;

        setLoading(true);
        setError(null);

        try {
            let response: ApiResponse<Attendance[]>;

            if (params.eventId) {
                response = await classroomApi.getEventAttendance(params.eventId);
            } else if (params.classroomId) {
                response = await classroomApi.getClassroomAttendance({
                    classroomId: params.classroomId,
                    date: params.dateRange?.start
                });
            } else if (params.studentId) {
                response = await classroomApi.getStudentAttendance({
                    studentId: params.studentId,
                    dateRange: params.dateRange
                });
            } else {
                throw new Error('Either studentId, classroomId, or eventId is required');
            }

            setAttendance(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch attendance');
        } finally {
            setLoading(false);
        }
    }, [params]);

    const updateParams = useCallback((newParams: Partial<typeof params>) => {
        setParams(prev => ({ ...prev, ...newParams }));
    }, []);

    const refresh = useCallback(() => {
        fetchAttendance();
    }, [fetchAttendance]);

    useEffect(() => {
        fetchAttendance();
    }, [fetchAttendance]);

    return {
        attendance,
        loading,
        error,
        refresh,
        updateParams,
        params
    };
}

// Custom hook for attendance operations
export function useAttendanceOperations() {
    const addMutation = useAddStudentAttendance();
    const updateMutation = useUpdateStudentAttendance();

    const addAttendance = useCallback(async (attendanceData: Omit<Attendance, "id" | "createdAt" | "updatedAt">) => {
        return addMutation.mutate(attendanceData);
    }, [addMutation]);

    const updateAttendance = useCallback(async (attendanceId: string, attendanceData: Partial<Attendance>) => {
        return updateMutation.mutate({ attendanceId, attendanceData });
    }, [updateMutation]);

    const markPresent = useCallback(async (attendanceId: string) => {
        return updateMutation.mutate({
            attendanceId,
            attendanceData: { status: 'present' }
        });
    }, [updateMutation]);

    const markAbsent = useCallback(async (attendanceId: string, notes?: string) => {
        return updateMutation.mutate({
            attendanceId,
            attendanceData: { status: 'absent', notes }
        });
    }, [updateMutation]);

    const markLate = useCallback(async (attendanceId: string, notes?: string) => {
        return updateMutation.mutate({
            attendanceId,
            attendanceData: { status: 'late', notes }
        });
    }, [updateMutation]);

    const markExcused = useCallback(async (attendanceId: string, notes?: string) => {
        return updateMutation.mutate({
            attendanceId,
            attendanceData: { status: 'excused', notes }
        });
    }, [updateMutation]);

    return {
        addAttendance,
        updateAttendance,
        markPresent,
        markAbsent,
        markLate,
        markExcused,
        loading: addMutation.loading || updateMutation.loading,
        error: addMutation.error || updateMutation.error
    };
}

// Custom hook for attendance statistics
export function useAttendanceStatistics(attendance: Attendance[]) {
    const [stats, setStats] = useState({
        totalSessions: 0,
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        excusedCount: 0,
        attendanceRate: 0,
        punctualityRate: 0,
        byDate: {} as Record<string, { present: number; absent: number; late: number; excused: number }>,
        byStudent: {} as Record<string, { present: number; absent: number; late: number; excused: number; rate: number }>,
        recentTrend: 'stable' as 'improving' | 'declining' | 'stable'
    });

    useEffect(() => {
        if (attendance.length === 0) {
            setStats({
                totalSessions: 0,
                presentCount: 0,
                absentCount: 0,
                lateCount: 0,
                excusedCount: 0,
                attendanceRate: 0,
                punctualityRate: 0,
                byDate: {},
                byStudent: {},
                recentTrend: 'stable'
            });
            return;
        }

        const totalSessions = attendance.length;
        const presentCount = attendance.filter(a => a.status === 'present').length;
        const absentCount = attendance.filter(a => a.status === 'absent').length;
        const lateCount = attendance.filter(a => a.status === 'late').length;
        const excusedCount = attendance.filter(a => a.status === 'excused').length;

        const attendanceRate = ((presentCount + lateCount + excusedCount) / totalSessions) * 100;
        const punctualityRate = (presentCount / totalSessions) * 100;

        // Group by date
        const byDate: Record<string, { present: number; absent: number; late: number; excused: number }> = {};
        attendance.forEach(record => {
            const dateKey = new Date(record.date).toDateString();
            if (!byDate[dateKey]) {
                byDate[dateKey] = { present: 0, absent: 0, late: 0, excused: 0 };
            }
            byDate[dateKey][record.status]++;
        });

        // Group by student
        const byStudent: Record<string, { present: number; absent: number; late: number; excused: number; rate: number }> = {};
        attendance.forEach(record => {
            const studentKey = record.studentName || record.student;
            if (!byStudent[studentKey]) {
                byStudent[studentKey] = { present: 0, absent: 0, late: 0, excused: 0, rate: 0 };
            }
            byStudent[studentKey][record.status]++;
        });

        // Calculate rates for each student
        Object.keys(byStudent).forEach(student => {
            const studentData = byStudent[student];
            const total = studentData.present + studentData.absent + studentData.late + studentData.excused;
            studentData.rate = total > 0 ? ((studentData.present + studentData.late + studentData.excused) / total) * 100 : 0;
        });

        // Calculate trend (simplified - based on recent vs older attendance)
        const sortedAttendance = [...attendance].sort((a, b) => b.date - a.date);
        const recentAttendance = sortedAttendance.slice(0, Math.ceil(sortedAttendance.length / 3));
        const olderAttendance = sortedAttendance.slice(Math.ceil(sortedAttendance.length / 3));

        let recentTrend: 'improving' | 'declining' | 'stable' = 'stable';
        if (recentAttendance.length > 0 && olderAttendance.length > 0) {
            const recentRate = (recentAttendance.filter(a => a.status === 'present' || a.status === 'late' || a.status === 'excused').length / recentAttendance.length) * 100;
            const olderRate = (olderAttendance.filter(a => a.status === 'present' || a.status === 'late' || a.status === 'excused').length / olderAttendance.length) * 100;

            if (recentRate > olderRate + 5) recentTrend = 'improving';
            else if (recentRate < olderRate - 5) recentTrend = 'declining';
        }

        setStats({
            totalSessions,
            presentCount,
            absentCount,
            lateCount,
            excusedCount,
            attendanceRate,
            punctualityRate,
            byDate,
            byStudent,
            recentTrend
        });
    }, [attendance]);

    return stats;
}

// Custom hook for bulk attendance operations
export function useBulkAttendance() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const markBulkAttendance = useCallback(async (
        attendanceRecords: Array<{
            student: string;
            classroom?: string;
            event?: string;
            date: number;
            status: 'present' | 'absent' | 'late' | 'excused';
            notes?: string;
        }>
    ) => {
        setLoading(true);
        setError(null);

        try {
            const promises = attendanceRecords.map(record =>
                classroomApi.addStudentAttendance(record)
            );

            await Promise.all(promises);
        } catch (err: any) {
            setError(err.message || 'Failed to mark bulk attendance');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateBulkAttendance = useCallback(async (
        updates: Array<{
            attendanceId: string;
            status: 'present' | 'absent' | 'late' | 'excused';
            notes?: string;
        }>
    ) => {
        setLoading(true);
        setError(null);

        try {
            const promises = updates.map(update =>
                classroomApi.updateStudentAttendance({
                    attendanceId: update.attendanceId,
                    attendanceData: {
                        status: update.status,
                        notes: update.notes
                    }
                })
            );

            await Promise.all(promises);
        } catch (err: any) {
            setError(err.message || 'Failed to update bulk attendance');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        markBulkAttendance,
        updateBulkAttendance,
        loading,
        error
    };
}