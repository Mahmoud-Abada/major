"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  RiAlarmWarningLine,
  RiBarChartLine,
  RiBookLine,
  RiCalendarLine,
  RiCheckLine,
  RiGroupLine,
  RiInformationLine,
  RiMapPinLine,
  RiTimeLine,
  RiUserLine,
} from "@remixicon/react";
import type { ClassSchedule, ScheduleEntry, TeacherSchedule } from "./types";

interface ScheduleDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ScheduleEntry | ClassSchedule | TeacherSchedule | null;
}

export function ScheduleDetailsDialog({
  open,
  onOpenChange,
  data,
}: ScheduleDetailsDialogProps) {
  if (!data) return null;

  // Determine the type of data
  const isEntry = "startTime" in data && "endTime" in data;
  const isClassSchedule = "className" in data && "subjects" in data;
  const isTeacherSchedule = "teacherName" in data && "workload" in data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEntry && <RiCalendarLine className="h-5 w-5" />}
            {isClassSchedule && <RiGroupLine className="h-5 w-5" />}
            {isTeacherSchedule && <RiUserLine className="h-5 w-5" />}
            {isEntry && (data as ScheduleEntry).title}
            {isClassSchedule &&
              `Emploi du temps - ${(data as ClassSchedule).className}`}
            {isTeacherSchedule &&
              `Planning - ${(data as TeacherSchedule).teacherName}`}
          </DialogTitle>
          <DialogDescription>
            {isEntry && "Détails de la session programmée"}
            {isClassSchedule && "Emploi du temps détaillé de la classe"}
            {isTeacherSchedule && "Planning détaillé de l'enseignant"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Schedule Entry Details */}
          {isEntry && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <RiInformationLine className="h-4 w-4" />
                    Informations de la Session
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Matière
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {(data as ScheduleEntry).subject}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Type
                      </p>
                      <Badge variant="secondary" className="mt-1 capitalize">
                        {(data as ScheduleEntry).type}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Classe
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {(data as ScheduleEntry).className}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Enseignant
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {(data as ScheduleEntry).teacherName}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Date
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <RiCalendarLine className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          {new Date(
                            (data as ScheduleEntry).date,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Heure
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <RiTimeLine className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-mono">
                          {(data as ScheduleEntry).startTime} -{" "}
                          {(data as ScheduleEntry).endTime}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Salle
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <RiMapPinLine className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          {(data as ScheduleEntry).roomName || "Non assignée"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Statut
                      </p>
                      <Badge
                        variant={
                          (data as ScheduleEntry).status === "completed"
                            ? "default"
                            : (data as ScheduleEntry).status === "ongoing"
                              ? "secondary"
                              : (data as ScheduleEntry).status === "cancelled"
                                ? "destructive"
                                : (data as ScheduleEntry).status === "postponed"
                                  ? "outline"
                                  : "outline"
                        }
                        className="mt-1"
                      >
                        <div className="flex items-center gap-1">
                          {(data as ScheduleEntry).status === "completed" && (
                            <RiCheckLine size={14} />
                          )}
                          {(data as ScheduleEntry).status === "cancelled" && (
                            <RiAlarmWarningLine size={14} />
                          )}
                          {(data as ScheduleEntry).status}
                        </div>
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Présence
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {(data as ScheduleEntry).attendanceRequired
                          ? "Obligatoire"
                          : "Optionnelle"}
                      </Badge>
                    </div>
                  </div>

                  {(data as ScheduleEntry).maxStudents && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Étudiants
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium">
                          {(data as ScheduleEntry).currentStudents || 0} /{" "}
                          {(data as ScheduleEntry).maxStudents}
                        </span>
                        <Progress
                          value={
                            (((data as ScheduleEntry).currentStudents || 0) /
                              (data as ScheduleEntry).maxStudents!) *
                            100
                          }
                          className="flex-1 h-2"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {(data as ScheduleEntry).description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <RiBookLine className="h-4 w-4" />
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {(data as ScheduleEntry).description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {(data as ScheduleEntry).notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <RiInformationLine className="h-4 w-4" />
                      Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {(data as ScheduleEntry).notes}
                    </p>
                  </CardContent>
                </Card>
              )}

              {(data as ScheduleEntry).isRecurring && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <RiTimeLine className="h-4 w-4" />
                      Récurrence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Type de récurrence</span>
                        <Badge variant="outline" className="capitalize">
                          {(data as ScheduleEntry).recurrencePattern}
                        </Badge>
                      </div>
                      {(data as ScheduleEntry).recurrenceEndDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Date de fin</span>
                          <span className="text-sm font-medium">
                            {new Date(
                              (data as ScheduleEntry).recurrenceEndDate!,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Class Schedule Details */}
          {isClassSchedule && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <RiInformationLine className="h-4 w-4" />
                    Informations de la Classe
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Classe
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {(data as ClassSchedule).className}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Année académique
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {(data as ClassSchedule).academicYear}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Semestre
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {(data as ClassSchedule).semester}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Heures hebdomadaires
                      </p>
                      <p className="text-lg font-bold mt-1">
                        {(data as ClassSchedule).totalWeeklyHours.toFixed(1)}h
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <RiBookLine className="h-4 w-4" />
                    Matières et Enseignants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(data as ClassSchedule).subjects.map((subject, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {subject.subject}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {subject.teacherName}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {subject.weeklyHours.toFixed(1)}h/sem
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <RiBarChartLine className="h-4 w-4" />
                    Statistiques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold">
                        {(data as ClassSchedule).subjects.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Matières</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold">
                        {(data as ClassSchedule).schedule.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Sessions</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold">
                        {
                          new Set(
                            (data as ClassSchedule).subjects.map(
                              (s) => s.teacherId,
                            ),
                          ).size
                        }
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Enseignants
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Teacher Schedule Details */}
          {isTeacherSchedule && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <RiInformationLine className="h-4 w-4" />
                    Informations de l'Enseignant
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Enseignant
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {(data as TeacherSchedule).teacherName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Charge horaire
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium">
                          {(data as TeacherSchedule).totalWeeklyHours.toFixed(
                            1,
                          )}
                          h / {(data as TeacherSchedule).maxWeeklyHours}h
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Taux d'utilisation
                    </p>
                    <Progress
                      value={
                        ((data as TeacherSchedule).totalWeeklyHours /
                          (data as TeacherSchedule).maxWeeklyHours) *
                        100
                      }
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {(
                        ((data as TeacherSchedule).totalWeeklyHours /
                          (data as TeacherSchedule).maxWeeklyHours) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <RiBookLine className="h-4 w-4" />
                    Matières et Classes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Matières enseignées
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(data as TeacherSchedule).subjects.map(
                        (subject, index) => (
                          <Badge key={index} variant="outline">
                            {subject}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Classes
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(data as TeacherSchedule).classes.map(
                        (className, index) => (
                          <Badge key={index} variant="secondary">
                            {className}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <RiBarChartLine className="h-4 w-4" />
                    Répartition Hebdomadaire
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries((data as TeacherSchedule).workload).map(
                      ([day, hours]) => (
                        <div
                          key={day}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm capitalize">{day}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${(hours / 8) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-mono w-12 text-right">
                              {hours.toFixed(1)}h
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Statistiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold">
                        {(data as TeacherSchedule).subjects.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Matières</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold">
                        {(data as TeacherSchedule).classes.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Classes</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold">
                        {(data as TeacherSchedule).schedule.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Sessions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
