import { createCombat, type SDialog, type SDialogNode } from '@/game/state'
import { v4 } from 'uuid'
import { InlineMutation } from '../actions/_system/inline-mutation'
import { startCombatResolver } from '@/game/resolvers'
import { createActor } from '@/lib/create-actor'
import { Activate, Deactivate } from '../actions/_system/swap'
import { createStaticNavigationOption, newMessage } from '@/game/dialog'
import { withMessageLogs } from '../actions/_system/with-message-logs'
import { findActor, getAliveActiveActors } from '@/game/access'
import { Heal } from '../actions/heal'
import { newContext } from '@/game/mutations'

const context = newContext({ playerID: '__player__' })

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
      ID: 'IntroNode0-0',
      actorID: '',
      text: 'Game start.',
    },
    {
      ID: 'IntroNode0-1',
      actorID: '',
      text: 'Welcome to the game! This is a test dialog message. What would you like to do first?',
    },
  ],
  options: (state) => [
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
      action: withMessageLogs(Activate, (s, c) => [
        newMessage(`${findActor(s, c.targetIDs[0])?.name} activated.`),
      ]),
      sourceOptions: [],
      targetOptions: Activate.targets.get(state, context).map((a) => {
        return {
          ID: a.ID,
          text: a.target.name,
          playerID: a.target.playerID,
          sourceID: '',
          targetIDs: [a.target.ID],
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
      action: withMessageLogs(Deactivate, (s, c) => [
        newMessage(`${findActor(s, c.targetIDs[0])?.name} deactivated.`),
      ]),
      sourceOptions: [],
      targetOptions: Deactivate.targets.get(state, context).map((a) => {
        return {
          ID: a.ID,
          text: a.target.name,
          playerID: a.target.playerID,
          sourceID: '',
          targetIDs: [a.target.ID],
          positions: [],
        }
      }),
    },
    {
      ID: v4(),
      type: 'single-target',
      text: <em className="font-light">Heals</em>,
      icons: '',
      context,
      action: withMessageLogs(Heal, (s, c) => [
        newMessage(`${findActor(s, c.targetIDs[0])?.name} healed.`),
      ]),
      sourceOptions: getAliveActiveActors(state, context).map((a) => {
        return {
          ID: a.ID,
          text: a.name,
          playerID: a.playerID,
          sourceID: a.ID,
          targetIDs: [],
          positions: [],
        }
      }),
      targetOptions: Heal.targets.get(state, context).map((a) => {
        return {
          ID: a.ID,
          text: a.target.name,
          playerID: a.target.playerID,
          sourceID: '',
          targetIDs: [a.target.ID],
          positions: [],
        }
      }),
    },
    createStaticNavigationOption(
      {
        text: <em className="font-light">Go to other node</em>,
      },
      IntroNode1.ID,
      []
    ),
    createStaticNavigationOption(
      {
        text: (
          <span className="font-semibold">"Go to other node but a quote"</span>
        ),
      },
      IntroNode1.ID,
      []
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
      ID: 'IntroNode1-0',
      type: '',
      actorID: '',
      text: 'This is a second dialog node!',
    },
  ],
  options: (_state) => [
    createStaticNavigationOption(
      {
        text: <em className="font-light">Go back</em>,
      },
      IntroNode0.ID,
      []
    ),
  ],
  post: () => [],
}

const IntroDialog: SDialog = {
  ID: v4(),
  nodes: [IntroNode0, IntroNode1],
  startNodeID: IntroNode0.ID,
  activeNodeID: undefined,
}

export { IntroDialog }
