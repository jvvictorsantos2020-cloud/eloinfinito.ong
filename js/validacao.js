/* =========================================================
   validacao.js: regras de validação (lógica pura, sem DOM)
   Cada regra recebe o valor e devolve a mensagem de erro, ou texto vazio
   quando o valor é válido. Por não tocar na página, pode ser testada à parte.
   ========================================================= */

const regras = {
  nome: (v) => {
    if (!v.trim()) return 'Informe seu nome completo.';
    if (v.trim().length < 3) return 'O nome precisa ter ao menos 3 letras.';
    if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(v.trim())) return 'Use apenas letras no nome.';
    return '';
  },
  email: (v) => {
    const e = v.trim();
    if (!e) return 'Informe seu e-mail.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) || e.includes('..')) return 'Use o formato nome@exemplo.com.';
    return '';
  },
  telefone: (v) => {
    if (!v.trim()) return '';
    if (/[^\d\s()+-]/.test(v)) return 'Use apenas números, espaços, parênteses e hífen.';
    let digitos = v.replace(/\D/g, '');
    if (digitos.length >= 12 && digitos.startsWith('55')) digitos = digitos.slice(2); // código do país
    return digitos.length === 10 || digitos.length === 11 ? '' : 'Informe o DDD e o número (10 ou 11 dígitos).';
  },
  perfil: (v) => (v ? '' : 'Escolha como você quer participar.'),
  mensagem: (v) => {
    if (!v.trim()) return 'Escreva sua mensagem.';
    if (v.trim().length < 10) return 'Escreva ao menos 10 caracteres.';
    return '';
  },
  consentimento: (_v, campo) => (campo.checked ? '' : 'Para enviar, aceite o uso dos seus dados.'),
};

export const campoTemRegra = (campo) => campo.name in regras;

export function mensagemDeErro(campo) {
  const regra = regras[campo.name];
  return regra ? regra(campo.value, campo) : '';
}
