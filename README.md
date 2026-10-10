# ONG Elo Infinito

Plataforma web de página única para a ONG Elo Infinito, que acolhe pessoas com autismo (TEA), paralisia cerebral e deficiência visual e conecta famílias, voluntários e doadores.

## Funcionalidades

- Layout responsivo com Grid de 12 colunas, Flexbox e cenários adaptativos com `@media`
- Design system com variáveis CSS: paleta, escala tipográfica (razão 1,25) e espaçamentos modulares de 8 px
- Acessibilidade: alto contraste, ajuste do tamanho do texto, leitura em voz alta, tradução em Libras (VLibras) e navegação por teclado
- Formulário com validação em tempo real, modal de confirmação e notificações (toasts)
- Preferências do usuário salvas no `localStorage`

## Estrutura do projeto

```
index.html
estilo.css
img/        ilustrações e ícones em SVG
js/         módulos ES6 (main, menu, voz, acessibilidade, formulario, validacao, api, armazenamento, feedback...)
```

## Como executar

O JavaScript usa módulos ES6, que não funcionam ao abrir o arquivo com duplo clique. Use um servidor local:

- No VS Code, instale a extensão **Live Server** e clique em **Go Live**; ou
- No Terminal, dentro da pasta do projeto: `python3 -m http.server 8000` e acesse http://localhost:8000

## Tecnologias

HTML5, CSS3, JavaScript (ES modules), VLibras e Google Fonts (Lexend e Atkinson Hyperlegible).

## Fluxo de Git

O projeto segue o GitFlow: `main` guarda as versões de lançamento (com tags), `develop` reúne o desenvolvimento, e as novas funcionalidades nascem em branches `feature/` e voltam para `develop` por Pull Request. Os lançamentos passam por uma branch `release/`.

## Autoria

Desenvolvido como experiência prática do terceiro setor.