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
  subject?: {
    name: string;
    id: string;
  };
  tags: string[];
}

interface ClassResourcesProps {
  resources: Resource[];
  resourceTypes: string[];
  subjects: {
    id: string;
    name: string;
  }[];
  onViewResource?: (resourceId: string) => void;
  onDownloadResource?: (url: string) => void;
  onUploadResource?: () => void;
  onFilterChange?: (type: string) => void;
  onSubjectFilterChange?: (subjectId: string) => void;
}

export function ClassResources({
  resources,
  resourceTypes,
  subjects,
  onViewResource,
  onDownloadResource,
  onUploadResource,
  onFilterChange,
  onSubjectFilterChange,
}: ClassResourcesProps) {
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
      header: "Subject",
      accessorKey: "subject",
      cell: (value) =>
        value ? (
          <a
            href={`/classroom/subjects/${value.id}`}
            className="hover:underline"
          >
            {value.name}
          </a>
        ) : (
          "General"
        ),
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
      case "audio":
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
            className="lucide lucide-headphones"
          >
            <path d="M3 14h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2Z" />
            <path d="M19 14h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2Z" />
            <path d="M3 14v-4a8 8 0 0 1 16 0v4" />
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

  // Group resources by subject
  const resourcesBySubject = resources.reduce(
    (acc, resource) => {
      const subjectName = resource.subject?.name || "General";
      acc[subjectName] = (acc[subjectName] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-semibold">Class Resources</h3>
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

            {onSubjectFilterChange && (
              <Select onValueChange={onSubjectFilterChange}>
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Subjects" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
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
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all">
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">
            All Resources
          </TabsTrigger>
          <TabsTrigger value="bySubject" className="flex-1">
            By Subject
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

        <TabsContent value="bySubject">
          <div className="space-y-6">
            {Object.entries(resourcesBySubject).map(([subject, count]) => (
              <Card key={subject}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium">{subject}</h4>
                    <div className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-md">
                      {count} resources
                    </div>
                  </div>

                  <ProfileTable
                    columns={columns}
                    data={resources.filter(
                      (r) => (r.subject?.name || "General") === subject,
                    )}
                    onRowClick={
                      onViewResource
                        ? (row) => onViewResource(row.id)
                        : undefined
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
                  />
                </CardContent>
              </Card>
            ))}

            {Object.keys(resourcesBySubject).length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No resources found</p>
                {onUploadResource && (
                  <Button className="mt-4" size="sm" onClick={onUploadResource}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Resource
                  </Button>
                )}
              </div>
            )}
          </div>
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
    </div>
  );
}
