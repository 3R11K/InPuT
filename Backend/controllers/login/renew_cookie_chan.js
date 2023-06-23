const DB_PATH = require('path').resolve(__dirname, '../../routes/db-config.js')
const jwt = require('jsonwebtoken');

function renew_cookie_chan(req, res) {
	// gets req.cookies['chan_id'] and renews it
	const db = require(DB_PATH).db("userprefs.sqlite");

	const token = req.cookies['chan_id'];
	const decoded = jwt.verify(req.cookies['chan_id'], process.env.JWT_SECRET)

	db.get("SELECT * FROM chans WHERE chan_id = ?", decoded.id, (err, row) => {
		if (err) {
			return res.status(500).json({status:"error", text:"Erro interno do servidor"}); // erro interno do servidor
		};

		// se o chan nao existir, retorna erro
		if (!row) {
			return res.status(400).json({status:"error", text:"Nome de usuário ou senha incorretos"}); // erro de usuario ou senha incorretos
		};

		const chan = row; // usuario logado

		const token = jwt.sign({ id: chan.chan_id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }); // token do usuario

		// cria um cookie com o id do chan
		res.cookie('chan_id', token, {
			// maxage = 400 dias (capado em 400 dias)
			maxAge: 400 * 24 * 60 * 60 * 1000,
			httpOnly: true,
		});

		return res.status(200).json({ status: "success", text: "Chan renovado", chan_id: chan.chan_id });
	});
}

module.exports = renew_cookie_chan;