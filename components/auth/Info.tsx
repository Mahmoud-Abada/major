import React from "react";
import Image from "next/image";
import { 
  GlobeLock, 
  MessageCircleQuestion, 
  MessageCircleMore, 
  Newspaper, 
  BriefcaseBusiness, 
  CalendarRange, 
  Rss, 
  BellElectric, 
  MessageSquareHeart 
} from "lucide-react";

type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const studentFeatures: Feature[] = [
  { title: "Social Learning Hub", description: "Education meets social media for an engaging experience.", icon: <GlobeLock className="w-6 h-6 text-gray-600" /> },
  { title: "Interactive Classrooms", description: "Real-time discussions, Q&A, and shared resources. Unlock a new way to teach and learn.", icon: <MessageCircleQuestion className="w-6 h-6 text-gray-600" /> },
  { title: "Community & Chat", description: "Connect with students, teachers, and schools.", icon: <MessageCircleMore className="w-6 h-6 text-gray-600" /> },
  { title: "Live Sessions & Events", description: "Enables live broadcasts from teachers and schools, with real-time notifications for students.", icon: <Newspaper className="w-6 h-6 text-gray-600" /> },
];

const teacherFeatures: Feature[] = [
  { title: "Job Opportunities", description: "Links classes and schools with skilled teachers, streamlining the hiring process.", icon: <BriefcaseBusiness className="w-6 h-6 text-gray-600" /> },
  { title: "Task & Calendar System", description: "Organizes classes, exams, payments, events, tasks, and job interviews—all in one place.", icon: <CalendarRange className="w-6 h-6 text-gray-600" /> },
  { title: "Monetizable Courses", description: "Schools and teachers can upload, sell, manage content, and promote courses and events.", icon: <Rss className="w-6 h-6 text-gray-600" /> },
  { title: "Full School Management", description: "Attendance, billing, and administration made easy.", icon: <BellElectric className="w-6 h-6 text-gray-600" /> },
  { title: "Smart Content Feed", description: "Personalized learning, updates, and educational posts—an engaging alternative to traditional social media.", icon: <MessageSquareHeart className="w-6 h-6 text-gray-600" /> },
];

type InfoProps = {
  category: "students" | "teachers";
};

const Info: React.FC<InfoProps> = ({ category }) => {
  const features = category === "students" ? studentFeatures : teacherFeatures;
  return (
    <section className="max-w-[28rem] p-6 h-fit lg:h-[36.49rem]">
      {/* Logo + Title */}
      <div className="flex items-center space-x-3">
       <Image src={"/major-logo.svg"} alt={"major app"} width={100} height={94}/>
      </div>

      {/* Features List */}
      <div className="mt-6 space-y-4 hidden lg:block">
          {features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3 mt-6">
               <div className="w-[1.5rem] h-[1.5rem] text-[#47536B] opacity-100">
               {feature.icon}
               </div>
               <div className="space-y-0.5">
               <h3 className="text-sm font-semibold leading-[1.31rem] text-[#343942]">
                    {feature.title}
               </h3>
               <p className="text-sm font-normal leading-[1.25rem] text-[#47536B]">
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


