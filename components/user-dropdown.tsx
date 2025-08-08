"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { RiLogoutBoxLine, RiSettingsLine, RiTeamLine } from "@remixicon/react";
import { useTranslations } from "next-intl";

export default function UserDropdown() {
  const t = useTranslations("navigation");
  const tCommon = useTranslations("common");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto p-1 md:p-0 hover:bg-transparent focus:ring-2 focus:ring-primary/20 rounded-full"
          aria-label={t("profile")}
        >
          <Avatar className="size-7 md:size-8">
            <AvatarImage
              src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/user_sam4wh.png"
              width={32}
              height={32}
              alt={t("profileImage") || "Profile image"}
            />
            <AvatarFallback className="text-xs md:text-sm">KK</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 md:max-w-64"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="flex min-w-0 flex-col p-3 md:p-4">
          <span className="truncate text-sm font-medium text-foreground">
            Keith Kennedy
          </span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            k.kennedy@originui.com
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="p-2 md:p-3 cursor-pointer">
            <RiSettingsLine
              size={16}
              className="opacity-60 shrink-0"
              aria-hidden="true"
            />
            <span className="text-sm">
              {t("accountSettings") || "Account settings"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-2 md:p-3 cursor-pointer">
            <RiTeamLine
              size={16}
              className="opacity-60 shrink-0"
              aria-hidden="true"
            />
            <span className="text-sm">
              {t("affiliateArea") || "Affiliate area"}
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-2 md:p-3 cursor-pointer text-red-600 focus:text-red-600">
          <RiLogoutBoxLine
            size={16}
            className="opacity-60 shrink-0"
            aria-hidden="true"
          />
          <span className="text-sm">{t("logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
