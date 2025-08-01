import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Eye, FileText, Upload } from "lucide-react";
import { ProfileTable, TableColumn } from "../ProfileTable";

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: number;
  status: string;
  url?: string;
}

interface StudentDocumentsProps {
  documents: Document[];
  onViewDocument?: (documentId: string) => void;
  onDownloadDocument?: (url: string) => void;
  onUploadDocument?: () => void;
}

export function StudentDocuments({
  documents,
  onViewDocument,
  onDownloadDocument,
  onUploadDocument,
}: StudentDocumentsProps) {
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
        <h3 className="text-lg font-semibold">Student Documents</h3>
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
      </div>

      <ProfileTable
        columns={columns}
        data={documents}
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
          </div>
        )}
        emptyState={
          <div className="text-center py-8">
            <p className="text-muted-foreground">No documents available</p>
            {onUploadDocument && (
              <Button className="mt-4" size="sm" onClick={onUploadDocument}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            )}
          </div>
        }
      />
    </div>
  );
}
