import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import type { ComponentProps } from 'react'

function ViewLayoutContent({
  children,
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn('flex items-center justify-center', className)}
    >
      <div className="relative flex-1 flex items-start justify-center gap-4 w-260 min-h-120">
        {children}
      </div>
    </div>
  )
}

function ViewLayout({
  ...props
}: ComponentProps<'div'> & {
  main: React.ReactNode
  aside: React.ReactNode
}) {
  return (
    <ViewLayoutContent {...props}>
      <Slot className="flex-1 max-w-180">{props.main}</Slot>
      <Slot className="flex-1 max-w-80">{props.aside}</Slot>
    </ViewLayoutContent>
  )
}

export { ViewLayout, ViewLayoutContent }
