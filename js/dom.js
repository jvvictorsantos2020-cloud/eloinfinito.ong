/* dom.js: atalhos de seleção usados por todos os módulos. Não depende de nenhum outro arquivo. */
export const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
export const $$ = (seletor, raiz = document) => [...raiz.querySelectorAll(seletor)];
