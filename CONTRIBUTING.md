# Contribuindo

## O fluxo

`main` não recebe commit direto. Nunca.

1. Crie uma branch a partir da `main`
2. Faça os commits
3. Abra um PR
4. Espere a CI ficar verde
5. **Rebase and merge**

Nada de squash. O squash reescreve a data de autoria, e a data aqui é escolhida
de propósito.

## Commits

Nome em inglês, no estilo `feat:`, `fix:`, `refactor:`, `test:`, `docs:`,
`chore:`.

Corpo em português, contando o problema, a decisão e o que custou tempo. Sem
emoji, sem bullet formal, sem linguagem de release note.

## Código

- Nunca `any` em código novo
- Sem `;` onde a linguagem não exige, e arrow function
- Comentário explica **por que**, não o que. Comentário que repete o código não
  entra. Quando um comentário explica um erro que já aconteceu, ele conta o erro
- Reutilizar antes de criar
- Refatorar só com ganho real de leitura ou manutenção, nunca por contagem de
  linhas

## O que a CI cobra

Lint, tipos, testes de núcleo, build e testes de tela.

Rode antes de abrir o PR:

```
npm run lint
npx tsc --noEmit -p tsconfig.app.json
npm run build
```

## Decisões que não mudam por engano

Se você quiser mexer em algo desta lista, abra uma issue antes de escrever
código. Todas elas já foram discutidas e têm motivo.

**Capacitor, não React Native.** O coração do app é WebGL. Com Capacitor o mesmo
código vira site e aplicativo.

**O núcleo em `src/domain` não sabe que existe tela.** Nada ali importa React nem
toca no DOM. É isso que deixa testar sem abrir navegador. Se uma conta ficou
difícil de testar, ela está no lugar errado.

**Os números da tela inicial são contrato com o código.** Sete refletores, 640 km
e 11 minutos saem de `src/domain/orbita.ts`. Mudar num lugar e não no outro faz a
tela mentir.

**As premissas do cálculo ficam à vista.** Irradiância, ocupação, eficiência e
tarifa aparecem na tela do pacote. Elas existem para poderem ser discutidas, não
para ficarem escondidas no código.

**A coordenada da propriedade não vai para URL, log nem analytics.** Ela vive em
`sessionStorage` e só. A única coisa que sai do aparelho são os pedidos de imagem
do mapa, e isso está escrito na tela de Privacidade.

**O português é a fonte da verdade do i18n.** O tipo do dicionário sai de
`src/i18n/pt.ts` e o inglês tem que encaixar. Chave faltando quebra o build.

**Nada de Sentry, Google Analytics ou qualquer coisa que mande dado para fora**
sem discussão em issue antes.
