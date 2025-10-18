import { Fireball } from '@/game/data/actions/fireball'
import { useGameState } from '@/hooks/useGameState'
import { createFileRoute } from '@tanstack/react-router'

import { DbAction } from '../components/__dep/db-action'
import { Button } from '@/components/ui/button'
import { withEffects } from '@/game/actor'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { state, next, flush } = useGameState((state) => state)
  const actors = state.actors.map((actor) => withEffects(actor, state.effects))
  console.log(actors)

  return (
    <div className="flex gap-4">
      <div>
        <div>
          <p>Acions: {state.actionQueue.length}</p>
          <p>Triggers: {state.triggerQueue.length}</p>
          <p>Mutations: {state.mutationQueue.length}</p>
        </div>
        <Button onClick={() => next()}>Next</Button>
        <Button onClick={() => flush()}>Flush</Button>
      </div>
      <div className="flex flex-col gap-4">
        {actors.map(([actor, modifiers]) => (
          <div key={actor.ID}>
            <p>{actor.name}</p>
            {Fireball.validate(state, {
              sourceID: actor.ID,
              targetIDs: [],
            }) && <DbAction action={Fireball} sourceID={actor.ID} />}
            <pre>{JSON.stringify(actor.stats)}</pre>
            <pre>{JSON.stringify(actor.state)}</pre>
            <div>Modifiers: {modifiers.length}</div>
          </div>
        ))}
      </div>
      <div>
        <p>Effects: {state.effects.length}</p>
        {state.effects.map(({ ID, effect, context }) => (
          <div key={ID}>
            <p>{ID}</p>
            <p>{effect.ID}</p>
            <pre>{JSON.stringify(effect.modifiers(context))}</pre>
            <pre>{JSON.stringify(effect.triggers(context))}</pre>
          </div>
        ))}
      </div>
    </div>
  )
}
