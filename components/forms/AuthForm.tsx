"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";

interface AuthFormProps {
  title: string;
  description?: string;
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  loading?: boolean;
  children: ReactNode;
  className?: string;
  submitText: string;
  error?: string | null;
  showLogo?: boolean;
}

export default function AuthForm({
  title,
  description,
  form,
  onSubmit,
  loading = false,
  children,
  className,
  submitText,
  error,
  showLogo = true,
}: AuthFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className={cn("w-full max-w-md lg:max-w-lg", className)}
    >
      <Card className="border-neutral-300 bg-neutral-100 shadow-md dark:border-neutral-700 dark:bg-neutral-800">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl lg:text-3xl font-semibold text-neutral-950 dark:text-neutral-50">
              {title}
            </CardTitle>
            {showLogo && (
              <Image
                src="/major-logo.svg"
                alt="major app"
                width={48}
                height={46}
                className="block lg:hidden flex-shrink-0"
              />
            )}
          </div>
          {description && (
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              {description}
            </p>
          )}
        </CardHeader>
        <CardContent className="px-4 lg:px-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
            >
              {error}
            </motion.div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {children}

              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-b from-neutral-600 to-neutral-800 text-neutral-50 hover:opacity-90 dark:from-neutral-400 dark:to-neutral-200 dark:text-neutral-950 disabled:opacity-50"
                >
                  {loading && (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  )}
                  {loading ? "Creating Account..." : submitText}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
