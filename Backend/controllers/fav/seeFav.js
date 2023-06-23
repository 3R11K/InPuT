// const { response } = require('express'); // Importa o express (desnecessário)

const DB_PATH = require('path').resolve(__dirname, '../../routes/db-config.js') // caminho para o banco de dados

// função para ver os favoritos
function seeFav (req, res) {
    const db = require(DB_PATH).db("userprefs.sqlite"); // importando banco de dados

    const id = req.user.id; // Seleciona o usuário logado

    // seleciona todos os favoritos de acordo com o user id
    db.all(`SELECT * FROM favs WHERE id_user = ${id}`, function(err, rows) {;
        if(err) {
            res.json({status: "error", text: "Erro interno do servidor"}) // erro interno do servidor
            throw err
        }

        console.log("Favoritos retornados.");

        res.json(rows) // sucesso
    })

    // fechando banco de dados
    require(DB_PATH).db_close(db)
}

module.exports = seeFav;