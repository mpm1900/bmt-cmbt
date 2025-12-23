import { createSourceDialogOption, newMessage } from '@/game/encounter'
import { newContext } from '@/game/mutations'
import type { SDialogNode, SDialogOption, State } from '@/game/state'
import { v4 } from 'uuid'
import { skullMan } from './_shared'
import { LuSpeech } from 'react-icons/lu'
import { ArrowRight } from 'lucide-react'
import { InlineMutation } from '../../actions/_system/inline-mutation'
import { navigateEncounterResolver } from '@/game/resolvers'
import { TwoEncounter } from '../two'
import type { DeltaContext } from '@/game/types/delta'

function baseOptions(_state: State, context: DeltaContext): SDialogOption[] {
  return [
    createSourceDialogOption(
      {
        ID: 'Node2BPower',
        text: <>"I seek power."</>,
        icons: (
          <>
            <LuSpeech />
          </>
        ),
      },
      context,
      Node1A0_PowerID,
      []
    ),
    createSourceDialogOption(
      {
        ID: 'Node2BMeaning',
        text: <>"I seek meaning."</>,
        icons: (
          <>
            <LuSpeech />
          </>
        ),
      },
      context,
      Node1A0_MeaningID,
      []
    ),
    createSourceDialogOption(
      {
        ID: 'Node2BKnowledge',
        text: <>"I seek knowledge."</>,
        icons: (
          <>
            <LuSpeech />
          </>
        ),
      },
      context,
      Node1A0_KnowledgeID,
      []
    ),
    createSourceDialogOption(
      {
        ID: 'Node2BUnsure',
        text: <>"I don't know what I seek."</>,
        icons: (
          <>
            <LuSpeech />
          </>
        ),
      },
      context,
      Node1A0_UnsureID,
      []
    ),
  ]
}

const Node1A0ID = v4()
const Node1A0: SDialogNode = {
  ID: Node1A0ID,
  type: 'options',
  checks: () => [],
  messages: () => [
    newMessage({
      ID: 'Node2-0',
      type: 'dialogue',
      context: newContext({
        sourceID: skullMan.ID,
      }),
      text: (
        <>
          "Curiosity, good sign. This is where all of our kind arrive to this
          land. As to what "this land" is? Well, that's a far more complicated
          question. People all come here for their own reasons. Many for blood
          and power, some for light and meaning, and others for knowledge."
        </>
      ),
    }),
  ],
  options: (state, context) => baseOptions(state, context),
}

const Node1A0_PowerID = v4()
const Node1A0_Power: SDialogNode = {
  ID: Node1A0_PowerID,
  type: 'options',
  checks: () => [],
  messages: () => [
    newMessage({
      ID: 'Node2_Meaning-1',
      context: newContext({
        sourceID: skullMan.ID,
      }),
      type: 'dialogue',
      text: (
        <span>
          <p>
            "The path of the powerful is built on blood and sacrifice.
            Everyone's goals can be reached with enough power."
          </p>
          <p className="mt-2">
            "Far past this fog lies the the Blood Church. It is said that all
            paths to power run through Red Cathedral."
          </p>
        </span>
      ),
    }),
  ],
  options: (_state, context) => [
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
const Node1A0_MeaningID = v4()
const Node1A0_Meaning: SDialogNode = {
  ID: Node1A0_MeaningID,
  type: 'options',
  checks: () => [],
  messages: () => [
    newMessage({
      ID: 'Node2_Meaning-0',
      text: <>You see the figure shift as though suddenly agitated.</>,
    }),
    newMessage({
      ID: 'Node2_Meaning-1',
      context: newContext({
        sourceID: skullMan.ID,
      }),
      type: 'dialogue',
      text: (
        <span>
          <p>
            "Meaning is for weak of weak in my experience. Meaning won't get you
            far in this world. But alas, perhaps it's our nature to seek meaning
            nonetheless. To seek meaning is to seek flame."
          </p>
          <p className="mt-2">
            "Beyond these jagged shores of lies a monument of flame. A testiment
            to the history of this land. Though many find the original ways,
            beneath them."
          </p>
        </span>
      ),
    }),
  ],
  options: (_state, context) => [
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
const Node1A0_KnowledgeID = v4()
const Node1A0_Knowledge: SDialogNode = {
  ID: Node1A0_KnowledgeID,
  type: 'options',
  checks: () => [],
  messages: () => [],
  options: () => [],
}
const Node1A0_UnsureID = v4()
const Node1A0_Unsure: SDialogNode = {
  ID: Node1A0_UnsureID,
  type: 'options',
  checks: () => [],
  messages: () => [],
  options: () => [],
}

export {
  Node1A0,
  Node1A0_Power,
  Node1A0_Meaning,
  Node1A0_Knowledge,
  Node1A0_Unsure,
  Node1A0ID,
}
