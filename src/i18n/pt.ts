export const pt = {
  marca: 'SUNHUB',
  desde: 'DESDE 2031',

  menu: {
    abrir: 'Abrir menu',
    fechar: 'Fechar menu',
    idioma: 'IDIOMA',
    marcar: 'Marcar minha área',
    pacotes: 'Meus pacotes',
    comoFunciona: 'Como funciona',
    privacidade: 'Privacidade',
    termos: 'Termos de uso',
    cookies: 'Cookies'
  },

  comum: {
    voltar: 'Voltar',
    voltarAoInicio: 'Voltar ao início',
    pularParaConteudo: 'Pular para o conteúdo',
    proximaPassagem: 'PRÓXIMA PASSAGEM 21:41',
    areaMarcada: 'ÁREA MARCADA',
    areaDeDemonstracao: 'ÁREA DE DEMONSTRAÇÃO',
    carregando: 'Carregando o mapa',
    demonstracao:
      'Plataforma de demonstração. As estimativas de energia e preço são simuladas, e o fechamento gera uma proposta sem validade comercial.'
  },

  inicio: {
    titulo: 'São 21h e as suas placas',
    tituloDestaque: 'ainda estão gerando',
    resumo:
      'A SunHub opera refletores em órbita baixa. O satélite se inclina, devolve a luz do Sol para um ponto escolhido no chão, e a sua área recebe algumas horas de luz depois do pôr do sol.',
    refletores: 'refletores em órbita',
    passagemMedia: 'passagem média',
    altitude: 'altitude',
    comoFunciona: 'Como funciona',
    passos: [
      {
        titulo: 'Marque a área',
        texto: 'Você desenha no mapa onde ficam as placas. Só a região, sem endereço.'
      },
      {
        titulo: 'Veja 24 horas de Sol e sombra',
        texto: 'A trajetória do Sol naquele ponto e a sombra que ele projeta, hora a hora.'
      },
      {
        titulo: 'Escolha a janela e o preço',
        texto: 'Quantas horas de luz extra, e em qual período da noite.'
      },
      {
        titulo: 'Assista à passagem',
        texto: 'O satélite se inclina, reflete e o feixe desce até a sua área.'
      }
    ],
    comecar: 'Marcar minha área'
  },

  area: {
    passo: 'PASSO 01 DE 04',
    girar: 'Gire o globo até a sua região',
    chegando: 'Chegando na sua região',
    marcar: 'Toque nos cantos da área',
    dicaGirar: 'A mira não sai do lugar. O que anda é o globo, debaixo dela.',
    dicaMarcar:
      'Toque nos quatro cantos da área das placas. Arraste com dois dedos para mover o mapa.',
    latitude: 'latitude',
    longitude: 'longitude',
    altitudeCamera: 'altitude',
    cantos: 'cantos',
    hectares: 'hectares',
    descer: 'Descer aqui',
    faltam: 'Faltam {n} cantos',
    confirmar: 'Confirmar área',
    meEncontrar: 'Me encontrar pelo aparelho',
    voltarProGlobo: 'Voltar pro globo',
    apagar: 'Apagar e recomeçar',
    aviso: 'Dá para chegar na sua propriedade só com o dedo, sem dar permissão.',
    procurando: 'Procurando você...',
    negado: 'Permissão negada. Gire o globo com o dedo até a sua região.',
    semLocal: 'Não consegui pegar a localização. Gire o globo com o dedo.'
  },

  sol: {
    passo: 'PASSO 02 DE 04',
    titulo: 'O Sol e a sombra em 24 horas',
    terminou: 'Arraste para parar em qualquer hora',
    horaSolar: 'hora solar',
    alturaDoSol: 'altura do Sol',
    rumoDaSombra: 'rumo da sombra',
    verPassagem: 'Ver a passagem do satélite',
    rodarDeNovo: 'Rodar as 24 horas de novo',
    horaDoDia: 'Hora do dia'
  },

  passagem: {
    passo: 'PASSO 03 DE 04',
    titulo: 'A passagem do refletor',
    terminou: 'A passagem terminou',
    daPassagem: 'da passagem',
    potenciaAgora: 'potência agora',
    energiaGerada: 'energia gerada',
    elevacao: 'ELEV. {g}°',
    duracao: 'PASSAGEM DE {min} MIN',
    escolherPacote: 'Escolher o pacote',
    verDeNovo: 'Ver a passagem de novo',
    refletor: 'REFLETOR 04',
    fases: {
      abaixo: 'Abaixo do horizonte, sem luz na sua área',
      subindo: 'Subindo. O feixe chega de lado e rende pouco',
      apontando: 'Inclinando o espelho para apontar na sua área',
      alto: 'Quase no alto. É aqui que a passagem rende mais',
      fim: 'O refletor se pôs. Foram {kwh} kWh nesta passagem'
    },
    premissas:
      'Estimativa com {irr} W/m² no topo da atmosfera, {ocu}% da área ocupada por placas, {efi}% de eficiência e perda pela massa de ar 1/sen(elevação).'
  },

  pacote: {
    passo: 'PASSO 04 DE 04',
    titulo: 'Quanto de luz extra',
    resumo:
      'Cada refletor rende uma passagem de {min} minutos por noite. O preço sai da energia que essas passagens entregam, não de um valor de tabela.',
    minutosPorNoite: 'Minutos de luz por noite',
    noites: 'Noites',
    umaNoite: 'uma noite',
    umaSemana: 'uma semana',
    umMes: 'um mês',
    refletor: 'refletor',
    refletores: 'refletores',
    frota: 'São {min} minutos, ocupando {n} dos {total} refletores.',
    frotaCheia:
      'São {min} minutos, o máximo que a frota entrega. Você reserva os {total} refletores naquela noite.',
    estimados: '{kwh} kWh estimados em {n} passagens',
    estimadoUm: '{kwh} kWh estimados em 1 passagem',
    deOndeSai: 'De onde sai esse preço',
    gerar: 'Gerar o orçamento',
    outraArea: 'Marcar outra área',
    degraus: {
      area: 'Área marcada',
      areaPorque: 'O polígono que você desenhou no mapa, medido sobre o terreno.',
      placas: 'Placas dentro dela',
      placasPorque:
        'Contamos {ocu}% do terreno como placa. O resto é corredor entre fileiras, acesso e a distância que evita uma fileira sombrear a outra.',
      luz: 'Luz que o refletor manda',
      luzPorque:
        'Medida no topo da atmosfera, antes de qualquer perda. É o espelho devolvendo luz do Sol para o ponto que você marcou.',
      ar: 'Perda no ar',
      arPorque:
        'Quanto mais baixo o refletor no céu, mais atmosfera a luz atravessa antes de chegar. É por isso que o começo e o fim da passagem rendem quase nada.',
      eficiencia: 'Eficiência da placa',
      eficienciaPorque:
        'Silício comercial converte cerca de um quinto da luz que recebe em eletricidade. O resto vira calor.',
      energia: 'Energia de uma passagem',
      energiaPorque:
        'A conta acima somada minuto a minuto ao longo dos {min} minutos que o refletor leva de um horizonte ao outro.',
      teto: 'Teto da frota',
      tetoPorque:
        'São {total} refletores em órbita e cada um rende uma passagem útil por noite sobre a sua área. Hora cheia não existe: o limite é esse.',
      tarifa: 'Tarifa de referência',
      tarifaPorque:
        'Fica entre os R$ 0,462 do rural B2 homologado, que é sem imposto, e os R$ 0,73 a R$ 0,95 do residencial já com imposto. É o valor que você compara com a sua conta.',
      preco: 'Preço de uma passagem',
      precoPorque:
        'A energia estimada da passagem multiplicada pela tarifa. Uma passagem alta custa mais que uma rasante porque entrega mais.'
    }
  },

  contrato: {
    tarja: 'DOCUMENTO DE DEMONSTRAÇÃO · SEM VALIDADE COMERCIAL',
    passo: 'FECHAMENTO',
    titulo: 'O que você está reservando',
    gerado: 'Orçamento simulado gerado',
    resumo: 'Resumo',
    regras: 'Regras',
    linhas: {
      area: 'Área atendida',
      luzPorNoite: 'Luz por noite',
      refletores: 'Refletores reservados',
      noites: 'Noites',
      passagens: 'Passagens no total',
      energia: 'Energia estimada',
      tarifa: 'Tarifa de referência',
      valor: 'Valor estimado'
    },
    texto: [
      'A SunHub reserva janelas de passagem sobre a sua área, não quilowatt-hora entregue. O que está sendo separado é tempo de refletor apontado para o ponto que você marcou.',
      'A energia informada é estimativa. Nuvem, poeira e sujeira na placa derrubam o que chega, e nada disso está sob controle da operação.',
      'Uma passagem pode ser remanejada por manutenção da frota ou por correção de órbita. Nesse caso ela volta para a fila da noite seguinte, sem custo.',
      'O cancelamento é livre até seis horas antes da primeira passagem do pacote. Depois disso a janela já saiu da fila e não volta.',
      'Nenhum dado pessoal é coletado. A área que você desenhou fica guardada no seu aparelho e pode ser apagada por você a qualquer momento.',
      'Este documento é uma demonstração. Ele não gera cobrança, não vale como contrato e nenhuma energia é vendida.'
    ],
    aceite:
      'Li as regras e entendo que este é um orçamento simulado, sem cobrança e sem validade comercial.',
    gerar: 'Gerar o orçamento',
    jaGerado: 'Orçamento gerado',
    emitido: 'EMITIDO EM {quando}',
    guardado:
      'Guardado em Meus pacotes, no seu aparelho. Nenhuma cópia foi enviada para servidor nenhum.'
  },

  pacotes: {
    passo: 'MEUS PACOTES',
    titulo: 'Orçamentos simulados',
    resumo: 'Tudo fica no seu aparelho. Nada foi enviado para servidor nenhum.',
    vazioTitulo: 'Nenhum orçamento ainda',
    vazioTexto:
      'Quando você marcar a sua área e fechar um pacote, ele aparece aqui com o número de protocolo, a energia estimada e o valor.',
    detalhe: '{ha} ha · {min} min por noite · {noites} · {kwh} kWh estimados',
    umaNoite: '1 noite',
    varias: '{n} noites',
    apagar: 'Apagar',
    exportar: 'Exportar os meus dados',
    marcarArea: 'Marcar uma área',
    confirmarTitulo: 'Apagar este orçamento?',
    confirmarTexto: 'O orçamento {protocolo} sai do aparelho e não tem como recuperar.',
    manter: 'Manter',
    confirmarApagar: 'Apagar'
  },

  legais: {
    atualizado: 'ATUALIZADO EM 19 DE SETEMBRO DE 2026',
    privacidade: {
      passo: 'PRIVACIDADE',
      titulo: 'O que o SunHub sabe sobre você',
      abertura:
        'Quase nada, e o pouco que existe fica no seu aparelho. Esta página diz exatamente o quê, e é honesta sobre o único ponto em que dado seu sai daqui.',
      secoes: [
        {
          titulo: 'O que fica guardado',
          textos: [
            'A área que você desenhou, como uma lista de coordenadas dos cantos, e os orçamentos que você gerou. Os dois ficam no armazenamento local do navegador, no seu aparelho.',
            'Não existe conta, não existe servidor do SunHub guardando isso, e não existe cópia em lugar nenhum.'
          ]
        },
        {
          titulo: 'O que nunca é pedido',
          textos: [
            'Nome, CPF, endereço, telefone, email, cartão. Nada disso é pedido em nenhuma tela, porque nada disso é necessário para simular.'
          ]
        },
        {
          titulo: 'A localização do aparelho',
          textos: [
            'Só é pedida se você tocar em "Me encontrar pelo aparelho", e serve para uma coisa só: girar o globo até onde você está. A coordenada não vai para endereço, não vai para log e não vai para analytics.',
            'Dá para usar o aplicativo inteiro sem conceder essa permissão, girando o globo com o dedo.'
          ]
        },
        {
          titulo: 'O ponto em que dado seu sai daqui',
          textos: [
            'O globo e o mapa usam imagem de satélite buscada em servidor externo, o World Imagery da Esri. Cada pedacinho do mapa é um pedido feito a esse servidor.',
            'Isso significa que a sequência de pedidos revela aproximadamente qual região você está olhando, além do seu endereço de IP. Não é a coordenada exata da sua propriedade sendo enviada, mas é informação sobre onde você está olhando saindo do aparelho.',
            'Essa foi uma troca consciente: sem imagem vinda de servidor, o globo não teria imagem nenhuma.'
          ]
        },
        {
          titulo: 'Outras coisas que são baixadas',
          textos: [
            'As bibliotecas de mapa e de 3D e as fontes vêm de servidores de terceiros. Esses pedidos expõem o seu IP para eles, como acontece em qualquer site que use recursos externos.',
            'Não há Google Analytics, não há Sentry, não há pixel de rastreio, não há rede de anúncio.'
          ]
        },
        {
          titulo: 'Ver, exportar e apagar',
          textos: [
            'Em Meus pacotes você vê tudo que está guardado, exporta em um arquivo JSON e apaga item por item. Apagar é definitivo e o aviso diz isso antes.',
            'Limpar os dados do site pelo navegador também apaga tudo, porque não existe cópia fora daqui.'
          ]
        }
      ]
    },
    termos: {
      passo: 'TERMOS DE USO',
      titulo: 'O que isto é e o que não é',
      abertura:
        'O SunHub é um simulador. A empresa, a frota de refletores e os preços são ficção construída em cima de uma ideia real de engenharia.',
      secoes: [
        {
          titulo: 'Isto é uma demonstração',
          textos: [
            'Nenhuma energia é vendida, nenhum valor é cobrado e nenhum contrato é firmado. O documento gerado no fim do fluxo é um orçamento simulado, sem validade comercial.',
            'Não existe empresa SunHub operando refletores. Refletores orbitais para iluminar usinas fora do horário de sol são uma linha de pesquisa real, e é sobre ela que esta simulação foi construída.'
          ]
        },
        {
          titulo: 'Os números são estimativa',
          textos: [
            'A energia mostrada sai de um modelo com premissas declaradas na própria tela: a luz que o refletor entrega, quanto da área é placa, a eficiência da placa e a perda pela massa de ar.',
            'Trocar qualquer uma dessas premissas muda o resultado. Elas ficam à vista justamente para poderem ser discutidas.'
          ]
        },
        {
          titulo: 'Não tome decisão com base nisto',
          textos: [
            'Nenhum número daqui serve para dimensionar instalação, fechar investimento ou negociar com distribuidora. É demonstração de produto, não laudo técnico.'
          ]
        },
        {
          titulo: 'Imagens de terceiros',
          textos: [
            'As imagens de satélite são do World Imagery da Esri e são exibidas com a atribuição que aparece no canto do mapa. Elas não pertencem a este projeto.'
          ]
        },
        {
          titulo: 'Disponibilidade',
          textos: [
            'Isto é um projeto de demonstração. Pode sair do ar, mudar de endereço ou ser reescrito sem aviso.'
          ]
        }
      ]
    },
    cookies: {
      passo: 'COOKIES',
      titulo: 'Não usamos cookies',
      abertura:
        'Esta página existe porque a pergunta é legítima, e a resposta honesta é curta: o SunHub não grava nenhum cookie. O que ele usa é armazenamento local, que é outra coisa, e está tudo listado abaixo.',
      secoes: [
        {
          titulo: 'Nenhum cookie, nenhum rastreio',
          textos: [
            'Não há cookie de sessão, de preferência ou de terceiro. Não há rede de anúncio, não há pixel, não há identificador de visitante.',
            'Por isso também não existe aquele aviso de cookies pedindo aceite: não haveria o que aceitar.'
          ]
        },
        {
          titulo: 'Como apagar',
          textos: [
            'O que dura só enquanto a aba está aberta some sozinho quando você a fecha. O histórico você apaga em Meus pacotes, item por item, ou limpando os dados do site pelo navegador.'
          ]
        },
        {
          titulo: 'Servidores externos',
          textos: [
            'As imagens do mapa, as bibliotecas e as fontes vêm de servidores de terceiros. Eles enxergam o seu IP no momento do pedido, mas nenhum cookie é gravado por eles neste aplicativo. Os detalhes estão na página de Privacidade.'
          ]
        }
      ],
      guardado: 'O que é guardado no seu aparelho',
      chaves: [
        {
          chave: 'sunhub.area',
          texto: 'Os cantos da área que você desenhou. Dura enquanto a aba estiver aberta.'
        },
        {
          chave: 'sunhub.pacotes',
          texto: 'O histórico dos orçamentos gerados. Fica no aparelho até você apagar.'
        },
        {
          chave: 'sunhub.idioma',
          texto: 'O idioma que você escolheu, para não perguntar de novo.'
        }
      ]
    }
  },

  naoAchou: {
    codigo: 'ERRO 404',
    titulo: 'Eclipse total por aqui',
    texto: 'Esta página não existe. Nenhuma luz chega nela, nem de dia nem com refletor.'
  }
} as const
