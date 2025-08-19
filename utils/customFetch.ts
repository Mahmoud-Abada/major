/**
 * Custom fetch implementation that handles SSR and AbortController issues
 */

// Custom fetch function that works in both SSR and client environments
export const customFetch: typeof fetch = async (input, init) => {
    console.log('🔧 Custom fetch called with:', {
        input: typeof input === 'string' ? input : input.url,
        method: init?.method || 'GET',
        headers: init?.headers ? Object.fromEntries(new Headers(init.headers).entries()) : {},
        hasBody: !!init?.body,
        bodyType: init?.body ? typeof init.body : 'none'
    });

    // On server side, return a rejected promise to skip the request
    if (typeof window === 'undefined') {
        console.log('🚫 SSR detected, skipping fetch request');
        throw new Error('SSR: Skipping fetch request');
    }

    // Check if fetch is available
    if (!window.fetch) {
        console.error('💥 window.fetch is not available');
        throw new Error('Fetch API not available');
    }

    try {
        // Remove the signal from init to avoid AbortController issues for debugging
        const { signal, ...fetchInit } = init || {};

        console.log('🚀 Making fetch request:', {
            url: typeof input === 'string' ? input : input.url,
            method: fetchInit.method || 'GET',
            hasSignal: !!signal,
            fetchInitKeys: Object.keys(fetchInit)
        });

        const startTime = Date.now();
        const response = await window.fetch(input, fetchInit);
        const endTime = Date.now();

        console.log('✅ Fetch request completed:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            duration: `${endTime - startTime}ms`,
            headers: Object.fromEntries(response.headers.entries()),
            url: response.url
        });

        // Clone response to read body for logging without consuming it
        const responseClone = response.clone();
        try {
            const responseText = await responseClone.text();
            console.log('📥 Response body preview:', responseText.substring(0, 500) + (responseText.length > 500 ? '...' : ''));
        } catch (bodyError) {
            console.log('⚠️ Could not read response body for logging:', bodyError);
        }

        return response;
    } catch (error) {
        console.error('💥 Custom fetch error:', {
            error: error,
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            name: error instanceof Error ? error.name : 'Unknown',
            input: typeof input === 'string' ? input : input.url
        });
        throw error;
    }
};