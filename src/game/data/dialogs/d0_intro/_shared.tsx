import { withConsumable } from '@/game/item'
import type { SPlayer } from '@/game/state'
import { v4 } from 'uuid'
import { Heal } from '../../actions/heal'
import { playerStore } from '@/hooks/usePlayer'
import { createActor } from '@/lib/create-actor'
import { portraits } from '@/renderers/portraits'
import { faker } from '@faker-js/faker'

const playerID = playerStore.getState().playerID
const d0_ID = v4()

const skullMan = createActor('???', d0_ID, portraits.skull, {
  accuracy: 0,
  strength: 100,
  evasion: 0,
  health: 100,
  intelligence: 100,
  faith: 100,
  speed: 100,
})
skullMan.ID === 'skullMan'
const Criminal = (aiID: string) =>
  createActor(faker.person.firstName(), aiID, portraits.skull, {
    accuracy: 0,
    strength: 50,
    evasion: 0,
    health: 100,
    intelligence: 50,
    faith: 50,
    speed: 50,
  })
const criminal2 = Criminal(d0_ID)
const criminal3 = Criminal(d0_ID)

const d0_PLAYER: SPlayer = {
  ID: d0_ID,
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

export { d0_ID, d0_PLAYER, skullMan, criminal2, criminal3 }
