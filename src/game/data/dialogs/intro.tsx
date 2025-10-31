import { findActor, getNodeCount } from '@/game/access'
import {
  createDialogOption,
  createSourceDialogOption,
  newMessage,
} from '@/game/dialog'
import { getMissingActorCount } from '@/game/player'
import {
  damagesResolver,
  pushMessagesResolver,
  startCombatResolver,
} from '@/game/resolvers'
import {
  createCombat,
  type SDialog,
  type SDialogNode,
  type SPlayer,
} from '@/game/state'
import { createActor } from '@/lib/create-actor'
import {
  TbMessage2Share,
  TbUserPlus,
  TbUserMinus,
  TbUsersPlus,
  TbExternalLink,
  TbHeartPlus,
} from 'react-icons/tb'
import { v4 } from 'uuid'
import { InlineMutation } from '../actions/_system/inline-mutation'
import { Activate, ActivateX, Deactivate } from '../actions/_system/swap'
import { withMessageLogs } from '../actions/_system/with-message-logs'
import { Heal, SelfHealSource } from '../actions/heal'

const Criminal = (index: number, aiID: string) =>
  createActor(`Criminal (${index})`, aiID, {
    accuracy: 0,
    body: 100,
    evasion: 0,
    health: 0,
    mind: 100,
    reflexes: 100,
    speed: 100,
  })

const IntroNode0ID = v4()
const encounterPlayer: SPlayer = {
  ID: IntroNode0ID,
  activeActorIDs: [null, null, null],
  items: [],
}
const criminal1 = Criminal(1, encounterPlayer.ID)
const criminal2 = Criminal(2, encounterPlayer.ID)
const criminal3 = Criminal(3, encounterPlayer.ID)

const IntroNode0: SDialogNode = {
  ID: IntroNode0ID,
  checks: (state, context) => [
    {
      chance: 50,
      success: (roll) => [
        pushMessagesResolver(context, [
          newMessage({
            text: `random roll: success! (50 > ${roll.toFixed(0)})`,
          }),
          newMessage({ text: `Your crew avoided the trap!` }),
        ]),
      ],
      failure: (roll) => [
        pushMessagesResolver(context, [
          newMessage({
            text: `random roll: failure! (50 > ${roll.toFixed(0)})`,
          }),
          newMessage({ text: `Your crew triggered a shock trap!` }),
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
              [],
              0
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
      icons: (
        <>
          <TbExternalLink />
        </>
      ),
      context,
      action: InlineMutation(() => [
        startCombatResolver(createCombat(IntroNode1.ID, []), {
          players: [encounterPlayer],
          actors: [criminal1, criminal2, criminal3],
        }),
      ]),
    },
    /*
    {
      ID: 'IntroNode-AddPlayer',
      disable: 'hide',
      text: <em>Add Player</em>,
      icons: <></>,
      context,
      action: InlineMutation(() => [addPlayerResolver(encounterPlayer)]),
    },
    */
    {
      ID: v4(),
      disable: 'hide',
      text: <em>Heal</em>,
      icons: (
        <>
          <TbHeartPlus />
        </>
      ),
      context,
      action: Heal,
    },
    {
      ID: v4(),
      disable: 'hide',
      text: <em>Self Heal</em>,
      icons: (
        <>
          <TbHeartPlus />
        </>
      ),
      context,
      action: SelfHealSource,
    },
    {
      ID: 'IntroNode0-Activate-Actor',
      disable: 'hide',
      text: <em>Activate</em>,
      icons: (
        <>
          <TbUserPlus />
        </>
      ),
      context,
      action: Activate,
    },
    {
      ID: 'IntroNode0-Activate-All-Actors',
      disable: 'hide',
      text: <em>Activate All</em>,
      icons: (
        <>
          <TbUsersPlus />
        </>
      ),
      context,
      action: ActivateX(getMissingActorCount(state, context.playerID)),
    },
    createSourceDialogOption(
      {
        text: <span className="font-semibold">"Hello over there!"</span>,
        icons: (
          <>
            <TbMessage2Share />
          </>
        ),
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
        icons: (
          <>
            <TbExternalLink />
          </>
        ),
      },
      context,
      IntroNode0.ID,
      []
    ),
    {
      ID: 'IntroNode1-Deactivate-Actor',
      disable: 'hide',
      text: <em>Deactivate</em>,
      icons: (
        <>
          <TbUserMinus />
        </>
      ),
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
