/**
 * Files API Service
 * Handles file upload, management, and storage operations
 */

import { apiConfig, PaginatedResponse, QueryParams } from "@/lib/api";
import { apiClient } from "@/lib/api/client";
import { FileUpload } from "@/lib/api/types";

export interface FileFilters {
  mimeType?: string;
  uploadedBy?: string;
  dateRange?: {
    start: number;
    end: number;
  };
  sizeRange?: {
    min: number;
    max: number;
  };
  tags?: string[];
}

export interface FileStats {
  totalFiles: number;
  totalSize: number;
  byType: Record<string, { count: number; size: number }>;
  recentUploads: number;
  storageUsed: number;
  storageLimit: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export class FilesApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = apiConfig.endpoints.files;
  }

  // File upload operations
  async uploadFile(
    file: File,
    options?: {
      folder?: string;
      tags?: string[];
      metadata?: Record<string, any>;
      onProgress?: (progress: UploadProgress) => void;
    },
  ): Promise<FileUpload> {
    const additionalData: Record<string, any> = {};

    if (options?.folder) additionalData.folder = options.folder;
    if (options?.tags) additionalData.tags = JSON.stringify(options.tags);
    if (options?.metadata)
      additionalData.metadata = JSON.stringify(options.metadata);

    const response = await apiClient.upload<FileUpload>(
      `${this.baseUrl}/upload`,
      file,
      additionalData,
      options?.onProgress
        ? (percentage) => {
            options.onProgress!({
              loaded: (percentage / 100) * file.size,
              total: file.size,
              percentage,
            });
          }
        : undefined,
    );

    return response;
  }

  async uploadMultipleFiles(
    files: File[],
    options?: {
      folder?: string;
      tags?: string[];
      metadata?: Record<string, any>;
      onProgress?: (fileIndex: number, progress: UploadProgress) => void;
    },
  ): Promise<FileUpload[]> {
    const uploadPromises = files.map((file, index) =>
      this.uploadFile(file, {
        ...options,
        onProgress: options?.onProgress
          ? (progress) => {
              options.onProgress!(index, progress);
            }
          : undefined,
      }),
    );

    return Promise.all(uploadPromises);
  }

  // File management
  async getFiles(
    params?: QueryParams & FileFilters,
  ): Promise<PaginatedResponse<FileUpload>> {
    const response = await apiClient.get<PaginatedResponse<FileUpload>>(
      `${this.baseUrl}`,
      params,
      { cache: true, cacheTtl: 60000 },
    );
    return response;
  }

  async getFile(fileId: string): Promise<FileUpload> {
    const response = await apiClient.get<FileUpload>(
      `${this.baseUrl}/${fileId}`,
      undefined,
      { cache: true, cacheTtl: 300000 },
    );
    return response;
  }

  async updateFile(
    fileId: string,
    updates: {
      filename?: string;
      tags?: string[];
      metadata?: Record<string, any>;
    },
  ): Promise<FileUpload> {
    const response = await apiClient.patch<FileUpload>(
      `${this.baseUrl}/${fileId}`,
      updates,
    );
    return response;
  }

  async deleteFile(fileId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${fileId}`);
  }

  async deleteFiles(fileIds: string[]): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/bulk`, { fileIds });
  }

  // File operations
  async downloadFile(fileId: string): Promise<Blob> {
    const response = await apiClient.get<Blob>(
      `${this.baseUrl}/${fileId}/download`,
    );
    return response;
  }

  async getFileUrl(
    fileId: string,
    options?: {
      expiresIn?: number;
      download?: boolean;
    },
  ): Promise<{ url: string; expiresAt: number }> {
    const response = await apiClient.get<{ url: string; expiresAt: number }>(
      `${this.baseUrl}/${fileId}/url`,
      options,
    );
    return response;
  }

  async copyFile(fileId: string, destination?: string): Promise<FileUpload> {
    const response = await apiClient.post<FileUpload>(
      `${this.baseUrl}/${fileId}/copy`,
      { destination },
    );
    return response;
  }

  async moveFile(fileId: string, destination: string): Promise<FileUpload> {
    const response = await apiClient.post<FileUpload>(
      `${this.baseUrl}/${fileId}/move`,
      { destination },
    );
    return response;
  }

  // File search and filtering
  async searchFiles(
    query: string,
    filters?: FileFilters,
  ): Promise<FileUpload[]> {
    const response = await apiClient.get<FileUpload[]>(
      `${this.baseUrl}/search`,
      {
        q: query,
        ...filters,
      },
    );
    return response;
  }

  async getFilesByType(mimeType: string): Promise<FileUpload[]> {
    const response = await apiClient.get<FileUpload[]>(
      `${this.baseUrl}/by-type`,
      { mimeType },
      { cache: true, cacheTtl: 300000 },
    );
    return response;
  }

  async getFilesByUser(userId: string): Promise<FileUpload[]> {
    const response = await apiClient.get<FileUpload[]>(
      `${this.baseUrl}/by-user/${userId}`,
      undefined,
      { cache: true, cacheTtl: 300000 },
    );
    return response;
  }

  // File statistics
  async getFileStats(): Promise<FileStats> {
    const response = await apiClient.get<FileStats>(
      `${this.baseUrl}/stats`,
      undefined,
      { cache: true, cacheTtl: 300000 },
    );
    return response;
  }

  // Folder operations
  async createFolder(
    name: string,
    parent?: string,
  ): Promise<{
    id: string;
    name: string;
    path: string;
    parent?: string;
    createdAt: number;
  }> {
    const response = await apiClient.post<{
      id: string;
      name: string;
      path: string;
      parent?: string;
      createdAt: number;
    }>(`${this.baseUrl}/folders`, { name, parent });
    return response;
  }

  async getFolders(parent?: string): Promise<
    Array<{
      id: string;
      name: string;
      path: string;
      parent?: string;
      fileCount: number;
      size: number;
      createdAt: number;
    }>
  > {
    const response = await apiClient.get<
      Array<{
        id: string;
        name: string;
        path: string;
        parent?: string;
        fileCount: number;
        size: number;
        createdAt: number;
      }>
    >(`${this.baseUrl}/folders`, { parent });
    return response;
  }

  async deleteFolder(folderId: string, recursive = false): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/folders/${folderId}`, {
      recursive,
    });
  }

  // File sharing
  async shareFile(
    fileId: string,
    options: {
      expiresAt?: number;
      password?: string;
      allowDownload?: boolean;
      allowView?: boolean;
    },
  ): Promise<{
    shareId: string;
    shareUrl: string;
    expiresAt?: number;
  }> {
    const response = await apiClient.post<{
      shareId: string;
      shareUrl: string;
      expiresAt?: number;
    }>(`${this.baseUrl}/${fileId}/share`, options);
    return response;
  }

  async getSharedFiles(): Promise<
    Array<{
      id: string;
      file: FileUpload;
      shareUrl: string;
      expiresAt?: number;
      accessCount: number;
      createdAt: number;
    }>
  > {
    const response = await apiClient.get<
      Array<{
        id: string;
        file: FileUpload;
        shareUrl: string;
        expiresAt?: number;
        accessCount: number;
        createdAt: number;
      }>
    >(`${this.baseUrl}/shared`);
    return response;
  }

  async revokeShare(shareId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/shared/${shareId}`);
  }

  // File processing
  async processImage(
    fileId: string,
    operations: {
      resize?: { width: number; height: number };
      crop?: { x: number; y: number; width: number; height: number };
      rotate?: number;
      format?: "jpeg" | "png" | "webp";
      quality?: number;
    },
  ): Promise<FileUpload> {
    const response = await apiClient.post<FileUpload>(
      `${this.baseUrl}/${fileId}/process`,
      operations,
    );
    return response;
  }

  async generateThumbnail(
    fileId: string,
    size: { width: number; height: number },
  ): Promise<FileUpload> {
    const response = await apiClient.post<FileUpload>(
      `${this.baseUrl}/${fileId}/thumbnail`,
      size,
    );
    return response;
  }

  // File validation
  async validateFile(file: File): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<{
      isValid: boolean;
      errors: string[];
      warnings: string[];
    }>(`${this.baseUrl}/validate`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }
}

// Export singleton instance
export const filesApi = new FilesApiService();
