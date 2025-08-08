"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AllPostsView } from "./all-posts-view";
import { AnalyticsView } from "./analytics-view";
import { ClassesView } from "./classes-view";
import { PostsStats } from "./posts-stats";
import { StudentsView } from "./students-view";

export function PostsContent() {
  const t = useTranslations("posts");
  const [activeTab, setActiveTab] = useState("all-posts");

  return (
    <div className="flex flex-col space-y-4 md:space-y-6 p-2 md:p-4">
      <div className="flex flex-col xl:flex-row gap-4 md:gap-6">
        <div className="flex-1 min-w-0">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            {/* Mobile: Scrollable tabs */}
            <div className="overflow-x-auto">
              <TabsList className="grid w-full grid-cols-4 min-w-[400px] md:min-w-0">
                <TabsTrigger
                  value="all-posts"
                  className="text-xs md:text-sm px-2 md:px-4 whitespace-nowrap"
                >
                  {t("allPosts")}
                </TabsTrigger>
                <TabsTrigger
                  value="classes"
                  className="text-xs md:text-sm px-2 md:px-4 whitespace-nowrap"
                >
                  {t("byClass")}
                </TabsTrigger>
                <TabsTrigger
                  value="students"
                  className="text-xs md:text-sm px-2 md:px-4 whitespace-nowrap"
                >
                  {t("students")}
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="text-xs md:text-sm px-2 md:px-4 whitespace-nowrap"
                >
                  {t("analytics")}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all-posts" className="space-y-4 mt-4">
              <AllPostsView />
            </TabsContent>

            <TabsContent value="classes" className="space-y-4 mt-4">
              <ClassesView />
            </TabsContent>

            <TabsContent value="students" className="space-y-4 mt-4">
              <StudentsView />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4 mt-4">
              <AnalyticsView />
            </TabsContent>
          </Tabs>
        </div>

        {/* Stats sidebar - responsive */}
        <div className="xl:w-80 w-full">
          <div className="sticky top-4">
            <PostsStats />
          </div>
        </div>
      </div>
    </div>
  );
}
