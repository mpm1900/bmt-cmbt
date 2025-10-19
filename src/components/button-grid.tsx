import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

function ButtonGrid({ className, ...props }: ComponentProps<'div'> & {}) {
  return (
    <div
      className={cn(
        `grid grid-cols-3 grid-rows-2`,
        `[&>*]:rounded-none [&>*:first-child]:rounded-tl-lg [&>*:last-child]:rounded-br-lg`,
        className
      )}
      {...props}
    ></div>
  )
}

export { ButtonGrid }
