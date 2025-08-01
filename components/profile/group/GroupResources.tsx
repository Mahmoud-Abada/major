import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, Filter, Search, Upload } from "lucide-react";
import { ProfileTable, TableColumn } from "../ProfileTable";

interface Resource {
  id: string;
  title: string;
  description?: string;
  type: string;
  url?: string;
  fileSize?: number;
  fileType?: string;
  uploadedBy: {
    name: string;
    id: string;
    role: string;
  };
  uploadedAt: string;
  tags: string[];
  isShared: boolean;
}

interface GroupResourcesProps {
  resources: Resource[];
  resourceTypes: string[];
  onViewResource?: (resourceId: string) => void;
  onDownloadResource?: (url: string) => void;
  onUploadResource?: () => void;
  onFilterChange?: (type: string) => void;
}

export function GroupResources({
  resources,
  resourceTypes,
  onViewResource,
  onDownloadResource,
  onUploadResource,
  onFilterChange,
}: GroupResourcesProps) {
  const columns: TableColumn[] = [
    {
      header: "Title",
      accessorKey: "title",
      cell: (value, row) => (
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-md bg-primary/10 text-primary">
            {getResourceIcon(row.type)}
          </div>
          <div>
            <div className="font-medium">{value}</div>
            {row.description && (
              <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                {row.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Type",
      accessorKey: "type",
    },
    {
      header: "Size",
      accessorKey: "fileSize",
      cell: (value) => {
        if (!value) return "N/A";
        if (value < 1024) return `${value} B`;
        if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
        return `${(value / (1024 * 1024)).toFixed(1)} MB`;
      },
    },
    {
      header: "Uploaded By",
      accessorKey: "uploadedBy",
      cell: (value) => (
        <a
          href={`/classroom/${value.role}s/${value.id}`}
          className="hover:underline"
        >
          {value.name}
        </a>
      ),
    },
    {
      header: "Uploaded At",
      accessorKey: "uploadedAt",
      cell: (value) => new Date(value).toLocaleDateString(),
    },
    {
      header: "Shared",
      accessorKey: "isShared",
      cell: (value) =>
        value ? (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
            Yes
          </span>
        ) : (
          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
            No
          </span>
        ),
    },
  ];

  // Helper function to get icon based on resource type
  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "document":
        return <FileText className="h-4 w-4" />;
      case "presentation":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-presentation"
          >
            <path d="M2 3h20" />
            <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
            <path d="m7 21 5-5 5 5" />
          </svg>
        );
      case "video":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-video"
          >
            <path d="m22 8-6 4 6 4V8Z" />
            <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
          </svg>
        );
      case "image":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-image"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        );
      case "link":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-link"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        );
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Group resources by type for summary
  const resourcesByType = resources.reduce(
    (acc, resource) => {
      acc[resource.type] = (acc[resource.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Calculate total size of all resources
  const totalSize = resources.reduce(
    (sum, resource) => sum + (resource.fileSize || 0),
    0,
  );

  // Format total size
  const formatTotalSize = () => {
    if (totalSize < 1024) return `${totalSize} B`;
    if (totalSize < 1024 * 1024) return `${(totalSize / 1024).toFixed(1)} KB`;
    if (totalSize < 1024 * 1024 * 1024)
      return `${(totalSize / (1024 * 1024)).toFixed(1)} MB`;
    return `${(totalSize / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  // Group resources by tags
  const resourceTags = resources.reduce((tags, resource) => {
    resource.tags.forEach((tag) => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
    return tags;
  }, [] as string[]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-semibold">Group Resources</h3>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              className="pl-8 w-full sm:w-[200px]"
            />
          </div>

          <div className="flex items-center gap-2">
            {onFilterChange && (
              <Select onValueChange={onFilterChange}>
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Types" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {resourceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {onUploadResource && (
              <Button onClick={onUploadResource}>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm font-medium text-muted-foreground">
                Total Resources
              </div>
            </div>
            <div className="text-2xl font-bold mt-1">{resources.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-hard-drive h-4 w-4 text-muted-foreground"
              >
                <line x1="22" x2="2" y1="12" y2="12" />
                <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                <line x1="6" x2="6.01" y1="16" y2="16" />
                <line x1="10" x2="10.01" y1="16" y2="16" />
              </svg>
              <div className="text-sm font-medium text-muted-foreground">
                Total Size
              </div>
            </div>
            <div className="text-2xl font-bold mt-1">{formatTotalSize()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-share h-4 w-4 text-muted-foreground"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" x2="12" y1="2" y2="15" />
              </svg>
              <div className="text-sm font-medium text-muted-foreground">
                Shared
              </div>
            </div>
            <div className="text-2xl font-bold mt-1">
              {resources.filter((r) => r.isShared).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-tag h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                <path d="M7 7h.01" />
              </svg>
              <div className="text-sm font-medium text-muted-foreground">
                Tags
              </div>
            </div>
            <div className="text-2xl font-bold mt-1">{resourceTags.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(resourcesByType).map(([type, count]) => (
          <Card key={type}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                {getResourceIcon(type)}
                <div className="text-sm font-medium text-muted-foreground">
                  {type}
                </div>
              </div>
              <div className="text-2xl font-bold mt-1">{count}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round((count / resources.length) * 100)}% of resources
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all">
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">
            All Resources
          </TabsTrigger>
          <TabsTrigger value="shared" className="flex-1">
            Shared Resources
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex-1">
            Recently Added
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ProfileTable
            columns={columns}
            data={resources}
            onRowClick={
              onViewResource ? (row) => onViewResource(row.id) : undefined
            }
            actions={(row) => (
              <div className="flex space-x-2">
                {row.url && onDownloadResource && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDownloadResource(row.url!)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                )}
              </div>
            )}
            emptyState={
              <div className="text-center py-8">
                <p className="text-muted-foreground">No resources found</p>
                {onUploadResource && (
                  <Button className="mt-4" size="sm" onClick={onUploadResource}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Resource
                  </Button>
                )}
              </div>
            }
          />
        </TabsContent>

        <TabsContent value="shared">
          <ProfileTable
            columns={columns}
            data={resources.filter((r) => r.isShared)}
            onRowClick={
              onViewResource ? (row) => onViewResource(row.id) : undefined
            }
            actions={(row) => (
              <div className="flex space-x-2">
                {row.url && onDownloadResource && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDownloadResource(row.url!)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                )}
              </div>
            )}
            emptyState={
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No shared resources found
                </p>
              </div>
            }
          />
        </TabsContent>

        <TabsContent value="recent">
          <ProfileTable
            columns={columns}
            data={[...resources]
              .sort(
                (a, b) =>
                  new Date(b.uploadedAt).getTime() -
                  new Date(a.uploadedAt).getTime(),
              )
              .slice(0, 10)}
            onRowClick={
              onViewResource ? (row) => onViewResource(row.id) : undefined
            }
            actions={(row) => (
              <div className="flex space-x-2">
                {row.url && onDownloadResource && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDownloadResource(row.url!)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                )}
              </div>
            )}
            emptyState={
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No recent resources found
                </p>
                {onUploadResource && (
                  <Button className="mt-4" size="sm" onClick={onUploadResource}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Resource
                  </Button>
                )}
              </div>
            }
          />
        </TabsContent>
      </Tabs>

      {resourceTags.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h4 className="text-lg font-medium mb-4">Resource Tags</h4>
            <div className="flex flex-wrap gap-2">
              {resourceTags.map((tag) => (
                <div
                  key={tag}
                  className="bg-muted px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
