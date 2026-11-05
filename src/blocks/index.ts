import type { ComponentType } from 'react'
import { defineBlock } from '@fayz-ai/core'
import { AfContact, AfCta, AfHero, AfMarquee, AfStats, AfStory, AfVoices, AfWhoWeAre } from './brand'
import { AfCases, AfCrew, AfEventSpotlight, AfEvents, AfGallery, AfOffers, AfPartners, AfRules, AfSessions, AfSteps } from './collective'
import { AfLibrary, AfVideoPlayer } from './library'
import { AfTeeArtist, AfTeeBuy, AfTeeDetails, AfTeeFaq, AfTeeFinal, AfTeeLookbook, AfTeeSpotlight, AfTeeSticky, AfVideo, TEE_DATA } from './tee'

// App-owned blocks in the storefront registry, referenced by `type` from the
// page documents in config/pages.ts. Registered at module scope, before
// initStorefrontRuntime and the route loaders, on server and client alike:
// the loader reads each block's `data` declaration to resolve the shirt's row
// before render.

const everywhere = ['home', 'content'] as const

const blocks: [string, ComponentType<never>, string, boolean?][] = [
  ['afHero', AfHero, 'Hero com vídeo'],
  ['afMarquee', AfMarquee, 'Letreiro corrido'],
  ['afStats', AfStats, 'Números do coletivo'],
  ['afStory', AfStory, 'Texto e foto'],
  ['afVoices', AfVoices, 'Depoimentos de artistas'],
  ['afWhoWeAre', AfWhoWeAre, 'Quem somos: crossfader'],
  ['afContact', AfContact, 'Contato'],
  ['afEventSpotlight', AfEventSpotlight, 'Evento em destaque'],
  ['afCases', AfCases, 'Noites anteriores'],
  ['afSteps', AfSteps, 'Passo a passo'],
  ['afCta', AfCta, 'Chamada final'],
  ['afSessions', AfSessions, 'Arquivo de sessões'],
  ['afLibrary', AfLibrary, 'Library: arquivo em vídeo'],
  ['afVideoPlayer', AfVideoPlayer, 'Library: player de um set'],
  ['afEvents', AfEvents, 'Eventos'],
  ['afCrew', AfCrew, 'Crew'],
  ['afRules', AfRules, 'Regras da casa'],
  ['afGallery', AfGallery, 'Galeria'],
  ['afPartners', AfPartners, 'Parceiros'],
  ['afOffers', AfOffers, 'Formatos para marcas'],
  ['afVideo', AfVideo, 'Vídeo'],
  ['afTeeBuy', AfTeeBuy, 'Camisa: compra', true],
  ['afTeeSticky', AfTeeSticky, 'Camisa: barra fixa', true],
  ['afTeeDetails', AfTeeDetails, 'Camisa: detalhes'],
  ['afTeeLookbook', AfTeeLookbook, 'Camisa: lookbook'],
  ['afTeeArtist', AfTeeArtist, 'Camisa: a artista'],
  ['afTeeFaq', AfTeeFaq, 'Camisa: perguntas'],
  ['afTeeFinal', AfTeeFinal, 'Camisa: chamada final', true],
  ['afTeeSpotlight', AfTeeSpotlight, 'Camisa: destaque', true],
]

let registered = false

export function registerAirfryerBlocks(): void {
  if (registered) return
  registered = true
  for (const [id, component, label, needsTee] of blocks) {
    defineBlock(id, component as ComponentType, {
      source: 'app',
      label,
      enabledOn: [...everywhere],
      allowMultiple: true,
      ...(needsTee ? { data: TEE_DATA } : {}),
    })
  }
}

registerAirfryerBlocks()
