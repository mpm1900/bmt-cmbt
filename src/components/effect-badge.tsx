import { EffectTooltip } from './tooltips/effect-tooltip'
import { Badge } from './ui/badge'
import type { ComponentProps } from 'react'
import { EFFECT_RENDERERS } from '@/renderers'
import { FaQuestionCircle } from 'react-icons/fa'

function EffectBadge({
  count,
  effectID,
  ...rest
}: ComponentProps<typeof EffectTooltip> & {
  count: number
}) {
  const renderer = EFFECT_RENDERERS[effectID]
  return (
    <EffectTooltip effectID={effectID} side="bottom" asChild {...rest}>
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
