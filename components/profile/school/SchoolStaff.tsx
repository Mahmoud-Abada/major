import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Plus, Search, UserPlus } from "lucide-react";
import { ProfileTable, TableColumn } from "../ProfileTable";
import { StatusBadge } from "../StatusBadge";

interface StaffMember {
  id: string;
  name: string;
  avatar?: string;
  position: string;
  department: string;
  email: string;
  phone?: string;
  status: string;
  joinDate: string;
}

interface SchoolStaffProps {
  staff: StaffMember[];
  departments: string[];
  onViewStaffMember?: (staffId: string) => void;
  onAddStaffMember?: () => void;
  onFilterChange?: (department: string) => void;
}

export function SchoolStaff({
  staff,
  departments,
  onViewStaffMember,
  onAddStaffMember,
  onFilterChange,
}: SchoolStaffProps) {
  const columns: TableColumn[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (value, row) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.avatar} alt={value} />
            <AvatarFallback>
              {value
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span>{value}</span>
        </div>
      ),
    },
    { header: "Position", accessorKey: "position" },
    { header: "Department", accessorKey: "department" },
    {
      header: "Contact",
      accessorKey: "email",
      cell: (value, row) => (
        <div className="space-y-1">
          <div>
            <a href={`mailto:${value}`} className="text-sm hover:underline">
              {value}
            </a>
          </div>
          {row.phone && (
            <div className="text-sm text-muted-foreground">{row.phone}</div>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (value) => <StatusBadge status={value} />,
    },
    {
      header: "Join Date",
      accessorKey: "joinDate",
      cell: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  // Group staff by department for summary
  const staffByDepartment = staff.reduce(
    (acc, member) => {
      acc[member.department] = (acc[member.department] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-semibold">School Staff</h3>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff..."
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
                      <SelectValue placeholder="All Departments" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {onAddStaffMember && (
              <Button onClick={onAddStaffMember}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(staffByDepartment).map(([department, count]) => (
          <div key={department} className="bg-card border rounded-lg p-4">
            <div className="text-sm font-medium text-muted-foreground">
              {department}
            </div>
            <div className="text-2xl font-bold mt-1">{count}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round((count / staff.length) * 100)}% of total staff
            </div>
          </div>
        ))}
      </div>

      <ProfileTable
        columns={columns}
        data={staff}
        onRowClick={
          onViewStaffMember ? (row) => onViewStaffMember(row.id) : undefined
        }
        emptyState={
          <div className="text-center py-8">
            <p className="text-muted-foreground">No staff members found</p>
            {onAddStaffMember && (
              <Button className="mt-4" size="sm" onClick={onAddStaffMember}>
                <Plus className="h-4 w-4 mr-2" />
                Add Staff Member
              </Button>
            )}
          </div>
        }
      />
    </div>
  );
}
