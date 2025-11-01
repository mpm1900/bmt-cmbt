import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'

import { cn } from '@/lib/utils'

function ActorHealth({
  active,
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  active: boolean
}) {
  const [after, setAfter] = React.useState(value)
  React.useEffect(() => {
    const timeout = setTimeout(() => setAfter(value), 300)
    return () => clearTimeout(timeout)
  }, [value])
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        'bg-background/50 border border-background/50 relative h-4 rounded-[3px] overflow-hidden',
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          'absolute top-0 bg-red-400 h-full w-full flex-1 transition-all ring-black border-background z-10',
          { 'ring-1': value !== 100 }
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
    </ProgressPrimitive.Root>
  )
}

export { ActorHealth }
