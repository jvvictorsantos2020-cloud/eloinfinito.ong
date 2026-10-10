/* =========================================================
   formulario.js: comportamento do formulário na página
   Mostra o feedback visual de cada campo e coordena o envio. Delega as regras
   a validacao.js, o envio a api.js e as mensagens a feedback.js.
   ========================================================= */
import { $, $$ } from './dom.js';
import { campoTemRegra, mensagemDeErro } from './validacao.js';
import { enviarContato, ErroEnvio } from './api.js';
import { abrirModal, mostrarToast } from './feedback.js';

function validarCampo(campo) {
  if (!campoTemRegra(campo)) return true;

  const bloco = campo.closest('.campo');
  const erro = $('.erro', bloco);
  const texto = mensagemDeErro(campo);
  const vazioOpcional = !campo.required && !campo.value.trim();

  bloco.classList.remove('campo--valido', 'campo--invalido');
  erro.textContent = texto;

  if (texto) {
    bloco.classList.add('campo--invalido');
    campo.setAttribute('aria-invalid', 'true');
    return false;
  }

  campo.removeAttribute('aria-invalid');
  if (!vazioOpcional) bloco.classList.add('campo--valido');
  return true;
}

export function iniciarFormulario() {
  const form = $('#form-participe');
  if (!form) return;

  const statusForm = $('#status-form');
  const mensagem = $('#mensagem');
  const contador = $('#contador');
  const botaoEnviar = $('[type="submit"]', form);
  const campos = $$('input, select, textarea', form);

  campos.forEach((campo) => {
    const jaValidado = () => campo.closest('.campo').matches('.campo--valido, .campo--invalido');

    // Valida ao sair do campo; depois disso, revalida a cada digitação
    campo.addEventListener('blur', () => { if (campo.type !== 'checkbox') validarCampo(campo); });
    campo.addEventListener('input', () => { if (jaValidado()) validarCampo(campo); });
    campo.addEventListener('change', () => validarCampo(campo));
  });

  mensagem.addEventListener('input', () => {
    contador.textContent = `${mensagem.value.length}/${mensagem.maxLength}`;
  });

  function limparFormulario() {
    form.reset();
    contador.textContent = `0/${mensagem.maxLength}`;
    $$('.campo', form).forEach((bloco) => bloco.classList.remove('campo--valido', 'campo--invalido'));
    campos.forEach((campo) => campo.removeAttribute('aria-invalid'));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const invalidos = campos.filter((campo) => !validarCampo(campo));
    if (invalidos.length) {
      const n = invalidos.length;
      statusForm.textContent = n === 1 ? 'Corrija 1 campo para enviar.' : `Corrija ${n} campos para enviar.`;
      invalidos[0].focus();
      return;
    }

    statusForm.textContent = '';
    const dados = Object.fromEntries(new FormData(form));
    botaoEnviar.disabled = true;

    try {
      await enviarContato(dados);
      abrirModal({
        tipo: 'sucesso',
        titulo: 'Mensagem enviada',
        texto: `Obrigado, ${dados.nome.trim().split(/\s+/)[0]}. A equipe da Elo Infinito vai responder pelo e-mail informado.`,
      });
      limparFormulario();
    } catch (erro) {
      mostrarToast({
        tipo: 'erro',
        titulo: 'Não foi possível enviar',
        texto: erro instanceof ErroEnvio ? erro.message : 'Tente novamente em instantes.',
      });
    } finally {
      botaoEnviar.disabled = false;
    }
  });
}
