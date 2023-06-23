// Requisitando o banco de dados
const DB_PATH = require('path').resolve(__dirname, '../../routes/db-config.js')

//Função que pega todos os pontos de ocorrências (para fazer o caminho no mapa).
function path (req,res){
    const RelNum = req.params.RelNum; // Escolhe o relatório específico (1, 2, 3, etc)
    const db = require(DB_PATH).db(`Rel${RelNum}.db`);

    var sql = "SELECT lat,lon FROM OCORRENCIA WHERE viagem = 1 ORDER BY data_hora";
    
    db.all(sql, function(err,rows){
        if(err){
            throw err;
        }
        res.json(rows)
    })
}

//Torna a função utilizável em todo o código.
module.exports = path