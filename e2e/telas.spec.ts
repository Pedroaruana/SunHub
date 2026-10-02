import { expect, test } from '@playwright/test'

const ROTAS = [
  ['/', 'SunHub, luz do Sol depois que ele se põe'],
  ['/area', 'Marque a área das suas placas, SunHub'],
  ['/sol', 'O Sol e a sombra em 24 horas, SunHub'],
  ['/passagem', 'A passagem do refletor, SunHub'],
  ['/pacote', 'Quanto de luz extra, SunHub'],
  ['/privacidade', 'Privacidade, SunHub'],
  ['/termos', 'Termos de uso, SunHub'],
  ['/cookies', 'Cookies, SunHub']
] as const

// o prerender escreve isso no html antes de qualquer script rodar. e o que um
// robo sem javascript enxerga, e a unica forma de conferir e pedir o arquivo
// cru em vez de olhar a pagina montada.
//
// a barra no fim nao e enfeite: o vite preview so entrega o arquivo da subpasta
// com ela, e sem ela devolve o index da raiz. hospedagem estatica resolve os
// dois, mas aqui eu peco exatamente o arquivo que o prerender gerou
test('cada rota tem titulo e canonical proprios no html servido', async ({ request }) => {
  for (const [caminho, titulo] of ROTAS) {
    const html = await (await request.get(caminho === '/' ? '/' : `${caminho}/`)).text()
    expect(html, caminho).toContain(`<title>${titulo}</title>`)
    expect(html, caminho).toContain(
      `rel="canonical" href="https://sunhub.aruanapedro.workers.dev${caminho}"`
    )
  }
})

test('so a inicial tem dado estruturado', async ({ request }) => {
  const inicial = await (await request.get('/')).text()
  const outra = await (await request.get('/pacote/')).text()

  expect(inicial).toContain('application/ld+json')
  expect(outra).not.toContain('application/ld+json')
})

test('as telas do usuario ficam fora do indice e do sitemap', async ({ request }) => {
  for (const escondida of ['/orcamento', '/pacotes']) {
    const html = await (await request.get(`${escondida}/`)).text()
    expect(html, escondida).toContain('name="robots" content="noindex"')
  }

  const sitemap = await (await request.get('/sitemap.xml')).text()
  expect(sitemap).not.toContain('/orcamento')
  expect(sitemap).not.toContain('/pacotes')
  expect(sitemap).toContain('/privacidade')
})

test('nenhuma tela rola de lado no celular', async ({ page }) => {
  for (const [caminho] of ROTAS) {
    await page.goto(caminho)
    const sobra = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    expect(sobra, caminho).toBeLessThanOrEqual(1)
  }
})

test('o globo desenha de verdade, nao so o canvas vazio', async ({ page }) => {
  await page.goto('/area')

  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible({ timeout: 30_000 })

  // canvas com tamanho zero passaria num teste de visibilidade e nao desenharia
  // nada. aqui eu quero saber se ele tem area pra pintar
  const tamanho = await canvas.first().boundingBox()
  expect(tamanho?.width ?? 0).toBeGreaterThan(200)
  expect(tamanho?.height ?? 0).toBeGreaterThan(200)

  await expect(page.getByText('latitude')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Descer aqui' })).toBeVisible()
})

test('o link de pular para o conteudo aparece no teclado', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')

  await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused()
})

// o teste de cima le o html cru e por isso nao viu o problema: a hospedagem
// redireciona /sol para /sol/, e so depois que o react monta e que a rota e
// procurada de novo. era ai que toda tela se marcava como noindex sozinha
test('depois de montar, a tela continua sendo ela mesma com a barra no fim', async ({
  page
}) => {
  for (const [caminho, titulo] of ROTAS) {
    if (caminho === '/') continue

    await page.goto(`${caminho}/`)
    await expect(page, caminho).toHaveTitle(titulo)
    await expect(page.locator('meta[name="robots"]').first(), caminho).toHaveAttribute(
      'content',
      'index,follow'
    )
  }
})
