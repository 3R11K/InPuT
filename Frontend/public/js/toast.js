function toast(success){

    // Se o relatório já foi adicionado
    if(success === 1){
        // Barrinha de carregamento
        let progress = document.createElement('div');
        progress.id = "progress"
        // Criando o toast
        let toast = document.createElement('div');
        toast.id = "erro"
        toast.innerHTML = "Esse relatório já foi favoritado."
        // Adicionando a barrinha de carregamento no toast
        toast.appendChild(progress);
        // Colocando o toast na tela
        document.getElementsByTagName("main")[0].appendChild(toast);
        // Timer
        setTimeout(function() {
            toast = document.getElementById("erro")
            toast.remove()
          }, 3000);

    }

    // Se o relatório ainda não foi adicionado
    else if(success === 0){
        // Barrinha de carregamento
        let progress = document.createElement('div');
        progress.id = "progress"
        // Criando o toast
        let toast = document.createElement('div');
        toast.id = "sucesso"
        toast.innerHTML = "Relatório adicionado aos favoritos!"
        // Adicionando a barrinha de carregamento no toast dentro de uma div
        toast.appendChild(progress);

        // Colocando o toast na tela
        document.getElementsByTagName("main")[0].appendChild(toast);
        // Timer
         setTimeout(function() {
             toast = document.getElementById("sucesso")
             toast.remove()
           }, 3000);

    };

}