import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

function ActionHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn(
        'inline-flex items-center gap-2 title text-xl px-2 z-10 text-shadow-lg rounded-t-sm',
        'bg-white/80 text-neutral-900 ring ring-white/70'
      )}
      style={{
        boxShadow: '0 1px 5px rgba(0,0,0,0.7)',
      }}
    />
  )
}

function ActionTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="action-title" className={cn('', className)} {...props} />
  )
}

function ActionCost({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="action-cost"
      className={cn('text-sm flex gap-1', className)}
      {...props}
    />
  )
}

function ActionBody({
  active,
  className,
  ...props
}: React.ComponentProps<'div'> & { active: boolean }) {
  return (
    <div
      data-slot="action-body"
      className={cn(
        'flex flex-col gap-1',
        { 'opacity-50': !active },
        className
      )}
      {...props}
    />
  )
}

function ActionDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="action-description"
      className={cn('text-sm text-muted-foreground p-2 pt-0', className)}
      {...props}
    />
  )
}

function ActionCooldown({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="action-cooldown"
      className={cn('text-muted-foreground/60', className)}
      {...props}
    />
  )
}

function ActionLore({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="action-lore"
      className={cn('italic indent-4 pt-4 text-xs text-muted-foreground/80')}
      {...props}
    />
  )
}

const actionLabelVariants = cva('', {
  variants: {
    variant: {
      default: 'text-foreground',
      fire: 'text-fire',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})
function ActionLabel({
  className,
  variant,
  ...props
}: React.ComponentProps<'strong'> & VariantProps<typeof actionLabelVariants>) {
  return (
    <strong
      className={cn(actionLabelVariants({ variant, className }))}
      {...props}
    />
  )
}

export {
  ActionHeader,
  ActionTitle,
  ActionCost,
  ActionBody,
  ActionDescription,
  ActionLabel,
  ActionLore,
  ActionCooldown,
}
