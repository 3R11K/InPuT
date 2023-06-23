const DB_PATH = require('path').resolve(__dirname, '../../routes/db-config.js')

const express = require('express');
const XLSX = require('xlsx-populate');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const bodyParser = require('body-parser');

//pasta padrão para salvar os arquivos, porem depois são movidos para a pasta archives
fs.mkdirSync('uploads', { recursive: true });
const app = express()

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const multer = require('multer');
const { create } = require('domain');
const upload = multer({ dest: 'uploads/' });//destino dos arquivos

//ednpoint para receber os arquivos
async function handleUpload(req, res){
	console.log("Receiving files...")

	//verifica se o arquivo foi enviado
	if (!req.file) {
		res.status(400).send("No files here");
		return;
	}

	let archives = undefined

	//verifica se a pasta archives existe, se não existir, cria uma nova
	try {
		archives = fs.readdirSync(path.join(__dirname, "../", "../", "archives"));
	} catch (err) {
		fs.mkdirSync(path.join(__dirname, "../", "../", "archives"));
		archives = fs.readdirSync(path.join(__dirname, "../", "../", "archives"));
	}

	//verifica o numero de arquivos na pasta archives e cria uma nova pasta com o nome "Rel" + o numero de arquivos + 1
	const archivesLength = archives.length + 1;
	var folderName = `Rel${archivesLength}`;

	fs.mkdirSync(path.join(__dirname, "../", "../", "archives", folderName));

	//move o arquivo para a pasta archives
	const zip_rel = req.file
	console.log(`File Recieved: ${zip_rel.originalname}`)
	fs.renameSync(path.join(__dirname, "../", "../", "../","uploads", zip_rel.filename), path.join(__dirname, "../", "../", "archives", folderName, zip_rel.originalname), function (err) {
		if (err) {
			console.log(err)
			res.send("0");
		} else {
			console.log("File Renamed")
		}
	});

	
	const fileName = zip_rel.originalname;
	const filePath = path.join(__dirname, "../", "../", "archives", folderName, fileName);

	//caminho para extrair o arquivo zipado
	const extractPath = path.join(__dirname, "../", "../", "archives", folderName);

	//extrai o arquivo zipado
	try {
		await extractFile(filePath, extractPath);
	} catch (err) {
		res.send("0");
	}

	//procura todos os arquivos na pasta que contem "Viagem" no nome
	// searches for all files in the folder that contain "Viagem" in the name
	const files = fs.readdirSync(path.join(extractPath, "Rel")).filter(file => file.includes("Viagem"));
	const numeroViagens = files.length;
	console.log(numeroViagens)

	//para cada arquivo encontrado, procura os arquivos de choque e pico e chama as funções para extrair os dados, apos isso cria a database e insere os dados necessarios
	for (let i=0; i < numeroViagens; i++) {
		//checar se database ja existe
		if(fs.existsSync(path.join(__dirname,"../", "../", "databases", folderName + ".db"))){
			console.log("Database already exists")
		}
		//se a database não existir na pasta databases, cria-se uma nova a partir do numero do relatorio
		else if(!fs.existsSync(path.join(__dirname,"../", "../", "databases", folderName + ".db"))){
			console.log("Creating database...")

			await createDataBase(folderName);
			console.log("Passou createDataBase")
		}

		let file = files[i];

		//Procurando arquivo de ocorrências

		try {
			let pathChoque1 = path.join(extractPath, "Rel", file, "E", "Choque1", "Choque1.xlsx");
			console.log("Arquivo de ocorrências encontrado") 
			//se o arquivo for encontrado, chama a função dadosChoque
			await dadosChoque(pathChoque1, i+1, folderName, "1", "E");
			console.log("Passou dadosChoque")
		}
		catch(ignored){
			//se o arquivo não for encontrado, mostra o erro, mas continua o programa
			console.log("erro: "+ err)
		}

		try{
			let pathChoque2 = path.join(extractPath, "Rel", file, "E", "Choque2", "Choque2.xlsx");
			//se o arquivo for encontrado, chama a função dadosChoque
			console.log("Arquivo de ocorrências encontrado")
			await dadosChoque(pathChoque2, i+1, folderName, "2", "E");
			console.log("Passou dadosChoque2")
		}
		catch(ignored){
			//se o arquivo não for encontrado, mostra o erro, mas continua o programa
			console.log("arquivo não encontrado  " + err)
		}

		try{
			console.log(extractPath)
			let pathPico = path.join(extractPath, "Rel", file, "E", "Pico", "Pico.xlsx");
			//se o arquivo for encontrado, chama a função dadosChoque
			console.log("Arquivo de ocorrências encontrado")
			await dadosPico(pathPico, i+1, folderName, "E");
		} catch(ignored){
			//se o arquivo não for encontrado, mostra o erro, mas continua o programa
			console.log("arquivo não encontrado")
		}
		
		try{
			let pathChoque = path.join(extractPath, "Rel", file, "F", "Choque1", "Choque1.xlsx");
			//se o arquivo for encontrado, chama a função dadosChoque
			console.log("Arquivo de ocorrências encontrado")
			await dadosChoque(pathChoque, i+1, folderName, "1", "F");
			console.log("Passou dadosChoque3")
		}
		catch(ignored){
			//se o arquivo não for encontrado, mostra o erro, mas continua o programa	
			console.log("arquivo não encontrado")
		}

		try{
			let pathChoque = path.join(extractPath, "Rel", file, "F", "Choque2", "Choque2.xlsx");;
			//se o arquivo for encontrado, chama a função dadosChoque
			console.log("Arquivo de ocorrências encontrado")
			await dadosChoque(pathChoque, i+1, folderName, "2", "F");
			console.log("Passou dadosChoque4")
		}
		catch(ignored){
			//se o arquivo não for encontrado, mostra o erro, mas continua o programa
			console.log("arquivo não encontrado")
		}

		try{
			let pathPico = path.join(extractPath, "Rel", file, "F", "Pico", "Pico.xlsx");
			//se o arquivo for encontrado, chama a função dadosChoque
			console.log("Arquivo de ocorrências encontrado")
			await dadosPico(pathPico, i+1, folderName, "F");
		}
		catch(ignored){
			//se o arquivo não for encontrado, mostra o erro, mas continua o programa
			console.log("arquivo não encontrado")
		}
	}

	const db = require(DB_PATH).db("Rels.db");
	//inserindo dados na tabela de relatorios
	await new Promise((resolve, reject) => {
		db.run(`INSERT INTO Relatorios(relatorios) VALUES (${archivesLength})`, (err) => {
			if (err) {
				res.send("0");
				reject(err);
				return;
			}
			resolve();
		})
	})
	
	res.send("1")
}

