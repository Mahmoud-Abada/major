"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiMoreLine,
} from "@remixicon/react";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

export interface MobileTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  disabled?: boolean;
  content: React.ReactNode;
}

export interface MobileTabsProps {
  tabs: MobileTab[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "pills" | "underline" | "cards";
  size?: "sm" | "default" | "lg";
  scrollable?: boolean;
  showMoreButton?: boolean;
  maxVisibleTabs?: number;
  className?: string;
  tabsListClassName?: string;
  tabsTriggerClassName?: string;
  tabsContentClassName?: string;
  rtl?: boolean;
  animationType?: "slide" | "fade" | "scale";
  swipeEnabled?: boolean;
}

const tabVariants = {
  slide: {
    initial: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    }),
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  },
  scale: {
    initial: { scale: 0.95, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  },
};

const sizeClasses = {
  sm: "h-8 px-2 text-sm",
  default: "h-9 px-3",
  lg: "h-10 px-4",
};

export function MobileTabs({
  tabs,
  defaultValue,
  value: controlledValue,
  onValueChange,
  orientation = "horizontal",
  variant = "default",
  size = "default",
  scrollable = true,
  showMoreButton = true,
  maxVisibleTabs = 4,
  className,
  tabsListClassName,
  tabsTriggerClassName,
  tabsContentClassName,
  rtl = false,
  animationType = "slide",
  swipeEnabled = true,
}: MobileTabsProps) {
  const [internalValue, setInternalValue] = React.useState(
    defaultValue || tabs[0]?.id || "",
  );
  const [direction, setDirection] = React.useState(0);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const currentValue = controlledValue ?? internalValue;
  const currentIndex = tabs.findIndex((tab) => tab.id === currentValue);

  const handleValueChange = (newValue: string) => {
    const newIndex = tabs.findIndex((tab) => tab.id === newValue);
    const oldIndex = currentIndex;

    setDirection(newIndex > oldIndex ? 1 : -1);

    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  // Touch handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!swipeEnabled) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeEnabled) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!swipeEnabled || !touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < tabs.length - 1) {
      handleValueChange(tabs[currentIndex + 1].id);
    }
    if (isRightSwipe && currentIndex > 0) {
      handleValueChange(tabs[currentIndex - 1].id);
    }
  };

  // Scroll active tab into view
  const scrollToActiveTab = React.useCallback(() => {
    if (!scrollRef.current) return;

    const activeTab = scrollRef.current.querySelector(
      `[data-tab-id="${currentValue}"]`,
    ) as HTMLElement;

    if (activeTab) {
      activeTab.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentValue]);

  React.useEffect(() => {
    scrollToActiveTab();
  }, [currentValue, scrollToActiveTab]);

  // Get visible and hidden tabs
  const visibleTabs = showMoreButton ? tabs.slice(0, maxVisibleTabs) : tabs;
  const hiddenTabs = showMoreButton ? tabs.slice(maxVisibleTabs) : [];

  // Render tab trigger
  const renderTabTrigger = (tab: MobileTab, isInDropdown = false) => {
    const isActive = currentValue === tab.id;

    return (
      <Button
        key={tab.id}
        variant={
          variant === "pills"
            ? isActive
              ? "default"
              : "ghost"
            : variant === "cards"
              ? isActive
                ? "default"
                : "outline"
              : "ghost"
        }
        size={size}
        disabled={tab.disabled}
        onClick={() => handleValueChange(tab.id)}
        data-tab-id={tab.id}
        className={cn(
          "relative flex-shrink-0 transition-all duration-200",
          sizeClasses[size],
          variant === "underline" && [
            "rounded-none border-b-2 border-transparent",
            isActive && "border-primary bg-transparent",
          ],
          variant === "cards" && "border",
          isActive && variant === "default" && "bg-muted",
          rtl && "flex-row-reverse",
          !isInDropdown && "min-w-0",
          tabsTriggerClassName,
        )}
        aria-selected={isActive}
        role="tab"
      >
        <div className="flex items-center gap-2 min-w-0">
          {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
          <span
            className={cn(
              "truncate",
              !isInDropdown && "max-w-[120px] sm:max-w-none",
            )}
          >
            {tab.label}
          </span>
          {tab.badge && (
            <Badge
              variant={tab.badge.variant}
              className="ml-1 h-4 px-1 text-xs"
            >
              {tab.badge.text}
            </Badge>
          )}
        </div>
      </Button>
    );
  };

  const currentTab = tabs.find((tab) => tab.id === currentValue);

  return (
    <div className={cn("w-full", className)}>
      {/* Tabs List */}
      <div
        className={cn(
          "relative",
          orientation === "horizontal"
            ? "border-b"
            : "border-r flex-col h-full",
          tabsListClassName,
        )}
      >
        {orientation === "horizontal" ? (
          <div className="flex items-center">
            {/* Scrollable tabs container */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea
                ref={scrollRef}
                className="w-full"
                orientation="horizontal"
              >
                <div
                  className={cn(
                    "flex items-center gap-1 p-1",
                    rtl && "flex-row-reverse",
                  )}
                >
                  {visibleTabs.map((tab) => renderTabTrigger(tab))}
                </div>
              </ScrollArea>
            </div>

            {/* Navigation arrows for mobile */}
            <div className="flex items-center gap-1 ml-2 sm:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (currentIndex > 0) {
                    handleValueChange(tabs[currentIndex - 1].id);
                  }
                }}
                disabled={currentIndex === 0}
                className="h-8 w-8 p-0"
              >
                <RiArrowLeftSLine className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (currentIndex < tabs.length - 1) {
                    handleValueChange(tabs[currentIndex + 1].id);
                  }
                }}
                disabled={currentIndex === tabs.length - 1}
                className="h-8 w-8 p-0"
              >
                <RiArrowRightSLine className="h-4 w-4" />
              </Button>
            </div>

            {/* More button */}
            {showMoreButton && hiddenTabs.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-2">
                    <RiMoreLine className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {hiddenTabs.map((tab) => (
                    <DropdownMenuItem
                      key={tab.id}
                      onClick={() => handleValueChange(tab.id)}
                      disabled={tab.disabled}
                      className="flex items-center gap-2"
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <Badge variant={tab.badge.variant} className="ml-auto">
                          {tab.badge.text}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ) : (
          // Vertical orientation
          <div className="flex flex-col gap-1 p-1">
            {tabs.map((tab) => renderTabTrigger(tab))}
          </div>
        )}
      </div>

      {/* Tabs Content */}
      <div
        className={cn(
          "relative overflow-hidden",
          orientation === "horizontal" ? "mt-4" : "ml-4 flex-1",
          tabsContentClassName,
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait" custom={direction}>
          {currentTab && (
            <motion.div
              key={currentValue}
              custom={direction}
              variants={tabVariants[animationType]}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              {currentTab.content}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Swipe indicator for mobile */}
      {swipeEnabled && orientation === "horizontal" && (
        <div className="flex justify-center mt-2 sm:hidden">
          <div className="flex gap-1">
            {tabs.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-1 w-6 rounded-full transition-colors",
                  index === currentIndex ? "bg-primary" : "bg-muted",
                )}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Preset configurations
export const mobileTabsPresets = {
  simple: {
    variant: "default" as const,
    showMoreButton: false,
    animationType: "fade" as const,
  },
  pills: {
    variant: "pills" as const,
    animationType: "slide" as const,
    swipeEnabled: true,
  },
  underline: {
    variant: "underline" as const,
    animationType: "slide" as const,
    scrollable: true,
  },
  cards: {
    variant: "cards" as const,
    animationType: "scale" as const,
    showMoreButton: true,
  },
};

// Hook for managing tab state
export function useMobileTabs(tabs: MobileTab[], defaultValue?: string) {
  const [value, setValue] = React.useState(defaultValue || tabs[0]?.id || "");

  const currentTab = tabs.find((tab) => tab.id === value);
  const currentIndex = tabs.findIndex((tab) => tab.id === value);

  const goToNext = () => {
    if (currentIndex < tabs.length - 1) {
      setValue(tabs[currentIndex + 1].id);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setValue(tabs[currentIndex - 1].id);
    }
  };

  const goToTab = (tabId: string) => {
    setValue(tabId);
  };

  return {
    value,
    setValue,
    currentTab,
    currentIndex,
    goToNext,
    goToPrevious,
    goToTab,
    canGoNext: currentIndex < tabs.length - 1,
    canGoPrevious: currentIndex > 0,
  };
}
