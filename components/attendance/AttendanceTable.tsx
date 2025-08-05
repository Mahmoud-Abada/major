/**
 * AttendanceTable Component
 * Advanced table for displaying and managing attendance records with filtering and bulk operations
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Attendance } from '@/services/classroom-api';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Clock,
    Download,
    Edit,
    Filter,
    MoreHorizontal,
    Shield,
    UserCheck,
    UserX,
    X
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface AttendanceTableProps {
    attendance: Attendance[];
    loading?: boolean;
    onEdit?: (record: Attendance) => void;
    onStatusChange?: (recordId: string, status: string) => void;
    onBulkStatusChange?: (recordIds: string[], status: string) => void;
    onExport?: () => void;
    showBulkActions?: boolean;
    showStudentColumn?: boolean;
    showClassroomColumn?: boolean;
}

type SortField = 'date' | 'studentName' | 'status' | 'classroom';
type SortDirection = 'asc' | 'desc';

const ATTENDANCE_STATUS = [
    { value: 'present', label: 'Present', color: 'bg-green-100 text-green-800', icon: UserCheck },
    { value: 'absent', label: 'Absent', color: 'bg-red-100 text-red-800', icon: UserX },
    { value: 'late', label: 'Late', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { value: 'excused', label: 'Excused', color: 'bg-blue-100 text-blue-800', icon: Shield }
];

export function AttendanceTable({
    attendance,
    loading = false,
    onEdit,
    onStatusChange,
    onBulkStatusChange,
    onExport,
    showBulkActions = true,
    showStudentColumn = true,
    showClassroomColumn = false
}: AttendanceTableProps) {
    const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [filterText, setFilterText] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('');

    // Memoized filtered and sorted attendance
    const processedAttendance = useMemo(() => {
        let filtered = attendance;

        // Apply text filter
        if (filterText) {
            filtered = filtered.filter(record =>
                record.studentName?.toLowerCase().includes(filterText.toLowerCase()) ||
                record.student.toLowerCase().includes(filterText.toLowerCase()) ||
                record.notes?.toLowerCase().includes(filterText.toLowerCase())
            );
        }

        // Apply status filter
        if (filterStatus) {
            filtered = filtered.filter(record => record.status === filterStatus);
        }

        // Apply sorting
        return filtered.sort((a, b) => {
            let aValue: any;
            let bValue: any;

            switch (sortField) {
                case 'date':
                    aValue = a.date;
                    bValue = b.date;
                    break;
                case 'studentName':
                    aValue = a.studentName || a.student;
                    bValue = b.studentName || b.student;
                    break;
                case 'status':
                    aValue = a.status;
                    bValue = b.status;
                    break;
                case 'classroom':
                    aValue = a.classroom || '';
                    bValue = b.classroom || '';
                    break;
                default:
                    return 0;
            }

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (sortDirection === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });
    }, [attendance, filterText, filterStatus, sortField, sortDirection]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRecords(processedAttendance.map(record => record.id));
        } else {
            setSelectedRecords([]);
        }
    };

    const handleSelectRecord = (recordId: string, checked: boolean) => {
        if (checked) {
            setSelectedRecords(prev => [...prev, recordId]);
        } else {
            setSelectedRecords(prev => prev.filter(id => id !== recordId));
        }
    };

    const handleBulkStatusChange = (status: string) => {
        if (selectedRecords.length > 0 && onBulkStatusChange) {
            onBulkStatusChange(selectedRecords, status);
            setSelectedRecords([]);
        }
    };

    const getStatusInfo = (status: string) => {
        return ATTENDANCE_STATUS.find(s => s.value === status) || ATTENDANCE_STATUS[0];
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString();
    };

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return <ArrowUpDown className="h-4 w-4" />;
        }
        return sortDirection === 'asc' ?
            <ArrowUp className="h-4 w-4" /> :
            <ArrowDown className="h-4 w-4" />;
    };

    const clearFilters = () => {
        setFilterText('');
        setFilterStatus('');
    };

    return (
        <Card>
            {/* Table Header with Filters and Actions */}
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle>Attendance Records ({processedAttendance.length})</CardTitle>

                    <div className="flex items-center gap-2">
                        {onExport && (
                            <Button variant="outline" size="sm" onClick={onExport}>
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        )}

                        {showBulkActions && selectedRecords.length > 0 && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="sm">
                                        Bulk Actions ({selectedRecords.length})
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {ATTENDANCE_STATUS.map(status => (
                                        <DropdownMenuItem
                                            key={status.value}
                                            onClick={() => handleBulkStatusChange(status.value)}
                                        >
                                            <status.icon className="h-4 w-4 mr-2" />
                                            Mark as {status.label}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search attendance records..."
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Filter className="h-4 w-4 mr-2" />
                                Status {filterStatus && `(${ATTENDANCE_STATUS.find(s => s.value === filterStatus)?.label})`}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setFilterStatus('')}>
                                All Status
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {ATTENDANCE_STATUS.map(status => (
                                <DropdownMenuItem
                                    key={status.value}
                                    onClick={() => setFilterStatus(status.value)}
                                >
                                    <status.icon className="h-4 w-4 mr-2" />
                                    {status.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {(filterText || filterStatus) && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                            <X className="h-4 w-4 mr-2" />
                            Clear
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {showBulkActions && (
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={selectedRecords.length === processedAttendance.length && processedAttendance.length > 0}
                                        onCheckedChange={handleSelectAll}
                                    />
                                </TableHead>
                            )}

                            {showStudentColumn && (
                                <TableHead
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => handleSort('studentName')}
                                >
                                    <div className="flex items-center gap-2">
                                        Student
                                        {getSortIcon('studentName')}
                                    </div>
                                </TableHead>
                            )}

                            <TableHead
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => handleSort('status')}
                            >
                                <div className="flex items-center gap-2">
                                    Status
                                    {getSortIcon('status')}
                                </div>
                            </TableHead>

                            <TableHead
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => handleSort('date')}
                            >
                                <div className="flex items-center gap-2">
                                    Date & Time
                                    {getSortIcon('date')}
                                </div>
                            </TableHead>

                            {showClassroomColumn && (
                                <TableHead
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => handleSort('classroom')}
                                >
                                    <div className="flex items-center gap-2">
                                        Classroom
                                        {getSortIcon('classroom')}
                                    </div>
                                </TableHead>
                            )}

                            <TableHead>Notes</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        <AnimatePresence>
                            {processedAttendance.map((record) => {
                                const statusInfo = getStatusInfo(record.status);
                                const isSelected = selectedRecords.includes(record.id);
                                const Icon = statusInfo.icon;

                                return (
                                    <motion.tr
                                        key={record.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className={`group ${isSelected ? 'bg-muted/50' : ''}`}
                                    >
                                        {showBulkActions && (
                                            <TableCell>
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={(checked) =>
                                                        handleSelectRecord(record.id, checked as boolean)
                                                    }
                                                />
                                            </TableCell>
                                        )}

                                        {showStudentColumn && (
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                                        <span className="text-xs font-medium">
                                                            {(record.studentName || record.student).split(' ').map(n => n[0]).join('')}
                                                        </span>
                                                    </div>
                                                    <span>{record.studentName || `Student ${record.student}`}</span>
                                                </div>
                                            </TableCell>
                                        )}

                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Badge className={statusInfo.color}>
                                                    <Icon className="h-3 w-3 mr-1" />
                                                    {statusInfo.label}
                                                </Badge>
                                                {onStatusChange && (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                                <MoreHorizontal className="h-3 w-3" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            {ATTENDANCE_STATUS.map(status => (
                                                                <DropdownMenuItem
                                                                    key={status.value}
                                                                    onClick={() => onStatusChange(record.id, status.value)}
                                                                    disabled={record.status === status.value}
                                                                >
                                                                    <status.icon className="h-4 w-4 mr-2" />
                                                                    {status.label}
                                                                </DropdownMenuItem>
                                                            ))}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{formatDate(record.date)}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatTime(record.date)}
                                                </p>
                                            </div>
                                        </TableCell>

                                        {showClassroomColumn && (
                                            <TableCell>
                                                {record.classroom || record.event || '-'}
                                            </TableCell>
                                        )}

                                        <TableCell className="max-w-xs">
                                            {record.notes ? (
                                                <p className="text-sm truncate" title={record.notes}>
                                                    {record.notes}
                                                </p>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            {onEdit && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => onEdit(record)}>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </TableCell>
                                    </motion.tr>
                                );
                            })}
                        </AnimatePresence>
                    </TableBody>
                </Table>

                {loading && (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading attendance records...</p>
                    </div>
                )}

                {!loading && processedAttendance.length === 0 && (
                    <div className="p-8 text-center">
                        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                            <Filter className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No attendance records found</h3>
                        <p className="text-muted-foreground">
                            {filterText || filterStatus
                                ? 'Try adjusting your search criteria'
                                : 'No attendance records available'
                            }
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// Skeleton loader for AttendanceTable
export function AttendanceTableSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div className="h-6 bg-muted rounded w-48 animate-pulse" />
                    <div className="h-8 bg-muted rounded w-24 animate-pulse" />
                </div>
                <div className="flex gap-4">
                    <div className="h-10 bg-muted rounded flex-1 animate-pulse" />
                    <div className="h-10 bg-muted rounded w-32 animate-pulse" />
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead><div className="h-4 bg-muted rounded animate-pulse" /></TableHead>
                            <TableHead><div className="h-4 bg-muted rounded animate-pulse" /></TableHead>
                            <TableHead><div className="h-4 bg-muted rounded animate-pulse" /></TableHead>
                            <TableHead><div className="h-4 bg-muted rounded animate-pulse" /></TableHead>
                            <TableHead><div className="h-4 bg-muted rounded animate-pulse" /></TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><div className="h-4 bg-muted rounded animate-pulse" /></TableCell>
                                <TableCell><div className="h-6 bg-muted rounded w-20 animate-pulse" /></TableCell>
                                <TableCell><div className="h-4 bg-muted rounded animate-pulse" /></TableCell>
                                <TableCell><div className="h-4 bg-muted rounded animate-pulse" /></TableCell>
                                <TableCell><div className="h-4 bg-muted rounded animate-pulse" /></TableCell>
                                <TableCell><div className="h-8 bg-muted rounded w-8 animate-pulse" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}