//função para extrair o arquivo zipado usando a biblioteca adm-zip
async function extractFile(filePath, extractPath) {
	await new Promise((resolve, reject) => {
		const zip = new AdmZip(filePath);
		zip.extractAllTo(extractPath);
		console.log('File extracted');
		resolve();
	});
}
// criando banco de dados se ele não existir(função chamada apenas se a database não existir conforme o nome Rel(n))
async function createDataBase(folderName) {
	console.log("passou")
	await new Promise((resolve, reject) => {
		console.log("passou2")
		const db = require(DB_PATH).db(folderName + ".db", (err) => {
			if (err) {
				console.error(err.message);
				reject(err);
				return;
			}
		});
		
		console.log('Connected to database');

		db.run(`CREATE TABLE IF NOT EXISTS "OCORRENCIA" (
			"ID_OC" INTEGER,
			"tipo_oc" NOT NULL,
			"tipo_vagao"NOT NULL,
			"viagem" INTEGER NOT NULL,
			"data_hora" NOT NULL,
			"lat" NUMERIC NOT NULL,
			"lon" NUMERIC NOT NULL,
			"trecho" TEXT NOT NULL,
			"pos" TEXT NOT NULL,
			"pv" TEXT NOT NULL,
			PRIMARY KEY("ID_OC" AUTOINCREMENT)
		);`);

		db.run(`CREATE TABLE IF NOT EXISTS "PICO" (
			"ID_OC" INTEGER,
			"ID" INTEGER,
			"vel" NOT NULL,
			"engate" NOT NULL,
			"delta_t" NOT NULL,
			"act" NOT NULL,
			"peg_psi" NOT NULL,
			PRIMARY KEY("ID" AUTOINCREMENT),
			FOREIGN KEY("ID_OC") REFERENCES "OCORRENCIA"("ID_OC")
		);`);

		db.run(`CREATE TABLE IF NOT EXISTS "CHOQUE" (
			"ID_OC" INTEGER,
			"ID" INTEGER,
			"tipo_choque" NOT NULL,
			"peg_psi" NOT NULL,
			"act" NOT NULL,
			"f_max" NOT NULL,
			"vel" NOT NULL,
			PRIMARY KEY("ID" AUTOINCREMENT),
			FOREIGN KEY("ID_OC") REFERENCES "OCORRENCIA"("ID_OC")
		);`);


		db.close();
		console.log("Database created.")
		resolve();
		console.log("resolved.")
	});
}

