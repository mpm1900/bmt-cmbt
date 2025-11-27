import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import React from 'react'

function GaugeContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('relative h-6 bg-black/60 ring ring-black', className)}
      style={{ borderStyle: 'inset' }}
      {...props}
    />
  )
}

function Gauge({
  children,
  value,
  ...props
}: React.ComponentProps<typeof GaugeContent> & {
  value: number
}) {
  const [after, setAfter] = React.useState(value)
  React.useEffect(() => {
    const timeout = setTimeout(() => setAfter(value), 700)
    return () => clearTimeout(timeout)
  }, [value])
  return (
    <GaugeContent {...props}>
      <motion.div
        className={cn(
          'bg-red-800/80 absolute top-0 h-full border-white/10 z-10 ring ring-black',
          { border: value > 0 }
        )}
        initial={{ width: `${value}%` }}
        animate={{ width: `${value}%` }}
      />
      <motion.div
        className={cn(
          'bg-white/80 absolute top-0 h-full border-white/20 z-0 ring ring-black',
          { border: value > 0 }
        )}
        initial={{ width: `${after}%` }}
        animate={{ width: `${after}%` }}
      />

      <div className="absolute inset-0 flex flex-row justify-end inset">
        {children}
      </div>
    </GaugeContent>
  )
}

export { Gauge }
