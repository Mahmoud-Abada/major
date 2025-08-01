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
  category: string;
  uploadDate: string;
  uploadedBy: {
    name: string;
    id: string;
    role: string;
  };
  size: number;
  url?: string;
  accessLevel: string;
  downloadCount: number;
}

interface SchoolResourcesProps {
  resources: Resource[];
  categories: string[];
  types: string[];
  onViewResource?: (resourceId: string) => void;
  onDownloadResource?: (url: string) => void;
  onUploadResource?: () => void;
  onFilterChange?: (category: string) => void;
}

export function SchoolResources({
  resources,
  categories,
  types,
  onViewResource,
  onDownloadResource,
  onUploadResource,
  onFilterChange,
}: SchoolResourcesProps) {
  const columns: TableColumn[] = [
    {
      header: "Title",
      accessorKey: "title",
      cell: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          {row.description && (
            <div className="text-sm text-muted-foreground truncate max-w-[300px]">
              {row.description}
            </div>
          )}
        </div>
      ),
    },
    { header: "Type", accessorKey: "type" },
    { header: "Category", accessorKey: "category" },
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
      header: "Upload Date",
      accessorKey: "uploadDate",
      cell: (value) => new Date(value).toLocaleDateString(),
    },
    {
      header: "Size",
      accessorKey: "size",
      cell: (value) => {
        if (value < 1024) return `${value} B`;
        if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
        return `${(value / (1024 * 1024)).toFixed(1)} MB`;
      },
    },
    { header: "Access Level", accessorKey: "accessLevel" },
    {
      header: "Downloads",
      accessorKey: "downloadCount",
      cell: (value) => value.toLocaleString(),
    },
  ];

  // Group resources by type for summary
  const resourcesByType = resources.reduce(
    (acc, resource) => {
      acc[resource.type] = (acc[resource.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Group resources by category
  const resourcesByCategory = resources.reduce(
    (acc, resource) => {
      if (!acc[resource.category]) {
        acc[resource.category] = [];
      }
      acc[resource.category].push(resource);
      return acc;
    },
    {} as Record<string, Resource[]>,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-semibold">School Resources</h3>
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
              <div className="flex items-center gap-2">
                <Select onValueChange={onFilterChange}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="All Categories" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {onUploadResource && (
              <Button onClick={onUploadResource}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Resource
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(resourcesByType).map(([type, count]) => (
          <Card key={type}>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">
                {type}
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
          {types.map((type) => (
            <TabsTrigger key={type} value={type} className="flex-1">
              {type}
            </TabsTrigger>
          ))}
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
                {onViewResource && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onViewResource(row.id)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    View
                  </Button>
                )}
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
                <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No resources found</p>
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

        {types.map((type) => (
          <TabsContent key={type} value={type}>
            <ProfileTable
              columns={columns}
              data={resources.filter((resource) => resource.type === type)}
              onRowClick={
                onViewResource ? (row) => onViewResource(row.id) : undefined
              }
              actions={(row) => (
                <div className="flex space-x-2">
                  {onViewResource && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onViewResource(row.id)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  )}
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
                  <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">
                    No {type} resources found
                  </p>
                  {onUploadResource && (
                    <Button
                      className="mt-4"
                      size="sm"
                      onClick={onUploadResource}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Resource
                    </Button>
                  )}
                </div>
              }
            />
          </TabsContent>
        ))}
      </Tabs>

      {Object.keys(resourcesByCategory).length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Resources by Category</h3>
          <div className="space-y-6">
            {Object.entries(resourcesByCategory).map(
              ([category, categoryResources]) => (
                <Card key={category}>
                  <CardContent className="p-6">
                    <h4 className="text-md font-semibold mb-4">{category}</h4>
                    <ProfileTable
                      columns={columns}
                      data={categoryResources}
                      onRowClick={
                        onViewResource
                          ? (row) => onViewResource(row.id)
                          : undefined
                      }
                      actions={(row) => (
                        <div className="flex space-x-2">
                          {onViewResource && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onViewResource(row.id)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          )}
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
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
