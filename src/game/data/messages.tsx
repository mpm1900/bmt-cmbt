import type { ReactNode } from 'react'
import type { SAction, SActor, SEffect } from '../state'
import { cn } from '@/lib/utils'
import { playerStore } from '@/hooks/usePlayer'
import { EffectTooltip } from '@/components/tooltips/effect-tooltip'

const playerID = playerStore.getState().playerID

function Actor(actor: SActor | undefined, after: ReactNode) {
  return (
    <span className="actor">
      <span
        className={cn('font-semibold', {
          'text-blue-300/80': actor?.playerID === playerID,
          'text-orange-200/70': actor?.playerID !== playerID,
        })}
      >
        {actor?.name}
      </span>{' '}
      {after}
    </span>
  )
}
function ActorActivated(actor: SActor | undefined) {
  return Actor(actor, <span className="text-foreground">activated.</span>)
}
function ActorDied(actor: SActor | undefined) {
  return Actor(actor, <span className="text-foreground">died.</span>)
}

function TargetDamage(target: SActor | undefined, damage: number) {
  return Actor(
    target,
    <>
      took <span className="text-foreground/80">{damage} damage</span>.
    </>
  )
}
function TargetHeal(target: SActor | undefined, healed: number) {
  return Actor(
    target,
    <>
      healed for <span className="text-foreground/80">{healed} damage</span>.
    </>
  )
}
function TargetEvade(target: SActor | undefined) {
  return Actor(target, <>evaded the attack.</>)
}

type SlimEffect = Pick<SEffect, 'ID' | 'name'>
function Effect(effect: SlimEffect) {
  return (
    <EffectTooltip
      effectID={effect.ID}
      side="right"
      className="text-foreground font-semibold"
    >
      {effect.name}
    </EffectTooltip>
  )
}
function EffectTrigger(effect: SlimEffect) {
  return <>{Effect(effect)} trigger:</>
}
function ParentEffect(parent: SActor | undefined, effect: SlimEffect) {
  return Actor(parent, <>gained {Effect(effect)}</>)
}

function SourceAction(source: SActor | undefined, action: SAction) {
  return Actor(
    source,
    <>
      uses <span className="text-foreground font-semibold">{action.name}</span>
    </>
  )
}
function SourceMissed(source: SActor | undefined) {
  return Actor(source, <>missed.</>)
}

export {
  Actor,
  ActorActivated,
  ActorDied,
  TargetDamage,
  TargetHeal,
  TargetEvade,
  Effect,
  EffectTrigger,
  ParentEffect,
  SourceAction,
  SourceMissed,
}
