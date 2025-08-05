"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  RiArrowLeftLine,
  RiDownloadLine,
  RiMoreLine,
  RiRefreshLine,
  RiSettingsLine,
  RiShareLine,
  RiUploadLine,
} from "@remixicon/react";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

export interface ActionBarAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "sm" | "default" | "lg";
  disabled?: boolean;
  loading?: boolean;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  shortcut?: string;
  hidden?: boolean;
  tooltip?: string;
}

export interface ActionBarProps {
  title?: string;
  subtitle?: string;
  backButton?: {
    label?: string;
    onClick: () => void;
    href?: string;
  };
  actions?: ActionBarAction[];
  primaryActions?: ActionBarAction[];
  secondaryActions?: ActionBarAction[];
  moreActions?: ActionBarAction[];
  selectedCount?: number;
  onRefresh?: () => void;
  refreshing?: boolean;
  className?: string;
  titleClassName?: string;
  actionsClassName?: string;
  variant?: "default" | "compact" | "minimal";
  sticky?: boolean;
  rtl?: boolean;
  showDivider?: boolean;
}

const actionBarVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.05,
    }
  },
};

const actionVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    }
  },
};

const selectedCountVariants = {
  hidden: { opacity: 0, scale: 0.8, x: -20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    x: -20,
    transition: { duration: 0.2 }
  },
};

