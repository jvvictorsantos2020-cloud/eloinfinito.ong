/* areas.js: botões "Saber mais" dos cards, que abrem o modal com o conteúdo de dados-areas.js */
import { $$ } from './dom.js';
import { AREAS } from './dados-areas.js';
import { abrirModal } from './feedback.js';

export function iniciarAreas() {
  $$('[data-area]').forEach((botao) => {
    botao.addEventListener('click', () => abrirModal(AREAS[botao.dataset.area]));
  });
}
