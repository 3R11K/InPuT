(() => {
    feather.replace({ 'aria-hidden': 'true' })
})()

window.onload = async function() {
    const user = await fetch('/api/get_user', {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
    }).then(response => {
        if (response.status == 200) {
            return response.json()
        } else {
            return null
        }
    }).then(json => {
        if (json != null) {
            return json['user']
        }
    })

    console.log(user)

    document.getElementById('signout').innerHTML = "Sair da Conta \n\"" + user.username + "\""
}

function newFav(a){
// Pega os favoritos do usuario
fetch (`/api/seeFav/`, {
    method: 'GET',
    headers: { "Content-Type": "application/json" }
}).then(response => {
    return response.json() // Transforma a resposta em json
}).then(json => {
        favs = json
        // Verifica se o relatorio já está nos favoritos
        for(i = 0; i < favs.length; i++){
            // console.log(favs[i].rel_num, a)
            if(favs[i].rel_num == a) { // Se o relatorio já estiver nos favoritos
                toast(1) // Chama o toast de erro
                return // Sai da função
            }
        }

        // Adiciona o relatorio aos favoritos
        fetch (`/api/addFav/${a}`, {
            method: 'POST'
        }).then(response =>{
            return response.json() // Transforma a resposta em json
        }).catch(console.error())

        let newLi = document.createElement("li")
        newLi.className = "nav-item"
        newLi.id = "fav_" + a

        // Cria o elemento div a classe d-flex nav-link justify-content-between remove_link_colour
        let newDiv = document.createElement("div")
        newDiv.className = "d-flex nav-link justify-content-between remove_link_colour"

        // Cria o elemento a com o link para o relatorio
        let newA = document.createElement("a")
        newA.href = "/reports/" + a

        // Cria o elemento span com o icone do feather
        let newSpan = document.createElement("span")
        newSpan.setAttribute("data-feather", "file-text");
        newSpan.className = "align-text-bottom me-1"
        newSpan.style = "margin-top: 2.5px"


        // Cria o elemento form com o botao de remover
        let newForm = document.createElement("form")
        newForm.setAttribute("onsubmit", `fetch('/api/deleteFav/${a}', { method: 'DELETE' }); document.getElementById("fav_" + ${a}).remove(); return false;`);

        // Cria o elemento button com o icone do feather
        let newButton = document.createElement("button")
        newButton.type = "submit"
        newButton.className = "border-0 px-0"
        newButton.style = "background-color: #f8f9fa;"

        // Cria o elemento span com o icone do feather
        let newSpan2 = document.createElement("span")
        newSpan2.setAttribute("data-feather", "minus-circle");
        newSpan2.className = "align-text-bottom ms-auto"
        newSpan2.style = "margin-top: 2.5px"

        // Adiciona o elemento newSpan e o texto "Relatório #a" ao elemento newA
        newA.appendChild(newSpan)
        newA.innerHTML += " Relatório #" + a + " "

        // Adiciona o elemento newSpan2 ao elemento newButton
        newButton.appendChild(newSpan2)
        newForm.appendChild(newButton)

        // Adiciona o elemento newA e o elemento newForm ao elemento newDiv
        newDiv.appendChild(newA)
        newDiv.appendChild(newForm)

        // Adiciona o elemento newDiv ao elemento newLi
        newLi.appendChild(newDiv)

        // Adiciona o elemento newLi ao elemento com o id "fav-bar"
        document.getElementById("fav-bar").appendChild(newLi)


        // Atualiza o feather
        feather.replace()
        toast(0)
    }).catch(console.error())
}

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

//função para download do relatório
function downloadZip(rel) {
    const zipUrl = "Rel.zip"; // Substitua pela URL real do arquivo ZIP

    fetch(`/api/download/${rel}`)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "Rel.zip"; // Nome do arquivo ZIP
        // a.style.display = "none";
        // document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        // document.body.removeChild(a);
      });
  }

