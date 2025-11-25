import type { ComponentProps } from 'react'
import { Button } from './ui/button'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

function MiniDropdown({
  value,
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
        'text-muted-foreground hover:bg-ring/50 hover:text-foreground/70 border border-white/5 ring ring-black/30',
        { '!opacity-100': !!value },
        className
      )}
      {...props}
    >
      {children}
      {!props.disabled && <ChevronDown />}
    </Button>
  )
}

export { MiniDropdown }
