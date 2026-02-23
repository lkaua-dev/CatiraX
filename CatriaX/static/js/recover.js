const form = document.querySelector("#formRecover");
const emailInput = document.querySelector("#email");
const btn = document.querySelector(".btn-auth");

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
// LÓGICA DE ENVIO DE RECUPERAÇÃO
// ==========================================
form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    // VALIDAÇÃO DO CAMPO EMAIL VAZIO
    if (!emailInput.value) {
        mostrarErro("Por favor, digite seu e-mail.");
        emailInput.style.borderColor = '#ff4d4d';
        setTimeout(() => {
            emailInput.style.borderColor = '';
        }, 1500);
        return;
    }

    // DESABILITA BOTÃO ENQUANTO PROCESSA
    const textoOriginal = btn.innerText;
    btn.innerText = "Enviando...";
    btn.disabled = true;
    btn.style.opacity = "0.7";
    btn.style.cursor = "not-allowed";

    // ENVIA EMAIL PARA O SERVIDOR PYTHON
    fetch('http://localhost:5000/recuperar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.value })
    })
        // TRATA RESPOSTA DO SERVIDOR
        .then(async res => {
            const resultado = await res.json();

            // SE ENVIOU COM SUCESSO
            if (res.ok) {
                mostrarSucesso("E-mail enviado! Verifique sua caixa de entrada.");
                form.reset();
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 3000);
            } else {
                // SE TEVE ERRO NA RESPOSTA DO SERVIDOR
                mostrarErro(resultado.error || "Erro ao tentar enviar.");
            }
        })
        // TRATA ERRO DE CONEXÃO
        .catch(erro => {
            console.error(erro);
            mostrarErro("Erro de conexão com o servidor.");
        })
        // RESTAURA O BOTÃO APÓS PROCESSAR
        .finally(() => {
            btn.innerText = textoOriginal;
            btn.disabled = false;
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
        });
});
