import { ReactNode } from "react";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileTab, ProfileTabs } from "./ProfileTabs";

interface EntityProfileProps {
  name: string;
  avatar?: string;
  status?: string;
  id?: string;
  backLink: string;
  backLabel?: string;
  tabs: ProfileTab[];
  defaultTab?: string;
  actions?: ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onTabChange?: (value: string) => void;
}

export function EntityProfile({
  name,
  avatar,
  status,
  id,
  backLink,
  backLabel,
  tabs,
  defaultTab,
  actions,
  onEdit,
  onDelete,
  onShare,
  onTabChange,
}: EntityProfileProps) {
  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader
        name={name}
        avatar={avatar}
        status={status}
        id={id}
        backLink={backLink}
        backLabel={backLabel}
        actions={actions}
        onEdit={onEdit}
        onDelete={onDelete}
        onShare={onShare}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ProfileTabs
          tabs={tabs}
          defaultTab={defaultTab}
          onChange={onTabChange}
        />
      </div>
    </div>
  );
}
