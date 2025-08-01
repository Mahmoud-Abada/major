import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, Search, UserPlus } from "lucide-react";
import { useState } from "react";
import { ProfileTable, TableColumn } from "../ProfileTable";
import { StatusBadge } from "../StatusBadge";

interface Member {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  type: string; // student, teacher, etc.
  joinDate: string;
  status: string;
  attendance?: number;
  participation?: number;
}

interface GroupMembersProps {
  members: Member[];
  totalMembers: number;
  studentCount: number;
  teacherCount: number;
  onViewMember?: (memberId: string, memberType: string) => void;
  onAddMember?: () => void;
}

export function GroupMembers({
  members,
  totalMembers,
  studentCount,
  teacherCount,
  onViewMember,
  onAddMember,
}: GroupMembersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter ? member.role === roleFilter : true;

    return matchesSearch && matchesRole;
  });

  const columns: TableColumn[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (value, row) => (
        <div className="flex items-center gap-2">
          {row.avatar && (
            <img
              src={row.avatar}
              alt={value}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <span>{value}</span>
        </div>
      ),
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (value) => <Badge variant="outline">{value}</Badge>,
    },
    { header: "Type", accessorKey: "type" },
    {
      header: "Join Date",
      accessorKey: "joinDate",
      cell: (value) => new Date(value).toLocaleDateString(),
    },
    {
      header: "Attendance",
      accessorKey: "attendance",
      cell: (value) => (value !== undefined ? `${value}%` : "-"),
    },
    {
      header: "Participation",
      accessorKey: "participation",
      cell: (value) => (value !== undefined ? `${value}%` : "-"),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (value) => <StatusBadge status={value} />,
    },
  ];

  // Get unique roles for filtering
  const roles = Array.from(new Set(members.map((member) => member.role)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Group Members</h3>
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {onAddMember && (
            <Button onClick={onAddMember}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Total Members
            </div>
            <div className="text-2xl font-bold mt-1">{totalMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Students
            </div>
            <div className="text-2xl font-bold mt-1">{studentCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Teachers
            </div>
            <div className="text-2xl font-bold mt-1">{teacherCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Other Members
            </div>
            <div className="text-2xl font-bold mt-1">
              {totalMembers - studentCount - teacherCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={roleFilter === null ? "default" : "outline"}
          size="sm"
          onClick={() => setRoleFilter(null)}
        >
          All
        </Button>
        {roles.map((role) => (
          <Button
            key={role}
            variant={roleFilter === role ? "default" : "outline"}
            size="sm"
            onClick={() => setRoleFilter(role === roleFilter ? null : role)}
          >
            {role}
          </Button>
        ))}
      </div>

      <ProfileTable
        columns={columns}
        data={filteredMembers}
        actions={(row) => (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewMember && onViewMember(row.id, row.type)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        )}
        emptyState={
          searchQuery || roleFilter ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No members match your filters
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No members in this group</p>
              {onAddMember && (
                <Button className="mt-4" size="sm" onClick={onAddMember}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              )}
            </div>
          )
        }
      />
    </div>
  );
}
