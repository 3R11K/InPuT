const DB_PATH = require('path').resolve(__dirname, '../../routes/db-config.js') // caminho para o banco de dados

// função para adicionar relatorio aos favoritos
function addFav (req, res) {
    // importando banco de dados
    const db = require(DB_PATH).db("userprefs.sqlite");
    console.log(req)

    // pegando numero do relatorio e id do usuario
    const rel_num = req.params.rel
    const id = req.user.id


    // chear se numero de relatorio ja foi favoritado
    db.all(`SELECT * FROM favs WHERE rel_num = ${rel_num} AND id_user = ${id}`, function(err, rows) {
        // erro interno do servidor
        if(err) {
            res.json({status: "error", text: "Erro interno do servidor"})
            throw err
        }
        // se ja foi favoritado
        if(rows.length > 0) {
            res.json({status: "error", text: "Esse relatório já está nos seus favoritos"})
            return
        } else {  //inserindo novo favorito
            db.all("INSERT INTO favs(id_user, rel_num) VALUES(?, ?)", id, rel_num, function(err) {
                if(err){ // erro interno do servidor
                    res.json({status: "error", text: "Erro interno do servidor"})
                    throw err
                }
                console.log("Add completed")
                res.json({status: "success", text: "Favorito adicionado com sucesso!"}) // sucesso
            })
        }

    })

    // fechando banco de dados
    require(DB_PATH).db_close(db)
}

// exportando função
module.exports = addFav;