import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface BaseFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  onSave: () => void
  onCancel?: () => void
  saveLabel?: string
  cancelLabel?: string
  isLoading?: boolean
  maxWidth?: string
  disabled?: boolean
}

export function BaseFormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSave,
  onCancel,
  saveLabel = "저장",
  cancelLabel = "취소",
  isLoading = false,
  maxWidth = "max-w-md",
  disabled = false
}: BaseFormDialogProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${maxWidth} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        
        <div className="space-y-4">
          {children}
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button 
            type="button" 
            onClick={onSave}
            disabled={isLoading || disabled}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {saveLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}