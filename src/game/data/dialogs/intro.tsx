import { createCombat, type SDialog, type SDialogNode } from '@/game/state'
import { v4 } from 'uuid'
import { InlineMutation } from '../actions/_system/inline-mutation'
import { startCombatResolver } from '@/game/resolvers'
import { createActor } from '@/lib/create-actor'
import { Activate, Deactivate } from '../actions/_system/swap'
import {
  createSourceNavigationOption,
  createStaticNavigationOption,
  newMessage,
} from '@/game/dialog'
import { withMessageLogs } from '../actions/_system/with-message-logs'
import { findActor } from '@/game/access'
import { Heal } from '../actions/heal'
import { newContext } from '@/game/mutations'
import { playerStore } from '@/hooks/usePlayer'

const playerID = playerStore.getState().playerID

const context = {
  ID: v4(),
  text: '',
  ...newContext({ playerID }),
}

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
  messages: () => [
    {
      ID: 'IntroNode0-0',
      actorID: '',
      text: 'Game start.',
    },
    {
      ID: 'IntroNode0-1',
      actorID: '',
      text: 'Welcome to the game! This is a test dialog message. What would you like to do first?',
    },
  ],
  options: () => [
    {
      ID: 'IntroNode0-Start-Combat',
      type: 'no-target',
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
          actors: [Criminal(IntroNode0ID), Criminal(IntroNode0ID)],
        }),
      ]),
    },
    {
      ID: 'IntroNode0-Activate-Actor',
      type: 'single-target',
      text: <em>Activate</em>,
      icons: '',
      context,
      action: withMessageLogs(Activate, (s, c) => [
        newMessage({
          text: `${findActor(s, c.targetIDs[0])?.name} activated.`,
        }),
      ]),
    },
    {
      ID: 'IntroNode0-Deactivate-Actor',
      type: 'single-target',
      text: <em>Deactivate</em>,
      icons: '',
      context,
      action: withMessageLogs(Deactivate, (s, c) => [
        newMessage({
          text: `${findActor(s, c.targetIDs[0])?.name} deactivated.`,
        }),
      ]),
    },
    {
      ID: 'IntroNode0-Heal',
      type: 'single-target',
      text: <em>Heal</em>,
      icons: '',
      context,
      action: withMessageLogs(Heal, (s, c) => [
        newMessage({
          text: `${findActor(s, c.targetIDs[0])?.name} healed.`,
        }),
      ]),
    },
    createStaticNavigationOption(
      {
        text: <em>Go to other node</em>,
      },
      context,
      IntroNode1.ID,
      []
    ),
    createSourceNavigationOption(
      {
        text: (
          <span className="font-semibold">"Go to other node but a quote"</span>
        ),
      },
      IntroNode1.ID,
      []
    ),
  ],
}

const IntroNode1: SDialogNode = {
  ID: v4(),
  messages: () => [
    {
      ID: 'IntroNode1-0',
      type: '',
      actorID: '',
      text: 'This is a second dialog node!',
    },
  ],
  options: (_state) => [
    createStaticNavigationOption(
      {
        text: <em>Go back</em>,
      },
      context,
      IntroNode0.ID,
      []
    ),
  ],
}

const IntroDialog: SDialog = {
  ID: v4(),
  nodes: [IntroNode0, IntroNode1],
  startNodeID: IntroNode0.ID,
  activeNodeID: undefined,
}

export { IntroDialog }
