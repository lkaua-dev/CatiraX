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