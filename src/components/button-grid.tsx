import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

function ButtonGrid32({ className, ...props }: ComponentProps<'div'> & {}) {
  return (
    <div
      className={cn(
        `grid grid-cols-3 grid-rows-2`,
        `[&>*]:rounded-none [&>*:first-child]:rounded-tl-lg [&>*:nth-child(3)]:rounded-tr-lg [&>*:nth-child(4)]:rounded-bl-lg [&>*:last-child]:rounded-br-lg`,
        className
      )}
      {...props}
    ></div>
  )
}

function ButtonGrid22({ className, ...props }: ComponentProps<'div'> & {}) {
  return (
    <div
      className={cn(
        `grid grid-cols-2 grid-rows-2`,
        `[&>*]:rounded-none [&>*:first-child]:rounded-tl-lg [&>*:nth-child(2)]:rounded-tr-lg [&>*:nth-child(3)]:rounded-bl-lg [&>*:last-child]:rounded-br-lg`,
        className
      )}
      {...props}
    ></div>
  )
}

export { ButtonGrid32, ButtonGrid22 }
