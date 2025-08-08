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
import { Separator } from "@/components/ui/separator";
import {
  RiBookLine,
  RiCalendarLine,
  RiFileTextLine,
  RiInformationLine,
  RiTimeLine,
  RiUserLine,
} from "@remixicon/react";
import type { Mark } from "./types";

interface MarkDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mark: Mark;
}

export function MarkDetailsDialog({
  open,
  onOpenChange,
  mark,
}: MarkDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RiFileTextLine className="h-5 w-5" />
            {mark.title}
          </DialogTitle>
          <DialogDescription>
            Detailed information about this assessment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <RiInformationLine className="h-4 w-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Subject
                  </p>
                  <Badge variant="outline" className="mt-1">
                    {mark.subject}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Class
                  </p>
                  <p className="text-sm font-medium mt-1">{mark.class}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Type
                  </p>
                  <Badge
                    variant={mark.type === "exam" ? "default" : "secondary"}
                    className="mt-1 capitalize"
                  >
                    {mark.type}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <Badge
                    variant={
                      mark.status === "published" ? "default" : "secondary"
                    }
                    className="mt-1 capitalize"
                  >
                    {mark.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Marks
                  </p>
                  <p className="text-lg font-bold mt-1">{mark.totalMarks}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Duration
                  </p>
                  <p className="text-sm font-medium mt-1">
                    {mark.duration
                      ? `${mark.duration} minutes`
                      : "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Date
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <RiCalendarLine className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      {new Date(mark.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {mark.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <RiBookLine className="h-4 w-4" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {mark.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          {mark.instructions && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <RiFileTextLine className="h-4 w-4" />
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {mark.instructions}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <RiUserLine className="h-4 w-4" />
                Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Created By
                </p>
                <p className="text-sm font-medium mt-1">{mark.createdBy}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Created At
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <RiTimeLine className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      {new Date(mark.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <RiTimeLine className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      {new Date(mark.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Mark ID
                </p>
                <p className="text-xs font-mono bg-muted px-2 py-1 rounded mt-1">
                  {mark.id}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold">0</p>
                  <p className="text-xs text-muted-foreground">Submissions</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold">0</p>
                  <p className="text-xs text-muted-foreground">Graded</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold">0%</p>
                  <p className="text-xs text-muted-foreground">Average</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
