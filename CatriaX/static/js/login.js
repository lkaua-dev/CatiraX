const emailInput = document.querySelector("#email");
const senhaInput = document.querySelector("#senha");
const form = document.querySelector("form");
const btnSubmit = document.querySelector("#btnSubmit");

// 1. Função para mostrar erro (Balão Vermelho)
function mostrarErro(mensagem) {
    // Remove toast anterior se existir para evitar empilhamento infinito
    const toastAntigo = document.querySelector('.toast-erro, .toast-sucesso');
    if (toastAntigo) toastAntigo.remove();

    const toast = document.createElement("div");
    toast.className = "toast-erro";
    toast.innerHTML = `<span>⚠️ ${mensagem}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("toast-saindo");
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// 2. Função para mostrar sucesso (Balão Verde)
function mostrarSucesso(mensagem) {
    const toastAntigo = document.querySelector('.toast-erro, .toast-sucesso');
    if (toastAntigo) toastAntigo.remove();

    const toast = document.createElement("div");
    toast.className = "toast-sucesso";
    toast.innerHTML = `<span>✅ ${mensagem}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("toast-saindo");
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// 3. O Evento de Login
form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const dados = {
        email: emailInput.value,
        senha: senhaInput.value
    };

    // Validação simples com animação de erro no input
    if (!dados.email || !dados.senha) {
        mostrarErro("Preencha e-mail e senha!");
        emailInput.style.borderColor = '#ff4d4d';
        senhaInput.style.borderColor = '#ff4d4d';
        setTimeout(() => {
            emailInput.style.borderColor = '';
            senhaInput.style.borderColor = '';
        }, 1500);
        return;
    }

    // Animação de carregamento no botão
    const btnOriginalText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = 'Entrando...';
    btnSubmit.style.opacity = '0.8';
    btnSubmit.style.cursor = 'not-allowed';

    // Envia para o Python (Porta 5000)
    fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
        .then(async res => {
            // Restaura o botão
            btnSubmit.innerHTML = btnOriginalText;
            btnSubmit.style.opacity = '1';
            btnSubmit.style.cursor = 'pointer';

            const resultado = await res.json();

            if (res.ok) {
                // SUCESSO!
                mostrarSucesso("Login realizado! Entrando...");

                // Salva o usuário no navegador
                localStorage.setItem("usuarioLogado", JSON.stringify(resultado.user));

                // Espera 1.5s e REDIRECIONA
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);

            } else {
                // ERRO (Senha errada ou usuário não existe)
                mostrarErro(resultado.error || "E-mail ou senha incorretos.");
            }
        })
        .catch(erro => {
            console.error(erro);
            // Restaura o botão
            btnSubmit.innerHTML = btnOriginalText;
            btnSubmit.style.opacity = '1';
            btnSubmit.style.cursor = 'pointer';
            mostrarErro("Erro ao conectar com o servidor.");
        });
});