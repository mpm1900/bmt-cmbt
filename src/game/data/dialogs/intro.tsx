import { createCombat, type SDialog, type SDialogNode } from '@/game/state'
import { v4 } from 'uuid'
import { InlineMutation } from '../actions/_system/inline-mutation'
import { startCombatResolver } from '@/game/resolvers'
import { createActor } from '@/lib/create-actor'
import { Activate, Deactivate } from '../actions/_system/swap'
import { getAliveInactiveActors } from '@/game/access'
import { NavigateDialog } from '../actions/_system/navigate-dialog'
import { createStaticNavigationOption } from '@/game/dialog'

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
      actorID: '',
      text: 'Game start.',
    },
    {
      ID: v4(),
      actorID: '',
      text: 'Welcome to the game! This is a test dialog message. What would you like to do first?',
    },
  ],
  options: (state, context) => [
    {
      ID: v4(),
      type: 'no-target',
      text: <em className="font-light">Start Combat</em>,
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
      type: 'single-target',
      text: <em className="font-light">Activate Actor</em>,
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
      type: 'single-target',
      text: <em className="font-light">Deactivate Actor</em>,
      icons: '',
      context,
      action: Deactivate,
      options: Deactivate.targets.get(state, context).map(({ target }) => {
        return {
          ID: target.ID,
          text: target.name,
          playerID: target.playerID,
          sourceID: '',
          targetIDs: [target.ID],
          positions: [],
        }
      }),
    },
    createStaticNavigationOption(
      {
        text: <em className="font-light">Go to other node</em>,
      },
      IntroNode1.ID,
      IntroNode0.messages(state, context)
    ),
    createStaticNavigationOption(
      {
        text: (
          <span className="font-semibold">"Go to other node but a quote"</span>
        ),
      },
      IntroNode1.ID,
      IntroNode0.messages(state, context)
    ),
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
      type: 'no-target',
      text: <em>Go back</em>,
      icons: '',
      context,
      action: NavigateDialog(
        IntroNode0.ID,
        IntroNode1.messages(state, context).concat([
          {
            ID: v4(),
            actorID: '',
            text: <em>Go back</em>,
          },
        ])
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
