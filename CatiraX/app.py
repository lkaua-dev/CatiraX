from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)  

# Configuração do Banco de Dados
def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='root',      
        database='sistema_cadastro' 
    )

# Rota de Cadastro
@app.route('/cadastrar', methods=['POST'])
def cadastrar():
    data = request.json
    nome = data.get('nome')
    cpf = data.get('cpf')
    email = data.get('email')
    senha = data.get('senha')

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Comando SQL
        sql = "INSERT INTO usuarios (nome_completo, cpf, email, senha) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (nome, cpf, email, senha))
        
        conn.commit() 
        cursor.close()
        conn.close()
        
        return jsonify({"message": "Usuário cadastrado com sucesso!"}), 201
        
    except mysql.connector.Error as err:
        print(f"Erro no MySQL: {err}") 
        return jsonify({"error": str(err)}), 500

# Rota de Login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    senha = data.get('senha')

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True) 
        
        sql = "SELECT * FROM usuarios WHERE email = %s AND senha = %s"
        cursor.execute(sql, (email, senha))
        user = cursor.fetchone()
        
        cursor.close()
        conn.close()

        if user:
            return jsonify({"message": "Login realizado!", "user": user}), 200
        else:
            return jsonify({"error": "Email ou senha incorretos"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Roda o servidor na porta 5000
if __name__ == '__main__':
    app.run(debug=True, port=5000)