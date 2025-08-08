"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  RiGroupLine,
  RiFileTextLine,
  RiDiscussLine,
  RiHomeLine,
  RiQuestionLine,
  RiRidingLine,
  RiUserLine,
  RiTimeLine,
  RiEyeLine,
  RiBarChartLine,
} from "@remixicon/react";
import { mockClassOverviews } from "./mock-data";
import type { ClassPostOverview } from "./types";

export function ClassesView() {
  const [classOverviews] = useState<ClassPostOverview[]>(mockClassOverviews);
  const [selectedClass, setSelectedClass] = useState<ClassPostOverview | null>(
    null,
  );

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Il y a moins d'1h";
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return "Hier";
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const getEngagementColor = (rate: number) => {
    if (rate >= 80) return "text-green-600";
    if (rate >= 60) return "text-blue-600";
    if (rate >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Classes Overview Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classOverviews.map((classOverview) => (
          <Card
            key={classOverview.classId}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedClass(classOverview)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <RiGroupLine className="h-5 w-5" />
                  {classOverview.className}
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {classOverview.totalPosts} publications
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Activity Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <RiDiscussLine className="h-4 w-4 text-blue-600" />
                    <span className="text-lg font-bold text-blue-600">
                      {classOverview.activeDiscussions}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Discussions</p>
                </div>

                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <RiHomeLine className="h-4 w-4 text-orange-600" />
                    <span className="text-lg font-bold text-orange-600">
                      {classOverview.pendingHomeworks}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Devoirs</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <RiQuestionLine className="h-4 w-4 text-purple-600" />
                    <span className="text-lg font-bold text-purple-600">
                      {classOverview.upcomingQuizzes}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Quiz</p>
                </div>

                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <RiRidingLine className="h-4 w-4 text-green-600" />
                    <span className="text-lg font-bold text-green-600">
                      {classOverview.averageEngagement.toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Engagement</p>
                </div>
              </div>

              {/* Engagement Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Taux d'Engagement</span>
                  <span
                    className={`font-medium ${getEngagementColor(classOverview.averageEngagement)}`}
                  >
                    {classOverview.averageEngagement.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={classOverview.averageEngagement}
                  className="h-2"
                />
              </div>

              {/* Last Activity */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <RiTimeLine className="h-4 w-4" />
                  <span>Dernière activité</span>
                </div>
                <span>{formatTimeAgo(classOverview.lastActivity)}</span>
              </div>

              {/* Top Contributors Preview */}
              {classOverview.topContributors.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Top Contributeurs</p>
                  <div className="space-y-2">
                    {classOverview.topContributors
                      .slice(0, 2)
                      .map((contributor) => (
                        <div
                          key={contributor.userId}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {contributor.userName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {contributor.userName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{contributor.postsCount} posts</span>
                            <span>•</span>
                            <span>{contributor.commentsCount} comm.</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Class View */}
      {selectedClass && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <RiGroupLine className="h-6 w-6" />
                Détails - {selectedClass.className}
              </CardTitle>
              <Button variant="outline" onClick={() => setSelectedClass(null)}>
                Fermer
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Detailed Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <RiFileTextLine className="h-5 w-5 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-600">
                    {selectedClass.totalPosts}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Total Publications
                </p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <RiDiscussLine className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">
                    {selectedClass.activeDiscussions}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Discussions Actives
                </p>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <RiHomeLine className="h-5 w-5 text-orange-600" />
                  <span className="text-2xl font-bold text-orange-600">
                    {selectedClass.pendingHomeworks}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Devoirs en Cours
                </p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <RiQuestionLine className="h-5 w-5 text-purple-600" />
                  <span className="text-2xl font-bold text-purple-600">
                    {selectedClass.upcomingQuizzes}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Quiz à Venir</p>
              </div>
            </div>

            {/* Engagement Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <RiBarChartLine className="h-4 w-4" />
                    Analyse d'Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Taux d'Engagement Global</span>
                        <span
                          className={`font-medium ${getEngagementColor(selectedClass.averageEngagement)}`}
                        >
                          {selectedClass.averageEngagement.toFixed(1)}%
                        </span>
                      </div>
                      <Progress
                        value={selectedClass.averageEngagement}
                        className="h-3"
                      />
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>
                        Cette classe montre un niveau d'engagement{" "}
                        {selectedClass.averageEngagement >= 80
                          ? "excellent"
                          : selectedClass.averageEngagement >= 60
                            ? "bon"
                            : selectedClass.averageEngagement >= 40
                              ? "moyen"
                              : "faible"}
                        .
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Contributors */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <RiUserLine className="h-4 w-4" />
                    Top Contributeurs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedClass.topContributors.map((contributor, index) => (
                      <div
                        key={contributor.userId}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {contributor.userName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {contributor.userName}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{contributor.postsCount} publications</span>
                              <span>•</span>
                              <span>
                                {contributor.commentsCount} commentaires
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {selectedClass.topContributors.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Aucun contributeur pour le moment
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
