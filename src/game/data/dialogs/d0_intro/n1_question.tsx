import { createSourceDialogOption, newMessage } from '@/game/encounter'
import { newContext } from '@/game/mutations'
import type { SDialogNode } from '@/game/state'
import { v4 } from 'uuid'
import { criminal2, criminal3, d0_PLAYER, skullMan } from './_shared'
import { TbSwords } from 'react-icons/tb'
import { InlineMutation } from '../../actions/_system/inline-mutation'
import { startCombatResolver } from '@/game/resolvers'
import { newCombat } from '@/game/lib/combat'
import { LuSpeech } from 'react-icons/lu'
import { NodeAfterCombat, NodeShop } from '../intro'

const Node1ID = v4()
const Node1: SDialogNode = {
  ID: Node1ID,
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
            players: [d0_PLAYER],
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

export { Node1, Node1ID }
