import type { SActor } from '@/game/state'
import { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'

function ActorDialog({ actor }: { actor: SActor }) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{actor.name}</DialogTitle>
      </DialogHeader>
    </DialogContent>
  )
}

export { ActorDialog }
