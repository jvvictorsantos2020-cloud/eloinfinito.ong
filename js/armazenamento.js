/* =========================================================
   armazenamento.js: camada de Web Storage (localStorage)
   Único arquivo que conhece o localStorage. O localStorage só guarda texto,
   então os objetos viram string com JSON.stringify ao gravar e voltam a
   objeto com JSON.parse ao ler. O try/catch cobre modo privado, armazenamento
   cheio ou bloqueado e JSON corrompido.
   ========================================================= */

export function guardarJSON(chave, objeto) {
  try {
    localStorage.setItem(chave, JSON.stringify(objeto));
  } catch { /* sem armazenamento disponível */ }
}

export function lerJSON(chave, padrao) {
  try {
    const texto = localStorage.getItem(chave); // string ou null
    return texto === null ? padrao : JSON.parse(texto);
  } catch {
    return padrao;
  }
}
