const nameInput = document.querySelector("#nomeCompleto");
const cpfInput = document.querySelector("#cpf");
const telefoneInput = document.querySelector("#telefone");
const emailInput = document.querySelector("#email");
const senhaInput = document.getElementById('senha');
const confirmSenhaInput = document.getElementById('confirmSenha');
const form = document.querySelector("#formCadastro");
const btnSubmit = document.querySelector("#BotaoDeEnviar");

// ==========================================
// MÁSCARA DE CPF
// ==========================================
cpfInput.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = v;
});

// ==========================================
// MÁSCARA DE TELEFONE
// ==========================================
telefoneInput.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
    }
    if (v.length > 9) {
        v = v.replace(/(\d{5})(\d)/, '$1-$2');
    } else if (v.length > 8) {
        v = v.replace(/(\d{4})(\d)/, '$1-$2'); 
    }
    e.target.value = v;
});

// ==========================================
// FUNÇÃO PARA MOSTRAR ERRO (BALÃO VERMELHO)
// ==========================================
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

    inputsErro.forEach(input => {
        if(input) {
            input.style.borderColor = '#ff4d4d';
            setTimeout(() => input.style.borderColor = '', 2000);
        }
    });
}

// ==========================================
// FUNÇÃO PARA MOSTRAR SUCESSO (BALÃO VERDE)
// ==========================================
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

// ==========================================
// MOSTRAR/ESCONDER SENHA
// ==========================================
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

// ==========================================
// EVENTO DE ENVIO CONECTADO AO PYTHON
// ==========================================
form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const maiusculaRegex = /[A-Z]/;

    // VERIFICA SE TODOS OS CAMPOS ESTÃO PREENCHIDOS
    if (!nameInput.value || !cpfInput.value || !telefoneInput.value || !emailInput.value || !senhaInput.value || !confirmSenhaInput.value) {
        mostrarErro("Preencha todos os campos!", [nameInput, cpfInput, telefoneInput, emailInput, senhaInput, confirmSenhaInput].filter(i => !i.value));
        return;
    }

    // VALIDA CPF
    if (cpfInput.value.length < 14) {
        mostrarErro("Digite um CPF válido!", [cpfInput]);
        return;
    }

    // VALIDA TELEFONE
    if (telefoneInput.value.length < 14) {
        mostrarErro("Digite um telefone válido!", [telefoneInput]);
        return;
    }

    // VALIDA EMAIL
    if (!emailRegex.test(emailInput.value)) {
        mostrarErro("E-mail com formato inválido!", [emailInput]);
        return;
    }

    // VALIDA COMPRIMENTO DA SENHA
    if (senhaInput.value.length < 8) {
        mostrarErro("A senha deve ter no mínimo 8 caracteres!", [senhaInput]);
        return;
    }

    // VALIDA SE SENHA TEM MAIÚSCULA
    if (!maiusculaRegex.test(senhaInput.value)) {
        mostrarErro("A senha precisa de uma letra maiúscula!", [senhaInput]);
        return;
    }

    // VALIDA SE AS SENHAS CONFEREM
    if (senhaInput.value !== confirmSenhaInput.value) {
        mostrarErro("As senhas não coincidem!", [senhaInput, confirmSenhaInput]);
        return;
    }

    // DESABILITA BOTÃO ENQUANTO PROCESSA
    const textoOriginal = btnSubmit.innerHTML;
    btnSubmit.innerHTML = "Cadastrando...";
    btnSubmit.style.opacity = "0.7";
    btnSubmit.style.cursor = "not-allowed";
    btnSubmit.disabled = true;

    // AGRUPA DADOS DO FORMULÁRIO
    const dados = {
        nome: nameInput.value,
        cpf: cpfInput.value,
        telefone: telefoneInput.value,
        email: emailInput.value,
        senha: senhaInput.value
    };

    // ENVIA CADASTRO PARA O SERVIDOR PYTHON
    fetch('http://localhost:5000/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
    // TRATA RESPOSTA DO SERVIDOR
    .then(async res => {
        const resultado = await res.json();
        
        if (!res.ok) {
            throw new Error(resultado.error || "Erro desconhecido no servidor");
        }
        
        return resultado;
    })
    // SE CADASTROU COM SUCESSO
    .then(() => {
        mostrarSucesso("Cadastro realizado com sucesso!");
        form.reset();
        
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);
    })
    // TRATA ERRO
    .catch(erro => {
        console.error(erro);
        mostrarErro(erro.message || "Erro ao conectar com o servidor.");
    })
    .finally(() => {
        btnSubmit.innerHTML = textoOriginal;
        btnSubmit.style.opacity = "1";
        btnSubmit.style.cursor = "pointer";
        btnSubmit.disabled = false;
    });
});