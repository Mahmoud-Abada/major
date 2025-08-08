"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { RiAddLine, RiCheckLine, RiExpandUpDownLine } from "@remixicon/react";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

export interface DropdownOption {
  id: string;
  label: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
  image?: string;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  disabled?: boolean;
  shortcut?: string;
}

export interface DropdownSelectorProps {
  options: DropdownOption[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  creatable?: boolean;
  onCreate?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  showImages?: boolean;
  showIcons?: boolean;
  showBadges?: boolean;
  showShortcuts?: boolean;
  maxHeight?: number;
  emptyMessage?: string;
  loading?: boolean;
  rtl?: boolean;
}

const sizeClasses = {
  sm: "h-8 px-2 text-sm",
  default: "h-9 px-3",
  lg: "h-10 px-4",
};

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      duration: 0.2,
      staggerChildren: 0.02,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

export function DropdownSelector({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  multiple = false,
  searchable = false,
  creatable = false,
  onCreate,
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
  size = "default",
  variant = "outline",
  align = "start",
  side = "bottom",
  showImages = true,
  showIcons = true,
  showBadges = true,
  showShortcuts = true,
  maxHeight = 300,
  emptyMessage = "No options found",
  loading = false,
  rtl = false,
}: DropdownSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Handle single/multiple values
  const selectedValues = React.useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  // Filter options based on search
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [options, searchQuery]);

  // Get selected option(s) for display
  const selectedOptions = React.useMemo(() => {
    return options.filter((option) => selectedValues.includes(option.value));
  }, [options, selectedValues]);

