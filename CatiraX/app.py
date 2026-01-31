from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
import mysql.connector

app = Flask(__name__)
CORS(app)

# --- CONFIGURAÇÃO DO E-MAIL (GMAIL) ---
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 465
app.config["MAIL_USERNAME"] = "rga.solucoes0@gmail.com"  # 'seu.email@gmail.com'
app.config["MAIL_PASSWORD"] = "nxng sadf xcsl ahkz"  # 'sua senha de aplicativo aqui'
app.config["MAIL_USE_TLS"] = False
app.config["MAIL_USE_SSL"] = True

mail = Mail(app)


# --- CONFIGURAÇÃO DO BANCO DE DADOS ---
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="sistema_cadastro",
    )


# --- ROTA 1: CADASTRO ---
@app.route("/cadastrar", methods=["POST"])
def cadastrar():
    data = request.json
    nome = data.get("nome")
    cpf = data.get("cpf")
    email = data.get("email")
    senha = data.get("senha")

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        sql = "INSERT INTO usuarios (nome_completo, cpf, email, senha) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (nome, cpf, email, senha))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Usuário cadastrado com sucesso!"}), 201

    except mysql.connector.Error as err:
        print(f"Erro no MySQL: {err}")
        return jsonify({"error": str(err)}), 500


# --- ROTA 2: LOGIN ---
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    senha = data.get("senha")

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


# --- ROTA 3: RECUPERAR SENHA ---
@app.route("/recuperar-senha", methods=["POST"])
def recuperar_senha():
    data = request.json
    email_usuario = data.get("email")

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM usuarios WHERE email = %s", (email_usuario,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if not user:
            return jsonify({"message": "Se o e-mail existir, o link foi enviado."}), 200

        msg = Message(
            "Solicitação de Recuperação de Acesso - CATIRAX",
            sender="rga.solucoes0@gmail.com",  # 'seu.email@gmail.com'
            recipients=[email_usuario],
        )

        msg.body = f"""
        Prezado(a) {user['nome_completo']},

        Recebemos uma solicitação de recuperação de senha para a sua conta no sistema CATIRAX.

        Conforme solicitado, segue abaixo a credencial registrada em nosso banco de dados:
        
        ------------------------------------------------
        SENHA ATUAL: {user['senha']}
        ------------------------------------------------

        Recomendamos que realize o login e, por questões de segurança, altere sua senha caso julgue necessário.

        Atenciosamente,
        
        Equipe de Desenvolvimento CatiraX.

        ______________________________________________________________________
        ⚠️ AVISO LEGAL: Este e-mail faz parte de um projeto acadêmico. 
        Trata-se apenas de um teste de funcionalidade. Caso tenha recebido 
        esta mensagem por engano, por favor, desconsidere e exclua o e-mail.
        """

        mail.send(msg)

        return jsonify({"message": "E-mail enviado com sucesso!"}), 200

    except Exception as e:
        print(f"Erro no envio de e-mail: {e}")
        return jsonify({"error": "Erro ao enviar e-mail"}), 500


# --- INICIALIZAÇÃO OBRIGATÓRIA ---
if __name__ == "__main__":
    print("🚀 Servidor rodando! Acesse: http://localhost:5000")
    app.run(debug=True, port=5000)