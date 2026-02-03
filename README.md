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
CREATE DATABASE IF NOT EXISTS sistema_cadastro;
USE sistema_cadastro;


CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE, 
    email VARCHAR(150) NOT NULL UNIQUE, 
    senha VARCHAR(24) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

USE sistema_cadastro;
SELECT * FROM usuarios;

-- Deletar apenas um id
DELETE FROM usuarios WHERE id = ' ';

-- Deletar a tabela completa
TRUNCATE TABLE usuarios;
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

⚠️ **AVISO IMPORTANTE**  
🚫 **ACESSO EXTERNO NÃO SUPORTADO EM REDES PRIVADAS** 🚫


</div>
</br>

---
