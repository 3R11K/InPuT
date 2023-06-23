const DB_PATH = require('path').resolve(__dirname, '../../routes/db-config.js')

function comment_update(req, res) {
	console.log("UPDATING COMMENT")

	const { comment_id, content } = req.body;

	const db = require(DB_PATH).db("userprefs.sqlite");

	db.all("UPDATE comments SET content = ? WHERE comment_id = ?", [content, comment_id], (err, row) => {
		if (err) {
			return res.status(500).json({status:"error", text:"Erro interno do servidor de database"});
		};

		console.log("UPDATED COMMENT WITH ID " + comment_id)
		return res.status(200).json({status:"success", text:"Comentário atualizado com sucesso"});
	});

	require(DB_PATH).db_close(db)
}

module.exports = comment_update;