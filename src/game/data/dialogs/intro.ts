import { createCombat, type SDialog, type SDialogNode } from '@/game/state'
import { v4 } from 'uuid'
import { InlineMutation } from '../actions/_system/inline-mutation'
import { startCombatResolver } from '@/game/resolvers'
import { createActor } from '@/lib/create-actor'

const Criminal = createActor('Criminal', '__ai__', {
  accuracy: 0,
  body: 100,
  evasion: 0,
  health: 0,
  intelligence: 100,
  reflexes: 100,
  speed: 100,
})

const IntroNode0: SDialogNode = {
  ID: v4(),
  status: 'pre',
  pre: () => [],
  messages: () => [
    {
      ID: v4(),
      type: '',
      actorID: '',
      text: 'Welcome to the game! This is a test dialog message. What would you like to do first?',
    },
  ],
  options: (_state, context) => [
    {
      ID: v4(),
      text: 'Start Combat',
      icons: '',
      context,
      action: InlineMutation(() => [
        startCombatResolver(createCombat(), [Criminal]),
      ]),
    },
  ],
  post: () => [],
}

const IntroDialog: SDialog = {
  ID: v4(),
  nodes: [IntroNode0],
  activeNodeID: IntroNode0.ID,
}

export { IntroDialog }
