import type { SEffect } from '@/game/state'
import { EffectTooltip } from './tooltips/effect-tooltip'
import { Badge } from './ui/badge'
import type { ComponentProps } from 'react'
import { EFFECT_RENDERERS } from '@/renderers'
import { FaQuestionCircle } from 'react-icons/fa'

function EffectBadge({
  count,
  effect,
  ...rest
}: Omit<ComponentProps<typeof EffectTooltip>, 'effectID'> & {
  count: number
  effect: SEffect
}) {
  const renderer = EFFECT_RENDERERS[effect.ID]
  return (
    <EffectTooltip effectID={effect.ID} side="bottom" asChild {...rest}>
      <Badge
        variant="outline"
        className="bg-background text-muted-foreground p-1 [&>svg]:size-4"
      >
        {renderer ? <renderer.Icon /> : <FaQuestionCircle />}
        {count > 1 ? `(${count})` : ''}
      </Badge>
    </EffectTooltip>
  )
}

export { EffectBadge }
