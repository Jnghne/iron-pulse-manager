import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => Promise<void> | void
  variant?: 'default' | 'destructive' | 'success'
  loading?: boolean
  children?: React.ReactNode
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "확인",
  cancelLabel = "취소",
  onConfirm,
  variant = 'default',
  loading = false,
  children
}: ConfirmationDialogProps) {
  const [isProcessing, setIsProcessing] = React.useState(false)

  const handleConfirm = async () => {
    setIsProcessing(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } catch (error) {
      console.error('Confirmation action failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getButtonVariant = () => {
    switch (variant) {
      case 'destructive':
        return 'destructive'
      case 'success':
        return 'default'
      default:
        return 'default'
    }
  }

  const isLoading = loading || isProcessing

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {children && (
          <div className="my-4">
            {children}
          </div>
        )}
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelLabel}
          </AlertDialogCancel>
          <Button
            variant={getButtonVariant()}
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(
              variant === 'success' && "bg-green-600 hover:bg-green-700",
              variant === 'destructive' && "bg-red-600 hover:bg-red-700"
            )}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}