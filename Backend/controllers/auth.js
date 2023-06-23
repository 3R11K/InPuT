const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const quantity = require('./reports/Rels')
// const bodyParser = require('body-parser')
// const urlencoderParser = express.urlencoded({extended: false});

// const db = require('../routes/db-config');

///////////////////////
// PARTE DE DOWNLOAD//
//////////////////////

const download = require('./down_up/download')

///////////////////////
//  PARTE DE UPLOAD //
//////////////////////

const handleUpload = require('./down_up/handleUpload')

/////////////////////
// PARTE DE LOGIN //
////////////////////

const login = require('./login/login');
const logout = require('./login/logout');
const get_user = require('./login/get_user');
const get_chan_id = require('./login/get_chan_id');
const make_cookie_chan = require('./login/make_cookie_chan');
const renew_cookie_chan = require('./login/renew_cookie_chan');

router.post("/login", login)
router.get("/logout", logout)
router.get("/get_user", get_user)
router.get("/get_chan_id", get_chan_id)

router.get("/chan_manager", (req, res) => {
	if (req.cookies['chan_id']) {
		console.log("Renewing cookie chan")
		renew_cookie_chan(req, res)
		console.log("Cookie chan renewed")
	} else {
		console.log("Making cookie chan")
		make_cookie_chan(req, res)
		console.log("Cookie chan made")
	}
})


//////////////////////////
// PARTE DE RELATÓRIOS //
/////////////////////////

const graphPico = require('./reports/graphPico');

const graphsE = require('./reports/graphsE');
const graphsF = require('./reports/graphsF');

const mapE = require('./reports/mapE');
const mapF = require('./reports/mapF');
const path = require('./reports/path');


router.get('/graphsPico/:viagem/:vagao/:ocur/:RelNum', graphPico); // Página das informações sobre o pico, podendo ser em relação à tabela E (com o ID 1), e à tabela F(com o ID 2).

router.get('/graphsE/:viagem/:ocur/:id/:RelNum', graphsE); // Pega e mostra dados específicos da Tabela E

router.get('/graphsF/:viagem/:ocur/:id/:RelNum', graphsF); // Pega e mostra dados específicos da Tabela F

router.get('/mapE/:viagem/:id/:RelNum', mapE);

router.get('/mapF/:viagem/:id/:RelNum', mapF);

router.get('/path/:RelNum', path);

router.get('/quantity', quantity)//retorna o numero de relatórios existentes

////////////////////////
// PARTE DE FAVORITOS //
////////////////////////

const deleteFav = require('./fav/deleteFav')
const addFav = require('./fav/addFav')
const seeFav = require('./fav/seeFav')

const loggedIn = require('./login/loggedIn');

router.post("/addFav/:rel", loggedIn , addFav) // Adiciona um relatório aos favoritos

router.get("/seeFav", loggedIn ,seeFav) // Vizualiza os favoritos atuais.

router.delete('/deleteFav/:id', loggedIn, deleteFav) // Deleta o registro de favorito selecionado.

router.get('/download/:id', download)


///////////////////////
//  PARTE DE UPLOAD //
//////////////////////

router.post('/uploadRel', upload.single('file'), handleUpload)//upload de relatório(funciona, contudo demora um pouco para terminar de executar)(procurar uma forma de aparecer uma mensagem de sucesso, erro e de loading).

////////////////////////
//  CRUD COMENTARIO  //
///////////////////////

const comment_update = require('./comment_system_back/comment_update');
const comment_get = require('./comment_system_back/comment_get');
const comment_delete = require('./comment_system_back/comment_delete');
const comment_insert = require('./comment_system_back/comment_insert');

router.post("/comment_update", comment_update)
router.post("/comment_get", comment_get)
router.delete("/comment_delete", comment_delete)
router.post("/comment_insert", comment_insert)


module.exports = router;