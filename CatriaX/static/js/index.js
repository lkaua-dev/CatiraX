// ==========================================
// VERIFICAR AUTENTICAÇÃO E CARREGAR AVATAR
// ==========================================

// VERIFICA SE USUÁRIO FOI AUTENTICADO ANTERIORMENTE
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
const welcomeMsg = document.getElementById("welcomeMsg");
const btnLogout = document.getElementById("btnLogout");
const userAvatar = document.getElementById("userAvatar");

if (usuarioLogado) {
    // EXTRAI PRIMEIRO NOME DO USUÁRIO
    const nomeCompleto = usuarioLogado.nome_completo || usuarioLogado.nome || "Usuário";
    const primeiroNome = nomeCompleto.split(" ")[0];

    welcomeMsg.innerText = `CatiraX`;


    // GERA AVATAR COM INICIAIS DO PRIMEIRO NOME
    userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(primeiroNome)}&background=1976d2&color=fff&bold=true`;
}

// ==========================================
// FUNÇÃO DE LOGOUT
// ==========================================

// REMOVE DADOS DO USUÁRIO E RETORNA PARA LOGIN
btnLogout.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
});

// ==========================================
// FUNÇÃO DE CURTIR (LIKE)
// ==========================================

// ALTERNA ENTRE CORAÇÃO VAZIO E CHEIO COM ANIMAÇÃO
function toggleLike(element) {
    const icon = element.querySelector('i');
    const countSpan = element.querySelector('span');

    let currentCount = parseCount(countSpan.innerText);

    // SE NÃO FOI CURTIDO, MARCA COMO CURTIDO
    if (icon.classList.contains('bx-heart')) {
        icon.classList.remove('bx-heart');
        icon.classList.add('bxs-heart');
        icon.style.color = '#ff3b30';

        countSpan.innerText = formatCount(currentCount + 1);

        // ANIMA O CORAÇÃO COM SCALE
        icon.style.transform = 'scale(1.3)';
        setTimeout(() => icon.style.transform = 'scale(1)', 200);

    } else {
        // SE JÁ FOI CURTIDO, DESCURTE
        icon.classList.remove('bxs-heart');
        icon.classList.add('bx-heart');
        icon.style.color = 'white';

        countSpan.innerText = formatCount(currentCount - 1);
    }
}

// ==========================================
// CONVERTER CONTAGEM DE NÚMEROS
// ==========================================

// CONVERTE NÚMERO GRANDE EM FORMATO ABREVIADO (1000 = 1k)
function parseCount(str) {
    str = str.toString();
    if (str.includes('k')) {
        return parseFloat(str.replace('k', '')) * 1000;
    }
    return parseInt(str) || 0;
}

// FORMATA NÚMERO ACIMA DE 1000 EM MILHARES (1000 = 1k)
function formatCount(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace('.0', '') + 'k';
    }
    return num;
}

// ==========================================
// LÓGICA DE COMENTÁRIOS
// ==========================================

const sheet = document.getElementById('commentsSheet');
const overlay = document.getElementById('modalOverlay');
const title = document.getElementById('commentProductTitle');
const list = document.getElementById('commentsList');
const input = document.getElementById('newCommentInput');

let spanComentarioAtual = null;

// ABRE MODAL DE COMENTÁRIOS DO PRODUTO
function openComments(productName) {
    title.innerText = `Comentários: ${productName}`;

    // PROCURA O CARD DO PRODUTO PARA ATUALIZAR CONTAGEM
    const titulos = document.querySelectorAll('.product-info h2');
    for (let h2 of titulos) {
        if (h2.innerText === productName) {
            const card = h2.closest('.product-card');
            spanComentarioAtual = card.querySelector('.comment-count');
            break;
        }
    }

    // MOSTRA O MODAL E FOCA NO INPUT
    sheet.classList.add('active');
    overlay.classList.add('active');
    setTimeout(() => input.focus(), 300);
}

// FECHA MODAL DE COMENTÁRIOS
function closeComments() {
    sheet.classList.remove('active');
    overlay.classList.remove('active');
    spanComentarioAtual = null;
}

// PUBLICA NOVO COMENTÁRIO NO MODAL
function postComment() {
    const text = input.value;
    if (text.trim() === "") return;

    // PEGA AVATAR DO USUÁRIO PARA EXIBIR NO COMENTÁRIO
    const avatarSrc = userAvatar ? userAvatar.src : 'https://ui-avatars.com/api/?name=U&background=1976d2&color=fff';

    // CRIA ELEMENTO HTML DO COMENTÁRIO
    const newComment = document.createElement('div');
    newComment.classList.add('comment-item');
    newComment.innerHTML = `
        <div class="comment-avatar">
            <img src="${avatarSrc}" alt="Você">
        </div>
        <div class="comment-content">
            <h4>Você</h4>
            <p>${text}</p>
        </div>`;

    // ADICIONA COMENTÁRIO À LISTA E LIMPA O INPUT
    list.appendChild(newComment);
    input.value = "";

    // INCREMENTA NÚMERO DE COMENTÁRIOS DO PRODUTO
    if (spanComentarioAtual) {
        let numAtual = parseInt(spanComentarioAtual.innerText) || 0;
        spanComentarioAtual.innerText = numAtual + 1;
    }

    // FAZ SCROLL SUAVE ATÉ O NOVO COMENTÁRIO
    list.scrollTo({
        top: list.scrollHeight,
        behavior: 'smooth'
    });
}

// PERMITE ENVIAR COMENTÁRIO COM TECLA ENTER
if (input) {
    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            postComment();
        }
    });
}

// ==========================================
// RENDERIZAR ANÚNCIOS DO BANCO DE DADOS
// ==========================================

// BUSCA PRODUTOS DO SERVIDOR E ADICIONA À TELA
async function carregarAnunciosDoBanco() {
    const container = document.querySelector('.feed-container');
    const avatarSrc = userAvatar ? userAvatar.src : 'https://ui-avatars.com/api/?name=U&background=1976d2&color=fff';

    // URL BASE DO SERVIDOR API (ONDE AS IMAGENS ESTÃO HOSPEDADAS)
    const apiUrl = 'http://localhost:5000';

    try {
        console.log("🔄 Carregando anúncios...");

        // BUSCA LISTA DE PRODUTOS DO SERVIDOR PYTHON
        const response = await fetch(`${apiUrl}/produtos`);

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: Falha ao buscar os dados do banco.`);
        }

        // RECEBE ARRAY DE PRODUTOS EM JSON
        const produtosDB = await response.json();
        console.log(`✅ ${produtosDB.length} produtos carregados`);

        if (produtosDB.length === 0) {
            console.log("⚠️ Nenhum produto no banco");
            // NÃO LIMPA O CONTAINER - MANTÉM OS PRODUTOS PADRÃO
            return;
        }

        // PEGA O PRIMEIRO CARD PADRÃO PARA INSERIR NOVOS ANTES DELE
        const primeiroCardPadrao = container.querySelector('.product-card');

        // CRIA CARD PARA CADA PRODUTO
        produtosDB.forEach(produto => {
            const card = document.createElement('div');
            card.classList.add('product-card');

            // CONSTRÓI URL COMPLETA DA IMAGEM (ADICIONA BASE URL)
            const imagemUrl = produto.url.startsWith('http')
                ? produto.url
                : `${apiUrl}${produto.url}`;

            // DEFINE IMAGEM DE FUNDO DO CARD
            card.style.backgroundImage = `url('${imagemUrl}')`;
            card.style.backgroundColor = '#1a1a1a';

            // FORMATA VALOR PARA MOEDA BRASILEIRA (R$ 00,00)
            const valorFormatado = Number(produto.valor).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            card.innerHTML = `
                <div class="overlay-gradient"></div>
                <div class="product-info">
                    <h2>${produto.titulo}</h2>
                    <span class="product-price">${valorFormatado}</span>
                    <p class="product-desc">${produto.descricao || 'Sem descrição.'}</p>
                </div>
                <div class="actions-sidebar">
                    <div class="action-btn seller-profile">
                        <img src="${avatarSrc}" alt="Vendedor">
                    </div>
                    <div class="action-btn" onclick="toggleLike(this)">
                        <i class='bx bx-heart'></i>
                        <span>0</span>
                    </div>
                    <div class="action-btn" onclick="openComments('${produto.titulo}')">
                        <i class='bx bxs-message-rounded-dots'></i>
                        <span class="comment-count">0</span>
                    </div>
                    <div class="action-btn whatsapp-btn" onclick="iniciarConversa('${produto.celular_vendedor}', '${produto.titulo}')" style="cursor: pointer;">
                        <i class='bx bxl-whatsapp'></i>
                        <span>Negociar</span>
                    </div>
                </div>
            `;

            // INSERE O NOVO CARD NO TOPO (ANTES DOS PRODUTOS PADRÃO)
            if (primeiroCardPadrao) {
                container.insertBefore(card, primeiroCardPadrao);
            } else {
                container.appendChild(card);
            }
        });

        // CASO HAJA ERRO NA BUSCA DOS DADOS
    } catch (error) {
        console.error("❌ Erro ao carregar do banco:", error);
        container.innerHTML = `<p style="color: red; text-align: center; padding: 20px;">⚠️ Erro ao carregar produtos. Servidor offline?</p>`;
    }
}

// CARREGA ANÚNCIOS QUANDO A PÁGINA INICIA
document.addEventListener('DOMContentLoaded', carregarAnunciosDoBanco);


// ==========================================
// Whatzapp - ABRIR CONVERSA COM VENDEDOR
// ==========================================

function iniciarConversa(celular, titulo) {
    // VALIDA SE O CELULAR FOI CAPTURADO
    if (!celular || celular === 'undefined' || celular === null) {
        alert('⚠️ Celular do vendedor não disponível.');
        return;
    }

    const numeroLimpo = celular.replace(/\D/g, '');

    // VALIDA SE O NÚMERO TEM PELO MENOS 10 DÍGITOS (VÁLIDO NO BRASIL)
    if (numeroLimpo.length < 10) {
        alert('⚠️ Número de celular inválido.');
        return;
    }

    const mensagem = encodeURIComponent(`Olá! Vi seu anúncio "${titulo}" no CatiraX e tenho interesse.`);
    const whatsappLink = `https://wa.me/55${numeroLimpo}?text=${mensagem}`;
    window.open(whatsappLink, '_blank');
}
