const name = document.querySelector("#nomeCompleto");
const cpf = document.querySelector("#cpf");
const email = document.querySelector("#email");
const senha = document.getElementById('senha');
const confirmSenha = document.getElementById('confirmSenha');
const form = document.querySelector("#formCadastro");

// 1. Máscara de CPF
cpf.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = v;
});

// 2. Função para o Balão de ERRO (Vermelho)
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

// 3. Função para o Balão de SUCESSO (Verde)
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

// 4. Mostrar/Esconder Senha
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
    if (!name.value || !cpf.value || !email.value || !senha.value || !confirmSenha.value) {
        mostrarErro("Preencha todos os campos!");
        return;
    }

    if (!emailRegex.test(email.value)) {
        mostrarErro("E-mail com formato inválido!");
        return;
    }

    if (senha.value.length < 8) {
        mostrarErro("A senha deve ter no mínimo 8 caracteres!");
        return;
    }

    if (!maiusculaRegex.test(senha.value)) {
        mostrarErro("A senha precisa de uma letra maiúscula!");
        return;
    }

    if (senha.value !== confirmSenha.value) {
        mostrarErro("As senhas não são iguais!");
        return;
    }

    // --- Envio para o Servidor Python ---
    
    // Prepara os dados
    const dados = {
        nome: name.value,
        cpf: cpf.value,
        email: email.value,
        senha: senha.value
    };

    // Envia para o Flask na porta 5000
    fetch('http://localhost:5000/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
    .then(async res => {
        const resultado = await res.json();
        
        // Se o servidor retornar erro (ex: 500 ou 400)
        if (!res.ok) {
            throw new Error(resultado.error || "Erro desconhecido no servidor");
        }
        
        return resultado;
    })
    .then(() => {
        // Sucesso real (Salvo no Banco)
        mostrarSucesso("Cadastro salvo com sucesso! 🎉");
        form.reset();
        
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);
    })
    .catch(erro => {
        console.error(erro);
        // Mostra o erro real que veio do Python (ex: "Duplicate entry")
        mostrarErro(erro.message || "Erro ao conectar com o servidor.");
    });
});