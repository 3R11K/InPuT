const DB_PATH = require('path').resolve(__dirname, '../../routes/db-config.js')

function comment_delete(req, res) {
	const { comment_id } = req.body;

	const db = require(DB_PATH).db("userprefs.sqlite");

	db.all("DELETE FROM comments WHERE comment_id = ?", [comment_id], (err, row) => {
		if (err) {
			return res.status(500).json({status:"error", text:"Erro interno do servidor de database"});
		};

		return res.status(200).json({status:"success", text:"Comentário deletado com sucesso"});
	});

	require(DB_PATH).db_close(db)
}

module.exports = comment_delete;