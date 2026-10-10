/* =========================================================
   acessibilidade.js: alto contraste e tamanho do texto
   Guarda as preferências por meio do módulo armazenamento.js.
   ========================================================= */
import { $ } from './dom.js';
import { guardarJSON, lerJSON } from './armazenamento.js';

const CHAVE_AJUSTES = 'elo-ajustes';
const ESCALAS = [100, 112.5, 125, 137.5, 150]; // % do tamanho de fonte

// Lê o objeto salvo e valida cada campo; qualquer dado inesperado volta ao padrão
function carregarAjustes() {
  const lido = lerJSON(CHAVE_AJUSTES, null);
  const salvo = lido && typeof lido === 'object' ? lido : {};
  return {
    contraste: salvo.contraste === true,
    escala: Number.isInteger(salvo.escala) && salvo.escala >= 0 && salvo.escala < ESCALAS.length
      ? salvo.escala
      : 0,
  };
}

export function iniciarAjustes() {
  const btnContraste = $('#btn-contraste');
  if (!btnContraste) return;

  const btnAumentar = $('#btn-aumentar');
  const btnDiminuir = $('#btn-diminuir');
  const btnRedefinir = $('#btn-redefinir');
  const statusAcess = $('#status-acessibilidade');
  const raiz = document.documentElement;
  const ajustes = carregarAjustes();

  function aplicarAjustes() {
    if (ajustes.contraste) raiz.setAttribute('data-contraste', 'alto');
    else raiz.removeAttribute('data-contraste');

    raiz.style.fontSize = ESCALAS[ajustes.escala] + '%';
    btnContraste.setAttribute('aria-pressed', String(ajustes.contraste));
    btnDiminuir.setAttribute('aria-disabled', String(ajustes.escala === 0));
    btnAumentar.setAttribute('aria-disabled', String(ajustes.escala === ESCALAS.length - 1));

    guardarJSON(CHAVE_AJUSTES, { versao: 1, contraste: ajustes.contraste, escala: ajustes.escala });
  }

  function anunciar() {
    const contraste = ajustes.contraste ? 'Alto contraste ativado.' : 'Alto contraste desativado.';
    statusAcess.textContent = `${contraste} Tamanho do texto: ${ESCALAS[ajustes.escala]}%.`;
  }

  function mudarEscala(passo) {
    const nova = ajustes.escala + passo;
    if (nova < 0 || nova >= ESCALAS.length) return;
    ajustes.escala = nova;
    aplicarAjustes();
    anunciar();
  }

  btnContraste.addEventListener('click', () => {
    ajustes.contraste = !ajustes.contraste;
    aplicarAjustes();
    anunciar();
  });
  btnAumentar.addEventListener('click', () => mudarEscala(1));
  btnDiminuir.addEventListener('click', () => mudarEscala(-1));
  btnRedefinir.addEventListener('click', () => {
    ajustes.contraste = false;
    ajustes.escala = 0;
    aplicarAjustes();
    anunciar();
  });

  aplicarAjustes(); // aplica as preferências salvas, sem anunciar
}
