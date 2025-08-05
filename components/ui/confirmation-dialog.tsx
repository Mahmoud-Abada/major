"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  RiAlertLine,
  RiCheckLine,
  RiDeleteBinLine,
  RiErrorWarningLine,
  RiInformationLine,
  RiQuestionLine,
} from "@remixicon/react";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

export interface ConfirmationDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "warning" | "info";
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  requireConfirmation?: boolean;
  confirmationText?: string;
  confirmationPlaceholder?: string;
  showCheckbox?: boolean;
  checkboxText?: string;
  icon?: React.ReactNode;
  className?: string;
  size?: "sm" | "default" | "lg";
}

const variantConfig = {
  default: {
    icon: RiQuestionLine,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    confirmVariant: "default" as const,
  },
  destructive: {
    icon: RiErrorWarningLine,
    iconColor: "text-destructive",
    iconBg: "bg-destructive/10",
    confirmVariant: "destructive" as const,
  },
  warning: {
    icon: RiAlertLine,
    iconColor: "text-yellow-600",
    iconBg: "bg-yellow-100",
    confirmVariant: "default" as const,
  },
  info: {
    icon: RiInformationLine,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
    confirmVariant: "default" as const,
  },
};

const sizeConfig = {
  sm: {
    iconSize: "h-4 w-4",
    iconContainer: "size-8",
    title: "text-base",
    description: "text-sm",
  },
  default: {
    iconSize: "h-5 w-5",
    iconContainer: "size-10",
    title: "text-lg",
    description: "text-sm",
  },
  lg: {
    iconSize: "h-6 w-6",
    iconContainer: "size-12",
    title: "text-xl",
    description: "text-base",
  },
};

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.3,
      staggerChildren: 0.1,
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.2 }
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
  loading = false,
  disabled = false,
  children,
  trigger,
  requireConfirmation = false,
  confirmationText = "",
  confirmationPlaceholder = "Type to confirm",
  showCheckbox = false,
  checkboxText = "I understand the consequences",
  icon,
  className,
  size = "default",
}: ConfirmationDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [confirmationInput, setConfirmationInput] = React.useState("");
  const [checkboxChecked, setCheckboxChecked] = React.useState(false);
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const config = variantConfig[variant];
  const sizeConf = sizeConfig[size];
  const IconComponent = icon ? () => icon : config.icon;

  // Reset state when dialog closes
  React.useEffect(() => {
    if (!isOpen) {
      setConfirmationInput("");
      setCheckboxChecked(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  // Check if confirmation is valid
  const isConfirmationValid = React.useMemo(() => {
    if (requireConfirmation && confirmationInput !== confirmationText) {
      return false;
    }
    if (showCheckbox && !checkboxChecked) {
      return false;
    }
    return true;
  }, [requireConfirmation, confirmationInput, confirmationText, showCheckbox, checkboxChecked]);

  const handleConfirm = async () => {
    if (!isConfirmationValid || disabled || isLoading) return;

    setIsLoading(true);
    try {
      await onConfirm();
      setIsOpen(false);
    } catch (error) {
      console.error("Confirmation action failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isConfirmationValid && !disabled && !isLoading) {
      e.preventDefault();
      handleConfirm();
    }
  };

  const dialogContent = (
    <AlertDialogContent 
      className={cn("max-w-md", className)}
      asChild
    >
      <motion.div
        variants={dialogVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onKeyDown={handleKeyDown}
      >
        <div className="flex flex-col gap-4 max-sm:items-center sm:flex-row sm:gap-4">
          {/* Icon */}
          <motion.div
            variants={itemVariants}
            className={cn(
              "flex items-center justify-center rounded-full flex-shrink-0",
              sizeConf.iconContainer,
              config.iconBg
            )}
          >
            <IconComponent className={cn(sizeConf.iconSize, config.iconColor)} />
          </motion.div>

          {/* Content */}
          <div className="flex-1 space-y-4">
            <AlertDialogHeader className="text-left space-y-2">
              <motion.div variants={itemVariants}>
                <AlertDialogTitle className={sizeConf.title}>
                  {title}
                </AlertDialogTitle>
              </motion.div>
              
              {description && (
                <motion.div variants={itemVariants}>
                  <AlertDialogDescription className={sizeConf.description}>
                    {description}
                  </AlertDialogDescription>
                </motion.div>
              )}
            </AlertDialogHeader>

            {/* Additional content */}
            {children && (
              <motion.div variants={itemVariants}>
                {children}
              </motion.div>
            )}

            {/* Confirmation input */}
            {requireConfirmation && (
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="confirmation-input" className="text-sm font-medium">
                  Type "{confirmationText}" to confirm:
                </Label>
                <Input
                  id="confirmation-input"
                  value={confirmationInput}
                  onChange={(e) => setConfirmationInput(e.target.value)}
                  placeholder={confirmationPlaceholder}
                  className={cn(
                    "transition-colors",
                    requireConfirmation && confirmationInput !== confirmationText && confirmationInput.length > 0
                      ? "border-destructive focus:border-destructive"
                      : ""
                  )}
                  autoComplete="off"
                />
              </motion.div>
            )}

            {/* Checkbox */}
            {showCheckbox && (
              <motion.div variants={itemVariants} className="flex items-center space-x-2">
                <Checkbox
                  id="confirmation-checkbox"
                  checked={checkboxChecked}
                  onCheckedChange={(checked) => setCheckboxChecked(checked === true)}
                />
                <Label
                  htmlFor="confirmation-checkbox"
                  className="text-sm font-normal cursor-pointer"
                >
                  {checkboxText}
                </Label>
              </motion.div>
            )}

            {/* Actions */}
            <motion.div variants={itemVariants}>
              <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2">
                <AlertDialogCancel asChild>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {cancelText}
                  </Button>
                </AlertDialogCancel>
                
                <AlertDialogAction asChild>
                  <Button
                    variant={config.confirmVariant}
                    onClick={handleConfirm}
                    disabled={!isConfirmationValid || disabled || isLoading}
                    className="w-full sm:w-auto gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        {variant === "destructive" && <RiDeleteBinLine className="h-4 w-4" />}
                        {variant === "default" && <RiCheckLine className="h-4 w-4" />}
                        <span>{confirmText}</span>
                      </>
                    )}
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AlertDialogContent>
  );

  if (trigger) {
    return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          {trigger}
        </AlertDialogTrigger>
        <AnimatePresence>
          {isOpen && dialogContent}
        </AnimatePresence>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AnimatePresence>
        {isOpen && dialogContent}
      </AnimatePresence>
    </AlertDialog>
  );
}

// Preset confirmation dialogs
export const ConfirmationDialogs = {
  // Delete confirmation
  Delete: (props: Omit<ConfirmationDialogProps, "variant" | "title" | "confirmText">) => (
    <ConfirmationDialog
      variant="destructive"
      title="Delete Item"
      confirmText="Delete"
      {...props}
    />
  ),

  // Destructive action with text confirmation
  DestructiveWithConfirmation: (props: Omit<ConfirmationDialogProps, "variant" | "requireConfirmation">) => (
    <ConfirmationDialog
      variant="destructive"
      requireConfirmation={true}
      confirmationText="DELETE"
      {...props}
    />
  ),

  // Save changes confirmation
  SaveChanges: (props: Omit<ConfirmationDialogProps, "variant" | "title" | "confirmText">) => (
    <ConfirmationDialog
      variant="default"
      title="Save Changes"
      confirmText="Save"
      {...props}
    />
  ),

  // Discard changes warning
  DiscardChanges: (props: Omit<ConfirmationDialogProps, "variant" | "title" | "confirmText">) => (
    <ConfirmationDialog
      variant="warning"
      title="Discard Changes"
      confirmText="Discard"
      description="You have unsaved changes. Are you sure you want to discard them?"
      {...props}
    />
  ),

  // Logout confirmation
  Logout: (props: Omit<ConfirmationDialogProps, "variant" | "title" | "confirmText">) => (
    <ConfirmationDialog
      variant="warning"
      title="Sign Out"
      confirmText="Sign Out"
      description="Are you sure you want to sign out of your account?"
      {...props}
    />
  ),
};

// Hook for managing confirmation dialog state
export function useConfirmationDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [config, setConfig] = React.useState<Partial<ConfirmationDialogProps>>({});

  const openDialog = React.useCallback((dialogConfig: Partial<ConfirmationDialogProps>) => {
    setConfig(dialogConfig);
    setIsOpen(true);
  }, []);

  const closeDialog = React.useCallback(() => {
    setIsOpen(false);
    setConfig({});
  }, []);

  const confirmDialog = React.useCallback((dialogConfig: Partial<ConfirmationDialogProps>) => {
    return new Promise<boolean>((resolve) => {
      setConfig({
        ...dialogConfig,
        onConfirm: async () => {
          await dialogConfig.onConfirm?.();
          resolve(true);
          closeDialog();
        },
        onCancel: () => {
          dialogConfig.onCancel?.();
          resolve(false);
          closeDialog();
        },
      });
      setIsOpen(true);
    });
  }, [closeDialog]);

  return {
    isOpen,
    config,
    openDialog,
    closeDialog,
    confirmDialog,
  };
}

// Context for global confirmation dialogs
interface ConfirmationContextType {
  confirm: (config: Partial<ConfirmationDialogProps>) => Promise<boolean>;
}

const ConfirmationContext = React.createContext<ConfirmationContextType | null>(null);

export function ConfirmationProvider({ children }: { children: React.ReactNode }) {
  const { isOpen, config, confirmDialog, closeDialog } = useConfirmationDialog();

  const confirm = React.useCallback(
    (dialogConfig: Partial<ConfirmationDialogProps>) => {
      return confirmDialog(dialogConfig);
    },
    [confirmDialog]
  );

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}
      <ConfirmationDialog
        open={isOpen}
        onOpenChange={closeDialog}
        title="Confirm Action"
        onConfirm={() => {}}
        {...config}
      />
    </ConfirmationContext.Provider>
  );
}

export function useConfirmation() {
  const context = React.useContext(ConfirmationContext);
  if (!context) {
    throw new Error("useConfirmation must be used within a ConfirmationProvider");
  }
  return context;
}