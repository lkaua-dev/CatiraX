// 1. Verifica se o usuário está logado
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
const welcomeMsg = document.getElementById("welcomeMsg");
const btnLogout = document.getElementById("btnLogout");

if (!usuarioLogado) {
    alert("Você precisa fazer login!");
    window.location.href = "login.html";
} else {
    // Se tiver logado, mostra o primeiro nome
    const primeiroNome = usuarioLogado.nome_completo.split(" ")[0];
    welcomeMsg.innerText = `CatiraX | Olá, ${primeiroNome}`;
}

// 2. Função de Logout
btnLogout.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
});

// =============================
// FUNÇÃO DE CURTIR (LIKE)
// =============================
function toggleLike(element) {
    const icon = element.querySelector('i');
    const countSpan = element.querySelector('span');
    let currentCount = parseCount(countSpan.innerText);

    if (icon.classList.contains('bx-heart')) {
        // Dar Like
        icon.classList.remove('bx-heart');
        icon.classList.add('bxs-heart');
        icon.style.color = '#ff3b30'; 
        
        // Efeito de pulso
        icon.style.transform = 'scale(1.2)';
        setTimeout(() => icon.style.transform = 'scale(1)', 200);

    } else {
        // Remover Like
        icon.classList.remove('bxs-heart');
        icon.classList.add('bx-heart');
        icon.style.color = '';
    }
}

function parseCount(str) {
    if (str.includes('k')) {
        return parseFloat(str.replace('k', '')) * 1000;
    }
    return parseInt(str);
}

// =============================
// LÓGICA DE COMENTÁRIOS
// =============================

// Selecionando elementos do DOM
const sheet = document.getElementById('commentsSheet');
const overlay = document.getElementById('modalOverlay');
const title = document.getElementById('commentProductTitle');
const list = document.getElementById('commentsList');
const input = document.getElementById('newCommentInput');

// Função para abrir a gaveta de comentários
function openComments(productName) {
    // Atualiza o título com o nome do produto clicado
    title.innerText = productName;
    
    // Mostra o modal e o overlay
    sheet.classList.add('active');
    overlay.classList.add('active');
    
    // Foca no input automaticamente (opcional, melhor para Desktop)
    setTimeout(() => input.focus(), 300);
}

// Função para fechar a gaveta
function closeComments() {
    sheet.classList.remove('active');
    overlay.classList.remove('active');
}

// Função para postar um novo comentário
function postComment() {
    const text = input.value;
    
    // Verifica se não está vazio
    if (text.trim() === "") return;

    // Cria o elemento HTML do novo comentário
    const newComment = document.createElement('div');
    newComment.classList.add('comment-item');
    
    // Estrutura interna do comentário
    newComment.innerHTML = `
        <div class="comment-avatar">
            <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Você">
        </div>
        <div class="comment-content">
            <h4>Você</h4>
            <p>${text}</p>
        </div>`;

    // Adiciona o comentário à lista
    list.appendChild(newComment);
    
    // Limpa o campo de texto
    input.value = "";
    
    // Rola a lista para baixo para ver o novo comentário
    list.scrollTo({
        top: list.scrollHeight,
        behavior: 'smooth'
    });
}

// Adiciona evento para enviar ao apertar "Enter" no teclado
if (input) {
    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            postComment();
        }
    });
}