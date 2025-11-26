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
      className={cn(
        'flex items-center justify-center my-8 h-full relative',
        className
      )}
    >
      {children}
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
      <Slot className="flex-1">{props.main}</Slot>
      <Slot className="w-90">{props.aside}</Slot>
    </ViewLayoutContent>
  )
}

export { ViewLayout, ViewLayoutContent }