async function relatorios(){
    // console.log("ola")
    // Pega os relatorios do usuario
    fetch('/api/quantity', {
        method: 'GET'
    }).then(response=>{
        return response.json() // Transforma a resposta em json
    }).then(json=>{
        var num = json // Salva os relatorios em uma variavel
        // console.log(json)

        // Para cada relatorio
        for(i = 0; i < num.length; i++){
            let rel = i+1;

            // Cria o elemento li com a classe "nav-item"
            var divElement = document.createElement('div');
            divElement.className = 'row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3';

            // Cria o elemento div com a classe "col"
            var colElement = document.createElement('div');
            colElement.className = 'col';

            // Cria o elemento div com a classe "card shadow-sm"
            var cardElement = document.createElement('div');
            cardElement.className = 'card shadow-sm';

            // Cria o elemento svg com os atributos necessários
            var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgElement.setAttribute('class', 'bd-placeholder-img card-img-top');
            svgElement.setAttribute('width', '100%');
            svgElement.setAttribute('height', '15');
            svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            svgElement.setAttribute('role', 'img');
            // svgElement.setAttribute('aria-label', 'Placeholder: Prévia do Mapa');
            svgElement.setAttribute('preserveAspectRatio', 'xMidYMid slice');
            svgElement.setAttribute('focusable', 'false');


            // Cria o elemento text dentro do svg
            var textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            textElement.setAttribute('x', '50%');
            textElement.setAttribute('y', '50%');
            textElement.setAttribute('fill', '#eceeef');
            textElement.setAttribute('dy', '.3em');

            // Adiciona o elemento rect e text como filhos do svg

            svgElement.appendChild(textElement);

            // Cria o elemento div com a classe "card-body"
            var cardBodyElement = document.createElement('div');
            cardBodyElement.className = 'card-body';

            // Cria o elemento h5 com o texto "Relatório #1"
            var h5Element = document.createElement('h5');
            h5Element.textContent = 'Relatório #' + rel;

            // Cria o elemento p com o texto do resumo do relatório
            var pElement = document.createElement('p');
            pElement.className = 'card-text';
            pElement.textContent = 'Este é o exemplo de um relatório. Aqui irá um breve resumo dos dados no relatório.';

            // Cria o elemento div com as classes "d-flex justify-content-between align-items-center"
            var divGroupElement = document.createElement('div');
            divGroupElement.className = 'd-flex justify-content-between align-items-center';

            // Cria o elemento div com a classe "btn-group"
            var btnGroupElement = document.createElement('div');
            btnGroupElement.className = 'btn-group';

            // Cria o elemento "a" com o atributo href="/reports/1" e o texto "Ver"
            var aElement = document.createElement('a');
            aElement.setAttribute('type', 'button');
            aElement.className = 'btn btn-sm btn-outline-secondary';
            aElement.href = '/reports/'+rel;
            aElement.textContent = 'Ver'

            // Cria o elemento button com o texto "Favoritar"
            var buttonElement = document.createElement('button');
            buttonElement.setAttribute('type', 'button');
            buttonElement.setAttribute('onclick', 'newFav(' + rel + ');');
            buttonElement.className = 'btn btn-sm btn-outline-secondary';
            buttonElement.textContent = 'Favoritar';

            // teste Cria o elemento button com o texto "Baixar"
            var buttElement = document.createElement('button');
            buttElement.setAttribute('type', 'button');
            buttElement.setAttribute('onclick', `downloadZip(${rel})`);
            buttElement.className = 'btn btn-sm btn-outline-secondary';
            buttElement.textContent = 'Baixar';

            // Adiciona o elemento "a" e o elemento button como filhos do div btnGroupElement
            btnGroupElement.appendChild(aElement);
            btnGroupElement.appendChild(buttonElement);
            btnGroupElement.appendChild(buttElement);

            // Adiciona o elemento btnGroupElement e o elemento smallElement como filhos do div divGroupElement
            divGroupElement.appendChild(btnGroupElement);
            // divGroupElement.appendChild(smallElement);

            // Adiciona o elemento h5Element, o elemento pElement, o elemento divGroupElement e o elemento svgElement como filhos do elemento cardBodyElement
            cardBodyElement.appendChild(h5Element);
            cardBodyElement.appendChild(pElement);
            cardBodyElement.appendChild(divGroupElement);

            // Adiciona o elemento svgElement e o elemento cardBodyElement como filhos do elemento cardElement
            cardElement.appendChild(svgElement);
            cardElement.appendChild(cardBodyElement);

            // Adiciona o elemento cardElement como filho do elemento colElement
            colElement.appendChild(cardElement);

            // Adiciona o elemento colElement como filho do elemento divElement
            divElement.appendChild(colElement);

            // Obtém o elemento pai onde você deseja adicionar os elementos
            var parentElement = document.getElementById('content-rels'); // Substitua 'id-do-elemento-pai' pelo ID correto do elemento pai

            // Adiciona o elemento divElement como filho do elemento pai
            parentElement.appendChild(divElement);
        }
    })
}

