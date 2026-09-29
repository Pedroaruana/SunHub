import { expect, type Page, test } from '@playwright/test'

// a area de Bhadla, no Rajastao, que e uma fazenda solar de verdade e da uns 46
// hectares. semear o armazenamento evita depender de acertar quatro cliques num
// canvas de WebGL, que e a parte mais instavel de testar aqui
const AREA = {
  cantos: [
    [71.92, 27.474],
    [71.927, 27.474],
    [71.927, 27.48],
    [71.92, 27.48]
  ]
}

const comAreaMarcada = async (pagina: Page) => {
  await pagina.goto('/')
  await pagina.evaluate((area) => {
    sessionStorage.setItem('sunhub.area', JSON.stringify(area))
  }, AREA)
}

test('o fluxo inteiro, da area marcada ate o orcamento no historico', async ({ page }) => {
  // este percorre tres telas de mapa e espera a passagem inteira rodar. com
  // varios trabalhadores disputando cpu ele estourava o tempo padrao e virava
  // falso negativo
  test.slow()
  await comAreaMarcada(page)

  await page.goto('/sol')
  await expect(page.getByRole('heading', { name: /O Sol e a sombra/ })).toBeVisible()
  await expect(page.getByText('hora solar')).toBeVisible()

  await page.getByRole('button', { name: 'Ver a passagem do satélite' }).click()
  await expect(page).toHaveURL(/\/passagem$/)
  await expect(page.getByText('energia gerada')).toBeVisible({ timeout: 30_000 })

  // a passagem roda comprimida. o botao do pacote so libera quando ela termina
  const escolher = page.getByRole('button', { name: 'Escolher o pacote' })
  await expect(escolher).toBeEnabled({ timeout: 90_000 })
  await escolher.click()

  await expect(page).toHaveURL(/\/pacote$/)
  await expect(page.getByRole('heading', { name: 'Quanto de luz extra' })).toBeVisible()
  await expect(page.getByText(/R\$/).first()).toBeVisible()

  await page.getByRole('button', { name: 'Gerar o orçamento' }).click()
  await expect(page).toHaveURL(/\/orcamento$/)

  await expect(
    page.getByText('DOCUMENTO DE DEMONSTRAÇÃO · SEM VALIDADE COMERCIAL')
  ).toBeVisible()
  await expect(page.getByText('Valor estimado')).toBeVisible()

  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Gerar o orçamento' }).click()
  await expect(page.getByText('Orçamento simulado gerado')).toBeVisible()

  await page.goto('/pacotes')
  await expect(page.getByRole('heading', { name: 'Orçamentos simulados' })).toBeVisible()
  await expect(page.getByText('Nenhum orçamento ainda')).toHaveCount(0)
  await expect(page.getByText(/46,\d ha/)).toBeVisible()
})

test('o fechamento nao pede dado pessoal nem pagamento', async ({ page }) => {
  await comAreaMarcada(page)
  await page.goto('/orcamento')

  // a regra do projeto: isto nunca pode parecer cobranca de verdade. um campo
  // de texto novo aqui derruba este teste, que e o ponto dele
  const campos = page.locator(
    'input:not([type="checkbox"]), input[type="password"], select'
  )
  await expect(campos).toHaveCount(0)

  const conteudo = (await page.textContent('body')) ?? ''
  // "cobranca" aparece de proposito nas regras, dizendo que nao existe. o que
  // nao pode aparecer e a linguagem de venda de verdade
  for (const proibido of ['cartão', 'CPF', 'pagamento aprovado', 'forma de pagamento']) {
    expect(conteudo.toLowerCase()).not.toContain(proibido.toLowerCase())
  }
})

test('marcar outra area volta pro mapa sem jogar fora o que ja estava la', async ({
  page
}) => {
  await comAreaMarcada(page)
  await page.goto('/pacote')
  await page.getByRole('button', { name: 'Marcar outra área' }).click()

  await expect(page).toHaveURL(/\/area$/)

  // voltar pro mapa nao apaga nada. quem apaga e o botao de recomecar, la
  // dentro, e e assim que a pessoa consegue ajustar um canto so
  const guardado = await page.evaluate(() => sessionStorage.getItem('sunhub.area'))
  expect(guardado).toContain('71.92')
})

test('a pessoa consegue apagar um orcamento do proprio aparelho', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.setItem(
      'sunhub.pacotes',
      JSON.stringify([
        {
          protocolo: 'SH-TESTE-01',
          quando: new Date().toISOString(),
          hectares: 46.2,
          minutosPorNoite: 11,
          passagensPorNoite: 1,
          noites: 1,
          kwh: 361.1,
          preco: 223.9,
          tarifa: 0.62
        }
      ])
    )
  })

  await page.goto('/pacotes')
  await expect(page.getByText('SH-TESTE-01')).toBeVisible()

  // apagar dado do usuario pede confirmacao antes, e so sai do aparelho depois
  // que ele confirma
  await page.getByRole('button', { name: 'Apagar', exact: true }).click()
  await expect(page.getByText('Apagar este orçamento?')).toBeVisible()
  await page.getByRole('button', { name: 'Apagar', exact: true }).last().click()

  await expect(page.getByText('Nenhum orçamento ainda')).toBeVisible()
  const guardado = await page.evaluate(() => localStorage.getItem('sunhub.pacotes'))
  expect(guardado).not.toContain('SH-TESTE-01')
})
