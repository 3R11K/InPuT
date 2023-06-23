// Funcao que roda quando a pagina é carregada
(() => {
    const relatorio = window.location.href.split("/").pop();

    console.log("insert-favs.js loaded")

    // Pega os favoritos do usuario
    fetch("/api/seeFav", {
        method: "GET",
        headers: { "Content-Type": "application/json" }

    }).then(response => {
        return response.json() // Transforma a resposta em JSON
    }).then(json => {
        // console.log(json)

        json.forEach(item => {
            // Cria um novo li com a classe nav-item e id fav_{rel_num}
            let newLi = document.createElement("li")
            newLi.className = "nav-item"
            newLi.id = "fav_" + item.rel_num

            // Cria um novo div com a classe d-flex nav-link justify-content-between remove_link_colour
            let newDiv = document.createElement("div")
            newDiv.className = "d-flex nav-link justify-content-between remove_link_colour"
            if (item.rel_num == relatorio) {
                // adiciona a classe "active"
                newDiv.className += " active"
            }

            // Cria um novo a com o href para o relatorio
            let newA = document.createElement("a")
            newA.href = "/reports/" + item.rel_num

            // Cria um novo span com o icone de relatorio
            let newSpan = document.createElement("span")
            newSpan.setAttribute("data-feather", "file-text");
            newSpan.className = "align-text-bottom me-1"
            newSpan.style = "margin-top: 2.5px"


            // Cria um novo form com o metodo delete para deletar o favorito
            let newForm = document.createElement("form")
            newForm.setAttribute("onsubmit", `fetch('/api/deleteFav/${item.rel_num}', { method: 'DELETE' }); document.getElementById("fav_" + ${item.rel_num}).remove(); return false;`);

            // Cria um novo button com o tipo submit e classe border-0 px-0
            let newButton = document.createElement("button")
            newButton.type = "submit"
            newButton.className = "border-0 px-0"
            newButton.style = "background-color: #f8f9fa;"

            // Cria um novo span com o icone de deletar
            let newSpan2 = document.createElement("span")
            newSpan2.setAttribute("data-feather", "minus-circle");
            newSpan2.className = "align-text-bottom ms-auto"
            newSpan2.style = "margin-top: 2.5px"

            // Adiciona o newSpan e texto ao newA
            newA.appendChild(newSpan)
            newA.innerHTML += " Relatório #" + item.rel_num + " "

            // Adiciona o newSpan2 ao newButton
            newButton.appendChild(newSpan2)
            newForm.appendChild(newButton)

            // Adiciona o newA e newForm ao newDiv
            newDiv.appendChild(newA)
            newDiv.appendChild(newForm)

            // Adiciona o newDiv ao newLi
            newLi.appendChild(newDiv)

            // Adiciona o newLi ao fav-bar
            document.getElementById("fav-bar").appendChild(newLi)
        })

        // Atualiza os icones
        feather.replace()
    }).catch(err => {
        console.log(err) // Imprime o erro no console
    })

})();