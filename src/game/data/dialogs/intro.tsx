import { getNodeCount } from '@/game/access'
import {
  createDialogOption,
  createSourceDialogOption,
  newMessage,
} from '@/game/encounter'
import { getMissingActorCount } from '@/game/player'
import {
  addPlayerResolver,
  damagesResolver,
  navigateDialogResolver,
  navigateEncounterResolver,
  pushMessagesResolver,
  startCombatResolver,
} from '@/game/resolvers'
import { type SEncounter, type SDialogNode, type SPlayer } from '@/game/state'
import { createActor } from '@/lib/create-actor'
import {
  TbUserMinus,
  TbUsersPlus,
  TbExternalLink,
  TbSwords,
} from 'react-icons/tb'
import { v4 } from 'uuid'
import { InlineMutation } from '../actions/_system/inline-mutation'
import { ActivateXSome, Deactivate } from '../actions/_system/swap'
import { Heal } from '../actions/heal'
import { Fireball } from '../actions/fireball'
import { playerStore } from '@/hooks/usePlayer'
import { newCombat } from '@/game/lib/combat'
import { ArrowRight } from 'lucide-react'
import { TwoEncounter } from './two'
import { faker } from '@faker-js/faker'
import { withConsumable } from '@/game/item'
import { newContext } from '@/game/mutations'
import { portraits } from '@/renderers/portraits'
import { LuSpeech } from 'react-icons/lu'

const playerID = playerStore.getState().playerID
const IntroEncounterID = v4()

const Criminal = (_index: number, aiID: string) =>
  createActor(faker.person.firstName(), aiID, portraits.skull, {
    accuracy: 0,
    strength: 50,
    evasion: 0,
    health: 100,
    intelligence: 50,
    faith: 50,
    speed: 50,
  })

const Node0ID = v4()
const skullMan = createActor('???', IntroEncounterID, portraits.skull, {
  accuracy: 0,
  strength: 100,
  evasion: 0,
  health: 100,
  intelligence: 100,
  faith: 100,
  speed: 100,
})
skullMan.ID === 'skullMan'
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

const Node0: SDialogNode = {
  ID: Node0ID,
  type: 'options',
  checks: () => [
    {
      chance: 100,
      success: () => {
        return [addPlayerResolver(encounterPlayer, [skullMan])]
      },
    },
  ],
  messages: (state) => {
    const count = getNodeCount(state, Node0.ID)
    if (count <= 1) {
      return [
        newMessage({
          ID: 'Node0-0',
          text: (
            <>
              Your party has traveled far to this land. You are unsure of
              exactly how long you've been traveling. Each party member is
              driven by their own quests and ambitions. As you all step off the
              small boat that brought you here, you are greeted by thick fog
              obscuring a view of a dark forest with mountains behind it.
            </>
          ),
        }),
        newMessage({
          ID: 'Node0-1',
          text: <>Near the road is a cloaked figure with a skull mask.</>,
        }),
        newMessage({
          ID: 'Node0-2',
          context: newContext({
            sourceID: skullMan.ID,
          }),
          type: 'dialogue',
          text: (
            <span>
              <p>
                "Ah. The new arrivals are here. You should know there horrors
                that lurk all throughout these lands. Someone must lead your
                party through the dark."
              </p>
            </span>
          ),
        }),
        newMessage({
          ID: 'Node0-3',
          type: 'narration',
          text: '(Only active characters can interact with dialogue and encounters. "Step Forward" below to activate party members.)',
        }),
      ]
    }
    return [
      newMessage({
        ID: 'Node0-0.' + count,
        context: newContext({ sourceID: skullMan.ID }),
        type: 'dialogue',
        text: '"What can I do for you all?"',
      }),
    ]
  },
  options: (state, context) => [
    {
      ID: 'Node0-Activate-All-Actors',
      disable: 'hide',
      text: <em>Step Forward</em>,
      icons: (
        <>
          <TbUsersPlus />
        </>
      ),
      context,
      action: ActivateXSome(getMissingActorCount(state, context.playerID), [
        navigateDialogResolver(Node1.ID, context),
      ]),
    },
    {
      ID: 'Node0-Start-Combat',
      disable: 'hide',
      text: <em>Attack the man.</em>,
      icons: (
        <>
          <TbSwords />
        </>
      ),
      context,
      action: InlineMutation(() => [
        startCombatResolver(
          newCombat({ exitNodeID: NodeAfterCombat.ID }),
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

const Node1: SDialogNode = {
  ID: v4(),
  type: 'options',
  checks: () => [],
  messages: () => [
    newMessage({
      ID: 'Node1-0',
      type: 'dialogue',
      context: newContext({
        sourceID: skullMan.ID,
      }),
      text: (
        <>
          "What consequences of life brings each of you here I wonder. No one
          comes to this land by their own accord."
        </>
      ),
    }),
  ],
  options: (_state, context) => [
    {
      ID: 'Node1-Start-Combat',
      disable: 'hide',
      text: <em>Attack the man.</em>,
      icons: (
        <>
          <TbSwords />
        </>
      ),
      context,
      action: InlineMutation(() => [
        startCombatResolver(
          newCombat({ exitNodeID: NodeAfterCombat.ID }),
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
    createSourceDialogOption(
      {
        text: <>"I seek healing."</>,
        icons: (
          <>
            <LuSpeech />
          </>
        ),
      },
      context,
      NodeShop.ID,
      []
    ),
    createSourceDialogOption(
      {
        text: <>"I seek the beast that attacked my home."</>,
        icons: (
          <>
            <LuSpeech />
          </>
        ),
      },
      context,
      NodeShop.ID,
      []
    ),
    createSourceDialogOption(
      {
        text: <>"I seek the truth."</>,
        icons: (
          <>
            <LuSpeech />
          </>
        ),
      },
      context,
      NodeShop.ID,
      []
    ),
    createSourceDialogOption(
      {
        text: <>"I seek personal meaning."</>,
        icons: (
          <>
            <LuSpeech />
          </>
        ),
      },
      context,
      NodeShop.ID,
      []
    ),
    createSourceDialogOption(
      {
        text: <em>stay silent.</em>,
        icons: (
          <>
            <LuSpeech />
          </>
        ),
      },
      context,
      NodeShop.ID,
      []
    ),
  ],
}

const NodeAfterCombat: SDialogNode = {
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
      Node0.ID,
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

const NodeShop: SDialogNode = {
  ID: v4(),
  type: 'shop',
  messages: (state) => {
    const count = getNodeCount(state, Node0.ID)
    return [
      newMessage({
        ID: 'IntroNode2-0.' + count,
        type: 'dialogue',
        context: newContext({ sourceID: skullMan.ID }),
        text: '"Uh huh, very nice. Would you like to buy anything?"',
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
      Node0.ID,
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
  name: 'A Last Resort, a New Begining',
  persist: false,
  startNodeID: Node0.ID,
  nodes: [Node0, Node1, NodeAfterCombat, NodeShop],
}

export { IntroEncounter }
