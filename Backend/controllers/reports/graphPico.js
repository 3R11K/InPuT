const DB_PATH = require('path').resolve(__dirname, '../../routes/db-config.js')

function graphPico (req,res) {
    const RelNum = req.params.RelNum; // Escolhe o relatório específico (1, 2, 3, etc)
    const db = require(DB_PATH).db(`Rel${RelNum}.db`);

    const vagao = req.params.vagao; // Diferencia o E do F.
    const ocur = req.params.ocur; //Escolhe a ocorrência específica (ACT, PEG_PSI, etc)
    const viagem = req.params.viagem; // Escolhe uma viagem (1, 2, 3, etc).]

    if(ocur == 2) {// act
        var sql = `SELECT act,data_hora FROM PICO INNER JOIN OCORRENCIA ON PICO.ID_OC = OCORRENCIA.ID_OC WHERE tipo_vagao = "${vagao}"  AND viagem = ${viagem} ORDER BY OCORRENCIA.data_hora ASC`;
        db.all(sql, function(err,rows){
            if(err){
                throw err;
            }
            res.json(rows)
        })
    }

    if(ocur == '3') { // Peg_PSI
        var sql = `SELECT peg_psi,data_hora FROM PICO INNER JOIN OCORRENCIA ON PICO.ID_OC = OCORRENCIA.ID_OC WHERE tipo_vagao = "${vagao}" AND viagem = ${viagem}  ORDER BY OCORRENCIA.data_hora ASC`;
        console.log(sql)
        db.all(sql, function(err,rows){
            if(err){
                throw err;
            }
            res.json(rows)
        })
    }
    if(ocur == '4') { // vel
        sql = `SELECT vel,data_hora FROM PICO INNER JOIN OCORRENCIA ON PICO.ID_OC = OCORRENCIA.ID_OC WHERE tipo_vagao = "${vagao}" AND viagem = ${viagem} ORDER BY OCORRENCIA.data_hora ASC`;
        db.all(sql, function(err,rows){
            if(err){
                throw err;
            }
            res.json(rows)
        })
    }

    if(ocur == 5){ //engate
        var sql = `SELECT engate,data_hora FROM PICO INNER JOIN OCORRENCIA ON PICO.ID_OC = OCORRENCIA.ID_OC WHERE tipo_vagao = "${vagao}" AND viagem = ${viagem}  ORDER BY OCORRENCIA.data_hora ASC`;
        db.all(sql, function(err,rows){
            if(err){
                throw err;
            }
            res.json(rows)
        })
    }        

    if(ocur == 6) {// DELTA_T
        var sql = `SELECT delta_t,data_hora FROM PICO INNER JOIN OCORRENCIA ON PICO.ID_OC = OCORRENCIA.ID_OC WHERE tipo_vagao = "${vagao}"  AND viagem = ${viagem} ORDER BY OCORRENCIA.data_hora ASC`;
        db.all(sql, function(err,rows){
            if(err){
                throw err;
            }
            res.json(rows)
        })
    }
    require(DB_PATH).db_close(db)
}

module.exports = graphPico