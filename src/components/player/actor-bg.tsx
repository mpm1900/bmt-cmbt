import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'motion/react'
import type { ComponentProps } from 'react'

const actorBgVariants = cva(
  'flex disabled:pointer-events-none disabled:opacity-50 outline-none p-1 px-2 rounded-xs transition-all border border-transparent',
  {
    variants: {
      variant: {
        ally: 'bg-slate-700 text-foreground border-slate-500/70! ring ring-black',
        ['ally-active']:
          'bg-slate-300 text-slate-950 border border-white ring ring-black',
        enemy: 'bg-transparent',
        ['enemy-active']: 'bg-stone-300 text-stone-950 ring ring-black',
        targeted: 'bg-destructive text-white ring ring-black',
      },
      defaultVariants: {
        variant: 'ally',
      },
    },
  }
)

function ActorBg({
  className,
  variant,
  ...props
}: ComponentProps<typeof motion.button> &
  VariantProps<typeof actorBgVariants> & {}) {
  return (
    <motion.button
      className={actorBgVariants({ variant, className })}
      {...props}
    ></motion.button>
  )
}

export { ActorBg }
