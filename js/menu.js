/* menu.js: menu de navegação do celular (abrir, fechar e atualizar aria-expanded) */
import { $ } from './dom.js';

export function iniciarMenu() {
  const btnMenu = $('#btn-menu');
  const menu = $('#menu-principal');
  if (!btnMenu || !menu) return;

  const textoMenu = $('.btn-menu__texto', btnMenu);
  const desktop = window.matchMedia('(min-width: 48em)');

  function definirMenu(aberto) {
    menu.classList.toggle('aberto', aberto);
    btnMenu.setAttribute('aria-expanded', String(aberto));
    textoMenu.textContent = aberto ? 'Fechar' : 'Menu';
  }

  btnMenu.addEventListener('click', () => definirMenu(!menu.classList.contains('aberto')));

  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) definirMenu(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('aberto')) {
      definirMenu(false);
      btnMenu.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (menu.classList.contains('aberto') && !e.target.closest('.topo')) definirMenu(false);
  });

  desktop.addEventListener('change', () => definirMenu(false));
}
