const cookie = require('cookie-parser'); // Importa o cookie-parser

// função para deslogar
const logout = (req, res) => {
    // Limpa o cookie de login
    res.clearCookie('remember-login');
    // Redireciona para a página de login
    res.redirect('/login');
}

// exportando função
module.exports = logout;