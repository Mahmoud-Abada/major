"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { cva, type VariantProps } from "class-variance-authority";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Archive, Edit, FileText, MoreVertical, Users } from "lucide-react";
import { ClassInfo } from "../../store/slices/classroom/dashboardSlice";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

// --- STYLING VARIANTS ---
const cardBorderVariants = cva("", {
  variants: {
    subjectType: {
      math: "border-blue-500",
      physics: "border-purple-500",
      chemistry: "border-green-500",
      history: "border-yellow-500",
    },
  },
});

interface ClassCardProps extends VariantProps<typeof cardBorderVariants> {
  info: ClassInfo;
}

export function ClassCard({ info }: ClassCardProps) {
  const t = useTranslations("Dashboard.classCard");

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card
        className={`overflow-hidden border-l-4 ${cardBorderVariants({ subjectType: info.subjectType })}`}
      >
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <CardTitle className="text-base font-bold">{info.subject}</CardTitle>
          <Badge variant="outline">{info.tag}</Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{info.level}</p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={info.teacher.avatarUrl}
                  alt={info.teacher.name}
                />
                <AvatarFallback>{info.teacher.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{info.teacher.name}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {info.studentCount} {t("students")}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                {t("attendance")}
              </Button>
              <Button variant="outline" size="sm">
                {t("payments")}
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">{t("options")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  {t("viewDetails")}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  {t("edit")}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                  <Archive className="mr-2 h-4 w-4" />
                  {t("archive")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
