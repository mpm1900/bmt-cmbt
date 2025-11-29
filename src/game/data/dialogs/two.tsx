import { newMessage } from '@/game/encounter'
import type { SDialogNode, SEncounter } from '@/game/state'
import { ArrowLeft } from 'lucide-react'
import { v4 } from 'uuid'
import { InlineMutation } from '../actions/_system/inline-mutation'
import { navigateEncounterResolver } from '@/game/resolvers'
import { IntroEncounter } from './intro'

const TwoNode0: SDialogNode = {
  ID: v4(),
  type: 'options',
  checks: () => [],
  messages: () => [
    newMessage({
      ID: 'TwoNode0-0',
      text: 'This is another encounter, nothing to do here for now.',
    }),
  ],
  options: (_state, context) => [
    {
      ID: v4(),
      disable: 'hide',
      text: <em>Go Back</em>,
      icons: (
        <>
          <ArrowLeft />
        </>
      ),
      context,
      action: InlineMutation((_s, c) => [
        navigateEncounterResolver(c, IntroEncounter),
      ]),
    },
  ],
}

const TwoEncounter: SEncounter = {
  ID: v4(),
  name: 'Test 2nd Encounter',
  persist: true,
  startNodeID: TwoNode0.ID,
  nodes: [TwoNode0],
}

export { TwoEncounter }
