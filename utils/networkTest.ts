/**
 * Network connectivity test utilities
 */

export const testNetworkConnectivity = async () => {
    console.log("🌐 Network Test - Starting connectivity tests");

    const tests = [
        {
            name: "Classroom API Health Check",
            url: `${process.env.NEXT_PUBLIC_CLASSROOM_API_URL || "http://127.0.0.1:3001/classroom"}/health`,
            method: "GET"
        },
        {
            name: "Classroom API Base",
            url: process.env.NEXT_PUBLIC_CLASSROOM_API_URL || "http://127.0.0.1:3001/classroom",
            method: "GET"
        },
        {
            name: "Users API Base",
            url: process.env.NEXT_PUBLIC_USERS_API_URL || "http://localhost:3000/users",
            method: "GET"
        }
    ];

    const results = [];

    for (const test of tests) {
        console.log(`🔍 Network Test - Testing ${test.name}: ${test.url}`);

        try {
            const startTime = Date.now();
            const response = await fetch(test.url, {
                method: test.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                // Short timeout for connectivity test
                signal: AbortSignal.timeout(5000)
            });

            const endTime = Date.now();
            const duration = endTime - startTime;

            const result = {
                name: test.name,
                url: test.url,
                success: true,
                status: response.status,
                statusText: response.statusText,
                duration: `${duration}ms`,
                headers: Object.fromEntries(response.headers.entries())
            };

            console.log(`✅ Network Test - ${test.name} successful:`, result);
            results.push(result);

        } catch (error) {
            const result = {
                name: test.name,
                url: test.url,
                success: false,
                error: error instanceof Error ? error.message : String(error),
                errorName: error instanceof Error ? error.name : 'Unknown'
            };

            console.error(`❌ Network Test - ${test.name} failed:`, result);
            results.push(result);
        }
    }

    console.log("🏁 Network Test - All tests completed:", results);
    return results;
};

export const testSpecificEndpoint = async (url: string, method: string = 'GET', body?: any) => {
    console.log(`🎯 Endpoint Test - Testing ${method} ${url}`);

    try {
        const options: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            signal: AbortSignal.timeout(10000)
        };

        if (body && method !== 'GET') {
            options.body = JSON.stringify(body);
        }

        const startTime = Date.now();
        const response = await fetch(url, options);
        const endTime = Date.now();

        let responseData;
        try {
            responseData = await response.text();
            if (responseData) {
                responseData = JSON.parse(responseData);
            }
        } catch (parseError) {
            // Keep as text if not JSON
        }

        const result = {
            success: response.ok,
            status: response.status,
            statusText: response.statusText,
            duration: `${endTime - startTime}ms`,
            headers: Object.fromEntries(response.headers.entries()),
            data: responseData
        };

        console.log(`${response.ok ? '✅' : '❌'} Endpoint Test - Result:`, result);
        return result;

    } catch (error) {
        const result = {
            success: false,
            error: error instanceof Error ? error.message : String(error),
            errorName: error instanceof Error ? error.name : 'Unknown'
        };

        console.error(`❌ Endpoint Test - Failed:`, result);
        return result;
    }
};