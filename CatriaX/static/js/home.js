document.addEventListener("DOMContentLoaded", () => {
    // 1. Procura QUALQUER elemento que tenha o atributo 'data-target'.
    const gatilhos = document.querySelectorAll('.nav-trigger');
    const secoes = document.querySelectorAll('.pagina');
    const linksMenu = document.querySelectorAll('.nav-link');

    gatilhos.forEach(botao => {
        botao.addEventListener('click', (e) => {
            const targetId = botao.getAttribute('data-target');
            if (!targetId) return;

            // Previne o recarregamento da página se for uma tag <a>
            if(botao.tagName === 'A') e.preventDefault();

            // Atualiza o sublinhado/cor do menu superior
            linksMenu.forEach(link => link.classList.remove('ativo'));
            const linkCorrespondente = document.querySelector(`.nav-link[data-target="${targetId}"]`);
            if (linkCorrespondente) linkCorrespondente.classList.add('ativo');

            // Esconde todas as seções e remove a classe de animação
            secoes.forEach(secao => {
                secao.style.display = 'none';
                secao.classList.remove('animando');
            });

            // Mostra a seção que o usuário clicou
            const secaoAlvo = document.getElementById(targetId);
            if (secaoAlvo) {
                secaoAlvo.style.display = 'block';
                
                // O truque do Reflow: Força o navegador a reiniciar a animação CSS
                void secaoAlvo.offsetWidth; 
                
                // Adiciona a classe que dispara as animações de subida (fade up)
                secaoAlvo.classList.add('animando');
                
                // Faz a tela rolar suavemente para o topo ao trocar de aba
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // Força a animação a rodar na tela 'home' logo que o site carrega
    const telaInicial = document.getElementById('home');
    if (telaInicial) {
        telaInicial.classList.add('animando');
    }
});