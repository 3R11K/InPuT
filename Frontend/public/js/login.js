form.addEventListener('submit', () => {
    // Pegar os valores dos inputs e checkbox e envia para o backend
    fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({
            username: username.value,
            password: password.value,
            remember: true // remember.checked
        }),
        headers: {'Content-Type': 'application/json'}
    }).then((res) => {
        return res.json(); // Retorna o json da resposta
    }).then((json) => {
        // console.log(json);

        if (json.status == "success") { // Se o status for success
            window.location.href = "/"; // Redireciona para a página inicial
        } else {
            alert(json.text); // Se não, mostra o erro (ISSO VAI SER SUBSTITUIDO POR UMA TOAST DO BOOTSTRAP)
        }
    }).catch(err => {
        console.log(err); // Se der erro, mostra no console
    });

});