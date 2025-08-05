/**
 * Enhanced API Client
 * Centralized HTTP client with interceptors, caching, and error handling
 */

import { AuthService } from '@/services/base/AuthService';
import { ErrorHandler } from '@/services/base/ErrorHandler';
import { apiConfig, QueryParams } from './index';
import { requestInterceptor, responseInterceptor } from './interceptors';

export class ApiClient {
    private static instance: ApiClient;
    private authService: AuthService;
    private errorHandler: ErrorHandler;
    private cache: Map<string, { data: any; timestamp: number; ttl: number }>;

    private constructor() {
        this.authService = AuthService.getInstance();
        this.errorHandler = ErrorHandler.getInstance();
        this.cache = new Map();
    }

    public static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    private generateCacheKey(url: string, options?: RequestInit): string {
        const method = options?.method || 'GET';
        const body = options?.body || '';
        return `${method}:${url}:${body}`;
    }

    private getCachedData<T>(key: string): T | null {
        const cached = this.cache.get(key);
        if (!cached) return null;

        const isExpired = Date.now() - cached.timestamp > cached.ttl;
        if (isExpired) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }

    private setCachedData(key: string, data: any, ttl: number = 300000): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl,
        });
    }

    private async makeRequest<T>(
        url: string,
        options: RequestInit & { cache?: boolean; cacheTtl?: number } = {}
    ): Promise<T> {
        const { cache = false, cacheTtl = 300000, ...requestOptions } = options;

        // Check cache for GET requests
        if (cache && (!requestOptions.method || requestOptions.method === 'GET')) {
            const cacheKey = this.generateCacheKey(url, requestOptions);
            const cachedData = this.getCachedData<T>(cacheKey);
            if (cachedData) {
                return cachedData;
            }
        }

        try {
            // Apply request interceptor
            const interceptedOptions = await requestInterceptor(requestOptions);

            // Add authentication header
            const token = this.authService.getToken();
            const headers = new Headers(interceptedOptions.headers);

            if (token && !this.authService.isTokenExpired(token)) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);

            const response = await fetch(url, {
                ...interceptedOptions,
                headers,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            // Apply response interceptor
            const interceptedResponse = await responseInterceptor(response);

            // Cache successful GET responses
            if (cache && (!requestOptions.method || requestOptions.method === 'GET') && response.ok) {
                const cacheKey = this.generateCacheKey(url, requestOptions);
                this.setCachedData(cacheKey, interceptedResponse, cacheTtl);
            }

            return interceptedResponse;
        } catch (error) {
            // Handle and transform error
            const appError = this.errorHandler.handleError(error);
            throw appError;
        }
    }

    // HTTP Methods
    public async get<T>(
        endpoint: string,
        params?: QueryParams,
        options?: { cache?: boolean; cacheTtl?: number }
    ): Promise<T> {
        const url = new URL(endpoint, apiConfig.baseUrl);

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, String(value));
                }
            });
        }

        return this.makeRequest<T>(url.toString(), {
            method: 'GET',
            ...options,
        });
    }

    public async post<T>(
        endpoint: string,
        data?: any,
        options?: RequestInit
    ): Promise<T> {
        const url = new URL(endpoint, apiConfig.baseUrl);

        return this.makeRequest<T>(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        });
    }

    public async put<T>(
        endpoint: string,
        data?: any,
        options?: RequestInit
    ): Promise<T> {
        const url = new URL(endpoint, apiConfig.baseUrl);

        return this.makeRequest<T>(url.toString(), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        });
    }

    public async patch<T>(
        endpoint: string,
        data?: any,
        options?: RequestInit
    ): Promise<T> {
        const url = new URL(endpoint, apiConfig.baseUrl);

        return this.makeRequest<T>(url.toString(), {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        });
    }

    public async delete<T>(
        endpoint: string,
        data?: any,
        options?: RequestInit
    ): Promise<T> {
        const url = new URL(endpoint, apiConfig.baseUrl);

        return this.makeRequest<T>(url.toString(), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        });
    }

    // File upload method
    public async upload<T>(
        endpoint: string,
        file: File,
        additionalData?: Record<string, any>,
        onProgress?: (progress: number) => void
    ): Promise<T> {
        const url = new URL(endpoint, apiConfig.baseUrl);
        const formData = new FormData();

        formData.append('file', file);

        if (additionalData) {
            Object.entries(additionalData).forEach(([key, value]) => {
                formData.append(key, String(value));
            });
        }

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // Add auth header
            const token = this.authService.getToken();
            if (token && !this.authService.isTokenExpired(token)) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }

            // Progress tracking
            if (onProgress) {
                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        const progress = (event.loaded / event.total) * 100;
                        onProgress(progress);
                    }
                });
            }

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (error) {
                        reject(new Error('Invalid JSON response'));
                    }
                } else {
                    reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Upload failed'));
            });

            xhr.open('POST', url.toString());
            xhr.send(formData);
        });
    }

    // Batch requests
    public async batch<T>(
        requests: Array<{
            endpoint: string;
            method?: string;
            data?: any;
        }>
    ): Promise<T[]> {
        const promises = requests.map(({ endpoint, method = 'GET', data }) => {
            switch (method.toUpperCase()) {
                case 'POST':
                    return this.post(endpoint, data);
                case 'PUT':
                    return this.put(endpoint, data);
                case 'PATCH':
                    return this.patch(endpoint, data);
                case 'DELETE':
                    return this.delete(endpoint, data);
                default:
                    return this.get(endpoint, data);
            }
        });

        return Promise.all(promises);
    }

    // Cache management
    public clearCache(pattern?: string): void {
        if (!pattern) {
            this.cache.clear();
            return;
        }

        const keysToDelete = Array.from(this.cache.keys()).filter(key =>
            key.includes(pattern)
        );

        keysToDelete.forEach(key => this.cache.delete(key));
    }

    public getCacheSize(): number {
        return this.cache.size;
    }

    // Health check
    public async healthCheck(): Promise<{ status: string; timestamp: number }> {
        try {
            const response = await this.get<{ status: string }>('/health');
            return {
                status: response.status || 'ok',
                timestamp: Date.now(),
            };
        } catch (error) {
            return {
                status: 'error',
                timestamp: Date.now(),
            };
        }
    }
}

// Export singleton instance
export const apiClient = ApiClient.getInstance();