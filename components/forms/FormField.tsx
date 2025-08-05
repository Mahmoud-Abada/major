"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
    FormField as ShadcnFormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Control } from "react-hook-form";

interface BaseFieldProps {
    control: Control<any>;
    name: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

interface TextFieldProps extends BaseFieldProps {
    type?: "text" | "email" | "tel" | "password" | "number";
}

interface SelectFieldProps extends BaseFieldProps {
    options: Array<{ value: string; label: string }>;
}

interface TextareaFieldProps extends BaseFieldProps {
    rows?: number;
}

interface DateFieldProps extends BaseFieldProps {
    disableFuture?: boolean;
    disablePast?: boolean;
}

export function TextField({
    control,
    name,
    label,
    placeholder,
    type = "text",
    required = false,
    disabled = false,
    className,
}: TextFieldProps) {
    const t = useTranslations();

    return (
        <ShadcnFormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel>
                        {label}
                        {required && <span className="text-destructive ml-1">*</span>}
                    </FormLabel>
                    <FormControl>
                        <Input
                            type={type}
                            placeholder={placeholder}
                            disabled={disabled}
                            {...field}
                            className="rounded-md"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export function SelectField({
    control,
    name,
    label,
    placeholder,
    options,
    required = false,
    disabled = false,
    className,
}: SelectFieldProps) {
    const t = useTranslations();

    return (
        <ShadcnFormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel>
                        {label}
                        {required && <span className="text-destructive ml-1">*</span>}
                    </FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={disabled}
                    >
                        <FormControl>
                            <SelectTrigger className="rounded-md">
                                <SelectValue placeholder={placeholder || t("common.select")} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export function TextareaField({
    control,
    name,
    label,
    placeholder,
    rows = 3,
    required = false,
    disabled = false,
    className,
}: TextareaFieldProps) {
    return (
        <ShadcnFormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel>
                        {label}
                        {required && <span className="text-destructive ml-1">*</span>}
                    </FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder={placeholder}
                            rows={rows}
                            disabled={disabled}
                            {...field}
                            className="rounded-md resize-none"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export function DateField({
    control,
    name,
    label,
    placeholder,
    disableFuture = false,
    disablePast = false,
    required = false,
    disabled = false,
    className,
}: DateFieldProps) {
    const t = useTranslations();

    return (
        <ShadcnFormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn("flex flex-col", className)}>
                    <FormLabel>
                        {label}
                        {required && <span className="text-destructive ml-1">*</span>}
                    </FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    disabled={disabled}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal rounded-md",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value ? (
                                        format(field.value, "PPP")
                                    ) : (
                                        <span>{placeholder || t("common.select")}</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                    if (disableFuture && date > new Date()) return true;
                                    if (disablePast && date < new Date()) return true;
                                    return date < new Date("1900-01-01");
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}