  // Handle option selection
  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onValueChange?.(newValues);
    } else {
      onValueChange?.(optionValue);
      setOpen(false);
    }
  };

  // Handle create new option
  const handleCreate = () => {
    if (searchQuery && onCreate) {
      onCreate(searchQuery);
      setSearchQuery("");
    }
  };

  // Focus search input when dropdown opens
  React.useEffect(() => {
    if (open && searchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [open, searchable]);

  // Render trigger content
  const renderTriggerContent = () => {
    if (selectedOptions.length === 0) {
      return (
        <span className="text-muted-foreground truncate">{placeholder}</span>
      );
    }

    if (multiple && selectedOptions.length > 1) {
      return (
        <div className="flex items-center gap-1">
          <span className="truncate">{selectedOptions[0].label}</span>
          <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
            +{selectedOptions.length - 1}
          </Badge>
        </div>
      );
    }

    const option = selectedOptions[0];
    return (
      <div className="flex items-center gap-2 min-w-0">
        {showImages && option.image && (
          <Avatar className="h-5 w-5">
            <AvatarImage src={option.image} alt={option.label} />
            <AvatarFallback className="text-xs">
              {option.label.charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
        {showIcons && option.icon && (
          <span className="flex-shrink-0">{option.icon}</span>
        )}
        <span className="truncate">{option.label}</span>
        {showBadges && option.badge && (
          <Badge variant={option.badge.variant} className="ml-auto">
            {option.badge.text}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className={cn("relative", className)}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            disabled={disabled}
            className={cn(
              "justify-between font-normal",
              sizeClasses[size],
              rtl && "flex-row-reverse",
              triggerClassName,
            )}
            aria-expanded={open}
            aria-haspopup="listbox"
          >
            <div className="flex-1 min-w-0">{renderTriggerContent()}</div>
            <RiExpandUpDownLine
              className={cn(
                "h-4 w-4 opacity-50 transition-transform duration-200",
                open && "rotate-180",
                rtl ? "mr-2" : "ml-2",
              )}
            />
          </Button>
        </DropdownMenuTrigger>

        <AnimatePresence>
          {open && (
            <DropdownMenuContent
              align={align}
              side={side}
              className={cn(
                "w-[--radix-dropdown-menu-trigger-width] min-w-56 p-0",
                contentClassName,
              )}
              asChild
            >
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div
                  className="max-h-[300px] overflow-y-auto"
                  style={{ maxHeight }}
                >
                  {/* Search Input */}
                  {searchable && (
                    <div className="p-2 border-b">
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-2 py-1 text-sm bg-transparent border-0 outline-none placeholder:text-muted-foreground"
                        dir={rtl ? "rtl" : "ltr"}
                      />
                    </div>
                  )}

                  {/* Loading State */}
                  {loading && (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto"></div>
                      <span className="text-sm text-muted-foreground mt-2">
                        Loading...
                      </span>
                    </div>
                  )}

                  {/* Options */}
                  {!loading && (
                    <motion.div variants={dropdownVariants}>
                      {filteredOptions.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          {emptyMessage}
                        </div>
                      ) : (
                        <>
                          {multiple && (
                            <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                              Select multiple options
                            </DropdownMenuLabel>
                          )}

                          {filteredOptions.map((option, index) => {
                            const isSelected = selectedValues.includes(
                              option.value,
                            );

                            return (
                              <motion.div
                                key={option.id}
                                variants={itemVariants}
                              >
                                <DropdownMenuItem
                                  onClick={() => handleSelect(option.value)}
                                  disabled={option.disabled}
                                  className={cn(
                                    "flex items-center gap-2 px-2 py-1.5 cursor-pointer",
                                    isSelected && "bg-accent",
                                    rtl && "flex-row-reverse",
                                  )}
                                >
                                  {/* Selection Indicator */}
                                  {multiple && (
                                    <div
                                      className={cn(
                                        "flex h-4 w-4 items-center justify-center rounded-sm border",
                                        isSelected
                                          ? "bg-primary border-primary text-primary-foreground"
                                          : "border-muted-foreground/30",
                                      )}
                                    >
                                      {isSelected && (
                                        <RiCheckLine className="h-3 w-3" />
                                      )}
                                    </div>
                                  )}

                                  {/* Image */}
                                  {showImages && option.image && (
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage
                                        src={option.image}
                                        alt={option.label}
                                      />
                                      <AvatarFallback className="text-xs">
                                        {option.label.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                  )}

                                  {/* Icon */}
                                  {showIcons && option.icon && (
                                    <span className="flex-shrink-0">
                                      {option.icon}
                                    </span>
                                  )}

                                  {/* Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">
                                      {option.label}
                                    </div>
                                    {option.description && (
                                      <div className="text-xs text-muted-foreground truncate">
                                        {option.description}
                                      </div>
                                    )}
                                  </div>

                                  {/* Badge */}
                                  {showBadges && option.badge && (
                                    <Badge
                                      variant={option.badge.variant}
                                      className="ml-auto"
                                    >
                                      {option.badge.text}
                                    </Badge>
                                  )}

                                  {/* Shortcut */}
                                  {showShortcuts && option.shortcut && (
                                    <DropdownMenuShortcut>
                                      {option.shortcut}
                                    </DropdownMenuShortcut>
                                  )}

                                  {/* Single Selection Indicator */}
                                  {!multiple && isSelected && (
                                    <RiCheckLine className="h-4 w-4 text-primary" />
                                  )}
                                </DropdownMenuItem>
                              </motion.div>
                            );
                          })}
                        </>
                      )}

                      {/* Create New Option */}
                      {creatable &&
                        searchQuery &&
                        !filteredOptions.some(
                          (opt) =>
                            opt.label.toLowerCase() ===
                            searchQuery.toLowerCase(),
                        ) && (
                          <>
                            <DropdownMenuSeparator />
                            <motion.div variants={itemVariants}>
                              <DropdownMenuItem
                                onClick={handleCreate}
                                className="flex items-center gap-2 px-2 py-1.5 cursor-pointer"
                              >
                                <RiAddLine className="h-4 w-4" />
                                <span>Create "{searchQuery}"</span>
                              </DropdownMenuItem>
                            </motion.div>
                          </>
                        )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </DropdownMenuContent>
          )}
        </AnimatePresence>
      </DropdownMenu>
    </div>
  );
}

// Preset configurations for common use cases
export const presets = {
  simple: {
    showImages: false,
    showIcons: false,
    showBadges: false,
    showShortcuts: false,
  },
  withIcons: {
    showImages: false,
    showIcons: true,
    showBadges: false,
    showShortcuts: false,
  },
  withImages: {
    showImages: true,
    showIcons: false,
    showBadges: true,
    showShortcuts: false,
  },
  full: {
    showImages: true,
    showIcons: true,
    showBadges: true,
    showShortcuts: true,
  },
};

// Helper function to create options from simple arrays
export function createOptions(
  items: string[] | Array<{ label: string; value: string; [key: string]: any }>,
): DropdownOption[] {
  return items.map((item, index) => {
    if (typeof item === "string") {
      return {
        id: `option-${index}`,
        label: item,
        value: item.toLowerCase().replace(/\s+/g, "-"),
      };
    }
    return {
      id: `option-${index}`,
      ...item,
    };
  });
}
