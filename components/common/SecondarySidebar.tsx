"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type SidebarItem = {
  name: string;
  icon?: React.ComponentType<{ size?: number }>;
  count?: number | null;
  active?: boolean;
  onClick?: () => void;
};

type SectionItem = {
  name: string;
  count?: number | null;
  avatar?: string;
  online?: boolean;
  color?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  onClick?: () => void;
};

type SidebarSection = {
  key: string;
  title: string;
  icon?: React.ComponentType<{ size?: number }>;
  items: SectionItem[];
  initiallyExpanded?: boolean;
};

type SecondarySidebarProps = {
  mainItems?: SidebarItem[];
  sections?: SidebarSection[];
  className?: string;
};

const SecondarySidebar = ({
  mainItems = [],
  sections = [],
  className = "",
}: SecondarySidebarProps) => {
  // Initialize expanded state based on sections' initiallyExpanded property
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(
    sections.reduce(
      (acc, section) => {
        acc[section.key] = section.initiallyExpanded ?? true;
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  );

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  return (
    <div
      className={`w-64 border-r border-neutral-800 flex flex-col h-full overflow-y-auto ${className}`}
    >
      {/* Main Navigation */}
      {mainItems.length > 0 && (
        <div className="p-3 space-y-1">
          {mainItems.map((item) => (
            <div
              key={item.name}
              onClick={item.onClick}
              className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                item.active
                  ? "bg-neutral-800 text-white"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon && <item.icon size={18} />}
                <span className="font-medium">{item.name}</span>
              </div>
              {item.count && (
                <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.count}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sections */}
      {sections.map(({ key, title, icon: Icon, items }) => (
        <div key={key} className="px-3 py-2">
          <button
            onClick={() => toggleSection(key)}
            className="flex items-center justify-between w-full text-left text-neutral-400 hover:text-white text-sm font-medium"
          >
            <span>{title}</span>
            <div className="flex items-center gap-2">
              {Icon && <Icon size={16} />}
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  expandedSections[key] ? "rotate-0" : "-rotate-90"
                }`}
              />
            </div>
          </button>

          <AnimatePresence>
            {expandedSections[key] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 space-y-1"
              >
                {items.map((item) => (
                  <Link
                    href={item.onClick ? "#" : "#"} // Use href for navigation, or # if onClick is used
                    key={item.name}
                    onClick={item.onClick}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-900 cursor-pointer"
                  >
                    {item.avatar ? (
                      <div className="relative">
                        <div className="w-8 h-8 bg-neutral-600 rounded-full flex items-center justify-center">
                          <span className="text-sm">{item.avatar}</span>
                        </div>
                        {item.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-800"></div>
                        )}
                      </div>
                    ) : item.color ? (
                      <div
                        className={`w-3 h-3 rounded-full ${item.color}`}
                      ></div>
                    ) : item.icon ? (
                      <item.icon size={16} className="text-purple-500" />
                    ) : null}

                    <span className="text-sm text-neutral-300 truncate flex-1">
                      {item.name}
                    </span>

                    {item.count && (
                      <span className="text-xs text-neutral-500">
                        {item.count}
                      </span>
                    )}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default SecondarySidebar;
