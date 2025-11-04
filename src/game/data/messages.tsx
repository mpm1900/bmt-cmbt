import type { ReactNode } from 'react'
import type { SAction, SActor, SEffect } from '../state'
import { cn } from '@/lib/utils'
import { playerStore } from '@/hooks/usePlayer'
import { EffectTooltip } from '@/components/tooltips/effect-tooltip'
import { getHealth } from '../actor'

const playerID = playerStore.getState().playerID

function SeporatorBottom(children: ReactNode) {
  return <span className="border-b w-full inline-block mb-1">{children}</span>
}
function SeporatorTop(children: ReactNode) {
  return <span className="border-t w-full inline-block mt-1">{children}</span>
}
function SeporatorThick(children: ReactNode) {
  return (
    <span className="inline-flex gap-2 w-full items-center">
      <span>{children}</span>
      <span className="bg-input/30 flex-1 h-3" />
    </span>
  )
}
function TurnStart(turn: number) {
  return SeporatorThick(
    <span className="uppercase font-black opacity-50">Turn {turn + 1}</span>
  )
}

function Actor(actor: SActor | undefined, after: ReactNode = null) {
  return (
    <span className="actor">
      <span
        className={cn('font-semibold', {
          'text-ally/80': actor?.playerID === playerID,
          'text-enemy/70': actor?.playerID !== playerID,
        })}
      >
        {actor?.name}
      </span>
      {after}
    </span>
  )
}
function ActorActivated(actor: SActor | undefined) {
  return (
    <>
      {Actor(actor)} {<span className="text-foreground">activated.</span>}
    </>
  )
}
function ActorDeactivated(actor: SActor | undefined) {
  return (
    <>
      {Actor(actor)} {<span className="text-foreground">deactivated.</span>}
    </>
  )
}
function ActorDied(actor: SActor | undefined) {
  return (
    <span className="[&_*]:!text-red-300/80">
      {Actor(actor)} {<span> died.</span>}
    </span>
  )
}

function TargetDamage(target: SActor | undefined, damage: number) {
  return (
    <>
      {Actor(target)}{' '}
      {
        <>
          took <span className="text-foreground/80">{damage} damage</span>.
        </>
      }
    </>
  )
}
function TargetDamagePercent(pre: SActor | undefined, damage: number) {
  if (!pre) return null
  let [health, maxHealth] = getHealth(pre)
  health = Math.max(health, 0)
  maxHealth = Math.max(maxHealth, 1)
  const remaining = Math.round((health / maxHealth) * 100)
  const percent = Math.min(Math.round((damage / maxHealth) * 100), remaining)
  return (
    <>
      {Actor(pre)}{' '}
      {
        <>
          lost <span className="text-foreground/80">{percent}% health</span>.
        </>
      }
    </>
  )
}
function TargetHeal(target: SActor | undefined, healed: number) {
  return (
    <>
      {Actor(target)}{' '}
      {
        <>
          healed for <span className="text-foreground/80">{healed} damage</span>
          .
        </>
      }
    </>
  )
}
function TargetEvade(target: SActor | undefined) {
  return (
    <>
      {Actor(target)} {<>evaded the attack.</>}
    </>
  )
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
function EffectSourceTrigger(effect: SlimEffect, source: SActor | undefined) {
  return (
    <>
      {Actor(source, `'s`)} {EffectTrigger(effect)}
    </>
  )
}
function ParentEffect(parent: SActor | undefined, effect: SlimEffect) {
  return (
    <>
      {Actor(parent)} gained {Effect(effect)}.
    </>
  )
}

function SourceAction(source: SActor | undefined, action: SAction) {
  return (
    <>
      {Actor(source)}{' '}
      {
        <>
          uses{' '}
          <span className="text-foreground font-semibold">{action.name}</span>.
        </>
      }
    </>
  )
}
function SourceMissed(source: SActor | undefined) {
  return <>{Actor(source)} missed.</>
}
function CriticalHit() {
  return <span className="text-yellow-200">Critical hit!</span>
}

export {
  SeporatorBottom,
  SeporatorTop,
  SeporatorThick,
  TurnStart,
  Actor,
  ActorActivated,
  ActorDeactivated,
  ActorDied,
  TargetDamage,
  TargetDamagePercent,
  TargetHeal,
  TargetEvade,
  Effect,
  EffectTrigger,
  EffectSourceTrigger,
  ParentEffect,
  SourceAction,
  SourceMissed,
  CriticalHit,
}
