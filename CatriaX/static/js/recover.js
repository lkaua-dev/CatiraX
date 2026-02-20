const form = document.querySelector("#formRecover");
const emailInput = document.querySelector("#email");
const btn = document.querySelector(".btn-auth");

// --- Funções de Balão (Atualizadas para evitar acumular várias mensagens) ---
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

// --- Lógica de Envio ---
form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (!emailInput.value) {
        mostrarErro("Por favor, digite seu e-mail.");

        // Efeito visual de erro no input igual ao da tela de login
        emailInput.style.borderColor = '#ff4d4d';
        setTimeout(() => {
            emailInput.style.borderColor = '';
        }, 1500);
        return;
    }

    // 1. Muda o botão para "Enviando..."
    const textoOriginal = btn.innerText;
    btn.innerText = "Enviando...";
    btn.disabled = true;
    btn.style.opacity = "0.7";
    btn.style.cursor = "not-allowed"; // Mouse mostra que não pode clicar

    // 2. Envia para o Python
    fetch('http://localhost:5000/recuperar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.value })
    })
        .then(async res => {
            const resultado = await res.json();

            if (res.ok) {
                mostrarSucesso("E-mail enviado! Verifique sua caixa de entrada.");
                form.reset();
                // Redireciona após 3 segundos
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 3000);
            } else {
                mostrarErro(resultado.error || "Erro ao tentar enviar.");
            }
        })
        .catch(erro => {
            console.error(erro);
            mostrarErro("Erro de conexão com o servidor.");
        })
        .finally(() => {
            // 3. Restaura o botão
            btn.innerText = textoOriginal;
            btn.disabled = false;
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
        });
});
