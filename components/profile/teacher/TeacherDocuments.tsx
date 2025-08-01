import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Eye, FileText, Upload } from "lucide-react";
import { ProfileTable, TableColumn } from "../ProfileTable";

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  uploadDate: string;
  size: number;
  status: string;
  url?: string;
  shared?: boolean;
}

interface TeacherDocumentsProps {
  documents: Document[];
  onViewDocument?: (documentId: string) => void;
  onDownloadDocument?: (url: string) => void;
  onUploadDocument?: () => void;
  onShareDocument?: (documentId: string) => void;
}

export function TeacherDocuments({
  documents,
  onViewDocument,
  onDownloadDocument,
  onUploadDocument,
  onShareDocument,
}: TeacherDocumentsProps) {
  // Get unique categories
  const categories = ["All", ...new Set(documents.map((doc) => doc.category))];

  const columns: TableColumn[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (value) => (
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span>{value}</span>
        </div>
      ),
    },
    { header: "Type", accessorKey: "type" },
    { header: "Category", accessorKey: "category" },
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
    {
      header: "Shared",
      accessorKey: "shared",
      cell: (value) => (value ? "Yes" : "No"),
    },
    { header: "Status", accessorKey: "status" },
  ];

  // Group documents by type for summary
  const documentsByType = documents.reduce(
    (acc, doc) => {
      acc[doc.type] = (acc[doc.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Teacher Documents</h3>
        {onUploadDocument && (
          <Button onClick={onUploadDocument}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(documentsByType).map(([type, count]) => (
          <Card key={type}>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">
                {type}
              </div>
              <div className="text-2xl font-bold mt-1">{count}</div>
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Shared
            </div>
            <div className="text-2xl font-bold mt-1">
              {documents.filter((doc) => doc.shared).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="All">
        <TabsList className="mb-4">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <ProfileTable
              columns={columns}
              data={
                category === "All"
                  ? documents
                  : documents.filter((doc) => doc.category === category)
              }
              actions={(row) => (
                <div className="flex space-x-2">
                  {onViewDocument && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onViewDocument(row.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  )}
                  {row.url && onDownloadDocument && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDownloadDocument(row.url!)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  )}
                  {onShareDocument && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onShareDocument(row.id)}
                      className={row.shared ? "text-primary" : ""}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                      {row.shared ? "Shared" : "Share"}
                    </Button>
                  )}
                </div>
              )}
              emptyState={
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No documents available
                  </p>
                  {onUploadDocument && (
                    <Button
                      className="mt-4"
                      size="sm"
                      onClick={onUploadDocument}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  )}
                </div>
              }
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
