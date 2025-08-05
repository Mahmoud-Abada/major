"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ArrowLeft, Save, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";

interface BaseFormProps {
    title: string;
    description?: string;
    form: UseFormReturn<any>;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    loading?: boolean;
    children: ReactNode;
    className?: string;
    showBackButton?: boolean;
}

export default function BaseForm({
    title,
    description,
    form,
    onSubmit,
    onCancel,
    loading = false,
    children,
    className,
    showBackButton = true,
}: BaseFormProps) {
    const t = useTranslations();

    return (
        <div className={cn("max-w-4xl mx-auto p-6", className)}>
            <Card className="border-0 shadow-sm">
                <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
                            {description && (
                                <p className="text-sm text-muted-foreground">{description}</p>
                            )}
                        </div>
                        {showBackButton && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onCancel}
                                className="gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                {t("common.back")}
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {children}

                            <div className="flex items-center justify-end gap-3 pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                    disabled={loading}
                                    className="gap-2"
                                >
                                    <X className="h-4 w-4" />
                                    {t("common.cancel")}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="gap-2 min-w-[120px]"
                                >
                                    <Save className="h-4 w-4" />
                                    {loading ? t("common.loading") : t("common.save")}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}