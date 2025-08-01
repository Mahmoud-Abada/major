import { Card, CardContent } from "@/components/ui/card";
import { ProfileContactInfo } from "../ProfileContactInfo";

interface SchoolInfoProps {
  name: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  establishedYear?: number;
  logo?: string;
}

export function SchoolInfo({
  name,
  address,
  contactEmail,
  contactPhone,
  website,
  establishedYear,
  logo,
}: SchoolInfoProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {logo && (
            <div className="flex-shrink-0">
              <img
                src={logo}
                alt={`${name} logo`}
                className="w-24 h-24 object-contain"
              />
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">{name}</h2>
              {establishedYear && (
                <p className="text-sm text-muted-foreground">
                  Established in {establishedYear}
                </p>
              )}
            </div>

            <ProfileContactInfo
              email={contactEmail}
              phone={contactPhone}
              address={address}
              website={website}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