//inserir choques no banco de dados
async function dadosChoque(pathChoque, viagem, folderName,tipo_choque, vagao) {
	console.log("passou choque")

	await new Promise(async (resolve, reject) => {
		try{
		//informações que iremos pegar da tabela
		let dataBefore = []
		let lat = []
		let lon = []
		let vel = []
		let pos = []
		let pv = []
		let trecho = []
		let fmax = []
		let act = []
		let peg = []
		//pegando dados do arquivo de xlsx de choque

		const workbook = await XLSX.fromFileAsync(pathChoque);
		
		const sheet = workbook.sheet(0);
		//range da tabela
		const numRows = sheet.usedRange().endCell().rowNumber();

		//função para salvar os dados em arrays para então inserilos no banco de dados
		await pushRowCellData(dataBefore, "A", numRows, sheet);
		await pushRowCellData(lat, "B", numRows, sheet);
		await pushRowCellData(lon, "C", numRows, sheet);
		await pushRowCellData(vel, "D", numRows, sheet);
		await pushRowCellData(pos, "E", numRows, sheet);
		await pushRowCellData(pv, "F", numRows, sheet);
		await pushRowCellData(trecho, "G", numRows, sheet);
		await pushRowCellData(fmax, "H", numRows, sheet);
		await pushRowCellData(act, "I", numRows, sheet);
		await pushRowCellData(peg, "J", numRows, sheet);


		//retirando os 3 ultimos digitos(foi informado que esses não eram relativos a data)
		let data = dataBefore.map((data) => {
			return data.toString().slice(0, -3);
		});

		//chamando função que insere o choque e levando junto todos os argumentos necessarios para a inserção de dados
		await inserirChoque(tipo_choque ,data, lat, lon, vel, pos, pv, trecho, fmax, act, peg, vagao, "C", viagem, folderName);

		resolve();
	}catch(err){
		console.log(err)
		reject(err)
	}
	});
}

//inserir picos no banco de dados
async function dadosPico(pathPico, viagem, folderName, vagao) {
	await new Promise(async (resolve, reject) => {
		try{
			//informações que iremos pegar da tabela
			let dataBefore = []
			let lat = []
			let lon = []
			let vel = []
			let pos = []
			let pv = []
			let trecho = []
			let engate = []
			let delta_t = []
			let act = []
			let peg = []
			//pegando dados do arquivo de xlsx de choque
			const workbook = await XLSX.fromFileAsync(pathPico);
			const sheet = workbook.sheet(0);
			//range da tabela
			const numRows = sheet.usedRange().endCell().rowNumber();

			await pushRowCellData(dataBefore, "A", numRows, sheet);
			await pushRowCellData(lat, "B", numRows, sheet);
			await pushRowCellData(lon, "C", numRows, sheet);
			await pushRowCellData(vel, "D", numRows, sheet);
			await pushRowCellData(pos, "E", numRows, sheet);
			await pushRowCellData(pv, "F", numRows, sheet);
			await pushRowCellData(trecho, "G", numRows, sheet);
			await pushRowCellData(engate, "H", numRows, sheet);
			await pushRowCellData(delta_t, "I", numRows, sheet);
			await pushRowCellData(act, "J", numRows, sheet);
			await pushRowCellData(peg, "K", numRows, sheet);

			//retirando os 3 ultimos digitos(foi informado que esses não eram relativos a data)
			let data = dataBefore.map((data) => {
				return data.toString().slice(0, -3);
			});

			// console.log(data.length)
			//chamando função que insere o choque e levando junto todos os argumentos necessarios para a inserção de dados
			await insertPico(data, lat, lon, vel, pos, pv, trecho, engate, delta_t, act, peg, vagao, "P", viagem, folderName);

			resolve();
		}catch(err){
			console.log(err)
			reject(err)
		}
	});

}

