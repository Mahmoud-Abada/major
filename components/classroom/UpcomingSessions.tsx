"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import {
  selectUpcomingSessions,
  Session,
} from "../../store/slices/classroom/dashboardSlice";

export function UpcomingSessions() {
  const t = useTranslations("Dashboard.sessions");
  const sessions = useSelector(selectUpcomingSessions);

  const getStatusBadge = (status: Session["status"]) => {
    switch (status) {
      case "now":
        return <Badge variant="destructive">{t("statusNow")}</Badge>;
      case "soon":
        return <Badge variant="secondary">{t("statusSoon")}</Badge>;
      default:
        return <Badge variant="outline">{t("statusUpcoming")}</Badge>;
    }
  };

  if (sessions.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">{t("title")}</h2>
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y">
            {sessions.map((session) => (
              <li
                key={session.id}
                className="flex items-center justify-between p-4 hover:bg-accent/50"
              >
                <div className="flex items-center gap-4">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">{session.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.time} - {session.teacher}
                    </p>
                  </div>
                </div>
                {getStatusBadge(session.status)}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
