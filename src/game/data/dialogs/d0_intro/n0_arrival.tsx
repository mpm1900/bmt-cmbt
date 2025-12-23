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
              You have travelled far. Every member of your party has their own
              reasons for coming here.
            </>
          ),
        }),
        newMessage({
          ID: 'Node0-1',
          text: (
            <>
              As the ship you sailed on comes to a halt on the black water, you
              notice what appears to be a masked main standing under a lamp.
              They seem to be waiting for the ship to arrive.
            </>
          ),
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
                "Ah. The new arrivals are here. You all seem to have your wits
                about you."
              </p>
            </span>
          ),
        }),
        newMessage({
          ID: 'Node0-3',
          type: 'narration',
          text: (
            <span className="opacity-60">
              (This game features a split active/inactive party system. Only
              "active" party members can participate in converations and act in
              combat.)
            </span>
          ),
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
      text: (
        <em>
          Step Forward <span className="opacity-60">(Activate)</span>
        </em>
      ),
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