async function seeFav(){

    // Pega os dados do relatório
    fetch('/api/seeFav', {
        method: 'GET'
    }).then(response =>{
        return response.json() // Transforma a resposta em JSON
    }).then(json=>{
        var data = json

        // Para cada relatório, cria um card
        for (i = 0; i < data.length; i++){
            let rel = data[i].rel_num;

            // Cria o elemento div com as classes "row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3"
            var divElement = document.createElement('div');
            divElement.className = 'row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3';

            // Cria o elemento div com a classe "col"
            var colElement = document.createElement('div');
            colElement.className = 'col';

            // Cria o elemento div com a classe "card shadow-sm"
            var cardElement = document.createElement('div');
            cardElement.className = 'card shadow-sm';

            // Cria o elemento svg com os atributos necessários
            var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgElement.setAttribute('class', 'bd-placeholder-img card-img-top');
            svgElement.setAttribute('width', '100%');
            svgElement.setAttribute('height', '15');
            svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            svgElement.setAttribute('role', 'img');
            // svgElement.setAttribute('aria-label', 'Placeholder: Prévia do Mapa');
            svgElement.setAttribute('preserveAspectRatio', 'xMidYMid slice');
            svgElement.setAttribute('focusable', 'false');

            // Cria o elemento rect dentro do svg
            var rectElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rectElement.setAttribute('width', '100%');
            rectElement.setAttribute('height', '100%');
            rectElement.setAttribute('fill', '#fff');

            // Cria o elemento text dentro do svg
            var textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            textElement.setAttribute('x', '50%');
            textElement.setAttribute('y', '50%');
            textElement.setAttribute('fill', '#eceeef');
            textElement.setAttribute('dy', '.3em');
            // textElement.textContent = 'Prévia do Mapa';

            // Adiciona o elemento rect e text como filhos do svg
            svgElement.appendChild(rectElement);
            svgElement.appendChild(textElement);

            // Cria o elemento div com a classe "card-body"
            var cardBodyElement = document.createElement('div');
            cardBodyElement.className = 'card-body';

            // Cria o elemento h5 com o texto "Relatório #1"
            var h5Element = document.createElement('h5');
            h5Element.textContent = 'Relatório #' + rel;

            // Cria o elemento p com o texto do resumo do relatório
            var pElement = document.createElement('p');
            pElement.className = 'card-text';
            pElement.textContent = 'Este é o exemplo de um relatório. Aqui irá um breve resumo dos dados no relatório.';

            // Cria o elemento div com as classes "d-flex justify-content-between align-items-center"
            var divGroupElement = document.createElement('div');
            divGroupElement.className = 'd-flex justify-content-between align-items-center';

            // Cria o elemento div com a classe "btn-group"
            var btnGroupElement = document.createElement('div');
            btnGroupElement.className = 'btn-group';

            // Cria o elemento "a" com o atributo href="/reports/1" e o texto "Ver"
            var aElement = document.createElement('a');
            aElement.setAttribute('type', 'button');
            aElement.className = 'btn btn-sm btn-outline-secondary';
            aElement.href = '/reports/'+rel;
            aElement.textContent = 'Ver'



            // // Cria o elemento small com o texto "Data do Relatório"
            // var smallElement = document.createElement('small');
            // smallElement.className = 'text-body-secondary';
            // smallElement.textContent = 'Data do Relatório';

            // Adiciona o elemento "a" e o elemento button como filhos do div btnGroupElement
            btnGroupElement.appendChild(aElement);

            // Adiciona o elemento btnGroupElement e o elemento smallElement como filhos do div divGroupElement
            divGroupElement.appendChild(btnGroupElement);
            // divGroupElement.appendChild(smallElement);

            // Adiciona o elemento h5Element, o elemento pElement, o elemento divGroupElement e o elemento svgElement como filhos do elemento cardBodyElement
            cardBodyElement.appendChild(h5Element);
            cardBodyElement.appendChild(pElement);
            cardBodyElement.appendChild(divGroupElement);

            // Adiciona o elemento svgElement e o elemento cardBodyElement como filhos do elemento cardElement
            cardElement.appendChild(svgElement);
            cardElement.appendChild(cardBodyElement);

            // Adiciona o elemento cardElement como filho do elemento colElement
            colElement.appendChild(cardElement);

            // Adiciona o elemento colElement como filho do elemento divElement
            divElement.appendChild(colElement);

            // Obtém o elemento pai onde você deseja adicionar os elementos
            var parentElement = document.getElementById('content-rels'); // Substitua 'id-do-elemento-pai' pelo ID correto do elemento pai

            // Adiciona o elemento divElement como filho do elemento pai
            parentElement.appendChild(divElement);
        }
    })
}
