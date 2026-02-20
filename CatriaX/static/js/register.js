const nameInput = document.querySelector("#nomeCompleto");
const cpfInput = document.querySelector("#cpf");
const emailInput = document.querySelector("#email");
const senhaInput = document.getElementById('senha');
const confirmSenhaInput = document.getElementById('confirmSenha');
const form = document.querySelector("#formCadastro");
const btnSubmit = document.querySelector("#BotaoDeEnviar");

// 1. Máscara de CPF
cpfInput.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = v;
});

// 2. Função para o Balão de ERRO (Vermelho) - Atualizada para não empilhar
function mostrarErro(mensagem, inputsErro = []) {
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

    // Adiciona borda vermelha nos inputs que deram erro
    inputsErro.forEach(input => {
        if (input) {
            input.style.borderColor = '#ff4d4d';
            setTimeout(() => input.style.borderColor = '', 2000);
        }
    });
}

// 3. Função para o Balão de SUCESSO (Verde)
function mostrarSucesso(mensagem) {
    const toastAntigo = document.querySelector('.toast-erro, .toast-sucesso');
    if (toastAntigo) toastAntigo.remove();

    const toast = document.createElement("div");
    toast.className = "toast-sucesso";
    toast.innerHTML = `<span>🎉 ${mensagem}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("toast-saindo");
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// 4. Mostrar/Esconder Senha (Adaptado para o novo HTML)
function toggleSenha(id) {
    const input = document.getElementById(id);
    const span = input.nextElementSibling;
    if (input.type === 'password') {
        input.type = 'text';
        span.innerText = '🔒';
    } else {
        input.type = 'password';
        span.innerText = '👁️';
    }
}

// 5. Evento de Envio Conectado ao Python (Porta 5000)
form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const maiusculaRegex = /[A-Z]/;

    // --- Validações no Front-end ---
    if (!nameInput.value || !cpfInput.value || !emailInput.value || !senhaInput.value || !confirmSenhaInput.value) {
        mostrarErro("Preencha todos os campos!", [nameInput, cpfInput, emailInput, senhaInput, confirmSenhaInput].filter(i => !i.value));
        return;
    }

    // Valida CPF tamanho mínimo
    if (cpfInput.value.length < 14) {
        mostrarErro("Digite um CPF válido!", [cpfInput]);
        return;
    }

    if (!emailRegex.test(emailInput.value)) {
        mostrarErro("E-mail com formato inválido!", [emailInput]);
        return;
    }

    if (senhaInput.value.length < 8) {
        mostrarErro("A senha deve ter no mínimo 8 caracteres!", [senhaInput]);
        return;
    }

    if (!maiusculaRegex.test(senhaInput.value)) {
        mostrarErro("A senha precisa de uma letra maiúscula!", [senhaInput]);
        return;
    }

    if (senhaInput.value !== confirmSenhaInput.value) {
        mostrarErro("As senhas não coincidem!", [senhaInput, confirmSenhaInput]);
        return;
    }

    // --- Efeito de Carregamento no Botão ---
    const textoOriginal = btnSubmit.innerHTML;
    btnSubmit.innerHTML = "Cadastrando...";
    btnSubmit.style.opacity = "0.7";
    btnSubmit.style.cursor = "not-allowed";
    btnSubmit.disabled = true;

    // --- Envio para o Servidor Python ---
    const dados = {
        nome: nameInput.value,
        cpf: cpfInput.value,
        email: emailInput.value,
        senha: senhaInput.value
    };

    fetch('http://localhost:5000/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
        .then(async res => {
            const resultado = await res.json();

            if (!res.ok) {
                throw new Error(resultado.error || "Erro desconhecido no servidor");
            }

            return resultado;
        })
        .then(() => {
            mostrarSucesso("Cadastro realizado com sucesso!");
            form.reset();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        })
        .catch(erro => {
            console.error(erro);
            mostrarErro(erro.message || "Erro ao conectar com o servidor.");
        })
        .finally(() => {
            // Restaura o botão
            btnSubmit.innerHTML = textoOriginal;
            btnSubmit.style.opacity = "1";
            btnSubmit.style.cursor = "pointer";
            btnSubmit.disabled = false;
        });
});