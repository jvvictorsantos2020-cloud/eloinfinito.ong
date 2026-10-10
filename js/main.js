/* =========================================================
   main.js: ponto de entrada. Só importa os módulos e os inicia.
   Cada módulo é independente e ignora a página se os seus elementos não existirem.
   ========================================================= */
import { $ } from './dom.js';
import { iniciarMenu } from './menu.js';
import { iniciarLeituraEmVoz } from './voz.js';
import { iniciarAjustes } from './acessibilidade.js';
import { iniciarAreas } from './areas.js';
import { iniciarFormulario } from './formulario.js';
import { iniciarAlertas } from './feedback.js';

iniciarMenu();
iniciarLeituraEmVoz();
iniciarAjustes();
iniciarAreas();
iniciarFormulario();
iniciarAlertas();

const ano = $('#ano');
if (ano) ano.textContent = new Date().getFullYear();
