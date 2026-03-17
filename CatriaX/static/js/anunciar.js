/**
 * Lógica da Página de Anúncios - CatiraX
 */

const fotoInput = document.getElementById('foto');
const preview = document.getElementById('preview');
const previewContainer = document.getElementById('previewContainer');
const dropZone = document.getElementById('dropZone');
const valorInput = document.getElementById('valor');
const formAnuncio = document.getElementById('formAnuncio');

// ==========================================
// FUNÇÃO DO BALÃO (TOAST)
// ==========================================
function mostrarToast(mensagem, tipo = 'sucesso') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;

    const icon = tipo === 'sucesso' ? 'bx-check-circle' : 'bx-error-circle';
    toast.innerHTML = `<i class='bx ${icon}' style='font-size: 20px;'></i> <span>${mensagem}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 400);
    }, 7000);
}

// ==========================================
// MÁSCARA DE MOEDA
// ==========================================

// FORMATA VALOR EM REAIS ENQUANTO USUÁRIO DIGITA
valorInput.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, "");

    if (value === "") {
        e.target.value = "";
        return;
    }

    if (value.length > 9) {
        value = value.slice(0, 9);
    }

    value = (value / 100).toFixed(2) + '';
    value = value.replace(".", ",");
    value = value.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
    value = value.replace(/(\d)(\d{3}),/g, "$1.$2,");

    e.target.value = "R$ " + value;
});

// ==========================================
// PREVIEW DA IMAGEM
// ==========================================

// CARREGA IMAGEM SELECIONADA E MOSTRA PREVIEW
fotoInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        // CONVERTE ARQUIVO PARA URL DATA PARA EXIBIÇÃO
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            previewContainer.style.display = 'block';
            dropZone.style.display = 'none';
            dropZone.classList.remove('campo-invalido');
        };
        reader.readAsDataURL(file);
    }
});

// REMOVE IMAGEM SELECIONADA E VOLTA PARA DROP ZONE
document.getElementById('removeImg').onclick = () => {
    fotoInput.value = "";
    previewContainer.style.display = 'none';
    dropZone.style.display = 'block';
};

// ==========================================
// VALIDAÇÃO E ENVIO DE ANÚNCIO
// ==========================================
formAnuncio.addEventListener('submit', async (e) => {
    e.preventDefault();

    const titulo = document.getElementById('titulo');
    const valor = document.getElementById('valor');
    const erroCampos = [];

    // REMOVE BORDAS VERMELHAS ANTERIORES
    [titulo, valor, dropZone].forEach(el => el.classList.remove('campo-invalido'));

    // VERIFICA CAMPOS OBRIGATÓRIOS
    if (!fotoInput.files[0]) erroCampos.push(dropZone);
    if (!titulo.value.trim()) erroCampos.push(titulo);
    if (!valor.value.trim() || valor.value === "R$ 0,00") erroCampos.push(valor);

    // MARCA CAMPOS COM ERRO EM VERMELHO
    if (erroCampos.length > 0) {
        erroCampos.forEach(campo => campo.classList.add('campo-invalido'));
        mostrarToast("Preencha todos os campos obrigatórios!", "erro");
        return;
    }

    // DESABILITA BOTÃO ENQUANTO PROCESSA
    const btn = document.getElementById('btnEnviar');
    btn.innerText = "Publicando...";
    btn.disabled = true;

    // FORMATA VALOR PARA O BANCO DE DADOS
    let valorLimpo = valor.value.replace(/[^\d,]/g, '').replace(',', '.');

    // CRIA FORMDATA COM A IMAGEM E DADOS DO ANÚNCIO
    const formData = new FormData();
    formData.append('foto', fotoInput.files[0]);
    formData.append('titulo', titulo.value);
    formData.append('valor', valorLimpo);
    formData.append('descricao', document.getElementById('descricao').value);

    // ADICIONA CELULAR DO VENDEDOR LOGADO
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (usuarioLogado && usuarioLogado.celular) {
        formData.append('celular_vendedor', usuarioLogado.celular);
    }

    // ENVIA ANÚNCIO PARA O SERVIDOR PYTHON
    try {
        const response = await fetch('http://localhost:5000/anunciar', {
            method: 'POST',
            body: formData
        });

        // SE PUBLICOU COM SUCESSO
        if (response.ok) {
            mostrarToast("✨ Anúncio publicado com sucesso!");

            setTimeout(() => {
                // RECARREGA A PÁGINA DO FEED PARA MOSTRAR O NOVO ANÚNCIO
                window.location.href = 'index.html?reload=' + Date.now();
            }, 3000);
        } else {
            // SE TEVE ERRO NA RESPOSTA DO SERVIDOR
            const erroData = await response.json();
            mostrarToast("Erro do servidor: " + erroData.error, "erro");
            btn.disabled = false;
            btn.innerText = "Publicar Agora";
        }
    } catch (err) {
        // SE TEVE ERRO DE CONEXÃO
        mostrarToast("Servidor offline. Verifique o terminal.", "erro");
        btn.disabled = false;
        btn.innerText = "Publicar Agora";
    }
});