import { createSourceDialogOption, newMessage } from '@/game/encounter'
import { newContext } from '@/game/mutations'
import type { SDialogNode } from '@/game/state'
import { v4 } from 'uuid'
import { criminal2, criminal3, d0_PLAYER, skullMan } from './_shared'
import { TbSwords, TbUsersPlus } from 'react-icons/tb'
import { InlineMutation } from '../../actions/_system/inline-mutation'
import { navigateDialogResolver, startCombatResolver } from '@/game/resolvers'
import { newCombat } from '@/game/lib/combat'
import { LuSpeech } from 'react-icons/lu'
import { NodeAfterCombat, NodeShop } from '../intro'
import { Node1A0ID } from './n2_n1a0_whatis'
import { ActivateXSome } from '../../actions/_system/swap'
import { getMissingActorCount } from '@/game/player'

const Node1ID = v4()
const Node1: SDialogNode = {
  ID: Node1ID,
  type: 'options',
  checks: () => [],
  messages: () => [
    newMessage({
      type: 'dialogue',
      context: newContext({
        sourceID: skullMan.ID,
      }),
      text: (
        <>
          "I'm sure you must have many questions, for these are interesting
          times indeed. Just know, you are not safe here. Arrivals are easy
          prey."
        </>
      ),
    }),
  ],
  options: (state, context) => [
    createSourceDialogOption(
      {
        text: <>"What is this place?"</>,
        icons: (
          <>
            <LuSpeech />
          </>
        ),
      },
      context,
      Node1A0ID,
      []
    ),
    createSourceDialogOption(
      {
        text: <>"Do you have anything to trade?"</>,
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
    {
      ID: v4(),
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
            players: [d0_PLAYER],
            actors: [skullMan, criminal2, criminal3],
          },
          {
            activeSize: 3,
          }
        ),
      ]),
    },
  ],
}

export { Node1, Node1ID }
