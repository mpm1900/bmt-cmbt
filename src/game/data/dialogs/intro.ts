import { createCombat, type SDialog, type SDialogNode } from '@/game/state'
import { v4 } from 'uuid'
import { InlineMutation } from '../actions/_system/inline-mutation'
import { startCombatResolver } from '@/game/resolvers'
import { createActor } from '@/lib/create-actor'
import { Activate, Deactivate } from '../actions/_system/swap'
import { getAliveActiveActors, getAliveInactiveActors } from '@/game/access'
import { NavigateDialog } from '../actions/_system/navigate-dialog'

const Criminal = () =>
  createActor('Criminal', '__ai__', {
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
      text: 'Game start.',
    },
    {
      ID: v4(),
      type: '',
      actorID: '',
      text: 'Welcome to the game! This is a test dialog message. What would you like to do first?',
    },
  ],
  options: (state, context) => [
    {
      ID: v4(),
      type: 'static',
      text: 'Start Combat',
      icons: '',
      context,
      action: InlineMutation(() => [
        startCombatResolver(createCombat(), {
          actors: [Criminal(), Criminal()],
        }),
      ]),
    },
    {
      ID: v4(),
      type: 'dynamic',
      text: 'Activate Actor',
      icons: '',
      context,
      action: Activate,
      options: getAliveInactiveActors(state, context).map((a) => {
        return {
          ID: a.ID,
          text: a.name,
          playerID: a.playerID,
          sourceID: '',
          targetIDs: [a.ID],
          positions: [],
        }
      }),
    },
    {
      ID: v4(),
      type: 'dynamic',
      text: 'Deactivate Actor',
      icons: '',
      context,
      action: Deactivate,
      options: getAliveActiveActors(state, context).map((a) => {
        return {
          ID: a.ID,
          text: a.name,
          playerID: a.playerID,
          sourceID: '',
          targetIDs: [a.ID],
          positions: [],
        }
      }),
    },
    {
      ID: v4(),
      type: 'static',
      text: 'Go to other node',
      icons: '',
      context,
      action: NavigateDialog(
        IntroNode1.ID,
        IntroNode0.messages(state, context)
      ),
    },
  ],
  post: () => [],
}

const IntroNode1: SDialogNode = {
  ID: v4(),
  status: 'pre',
  pre: () => [],
  messages: () => [
    {
      ID: v4(),
      type: '',
      actorID: '',
      text: 'This is a second dialog node!',
    },
  ],
  options: (state, context) => [
    {
      ID: v4(),
      type: 'static',
      text: 'Go back',
      icons: '',
      context,
      action: NavigateDialog(
        IntroNode0.ID,
        IntroNode1.messages(state, context)
      ),
    },
  ],
  post: () => [],
}

const IntroDialog: SDialog = {
  ID: v4(),
  nodes: [IntroNode0, IntroNode1],
  activeNodeID: IntroNode0.ID,
}

export { IntroDialog }
