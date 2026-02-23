// ==========================================
// NAVEGAÇÃO E ALTERNÂNCIA ENTRE ABAS
// ==========================================

// AGUARDA PÁGINA CARREGAR PARA CONFIGURAR NAVEGAÇÃO
document.addEventListener("DOMContentLoaded", () => {
    const gatilhos = document.querySelectorAll('.nav-trigger');
    const secoes = document.querySelectorAll('.pagina');
    const linksMenu = document.querySelectorAll('.nav-link');

    // ADICIONA EVENTO A CADA BOTÃO DE NAVEGAÇÃO
    gatilhos.forEach(botao => {
        botao.addEventListener('click', (e) => {
            // OBTÉM QUAL SEÇÃO MOSTRAR PELO data-target
            const targetId = botao.getAttribute('data-target');
            if (!targetId) return;

            if(botao.tagName === 'A') e.preventDefault();

            // MARCA QUAL LINK DO MENU ESTÁ ATIVO
            linksMenu.forEach(link => link.classList.remove('ativo'));
            const linkCorrespondente = document.querySelector(`.nav-link[data-target="${targetId}"]`);
            if (linkCorrespondente) linkCorrespondente.classList.add('ativo');

            // ESCONDE TODAS AS SEÇÕES
            secoes.forEach(secao => {
                secao.style.display = 'none';
                secao.classList.remove('animando');
            });

            // MOSTRA APENAS A SEÇÃO SELECIONADA
            const secaoAlvo = document.getElementById(targetId);
            if (secaoAlvo) {
                secaoAlvo.style.display = 'block';

                // FORÇA REFLOW PARA ATIVAR ANIMAÇÃO CSS
                void secaoAlvo.offsetWidth;

                secaoAlvo.classList.add('animando');

                // FOCA TOPO DA PÁGINA COM ROLAGEM SUAVE
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // MOSTRA SEÇÃO HOME COMO PADRÃO INICIAL
    const telaInicial = document.getElementById('home');
    if (telaInicial) {
        telaInicial.classList.add('animando');
    }
});