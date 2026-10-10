/* =========================================================
   temporizador.js: contagem regressiva que pode ser pausada
   Várias causas de pausa (mouse, foco do teclado) podem existir ao mesmo tempo.
   O tempo só volta a correr quando todas terminam, e nunca há dois
   temporizadores ativos para o mesmo item.
   ========================================================= */
export function criarTemporizador(duracao, aoExpirar) {
  let restante = duracao;
  let inicio = 0;
  let id = null;
  let encerrado = false;
  const pausas = new Set();

  const correr = () => {
    if (!duracao || encerrado || id !== null || pausas.size > 0) return;
    inicio = Date.now();
    id = setTimeout(() => {
      id = null;
      encerrado = true;
      aoExpirar();
    }, restante);
  };

  const parar = () => {
    if (id === null) return;
    clearTimeout(id);
    id = null;
    restante = Math.max(0, restante - (Date.now() - inicio));
  };

  return {
    iniciar: correr,
    pausar(motivo) { pausas.add(motivo); parar(); },
    retomar(motivo) { pausas.delete(motivo); correr(); },
    cancelar() { encerrado = true; parar(); },
  };
}
