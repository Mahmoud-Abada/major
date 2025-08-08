/**
 * Base API Service
 * Common functionality for all API services
 */

import { fetchWithConfig, RequestConfig, tokenManager } from '../../lib/api-utils';
import { ErrorHandler } from './ErrorHandler';

export interface ApiServiceConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export abstract class ApiService {
  protected baseUrl: string;
  protected timeout: number;
  protected retries: number;
  protected retryDelay: number;
  protected errorHandler: ErrorHandler;

  constructor(config: ApiServiceConfig) {
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout || 30000;
    this.retries = config.retries || 3;
    this.retryDelay = config.retryDelay || 1000;
    this.errorHandler = ErrorHandler.getInstance();
  }

  protected async request<T>(
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = tokenManager.getToken();

    const config: RequestConfig = {
      timeout: this.timeout,
      retries: this.retries,
      retryDelay: this.retryDelay,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetchWithConfig(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      const appError = this.errorHandler.handleError(error);
      this.errorHandler.logError(appError);
      throw error;
    }
  }

  protected async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(endpoint, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return this.request<T>(url.pathname + url.search, { method: 'GET' });
  }

  protected async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  protected async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  protected async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  protected async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}