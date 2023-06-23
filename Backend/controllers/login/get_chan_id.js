const DB_PATH = require('path').resolve(__dirname, '../../routes/db-config.js') // caminho para o banco de dados
const jwt = require('jsonwebtoken'); // importando jsonwebtoken

// funcao que retorna se o usuario esta logado ou nao
const get_chan_id = (req, res) => {
    // importando banco de dados
    const db = require(DB_PATH).db("userprefs.sqlite");

    // se o usuario nao estiver logado, continua
    if (req.cookies['chan_id'] == undefined) {
        return res.status(400).json({status:"error", text:"Nao tem chan_id"});
    } else {
        const token = req.cookies['chan_id']; // token do usuario

        const decoded = jwt.verify(token, process.env.JWT_SECRET) // decodificando token

        // seleciona o usuario de acordo com o id do token
        db.get("SELECT * FROM chans WHERE id = ?", decoded.id, (err, row) => {
            if (err) {
                return res.status(500).json({status:"error", text:"Erro interno do servidor"}); // erro interno do servidor
            };

            // se o usuario nao existir, retorna erro
            if (!row) {
                return res.status(400).json({status:"error", text:"Chan nao existe"});
            };

            req.chan_id = row.chan_id;
            return res.status(200).json({status:"success", text:"CHAN", chan_id:row.chan_id});
        });
    }

    // fechando banco de dados
    require(DB_PATH).db_close(db)
}

// exportando funcao
module.exports = get_chan_id;