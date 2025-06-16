import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormSectionProps {
  title: string
  icon?: LucideIcon
  children: React.ReactNode
  className?: string
  headerClassName?: string
}

export function FormSection({ 
  title, 
  icon: Icon, 
  children, 
  className,
  headerClassName 
}: FormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className={cn("flex items-center gap-3", headerClassName)}>
        {Icon && (
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <Icon className="h-4 w-4 text-blue-600" />
          </div>
        )}
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

interface FormGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3
  className?: string
}

export function FormGrid({ children, columns = 2, className }: FormGridProps) {
  const gridClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3"
  }[columns]

  return (
    <div className={cn(`grid gap-4 ${gridClass}`, className)}>
      {children}
    </div>
  )
}

interface FormFieldProps {
  children: React.ReactNode
  className?: string
}

export function FormField({ children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
    </div>
  )
}