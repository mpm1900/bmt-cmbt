import { findPlayer, getAliveActiveActors, getNodeCount } from '@/game/access'
import {
  createDialogOption,
  createSourceDialogOption,
  newMessage,
} from '@/game/encounter'
import { getMissingActorCount } from '@/game/player'
import {
  addPlayerResolver,
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
import { withConsumable } from '@/game/item'
import { newContext } from '@/game/mutations'
import { portraits } from '@/renderers/portraits'

const playerID = playerStore.getState().playerID
const IntroEncounterID = v4()

const Criminal = (_index: number, aiID: string) =>
  createActor(faker.person.firstName(), aiID, portraits.skull, {
    accuracy: 0,
    strength: 100,
    evasion: 0,
    health: 100,
    insight: 100,
    faith: 100,
    speed: 100,
  })

const IntroNode0ID = v4()
const skullMan = createActor('???', IntroEncounterID, portraits.skull, {
  accuracy: 0,
  strength: 100,
  evasion: 0,
  health: 100,
  insight: 100,
  faith: 100,
  speed: 100,
})
const criminal2 = Criminal(2, IntroEncounterID)
const criminal3 = Criminal(3, IntroEncounterID)
const encounterPlayer: SPlayer = {
  ID: IntroEncounterID,
  activeActorIDs: [null, null, skullMan.ID],
  items: [
    withConsumable(
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
        playerID,
      }
    ),
  ],
  credits: 710,
}

const IntroNode0: SDialogNode = {
  ID: IntroNode0ID,
  type: 'options',
  checks: () => [
    {
      chance: 100,
      success: () => {
        return [addPlayerResolver(encounterPlayer, [skullMan])]
      },
      failure: () => {
        console.error('nope')
        return []
      },
    },
  ],
  messages: (state) => {
    const count = getNodeCount(state, IntroNode0.ID)
    if (count <= 1) {
      return [
        newMessage({
          ID: 'IntroNode0-0',
          text: (
            <>
              Your party has traveled far to this land, each member driven by
              their own motivations. As you all step out of the carriage, you
              see foggy woods that mark the outskirts of the city.
            </>
          ),
        }),
        newMessage({
          ID: 'IntroNode0-1',
          text: <>Near the road is a cloaked figure with a skull mask.</>,
        }),
        newMessage({
          ID: 'IntroNode0-2',
          context: newContext({
            sourceID: skullMan.ID,
          }),
          type: 'dialogue',
          text: <>"Ah. The new arrivals are here."</>,
        }),
      ]
    }
    return [
      newMessage({
        ID: 'IntroNode0-0.' + count,
        context: newContext({ sourceID: skullMan.ID }),
        type: 'dialogue',
        text: '"What can I do for you all?"',
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
        startCombatResolver(
          newCombat({ exitNodeID: IntroNode1.ID }),
          {
            players: [encounterPlayer],
            actors: [skullMan, criminal2, criminal3],
          },
          {
            activeSize: 3,
          }
        ),
      ]),
    },
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
        text: <span>"What do you have for sale?"</span>,
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
}

const IntroNode1: SDialogNode = {
  ID: v4(),
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
          .filter((a) => {
            return a.playerID === context.playerID
          })
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
}

const IntroNode2: SDialogNode = {
  ID: v4(),
  type: 'shop',
  messages: (state) => {
    const count = getNodeCount(state, IntroNode0.ID)
    return [
      newMessage({
        ID: 'IntroNode2-0.' + count,
        type: 'dialogue',
        context: newContext({ sourceID: skullMan.ID }),
        text: '"Nothing much. I\'m just a mere watcher of new arrivals. Have a look."',
      }),
    ]
  },
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
  items: [
    withConsumable(
      {
        ID: v4(),
        name: 'Potion',
        value: 123,
        consumable: Heal,
        use: undefined,
        actions: undefined,
        effect: undefined,
      },
      { playerID }
    ),
    withConsumable(
      {
        ID: v4(),
        name: 'Potion',
        value: 123,
        consumable: Heal,
        use: undefined,
        actions: undefined,
        effect: undefined,
      },
      { playerID }
    ),
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

// const IntroNode3: SDialogNode = {}

const IntroEncounter: SEncounter = {
  ID: IntroEncounterID,
  name: 'Introductions',
  persist: false,
  startNodeID: IntroNode0.ID,
  nodes: [IntroNode0, IntroNode1, IntroNode2],
}

export { IntroEncounter }
