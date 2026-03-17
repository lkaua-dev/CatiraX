# ⛺ CatiraX

Projeto que combina HTML, CSS, JavaScript, Python e MySQL para criar uma plataforma de venda interativa. Ao rolar a página, em vez de vídeos, aparecem produtos à venda, permitindo que usuários entrem em contato para negociar ou comprar.

## 🚀 Tecnologias Utilizadas

- **Front-end:** HTML5, CSS3, JavaScript (Vanilla)
- **Back-end:** Python 3 (Flask)
- **Banco de Dados:** MySQL
- **E-mail Service:** Gmail SMTP (Via Flask-Mail).
- **Conexão:** MySQL Connector



## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado na sua máquina:
1. **Python 3.x** (certifique-se de marcar "Add Python to PATH" na instalação).
2. **MySQL Server** e **MySQL Workbench**.
3. **Git**.
4. **VS Code** (Editor recomendado).
5. **Conta Gmail** (Com "Senha de Aplicativo" gerada para envio de e-mails).

## 🧪 Ambiente Virtual (Recomendado)

Criar um ambiente virtual evita conflitos de dependências e mantém seu projeto isolado. Se você não fizer isso, vai acabar misturando biblioteca de tudo quanto é projeto e uma hora quebra.

### Criar o ambiente virtual
No terminal, dentro da pasta do projeto:
```bash
python -m venv venv
```
### Ativar o ambiente virtual
Windows:
```bash
venv\Scripts\activate
```
Linux/Mac:
```bash
source venv/bin/activate
```

Se ativou certo, vai aparecer (venv) no começo do terminal.
### Instalar as dependências dentro do ambiente
```bash
pip install -r requirements.txt
```
### Desativar o ambiente (quando quiser sair)
```bash
deactivate
````

## 🔧 Passo a Passo de Instalação

### 1. Clonar ou Baixar o Projeto
Abra o terminal na pasta onde deseja salvar o projeto:
```bash
git clone https://github.com/lkaua-dev/CatiraX.git
```
---
### 2. Configurar o Banco de Dados (MySQL)
Abra o MySQL Workbench, copie o código SQL abaixo e execute para criar o banco e a tabela:
```bash
-- 1. CRIAR A BASE DE DADOS
CREATE DATABASE IF NOT EXISTS RGA_princp 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE RGA_princp;

-- 2. TABELA DE UTILIZADORES (USUARIO)
CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    celular VARCHAR(20) NOT NULL,      
    cpf VARCHAR(14) NOT NULL UNIQUE, 
    email VARCHAR(150) NOT NULL UNIQUE, 
    senha VARCHAR(255) NOT NULL,     
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABELA DE IMAGENS / PRODUTOS (IMG)
CREATE TABLE IF NOT EXISTS img (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    valor DECIMAL(15, 2), -- Suporta valores até 99.999.999,99
    celular_vendedor VARCHAR(20),
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABELA DE FAVORITOS
CREATE TABLE IF NOT EXISTS favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    img_id INT NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (usuario_id, img_id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (img_id) REFERENCES img(id) ON DELETE CASCADE
); 

-- 5. TABELA DE COMENTÁRIOS
CREATE TABLE IF NOT EXISTS comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    img_id INT NOT NULL,
    mensagem VARCHAR(1500) NOT NULL, 
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (img_id) REFERENCES img(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ======================================================
-- CONSULTAS ÚTEIS PARA TESTES
-- ======================================================

-- Ver todos os produtos anunciados
SELECT * FROM img ORDER BY data_hora DESC;

-- Ver todos os utilizadores
SELECT * FROM usuario;
```
---
### 3. Instalar Dependências do Python
No terminal, dentro da pasta do projeto, instale as bibliotecas (incluindo o novo Flask-Mail):
```bash
pip install flask mysql-connector-python flask-cors Flask-Mail
```
---
### 4. Configurar Credenciais (Banco e E-mail) ⚠️
Abra o arquivo app.py e verifique a função de conexão. Se a sua senha do MySQL não for "root", altere a linha abaixo:
```bash
# Procure por esta parte e coloque sua senha do MySQL
password='root',  # <--- Sua senha do MySQL
```
### Para o Envio de E-mail (Gmail): Você precisa gerar uma "Senha de App" na sua conta Google.
```bash
# Procure por esta parte no início do arquivo
app.config['MAIL_USERNAME'] = 'seu.email@gmail.com' # <--- Seu email
app.config['MAIL_PASSWORD'] = 'sua senha de aplicativo aqui' # <--- Sua senha gerada

# procure por esta parte no final do arquivo
"Solicitação de Recuperação de Acesso - CATIRAX",
sender="seu.email@gmail.com", # <--- Seu email
```
---
### ▶️ Como Rodar o Projeto

1. Abra o terminal na pasta raiz do projeto CatiraX.

2. Inicie o servidor Python:
```Bash
cd CatiraX
python app.py
```
### 3. Você verá a mensagem: Running on http://127.0.0.1:5000.
---
<br>
<br>
<div align="center">

⚠️ **AVISO IMPORTANTE** ⚠️  
🚫 **ACESSO EXTERNO NÃO SUPORTADO EM REDES PRIVADAS** 🚫


</div>
</br>

---
