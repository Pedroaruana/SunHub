import type { Dicionario } from './index.ts'

export const en: Dicionario = {
  marca: 'SUNHUB',
  desde: 'SINCE 2031',

  menu: {
    abrir: 'Open menu',
    fechar: 'Close menu',
    idioma: 'LANGUAGE',
    marcar: 'Mark my area',
    pacotes: 'My packages',
    comoFunciona: 'How it works',
    privacidade: 'Privacy',
    termos: 'Terms of use',
    cookies: 'Cookies'
  },

  comum: {
    voltar: 'Back',
    voltarAoInicio: 'Back to start',
    pularParaConteudo: 'Skip to content',
    proximaPassagem: 'NEXT PASS 21:41',
    areaMarcada: 'MARKED AREA',
    areaDeDemonstracao: 'DEMO AREA',
    carregando: 'Loading the map',
    demonstracao:
      'Demonstration platform. Energy and price figures are simulated, and closing a package produces a quote with no commercial validity.'
  },

  inicio: {
    titulo: "It's 9 pm and your panels",
    tituloDestaque: 'are still generating',
    resumo:
      'SunHub operates reflectors in low orbit. The satellite tilts, sends sunlight back to a chosen point on the ground, and your area gets a few hours of light after sunset.',
    refletores: 'reflectors in orbit',
    passagemMedia: 'average pass',
    altitude: 'altitude',
    comoFunciona: 'How it works',
    passos: [
      {
        titulo: 'Mark the area',
        texto: 'You draw on the map where the panels are. Just the region, no address.'
      },
      {
        titulo: 'See 24 hours of sun and shadow',
        texto:
          'The path of the Sun over that exact spot and the shadow it casts, hour by hour.'
      },
      {
        titulo: 'Pick the window and the price',
        texto: 'How many hours of extra light, and which part of the night.'
      },
      {
        titulo: 'Watch the pass',
        texto: 'The satellite tilts, reflects, and the beam comes down onto your area.'
      }
    ],
    comecar: 'Mark my area'
  },

  area: {
    passo: 'STEP 01 OF 04',
    girar: 'Spin the globe to your region',
    chegando: 'Coming down on your region',
    marcar: 'Tap the corners of the area',
    dicaGirar: 'The crosshair never moves. What moves is the globe underneath it.',
    dicaMarcar:
      'Tap the four corners of the panel area. Drag with two fingers to move the map.',
    latitude: 'latitude',
    longitude: 'longitude',
    altitudeCamera: 'altitude',
    cantos: 'corners',
    hectares: 'hectares',
    descer: 'Come down here',
    faltam: '{n} corners to go',
    confirmar: 'Confirm area',
    meEncontrar: 'Find me with my device',
    voltarProGlobo: 'Back to the globe',
    apagar: 'Clear and start over',
    aviso: 'You can reach your property with your finger alone, granting no permission.',
    procurando: 'Finding you...',
    negado: 'Permission denied. Spin the globe with your finger to your region.',
    semLocal: 'Could not get your location. Spin the globe with your finger.'
  },

  sol: {
    passo: 'STEP 02 OF 04',
    titulo: 'The Sun and the shadow over 24 hours',
    terminou: 'Drag to stop at any hour',
    horaSolar: 'solar time',
    alturaDoSol: 'sun height',
    rumoDaSombra: 'shadow bearing',
    verPassagem: 'Watch the satellite pass',
    rodarDeNovo: 'Run the 24 hours again',
    horaDoDia: 'Time of day'
  },

  passagem: {
    passo: 'STEP 03 OF 04',
    titulo: 'The reflector pass',
    terminou: 'The pass is over',
    daPassagem: 'into the pass',
    potenciaAgora: 'power now',
    energiaGerada: 'energy generated',
    elevacao: 'ELEV. {g}°',
    duracao: '{min} MIN PASS',
    escolherPacote: 'Choose the package',
    verDeNovo: 'Watch the pass again',
    refletor: 'REFLECTOR 04',
    fases: {
      abaixo: 'Below the horizon, no light on your area',
      subindo: 'Rising. The beam arrives sideways and yields little',
      apontando: 'Tilting the mirror to aim at your area',
      alto: 'Almost overhead. This is where the pass yields most',
      fim: 'The reflector has set. That was {kwh} kWh on this pass'
    },
    premissas:
      'Estimate with {irr} W/m² at the top of the atmosphere, {ocu}% of the area covered by panels, {efi}% efficiency and air mass loss of 1/sin(elevation).'
  },

  pacote: {
    passo: 'STEP 04 OF 04',
    titulo: 'How much extra light',
    resumo:
      'Each reflector yields one {min} minute pass per night. The price comes from the energy those passes deliver, not from a price list.',
    minutosPorNoite: 'Minutes of light per night',
    noites: 'Nights',
    umaNoite: 'one night',
    umaSemana: 'one week',
    umMes: 'one month',
    refletor: 'reflector',
    refletores: 'reflectors',
    frota: 'That is {min} minutes, using {n} of the {total} reflectors.',
    frotaCheia:
      'That is {min} minutes, the most the fleet delivers. You reserve all {total} reflectors that night.',
    estimados: '{kwh} kWh estimated across {n} passes',
    estimadoUm: '{kwh} kWh estimated across 1 pass',
    deOndeSai: 'Where this price comes from',
    gerar: 'Generate the quote',
    outraArea: 'Mark another area',
    degraus: {
      area: 'Marked area',
      areaPorque: 'The polygon you drew on the map, measured over the ground.',
      placas: 'Panels inside it',
      placasPorque:
        'We count {ocu}% of the ground as panel. The rest is aisles between rows, access and the spacing that keeps one row from shading the next.',
      luz: 'Light the reflector sends',
      luzPorque:
        'Measured at the top of the atmosphere, before any loss. It is the mirror sending sunlight back to the point you marked.',
      ar: 'Loss in the air',
      arPorque:
        'The lower the reflector in the sky, the more atmosphere the light crosses before arriving. That is why the start and the end of the pass yield almost nothing.',
      eficiencia: 'Panel efficiency',
      eficienciaPorque:
        'Commercial silicon turns about a fifth of the light it receives into electricity. The rest becomes heat.',
      energia: 'Energy of one pass',
      energiaPorque:
        'The calculation above added up minute by minute across the {min} minutes the reflector takes from one horizon to the other.',
      teto: 'Fleet ceiling',
      tetoPorque:
        'There are {total} reflectors in orbit and each yields one useful pass per night over your area. A full hour does not exist: that is the limit.',
      tarifa: 'Reference tariff',
      tarifaPorque:
        'It sits between the R$ 0.462 of the approved B2 rural rate, which excludes tax, and the R$ 0.73 to R$ 0.95 of residential with tax included. It is the figure you compare with your own bill.',
      preco: 'Price of one pass',
      precoPorque:
        'The estimated energy of the pass multiplied by the tariff. A high pass costs more than a grazing one because it delivers more.'
    }
  },

  contrato: {
    tarja: 'DEMONSTRATION DOCUMENT · NO COMMERCIAL VALIDITY',
    passo: 'CLOSING',
    titulo: 'What you are reserving',
    gerado: 'Simulated quote generated',
    resumo: 'Summary',
    regras: 'Rules',
    linhas: {
      area: 'Area served',
      luzPorNoite: 'Light per night',
      refletores: 'Reflectors reserved',
      noites: 'Nights',
      passagens: 'Passes in total',
      energia: 'Estimated energy',
      tarifa: 'Reference tariff',
      valor: 'Estimated value'
    },
    texto: [
      'SunHub reserves pass windows over your area, not delivered kilowatt-hours. What is being set aside is reflector time aimed at the point you marked.',
      'The energy shown is an estimate. Cloud, dust and dirt on the panel cut down what arrives, and none of that is under the operation control.',
      'A pass may be rescheduled for fleet maintenance or orbit correction. In that case it returns to the queue for the following night, at no cost.',
      'Cancelling is free up to six hours before the first pass of the package. After that the window has left the queue and does not come back.',
      'No personal data is collected. The area you drew stays on your device and you can erase it at any time.',
      'This document is a demonstration. It creates no charge, is not valid as a contract and no energy is sold.'
    ],
    aceite:
      'I have read the rules and understand this is a simulated quote, with no charge and no commercial validity.',
    gerar: 'Generate the quote',
    jaGerado: 'Quote generated',
    emitido: 'ISSUED ON {quando}',
    guardado: 'Saved in My packages, on your device. No copy was sent to any server.'
  },

  pacotes: {
    passo: 'MY PACKAGES',
    titulo: 'Simulated quotes',
    resumo: 'Everything stays on your device. Nothing was sent to any server.',
    vazioTitulo: 'No quotes yet',
    vazioTexto:
      'Once you mark your area and close a package, it shows up here with the reference number, the estimated energy and the value.',
    detalhe: '{ha} ha · {min} min per night · {noites} · {kwh} kWh estimated',
    umaNoite: '1 night',
    varias: '{n} nights',
    apagar: 'Erase',
    exportar: 'Export my data',
    marcarArea: 'Mark an area',
    confirmarTitulo: 'Erase this quote?',
    confirmarTexto: 'Quote {protocolo} leaves the device and cannot be recovered.',
    manter: 'Keep',
    confirmarApagar: 'Erase'
  },

  legais: {
    atualizado: 'UPDATED ON 19 SEPTEMBER 2026',
    privacidade: {
      passo: 'PRIVACY',
      titulo: 'What SunHub knows about you',
      abertura:
        'Almost nothing, and the little that exists stays on your device. This page says exactly what, and is honest about the one point where data of yours leaves here.',
      secoes: [
        {
          titulo: 'What is stored',
          textos: [
            'The area you drew, as a list of corner coordinates, and the quotes you generated. Both live in the browser local storage, on your device.',
            'There is no account, no SunHub server holding this, and no copy anywhere.'
          ]
        },
        {
          titulo: 'What is never asked',
          textos: [
            'Name, tax number, address, phone, email, card. None of it is asked on any screen, because none of it is needed to simulate.'
          ]
        },
        {
          titulo: 'Device location',
          textos: [
            'It is only requested if you tap "Find me with my device", and it serves one purpose: spinning the globe to where you are. The coordinate does not go into the address bar, into logs or into analytics.',
            'You can use the whole app without granting that permission, spinning the globe with your finger.'
          ]
        },
        {
          titulo: 'The one point where data of yours leaves here',
          textos: [
            'The globe and the map use satellite imagery fetched from an external server, Esri World Imagery. Each small piece of the map is a request made to that server.',
            'That means the sequence of requests reveals roughly which region you are looking at, along with your IP address. It is not the exact coordinate of your property being sent, but it is information about where you are looking leaving the device.',
            'This was a deliberate trade: without imagery from a server, the globe would have no imagery at all.'
          ]
        },
        {
          titulo: 'Other things that get downloaded',
          textos: [
            'The map and 3D libraries and the fonts come from third party servers. Those requests expose your IP to them, as happens on any site that uses external resources.',
            'There is no Google Analytics, no Sentry, no tracking pixel, no ad network.'
          ]
        },
        {
          titulo: 'See, export and erase',
          textos: [
            'In My packages you see everything stored, export it as a JSON file and erase it item by item. Erasing is final and the warning says so beforehand.',
            'Clearing the site data in your browser also erases everything, because there is no copy outside here.'
          ]
        }
      ]
    },
    termos: {
      passo: 'TERMS OF USE',
      titulo: 'What this is and what it is not',
      abertura:
        'SunHub is a simulator. The company, the reflector fleet and the prices are fiction built on top of a real engineering idea.',
      secoes: [
        {
          titulo: 'This is a demonstration',
          textos: [
            'No energy is sold, no amount is charged and no contract is signed. The document produced at the end of the flow is a simulated quote, with no commercial validity.',
            'There is no SunHub company operating reflectors. Orbital reflectors for lighting solar plants outside daylight hours are a real line of research, and this simulation was built on it.'
          ]
        },
        {
          titulo: 'The numbers are estimates',
          textos: [
            'The energy shown comes from a model whose assumptions are printed on the screen itself: the light the reflector delivers, how much of the area is panel, panel efficiency and the air mass loss.',
            'Changing any of those assumptions changes the result. They are in plain sight precisely so they can be argued with.'
          ]
        },
        {
          titulo: 'Do not make decisions based on this',
          textos: [
            'No figure here is meant for sizing an installation, closing an investment or negotiating with a utility. It is a product demonstration, not a technical report.'
          ]
        },
        {
          titulo: 'Third party imagery',
          textos: [
            'The satellite imagery is Esri World Imagery and is shown with the attribution that appears in the corner of the map. It does not belong to this project.'
          ]
        },
        {
          titulo: 'Availability',
          textos: [
            'This is a demonstration project. It may go offline, change address or be rewritten without notice.'
          ]
        }
      ]
    },
    cookies: {
      passo: 'COOKIES',
      titulo: 'We use no cookies',
      abertura:
        'This page exists because the question is fair, and the honest answer is short: SunHub writes no cookies. What it uses is local storage, which is a different thing, and it is all listed below.',
      secoes: [
        {
          titulo: 'No cookie, no tracking',
          textos: [
            'There is no session, preference or third party cookie. No ad network, no pixel, no visitor identifier.',
            'That is also why there is no cookie banner asking for consent: there would be nothing to consent to.'
          ]
        },
        {
          titulo: 'How to erase',
          textos: [
            'Whatever lasts only while the tab is open disappears on its own when you close it. The history you erase in My packages, item by item, or by clearing the site data in your browser.'
          ]
        },
        {
          titulo: 'External servers',
          textos: [
            'The map imagery, the libraries and the fonts come from third party servers. They see your IP at request time, but none of them writes a cookie in this app. The details are on the Privacy page.'
          ]
        }
      ],
      guardado: 'What is stored on your device',
      chaves: [
        {
          chave: 'sunhub.area',
          texto: 'The corners of the area you drew. Lasts while the tab is open.'
        },
        {
          chave: 'sunhub.pacotes',
          texto: 'The history of generated quotes. Stays on the device until you erase it.'
        },
        {
          chave: 'sunhub.idioma',
          texto: 'The language you chose, so it is not asked again.'
        }
      ]
    }
  },

  naoAchou: {
    codigo: 'ERROR 404',
    titulo: 'Total eclipse here',
    texto: 'This page does not exist. No light reaches it, neither daylight nor reflector.'
  }
}
