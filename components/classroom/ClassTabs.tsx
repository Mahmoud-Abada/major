"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import {
  ClassInfo,
  selectClasses,
  selectEvents,
  selectGroups,
} from "../../store/slices/classroom/dashboardSlice";
import { ClassCard } from "./ClassCard";

export function ClassTabs() {
  const t = useTranslations("Dashboard.tabs");
  const classes = useSelector(selectClasses);
  const groups = useSelector(selectGroups);
  const events = useSelector(selectEvents);

  const renderGrid = (items: ClassInfo[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map((item) => (
        <ClassCard key={item.id} info={item} />
      ))}
    </div>
  );

  return (
    <Tabs defaultValue="classes" className="w-full">
      <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
        <TabsTrigger value="classes">{t("classes")}</TabsTrigger>
        <TabsTrigger value="groups">{t("groups")}</TabsTrigger>
        <TabsTrigger value="events">{t("events")}</TabsTrigger>
      </TabsList>
      <TabsContent value="classes" className="mt-4">
        {renderGrid(classes)}
      </TabsContent>
      <TabsContent value="groups" className="mt-4">
        {renderGrid(groups)}
      </TabsContent>
      <TabsContent value="events" className="mt-4">
        {renderGrid(events)}
      </TabsContent>
    </Tabs>
  );
}
