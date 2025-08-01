import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface QualificationsProps {
  qualifications: string[];
  specializations?: string[];
  bio?: string;
}

export function Qualifications({
  qualifications,
  specializations,
  bio,
}: QualificationsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        {bio && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Biography</h3>
            <p className="text-muted-foreground">{bio}</p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Qualifications</h3>
          <div className="flex flex-wrap gap-2">
            {qualifications.map((qualification, index) => (
              <Badge key={index} variant="secondary">
                {qualification}
              </Badge>
            ))}
          </div>
        </div>

        {specializations && specializations.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Specializations</h3>
            <div className="flex flex-wrap gap-2">
              {specializations.map((specialization, index) => (
                <Badge key={index} variant="outline">
                  {specialization}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
