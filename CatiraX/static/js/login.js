const emailInput = document.querySelector("#email");
const senhaInput = document.querySelector("#senha"); 
const form = document.querySelector("form");         

// 1. Função para mostrar erro (Balão Vermelho)
function mostrarErro(mensagem) {
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

    // Validação simples
    if (!dados.email || !dados.senha) {
        mostrarErro("Preencha e-mail e senha!");
        return;
    }

    // Envia para o Python (Porta 5000)
    fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
    .then(async res => {
        const resultado = await res.json();

        if (res.ok) {
            // SUCESSO!
            mostrarSucesso("Login realizado! Entrando...");
            
            // TRUQUE DE MESTRE: Salva o usuário no navegador para usar na próxima página
            localStorage.setItem("usuarioLogado", JSON.stringify(resultado.user));

            // Espera 1.5s para o usuário ver a mensagem e REDIRECIONA
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
        mostrarErro("Erro ao conectar com o servidor.");
    });
});
