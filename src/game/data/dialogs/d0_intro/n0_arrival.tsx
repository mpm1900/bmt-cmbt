import { getNodeCount } from '@/game/access'
import { newMessage } from '@/game/encounter'
import { newContext } from '@/game/mutations'
import {
  addPlayerResolver,
  navigateDialogResolver,
  navigateEncounterResolver,
  startCombatResolver,
} from '@/game/resolvers'
import type { SDialogNode } from '@/game/state'
import { TbSwords, TbUsersPlus } from 'react-icons/tb'
import { v4 } from 'uuid'
import { ActivateXSome } from '../../actions/_system/swap'
import { getMissingActorCount } from '@/game/player'
import { InlineMutation } from '../../actions/_system/inline-mutation'
import { newCombat } from '@/game/lib/combat'
import { ArrowRight } from 'lucide-react'
import { criminal2, criminal3, d0_PLAYER, skullMan } from './_shared'
import { Node1ID } from './n1_question'
import { TwoEncounter } from '../two'
import { NodeAfterCombat } from '../intro'

const Node0ID = v4()
const Node0: SDialogNode = {
  ID: Node0ID,
  type: 'options',
  checks: () => [
    {
      chance: 100,
      success: () => {
        return [addPlayerResolver(d0_PLAYER, [skullMan])]
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
                party through the dark. Step forward."
              </p>
            </span>
          ),
        }),
        newMessage({
          ID: 'Node0-3',
          type: 'narration',
          text: '(Only active party memebers can interact with dialogue and encounters.)',
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
        navigateDialogResolver(Node1ID, context),
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
            players: [d0_PLAYER],
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

export { Node0ID, Node0 }