export function ActionBar({
  title,
  subtitle,
  backButton,
  actions = [],
  primaryActions = [],
  secondaryActions = [],
  moreActions = [],
  selectedCount,
  onRefresh,
  refreshing = false,
  className,
  titleClassName,
  actionsClassName,
  variant = "default",
  sticky = false,
  rtl = false,
  showDivider = true,
}: ActionBarProps) {
  // Combine all actions if using the simple actions prop
  const allActions = React.useMemo(() => {
    if (actions.length > 0) {
      return actions;
    }
    return [...primaryActions, ...secondaryActions];
  }, [actions, primaryActions, secondaryActions]);

  // Filter visible actions
  const visibleActions = allActions.filter(action => !action.hidden);
  const visibleMoreActions = moreActions.filter(action => !action.hidden);

  // Render action button
  const renderAction = (action: ActionBarAction, inDropdown = false) => {
    const ButtonComponent = (
      <Button
        key={action.id}
        variant={action.variant || "outline"}
        size={action.size || "default"}
        onClick={action.onClick}
        disabled={action.disabled || action.loading}
        className={cn(
          "gap-2 transition-all duration-200",
          action.loading && "cursor-not-allowed",
          inDropdown && "w-full justify-start"
        )}
        title={action.tooltip}
      >
        {action.loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
        ) : (
          action.icon
        )}
        <span>{action.label}</span>
        {action.badge && (
          <Badge variant={action.badge.variant} className="ml-1">
            {action.badge.text}
          </Badge>
        )}
        {action.shortcut && !inDropdown && (
          <kbd className="ml-auto hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            {action.shortcut}
          </kbd>
        )}
      </Button>
    );

    return inDropdown ? (
      <DropdownMenuItem key={action.id} asChild>
        {ButtonComponent}
      </DropdownMenuItem>
    ) : (
      <motion.div key={action.id} variants={actionVariants}>
        {ButtonComponent}
      </motion.div>
    );
  };

  return (
    <motion.div
      variants={actionBarVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex items-center justify-between gap-4 p-4",
        variant === "compact" && "p-2",
        variant === "minimal" && "p-1",
        sticky && "sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        showDivider && "border-b",
        rtl && "flex-row-reverse",
        className
      )}
    >
      {/* Left Section - Title and Back Button */}
      <div className={cn(
        "flex items-center gap-4 min-w-0 flex-1",
        rtl && "flex-row-reverse"
      )}>
        {/* Back Button */}
        {backButton && (
          <motion.div variants={actionVariants}>
            <Button
              variant="ghost"
              size="sm"
              onClick={backButton.onClick}
              className="gap-2 flex-shrink-0"
            >
              <RiArrowLeftLine className={cn(
                "h-4 w-4",
                rtl && "rotate-180"
              )} />
              <span className="hidden sm:inline">
                {backButton.label || "Back"}
              </span>
            </Button>
          </motion.div>
        )}

        {/* Title Section */}
        {(title || subtitle) && (
          <div className={cn(
            "min-w-0 flex-1",
            rtl && "text-right",
            titleClassName
          )}>
            {title && (
              <h1 className={cn(
                "text-lg font-semibold truncate",
                variant === "compact" && "text-base",
                variant === "minimal" && "text-sm"
              )}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p className={cn(
                "text-sm text-muted-foreground truncate",
                variant === "compact" && "text-xs",
                variant === "minimal" && "text-xs"
              )}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Selected Count */}
        <AnimatePresence>
          {selectedCount !== undefined && selectedCount > 0 && (
            <motion.div
              variants={selectedCountVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-center gap-2"
            >
              <Badge variant="secondary" className="gap-1">
                <span>{selectedCount}</span>
                <span className="text-xs">selected</span>
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Section - Actions */}
      <div className={cn(
        "flex items-center gap-2 flex-shrink-0",
        rtl && "flex-row-reverse",
        actionsClassName
      )}>
        {/* Refresh Button */}
        {onRefresh && (
          <motion.div variants={actionVariants}>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={refreshing}
              className="gap-2"
              title="Refresh"
            >
              <RiRefreshLine className={cn(
                "h-4 w-4 transition-transform",
                refreshing && "animate-spin"
              )} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </motion.div>
        )}

        {/* Primary Actions */}
        {primaryActions.length > 0 && (
          <>
            <div className={cn(
              "hidden sm:flex items-center gap-2",
              rtl && "flex-row-reverse"
            )}>
              {primaryActions.filter(action => !action.hidden).map((action, index) => renderAction(action, false))}
            </div>
            {primaryActions.length > 0 && secondaryActions.length > 0 && (
              <Separator orientation="vertical" className="h-6 hidden sm:block" />
            )}
          </>
        )}

        {/* Secondary Actions */}
        {secondaryActions.length > 0 && (
          <div className={cn(
            "hidden md:flex items-center gap-2",
            rtl && "flex-row-reverse"
          )}>
            {secondaryActions.filter(action => !action.hidden).map((action, index) => renderAction(action, false))}
          </div>
        )}

        {/* Simple Actions (when not using primary/secondary) */}
        {actions.length > 0 && primaryActions.length === 0 && (
          <div className={cn(
            "hidden sm:flex items-center gap-2",
            rtl && "flex-row-reverse"
          )}>
            {visibleActions.slice(0, 3).map((action, index) => renderAction(action, false))}
          </div>
        )}

        {/* More Actions Dropdown */}
        {(visibleMoreActions.length > 0 || 
          (actions.length > 3 && primaryActions.length === 0) ||
          (variant === "compact" && visibleActions.length > 0)) && (
          <motion.div variants={actionVariants}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <RiMoreLine className="h-4 w-4" />
                  <span className="hidden sm:inline">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {/* Mobile-only primary actions */}
                <div className="sm:hidden">
                  {primaryActions.filter(action => !action.hidden).map(action => 
                    renderAction(action, true)
                  )}
                  {primaryActions.length > 0 && (secondaryActions.length > 0 || visibleMoreActions.length > 0) && (
                    <DropdownMenuSeparator />
                  )}
                </div>

                {/* Mobile-only secondary actions */}
                <div className="md:hidden">
                  {secondaryActions.filter(action => !action.hidden).map(action => 
                    renderAction(action, true)
                  )}
                  {secondaryActions.length > 0 && visibleMoreActions.length > 0 && (
                    <DropdownMenuSeparator />
                  )}
                </div>

                {/* Overflow actions from simple actions array */}
                {actions.length > 3 && primaryActions.length === 0 && (
                  <>
                    <div className="sm:hidden">
                      {visibleActions.slice(0, 3).map(action => 
                        renderAction(action, true)
                      )}
                      <DropdownMenuSeparator />
                    </div>
                    {visibleActions.slice(3).map(action => 
                      renderAction(action, true)
                    )}
                    {visibleMoreActions.length > 0 && <DropdownMenuSeparator />}
                  </>
                )}

                {/* More actions */}
                {visibleMoreActions.map(action => renderAction(action, true))}
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Preset action configurations
export const actionPresets = {
  crud: [
    {
      id: "create",
      label: "Create",
      icon: <RiUploadLine className="h-4 w-4" />,
      variant: "default" as const,
      onClick: () => {},
    },
    {
      id: "refresh",
      label: "Refresh",
      icon: <RiRefreshLine className="h-4 w-4" />,
      variant: "outline" as const,
      onClick: () => {},
    },
    {
      id: "export",
      label: "Export",
      icon: <RiDownloadLine className="h-4 w-4" />,
      variant: "outline" as const,
      onClick: () => {},
    },
  ],
  sharing: [
    {
      id: "share",
      label: "Share",
      icon: <RiShareLine className="h-4 w-4" />,
      variant: "outline" as const,
      onClick: () => {},
    },
    {
      id: "settings",
      label: "Settings",
      icon: <RiSettingsLine className="h-4 w-4" />,
      variant: "ghost" as const,
      onClick: () => {},
    },
  ],
};

// Hook for managing action bar state
export function useActionBar() {
  const [selectedCount, setSelectedCount] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = React.useCallback(async (refreshFn?: () => Promise<void>) => {
    setRefreshing(true);
    try {
      await refreshFn?.();
    } finally {
      setRefreshing(false);
    }
  }, []);

  const clearSelection = React.useCallback(() => {
    setSelectedCount(0);
  }, []);

  return {
    selectedCount,
    setSelectedCount,
    refreshing,
    handleRefresh,
    clearSelection,
  };
}