import { findPlayer, getAliveActiveActors, getNodeCount } from '@/game/access'
import {
  createDialogOption,
  createSourceDialogOption,
  newMessage,
} from '@/game/encounter'
import { getMissingActorCount } from '@/game/player'
import {
  damagesResolver,
  mutatePlayerResolver,
  navigateEncounterResolver,
  pushMessagesResolver,
  startCombatResolver,
} from '@/game/resolvers'
import { type SEncounter, type SDialogNode, type SPlayer } from '@/game/state'
import { createActor } from '@/lib/create-actor'
import {
  TbUserPlus,
  TbUserMinus,
  TbUsersPlus,
  TbExternalLink,
  TbHeartPlus,
  TbSwords,
} from 'react-icons/tb'
import { v4 } from 'uuid'
import { InlineMutation } from '../actions/_system/inline-mutation'
import { Activate, ActivateX, Deactivate } from '../actions/_system/swap'
import { Heal } from '../actions/heal'
import { Fireball } from '../actions/fireball'
import { GiCreditsCurrency } from 'react-icons/gi'
import { FaQuestion } from 'react-icons/fa'
import { chance } from '@/lib/chance'
import { playerStore } from '@/hooks/usePlayer'
import { newCombat } from '@/game/lib/combat'
import { ArrowRight } from 'lucide-react'
import { TwoEncounter } from './two'
import { faker } from '@faker-js/faker'

const playerID = playerStore.getState().playerID

const Criminal = (_index: number, aiID: string) =>
  createActor(faker.person.firstName(), aiID, '', {
    accuracy: 0,
    strength: 100,
    evasion: 0,
    health: 100,
    insight: 100,
    faith: 100,
    speed: 100,
  })

const IntroNode0ID = v4()
const encounterPlayer: SPlayer = {
  ID: IntroNode0ID,
  activeActorIDs: [null, null, null],
  items: [
    {
      ID: v4(),
      name: 'Potion',
      value: 123,
      consumable: Heal,
      use: undefined,
      actions: undefined,
      effect: undefined,
    },
  ],
  credits: 710,
}
const criminal1 = Criminal(1, encounterPlayer.ID)
const criminal2 = Criminal(2, encounterPlayer.ID)
const criminal3 = Criminal(3, encounterPlayer.ID)

const IntroNode0: SDialogNode = {
  ID: IntroNode0ID,
  type: 'options',
  checks: (state, context) => [
    {
      chance: 50,
      success: (roll) => [
        //addPlayerResolver(encounterPlayer),
        pushMessagesResolver(context, [
          newMessage({
            text: (
              <span className="text-green-300">
                [random roll: success!]{' '}
                <span className="opacity-50">
                  (50{'>'}
                  {roll.toFixed(0)})
                </span>
              </span>
            ),
          }),
          newMessage({ text: `Your party avoided the trap!` }),
        ]),
      ],
      failure: (roll) => [
        //addPlayerResolver(encounterPlayer),
        pushMessagesResolver(context, [
          newMessage({
            text: (
              <span className="text-red-300">
                [random roll: failure!]{' '}
                <span className="opacity-50">
                  (50{'>'}
                  {roll.toFixed(0)})
                </span>
              </span>
            ),
          }),
          newMessage({ text: `Your party triggered a shock trap!` }),
        ]),
        ...state.actors
          .filter((a) => a.playerID === context.playerID)
          .map((a) =>
            damagesResolver(
              { ...context, targetIDs: [a.ID] },
              [
                {
                  type: 'percentage',
                  percentage: 0.125,
                  recoil: 0,
                  lifesteal: 0,
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
          <TbSwords />
        </>
      ),
      context,
      action: InlineMutation(() => [
        /* state.actors
          .filter((a) => a.playerID === playerID && isActive(state, a.ID))
          .map((a) => deactivateActorResolver(playerID, a.ID, context)), */
        startCombatResolver(
          newCombat({ exitNodeID: IntroNode1.ID }),
          {
            players: [encounterPlayer],
            actors: [criminal1, criminal2, criminal3],
          },
          {
            activeSize: 3,
          }
        ),
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
        text: <span className="font-semibold">"Show me your items."</span>,
        icons: (
          <>
            <GiCreditsCurrency />
          </>
        ),
      },
      context,
      IntroNode2.ID,
      []
    ),
    {
      ID: v4(),
      disable: 'disable',
      text: (
        <em className="inline-flex items-center">
          Flip a Coin (-1
          <span className="inline-block h-full">
            <GiCreditsCurrency />
          </span>
          )
        </em>
      ),
      icons: (
        <>
          <FaQuestion />
        </>
      ),
      context,
      action: {
        ...InlineMutation(
          (_state, context) => {
            const result = chance(50)
            const mutations = [
              mutatePlayerResolver(playerID, context, (p) => ({
                ...p,
                credits: p.credits - 1,
              })),
            ]
            if (result[0]) {
              mutations.push(
                pushMessagesResolver(context, [newMessage({ text: 'heads!' })])
              )
            } else {
              mutations.push(
                pushMessagesResolver(context, [newMessage({ text: 'tails!' })])
              )
            }

            return mutations
          },
          (a) => ({
            targets: {
              ...a.targets,
              validate: (_, context) => !!context.sourceID,
            },
            sources: (state, context) => getAliveActiveActors(state, context),
            validate: (state, context) =>
              getAliveActiveActors(state, context).length > 0 &&
              (findPlayer(state, context.playerID)?.credits ?? 0) > 0,
          })
        ),
      },
    },
    {
      ID: v4(),
      disable: 'hide',
      text: <em>Go to another encounter.</em>,
      icons: (
        <>
          <ArrowRight />
        </>
      ),
      context,
      action: InlineMutation((_s, c) => [
        navigateEncounterResolver(c, TwoEncounter),
      ]),
    },
  ],
  state: {},
}

const IntroNode1: SDialogNode = {
  ID: v4(),
  type: 'options',
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
      action: Deactivate,
    },
  ],
  state: {},
}

const IntroNode2: SDialogNode = {
  ID: v4(),
  type: 'shop',
  messages: () => [
    newMessage({
      ID: 'IntroNode2-0',
      text: 'Welcome to the shop!',
    }),
  ],
  options: (_, context) => [
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
  ],
  state: {},
  items: [
    {
      ID: v4(),
      name: 'Potion',
      value: 123,
      consumable: Heal,
      use: undefined,
      actions: undefined,
      effect: undefined,
    },
    {
      ID: v4(),
      name: 'Potion',
      value: 123,
      consumable: Heal,
      use: undefined,
      actions: undefined,
      effect: undefined,
    },
    {
      ID: v4(),
      name: 'Fireball Wand',
      value: 9994,
      consumable: undefined,
      use: undefined,
      actions: [Fireball],
      effect: undefined,
    },
  ],
  credits: 100,
}

const IntroEncounter: SEncounter = {
  ID: v4(),
  name: 'Introductions',
  persist: false,
  startNodeID: IntroNode0.ID,
  activeNodeID: undefined,
  nodes: [IntroNode0, IntroNode1, IntroNode2],
  nodeCounts: {},
  nodeHistory: [],
}

export { IntroEncounter }
