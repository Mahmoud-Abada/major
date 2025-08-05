"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { storage, themeStorage } from "@/lib/storage";
import { motion } from "framer-motion";
import {
  Bell,
  BookOpen,
  Calendar,
  Languages,
  Mail,
  MessageSquare,
  Monitor,
  Moon,
  Palette,
  Shield,
  Smartphone,
  Sun,
  TrendingUp
} from "lucide-react";
import { useEffect, useState } from "react";

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  inApp: boolean;
  classroomUpdates: boolean;
  gradeUpdates: boolean;
  attendanceAlerts: boolean;
  systemAnnouncements: boolean;
  marketingEmails: boolean;
  weeklyDigest: boolean;
}

interface DisplayPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  fontSize: number;
  compactMode: boolean;
  animationsEnabled: boolean;
  soundEnabled: boolean;
  highContrast: boolean;
}

interface PrivacyPreferences {
  profileVisibility: "public" | "private" | "contacts";
  showEmail: boolean;
  showPhone: boolean;
  showLastSeen: boolean;
  allowDirectMessages: boolean;
  showOnlineStatus: boolean;
  dataCollection: boolean;
  analyticsOptOut: boolean;
}

interface PreferenceSettingsProps {
  onSave?: (preferences: any) => void;
  className?: string;
}

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

