import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileContactInfo } from "../ProfileContactInfo";

interface GroupInfoProps {
  name: string;
  type: string;
  description: string;
  createdAt: string;
  memberCount: number;
  status: string;
  coordinator?: {
    name: string;
    id: string;
    role: string;
  };
  contactEmail?: string;
  contactPhone?: string;
  meetingLocation?: string;
  meetingSchedule?: string;
}

export function GroupInfo({
  name,
  type,
  description,
  createdAt,
  memberCount,
  status,
  coordinator,
  contactEmail,
  contactPhone,
  meetingLocation,
  meetingSchedule,
}: GroupInfoProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold flex items-center">
                {name}
                <Badge
                  className="ml-2"
                  variant={
                    status.toLowerCase() === "active" ? "default" : "outline"
                  }
                >
                  {status}
                </Badge>
              </h2>
              <p className="text-sm text-muted-foreground">
                {type} • Created on {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Description
              </p>
              <p className="mt-1">{description}</p>
            </div>

            {coordinator && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Coordinator
                </p>
                <p className="mt-1">
                  <a
                    href={`/classroom/teachers/${coordinator.id}`}
                    className="hover:underline"
                  >
                    {coordinator.name}
                  </a>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({coordinator.role})
                  </span>
                </p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Members
              </p>
              <p className="mt-1 text-lg font-semibold">{memberCount}</p>
            </div>
          </div>

          <div className="space-y-4">
            {(contactEmail || contactPhone) && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Contact Information
                </p>
                <ProfileContactInfo email={contactEmail} phone={contactPhone} />
              </div>
            )}

            {meetingLocation && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Meeting Location
                </p>
                <p className="mt-1">{meetingLocation}</p>
              </div>
            )}

            {meetingSchedule && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Meeting Schedule
                </p>
                <p className="mt-1">{meetingSchedule}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
