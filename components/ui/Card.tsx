// components/ui/Card.tsx
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("rounded-lg bg-white shadow-lg", className)}>
      {children}
    </div>
  );
}
