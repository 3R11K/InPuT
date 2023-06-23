const DB_PATH = require('path').resolve(__dirname, '../../routes/db-config.js')
const jwt = require('jsonwebtoken');

function make_cookie_chan(req, res) {
	const db = require(DB_PATH).db("userprefs.sqlite");

	const token = req.cookies['remember-login'];
	const decoded = jwt.verify(req.cookies['remember-login'], process.env.JWT_SECRET)

	db.get("SELECT * FROM users WHERE id = ?", decoded.id, (err, row) => {
		if (err) {
			return res.status(500).json({status:"error", text:"Erro interno do servidor"}); // erro interno do servidor
		};

		// se o usuario nao existir, retorna erro
		if (!row) {
			return res.status(400).json({status:"error", text:"Nome de usuário ou senha incorretos"}); // erro de usuario ou senha incorretos
		};

		const user = row; // usuario logado

		// cria novo chan na tabela chan, inserindo user_type como user.username
		db.run("INSERT INTO chans (user_type) VALUES (?)", user.username, (err) => {
			if (err) {
				console.log(err)
				return res.status(500).json({status:"error", text:"Erro interno do servidor 1"}); // erro interno do servidor
			};

			// seleciona o chan criado
			db.get("SELECT * FROM chans WHERE user_type = ?", user.username, (err, row) => {
				if (err) {
					return res.status(500).json({status:"error", text:"Erro interno do servidor 2"}); // erro interno do servidor
				};

				// se o chan nao existir, retorna erro
				if (!row) {
					return res.status(400).json({status:"error", text:"Nome de usuário ou senha incorretos"}); // erro de usuario ou senha incorretos
				};

				const chan_id = row.chan_id; // id do chan criado

				const token = jwt.sign({id: chan_id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN}); // cria token

				// cria um cookie com o id do chan
				res.cookie('chan_id', token, {
					// maxage = 400 dias (capado em 400 dias)
					maxAge: 400 * 24 * 60 * 60 * 1000,
					httpOnly: true,
				});

				return res.status(200).json({status:"success", text:"Chan criado", chan_id:chan_id});
			});
		});
	});

	require(DB_PATH).db_close(db)
}

module.exports = make_cookie_chan;