const DB_PATH = require('path').resolve(__dirname, '../../routes/db-config.js')

function graphsF (req, res) {
    const RelNum = req.params.RelNum; // Escolhe o relatório específico (1, 2, 3, etc)
    const db = require(DB_PATH).db(`Rel${RelNum}.db`);

    const viagem = req.params.viagem; // Escolhe uma viagem (1, 2, 3, etc).
    const id = req.params.id; // Diferencia entre CHOQUE 1 e 2
    const ocur = req.params.ocur; //Escolhe uma ocorrência (ACT, PEG_PSI, etc).
    console.log(ocur)

    console.log('id: ',id)
    console.log('ocur: ', ocur)


    if(id == 1){ // f_max
        var sql = `SELECT f_max,data_hora FROM CHOQUE INNER JOIN OCORRENCIA ON CHOQUE.ID_OC = OCORRENCIA.ID_OC WHERE tipo_choque = '${ocur}' AND tipo_vagao = "F" AND viagem = ${viagem}  ORDER BY OCORRENCIA.data_hora ASC`;
        db.all(sql, function(err,rows){
            if(err){
                throw err;
            }
            res.json(rows)
        })
    }
    if(id == 2) {// act
        var sql = `SELECT act,data_hora FROM CHOQUE INNER JOIN OCORRENCIA ON CHOQUE.ID_OC = OCORRENCIA.ID_OC WHERE tipo_choque = '${ocur}' AND tipo_vagao = "F"  AND viagem = ${viagem} ORDER BY OCORRENCIA.data_hora ASC`;
        db.all(sql, function(err,rows){
            if(err){
                throw err;
            }
            res.json(rows)
        })
    }

    if(id == '3') { // Peg_PSI
        var sql = `SELECT peg_psi,data_hora FROM CHOQUE INNER JOIN OCORRENCIA ON CHOQUE.ID_OC = OCORRENCIA.ID_OC WHERE tipo_choque = '${ocur}' AND tipo_vagao = "F" AND viagem = ${viagem}  ORDER BY OCORRENCIA.data_hora ASC`;
        console.log(sql)
        db.all(sql, function(err,rows){
            if(err){
                throw err;
            }
            res.json(rows)
        })
    }
    if(id == '4') { // vel
        sql = `SELECT vel,data_hora FROM CHOQUE INNER JOIN OCORRENCIA ON CHOQUE.ID_OC = OCORRENCIA.ID_OC WHERE tipo_choque = '${ocur}' AND tipo_vagao = "F" AND viagem = ${viagem} ORDER BY OCORRENCIA.data_hora ASC`;
        db.all(sql, function(err,rows){
            if(err){
                throw err;
            }
            res.json(rows)
        })
    }


    require(DB_PATH).db_close(db)
}

module.exports = graphsF;