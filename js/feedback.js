/* =========================================================
   feedback.js: modal, toasts e alertas reutilizáveis
   Importe apenas o que precisar:
     import { abrirModal, mostrarToast } from './feedback.js';

     abrirModal({ tipo, titulo, texto, itens, rotuloBotao })
     mostrarToast({ tipo, titulo, texto, duracao })

   tipo: 'info' | 'sucesso' | 'aviso' | 'erro' (opcional no modal)
   duracao: milissegundos até sumir; 0 mantém até o usuário fechar.
            Padrão: 6000, e 0 para tipo 'erro'.
   ========================================================= */
import { criarTemporizador } from './temporizador.js';

const ICONES = { info: 'i', sucesso: '✓', aviso: '!', erro: '✕' };
const tipoValido = (tipo) => (Object.hasOwn(ICONES, tipo) ? tipo : null);

/* ---------- Modal ---------- */
let modal = null;

export function fecharModal() {
  if (!modal) return;
  if (typeof modal.close === 'function') modal.close();
  else modal.removeAttribute('open');
}

function obterModal() {
  if (modal) return modal;

  modal = document.createElement('dialog');
  modal.id = 'modal';
  modal.className = 'modal';
  modal.setAttribute('aria-labelledby', 'modal-titulo');
  modal.setAttribute('aria-describedby', 'modal-texto');
  modal.innerHTML =
    '<div class="modal__corpo">' +
      '<span id="modal-icone" class="alerta__icone" aria-hidden="true" hidden></span>' +
      '<h2 id="modal-titulo"></h2>' +
      '<p id="modal-texto"></p>' +
      '<ul id="modal-lista" class="lista-simples"></ul>' +
      '<button class="btn btn--primario" type="button" data-fechar>Fechar</button>' +
    '</div>';
  document.body.append(modal);

  modal.querySelector('[data-fechar]').addEventListener('click', fecharModal);
  // Clique no fundo escuro fecha o modal (Esc já é tratado pelo <dialog>)
  modal.addEventListener('click', (e) => { if (e.target === modal) fecharModal(); });
  return modal;
}

export function abrirModal({ tipo, titulo = '', texto = '', itens = [], rotuloBotao = 'Fechar' } = {}) {
  const m = obterModal();
  const t = tipoValido(tipo);

  m.className = t ? `modal modal--${t}` : 'modal';

  const icone = m.querySelector('#modal-icone');
  icone.hidden = !t;
  icone.textContent = t ? ICONES[t] : '';

  m.querySelector('#modal-titulo').textContent = titulo;
  m.querySelector('#modal-texto').textContent = texto;
  m.querySelector('#modal-lista').replaceChildren(...itens.map((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    return li;
  }));
  m.querySelector('[data-fechar]').textContent = rotuloBotao;

  if (typeof m.showModal === 'function') { if (!m.open) m.showModal(); }
  else m.setAttribute('open', '');
}

/* ---------- Toast ---------- */
const MAX_TOASTS = 4;
let area = null;

function obterArea() {
  if (area) return area;
  area = document.createElement('div');
  area.className = 'toasts';
  area.setAttribute('role', 'region');
  area.setAttribute('aria-label', 'Notificações');
  document.body.append(area);
  return area;
}

export function mostrarToast({ tipo = 'info', titulo = '', texto = '', duracao } = {}) {
  const t = tipoValido(tipo) || 'info';
  const tempo = duracao ?? (t === 'erro' ? 0 : 6000);

  const el = document.createElement('div');
  el.className = `alerta alerta--${t} toast`;
  // Erros interrompem a leitura de tela (alert); os demais esperam (status)
  el.setAttribute('role', t === 'erro' ? 'alert' : 'status');
  el.innerHTML =
    '<span class="alerta__icone" aria-hidden="true"></span>' +
    '<div class="alerta__texto"><strong class="alerta__titulo"></strong><p></p></div>' +
    '<button class="alerta__fechar" type="button" aria-label="Fechar notificação">×</button>';

  el.querySelector('.alerta__icone').textContent = ICONES[t];
  el.querySelector('.alerta__titulo').textContent = titulo;
  const p = el.querySelector('p');
  if (texto) p.textContent = texto; else p.remove();

  const lista = obterArea();
  while (lista.children.length >= MAX_TOASTS) lista.firstElementChild.remove();
  lista.append(el);

  const remover = () => {
    temporizador.cancelar();
    el.classList.add('toast--saindo');
    setTimeout(() => el.remove(), 180);
  };
  // Pausa com mouse ou foco: o usuário precisa de tempo para ler
  const temporizador = criarTemporizador(tempo, remover);

  el.querySelector('.alerta__fechar').addEventListener('click', remover);
  el.addEventListener('mouseenter', () => temporizador.pausar('mouse'));
  el.addEventListener('mouseleave', () => temporizador.retomar('mouse'));
  el.addEventListener('focusin', () => temporizador.pausar('foco'));
  el.addEventListener('focusout', () => temporizador.retomar('foco'));
  temporizador.iniciar();

  return remover;
}

/* ---------- Alertas fixos na página (fechar com o botão ×) ---------- */
export function iniciarAlertas() {
  document.addEventListener('click', (e) => {
    const botao = e.target.closest('.alerta__fechar');
    const alerta = botao && botao.closest('.alerta');
    if (alerta && !alerta.classList.contains('toast')) alerta.remove();
  });
}
