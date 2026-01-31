# ⛺ CatiraX

Projeto que combina HTML, CSS, JavaScript, Python e MySQL para criar uma plataforma de venda interativa. Ao rolar a página, em vez de vídeos, aparecem produtos à venda, permitindo que usuários entrem em contato para negociar ou comprar.

## 🚀 Tecnologias Utilizadas

- **Front-end:** HTML5, CSS3, JavaScript (Vanilla)
- **Back-end:** Python 3 (Flask)
- **Banco de Dados:** MySQL
- **Conexão:** MySQL Connector



## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado na sua máquina:
1. **Python 3.x** (certifique-se de marcar "Add Python to PATH" na instalação).
2. **MySQL Server** e **MySQL Workbench**.
3. **VS Code** (ou outro editor de código).



## 🔧 Passo a Passo de Instalação

### 1. Clonar ou Baixar o Projeto
Abra o terminal na pasta onde deseja salvar o projeto:
```bash
git clone [https://github.com/seu-usuario/catirax.git](https://github.com/seu-usuario/catirax.git)
cd CatiraX
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
    senha VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
---
### 3. Instalar Dependências do Python
Abra o terminal na pasta do projeto e execute o comando abaixo para instalar o Flask e o conector do MySQL:
```bash
pip install flask mysql-connector-python flask-cors
```
---
### 4. Configurar Credenciais
Abra o arquivo app.py e verifique a função de conexão. Se a sua senha do MySQL não for "root", altere a linha abaixo:
```bash
# No arquivo app.py
password='SUA_SENHA_AQUI',
```
---
### ▶️ Como Rodar o Projeto

1. Abra o terminal na pasta raiz do projeto CatiraX.

2. Inicie o servidor Python:
```Bash
python app.py
```
### 3. Você verá a mensagem: Running on http://127.0.0.1:5000.

