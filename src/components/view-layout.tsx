import { Slot } from '@radix-ui/react-slot'
import type { ComponentProps } from 'react'

function ViewLayout({
  ...props
}: ComponentProps<'div'> & {
  main: React.ReactNode
  aside: React.ReactNode
}) {
  return (
    <div {...props} className="flex-1 flex items-center justify-center">
      <div className="flex flex-1 items-center justify-center gap-4 w-252">
        <Slot className="w-172">{props.main}</Slot>
        <Slot className="w-80">{props.aside}</Slot>
      </div>
    </div>
  )
}

export { ViewLayout }
