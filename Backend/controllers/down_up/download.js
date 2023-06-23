const path = require("path")
//função para baixar o arquivo zip
function download(req,res){
    const Num = req.params.id;

    //caminho do arquivo zip(num é o numero do relatorio)
    const filePath = path.join('./','Backend', 'archives', "Rel"+Num, "Rel.zip");
	// console.log(filePath)

    // baixando o arquivo
    res.download(filePath, (err) => {
        if (err) {
        // Trate os erros adequados aqui
        res.status(404).send('Arquivo não encontrado');
    }
  });
}

module.exports = download