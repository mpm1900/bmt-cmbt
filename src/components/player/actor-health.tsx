import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'

import { cn } from '@/lib/utils'

function ActorHealth({
  className,
  showHealthNumbers,
  health,
  maxHealth,
  children,
  ...props
}: Omit<React.ComponentProps<typeof ProgressPrimitive.Root>, 'value'> & {
  showHealthNumbers: boolean
  health: number
  maxHealth: number
  children?: React.ReactNode
}) {
  const value = maxHealth === 0 ? 0 : (health * 100) / maxHealth
  const [after, setAfter] = React.useState(value)
  React.useEffect(() => {
    const timeout = setTimeout(() => setAfter(value), 700)
    return () => clearTimeout(timeout)
  }, [value])
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        'bg-background/70 inset-ring-1 relative h-5 border overflow-hidden text-transparent rounded-xs',
        { 'border-red-500/50': health <= 0 },
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          'absolute top-0 bg-red-600/80 h-full w-full flex-1 transition-all z-10',
          { 'ring-1 ring-black': value !== 100 }
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator-after"
        className={cn(
          'absolute top-0 bg-foreground h-full w-full flex-1 transition-all'
        )}
        style={{ transform: `translateX(-${100 - (after || 0)}%)` }}
      />
      {showHealthNumbers && (
        <div className="absolute top-0.5 right-1 z-10 leading-4 title text-lg text-foreground text-shadow-md">
          {children || (
            <>
              {Math.max(health, 0)}/{maxHealth}
            </>
          )}
        </div>
      )}
    </ProgressPrimitive.Root>
  )
}

export { ActorHealth }
