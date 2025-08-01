import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Users } from "lucide-react";
import { ProfileTable, TableColumn } from "../ProfileTable";

interface Group {
  id: string;
  name: string;
  type: string;
  memberCount: number;
  joinDate: string;
  role?: string;
  description?: string;
  leader?: {
    id: string;
    name: string;
  };
}

interface StudentGroupsProps {
  groups: Group[];
  onViewGroup?: (groupId: string) => void;
}

export function StudentGroups({ groups, onViewGroup }: StudentGroupsProps) {
  const columns: TableColumn[] = [
    {
      header: "Group Name",
      accessorKey: "name",
      cell: (value, row) => (
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: (value) => (
        <Badge variant="outline" className="capitalize">
          {value}
        </Badge>
      ),
    },
    {
      header: "Members",
      accessorKey: "memberCount",
    },
    {
      header: "Joined",
      accessorKey: "joinDate",
      cell: (value) => new Date(value).toLocaleDateString(),
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (value) =>
        value ? (
          <Badge
            className={
              value.toLowerCase() === "leader"
                ? "bg-blue-100 text-blue-800 hover:bg-blue-200 border-0"
                : ""
            }
          >
            {value}
          </Badge>
        ) : (
          "Member"
        ),
    },
    {
      header: "Leader",
      accessorKey: "leader",
      cell: (value) =>
        value ? (
          <a
            href={`/classroom/teachers/${value.id}`}
            className="hover:underline"
          >
            {value.name}
          </a>
        ) : (
          "-"
        ),
    },
  ];

  // Group by type for summary
  const groupsByType = groups.reduce(
    (acc, group) => {
      acc[group.type] = (acc[group.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(groupsByType).map(([type, count]) => (
          <Card key={type}>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground capitalize">
                {type}
              </div>
              <div className="text-2xl font-bold mt-1">{count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ProfileTable
        columns={columns}
        data={groups}
        onRowClick={(row) => onViewGroup && onViewGroup(row.id)}
        actions={(row) => (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewGroup && onViewGroup(row.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        )}
        emptyState={
          <div className="text-center py-8">
            <Users className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">No groups joined</p>
          </div>
        }
      />
    </div>
  );
}
