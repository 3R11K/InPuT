// Conecta com o banco de dados
const sqlite3 = require('sqlite3').verbose();

function db(db_name = "Banco de dados.db") {
    const db_path = require('path').resolve(__dirname, `../databases/${db_name}`);

    return new sqlite3.Database(db_path, (err) => {
        if (err) {
            console.error(err.message);
            throw err
        } else {
            console.log("Conectado à DB");
        }
    });
}

function db_close(db) {
    db.close((err) => {
        if (err) {
            console.error(err.message);
            throw err
        } else {
            console.log("Desconectado da DB");
        }
    });
}

module.exports = {
    db: db,
    db_close: db_close
}