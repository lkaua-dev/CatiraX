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

// 3. Efeito Visual de Curtir (Só visual por enquanto)
function toggleLike(elemento) {
    const icone = elemento.querySelector("i");
    const contador = elemento.querySelector("span");
    
    // Se já estiver vermelho (curtido)
    if (icone.style.color === "red") {
        icone.style.color = "white";

    } else {
        icone.style.color = "red";
        icone.style.transform = "scale(1.2)";
        setTimeout(() => icone.style.transform = "scale(1)", 200);
    }
}