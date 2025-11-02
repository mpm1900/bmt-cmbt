import { Slot } from '@radix-ui/react-slot'
import type { ComponentProps } from 'react'

function ViewLayoutContent({
  children,
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div {...props} className="flex-1 flex items-center justify-center">
      <div className="flex-1 flex items-start justify-center gap-4 w-260">
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
      <Slot className="w-180">{props.main}</Slot>
      <Slot className="w-80">{props.aside}</Slot>
    </ViewLayoutContent>
  )
}

export { ViewLayout, ViewLayoutContent }
