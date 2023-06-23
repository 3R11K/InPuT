const DB_PATH = require('path').resolve(__dirname, '../../routes/db-config.js') // caminho para o banco de dados

// função para deletar relatorio dos favoritos
function deleteFav (req, res) {
    const db = require(DB_PATH).db("userprefs.sqlite"); // importando banco de dados

    const rel = req.params.id; // Seleciona o favorito desejado
    const id = req.user.id; // Seleciona o usuário logado

    // deleta fovoritos de acordo com o user id e com o numero do relatorio(por ennquanto temos apenas um usuario)
    db.all(`DELETE FROM favs WHERE rel_num = ${rel} AND id_user = ${id}`, function(err) {
        if(err) {
            res.json({status: "error", text: "Erro interno do servidor"}) // erro interno do servidor
            throw err
        }

        console.log("Favorito deletado.");
        res.json({status: "success", text: "Favorito deletado com sucesso!"}) // sucesso
    })

    // fechando banco de dados
    require(DB_PATH).db_close(db)
}

// exportando função
module.exports = deleteFav;