"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated, selectUser } from "@/store/slices/authSlice";
import { motion } from "framer-motion";
import { Calendar, Eye, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LocaleSwitcher from "../components/common/LocaleSwicher";
import ThemeToggle from "../components/common/ThemeToggle";

// Welcome screen for non-authenticated users
function WelcomeScreen() {
  const t = useTranslations("welcome");
  const tNav = useTranslations("navigation");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>

        {/* Logo and Title */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-2">
            {t("subtitle")}
          </p>
          <p className="text-lg text-gray-600">{t("description")}</p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-blue-600 mb-4">
              <Calendar className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {t("classroomManagement")}
            </h3>
            <p className="text-gray-600">{t("classroomManagementDesc")}</p>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-green-600 mb-4">
              <Eye className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {t("realTimeAnalytics")}
            </h3>
            <p className="text-gray-600">{t("realTimeAnalyticsDesc")}</p>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-purple-600 mb-4">
              <Settings className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {t("integratedCommunication")}
            </h3>
            <p className="text-gray-600">{t("integratedCommunicationDesc")}</p>
          </Card>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/signin">
            <Button
              size="lg"
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 text-lg"
            >
              {tNav("signin")}
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              size="lg"
              variant="outline"
              className="border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white px-8 py-3 text-lg"
            >
              {tNav("signup")}
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}



export default function Home() {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    // If user is authenticated, redirect to the classroom dashboard
    if (isAuthenticated && user) {
      router.push("/classroom/dashboard");
    }
  }, [isAuthenticated, user, router]);

  // Show welcome screen for non-authenticated users
  return <WelcomeScreen />;
}
