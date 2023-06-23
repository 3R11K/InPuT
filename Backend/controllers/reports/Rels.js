const DB_PATH = require('path').resolve(__dirname, '../../routes/db-config.js');

// funcao que pega a quantidade de relatorios
function quantity(req,res){
    const db = require(DB_PATH).db("Rels.db");

    var sql = "SELECT * FROM Relatorios"

    db.all(sql, (err,rows)=>{
        if(err){
            throw err
        }
        if(rows){
            res.json(rows)
        console.log(rows)


}})
}

module.exports = quantity //função para usar em qualquer outro script = module.exports = função