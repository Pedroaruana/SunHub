// o build gera o HTML de cada rota no Node, onde nao existe window nem storage.
// sem esta guarda o prerender quebra na primeira leitura de localStorage
export const noNavegador = typeof window !== 'undefined'
