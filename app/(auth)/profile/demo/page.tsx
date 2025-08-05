"use client";

import { AvatarUpload } from "@/components/profile/avatar-upload";
import { PreferenceSettings } from "@/components/profile/preference-settings";
import { ProfileCard } from "@/components/profile/profile-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  Settings,
  Users
} from "lucide-react";
import { useState } from "react";
// User type - will be replaced with actual API types
interface User {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

// Empty users array - will be populated from API
const mockUsers: User[] = [];

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.2 }
};

export default function ProfileDemoPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(mockUsers[0]);
  const [currentView, setCurrentView] = useState<"overview" | "cards" | "avatar" | "preferences">("overview");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleAvatarChange = (url: string | null) => {
    setAvatarUrl(url);
  };

  const handlePreferencesSave = (preferences: any) => {
    console.log("Preferences saved:", preferences);
  };

  const renderContent = () => {
    switch (currentView) {
      case "cards":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Profile Cards Demo</h2>
              <p className="text-muted-foreground mb-6">
                Different variations of profile cards for various use cases.
              </p>
            </div>

            <div className="space-y-8">
              {/* Full Profile Cards */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Full Profile Cards</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {mockUsers.slice(0, 4).map((user) => (
                    <ProfileCard
                      key={user.id}
                      user={user}
                      onEdit={() => console.log("Edit", user.id)}
                      onMessage={() => console.log("Message", user.id)}
                      onViewProfile={() => console.log("View Profile", user.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Compact Profile Cards */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Compact Profile Cards</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockUsers.slice(0, 6).map((user) => (
                    <ProfileCard
                      key={user.id}
                      user={user}
                      compact={true}
                      onViewProfile={() => console.log("View Profile", user.id)}
                      onMessage={() => console.log("Message", user.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "avatar":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Avatar Upload Demo</h2>
              <p className="text-muted-foreground mb-6">
                Interactive avatar upload component with different sizes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Small</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <AvatarUpload
                    currentAvatar={avatarUrl || selectedUser?.avatar}
                    userName={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : "Demo User"}
                    onAvatarChange={handleAvatarChange}
                    size="sm"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Medium</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <AvatarUpload
                    currentAvatar={avatarUrl || selectedUser?.avatar}
                    userName={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : "Demo User"}
                    onAvatarChange={handleAvatarChange}
                    size="md"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Large</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <AvatarUpload
                    currentAvatar={avatarUrl || selectedUser?.avatar}
                    userName={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : "Demo User"}
                    onAvatarChange={handleAvatarChange}
                    size="lg"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Extra Large</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <AvatarUpload
                    currentAvatar={avatarUrl || selectedUser?.avatar}
                    userName={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : "Demo User"}
                    onAvatarChange={handleAvatarChange}
                    size="xl"
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Non-editable Avatar</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <AvatarUpload
                  currentAvatar={avatarUrl || selectedUser?.avatar}
                  userName={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : "Demo User"}
                  onAvatarChange={handleAvatarChange}
                  size="lg"
                  editable={false}
                />
              </CardContent>
            </Card>
          </div>
        );

      case "preferences":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Preference Settings Demo</h2>
              <p className="text-muted-foreground mb-6">
                Comprehensive user preference management with real-time updates.
              </p>
            </div>

            <PreferenceSettings onSave={handlePreferencesSave} />
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-4">Profile Management Demo</h1>
              <p className="text-muted-foreground mb-6">
                This demo showcases the complete user profile management system including
                profile pages, components, and settings functionality.
              </p>
            </div>

            {/* Feature Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Profile Pages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Main profile page with tabs</li>
                    <li>• Profile editing with validation</li>
                    <li>• Settings page with preferences</li>
                    <li>• Role-based information display</li>
                    <li>• Responsive design</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Profile Components
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Reusable profile cards</li>
                    <li>• Avatar upload with preview</li>
                    <li>• Preference settings panel</li>
                    <li>• Status badges and indicators</li>
                    <li>• Contact information display</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Form validation with Zod</li>
                    <li>• Settings persistence</li>
                    <li>• Theme and language switching</li>
                    <li>• Notification preferences</li>
                    <li>• Privacy controls</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* User Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Demo User</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mockUsers.slice(0, 8).map((user) => (
                    <Button
                      key={user.id}
                      variant={selectedUser?.id === user.id ? "default" : "outline"}
                      className="h-auto p-3 flex flex-col items-center gap-2"
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {user.role}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected User Info */}
            {selectedUser && (
              <Card>
                <CardHeader>
                  <CardTitle>Selected User Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Basic Information</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">Name:</span> {selectedUser.firstName} {selectedUser.lastName}</p>
                        <p><span className="text-muted-foreground">Email:</span> {selectedUser.email}</p>
                        <p><span className="text-muted-foreground">Role:</span> {selectedUser.role}</p>
                        <p><span className="text-muted-foreground">Status:</span> {selectedUser.status}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Account Details</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">Created:</span> {selectedUser.createdAt.toLocaleDateString()}</p>
                        <p><span className="text-muted-foreground">Updated:</span> {selectedUser.updatedAt.toLocaleDateString()}</p>
                        <p><span className="text-muted-foreground">Email Verified:</span> {selectedUser.isEmailVerified ? "Yes" : "No"}</p>
                        <p><span className="text-muted-foreground">2FA Enabled:</span> {selectedUser.twoFactorEnabled ? "Yes" : "No"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation to Real Pages */}
            <Card>
              <CardHeader>
                <CardTitle>Try the Real Profile Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button asChild>
                    <a href="/profile">View Profile Page</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/profile/edit">Edit Profile Page</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/profile/settings">Settings Page</a>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Note: You need to be signed in to access the actual profile pages.
                </p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-background"
    >
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={currentView === "overview" ? "default" : "outline"}
              onClick={() => setCurrentView("overview")}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Overview
            </Button>
            <Button
              variant={currentView === "cards" ? "default" : "outline"}
              onClick={() => setCurrentView("cards")}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Profile Cards
            </Button>
            <Button
              variant={currentView === "avatar" ? "default" : "outline"}
              onClick={() => setCurrentView("avatar")}
              className="flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              Avatar Upload
            </Button>
            <Button
              variant={currentView === "preferences" ? "default" : "outline"}
              onClick={() => setCurrentView("preferences")}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Preferences
            </Button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
        >
          {renderContent()}
        </motion.div>
      </div>
    </motion.div>
  );
}