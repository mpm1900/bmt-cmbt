import type { ComponentProps } from 'react'
import { Button } from './ui/button'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

function MiniDropdown({
  variant = 'secondary',
  size = 'xs',
  className,
  children,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'text-muted-foreground hover:text-foreground/70',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown />
    </Button>
  )
}

export { MiniDropdown }
