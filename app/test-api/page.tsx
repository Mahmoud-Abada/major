"use client";

import { useEffect, useState } from "react";

interface TestResult {
    loading: boolean;
    success: boolean;
    data: any;
    error: string | null;
    requestBody?: any;
}

interface RequestConfig {
    // Single classroom fetch
    classroomId: string;

    // Filters
    status: "archived" | "notArchived" | "all";

    // Pagination
    classroomPagination: {
        enabled: boolean;
        numItems: number;
        cursor: string;
    };

    groupPagination: {
        enabled: boolean;
        numItems: number;
        cursor: string;
    };

    // User context
    fetchBy: {
        enabled: boolean;
        userType: "school" | "teacher" | "student";
        userId: string;
    };
}

export default function TestApiPage() {
    const [mounted, setMounted] = useState(false);
    const [result, setResult] = useState<TestResult>({
        loading: false,
        success: false,
        data: null,
        error: null,
    });

    const [config, setConfig] = useState<RequestConfig>({
        classroomId: "",
        status: "notArchived",
        classroomPagination: {
            enabled: true,
            numItems: 10,
            cursor: "",
        },
        groupPagination: {
            enabled: false,
            numItems: 5,
            cursor: "",
        },
        fetchBy: {
            enabled: false,
            userType: "school",
            userId: "",
        },
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    const buildRequestBody = () => {
        const body: any = {};

        // Single classroom fetch (takes priority)
        if (config.classroomId.trim()) {
            body.classroomId = config.classroomId.trim();
            // When classroomId is provided, other params are ignored by backend
            return body;
        }

        // Status filter
        body.status = config.status;

        // Classroom pagination
        if (config.classroomPagination.enabled) {
            body.pagination = {
                numItems: config.classroomPagination.numItems,
                cursor: config.classroomPagination.cursor.trim() || null,
            };
        }

        // Group pagination
        if (config.groupPagination.enabled) {
            body.groupPagination = {
                numItems: config.groupPagination.numItems,
                cursor: config.groupPagination.cursor.trim() || null,
            };
        }

        // User context override
        if (config.fetchBy.enabled) {
            body.fetchBy = {
                userType: config.fetchBy.userType,
            };
            if (config.fetchBy.userId.trim()) {
                body.fetchBy.userId = config.fetchBy.userId.trim();
            }
        }

        return body;
    };

    const testAPI = async () => {
        console.log("🧪 Testing API with current configuration...");
        setResult({ loading: true, success: false, data: null, error: null });

        try {
            // Get token from session storage
            const token = sessionStorage.getItem("access_token");
            console.log("🔑 Token found:", token ? "Yes" : "No");

            const headers: Record<string, string> = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const requestBody = buildRequestBody();
            console.log("📤 Request body:", requestBody);

            const response = await fetch("http://127.0.0.1:3001/classroom/get-classrooms", {
                method: "POST",
                headers,
                body: JSON.stringify(requestBody),
            });

            console.log("📥 Response Status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${response.statusText}\n${errorText}`);
            }

            const data = await response.json();
            console.log("📊 Response Data:", data);

            setResult({
                loading: false,
                success: true,
                data: data,
                error: null,
                requestBody,
            });
        } catch (error) {
            console.error("❌ API Error:", error);
            setResult({
                loading: false,
                success: false,
                data: null,
                error: error instanceof Error ? error.message : String(error),
                requestBody: buildRequestBody(),
            });
        }
    };

    const loadPreset = (preset: string) => {
        switch (preset) {
            case "single-classroom":
                setConfig({
                    ...config,
                    classroomId: "jx71q0n4aqay2tf5gkg563m8017newny",
                });
                break;
            case "jwt-user-classrooms":
                setConfig({
                    ...config,
                    classroomId: "",
                    status: "notArchived",
                    classroomPagination: { enabled: true, numItems: 10, cursor: "" },
                    groupPagination: { enabled: true, numItems: 0, cursor: "" }, // Include groupPagination for school users
                    fetchBy: { enabled: false, userType: "school", userId: "" },
                });
                break;
            case "jwt-user-with-groups":
                setConfig({
                    ...config,
                    classroomId: "",
                    status: "notArchived",
                    classroomPagination: { enabled: true, numItems: 10, cursor: "" },
                    groupPagination: { enabled: true, numItems: 5, cursor: "" },
                    fetchBy: { enabled: false, userType: "school", userId: "" },
                });
                break;
            case "specific-school":
                setConfig({
                    ...config,
                    classroomId: "",
                    status: "all",
                    classroomPagination: { enabled: true, numItems: 15, cursor: "" },
                    groupPagination: { enabled: true, numItems: 10, cursor: "" },
                    fetchBy: { enabled: true, userType: "school", userId: "md7dbyrjq6dx8fjqg4gdb6x5j57ncz0d" },
                });
                break;
            case "specific-teacher":
                setConfig({
                    ...config,
                    classroomId: "",
                    status: "notArchived",
                    classroomPagination: { enabled: true, numItems: 20, cursor: "" },
                    groupPagination: { enabled: false, numItems: 5, cursor: "" }, // Teachers don't use groups
                    fetchBy: { enabled: true, userType: "teacher", userId: "teacher_id_example" },
                });
                break;
            case "specific-student":
                setConfig({
                    ...config,
                    classroomId: "",
                    status: "notArchived",
                    classroomPagination: { enabled: true, numItems: 10, cursor: "" },
                    groupPagination: { enabled: true, numItems: 10, cursor: "" },
                    fetchBy: { enabled: true, userType: "student", userId: "student_id_example" },
                });
                break;
            case "archived-only":
                setConfig({
                    ...config,
                    classroomId: "",
                    status: "archived",
                    classroomPagination: { enabled: true, numItems: 10, cursor: "" },
                    groupPagination: { enabled: true, numItems: 5, cursor: "" },
                    fetchBy: { enabled: false, userType: "school", userId: "" },
                });
                break;
            case "force-school-user":
                setConfig({
                    ...config,
                    classroomId: "",
                    status: "notArchived",
                    classroomPagination: { enabled: true, numItems: 10, cursor: "" },
                    groupPagination: { enabled: true, numItems: 5, cursor: "" },
                    fetchBy: { enabled: true, userType: "school", userId: "jh7asvyqmw13pr8xc3cf89pvq57nag7c" }, // Use JWT user ID explicitly
                });
                break;
        }
    };

    if (!mounted) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: "20px", fontFamily: "monospace", maxWidth: "1200px" }}>
            <h1>Comprehensive API Test Page</h1>

            {/* Presets */}
            <div style={{ marginBottom: "30px", padding: "15px", border: "2px solid #007bff", borderRadius: "8px" }}>
                <h2>Quick Presets</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    <button onClick={() => loadPreset("single-classroom")} style={buttonStyle("#007bff")}>
                        Single Classroom
                    </button>
                    <button onClick={() => loadPreset("jwt-user-classrooms")} style={buttonStyle("#28a745")}>
                        JWT User (Classrooms Only)
                    </button>
                    <button onClick={() => loadPreset("jwt-user-with-groups")} style={buttonStyle("#28a745")}>
                        JWT User (With Groups)
                    </button>
                    <button onClick={() => loadPreset("specific-school")} style={buttonStyle("#ffc107")}>
                        Specific School
                    </button>
                    <button onClick={() => loadPreset("specific-teacher")} style={buttonStyle("#fd7e14")}>
                        Specific Teacher
                    </button>
                    <button onClick={() => loadPreset("specific-student")} style={buttonStyle("#6f42c1")}>
                        Specific Student
                    </button>
                    <button onClick={() => loadPreset("archived-only")} style={buttonStyle("#6c757d")}>
                        Archived Only
                    </button>
                    <button onClick={() => loadPreset("force-school-user")} style={buttonStyle("#dc3545")}>
                        Force School User
                    </button>
                </div>
            </div>

            {/* Configuration Form */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>

                {/* Left Column */}
                <div>
                    {/* Single Classroom */}
                    <div style={sectionStyle}>
                        <h3>Single Classroom Fetch (Priority)</h3>
                        <label>
                            Classroom ID:
                            <input
                                type="text"
                                value={config.classroomId}
                                onChange={(e) => setConfig({ ...config, classroomId: e.target.value })}
                                placeholder="e.g., jx71q0n4aqay2tf5gkg563m8017newny"
                                style={inputStyle}
                            />
                        </label>
                        <small style={{ color: "#666", display: "block", marginTop: "5px" }}>
                            If provided, all other parameters are ignored
                        </small>
                    </div>

                    {/* Status Filter */}
                    <div style={sectionStyle}>
                        <h3>Status Filter</h3>
                        <select
                            value={config.status}
                            onChange={(e) => setConfig({ ...config, status: e.target.value as any })}
                            style={inputStyle}
                        >
                            <option value="notArchived">Not Archived (Active)</option>
                            <option value="archived">Archived Only</option>
                            <option value="all">All (Active + Archived)</option>
                        </select>
                    </div>

                    {/* Classroom Pagination */}
                    <div style={sectionStyle}>
                        <h3>Classroom Pagination</h3>
                        <label>
                            <input
                                type="checkbox"
                                checked={config.classroomPagination.enabled}
                                onChange={(e) => setConfig({
                                    ...config,
                                    classroomPagination: { ...config.classroomPagination, enabled: e.target.checked }
                                })}
                            />
                            Enable Classroom Pagination
                        </label>
                        {config.classroomPagination.enabled && (
                            <div style={{ marginTop: "10px" }}>
                                <label>
                                    Number of Items:
                                    <input
                                        type="number"
                                        value={config.classroomPagination.numItems}
                                        onChange={(e) => setConfig({
                                            ...config,
                                            classroomPagination: { ...config.classroomPagination, numItems: parseInt(e.target.value) || 0 }
                                        })}
                                        style={inputStyle}
                                        min="0"
                                    />
                                </label>
                                <label>
                                    Cursor (for next page):
                                    <input
                                        type="text"
                                        value={config.classroomPagination.cursor}
                                        onChange={(e) => setConfig({
                                            ...config,
                                            classroomPagination: { ...config.classroomPagination, cursor: e.target.value }
                                        })}
                                        placeholder="Leave empty for first page"
                                        style={inputStyle}
                                    />
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div>
                    {/* Group Pagination */}
                    <div style={sectionStyle}>
                        <h3>Group Pagination</h3>
                        <label>
                            <input
                                type="checkbox"
                                checked={config.groupPagination.enabled}
                                onChange={(e) => setConfig({
                                    ...config,
                                    groupPagination: { ...config.groupPagination, enabled: e.target.checked }
                                })}
                            />
                            Enable Group Pagination
                        </label>
                        <small style={{ color: "#666", display: "block", marginTop: "5px" }}>
                            Only used by School and Student users (ignored by Teachers)
                        </small>
                        {config.groupPagination.enabled && (
                            <div style={{ marginTop: "10px" }}>
                                <label>
                                    Number of Items:
                                    <input
                                        type="number"
                                        value={config.groupPagination.numItems}
                                        onChange={(e) => setConfig({
                                            ...config,
                                            groupPagination: { ...config.groupPagination, numItems: parseInt(e.target.value) || 0 }
                                        })}
                                        style={inputStyle}
                                        min="0"
                                    />
                                </label>
                                <label>
                                    Cursor (for next page):
                                    <input
                                        type="text"
                                        value={config.groupPagination.cursor}
                                        onChange={(e) => setConfig({
                                            ...config,
                                            groupPagination: { ...config.groupPagination, cursor: e.target.value }
                                        })}
                                        placeholder="Leave empty for first page"
                                        style={inputStyle}
                                    />
                                </label>
                            </div>
                        )}
                    </div>

                    {/* User Context Override */}
                    <div style={sectionStyle}>
                        <h3>User Context Override</h3>
                        <label>
                            <input
                                type="checkbox"
                                checked={config.fetchBy.enabled}
                                onChange={(e) => setConfig({
                                    ...config,
                                    fetchBy: { ...config.fetchBy, enabled: e.target.checked }
                                })}
                            />
                            Override User Context
                        </label>
                        <small style={{ color: "#666", display: "block", marginTop: "5px" }}>
                            If disabled, uses user from JWT token
                        </small>
                        {config.fetchBy.enabled && (
                            <div style={{ marginTop: "10px" }}>
                                <label>
                                    User Type:
                                    <select
                                        value={config.fetchBy.userType}
                                        onChange={(e) => setConfig({
                                            ...config,
                                            fetchBy: { ...config.fetchBy, userType: e.target.value as any }
                                        })}
                                        style={inputStyle}
                                    >
                                        <option value="school">School</option>
                                        <option value="teacher">Teacher</option>
                                        <option value="student">Student</option>
                                    </select>
                                </label>
                                <label>
                                    User ID:
                                    <input
                                        type="text"
                                        value={config.fetchBy.userId}
                                        onChange={(e) => setConfig({
                                            ...config,
                                            fetchBy: { ...config.fetchBy, userId: e.target.value }
                                        })}
                                        placeholder="Leave empty to use userType with JWT user ID"
                                        style={inputStyle}
                                    />
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Test Button */}
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <button
                    onClick={testAPI}
                    disabled={result.loading}
                    style={{
                        padding: "15px 30px",
                        fontSize: "18px",
                        backgroundColor: result.loading ? "#6c757d" : "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: result.loading ? "not-allowed" : "pointer",
                        fontWeight: "bold"
                    }}
                >
                    {result.loading ? "Testing..." : "🚀 Test API"}
                </button>
            </div>

            {/* Request Preview */}
            <div style={sectionStyle}>
                <h3>Request Preview</h3>
                <pre style={{
                    backgroundColor: "#f8f9fa",
                    padding: "15px",
                    borderRadius: "4px",
                    overflow: "auto",
                    fontSize: "14px",
                    border: "1px solid #dee2e6"
                }}>
                    {JSON.stringify(buildRequestBody(), null, 2)}
                </pre>
            </div>

            {/* Results */}
            <div style={sectionStyle}>
                <h2>Results</h2>
                <div>
                    <strong>Status:</strong> {
                        result.loading ? "LOADING..." :
                            result.success ? "SUCCESS ✅" :
                                result.error ? "ERROR ❌" : "NOT TESTED"
                    }
                </div>

                {result.error && (
                    <div style={{ color: "red", marginTop: "15px", padding: "10px", backgroundColor: "#f8d7da", borderRadius: "4px" }}>
                        <strong>Error:</strong>
                        <pre style={{ marginTop: "10px", whiteSpace: "pre-wrap" }}>{result.error}</pre>
                    </div>
                )}

                {result.success && result.data && (
                    <div style={{ marginTop: "15px" }}>
                        <div style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#d4edda", borderRadius: "4px" }}>
                            <strong>Data Summary:</strong>
                            <ul style={{ marginTop: "10px" }}>
                                <li>Response Keys: {Object.keys(result.data).join(", ")}</li>
                                <li>Status: {result.data.status}</li>
                                <li>Message: {result.data.message || "N/A"}</li>
                                {result.data.data && <li>Classrooms Count: {result.data.data.length}</li>}
                                {result.data.groups && <li>Groups Count: {result.data.groups.length}</li>}
                                {result.data.pagination && <li>Has Pagination: Yes</li>}
                                {result.data.groupPagination && <li>Has Group Pagination: Yes</li>}
                            </ul>
                        </div>

                        <details>
                            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>Raw Response Data</summary>
                            <pre style={{
                                backgroundColor: "#f8f9fa",
                                padding: "15px",
                                borderRadius: "4px",
                                overflow: "auto",
                                maxHeight: "400px",
                                fontSize: "12px",
                                marginTop: "10px"
                            }}>
                                {JSON.stringify(result.data, null, 2)}
                            </pre>
                        </details>
                    </div>
                )}
            </div>

            {/* Debug Info */}
            <div style={{ padding: "15px", backgroundColor: "#e9ecef", borderRadius: "4px", marginTop: "20px" }}>
                <h3>Debug Information</h3>
                <ul>
                    <li>Environment: {process.env.NODE_ENV}</li>
                    <li>API URL: http://127.0.0.1:3001/classroom</li>
                    <li>Window Available: {typeof window !== 'undefined' ? "Yes" : "No"}</li>
                    <li>Fetch Available: {typeof fetch !== 'undefined' ? "Yes" : "No"}</li>
                    <li>Token Available: {typeof window !== 'undefined' && sessionStorage.getItem("access_token") ? "Yes" : "No"}</li>
                </ul>
            </div>
        </div>
    );
}

// Styles
const buttonStyle = (color: string) => ({
    padding: "8px 16px",
    backgroundColor: color,
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px"
});

const sectionStyle = {
    marginBottom: "20px",
    padding: "15px",
    border: "1px solid #dee2e6",
    borderRadius: "8px",
    backgroundColor: "#ffffff"
};

const inputStyle = {
    width: "100%",
    padding: "8px",
    marginTop: "5px",
    marginBottom: "10px",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "14px"
};