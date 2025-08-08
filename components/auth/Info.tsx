"use client";

import {
  BellElectric,
  BriefcaseBusiness,
  CalendarRange,
  GlobeLock,
  MessageCircleMore,
  MessageCircleQuestion,
  MessageSquareHeart,
  Newspaper,
  Rss,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";

type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const Info = () => {
  const { theme } = useTheme();
  const t = useTranslations("auth");
  const selectedRole = "student"; // Default to student for now

  const studentFeatures: Feature[] = [
    {
      title: t("studentFeatures.socialLearning"),
      description: t("studentFeatures.socialLearningDesc"),
      icon: <GlobeLock className="w-6 h-6" />,
    },
    {
      title: t("studentFeatures.interactiveClass"),
      description: t("studentFeatures.interactiveClassDesc"),
      icon: <MessageCircleQuestion className="w-6 h-6" />,
    },
    {
      title: t("studentFeatures.community"),
      description: t("studentFeatures.communityDesc"),
      icon: <MessageCircleMore className="w-6 h-6" />,
    },
    {
      title: t("studentFeatures.liveSessions"),
      description: t("studentFeatures.liveSessionsDesc"),
      icon: <Newspaper className="w-6 h-6" />,
    },
  ];

  const teacherFeatures: Feature[] = [
    {
      title: t("teacherFeatures.jobOpportunities"),
      description: t("teacherFeatures.jobOpportunitiesDesc"),
      icon: <BriefcaseBusiness className="w-6 h-6" />,
    },
    {
      title: t("teacherFeatures.calendarSystem"),
      description: t("teacherFeatures.calendarSystemDesc"),
      icon: <CalendarRange className="w-6 h-6" />,
    },
    {
      title: t("teacherFeatures.monetizableCourses"),
      description: t("teacherFeatures.monetizableCoursesDesc"),
      icon: <Rss className="w-6 h-6" />,
    },
    {
      title: t("teacherFeatures.schoolManagement"),
      description: t("teacherFeatures.schoolManagementDesc"),
      icon: <BellElectric className="w-6 h-6" />,
    },
    {
      title: t("teacherFeatures.smartContent"),
      description: t("teacherFeatures.smartContentDesc"),
      icon: <MessageSquareHeart className="w-6 h-6" />,
    },
  ];

  const features =
    selectedRole === "student" ? studentFeatures : teacherFeatures;

  return (
    <section className="w-full max-w-[28rem] p-6 py-8 h-fit lg:h-[36.49rem] hidden lg:block">
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <Image
          src={"/major-logo.svg"}
          alt={"major app"}
          width={100}
          height={94}
        />
      </div>

      <div className="mt-6 space-y-6 lg:space-y-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 rtl:space-x-reverse mt-6"
          >
            <div
              className={`w-[1.5rem] h-[1.5rem] flex-shrink-0 ${
                theme === "dark" ? "text-neutral-300" : "text-[#47536B]"
              }`}
            >
              {feature.icon}
            </div>
            <div className="space-y-0.5 flex-1">
              <h3
                className={`text-sm font-semibold leading-[1.31rem] ${
                  theme === "dark" ? "text-neutral-100" : "text-[#343942]"
                }`}
              >
                {feature.title}
              </h3>
              <p
                className={`text-sm font-normal leading-[1.25rem] ${
                  theme === "dark" ? "text-neutral-300" : "text-[#47536B]"
                }`}
              >
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Info;
