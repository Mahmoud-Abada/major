"use client";

import { useGetClassroomsQuery } from "@/store/api/classroomApi";
import { useGetGroupsQuery } from "@/store/api/groupApi";
import { useEffect, useState } from "react";

export function ApiTest() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Test classroom API
    const {
        data: classroomsData,
        isLoading: classroomsLoading,
        error: classroomsError,
    } = useGetClassroomsQuery(
        mounted
            ? {
                status: "notArchived",
                pagination: { numItems: 5, cursor: null },
                fetchBy: { userType: "teacher" },
            }
            : { skip: true } as any
    );

    // Test groups API
    const {
        data: groupsData,
        isLoading: groupsLoading,
        error: groupsError,
    } = useGetGroupsQuery(
        mounted
            ? {
                status: "notArchived",
                pagination: { numItems: 5, cursor: null },
                fetchBy: { userType: "teacher" },
            }
            : { skip: true } as any
    );

    if (!mounted) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 border rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">API Debug Test</h3>

            {/* Classrooms Test */}
            <div className="space-y-2">
                <h4 className="font-medium">Classrooms API:</h4>
                <div className="text-sm">
                    <div>Loading: {classroomsLoading ? "Yes" : "No"}</div>
                    <div>Error: {classroomsError ? JSON.stringify(classroomsError, null, 2) : "None"}</div>
                    <div>Data: {classroomsData ? `${classroomsData.data?.length || 0} items` : "None"}</div>
                </div>
            </div>

            {/* Groups Test */}
            <div className="space-y-2">
                <h4 className="font-medium">Groups API:</h4>
                <div className="text-sm">
                    <div>Loading: {groupsLoading ? "Yes" : "No"}</div>
                    <div>Error: {groupsError ? JSON.stringify(groupsError, null, 2) : "None"}</div>
                    <div>Data: {groupsData ? `${groupsData.data?.length || 0} items` : "None"}</div>
                </div>
            </div>

            {/* Raw Data Display */}
            {classroomsData && (
                <details className="space-y-2">
                    <summary className="font-medium cursor-pointer">Classrooms Raw Data</summary>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                        {JSON.stringify(classroomsData, null, 2)}
                    </pre>
                </details>
            )}

            {groupsData && (
                <details className="space-y-2">
                    <summary className="font-medium cursor-pointer">Groups Raw Data</summary>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                        {JSON.stringify(groupsData, null, 2)}
                    </pre>
                </details>
            )}
        </div>
    );
}