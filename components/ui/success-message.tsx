"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "./button";

interface SuccessMessageProps {
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

export function SuccessMessage({
  title,
  message,
  actionText,
  onAction,
}: SuccessMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md rounded-lg border border-neutral-300 bg-neutral-100 p-6 shadow-md dark:border-neutral-700 dark:bg-neutral-800"
    >
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>

        <h3 className="mb-2 text-xl font-semibold text-neutral-950 dark:text-neutral-50">
          {title}
        </h3>

        <p className="mb-6 text-neutral-600 dark:text-neutral-300">{message}</p>

        {actionText && onAction && (
          <Button
            onClick={onAction}
            className="w-full bg-gradient-to-b from-neutral-600 to-neutral-800 text-neutral-50 hover:opacity-90 dark:from-neutral-400 dark:to-neutral-200 dark:text-neutral-950"
          >
            {actionText}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