export function PreferenceSettings({ onSave, className = "" }: PreferenceSettingsProps) {
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    email: true,
    push: true,
    sms: false,
    inApp: true,
    classroomUpdates: true,
    gradeUpdates: true,
    attendanceAlerts: true,
    systemAnnouncements: true,
    marketingEmails: false,
    weeklyDigest: true,
  });

  const [display, setDisplay] = useState<DisplayPreferences>({
    theme: "system",
    language: "en",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    fontSize: 14,
    compactMode: false,
    animationsEnabled: true,
    soundEnabled: true,
    highContrast: false,
  });

  const [privacy, setPrivacy] = useState<PrivacyPreferences>({
    profileVisibility: "contacts",
    showEmail: false,
    showPhone: false,
    showLastSeen: true,
    allowDirectMessages: true,
    showOnlineStatus: true,
    dataCollection: true,
    analyticsOptOut: false,
  });

  useEffect(() => {
    // Load saved preferences
    const savedTheme = themeStorage.getTheme();
    const savedLanguage = themeStorage.getLanguage();
    
    setDisplay(prev => ({
      ...prev,
      theme: savedTheme as "light" | "dark" | "system",
      language: savedLanguage,
    }));

    // Load other preferences from storage
    const savedNotifications = storage.getLocal<NotificationPreferences>("notification_preferences");
    const savedPrivacy = storage.getLocal<PrivacyPreferences>("privacy_preferences");
    const savedDisplay = storage.getLocal<DisplayPreferences>("display_preferences");

    if (savedNotifications) setNotifications(savedNotifications);
    if (savedPrivacy) setPrivacy(savedPrivacy);
    if (savedDisplay) setDisplay(prev => ({ ...prev, ...savedDisplay }));
  }, []);

  const handleNotificationChange = (key: keyof NotificationPreferences, value: boolean) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    storage.setLocal("notification_preferences", updated);
    
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleDisplayChange = (key: keyof DisplayPreferences, value: any) => {
    const updated = { ...display, [key]: value };
    setDisplay(updated);
    storage.setLocal("display_preferences", updated);

    // Save theme and language to their specific storage
    if (key === "theme") {
      themeStorage.setTheme(value);
    }
    if (key === "language") {
      themeStorage.setLanguage(value);
    }
    
    toast({
      title: "Display Settings Updated",
      description: "Your display preferences have been saved.",
    });
  };

  const handlePrivacyChange = (key: keyof PrivacyPreferences, value: boolean | string) => {
    const updated = { ...privacy, [key]: value };
    setPrivacy(updated);
    storage.setLocal("privacy_preferences", updated);
    
    toast({
      title: "Privacy Settings Updated",
      description: "Your privacy preferences have been saved.",
    });
  };

  const handleSaveAll = () => {
    const allPreferences = {
      notifications,
      display,
      privacy,
    };

    if (onSave) {
      onSave(allPreferences);
    }

    toast({
      title: "All Settings Saved",
      description: "Your preferences have been successfully saved.",
    });
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Notifications */}
      <motion.div variants={cardVariants} initial="initial" animate="animate">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Notification Channels */}
            <div className="space-y-4">
              <h4 className="font-medium">Notification Channels</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="email-notifications">Email</Label>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notifications.email}
                    onCheckedChange={(checked) => 
                      handleNotificationChange("email", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="push-notifications">Push</Label>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notifications.push}
                    onCheckedChange={(checked) => 
                      handleNotificationChange("push", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="sms-notifications">SMS</Label>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={notifications.sms}
                    onCheckedChange={(checked) => 
                      handleNotificationChange("sms", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="in-app-notifications">In-App</Label>
                  </div>
                  <Switch
                    id="in-app-notifications"
                    checked={notifications.inApp}
                    onCheckedChange={(checked) => 
                      handleNotificationChange("inApp", checked)
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Notification Types */}
            <div className="space-y-4">
              <h4 className="font-medium">Notification Types</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label htmlFor="classroom-updates">Classroom Updates</Label>
                      <p className="text-xs text-muted-foreground">New posts, assignments, and announcements</p>
                    </div>
                  </div>
                  <Switch
                    id="classroom-updates"
                    checked={notifications.classroomUpdates}
                    onCheckedChange={(checked) => 
                      handleNotificationChange("classroomUpdates", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label htmlFor="grade-updates">Grade Updates</Label>
                      <p className="text-xs text-muted-foreground">New grades and feedback</p>
                    </div>
                  </div>
                  <Switch
                    id="grade-updates"
                    checked={notifications.gradeUpdates}
                    onCheckedChange={(checked) => 
                      handleNotificationChange("gradeUpdates", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label htmlFor="attendance-alerts">Attendance Alerts</Label>
                      <p className="text-xs text-muted-foreground">Attendance reminders and updates</p>
                    </div>
                  </div>
                  <Switch
                    id="attendance-alerts"
                    checked={notifications.attendanceAlerts}
                    onCheckedChange={(checked) => 
                      handleNotificationChange("attendanceAlerts", checked)
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Display Settings */}
      <motion.div variants={cardVariants} initial="initial" animate="animate">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Display & Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme and Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={display.theme}
                  onValueChange={(value) => handleDisplayChange("theme", value)}
                >
                  <SelectTrigger>
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        {getThemeIcon(display.theme)}
                        <span className="capitalize">{display.theme}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={display.language}
                  onValueChange={(value) => handleDisplayChange("language", value)}
                >
                  <SelectTrigger>
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <Languages className="h-4 w-4" />
                        <span>
                          {display.language === "en" ? "English" :
                           display.language === "ar" ? "العربية" :
                           display.language === "fr" ? "Français" : "English"}
                        </span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Font Size */}
            <div className="space-y-3">
              <Label htmlFor="font-size">Font Size: {display.fontSize}px</Label>
              <Slider
                id="font-size"
                min={12}
                max={20}
                step={1}
                value={[display.fontSize]}
                onValueChange={(value) => handleDisplayChange("fontSize", value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>

            <Separator />

            {/* Display Options */}
            <div className="space-y-4">
              <h4 className="font-medium">Display Options</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compact-mode">Compact Mode</Label>
                    <p className="text-xs text-muted-foreground">Reduce spacing and padding</p>
                  </div>
                  <Switch
                    id="compact-mode"
                    checked={display.compactMode}
                    onCheckedChange={(checked) => 
                      handleDisplayChange("compactMode", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="animations-enabled">Animations</Label>
                    <p className="text-xs text-muted-foreground">Enable smooth transitions</p>
                  </div>
                  <Switch
                    id="animations-enabled"
                    checked={display.animationsEnabled}
                    onCheckedChange={(checked) => 
                      handleDisplayChange("animationsEnabled", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sound-enabled">Sound Effects</Label>
                    <p className="text-xs text-muted-foreground">Play notification sounds</p>
                  </div>
                  <Switch
                    id="sound-enabled"
                    checked={display.soundEnabled}
                    onCheckedChange={(checked) => 
                      handleDisplayChange("soundEnabled", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="high-contrast">High Contrast</Label>
                    <p className="text-xs text-muted-foreground">Improve visibility</p>
                  </div>
                  <Switch
                    id="high-contrast"
                    checked={display.highContrast}
                    onCheckedChange={(checked) => 
                      handleDisplayChange("highContrast", checked)
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Privacy Settings */}
      <motion.div variants={cardVariants} initial="initial" animate="animate">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Visibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="profile-visibility">Profile Visibility</Label>
              <Select
                value={privacy.profileVisibility}
                onValueChange={(value) => 
                  handlePrivacyChange("profileVisibility", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Anyone can see</SelectItem>
                  <SelectItem value="contacts">Contacts Only</SelectItem>
                  <SelectItem value="private">Private - Only me</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Contact Information</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-email">Show Email Address</Label>
                    <p className="text-xs text-muted-foreground">Allow others to see your email</p>
                  </div>
                  <Switch
                    id="show-email"
                    checked={privacy.showEmail}
                    onCheckedChange={(checked) => 
                      handlePrivacyChange("showEmail", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-phone">Show Phone Number</Label>
                    <p className="text-xs text-muted-foreground">Allow others to see your phone</p>
                  </div>
                  <Switch
                    id="show-phone"
                    checked={privacy.showPhone}
                    onCheckedChange={(checked) => 
                      handlePrivacyChange("showPhone", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-online-status">Show Online Status</Label>
                    <p className="text-xs text-muted-foreground">Let others see when you're online</p>
                  </div>
                  <Switch
                    id="show-online-status"
                    checked={privacy.showOnlineStatus}
                    onCheckedChange={(checked) => 
                      handlePrivacyChange("showOnlineStatus", checked)
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save All Button */}
      <motion.div variants={cardVariants} initial="initial" animate="animate">
        <div className="flex justify-end">
          <Button onClick={handleSaveAll} size="lg">
            Save All Preferences
          </Button>
        </div>
      </motion.div>
    </div>
  );
}