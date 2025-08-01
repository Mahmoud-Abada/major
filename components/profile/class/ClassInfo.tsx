import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ClassInfoProps {
  name: string;
  grade: string;
  academicYear: string;
  classTeacher: {
    name: string;
    id: string;
  };
  room?: string;
  studentCount: number;
}

export function ClassInfo({
  name,
  grade,
  academicYear,
  classTeacher,
  room,
  studentCount,
}: ClassInfoProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Class Name</p>
            <p className="font-medium">{name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Grade</p>
            <p className="font-medium">{grade}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Academic Year</p>
            <p className="font-medium">{academicYear}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Class Teacher</p>
            <p className="font-medium">
              <a
                href={`/classroom/teachers/${classTeacher.id}`}
                className="hover:underline"
              >
                {classTeacher.name}
              </a>
            </p>
          </div>
          {room && (
            <div>
              <p className="text-sm text-muted-foreground">Room</p>
              <p className="font-medium">{room}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">Students</p>
            <p className="font-medium">
              <Badge variant="secondary">{studentCount}</Badge>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
