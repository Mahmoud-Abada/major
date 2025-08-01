import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode } from "react";

export interface ProfileTab {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
}

interface ProfileTabsProps {
  tabs: ProfileTab[];
  defaultTab?: string;
  onChange?: (value: string) => void;
}

export function ProfileTabs({ tabs, defaultTab, onChange }: ProfileTabsProps) {
  return (
    <Tabs
      defaultValue={defaultTab || tabs[0].id}
      onValueChange={onChange}
      className="w-full"
    >
      <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 w-full">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="flex items-center space-x-2"
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
