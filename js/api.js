/* =========================================================
   api.js: camada de rede
   Concentra toda a comunicação com o servidor. Os demais módulos chamam estas
   funções e não sabem se existe um back-end. Para integrar de verdade, basta
   preencher URL_CONTATO com o endereço da API.
   ========================================================= */

const URL_CONTATO = null;   // exemplo: '/api/contato'
const TEMPO_LIMITE = 10000; // 10 segundos

/* Erro com mensagem pronta para mostrar ao usuário */
export class ErroEnvio extends Error {}

export async function enviarContato(dados, { url = URL_CONTATO, tempoLimite = TEMPO_LIMITE } = {}) {
  if (!url) {
    // Sem back-end: simula o envio com uma pequena espera
    await new Promise((resolver) => setTimeout(resolver, 300));
    return { ok: true };
  }

  if (globalThis.navigator?.onLine === false) {
    throw new ErroEnvio('Você está sem conexão com a internet.');
  }

  // Sem limite de tempo, uma rede travada deixaria o botão bloqueado para sempre
  const controle = new AbortController();
  const alarme = setTimeout(() => controle.abort(), tempoLimite);

  try {
    const resposta = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
      signal: controle.signal,
    });
    if (!resposta.ok) throw new ErroEnvio(`O servidor respondeu com erro (código ${resposta.status}).`);

    // Respostas vazias (204) não são JSON: tratá-las como sucesso
    const texto = await resposta.text();
    return texto ? JSON.parse(texto) : { ok: true };
  } catch (erro) {
    if (erro instanceof ErroEnvio) throw erro;
    if (erro.name === 'AbortError') throw new ErroEnvio('O servidor demorou demais para responder.');
    throw new ErroEnvio('Não foi possível conectar ao servidor.');
  } finally {
    clearTimeout(alarme);
  }
}
