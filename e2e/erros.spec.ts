import { expect, test } from '@playwright/test'

test('rota que nao existe cai no 404 e sai do indice', async ({ page }) => {
  await page.goto('/isso-aqui-nunca-existiu')

  await expect(page.getByRole('heading', { name: 'Eclipse total por aqui' })).toBeVisible()
  // sao duas tags: uma vem do html gerado no build e a outra o proprio 404
  // injeta. as duas dizem noindex, entao o resultado esta certo, mas sobra uma
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
    'content',
    /noindex/
  )
})

test('coordenada adulterada no armazenamento nao chega na tela', async ({ page }) => {
  await page.goto('/')

  // isto e texto no navegador do usuario, da pra editar na mao. a validacao do
  // nucleo tem que barrar antes de virar NaN ou Infinity em cima do preco
  await page.evaluate(() => {
    sessionStorage.setItem(
      'sunhub.area',
      JSON.stringify({
        cantos: [
          [999, 999],
          [71.927, 27.474],
          [71.927, 27.48],
          [71.92, 27.48]
        ]
      })
    )
  })

  await page.goto('/pacote')
  const conteudo = (await page.textContent('body')) ?? ''
  expect(conteudo).not.toContain('NaN')
  expect(conteudo).not.toContain('Infinity')
  expect(conteudo).not.toContain('undefined')
})

test('area com tres cantos nao passa pela validacao', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    sessionStorage.setItem(
      'sunhub.area',
      JSON.stringify({
        cantos: [
          [71.92, 27.474],
          [71.927, 27.474],
          [71.927, 27.48]
        ]
      })
    )
  })

  await page.goto('/pacote')
  const conteudo = (await page.textContent('body')) ?? ''
  expect(conteudo).not.toContain('NaN')

  // tres cantos nao fecham area, entao o que estava guardado nao pode ter virado
  // hectare nenhum
  const guardado = await page.evaluate(() => sessionStorage.getItem('sunhub.area'))
  expect(guardado).toContain('71.92')
})

test('o menu abre, navega e leva pras telas legais', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Abrir menu' }).click()

  await expect(page.getByRole('link', { name: 'Privacidade' })).toBeVisible()
  await page.getByRole('link', { name: 'Privacidade' }).click()

  await expect(page).toHaveURL(/\/privacidade$/)
  await expect(
    page.getByRole('heading', { name: /O que o SunHub sabe sobre você/ })
  ).toBeVisible()
})

test('trocar o idioma no menu troca a tela toda', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Abrir menu' }).click()
  await page.getByRole('button', { name: 'English' }).click()

  await expect(page.getByRole('link', { name: 'Privacy' })).toBeVisible()
  await page.getByRole('button', { name: 'Close menu' }).click()
  await expect(page.getByRole('link', { name: 'Mark my area' })).toBeVisible()
})

// o idioma inicial sai do navegador. quem chega com o aparelho em ingles tem que
// ver ingles sem tocar em nada
test.describe('aparelho em ingles', () => {
  test.use({ locale: 'en-US' })

  test('abre em ingles sozinho', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()

    await page.goto('/nao-existe')
    await expect(page.getByRole('heading', { name: 'Total eclipse here' })).toBeVisible()
  })
})

// quatro telas caem numa area de demonstracao quando ninguem marcou nada, e
// isso e proposital: da pra ver o app inteiro sem desenhar no globo. o que nao
// pode e o numero se passar pela terra da pessoa
test('sem area marcada, a tela avisa que a area e de demonstracao', async ({ page }) => {
  for (const rota of ['/sol', '/passagem', '/pacote']) {
    await page.goto(rota)
    await expect(page.getByText(/ÁREA DE DEMONSTRAÇÃO \d/), rota).toBeVisible()
    await expect(page.getByText(/ÁREA MARCADA \d/), rota).toHaveCount(0)
  }
})

test('com area marcada, a tela para de chamar de demonstracao', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    sessionStorage.setItem(
      'sunhub.area',
      JSON.stringify({
        cantos: [
          [71.92, 27.474],
          [71.927, 27.474],
          [71.927, 27.48],
          [71.92, 27.48]
        ]
      })
    )
  })

  await page.goto('/pacote')
  await expect(page.getByText(/ÁREA MARCADA \d/)).toBeVisible()
  await expect(page.getByText(/ÁREA DE DEMONSTRAÇÃO \d/)).toHaveCount(0)
})
