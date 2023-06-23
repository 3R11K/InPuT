const bcrypt = require('bcrypt'); // Isso carrega o módulo bcrypt
const jwt = require('jsonwebtoken'); // Isso carrega o módulo jsonwebtoken
const DB_PATH = require('path').resolve(__dirname, '../../routes/db-config.js')

require('dotenv').config(); // Isso carrega o arquivo .env

const login = (req, res) => {
    const db = require(DB_PATH).db("userprefs.sqlite");

    // Isso pega os dados do formulário de login
    const { username, password, remember } = req.body;

    // Isso verifica se todos os campos foram preenchidos
    if (!username || !password) {
        return res.status(400).json({status:"error", text:"Por favor preencha todos os campos"});
    }

    // Isso seleciona o usuário de acordo com o nome de usuário
    db.get("SELECT * FROM users WHERE username = ?", username, (err, row) => {
        if (err) {
            return res.status(500).json({status:"error", text:"Erro interno do servidor de database"});
        };

        // Isso verifica se o usuário existe
        if (!row) {
            return res.status(400).json({status:"error", text:"Nome de usuário ou senha incorretos"});
        };

        // Isso verifica se a senha está correta
        bcrypt.compare(password, row.password, (err, result) => {
            if (err) {
                return res.status(500).json({status:"error", text:"Erro interno do servidor de bcrypt"});
            };

            // Isso verifica se a senha está correta
            if (!result) {
                return res.status(400).json({status:"error", text:"Nome de usuário ou senha incorretos"});
            };


            var expiryDate = new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000);

            // Isso verifica se o usuário quer que o login seja lembrado (DESATIVADO)
            if (true) { // if (remember) {
                // Isso cria um token JWT
                const token = jwt.sign({id: row.id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});

                // Isso cria um cookie com o token
                res.cookie('remember-login', token, {
                    httpOnly: true,
                    expiresIn: expiryDate
                });
                console.log("cookie created")
            };

            console.log("Login efetuado com sucesso")
            return res.json({status:"success", text:"Login efetuado com sucesso"}); // sucesso
        });
    });

    // fechando banco de dados
    require(DB_PATH).db_close(db)
}

// exportando funcao
module.exports = login;