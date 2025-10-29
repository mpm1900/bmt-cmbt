import { createCombat, type SDialog, type SDialogNode } from '@/game/state'
import { v4 } from 'uuid'
import { InlineMutation } from '../actions/_system/inline-mutation'
import {
  damagesResolver,
  pushMessagesResolver,
  startCombatResolver,
} from '@/game/resolvers'
import { createActor } from '@/lib/create-actor'
import { Activate, ActivateX, Deactivate } from '../actions/_system/swap'
import {
  createDialogOption,
  createSourceDialogOption,
  newMessage,
} from '@/game/dialog'
import { withMessageLogs } from '../actions/_system/with-message-logs'
import { findActor, getNodeCount } from '@/game/access'
import { Heal } from '../actions/heal'
import { getMissingActorCount } from '@/game/player'

const Criminal = (aiID: string) =>
  createActor('Criminal', aiID, {
    accuracy: 0,
    body: 100,
    evasion: 0,
    health: 0,
    intelligence: 100,
    reflexes: 100,
    speed: 100,
  })

const IntroNode0ID = v4()
const IntroNode0: SDialogNode = {
  ID: IntroNode0ID,
  checks: (state, context) => [
    {
      chance: 50,
      success: (roll) => [
        pushMessagesResolver(context, [
          newMessage({ text: `random roll: success! (${roll.toFixed(0)})` }),
        ]),
      ],
      failure: (roll) => [
        pushMessagesResolver(context, [
          newMessage({ text: `random roll: failure! (${roll.toFixed(0)})` }),
        ]),
        ...state.actors
          .filter((a) => a.playerID === context.playerID)
          .map((a) =>
            damagesResolver(
              { ...context, targetIDs: [a.ID] },
              [
                {
                  type: 'raw',
                  raw: 10,
                },
              ],
              [{ ...context, targetIDs: [a.ID] }]
            )
          ),
      ],
    },
  ],
  messages: (state) => {
    const count = getNodeCount(state, IntroNode0.ID)
    if (count <= 1) {
      return [
        newMessage({
          ID: 'IntroNode0-0',
          text: 'Game start.',
        }),
        newMessage({
          ID: 'IntroNode0-1',
          text: 'Welcome to the game! This is a test dialog message. What would you like to do first?',
        }),
      ]
    }
    return [
      newMessage({
        ID: 'IntroNode0-0.b',
        text: 'Welcome back to this node.',
      }),
    ]
  },
  options: (state, context) => [
    {
      ID: 'IntroNode0-Start-Combat',
      disable: 'hide',
      text: <em>Start Combat</em>,
      icons: '',
      context,
      action: InlineMutation(() => [
        startCombatResolver(createCombat(), {
          players: [
            {
              ID: IntroNode0ID,
              activeActorIDs: [null, null, null],
              items: [],
            },
          ],
          actors: [
            Criminal(IntroNode0ID),
            Criminal(IntroNode0ID),
            Criminal(IntroNode0ID),
          ],
        }),
      ]),
    },
    {
      ID: 'IntroNode0-Heal',
      disable: 'hide',
      text: <em>Heal</em>,
      icons: '',
      context,
      action: Heal,
    },

    {
      ID: 'IntroNode0-Activate-Actor',
      disable: 'hide',
      text: <em>Activate</em>,
      icons: '',
      context,
      action: Activate,
    },
    {
      ID: 'IntroNode0-Activate-All-Actors',
      disable: 'hide',
      text: <em>Activate All</em>,
      icons: '',
      context,
      action: ActivateX(getMissingActorCount(state, context.playerID)),
    },
    createSourceDialogOption(
      {
        text: <span className="font-semibold">"Hello over there!"</span>,
      },
      context,
      IntroNode1.ID,
      []
    ),
  ],
  state: {},
}

const IntroNode1: SDialogNode = {
  ID: v4(),
  checks: () => [],
  messages: () => [
    newMessage({
      ID: 'IntroNode1-0',
      text: 'This is a second dialog node!',
    }),
  ],
  options: (_state, context) => [
    createDialogOption(
      {
        text: <em>Go back</em>,
      },
      context,
      IntroNode0.ID,
      []
    ),
    {
      ID: 'IntroNode1-Deactivate-Actor',
      disable: 'hide',
      text: <em>Deactivate</em>,
      icons: '',
      context,
      action: withMessageLogs(Deactivate, (s, c) => [
        newMessage({
          text: `${findActor(s, c.targetIDs[0])?.name} deactivated.`,
        }),
      ]),
    },
  ],
  state: {},
}

const IntroDialog: SDialog = {
  ID: v4(),
  startNodeID: IntroNode0.ID,
  activeNodeID: undefined,
  nodes: [IntroNode0, IntroNode1],
  nodeCounts: {},
  nodeHistory: [],
}

export { IntroDialog }
