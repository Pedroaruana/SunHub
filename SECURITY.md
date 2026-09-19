# Segurança

## Como relatar

Não abra issue pública para falha de segurança. Use o
[relatório privado do GitHub](https://docs.github.com/pt/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
na aba Security deste repositório.

Respondo assim que vejo. Sou uma pessoa só, então pode demorar alguns dias.

## O que interessa relatar

- Qualquer jeito de fazer a coordenada da propriedade sair do aparelho além do
  que já está descrito na tela de Privacidade
- Execução de script vinda de dado guardado no navegador, que pode ter sido
  editado à mão
- Cabeçalho de segurança faltando ou mal configurado na versão web
- Dependência com falha conhecida que este projeto realmente usa em produção

## O que já é conhecido e não é falha

**As imagens do mapa vêm de servidor externo.** A sequência de pedidos revela
aproximadamente qual região está sendo olhada, e isso está escrito com todas as
letras na tela de Privacidade. Foi uma troca consciente: sem imagem de servidor,
o globo não teria imagem.

**Tudo fica no navegador e não é criptografado.** Área desenhada e orçamentos
ficam em `sessionStorage` e `localStorage`. Quem tem o aparelho desbloqueado tem
os dados. Não existe conta, então também não existe sessão para roubar.

**Não existe back-end.** Nada de autenticação, autorização, rate limiting ou
banco. Se um dia existir, essa lista muda junto.

**Os valores são inventados.** Preço, energia e a própria empresa são simulação.
Número errado aqui é bug de produto, não falha de segurança.
