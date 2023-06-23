const DB_PATH = require('path').resolve(__dirname, '../../routes/db-config.js')

async function comment_get(req, res) {
	const { rel_id } = req.body;

	const db = require(DB_PATH).db("userprefs.sqlite");

	db.all("SELECT * FROM comments WHERE rel_id = ?", [rel_id], (err, rows) => {
		if (err) {
			return res.status(500).json({status:"error", text:"Erro interno do servidor de database"});
		};

		if (!rows) {
			return res.status(400).json({status:"error", text:"Não há comentários"});
		};

		return res.json({status:"success", text:"Comentários retornados com sucesso", data:rows});
	});

	require(DB_PATH).db_close(db)
}

module.exports = comment_get;