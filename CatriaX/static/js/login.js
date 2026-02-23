const emailInput = document.querySelector("#email");
const senhaInput = document.querySelector("#senha");
const form = document.querySelector("form");
const btnSubmit = document.querySelector("#btnSubmit");

// ==========================================
// FUNÇÃO PARA MOSTRAR ERRO (BALÃO VERMELHO)
// ==========================================
function mostrarErro(mensagem) {
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

// ==========================================
// FUNÇÃO PARA MOSTRAR SUCESSO (BALÃO VERDE)
// ==========================================
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

// ==========================================
// EVENTO DE LOGIN E AUTENTICAÇÃO
// ==========================================
form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    // COLETA OS DADOS DO FORMULÁRIO
    const dados = {
        email: emailInput.value,
        senha: senhaInput.value
    };

    // VALIDAÇÃO: VERIFICA SE EMAIL E SENHA ESTÃO PREENCHIDOS
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

    // DESABILITA BOTÃO ENQUANTO PROCESSA
    const btnOriginalText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = 'Entrando...';
    btnSubmit.style.opacity = '0.8';
    btnSubmit.style.cursor = 'not-allowed';

    // ENVIA LOGIN PARA O SERVIDOR PYTHON
    fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
        // TRATA RESPOSTA DO SERVIDOR
        .then(async res => {
            btnSubmit.innerHTML = btnOriginalText;
            btnSubmit.style.opacity = '1';
            btnSubmit.style.cursor = 'pointer';

            const resultado = await res.json();

            // SE AUTENTICOU COM SUCESSO
            if (res.ok) {
                mostrarSucesso("Login realizado! Entrando...");
                localStorage.setItem("usuarioLogado", JSON.stringify(resultado.user));
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);

            } else {
                // SE TEVE ERRO (EMAIL/SENHA INCORRETOS)
                mostrarErro(resultado.error || "E-mail ou senha incorretos.");
            }
        })
        // TRATA ERRO DE CONEXÃO
        .catch(erro => {
            console.error(erro);
            btnSubmit.innerHTML = btnOriginalText;
            btnSubmit.style.opacity = '1';
            btnSubmit.style.cursor = 'pointer';
            mostrarErro("Erro ao conectar com o servidor.");
        });
});