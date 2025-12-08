import { getNodeCount } from '@/game/access'
import { createDialogOption, newMessage } from '@/game/encounter'
import { damagesResolver, pushMessagesResolver } from '@/game/resolvers'
import { type SEncounter, type SDialogNode } from '@/game/state'
import { TbUserMinus, TbExternalLink } from 'react-icons/tb'
import { v4 } from 'uuid'
import { Heal } from '../actions/heal'
import { Fireball } from '../actions/fireball'
import { playerStore } from '@/hooks/usePlayer'
import { withConsumable } from '@/game/item'
import { newContext } from '@/game/mutations'
import { d0_ID, skullMan } from './d0_intro/_shared'
import { Node0, Node0ID } from './d0_intro/n0_arrival'
import { Node1 } from './d0_intro/n1_question'
import { Deactivate } from '../actions/_system/swap'

const playerID = playerStore.getState().playerID

const NodeAfterCombat: SDialogNode = {
  ID: v4(),
  type: 'options',
  checks: (state, context) => [
    {
      chance: 50,
      success: (roll) => [
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

const IntroEncounter: SEncounter = {
  ID: d0_ID,
  name: 'A Last Resort, a New Begining',
  persist: false,
  startNodeID: Node0ID,
  nodes: [Node0, Node1, NodeAfterCombat, NodeShop],
}

export { IntroEncounter, NodeAfterCombat, NodeShop }
