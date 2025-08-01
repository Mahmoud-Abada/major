"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
    RiArrowDownSLine,
    RiCalendarLine,
    RiCloseLine,
    RiFilter3Line,
    RiMapPinLine,
    RiSearch2Line,
    RiTagLine,
    RiUserLine,
} from "@remixicon/react";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
  disabled?: boolean;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: "checkbox" | "radio" | "select" | "date" | "range";
  options?: FilterOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  multiple?: boolean;
  searchable?: boolean;
}

export interface SearchFilterProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterGroup[];
  activeFilters?: Record<string, any>;
  onFiltersChange?: (filters: Record<string, any>) => void;
  showFilterCount?: boolean;
  showClearAll?: boolean;
  className?: string;
  searchClassName?: string;
  filterButtonClassName?: string;
  rtl?: boolean;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "compact" | "expanded";
  loading?: boolean;
  disabled?: boolean;
}

const sizeClasses = {
  sm: "h-8 text-sm",
  default: "h-9",
  lg: "h-10 text-base",
};

const filterVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", duration: 0.2 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: -10,
    transition: { duration: 0.15 }
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 500, damping: 30 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: 0.2 }
  },
};

export function SearchFilter({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  activeFilters = {},
  onFiltersChange,
  showFilterCount = true,
  showClearAll = true,
  className,
  searchClassName,
  filterButtonClassName,
  rtl = false,
  size = "default",
  variant = "default",
  loading = false,
  disabled = false,
}: SearchFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [searchFocused, setSearchFocused] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Calculate active filter count
  const activeFilterCount = React.useMemo(() => {
    return Object.values(activeFilters).filter((value) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== "";
    }).length;
  }, [activeFilters]);

  // Handle filter change
  const handleFilterChange = (filterId: string, value: any) => {
    const newFilters = { ...activeFilters, [filterId]: value };
    onFiltersChange?.(newFilters);
  };

  // Clear all filters
  const handleClearAll = () => {
    onFiltersChange?.({});
    onSearchChange?.("");
  };

  // Clear specific filter
  const handleClearFilter = (filterId: string) => {
    const newFilters = { ...activeFilters };
    delete newFilters[filterId];
    onFiltersChange?.(newFilters);
  };

  // Get filter display value
  const getFilterDisplayValue = (filter: FilterGroup, value: any) => {
    if (!value) return null;
    
    if (Array.isArray(value)) {
      if (value.length === 0) return null;
      if (value.length === 1) {
        const option = filter.options?.find(opt => opt.value === value[0]);
        return option?.label || value[0];
      }
      return `${value.length} selected`;
    }
    
    const option = filter.options?.find(opt => opt.value === value);
    return option?.label || value;
  };

  // Render filter control
  const renderFilterControl = (filter: FilterGroup) => {
    const value = activeFilters[filter.id];

    switch (filter.type) {
      case "checkbox":
        return (
          <div className="space-y-3">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filter.options?.map((option) => {
                const isChecked = Array.isArray(value) 
                  ? value.includes(option.value)
                  : value === option.value;
                
                return (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${filter.id}-${option.value}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        if (filter.multiple) {
                          const currentValues = Array.isArray(value) ? value : [];
                          const newValues = checked
                            ? [...currentValues, option.value]
                            : currentValues.filter(v => v !== option.value);
                          handleFilterChange(filter.id, newValues);
                        } else {
                          handleFilterChange(filter.id, checked ? option.value : null);
                        }
                      }}
                      disabled={option.disabled}
                    />
                    <Label
                      htmlFor={`${filter.id}-${option.value}`}
                      className="flex-1 text-sm font-normal cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.label}</span>
                        {option.count !== undefined && (
                          <span className="text-xs text-muted-foreground">
                            {option.count}
                          </span>
                        )}
                      </div>
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "radio":
        return (
          <div className="space-y-3">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <RadioGroup
              value={value || ""}
              onValueChange={(newValue) => handleFilterChange(filter.id, newValue)}
            >
              {filter.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`${filter.id}-${option.value}`}
                    disabled={option.disabled}
                  />
                  <Label
                    htmlFor={`${filter.id}-${option.value}`}
                    className="flex-1 text-sm font-normal cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.label}</span>
                      {option.count !== undefined && (
                        <span className="text-xs text-muted-foreground">
                          {option.count}
                        </span>
                      )}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case "select":
        return (
          <div className="space-y-3">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <Select
              value={value || ""}
              onValueChange={(newValue) => handleFilterChange(filter.id, newValue)}
            >
              <SelectTrigger>
                <SelectValue placeholder={filter.placeholder || "Select..."} />
              </SelectTrigger>
              <SelectContent>
                {filter.options?.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{option.label}</span>
                      {option.count !== undefined && (
                        <span className="text-xs text-muted-foreground ml-2">
                          {option.count}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case "date":
        return (
          <div className="space-y-3">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <Input
              type="date"
              value={value || ""}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
              placeholder={filter.placeholder}
            />
          </div>
        );

      case "range":
        return (
          <div className="space-y-3">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="Min"
                value={value?.min || ""}
                onChange={(e) => handleFilterChange(filter.id, {
                  ...value,
                  min: e.target.value
                })}
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="number"
                placeholder="Max"
                value={value?.max || ""}
                onChange={(e) => handleFilterChange(filter.id, {
                  ...value,
                  max: e.target.value
                })}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Input
          ref={searchInputRef}
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          disabled={disabled || loading}
          className={cn(
            "pl-10 pr-10 transition-all duration-200",
            sizeClasses[size],
            searchFocused && "ring-2 ring-primary/20",
            rtl && "text-right",
            searchClassName
          )}
          dir={rtl ? "rtl" : "ltr"}
        />
        
        {/* Search Icon */}
        <div className={cn(
          "absolute inset-y-0 flex items-center pointer-events-none",
          rtl ? "right-3" : "left-3"
        )}>
          <RiSearch2Line className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Clear Search */}
        {searchValue && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={cn(
              "absolute inset-y-0 flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors",
              rtl ? "left-1" : "right-1"
            )}
            onClick={() => onSearchChange?.("")}
            disabled={disabled}
          >
            <RiCloseLine className="h-4 w-4 text-muted-foreground" />
          </motion.button>
        )}
      </div>

      {/* Filter Button */}
      {filters.length > 0 && (
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size={size}
              disabled={disabled || loading}
              className={cn(
                "gap-2 relative",
                filterButtonClassName
              )}
            >
              <RiFilter3Line className="h-4 w-4" />
              <span>Filter</span>
              {showFilterCount && activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
              <RiArrowDownSLine className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>

          <AnimatePresence>
            {isFilterOpen && (
              <PopoverContent
                className="w-80 p-0"
                align="end"
                asChild
              >
                <motion.div
                  variants={filterVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                    {/* Filter Header */}
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Filters</h4>
                      {showClearAll && activeFilterCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleClearAll}
                          className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                        >
                          Clear all
                        </Button>
                      )}
                    </div>

                    {/* Filter Controls */}
                    <div className="space-y-6">
                      {filters.map((filter, index) => (
                        <div key={filter.id}>
                          {renderFilterControl(filter)}
                          {index < filters.length - 1 && <Separator className="mt-4" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </PopoverContent>
            )}
          </AnimatePresence>
        </Popover>
      )}

      {/* Active Filter Badges */}
      <AnimatePresence>
        {variant === "expanded" && (
          <div className="flex items-center gap-2 flex-wrap">
            {Object.entries(activeFilters).map(([filterId, value]) => {
              const filter = filters.find(f => f.id === filterId);
              if (!filter || !value) return null;

              const displayValue = getFilterDisplayValue(filter, value);
              if (!displayValue) return null;

              return (
                <motion.div
                  key={filterId}
                  variants={badgeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Badge
                    variant="secondary"
                    className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80"
                    onClick={() => handleClearFilter(filterId)}
                  >
                    {filter.icon}
                    <span className="text-xs">
                      {filter.label}: {displayValue}
                    </span>
                    <RiCloseLine className="h-3 w-3 hover:bg-muted rounded-sm" />
                  </Badge>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}

// Preset filter configurations
export const filterPresets = {
  status: {
    id: "status",
    label: "Status",
    type: "radio" as const,
    icon: <RiTagLine className="h-3 w-3" />,
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Pending", value: "pending" },
    ],
  },
  location: {
    id: "location",
    label: "Location",
    type: "select" as const,
    icon: <RiMapPinLine className="h-3 w-3" />,
    placeholder: "Select location...",
  },
  dateRange: {
    id: "dateRange",
    label: "Date Range",
    type: "date" as const,
    icon: <RiCalendarLine className="h-3 w-3" />,
  },
  assignee: {
    id: "assignee",
    label: "Assignee",
    type: "checkbox" as const,
    icon: <RiUserLine className="h-3 w-3" />,
    multiple: true,
    searchable: true,
  },
};

// Helper function to create filter options
export function createFilterOptions(
  items: string[] | Array<{ label: string; value: string; count?: number }>
): FilterOption[] {
  return items.map((item) => {
    if (typeof item === "string") {
      return { label: item, value: item.toLowerCase().replace(/\s+/g, "-") };
    }
    return item;
  });
}