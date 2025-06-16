import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number
  onChange?: (value: number) => void
  suffix?: string
  allowNegative?: boolean
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, suffix = "원", allowNegative = false, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState<string>('')

    React.useEffect(() => {
      if (value !== undefined) {
        setDisplayValue(formatNumber(value))
      }
    }, [value])

    const formatNumber = (num: number): string => {
      return num.toLocaleString('ko-KR')
    }

    const parseNumber = (str: string): number => {
      const cleaned = str.replace(/[^\d-]/g, '')
      const num = parseInt(cleaned) || 0
      return allowNegative ? num : Math.max(0, num)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      const numericValue = parseNumber(inputValue)
      
      setDisplayValue(formatNumber(numericValue))
      onChange?.(numericValue)
    }

    return (
      <div className="relative">
        <Input
          ref={ref}
          type="text"
          value={displayValue}
          onChange={handleChange}
          className={cn("pr-8", className)}
          {...props}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {suffix}
        </span>
      </div>
    )
  }
)

CurrencyInput.displayName = "CurrencyInput"