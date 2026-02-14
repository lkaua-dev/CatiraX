document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Em vez de procurar por classes específicas, o JS agora procura 
    // QUALQUER elemento que tenha o atributo 'data-target'.
    // Isso faz o Logo, Menu, btn-acao1 e btn-voltar funcionarem automaticamente.
    const gatilhos = document.querySelectorAll('[data-target]');
    
    // 2. Seleciona todas as sections diretamente de dentro da tag main
    const secoes = document.querySelectorAll('main > section');
    
    const linksMenu = document.querySelectorAll('.nav-link');

    gatilhos.forEach(botao => {
        botao.addEventListener('click', (e) => {
            const targetId = botao.getAttribute('data-target');
            if (!targetId) return;

            // Previne o recarregamento da página (caso seja um link)
            e.preventDefault();

            // Atualiza o sublinhado/cor do menu superior
            linksMenu.forEach(link => link.classList.remove('ativo'));
            const linkCorrespondente = document.querySelector(`.nav-link[data-target="${targetId}"]`);
            if (linkCorrespondente) linkCorrespondente.classList.add('ativo');

            // Esconde todas as seções (via estilo direto para sobrepor o CSS)
            secoes.forEach(secao => {
                secao.style.display = 'none';
                secao.classList.remove('animando');
            });

            // Mostra a seção que o usuário clicou e reinicia a animação
            const secaoAlvo = document.getElementById(targetId);
            if (secaoAlvo) {
                secaoAlvo.style.display = 'block';
                void secaoAlvo.offsetWidth; // O truque do Reflow para animação
                secaoAlvo.classList.add('animando');
            }
        });
    });

    // Força a animação a rodar na tela 'home' logo que o site carrega
    const telaInicial = document.getElementById('home');
    if(telaInicial) {
        telaInicial.classList.add('animando');
    }
});