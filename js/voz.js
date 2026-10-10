/* voz.js: leitura em voz alta da apresentação (Web Speech API, recurso nativo do navegador) */
import { $, $$ } from './dom.js';

const ROTULO_OUVIR = 'Ouvir apresentação da ONG';
const ROTULO_PARAR = 'Parar leitura';

export function iniciarLeituraEmVoz() {
  const btnVoz = $('#btn-speak-about');
  if (!btnVoz) return;
  const rotuloVoz = $('.texto', btnVoz);

  if (!('speechSynthesis' in window)) {
    btnVoz.disabled = true;
    rotuloVoz.textContent = 'Leitura em voz alta indisponível neste navegador';
    return;
  }

  let falando = false;
  let atual = null; // fala em andamento

  const parar = () => {
    atual = null;
    window.speechSynthesis.cancel();
    falando = false;
    rotuloVoz.textContent = ROTULO_OUVIR;
  };

  const textoParaLer = () => {
    const copia = $('#sobre').cloneNode(true);
    $$('[data-sem-leitura]', copia).forEach((no) => no.remove());
    return copia.textContent.replace(/\s+/g, ' ').trim();
  };

  btnVoz.addEventListener('click', () => {
    if (falando) { parar(); return; }

    const fala = new SpeechSynthesisUtterance(textoParaLer());
    fala.lang = 'pt-BR';
    fala.rate = 0.95;
    const vozPt = window.speechSynthesis.getVoices().find((v) => v.lang === 'pt-BR');
    if (vozPt) fala.voice = vozPt;

    atual = fala;
    // Ignora eventos de uma fala antiga (cancelada) que chegam depois da nova começar
    fala.onend = fala.onerror = () => {
      if (atual !== fala) return;
      atual = null;
      falando = false;
      rotuloVoz.textContent = ROTULO_OUVIR;
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(fala);
    falando = true;
    rotuloVoz.textContent = ROTULO_PARAR;
  });

  window.addEventListener('beforeunload', () => window.speechSynthesis.cancel());
}
