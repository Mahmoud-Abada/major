"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  RiAwardLine,
  RiBarChartLine,
  RiCalendarLine,
  RiChat3Line,
  RiFileTextLine,
  RiHomeLine,
  RiQuestionLine,
  RiSearchLine,
  RiTimeLine,
  RiUserLine,
} from "@remixicon/react";
import { useState } from "react";
import type { StudentPostSummary } from "./types";
// Empty student summaries array - will be populated from API
const mockStudentSummaries: any[] = [];

export function StudentsView() {
  const [studentSummaries] =
    useState<StudentPostSummary[]>(mockStudentSummaries);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] =
    useState<StudentPostSummary | null>(null);

  const filteredStudents = studentSummaries.filter(
    (student) =>
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.className.toLowerCase().includes(searchTerm.toLowerCase()),
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

  const getEngagementColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 16) return "text-green-600";
    if (grade >= 14) return "text-blue-600";
    if (grade >= 12) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceLevel = (grade: number) => {
    if (grade >= 16) return "Excellent";
    if (grade >= 14) return "Bien";
    if (grade >= 12) return "Assez Bien";
    if (grade >= 10) return "Passable";
    return "Insuffisant";
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher un étudiant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.map((student) => (
          <Card
            key={student.studentId}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedStudent(student)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {student.studentName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base line-clamp-1">
                    {student.studentName}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {student.className}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Activity Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <RiFileTextLine className="h-4 w-4 text-blue-600" />
                    <span className="text-lg font-bold text-blue-600">
                      {student.postsCreated}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Publications</p>
                </div>

                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <RiChat3Line className="h-4 w-4 text-green-600" />
                    <span className="text-lg font-bold text-green-600">
                      {student.commentsPosted}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Commentaires</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <RiHomeLine className="h-4 w-4 text-orange-600" />
                    <span className="text-lg font-bold text-orange-600">
                      {student.homeworksSubmitted}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Devoirs</p>
                </div>

                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <RiQuestionLine className="h-4 w-4 text-purple-600" />
                    <span className="text-lg font-bold text-purple-600">
                      {student.quizzesCompleted}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Quiz</p>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Moyenne Générale</span>
                    <span
                      className={`font-medium ${getGradeColor(student.averageGrade)}`}
                    >
                      {student.averageGrade.toFixed(1)}/20
                    </span>
                  </div>
                  <Progress
                    value={(student.averageGrade / 20) * 100}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {getPerformanceLevel(student.averageGrade)}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Score d'Engagement</span>
                    <span
                      className={`font-medium ${getEngagementColor(student.engagementScore)}`}
                    >
                      {student.engagementScore.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={student.engagementScore} className="h-2" />
                </div>
              </div>

              {/* Last Activity */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <RiTimeLine className="h-4 w-4" />
                  <span>Dernière activité</span>
                </div>
                <span>{formatTimeAgo(student.lastActivity)}</span>
              </div>

              {/* Upcoming Deadlines Preview */}
              {student.upcomingDeadlines.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-1">
                    <RiCalendarLine className="h-4 w-4" />
                    Échéances à venir ({student.upcomingDeadlines.length})
                  </p>
                  <div className="space-y-1">
                    {student.upcomingDeadlines.slice(0, 2).map((deadline) => (
                      <div
                        key={deadline.id}
                        className="flex items-center justify-between text-xs p-2 bg-muted/30 rounded"
                      >
                        <span className="line-clamp-1">{deadline.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {new Date(deadline.dueDate).toLocaleDateString(
                            "fr-FR",
                            { day: "2-digit", month: "2-digit" },
                          )}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <RiUserLine className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun étudiant trouvé</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm
                ? "Aucun étudiant ne correspond à votre recherche."
                : "Aucun étudiant n'a encore d'activité sur les publications."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Detailed Student View */}
      {selectedStudent && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {selectedStudent.studentName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">
                    {selectedStudent.studentName}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {selectedStudent.className}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedStudent(null)}
              >
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
                    {selectedStudent.postsCreated}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Publications Créées
                </p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <RiChat3Line className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">
                    {selectedStudent.commentsPosted}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Commentaires Postés
                </p>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <RiHomeLine className="h-5 w-5 text-orange-600" />
                  <span className="text-2xl font-bold text-orange-600">
                    {selectedStudent.homeworksSubmitted}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Devoirs Soumis</p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <RiQuestionLine className="h-5 w-5 text-purple-600" />
                  <span className="text-2xl font-bold text-purple-600">
                    {selectedStudent.quizzesCompleted}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Quiz Complétés</p>
              </div>
            </div>

            {/* Performance Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <RiAwardLine className="h-4 w-4" />
                    Performance Académique
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Moyenne Générale</span>
                      <span
                        className={`font-medium ${getGradeColor(selectedStudent.averageGrade)}`}
                      >
                        {selectedStudent.averageGrade.toFixed(1)}/20
                      </span>
                    </div>
                    <Progress
                      value={(selectedStudent.averageGrade / 20) * 100}
                      className="h-3"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Niveau:{" "}
                      <span
                        className={`font-medium ${getGradeColor(selectedStudent.averageGrade)}`}
                      >
                        {getPerformanceLevel(selectedStudent.averageGrade)}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <RiBarChartLine className="h-4 w-4" />
                    Engagement et Participation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Score d'Engagement</span>
                      <span
                        className={`font-medium ${getEngagementColor(selectedStudent.engagementScore)}`}
                      >
                        {selectedStudent.engagementScore.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={selectedStudent.engagementScore}
                      className="h-3"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Participation très{" "}
                      {selectedStudent.engagementScore >= 80
                        ? "active"
                        : selectedStudent.engagementScore >= 60
                          ? "bonne"
                          : selectedStudent.engagementScore >= 40
                            ? "modérée"
                            : "faible"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Deadlines */}
            {selectedStudent.upcomingDeadlines.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <RiCalendarLine className="h-4 w-4" />
                    Échéances à Venir (
                    {selectedStudent.upcomingDeadlines.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedStudent.upcomingDeadlines.map((deadline) => (
                      <div
                        key={deadline.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg">
                            {deadline.type === "homework" ? (
                              <RiHomeLine className="h-4 w-4 text-orange-600" />
                            ) : (
                              <RiQuestionLine className="h-4 w-4 text-purple-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {deadline.title}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {deadline.type === "homework" ? "Devoir" : "Quiz"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs">
                            {new Date(deadline.dueDate).toLocaleDateString(
                              "fr-FR",
                            )}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {Math.ceil(
                              (new Date(deadline.dueDate).getTime() -
                                new Date().getTime()) /
                                (1000 * 60 * 60 * 24),
                            )}{" "}
                            jours
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