//inserir choque no banco de dados(começando pela tabela de ocorrencias)
async function inserirChoque(tipo_choque, data, lat, lon, vel, pos, pv, trecho, fmax, act, peg, vagao, ocorrencia, viagem, folderName) {
	const db = require(DB_PATH).db(folderName + ".db");
  
	let index = 0;
	//tamanho da tabela de ocorrencias para inserção correta de id_oc
	await new Promise((resolve, reject) => {
	  db.all(`SELECT * FROM OCORRENCIA`, (err, rows) => {
		if (err) {
		  reject(err);
		  return;
		}
		index  += rows.length;
		// console.log("index: " + index);
		resolve();
	  });
	});
  
	//inserindo dados a partir do tamanho da aray data
	for (let i = 0; i < data.length; i++) {
	  try {
		await new Promise((resolve, reject) => {
		  db.run(
			`INSERT INTO OCORRENCIA ("tipo_oc", "tipo_vagao", "viagem", "data_hora", "lat", "lon", "trecho", "pos", "pv") VALUES ("C", "${vagao}", ${viagem}, "${data[i]}", "${lat[i]}", "${lon[i]}", "${trecho[i]}", "${pos[i]}", "${pv[i]}")`,
			(err) => {
			  if (err) {
				reject(err);
				return;
			  }
			  index += 1;
			  resolve();
			}
		  );
		});
		// inserindo choques na database
		await new Promise((resolve, reject) => {
		  db.run(
			`INSERT INTO CHOQUE ("ID_OC", "tipo_choque", "peg_psi", "act", "f_max", "vel") VALUES (${index}, "${tipo_choque}",'${peg[i]}', '${act[i]}', '${fmax[i]}', '${vel[i]}')`,
			(err) => {
			  if (err) {
				// console.log("choque")
				reject(err);
				return;
			  }
			  resolve();
			}
		  );
		});
	  } catch (err) {
		console.error(err);
	  }
	}
	
	db.close();
}

//inserir pico no banco de dados(começando pela tabela de ocorrencias)
async function insertPico(data, lat, lon, vel, pos, pv, trecho, engate, delta_t, act, peg, vagao, ocorrencia, viagem, folderName) {
	const db = require(DB_PATH).db(folderName + ".db");
  
	let index = 0;

	//tamanho da tabela de ocorrencias para inserção correta de id_oc
	await new Promise((resolve, reject) => {
	  db.all(`SELECT * FROM OCORRENCIA`, (err, rows) => {
		if (err) {
		  reject(err);
		  return;
		}
		index  += rows.length;
		// console.log("index: " + index);
		resolve();
	  });
	});

	//inserindo dados a partir do tamanho da array data
	for (let i = 0; i < data.length; i++) {
	  try {
		await new Promise((resolve, reject) => {
		  db.run(
			`INSERT INTO OCORRENCIA ("tipo_oc", "tipo_vagao", "viagem", "data_hora", "lat", "lon", "trecho", "pos", "pv") VALUES ("P", "${vagao}", ${viagem}, "${data[i]}", "${lat[i]}", "${lon[i]}", "${trecho[i]}", "${pos[i]}", "${pv[i]}")`,
			(err) => {
			  if (err) {
				reject(err);
				return;
			  }
			  index += 1;
			  resolve();
			}
		  );
		});
		// inserindo picos na database
		await new Promise((resolve, reject) => {
		  db.run(
			`INSERT INTO PICO ("ID_OC", "peg_psi", "act", "engate", "vel", "delta_t") VALUES (${index}, '${peg[i]}', '${act[i]}', '${engate[i]}', '${vel[i]}', "${delta_t[i]}")`,
			(err) => {
			  if (err) {
				reject(err);
				return;
			  }
			  resolve();
			}
		  );
		});
	  } catch (err) {
		console.error(err);
	  }
	}
	
	db.close();
}

//salvando dados nas arrays
async function pushRowCellData(array, cell, numRows, sheet) {
	await new Promise((resolve, reject) => {
		for (let row = 2; row <= numRows; row++) {
			const value = sheet.cell(cell + row).value();
			if (value === NaN || value === undefined) {
				array.push("Valo não informado");
			} else {
				array.push(value);
			}
		}
		resolve(array);
	});
}

module.exports = handleUpload;