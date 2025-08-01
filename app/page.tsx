"use client";

import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Charts } from "@/components/dashboard/charts";
import { NotificationsPanel } from "@/components/dashboard/notifications-panel";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User } from "@/data/mock/users";
import { authService } from "@/lib/auth";
import { motion } from "framer-motion";
import {
    Calendar,
    Clock,
    Eye,
    Settings
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import LocaleSwitcher from "../components/common/LocaleSwicher";
import ThemeToggle from "../components/common/ThemeToggle";

// Welcome screen for non-authenticated users
function WelcomeScreen() {
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
            Welcome to <span className="text-yellow-600">MAJOR</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-2">
            Educational B2B SaaS Platform
          </p>
          <p className="text-lg text-gray-600">
            Connecting schools, teachers, students, and parents in one integrated ecosystem
          </p>
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
            <h3 className="text-xl font-semibold mb-2">Classroom Management</h3>
            <p className="text-gray-600">
              Organize classes, track attendance, and manage assignments efficiently
            </p>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-green-600 mb-4">
              <Eye className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
            <p className="text-gray-600">
              Monitor student progress and performance with detailed insights
            </p>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-purple-600 mb-4">
              <Settings className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Integrated Communication</h3>
            <p className="text-gray-600">
              Seamless communication between all educational stakeholders
            </p>
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
            <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 text-lg">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline" className="border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white px-8 py-3 text-lg">
              Sign Up
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}

// Dashboard for authenticated users
function Dashboard({ user }: { user: User }) {
  const currentTime = new Date();
  const greeting = currentTime.getHours() < 12 ? "Good morning" : 
                  currentTime.getHours() < 18 ? "Good afternoon" : "Good evening";

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const sectionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-background"
    >
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div variants={sectionVariants} className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.firstName} />
              <AvatarFallback>
                {user.firstName[0]}{user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {greeting}, {user.firstName}!
              </h1>
              <p className="text-muted-foreground">
                Welcome back to your {user.role} dashboard
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{currentTime.toLocaleDateString()}</span>
            </div>
            <Badge variant="outline" className="capitalize">
              {user.role}
            </Badge>
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={sectionVariants}>
          <StatsCards user={user} />
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={sectionVariants}>
          <QuickActions user={user} />
        </motion.div>

        {/* Charts */}
        <motion.div variants={sectionVariants}>
          <Charts user={user} />
        </motion.div>

        {/* Activity Feed and Notifications */}
        <motion.div variants={sectionVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityFeed user={user} />
          <NotificationsPanel user={user} />
        </motion.div>

        {/* Footer */}
        <motion.div variants={sectionVariants} className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            © 2024 MAJOR Academy. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  // Show dashboard if user is authenticated, otherwise show welcome screen
  return user ? <Dashboard user={user} /> : <WelcomeScreen />;
}
